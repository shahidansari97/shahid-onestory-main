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

// Desktop-specific Story component with hover behavior
const ContestStory = memo(function ContestStory({
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
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [open, setOpen] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [cachedVideoUrl, setCachedVideoUrl] = useState(null);
    
    // Get global sound context
    const { isGlobalMuted, setGlobalSoundFromVideo } = useGlobalSound();
    
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
        
        // Use global mute state for hover behavior
        video.muted = isHovered ? isGlobalMuted : true;
        
        const attemptPlay = async () => {
            try {
                video.playsInline = true;
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                await video.play();
            } catch (e) {
                try {
                    const prevMuted = video.muted;
                    video.muted = true;
                    await video.play();
                    setTimeout(() => { video.muted = prevMuted; }, 150);
                } catch (_) {}
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
    }, [isVisible, allowAutoplay, isGlobalMuted, isHovered, setActiveStory, item.id, open]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // console.log(`🧹 Cleaning up DesktopStory component ${item.id}`);
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
            if (!video.getAttribute('src')) {
                if (cachedVideoUrl) {
                    video.src = cachedVideoUrl;
                } else if (item?.src) {
                    video.src = item.src;
                }
                try { video.preload = 'metadata'; } catch(_) {}
                video.load();
            }
            try {
                video.playsInline = true;
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
            } catch(_) {}
            video.muted = isGlobalMuted;
            const p = video.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
        } catch(_) {}
    }, [cachedVideoUrl, item?.src, isGlobalMuted, open, item.id]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        const video = videoRef.current;
        if (!video) return;
        try {
            video.pause();
        } catch(_) {}
    }, []);

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
            console.log(`🔄 Video ${item.id}: Restarting to apply mute state`);
            const currentTime = video.currentTime;
            video.pause();
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.currentTime = currentTime;
                    videoRef.current.muted = nextMuted;
                    videoRef.current.play().catch((err) => {
                        console.log('Play failed:', err);
                    });
                }
                muteClickInProgress.current = false;
            }, 100);
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

    const handleLike = useCallback(async(type) => {
        if (auth.user) {
            const response = await axios.post(route('user.stories.like', {
                story_id: item.id,
                type: type,
                story_page: "all-stories",
            }));
        } else {
            router.visit(route("login"));
        }
    }, [auth.user, item.id]);

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
                    src={(isHovered || nearInView) ? (cachedVideoUrl || item?.src) : undefined}
                    poster={item?.thumbnail}
                    autoPlay={isVisible && videoLoaded && allowAutoplay}
                    loop
                    muted={isMuted}
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
                            if (!isMuted && interacted) {
                                setTimeout(() => { e.target.muted = false; }, 150);
                            }
                        } catch(_) {}
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
                                initialLiked={item?.isLiked}
                                initialLikesCount={item?.likes_count}
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
                                justifyContent: 'center',
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
                        <img src={item?.author?.avatar} width={50} height={50} />
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

export default ContestStory;
