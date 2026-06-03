export const PUBLISH_MESSAGE_PARAM = 'from_publish_message';

export function hasPublishMessageIntent(search = window.location.search) {
    return new URLSearchParams(search).get(PUBLISH_MESSAGE_PARAM) === '1';
}

/** Append ?from_publish_message=1 (relative path for Inertia). */
export function withPublishMessageQuery(url) {
    if (!url) {
        return `/?${PUBLISH_MESSAGE_PARAM}=1`;
    }

    try {
        const parsed = new URL(url, window.location.origin);
        parsed.searchParams.set(PUBLISH_MESSAGE_PARAM, '1');

        return parsed.pathname + parsed.search + parsed.hash;
    } catch {
        const separator = url.includes('?') ? '&' : '?';

        return `${url}${separator}${PUBLISH_MESSAGE_PARAM}=1`;
    }
}

/** Build login/register (or OAuth) URLs, keeping publish intent when active. */
export function authRoute(routeName, routeParams = {}, keepPublishIntent = null) {
    const base = route(routeName, routeParams);
    const keep = keepPublishIntent ?? hasPublishMessageIntent();

    return keep ? withPublishMessageQuery(base) : base;
}
