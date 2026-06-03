import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Head, usePage } from "@inertiajs/react";
import "../../../css/draft-page.css";
import draftimg from "../../../img/draftimg.png";
import useUserMedia from "@/Hooks/useUserMedia";
import useEditorRedirection from "@/Hooks/useEditorRedirection";
import {
    extractVideoUrl,
    hasDraftVideoInMedia,
    isVideoType,
    normalizeMediaItems,
    redirectToCreateStory,
    resolveMediaUrl,
} from "@/Utils/draftVideo";

const PlayIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const EditIcon = () => (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
);

const PlusIcon = () => (
    <svg fill="currentColor" viewBox="0 0 330 330" aria-hidden="true">
        <path d="M281.672,48.328C250.508,17.163,209.073,0,164.999,0C120.927,0,79.492,17.163,48.328,48.328 c-64.333,64.334-64.333,169.011,0,233.345C79.492,312.837,120.927,330,165,330c44.073,0,85.508-17.163,116.672-48.328 C346.005,217.339,346.005,112.661,281.672,48.328z M260.46,260.46C234.961,285.957,201.06,300,165,300 c-36.06,0-69.961-14.043-95.46-39.54c-52.636-52.637-52.636-138.282,0-190.919C95.039,44.042,128.94,30,164.999,30 c36.06,0,69.961,14.042,95.46,39.54C313.095,122.177,313.095,207.823,260.46,260.46z" />
        <path d="M254.999,150H180V75c0-8.284-6.716-15-15-15s-15,6.716-15,15v75H75c-8.284,0-15,6.716-15,15s6.716,15,15,15h75v75 c0,8.284,6.716,15,15,15s15-6.716,15-15v-75h74.999c8.284,0,15-6.716,15-15S263.284,150,254.999,150z" />
    </svg>
);

const getVideoMimeType = (url) => {
    if (!url) return "video/mp4";
    const lower = url.toLowerCase();
    if (lower.includes(".webm")) return "video/webm";
    if (lower.includes(".mov")) return "video/quicktime";
    if (lower.includes(".m3u8")) return "application/x-mpegURL";
    return "video/mp4";
};

