import axios from "axios";

export const isVideoType = (type) => type === "user_video" || type === "video";

export const normalizeMediaItems = (media) => {
    if (!media) return [];
    if (Array.isArray(media)) return media;
    if (typeof media === "object") return Object.values(media);
    return [];
};

export const resolveMediaUrl = (value) => {
    if (!value || typeof value !== "string") return null;

    const trimmed = value.trim();
    if (!trimmed) return null;

    if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("blob:") ||
        trimmed.startsWith("data:")
    ) {
        return trimmed;
    }

    const base = import.meta.env.VITE_CLOUDFRONT_BASE_URL?.replace(/\/$/, "") || "";
    return base ? `${base}/${trimmed.replace(/^\//, "")}` : trimmed;
};

export const extractVideoUrl = (item) => {
    if (!item) return null;

    return (
        resolveMediaUrl(item.serverPath) ||
        resolveMediaUrl(item.server_path) ||
        resolveMediaUrl(item.url) ||
        resolveMediaUrl(item.src) ||
        resolveMediaUrl(item.path) ||
        null
    );
};

export const hasDraftVideoInMedia = (media) => {
    const items = normalizeMediaItems(media);

    return items.some((item) => isVideoType(item.type) && extractVideoUrl(item));
};

export const checkHasDraftVideo = async (media = null) => {
    if (hasDraftVideoInMedia(media)) {
        return true;
    }

    try {
        const response = await axios.get(route("media.has-draft-video"));
        return Boolean(response.data?.hasDraftVideo);
    } catch {
        return false;
    }
};

export const redirectToCreateStory = (newStoryUrl) => {
    if (!newStoryUrl) return false;

    const separator = newStoryUrl.includes("?") ? "&" : "?";
    window.location.replace(`${newStoryUrl}${separator}is_draft=false`);
    return true;
};

export const redirectToDraftOrNewStory = async ({ media, newStoryUrl }) => {
    const hasDraft = await checkHasDraftVideo(media);

    if (hasDraft) {
        window.location.replace("/draft");
        return;
    }

    redirectToCreateStory(newStoryUrl);
};
