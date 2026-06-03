import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { useForm, usePage, router, Link } from "@inertiajs/react";
import { useInView } from 'react-intersection-observer';

import { useGlobalSound } from "@/Contexts/GlobalSoundContext";
import { getObjectUrlFor } from "@/Utils/videoCache.js";

import { BsStars } from "react-icons/bs";
import { LuTrophy } from "react-icons/lu";
// Desktop-specific Story component with hover behavior
const NewContestStory = memo(function NewContestStory({
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
    const [bestContent,setBestContent] = useState(item.has_voted_best_content);
    const [bestEdit,setBestEdit] = useState(item.has_voted_best_edit);
    const [bestContentCount,setBestContentCount] = useState(item.best_content_voting_count);
    const [bestEditCount,setBestEditCount] = useState(item.best_edit_voting_count);
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

    const handleVoting = useCallback(async(type) => {
        if (auth.user) {
            const response = await axios.post(route('user.stories.vote', {
                story_id: item.id,
                type: type,
            }));
            if(response.data.result) {
                if(type === 'best_content'){
                    setBestContent(true);   
                    setBestContentCount((prev)=>prev +1)  
                }else{
                    setBestEdit(true);
                    setBestEditCount((prev)=>prev +1)    
                }
            }
        } else {
            router.visit(route("login"));
        }
    }, [auth.user, item.id]);

    return (
        <div key={item.id} className="transition">
            {/* Card Image / Video */}
            <div className="relative w-full md:h-[580px] h-[480px] overflow-hidden rounded-3xl">
                <video
                    src={item.src}
                    poster={item.thumbnail}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                ></video>

                {/* Text Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-white mt-1 flex items-center gap-1">
                        <div className="flex items-center gap-1">
                            <img src={item?.author?.avatar} width={20} height={20} className='rounded-full' />
                            <span> @ {item.author.name} </span>
                        </div>
                    </p>
                </div>
            </div>
            {/* Bottom Stats */}
            <div className="pb-4">
                <div className="flex gap-3 justify-between text-xs font-medium mt-4">

                    {/* BEST EDIT */}
                    <div
                        onClick={()=>handleVoting('best_edit')}
                        className={`flex flex-col items-center px-1 xl2:px-4 py-2 rounded-xl border shadow-sm w-[50%] 
                            ${bestEdit
                            ? "bg-[#fce7f3]"
                            : "bg-white"
                            }`}
                    >
                        <span className="flex items-center gap-1 font-bold text-md">
                            <BsStars className="text-black" size={14} /> BEST EDIT
                        </span>
                        <span className="text-gray-800">{bestEditCount}</span>
                    </div>

                    {/* BEST CONTENT */}
                    <div
                        onClick={()=>handleVoting('best_content')}
                        className={`flex flex-col items-center px-1 xl2:px-4 py-2 rounded-xl border shadow-sm w-[50%] 
                            ${bestContent
                            ? "bg-[#ffda79]"
                            : "bg-white"
                            }`}
                    >
                        <span className="flex items-center gap-1 font-bold text-md">
                            <LuTrophy className="text-black" size={14} /> BEST CONTENT
                        </span>
                        <span className="text-gray-800">{bestContentCount}</span>
                    </div>

                </div>
            </div>
        </div>
    );
});

export default NewContestStory;
