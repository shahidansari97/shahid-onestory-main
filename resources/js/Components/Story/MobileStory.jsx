import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { useForm, usePage, router, Link } from "@inertiajs/react";
import { useInView } from 'react-intersection-observer';
import { Modal } from "@mui/material";
import { useGlobalSound } from "@/Contexts/GlobalSoundContext";
import { getObjectUrlFor } from "@/Utils/videoCache.js";
import shareImg from "./../../../img/send.png";
import commentImg from "./../../../img/comment.png";
import story_tellerImg from "./../../../img/icons/story_teller_img.png";
import valumeUp from "./../../../img/sound.gif";
import valumemute from "./../../../img/mute-sound.png";
import { Img } from "@/Components/UI/Content.jsx";
import Follow from "./Follow";
import CommentModal from "../Modals/CommentModal";
import LikeButton from "../UI/LikeButton";
import axios from 'axios';
import { useStoryLikeState } from "@/Hooks/useStoryLikeState";

// Mobile-specific Story component with touch behavior
const MobileStory = memo(function MobileStory({
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
    const {data, setData, post, processing, errors} = useForm({
        story_id: item.id,
        type: item?.isLiked ? "unlike" : "like",
        story_page : 'home'
    });
    
    const storyRef = useRef(null);
    const videoRef = useRef(null);
    const muteClickInProgress = useRef(false);
    const viewTrackedRef = useRef(false); // Track if view API has been called
    const [isVisible, setIsVisible] = useState(false);
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
        // if (!open || !auth.user || viewTrackedRef.current) {
        //     return;
        // }
        if (!open || viewTrackedRef.current) {
            return;
        }

        try {
            const userId = auth?.user ? auth.user.id : null;
            console.log('Tracking story view (mobile):', { user_id: userId, story_id: item.id, modal_open: open });
            await axios.post(route('user.story.view.store'), {
                user_id: userId,
                story_id: item.id,
                ip_address: null, // Backend will get IP from request if null
            });
            viewTrackedRef.current = true; // Mark as tracked
            console.log('Story view tracked successfully (mobile)');
        } catch (error) {
            // Log error but don't interrupt video playback
            console.error('Failed to track story view:', error);
        }
    }, [auth?.user, item.id, open]);

    // Reset tracking when story changes or modal closes
    useEffect(() => {
        viewTrackedRef.current = false;
    }, [item.id, open]);

    // Use intersection observer for visibility detection (tighter on mobile)
    const { ref, inView } = useInView({
        threshold: 0.15,
        rootMargin: '150px',
        triggerOnce: false,
        skip: false
    });

    // Near-viewport observer for prefetching (more aggressive on mobile)
    const { ref: prefetchRef, inView: nearInView } = useInView({
        threshold: 0.01,
        rootMargin: '500px',
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

    // Mobile autoplay preferences
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
                        // Release video src to free memory on mobile
                        currentVideo.src = '';
                        currentVideo.load();
                    }
                }
                window.__activeStoryId = item.id;
                window.dispatchEvent(new CustomEvent('story-active', { detail: { id: item.id } }));
            }
        } catch(_) {}
    }, [item.id]);

    useEffect(() => {
        const onActive = (e) => {
            const activeId = e?.detail?.id;
            const video = videoRef.current;
            if (!video) return;
            
            const isInPopup = video.hasAttribute('data-popup-video');
            if (isInPopup) return;
            
            if (activeId !== item.id) {
                try { video.pause(); } catch(_) {}
                try { video.removeAttribute('src'); video.load(); } catch(_) {}
            } else if (isVisible) {
                (async () => {
                    try { if (!video.getAttribute('src')) { video.src = item?.src || ''; } } catch(_) {}
                    try { video.load(); } catch(_) {}
                    try { await video.play(); } catch(_) {}
                })();
            }
        };
        window.addEventListener('story-active', onActive);
        return () => window.removeEventListener('story-active', onActive);
    }, [item.id, isVisible]);

    // Background loading for videos when they're near viewport
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !nearInView || !item?.src) return;
        
        if (!video.getAttribute('src')) {
            getObjectUrlFor(item.id, item.src).then(cachedUrl => {
                if (video && !video.getAttribute('src')) {
                    video.src = cachedUrl;
                    setCachedVideoUrl(cachedUrl);
                    video.load();
                }
            }).catch(() => {
                if (video && !video.getAttribute('src')) {
                    video.src = item.src;
                    video.load();
                }
            });
        }
    }, [nearInView, item?.src, item?.id]);

    // Mobile video playback logic: play only when visible, respect global mute state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        
        const shouldPlay = isVisible && allowAutoplay;
        
        // Mobile videos respect the global mute state
        video.muted = isGlobalMuted;
        
        const attemptPlay = async () => {
            try {
                video.playsInline = true;
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                await video.play();
                // Don't track here - only track when modal is open and user clicks play
            } catch (e) {
                // Mobile fallback: try muted autoplay
                try {
                    video.muted = true;
                    await video.play();
                    // Don't track here - only track when modal is open and user clicks play
                } catch (_) {}
            }
        };

        if (!isVisible) {
            if (!video.paused) {
                video.pause();
            }
            if (window.__activeStoryId === item.id) {
                window.__activeStoryId = null;
            }
            // Release video src to free memory on mobile
            if (video.src) {
                video.src = '';
                video.load();
            }
            return;
        }

        if (shouldPlay) {
            setActiveStory();
            attemptPlay();
        } else {
            video.pause();
        }
        }, [isVisible, allowAutoplay, isGlobalMuted, item.id]);

    // Mobile-specific: mute videos when modal opens (but don't change user preference)
    useEffect(() => {
        if (videoRef.current && open) {
            videoRef.current.muted = true;
        }
    }, [open]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log(`🧹 Cleaning up MobileStory component ${item.id}`);
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

    const handleCommentClick = useCallback(() => {
        setOpen(true);
    }, []);

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
        
        const nextMuted = !isGlobalMuted;
        console.log(`🔊 Video ${item.id}: Toggle global mute from ${isGlobalMuted} to ${nextMuted}`);
        
        // Update global sound state - this affects all videos
        setGlobalSoundFromVideo(nextMuted);
        video.muted = nextMuted;
        
        // Reset immediately for mobile (no hover restart needed)
        muteClickInProgress.current = false;
    }, [isGlobalMuted, setGlobalSoundFromVideo, item.id]);

    const handleVideoClick = useCallback(() => {
        setOpen(true);
    }, []);
    
    const handleClose = useCallback((e) => {
        if (e) e.stopPropagation(); 
        setOpen(false);
    }, []);

    const handleGiftClick = useCallback(() => {
        if (auth.user && displayGift) {
            onOpenGiftModal();
        } else {
            router.visit(route("login"));
        }
    }, [auth.user, displayGift, onOpenGiftModal]);

    // Track user-initiated play clicks when modal is open (mobile)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Track when user manually plays video (only when modal is open)
        const handlePlay = () => {
            // Only track if modal is open and user clicked play
            // if (open && auth.user && !viewTrackedRef.current) {
            //     trackStoryView();
            // }
            if (open && !viewTrackedRef.current) {
                trackStoryView();
            }
        };

        // Track when user clicks on video element (to play)
        const handleVideoClick = (e) => {
            // Only track if modal is open, video is paused, and user clicks to play
            if (open && video.paused && !viewTrackedRef.current) {
                // Play will trigger the 'play' event which will call trackStoryView
                video.play().catch(() => {});
            }
        };

        // Always add listeners, but check open state inside handlers
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
        >
            <div onClick={handleVideoClick}>
                <video
                    className="card-video"
                    ref={videoRef}
                    src={nearInView ? (cachedVideoUrl || item?.src) : undefined}
                    poster={item?.thumbnail}
                    autoPlay={isVisible && videoLoaded && allowAutoplay}
                    loop
                    muted={isGlobalMuted}
                    playsInline
                    preload={nearInView ? "metadata" : "none"}
                    controls={false}
                    data-story-id={item.id}
                    style={{ WebkitAppearance: "none" }}
                    onLoadedData={(e) => {
                        setVideoLoaded(true);
                    }}
                    onPlaying={(e) => {
                        try {
                            const interacted = !!window.__userInteracted;
                            if (!isGlobalMuted && interacted) {
                                setTimeout(() => { e.target.muted = false; }, 150);
                            }
                            // Don't track here - only track when modal is open and user clicks play
                        } catch(_) {}
                    }}
                    onClick={(e) => {
                        // Track when user clicks play button (when modal is open)
                        const video = e.target;
                        if (open && video.paused && auth.user && !viewTrackedRef.current) {
                            video.play().then(() => {
                                // Play event will trigger tracking via handlePlay listener
                            }).catch(() => {});
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
                        <span className="os-story-card__comment" onClick={(e) => { e.stopPropagation(); handleCommentClick(); }}>
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
                        <a href="javascript:void(0);"  onClick={(e)=>onConnect(e,item)}>
                            <span className="os-story-card__share story_tellerImg"  style={{ 
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
                            <Link href={route("user.profile.index",{user_id:item.author.id})}>{item?.author?.name} </Link>
                        </div>

                        <div className="os-story-card__categories">
                            <Follow userId={authorId} isFollowing={item?.author?.is_following} pages="story" />
                            <div className="os-story-card__category" onClick={handleGiftClick}>Gift Storyteller</div>
                        </div>
                    </div>

                    <span 
                        className="os-story-card__sound" 
                        onClick={handleUnmuteClick}
                        style={{ 
                            padding: '8px',
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '44px',
                            minHeight: '44px'
                        }}
                    >
                        <img
                            src={isGlobalMuted ? valumemute : valumeUp}
                            className={isGlobalMuted ? "volumemute" : "volumeunmute"}
                            alt={isGlobalMuted ? "Muted" : "Unmuted"}
                            style={{ width: '28px', height: '28px' }}
                        />
                    </span>
                </div>
            </div>
        </div>
    );
});

export default MobileStory;
