/**
 * Persists like / count per story in memory so carousel remounts (scroll away → back)
 * still show the user's choice. Inertia `stories` props are not updated after POST like.
 * Cleared on full page reload.
 */
const cache = new Map();

export function getStoryLikeFromCache(storyId) {
    if (storyId == null) return null;
    return cache.get(Number(storyId)) ?? cache.get(storyId) ?? null;
}

export function setStoryLikeCache(storyId, liked, likesCount) {
    if (storyId == null) return;
    const key = typeof storyId === "number" ? storyId : Number(storyId);
    cache.set(Number.isNaN(key) ? storyId : key, {
        liked: !!liked,
        likesCount: Math.max(0, Number(likesCount) || 0),
    });
}
