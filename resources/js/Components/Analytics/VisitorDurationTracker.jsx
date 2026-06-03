import { useEffect, useRef } from 'react';

const HEARTBEAT_MS = 15000;

const toSafeUrl = () => {
    try {
        const parsed = new URL(window.location.href);
        return `${parsed.origin}${parsed.pathname}`;
    } catch (_) {
        return window.location.href.split('?')[0];
    }
};

const isExcludedPath = (url) => {
    try {
        const parsed = new URL(url);
        const path = parsed.pathname.replace(/^\/+/, '');
        return path.startsWith('api/') || path.startsWith('media/get');
    } catch (_) {
        return false;
    }
};

export default function VisitorDurationTracker() {
    const pageUrlRef = useRef('');
    const pageStartRef = useRef(0);
    const timerRef = useRef(null);

    const sendDuration = (useBeacon = false) => {
        if (typeof window === 'undefined') return;
        if (!pageStartRef.current || !pageUrlRef.current) return;
        if (isExcludedPath(pageUrlRef.current)) return;

        const now = Date.now();
        const elapsedSeconds = Math.max(0, Math.floor((now - pageStartRef.current) / 1000));

        const payload = {
            url: pageUrlRef.current,
            duration_seconds: elapsedSeconds,
            started_at: new Date(pageStartRef.current).toISOString(),
        };

        const body = JSON.stringify(payload);

        if (useBeacon && navigator.sendBeacon) {
            const blob = new Blob([body], { type: 'application/json' });
            navigator.sendBeacon('/visitor-duration', blob);
            return;
        }

        fetch('/visitor-duration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body,
            keepalive: true,
        }).catch(() => {});
    };

    const startTrackingCurrentPage = () => {
        pageUrlRef.current = toSafeUrl();
        pageStartRef.current = Date.now();

        if (timerRef.current) {
            window.clearInterval(timerRef.current);
        }

        timerRef.current = window.setInterval(() => {
            if (document.visibilityState === 'visible') {
                sendDuration(false);
            }
        }, HEARTBEAT_MS);
    };

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        startTrackingCurrentPage();

        return undefined;
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const onVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                sendDuration(true);
            } else if (document.visibilityState === 'visible') {
                startTrackingCurrentPage();
            }
        };

        const onPageHide = () => {
            sendDuration(true);
        };

        const onInertiaNavigate = () => {
            sendDuration(false);
            startTrackingCurrentPage();
        };

        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('pagehide', onPageHide);
        document.addEventListener('inertia:navigate', onInertiaNavigate);

        return () => {
            sendDuration(true);
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
            }
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('pagehide', onPageHide);
            document.removeEventListener('inertia:navigate', onInertiaNavigate);
        };
    }, []);

    return null;
}
