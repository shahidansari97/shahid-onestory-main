import { Img } from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import "./../../../css/share.css";
import { useCallback, useMemo, useState } from "react";
import axios from "axios";

export default function ShareModal({ story, onShareRecorded }) {
    const [copied, setCopied] = useState(false);
    const [nativeBusy, setNativeBusy] = useState(false);

    const storyId = useMemo(() => {
        if (story == null) return null;
        return typeof story === "object" ? story.id : story;
    }, [story]);

    const link = useMemo(() => {
        const id = storyId;
        return id != null
            ? `${window.location.origin}/all-stories/${id}`
            : window.location.origin;
    }, [storyId]);

    const recordShare = useCallback(async () => {
        if (storyId == null) return;
        try {
            await axios.post(
                route("story.share"),
                { story_id: storyId },
                { headers: { Accept: "application/json" } }
            );
            onShareRecorded?.(storyId);
        } catch (e) {
            console.error("Share count failed:", e);
        }
    }, [storyId, onShareRecorded]);

    const handleCopy = () => {
        const done = () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            recordShare();
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(link).then(done).catch((err) => {
                console.error("Clipboard copy failed:", err);
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = link;
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand("copy");
                if (successful) {
                    done();
                } else {
                    console.error("Fallback: Copy command was unsuccessful");
                }
            } catch (err) {
                console.error("Fallback: Unable to copy", err);
            }

            document.body.removeChild(textArea);
        }
    };

    const handleShare = (platform) => {
        const encodedLink = encodeURIComponent(link);
        let shareUrl = "";

        switch (platform) {
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${encodedLink}`;
                break;
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
                break;
            case "mail":
                shareUrl = `mailto:?subject=Check out this story&body=${encodedLink}`;
                break;
            case "telegram":
                shareUrl = `https://t.me/share/url?url=${encodedLink}`;
                break;
            case "reddit":
                shareUrl = `https://www.reddit.com/submit?url=${encodedLink}`;
                break;
            case "tiktok":
                shareUrl = `https://www.tiktok.com/upload?utm_source=${encodedLink}`;
                break;
            default:
                break;
        }

        if (shareUrl) {
            void recordShare();
            window.open(shareUrl, "_blank");
        }
    };

    const handleNativeShare = async () => {
        if (typeof navigator === "undefined" || !navigator.share) return;
        setNativeBusy(true);
        try {
            await navigator.share({
                title: "Check out this story",
                text: "Check out this story on OneStoryPlanet",
                url: link,
            });
            await recordShare();
        } catch (err) {
            if (err?.name === "AbortError") {
                /* user closed sheet */
            } else {
                console.error("Native share failed:", err);
            }
        } finally {
            setNativeBusy(false);
        }
    };

    const canNativeShare =
        typeof navigator !== "undefined" && typeof navigator.share === "function";

    return (
        <>
            <div className="os-title os-text text-left os-title--bold">Share</div>
            {canNativeShare && (
                <div className="mb-4">
                    <Button
                        type="button"
                        className="w-full"
                        fontWeight="bold"
                        onClick={handleNativeShare}
                        disabled={nativeBusy || storyId == null}
                    >
                        {nativeBusy ? "Opening…" : "Share via apps…"}
                    </Button>
                    <p className="mt-1 text-xs text-gray-500">
                        Uses your phone’s share menu (Messages, Instagram, etc.). Counts when you complete a share.
                    </p>
                </div>
            )}
            <div className="os-modal__share">
                <div
                    className="os-modal__share-soc"
                    onClick={() => handleShare("whatsapp")}
                >
                    <Img src="/img/share/what.svg" />
                    <div className="os-text os-text--sm">WhatsApp</div>
                </div>
                <div
                    className="os-modal__share-soc"
                    onClick={() => handleShare("facebook")}
                >
                    <Img src="/img/share/facebook.svg" />
                    <div className="os-text os-text--sm">Facebook</div>
                </div>
                <div
                    className="os-modal__share-soc"
                    onClick={() => handleShare("mail")}
                >
                    <Img src="/img/share/mail.svg" />
                    <div className="os-text os-text--sm">Mail</div>
                </div>
                <div
                    className="os-modal__share-soc"
                    onClick={() => handleShare("telegram")}
                >
                    <Img src="/img/share/telegram.svg" />
                    <div className="os-text os-text--sm">Telegram</div>
                </div>
                <div
                    className="os-modal__share-soc"
                    onClick={() => handleShare("reddit")}
                >
                    <Img src="/img/share/reddit.svg" />
                    <div className="os-text os-text--sm">Reddit</div>
                </div>
                <div
                    className="os-modal__share-soc"
                    onClick={() => handleShare("tiktok")}
                >
                    <Img src="/img/share/tictok.svg" />
                    <div className="os-text os-text--sm">Tik-Tok</div>
                </div>
            </div>
            <div className="os-modal__share-input">
                <input
                    type="text"
                    readOnly
                    value={link}
                    className="os-input"
                />
                <Button
                    className="os-modal__share-btn"
                    fontWeight={"bold"}
                    onClick={handleCopy}
                >
                    {copied ? "Copied!" : "Copy"}
                </Button>
            </div>
        </>
    );
}
