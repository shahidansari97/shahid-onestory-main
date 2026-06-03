/**
 * Cross-browser compatibility (Chrome, Firefox, Safari, Edge, iOS/Android).
 * Load synchronously in <head> before the Vite bundle.
 */
(function (global) {
    'use strict';

    function emptyBrands() {
        return [];
    }

    function buildUserAgentData() {
        var nav = global.navigator;
        var ua = (nav && nav.userAgent) || '';
        return {
            brands: emptyBrands(),
            mobile: /iPhone|iPad|iPod|Android|Mobile/i.test(ua),
            platform: (nav && nav.platform) || '',
            getHighEntropyValues: function () {
                return Promise.resolve({});
            },
        };
    }

    function brandsIsUsable(brands) {
        return brands && typeof brands.some === 'function';
    }

    /** Headless UI / React Aria — safe on all engines (Chrome, Safari, Firefox, Edge). */
    function ensureUserAgentData() {
        if (typeof global.navigator === 'undefined') {
            return;
        }

        var nav = global.navigator;
        var existing = nav.userAgentData;

        if (existing && brandsIsUsable(existing.brands)) {
            if (typeof existing.getHighEntropyValues !== 'function') {
                try {
                    existing.getHighEntropyValues = function () {
                        return Promise.resolve({});
                    };
                } catch (e1) {
                    /* frozen */
                }
            }
            return;
        }

        if (existing && !brandsIsUsable(existing.brands)) {
            try {
                Object.defineProperty(existing, 'brands', {
                    value: emptyBrands(),
                    configurable: true,
                });
                if (typeof existing.getHighEntropyValues !== 'function') {
                    Object.defineProperty(existing, 'getHighEntropyValues', {
                        value: function () {
                            return Promise.resolve({});
                        },
                        configurable: true,
                    });
                }
                return;
            } catch (e2) {
                /* replace whole object */
            }
        }

        try {
            Object.defineProperty(nav, 'userAgentData', {
                value: buildUserAgentData(),
                configurable: true,
            });
        } catch (e3) {
            try {
                nav.userAgentData = buildUserAgentData();
            } catch (e4) {
                /* ignore */
            }
        }
    }

    function ensureRequestIdleCallback() {
        if (typeof global.requestIdleCallback === 'function') {
            return;
        }
        global.requestIdleCallback = function (cb, options) {
            var timeout = (options && options.timeout) || 1;
            return global.setTimeout(function () {
                cb({
                    didTimeout: false,
                    timeRemaining: function () {
                        return 50;
                    },
                });
            }, timeout);
        };
        global.cancelIdleCallback = function (id) {
            global.clearTimeout(id);
        };
    }

    /** globalThis — older embedded WebViews */
    function ensureGlobalThis() {
        if (typeof global.globalThis !== 'undefined') {
            return;
        }
        try {
            Object.defineProperty(global, 'globalThis', {
                value: global,
                configurable: true,
                writable: true,
            });
        } catch (e) {
            global.globalThis = global;
        }
    }

    /**
     * Safe storage wrapper (private mode / strict settings in any browser).
     * Usage: window.safeStorage.getItem('key')
     */
    function ensureSafeStorage() {
        if (global.safeStorage) {
            return;
        }

        function canUse(storage) {
            if (!storage) {
                return false;
            }
            try {
                var key = '__storage_test__';
                storage.setItem(key, '1');
                storage.removeItem(key);
                return true;
            } catch (e) {
                return false;
            }
        }

        var localOk = canUse(global.localStorage);
        var sessionOk = canUse(global.sessionStorage);
        var memory = {};

        global.safeStorage = {
            local: {
                getItem: function (key) {
                    if (localOk) {
                        try {
                            return global.localStorage.getItem(key);
                        } catch (e) {
                            return memory['l:' + key] || null;
                        }
                    }
                    return memory['l:' + key] || null;
                },
                setItem: function (key, value) {
                    if (localOk) {
                        try {
                            global.localStorage.setItem(key, value);
                            return;
                        } catch (e) {
                            /* fall through */
                        }
                    }
                    memory['l:' + key] = String(value);
                },
                removeItem: function (key) {
                    if (localOk) {
                        try {
                            global.localStorage.removeItem(key);
                        } catch (e) {
                            /* ignore */
                        }
                    }
                    delete memory['l:' + key];
                },
            },
            session: {
                getItem: function (key) {
                    if (sessionOk) {
                        try {
                            return global.sessionStorage.getItem(key);
                        } catch (e) {
                            return memory['s:' + key] || null;
                        }
                    }
                    return memory['s:' + key] || null;
                },
                setItem: function (key, value) {
                    if (sessionOk) {
                        try {
                            global.sessionStorage.setItem(key, value);
                            return;
                        } catch (e) {
                            /* fall through */
                        }
                    }
                    memory['s:' + key] = String(value);
                },
                removeItem: function (key) {
                    if (sessionOk) {
                        try {
                            global.sessionStorage.removeItem(key);
                        } catch (e) {
                            /* ignore */
                        }
                    }
                    delete memory['s:' + key];
                },
            },
        };
    }

    function runAll() {
        ensureGlobalThis();
        ensureUserAgentData();
        ensureRequestIdleCallback();
        ensureSafeStorage();
    }

    runAll();

    global.__ensureBrowserCompat = runAll;
    global.__ensureWebKitCompat = runAll;
})(typeof window !== 'undefined' ? window : this);
