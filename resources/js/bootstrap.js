import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

const csrfMeta = document.head.querySelector('meta[name="csrf-token"]');
if (csrfMeta?.content) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfMeta.content;
}

const xsrfCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='));

if (xsrfCookie) {
    window.axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(
        xsrfCookie.split('=').slice(1).join('=')
    );
}

/**
 * Load Echo lazily so realtime boot does not block first paint.
 */
let echoLoaded = false;

const loadEcho = () => {
    if (echoLoaded) return;
    echoLoaded = true;
    import('./echo');
};

if (typeof window !== 'undefined') {
    const scheduleEcho = () => {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(loadEcho, { timeout: 2500 });
        } else {
            setTimeout(loadEcho, 1500);
        }
    };

    if (document.readyState === 'complete') {
        scheduleEcho();
    } else {
        window.addEventListener('load', scheduleEcho, { once: true });
    }
}
