// Small per-session video cache with in-flight promise de-duplication
const globalCache = (typeof window !== 'undefined') ? (window.__oneStoryVideoCache ||= {
    objectUrls: new Map(), // id -> objectURL
    inflight: new Map(),   // id -> Promise<objectURL>
}) : { objectUrls: new Map(), inflight: new Map() };

export async function getObjectUrlFor(id, url) {
    if (!id || !url) return url;
    if (globalCache.objectUrls.has(id)) return globalCache.objectUrls.get(id);
    if (globalCache.inflight.has(id)) return await globalCache.inflight.get(id);

    const p = (async () => {
        try {
            const resp = await fetch(url, { cache: 'force-cache', mode: 'cors' });
            const blob = await resp.blob();
            const obj = URL.createObjectURL(blob);
            globalCache.objectUrls.set(id, obj);
            return obj;
        } catch (_) {
            // Fallback to direct URL
            return url;
        } finally {
            globalCache.inflight.delete(id);
        }
    })();

    globalCache.inflight.set(id, p);
    return await p;
}

export function releaseObjectUrl(id) {
    const obj = globalCache.objectUrls.get(id);
    if (obj) {
        try { URL.revokeObjectURL(obj); } catch (_) {}
        globalCache.objectUrls.delete(id);
    }
}

export function clearVideoCache() {
    for (const [id, url] of globalCache.objectUrls.entries()) {
        try { URL.revokeObjectURL(url); } catch (_) {}
        globalCache.objectUrls.delete(id);
    }
    globalCache.inflight.clear();
}


