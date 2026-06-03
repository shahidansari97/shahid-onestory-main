<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'OneStoryPlanet') }}</title>
    <link href="{{ asset('favicon-v2.png') }}" rel="icon">
    {{-- Cross-browser: inline so it works even if public/js/browser-compat.js is not deployed yet --}}
    <script>
        (function (g) {
            if (typeof g.navigator === 'undefined') return;
            var ua = g.navigator.userAgentData;
            if (ua && ua.brands && typeof ua.brands.some === 'function') return;
            try {
                Object.defineProperty(g.navigator, 'userAgentData', {
                    value: {
                        brands: [],
                        mobile: /iPhone|iPad|iPod|Android|Mobile/i.test(g.navigator.userAgent || ''),
                        platform: g.navigator.platform || '',
                        getHighEntropyValues: function () { return Promise.resolve({}); }
                    },
                    configurable: true
                });
            } catch (e) {}
            if (typeof g.requestIdleCallback !== 'function') {
                g.requestIdleCallback = function (cb) {
                    return g.setTimeout(function () {
                        cb({ didTimeout: false, timeRemaining: function () { return 50; } });
                    }, 1);
                };
                g.cancelIdleCallback = function (id) { g.clearTimeout(id); };
            }
        })(window);
    </script>
    <script src="{{ asset('js/browser-compat.js') }}" onerror="void 0"></script>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
    <link
        rel="preload"
        href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap"
        as="style"
        onload="this.onload=null;this.rel='stylesheet'"
    />
    <noscript>
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    </noscript>
    <script>
        window.siteSettings = @json(
            inertia()->getShared('siteSettings') ?? [],
            JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT
        );
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap"
        as="style"
        onload="this.onload=null;this.rel='stylesheet'"
    >
    <noscript>
        <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    </noscript>
    @if (app()->environment('production'))
        <script>
            (function () {
                var ENABLE_GTM = {{ filter_var(env('ENABLE_GTM', true), FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false' }};
                var ENABLE_CONTENTSQUARE = {{ filter_var(env('ENABLE_CONTENTSQUARE', false), FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false' }};
                var gtmLoaded = false;
                var contentSquareLoaded = false;

                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

                window.dataLayer.push({
                    event: 'default_consent_set',
                    ad_storage: 'denied',
                    analytics_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied'
                });

                function appendScript(src) {
                    var script = document.createElement('script');
                    script.src = src;
                    script.async = true;
                    script.defer = true;
                    document.head.appendChild(script);
                }

                function loadGTM() {
                    if (!ENABLE_GTM || gtmLoaded) return;
                    gtmLoaded = true;
                    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                    appendScript('https://www.googletagmanager.com/gtm.js?id=GTM-WLS7GMSH');
                }

                function loadContentSquare() {
                    if (!ENABLE_CONTENTSQUARE || contentSquareLoaded) return;
                    contentSquareLoaded = true;
                    appendScript('https://t.contentsquare.net/uxa/74f697dae5a06.js');
                }

                function loadNonCriticalAnalytics() {
                    loadGTM();
                    if ('requestIdleCallback' in window) {
                        window.requestIdleCallback(loadContentSquare, { timeout: 4500 });
                    } else {
                        setTimeout(loadContentSquare, 4500);
                    }
                }

                function onFirstInteraction() {
                    loadNonCriticalAnalytics();
                    window.removeEventListener('pointerdown', onFirstInteraction);
                    window.removeEventListener('keydown', onFirstInteraction);
                    window.removeEventListener('touchstart', onFirstInteraction);
                    window.removeEventListener('scroll', onFirstInteraction);
                }

                window.addEventListener('pointerdown', onFirstInteraction, { once: true, passive: true });
                window.addEventListener('keydown', onFirstInteraction, { once: true, passive: true });
                window.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
                window.addEventListener('scroll', onFirstInteraction, { once: true, passive: true });

                window.addEventListener('load', function () {
                    setTimeout(loadNonCriticalAnalytics, 12000);
                }, { once: true });
            })();
        </script>
    @endif
    <!-- React Fast Refresh shims (no-ops when fastRefresh is disabled in Vite) -->
    <script>
        var $RefreshSig$ = function() { return function() {}; };
        var $RefreshReg$ = function() {};
    </script>
    <!-- Scripts -->
    @routes
    @if (app()->environment('local'))
        @viteReactRefresh
    @endif
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    @inertiaHead
</head>
<body class="font-sans antialiased">
@if (app()->environment('production') && filter_var(env('ENABLE_GTM', true), FILTER_VALIDATE_BOOLEAN))
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WLS7GMSH"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
@endif
@inertia
</body>
</html>
