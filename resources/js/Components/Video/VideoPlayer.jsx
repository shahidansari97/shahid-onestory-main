import '../../../css/video-player.css';
import React, { useRef, useState, useEffect } from "react";
import { Img } from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import { router, usePage } from "@inertiajs/react";
import OptimizedVideoPlayer from "@/Components/UI/OptimizedVideoPlayer.jsx";

const VideoPlayer = ({ type = 'story', video, height = 750, showStoryteller = true, showStorytellerButtons = true, onOpenGiftModal, onOpenShareModal }) => {
    const { auth } = usePage().props;
    const isCurrentUserStory = auth.user?.id === video?.author?.id;
    const [videoError, setVideoError] = useState(false);

    const handleGiftClick = () => {
        if (auth.user) {
            onOpenGiftModal();
        } else {
            router.visit(route('login'));
        }
    };

    const handleShareClick = () => {
        if (onOpenShareModal && video?.item?.id) {
            onOpenShareModal();
        }
    };

    const handleVideoError = (error) => {
        console.error("Video error:", error);
        setVideoError(true);
    };

    const handleVideoCanPlay = () => {
        setVideoError(false);
    };

    return (
        <div className="os-video__player">
            <div className="os-video__panel">
                {videoError ? (
                    // Fallback for video errors
                    <div className={`os-video__iframe os-video__iframe--${height} bg-black flex items-center justify-center text-white`}>
                        <div className="text-center">
                            <p className="mb-4">Video unavailable</p>
                            <button 
                                onClick={() => setVideoError(false)}
                                className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                ) : (
                    <OptimizedVideoPlayer
                        src={video?.item?.src}
                        poster={video?.item?.thumbnail}
                        autoPlay={false}
                        loop={false}
                        muted={false}
                        playsInline={true}
                        className={`os-video__iframe os-video__iframe--${height}`}
                        onError={handleVideoError}
                        onCanPlay={handleVideoCanPlay}
                    />
                )}
            </div>
            
            {showStoryteller ? (
                <>
                    <Img
                        src={'/img/icons/share-new.svg'}
                        width={56}
                        height={56}
                        className="os-story-card__share"
                        onClick={handleShareClick}
                    />
                    <div className="os-video__storyteller os-video__storyteller--static">
                        <div className="os-video__storyteller-content">
                            <Img src={video?.author?.avatar} alt="Profile" className='os-video__storytellr-photo'/>
                            <div className="os-video__storyteller-info">
                                <div className="os-video__storyteller-name">
                                    {video?.author?.name}
                                </div>
                                <div className="os-video__storyteller-desc">
                                    {video?.author?.worldMessage}
                                </div>
                            </div>
                        </div>
                        {showStorytellerButtons && !isCurrentUserStory && (
                            <div className='os-video__storyteller-buttons'>
                                <a className="os-btn os-btn--fw-bold os-btn--outline os-btn--gap-16 os-btn--p-s os-btn--with-icon"
                                   href={`/chatify/${video?.author?.id}`}>
                                    <Img
                                        src={'/img/icons/contact.svg'}
                                        width={32}
                                        height={32}
                                        className="os-btn__icon os-btn__icon--w-24"
                                    />
                                    Connect Storytaller
                                </a>
                                <Button
                                    padding={'s'}
                                    fontWeight={'bold'}
                                    gap={'16'}
                                    icon={true}
                                    fullWidthMob={true}
                                    onClick={handleGiftClick}
                                >
                                    <Img
                                        src={'/img/icons/gift.svg'}
                                        width={32}
                                        height={32}
                                        className="os-btn__icon os-btn__icon--w-24"
                                    />
                                    Gift the Creator</Button>
                            </div>
                        )}
                    </div>
                </>
            ) : ''}
        </div>
    );
};

export default VideoPlayer;
