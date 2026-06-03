import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Img } from "@/Components/UI/Content.jsx";
import { getObjectUrlFor, releaseObjectUrl } from "@/Utils/videoCache.js";

export default function StoryCarousel({ stories, isMuted, isPlaying, setIsPlaying, fullControl=true, isPopup = false, onFocus }) {
    // console.log("fullControl",fullControl)
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRef = useRef(null);
    const [volume, setVolume] = useState(1);
    const [cachedVideoUrl, setCachedVideoUrl] = useState(null);

    if (stories.length === 0) {
        return null;
    }

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
            videoRef.current.muted = isMuted;
            if (isPlaying) {
                videoRef.current.play().catch((error) => {
                    console.log("Video playback failed:", error);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying, currentIndex, volume, isMuted]);

    // Respect user preferences: Save-Data and Reduced Motion
    const allowAutoplay = useMemo(() => {
        try {
            const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const saveData = typeof navigator !== 'undefined' && navigator.connection && navigator.connection.saveData;
            return !reduce && !saveData;
        } catch (_) {
            return true;
        }
    }, []);

    useEffect(() => {
        if (!allowAutoplay && isPlaying) {
            setIsPlaying(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allowAutoplay]);

    // Page Visibility: pause when tab/page hidden, resume if allowed
    useEffect(() => {
        let wasPlayingBeforeHide = false;
        const handleVisibility = () => {
            if (document.hidden) {
                wasPlayingBeforeHide = isPlaying;
                if (isPlaying) setIsPlaying(false);
            } else {
                if (wasPlayingBeforeHide && allowAutoplay) setIsPlaying(true);
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [isPlaying, setIsPlaying, allowAutoplay]);

    // Cleanup video references on unmount
    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.src = '';
                videoRef.current.load();
            }
            // Release cached video URL
            if (cachedVideoUrl && currentStory?.id) {
                releaseObjectUrl(currentStory.id);
            }
        };
    }, [cachedVideoUrl, currentStory?.id]);

    // Handle focus events to activate this carousel
    const handleFocus = () => {
        if (onFocus) {
            onFocus();
        }
    };


    const handlePrevClick = () => {
        if (videoRef.current) videoRef.current.pause();
        const nextIndex = (currentIndex > 0 ? currentIndex - 1 : stories.length - 1);
        setCurrentIndex(nextIndex);
        setIsPlaying(true);
        try {
            const isMobile = typeof window !== 'undefined' ? window.innerWidth < 992 : false;
            if (isMobile && !isPopup) {
                const currentId = stories[nextIndex]?.id;
                const prefetchIndex = (nextIndex > 0 ? nextIndex - 1 : stories.length - 1);
                const prefetchId = stories[prefetchIndex]?.id;
                if (currentId) window.dispatchEvent(new CustomEvent('story-force-play', { detail: { id: currentId } }));
                if (prefetchId) window.dispatchEvent(new CustomEvent('story-prefetch', { detail: { id: prefetchId } }));
            }
        } catch(_) {}
    };

    const handleNextClick = () => {
        if (videoRef.current) videoRef.current.pause();
        const nextIndex = (currentIndex < stories.length - 1 ? currentIndex + 1 : 0);
        setCurrentIndex(nextIndex);
        setIsPlaying(true);
        try {
            const isMobile = typeof window !== 'undefined' ? window.innerWidth < 992 : false;
            if (isMobile && !isPopup) {
                const currentId = stories[nextIndex]?.id;
                const prefetchIndex = (nextIndex < stories.length - 1 ? nextIndex + 1 : 0);
                const prefetchId = stories[prefetchIndex]?.id;
                if (currentId) window.dispatchEvent(new CustomEvent('story-force-play', { detail: { id: currentId } }));
                if (prefetchId) window.dispatchEvent(new CustomEvent('story-prefetch', { detail: { id: prefetchId } }));
            }
        } catch(_) {}
    };

    // Auto-start in popup on mount or when index changes (mobile-friendly)
    useEffect(() => {
        if (!isPopup) return;
        const v = videoRef.current;
        if (!v) return;
        
        // Set iOS-specific attributes
        try {
            v.playsInline = true;
            v.setAttribute('playsinline', '');
            v.setAttribute('webkit-playsinline', '');
            v.muted = isMuted ?? false;
        } catch(_) {}
        
        const start = async () => {
            try {
                // Ensure video is loaded before playing
                if (v.readyState < 2) {
                    v.load();
                    await new Promise(resolve => {
                        v.addEventListener('canplay', resolve, { once: true });
                        setTimeout(resolve, 1000); // Fallback timeout
                    });
                }
                await v.play();
            } catch (e) {
                // iOS fallback: try muted first, then restore
                try {
                    const wasMuted = v.muted;
                    v.muted = true;
                    await v.play();
                    // Restore original mute state after a short delay
                    setTimeout(() => { v.muted = wasMuted; }, 200);
                } catch(_) {
                    console.warn('Video playback failed in popup:', e);
                }
            }
        };
        
        setIsPlaying(true);
        start();
    }, [isPopup, currentIndex, isMuted]);

    // Popup stall recovery: if the video doesn't start within 400ms or stalls, reload+play
    useEffect(() => {
        if (!isPopup) return;
        const v = videoRef.current;
        if (!v) return;
        let timer = setTimeout(async () => {
            if (!v.paused && v.readyState >= 2) return;
            try { v.currentTime = Math.max(0, v.currentTime + 0.001); } catch(_) {}
            try { v.load(); } catch(_) {}
            try { await v.play(); } catch(_) {}
        }, 400);
        const onWaiting = async () => {
            try { v.load(); } catch(_) {}
            try { await v.play(); } catch(_) {}
        };
        v.addEventListener('waiting', onWaiting);
        v.addEventListener('stalled', onWaiting);
        return () => {
            clearTimeout(timer);
            v.removeEventListener('waiting', onWaiting);
            v.removeEventListener('stalled', onWaiting);
        };
    }, [isPopup, currentIndex]);

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    const handlePauseVideo = () => {
        setIsPlaying(false);
    };

    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
    };

    const handleVideoEnd = () => {
        handleNextClick();
    };

    const currentStory = stories[currentIndex];
    const authorId = currentStory?.author.id;

    // Load cached video URL when story changes
    useEffect(() => {
        if (!currentStory?.src || !currentStory?.id) return;
        
        getObjectUrlFor(currentStory.id, currentStory.src).then(cachedUrl => {
            setCachedVideoUrl(cachedUrl);
            // Update video src if it exists
            if (videoRef.current) {
                videoRef.current.src = cachedUrl;
            }
        }).catch(() => {
            // Fallback to direct URL
            setCachedVideoUrl(currentStory.src);
            if (videoRef.current) {
                videoRef.current.src = currentStory.src;
            }
        });
    }, [currentIndex, currentStory?.id, currentStory?.src]);

    return (
        <div className="os-video__player" onMouseEnter={handleFocus} onFocus={handleFocus}>
            <div className="os-video__panel">
                <div className="os-video__thumbnail-container">
                    <span className="os-video__loader"></span>
                    <img src={currentStory?.thumbnail} alt="Thumbnail" className="os-video__thumbnail-image" style={{ display: isPlaying ? 'none' : 'block' }} />
                    <video
                        ref={videoRef}
                        src={cachedVideoUrl || currentStory?.src}
                        className="os-video__iframe"
                        controls={false}
                        playsInline
                        data-story-id={currentStory?.id}
                        data-popup-video="true"
                        onEnded={handleVideoEnd}
                        style={{ display: isPlaying ? 'block' : 'none' }}
                    />
                </div>
                { isPopup && (
                    <div className="os-video__storyteller">
                        <Img src={currentStory?.author.avatar} alt="Profile" className="os-video__storytellr-photo" />
                        <div className="os-video__storyteller-info">
                            <div className="os-video__storyteller-name">{currentStory?.author.name}</div>
                            <div className="os-video__storyteller-desc">{currentStory?.author.worldMessage}</div>
                            <a className="os-btn os-btn--fw-bold os-btn--primary os-btn--p-s" href={`/chatify/${authorId}`}>Connect Storyteller</a>
                        </div>
                    </div>
                )}
            </div>

           <div className="os-video__control">
                {fullControl && (
                    <div className="os-video__control-icon os-video__control-icon--forward" onClick={handlePrevClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                            <path d="M7 13L1 7L7 1" stroke="#F9F4EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}
                {!isPlaying && (
                  <Img src='/img/icons/video-play.svg' alt="Profile"
                   onClick={handlePlayClick}
                  className="os-video__control-icon os-video__control-icon--play"/>
                )}

                {isPlaying && (
                    <Img src='/img/icons/video-pause.svg' alt="Profile"
                    onClick={handlePauseVideo}
                    className="os-video__control-icon os-video__control-icon--play"/>
                )}
                {fullControl && (
                    <>
                        <div className="os-video__control-icon os-video__control-icon--forward" onClick={handleNextClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                                <path d="M1 13L7 7L1 1" stroke="#F9F4EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="os-video__volume-control">
                            <label htmlFor="volume-control" className="os-video__volume-label"></label>
                            <input
                                id="volume-control"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="os-video__volume-slider"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