export default function Draft() {
    const { auth } = usePage().props;
    const { media, clearUserMedia, loading: mediaLoading } = useUserMedia(auth?.user?.id);
    const [draftImage, setDraftImage] = useState(draftimg);
    const [draftVideoUrl, setDraftVideoUrl] = useState(null);
    const [draftDate, setDraftDate] = useState(null);
    const [showPlayButton, setShowPlayButton] = useState(true);
    const [isCheckingDraft, setIsCheckingDraft] = useState(true);
    const videoRef = useRef(null);
    const { cipherText, ivBase64, url } = useEditorRedirection({
        userId: auth?.user?.id,
    });

    useEffect(() => {
        if (!media || typeof media !== "object") return;

        let thumb = draftimg;
        let videoUrl = null;
        let lastModified = null;

        const mediaItems = normalizeMediaItems(media).sort((a, b) => {
            const aTime = Number(a.createdAt || a.lastModified || 0);
            const bTime = Number(b.createdAt || b.lastModified || 0);
            return bTime - aTime;
        });

        const lastVideo = mediaItems.find((item) => isVideoType(item.type));

        if (lastVideo) {
            thumb = lastVideo.thumbnail || draftimg;
            videoUrl = extractVideoUrl(lastVideo);
            lastModified =
                lastVideo.lastModified ||
                lastVideo.lastModifiedDate ||
                lastVideo.updatedAt ||
                null;
        } else {
            const firstImage = mediaItems.find((item) => item.type === "image");
            if (firstImage) {
                thumb = firstImage.serverPath || firstImage.thumbnail || draftimg;
                lastModified =
                    firstImage.lastModified ||
                    firstImage.lastModifiedDate ||
                    firstImage.updatedAt ||
                    null;
            }
        }

        if (!videoUrl) {
            const fallbackVideo = mediaItems.find((item) => extractVideoUrl(item));
            if (fallbackVideo) {
                videoUrl = extractVideoUrl(fallbackVideo);
                if (!lastVideo) {
                    thumb = fallbackVideo.thumbnail || thumb;
                    lastModified =
                        fallbackVideo.lastModified ||
                        fallbackVideo.lastModifiedDate ||
                        fallbackVideo.updatedAt ||
                        lastModified;
                }
            }
        }

        setDraftImage(thumb);
        setDraftVideoUrl(videoUrl);
        setDraftDate(lastModified);
        setShowPlayButton(true);
    }, [media]);

    useEffect(() => {
        if (draftVideoUrl || mediaLoading) return;

        const fetchPreviewVideo = async () => {
            try {
                const response = await axios.get(route("media.preview-video"));
                if (!response.data?.success || !response.data?.videoUrl) return;

                setDraftVideoUrl(response.data.videoUrl);

                if (response.data.thumbnail) {
                    setDraftImage(response.data.thumbnail);
                }

                if (response.data.lastModified) {
                    setDraftDate(response.data.lastModified);
                }

                setShowPlayButton(true);
            } catch (error) {
                console.error("Failed to load draft preview video:", error);
            }
        };

        fetchPreviewVideo();
    }, [draftVideoUrl, mediaLoading]);

    useEffect(() => {
        if (mediaLoading) return;

        const verifyDraftVideo = async () => {
            const hasDraft =
                Boolean(draftVideoUrl) ||
                hasDraftVideoInMedia(media);

            if (hasDraft) {
                setIsCheckingDraft(false);
                return;
            }

            try {
                const response = await axios.get(route("media.has-draft-video"));
                if (response.data?.hasDraftVideo) {
                    setIsCheckingDraft(false);
                    return;
                }
            } catch (error) {
                console.error("Failed to verify draft video:", error);
            }

            if (url) {
                redirectToCreateStory(url);
                return;
            }

            setIsCheckingDraft(false);
        };

        verifyDraftVideo();
    }, [media, mediaLoading, draftVideoUrl, url]);

    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        const date = new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(new Date(timestamp));
        const time = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(new Date(timestamp));
        return `${date} • ${time}`;
    };

    const buildEditorUrl = (path = "", isDraft = true) => {
        if (!cipherText || !ivBase64) return null;
        const base = import.meta.env.VITE_VIDEO_EDITOR_FRONTEND_BASE_URL;
        const draftFlag = isDraft ? "true" : "false";
        return `${base}${path}?identification=${encodeURIComponent(cipherText)}&iv=${encodeURIComponent(ivBase64)}&is_draft=${draftFlag}`;
    };

    const handleStartNewStory = async () => {
        await clearUserMedia();
        if (url) {
            redirectToCreateStory(url);
        }
    };

    const handleEditStory = () => {
        const editorUrl = buildEditorUrl("");
        if (editorUrl) {
            window.location.href = editorUrl;
        }
    };

    const handleContinueRecording = () => {
        const recordUrl = buildEditorUrl("/record/step-3/");
        if (recordUrl) {
            window.location.href = `${recordUrl}&continueRecording=true`;
        }
    };

    const toggleVideoPlayback = async () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            try {
                await video.play();
                setShowPlayButton(false);
            } catch {
                setShowPlayButton(true);
            }
        } else {
            video.pause();
            setShowPlayButton(true);
        }
    };

    const hasVideo = Boolean(draftVideoUrl);

    if (isCheckingDraft || !hasVideo) {
        return (
            <>
                <Head title="Saved Story" />
                <div className="draft-page">
                    <div className="draft-page__card draft-page__card--loading">
                        <p className="draft-page__subtitle">Loading your story...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Saved Story" />
            <div className="draft-page">
                <div className="draft-page__card">
                    <div className="draft-page__preview">
                        <video
                            ref={videoRef}
                            className="draft-page__video"
                            src={draftVideoUrl}
                            poster={draftImage}
                            playsInline
                            preload="metadata"
                            onClick={toggleVideoPlayback}
                            onPause={() => setShowPlayButton(true)}
                            onEnded={() => setShowPlayButton(true)}
                        >
                            <source src={draftVideoUrl} type={getVideoMimeType(draftVideoUrl)} />
                        </video>

                        {showPlayButton && (
                            <button
                                type="button"
                                className="draft-page__play-btn"
                                aria-label="Play preview"
                                onClick={toggleVideoPlayback}
                            />
                        )}

                        {draftDate && (
                            <div className="draft-page__timestamp">
                                {formatDate(draftDate)}
                            </div>
                        )}
                    </div>

                    <div className="draft-page__content">
                        <h1 className="draft-page__title">
                            Wait, You have a saved story!
                        </h1>
                        <p className="draft-page__subtitle">
                            Your story is waiting to be completed
                        </p>

                        <div className="draft-page__btn-group">
                            <button
                                type="button"
                                className="draft-page__btn draft-page__btn--primary"
                                onClick={handleContinueRecording}
                            >
                                <PlayIcon />
                                Continue recording your story
                            </button>

                            <button
                                type="button"
                                className="draft-page__btn draft-page__btn--secondary"
                                onClick={handleEditStory}
                            >
                                <EditIcon />
                                Edit your story
                            </button>

                            <button
                                type="button"
                                className="draft-page__btn draft-page__btn--outline"
                                onClick={handleStartNewStory}
                            >
                                <PlusIcon />
                                Start a new story
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
