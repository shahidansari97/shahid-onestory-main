import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { useForm, usePage, router, Link } from "@inertiajs/react";
import { useInView } from 'react-intersection-observer';
import { Modal } from "@mui/material";
import { useGlobalSound } from "@/Contexts/GlobalSoundContext";
import { getObjectUrlFor } from "@/Utils/videoCache.js";
import shareImg from "./../../../img/send.png";
import commentImg from "./../../../img/comment.png";
import valumeUp from "./../../../img/sound.gif";
import valumemute from "./../../../img/mute-sound.png";
import story_tellerImg from "./../../../img/icons/story_teller_img.png";
import { Img } from "@/Components/UI/Content.jsx";
import Follow from "./Follow";
import CommentModal from "../Modals/CommentModal";
import LikeButton from "../UI/LikeButton";
import axios from 'axios';
import { useStoryLikeState } from "@/Hooks/useStoryLikeState";

// Desktop-specific Story component with hover behavior
const DesktopStory = memo(function DesktopStory({
    item,
    index,
    isActive,
    onActivate,
    currentSlide,
    onOpenGiftModal,
    onOpenVideoModal,
    displayGift,
    onOpenShareModal,
    onOpenDeleteModal,
    showDelete = false,
    onActivateFocus,
    onConnect
}) {
    const { auth } = usePage().props;
    const authorId = item?.author?.id;
    const { data, setData, post, processing, errors } = useForm({
        story_id: item.id,
        type: item?.isLiked ? "unlike" : "like",
        story_page: 'home'
    });

    const storyRef = useRef(null);
    const videoRef = useRef(null);
    const muteClickInProgress = useRef(false);
    const viewTrackedRef = useRef(false); // Track if view API has been called
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [open, setOpen] = useState(false);
    const { storyLiked, storyLikesCount, handleLike } = useStoryLikeState(item);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [cachedVideoUrl, setCachedVideoUrl] = useState(null);

    // Get global sound context
    const { isGlobalMuted, setGlobalSoundFromVideo } = useGlobalSound();

    // Track story view when video plays - ONLY when modal is open and user clicks play
    const trackStoryView = useCallback(async () => {
        // Only track if:
        // 1. Modal is open (open === true)
        // 2. User is authenticated
        // 3. Hasn't been tracked yet for this story
        if (!open || viewTrackedRef.current) {
            return;
        }

        try {
            const userId = auth?.user ? auth.user.id : null;
            console.log('Tracking story view (desktop):', { user_id: userId, story_id: item.id, modal_open: open });
            await axios.post(route('user.story.view.store'), {
                user_id: userId,
                story_id: item.id,
                ip_address: null, // Backend will get IP from request if null
            });
            viewTrackedRef.current = true; // Mark as tracked
            console.log('Story view tracked successfully (desktop)');
        } catch (error) {
            // Log error but don't interrupt video playback
            console.error('Failed to track story view:', error);
        }
    }, [auth?.user, item.id, open]);

    // Reset tracking when story changes or modal closes
    useEffect(() => {
        viewTrackedRef.current = false;
    }, [item.id, open]);

    // Use intersection observer for visibility detection
    const { ref, inView } = useInView({
        threshold: 0.3,
        rootMargin: '50px',
        triggerOnce: false,
        skip: false
    });

    // Near-viewport observer for prefetching
    const { ref: prefetchRef, inView: nearInView } = useInView({
        threshold: 0.01,
        rootMargin: '300px',
        triggerOnce: false,
        skip: false
    });

    // Optimized visibility handling
    const isVisibleMemo = useMemo(() => inView, [inView]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsVisible(isVisibleMemo);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [isVisibleMemo]);

    // Respect user preferences
    const allowAutoplay = useMemo(() => {
        try {
            const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const saveData = typeof navigator !== 'undefined' && navigator.connection && navigator.connection.saveData;
            const userInteracted = typeof window !== 'undefined' && !!window.__userInteracted;
            return (!reduce && !saveData) || userInteracted;
        } catch (_) {
            return true;
        }
    }, []);

    // Global single-active playback coordinator
    const setActiveStory = useCallback(() => {
        try {
            if (window.__activeStoryId !== item.id) {
                const currentVideo = document.querySelector(`video[data-story-id="${window.__activeStoryId}"]`);
                if (currentVideo) {
                    const isInPopup = currentVideo.hasAttribute('data-popup-video');
                    if (!isInPopup) {
                        currentVideo.pause();
                    }
                }
                window.__activeStoryId = item.id;
                window.dispatchEvent(new CustomEvent('story-active', { detail: { id: item.id } }));
            }
        } catch (_) { }
    }, [item.id]);

    useEffect(() => {
        const onActive = (e) => {
            const activeId = e?.detail?.id;
            const video = videoRef.current;
            if (!video) return;

            const isInPopup = video.hasAttribute('data-popup-video');
            if (isInPopup) return;

            if (activeId !== item.id) {
                try { video.pause(); } catch (_) { }
                try { video.removeAttribute('src'); video.load(); } catch (_) { }
            } else if (isVisible) {
                (async () => {
                    try { if (!video.getAttribute('src')) { video.src = item?.src || ''; } } catch (_) { }
                    try { video.load(); } catch (_) { }
                    try { await video.play(); } catch (_) { }
                })();
            }
        };
        window.addEventListener('story-active', onActive);
        return () => window.removeEventListener('story-active', onActive);
    }, [item.id, isVisible]);

    // Aggressive video preloading - start immediately on mount for all users (logged in or not)
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !item?.src) return;

        // Try to cache video immediately
        if (!video.getAttribute('src')) {
            getObjectUrlFor(item.id, item.src).then(cachedUrl => {
                if (video && !video.getAttribute('src')) {
                    video.src = cachedUrl;
                    setCachedVideoUrl(cachedUrl);
                    video.preload = 'metadata';
                    video.load();
                    console.log(`✅ Video ${item.id} preloaded from cache on mount`);
                }
            }).catch(() => {
                // Fallback to direct source
                if (video && !video.getAttribute('src')) {
                    video.src = item.src;
                    video.preload = 'metadata';
                    video.load();
                    console.log(`✅ Video ${item.id} preloaded directly on mount (no cache)`);
                }
            });
        }
    }, [item?.src, item?.id]);

    // Desktop video playback logic: play on hover or visibility
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // If modal is open, pause and mute the background video
        if (open) {
            video.muted = true;
            if (!video.paused) {
                video.pause();
            }
            console.log(`🔇 Video ${item.id} paused because modal is open`);
            return;
        }

        const shouldPlay = isHovered || (isVisible && allowAutoplay);

        // Use global mute state - unmuted on hover, muted otherwise
        video.muted = isHovered ? isGlobalMuted : true;

        const attemptPlay = async () => {
            try {
                video.playsInline = true;
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                
                // Ensure video source is set before playing
                if (!video.getAttribute('src')) {
                    if (cachedVideoUrl) {
                        video.src = cachedVideoUrl;
                    } else if (item?.src) {
                        video.src = item.src;
                    }
                    video.preload = 'metadata';
                    video.load();
                }
                
                // Start muted to ensure playback works for all users
                video.muted = true;
                await video.play();
                console.log(`▶️ Video ${item.id} autoplay started (muted)`);
                
                // Try to unmute if user has interacted
                setTimeout(() => {
                    if (!isGlobalMuted) {
                        video.muted = false;
                    }
                }, 300);
            } catch (e) {
                console.log(`❌ Failed to autoplay video ${item.id}:`, e.message);
            }
        };

        if (!isVisible && !isHovered) {
            if (!video.paused) {
                video.pause();
            }
            if (window.__activeStoryId === item.id) {
                window.__activeStoryId = null;
            }
            return;
        }

        if (shouldPlay) {
            setActiveStory();
            attemptPlay();
        } else {
            video.pause();
        }
    }, [isVisible, allowAutoplay, isGlobalMuted, isHovered, setActiveStory, item.id, open, cachedVideoUrl]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log(`🧹 Cleaning up DesktopStory component ${item.id}`);
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.src = '';
                videoRef.current.load();
            }
            if (window.__activeStoryId === item.id) {
                window.__activeStoryId = null;
            }
            muteClickInProgress.current = false;
        };
    }, [item.id]);

    // Ensure background video is always muted when modal is open
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (open) {
            // Modal is open - force mute and pause
            video.muted = true;
            video.pause();
            console.log(`🔇 Force muted/paused carousel video ${item.id} because modal is open`);
        }
        // When modal closes, the main playback useEffect will handle restoration
    }, [open, item.id]);

    // Desktop hover handlers
    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);

        // Don't play if modal is open
        if (open) {
            console.log(`🚫 Not playing video ${item.id} on hover because modal is open`);
            return;
        }

        const video = videoRef.current;
        if (!video) return;
        
        try {
            // Ensure video source is set
            if (!video.getAttribute('src')) {
                if (cachedVideoUrl) {
                    video.src = cachedVideoUrl;
                } else if (item?.src) {
                    video.src = item.src;
                }
                try { video.preload = 'metadata'; } catch (_) { }
                video.load();
            }
            
            try {
                video.playsInline = true;
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
            } catch (_) { }
            
            // For hover, ALWAYS try muted first to ensure it works on all browsers
            // This works for both logged-in and guest users
            video.muted = true;
            
            // Attempt to play
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log(`✅ Video ${item.id} playing on hover`);
                        // Now try to unmute if needed
                        if (!isGlobalMuted) {
                            setTimeout(() => {
                                video.muted = false;
                            }, 200);
                        }
                    })
                    .catch((err) => {
                        console.log(`⚠️ Play failed on hover for video ${item.id}:`, err.message);
                    });
            }
        } catch (e) {
            console.log(`❌ Error in handleMouseEnter for video ${item.id}:`, e);
        }
    }, [cachedVideoUrl, item?.src, isGlobalMuted, open, item.id]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        const video = videoRef.current;
        if (!video) return;
        try {
            video.pause();
            console.log(`⏸️ Video ${item.id} paused on mouse leave`);
        } catch (_) { }
    }, [item.id]);

    const handleCommentClick = useCallback(() => {
        onActivateFocus(item.id);
    }, [onActivateFocus, item.id]);

    const handleUnmuteClick = useCallback((e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        if (muteClickInProgress.current) {
            console.log(`⏸️ Video ${item.id}: Mute click already in progress, ignoring`);
            return;
        }

        const video = videoRef.current;
        if (!video) return;

        muteClickInProgress.current = true;

        const nextMuted = !isMuted;
        console.log(`🔊 Video ${item.id}: Toggle mute from ${isMuted} to ${nextMuted}`);

        setIsMuted(nextMuted);
        setGlobalSoundFromVideo(nextMuted);
        video.muted = nextMuted;

        if (isHovered && !video.paused) {
            console.log(`🔄 Video ${item.id}: Keeping playing while toggling mute state`);
            // Keep video playing, just update muted state
            video.muted = nextMuted;
            muteClickInProgress.current = false;
        } else if (isHovered && video.paused) {
            console.log(`🔄 Video ${item.id}: Unmuting and playing video`);
            const currentTime = video.currentTime;
            video.muted = nextMuted;
            video.play().catch((err) => {
                console.log('Play failed after unmute:', err);
                muteClickInProgress.current = false;
            });
            muteClickInProgress.current = false;
        } else {
            muteClickInProgress.current = false;
        }
    }, [isMuted, setGlobalSoundFromVideo, isHovered, item.id]);

    const handleVideoClick = useCallback(() => {
        setOpen(true);
    }, []);

    const handleClose = useCallback((e) => {
        if (e) e.stopPropagation();
        const track = document.querySelector(".carousel-track");
        if (track) {
            track.classList.remove("paused", "carousel-trackstop");
        }
        setOpen(false);
    }, []);

    const handleGiftClick = useCallback(() => {
        if (auth.user && displayGift) {
            onOpenGiftModal();
        } else {
            router.visit(route("login"));
        }
    }, [auth.user, displayGift, onOpenGiftModal]);

    // Track user-initiated play clicks when modal is open (desktop)
    // useEffect(() => {
    //     const video = videoRef.current;
    //     if (!video) return;

    //     // Track when user manually plays video (only when modal is open)
    //     const handlePlay = () => {
    //         // Only track if modal is open and user clicked play
    //         if (open && !viewTrackedRef.current) {
    //             trackStoryView();
    //         }
    //     };

    //     // Track when user clicks on video element (to play)
    //     const handleVideoClick = (e) => {
    //         // Only track if modal is open, video is paused, and user clicks to play
    //         if (open && video.paused && !viewTrackedRef.current) {
    //             // Play will trigger the 'play' event which will call trackStoryView
    //             video.play().catch(() => {});
    //         }
    //     };

    //     // Always add listeners, but check open state inside handlers
    //     video.addEventListener('play', handlePlay);
    //     video.addEventListener('click', handleVideoClick);

    //     return () => {
    //         video.removeEventListener('play', handlePlay);
    //         video.removeEventListener('click', handleVideoClick);
    //     };
    // }, [auth.user, trackStoryView, open]);
    useEffect(() => {
        console.log('Tracking story view (desktop): 1');
        const video = videoRef.current;
        if (!video) return;
        console.log('Tracking story view (desktop): 2');
        const handlePlay = () => {
            console.log('Tracking story view (desktop): 3');
            // Track only when modal is open and not already tracked
            if (open && !viewTrackedRef.current) {
                console.log('Tracking story view (desktop): 4');
                trackStoryView();
            }
        };

        const handleVideoClick = () => {
            // If modal is open and video is paused, play it
            // 'play' event will trigger handlePlay
            if (open && video.paused) {
                video.play().catch(() => { });
            }
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('click', handleVideoClick);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('click', handleVideoClick);
        };
    }, [trackStoryView, open]);

    return (
        <div
            ref={(el) => {
                storyRef.current = el;
                ref(el);
                prefetchRef(el);
            }}
            className={`os-carousel__item video-wrapper ${currentSlide === index ? 'active' : ''}`}
            data-story-id={item.id}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div onClick={handleVideoClick}>
                <video
                    className="card-video"
                    ref={videoRef}
                    src={(isHovered || nearInView || isVisible) ? (cachedVideoUrl || item?.src) : undefined}
                    poster={item?.thumbnail}
                    autoPlay={false}
                    loop
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    controls={false}
                    data-story-id={item.id}
                    style={{ WebkitAppearance: "none" }}
                    onLoadedData={(e) => {
                        setVideoLoaded(true);
                    }}
                    onPlaying={(e) => {
                        try {
                            const interacted = !!window.__userInteracted;
                            if (!isMuted && interacted) {
                                setTimeout(() => { e.target.muted = false; }, 150);
                            }
                            // Don't track here - only track when modal is open and user clicks play
                        } catch (_) { }
                    }}
                    onClick={(e) => {
                        // Allow all users (logged in or not) to play video
                        const video = e.target;
                        if (open && video.paused) {
                            video.play().then(() => {
                                // Play event will trigger tracking via handlePlay listener
                            }).catch(() => { });
                        }
                    }}
                    onLoadStart={() => setVideoLoaded(false)}
                />
            </div>
            <div className="shareandiconsec" style={{ zIndex: 10, position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <Modal className="desktopmodal" open={open} onClose={handleClose}>
                    <div>
                        <CommentModal open={open} closeModal={handleClose} item={item} handleGiftClick={onOpenGiftModal} />
                    </div>
                </Modal>
                {(!open) && (
                    <>
                        <div onClick={(e) => e.stopPropagation()}>
                            <LikeButton
                                liked={storyLiked}
                                likesCount={storyLikesCount}
                                onLike={() => handleLike("like")}
                                onDislike={() => handleLike("unlike")}
                            />
                        </div>
                        <span className="os-story-card__comment" onClick={handleVideoClick}>
                            <Img src={commentImg} width={24} height={24} />
                            {item?.comments?.length}
                        </span>
                        <span className="os-story-card__share" onClick={(e) => e.stopPropagation()}>
                            <Img
                                src={shareImg}
                                width={24}
                                height={24}
                                onClick={() => onOpenShareModal(item)}
                            />
                            {item?.total_share}
                        </span>
                        <a href="javascript:void(0);" onClick={(e) => onConnect(e, item)}>
                            <span className="os-story-card__share story_tellerImg" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer',
                                opacity: 1,
                                pointerEvents: 'auto',
                                minWidth: '40px',
                                minHeight: '40px',
                                justifyContent: 'center'
                            }}>
                                <img src={story_tellerImg} width={24} height={24} alt="" />
                            </span>
                        </a>
                    </>
                )}
            </div>

            {item?.story_status_id === 1 && (
                <>
                    <div className="os-story-card__pending" style={{ zIndex: 10, position: 'relative' }}>Pending</div>
                    {showDelete && (
                        <Img
                            src={"/img/icons/delete.svg"}
                            width={20}
                            height={22}
                            className="os-story-card__delete"
                            onClick={onOpenDeleteModal}
                            style={{ zIndex: 10, position: 'relative' }}
                        />
                    )}
                </>
            )}

            <div className="os-story-card__content" style={{ zIndex: 10, position: 'relative' }}>
                <div className="os-story-card__content-top">
                    <div className="userprofile">
                        <img
                            src={item?.author?.avatar || "/img/avatar.png"}
                            width={50}
                            height={50}
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                            alt={item?.author?.name || "Story author"}
                        />
                    </div>
                    <div className="os-story-card__content-bottom-left d-block">
                        <div className="os-story-card__title">
                            <Link href={route("user.profile.index", { user_id: item.author.id })}>{item?.author?.name} </Link>
                        </div>

                        <div className="os-story-card__categories">
                            <Follow userId={authorId} isFollowing={item?.author?.is_following} pages="story" />
                            <div className="os-story-card__category" onClick={handleGiftClick}>Gift Storyteller</div>
                        </div>
                    </div>

                    <span className="os-story-card__sound" onClick={handleUnmuteClick}>
                        <img
                            src={isMuted ? valumemute : valumeUp}
                            className={isMuted ? "volumemute" : "volumeunmute"}
                            alt={isMuted ? "Muted" : "Unmuted"}
                        />
                    </span>
                </div>
            </div>
        </div>
    );
});

export default DesktopStory;
