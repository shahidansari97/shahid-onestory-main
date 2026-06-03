"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, VolumeOff, Volume2, Loader2 } from "lucide-react";
import { useInView } from 'react-intersection-observer';

export default function OptimizedVideoPlayer({ 
    src, 
    poster = null, 
    autoPlay = true, 
    loop = true, 
    muted = true,
    playsInline = true,
    className = "",
    onLoadStart = null,
    onCanPlay = null,
    onError = null
}) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isMuted, setIsMuted] = useState(muted);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [buffered, setBuffered] = useState(0);
    const [isReady, setIsReady] = useState(false);
    
    const [singleVideoRefInView, isSingleVideoInView] = useInView({ 
        threshold: 0.3,
        triggerOnce: false 
    });

    // Force video loading and buffering
    const preloadVideo = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        // Set aggressive preloading
        video.preload = "auto";
        
        // Force load the video
        video.load();
        
        // Start buffering immediately
        if (video.readyState < 2) { // HAVE_CURRENT_DATA
            video.load();
        }
    }, []);

    // Handle video loading states
    const handleLoadStart = useCallback(() => {
        setIsLoading(true);
        setHasError(false);
        onLoadStart?.();
    }, [onLoadStart]);

    const handleCanPlay = useCallback(() => {
        setIsLoading(false);
        setIsReady(true);
        onCanPlay?.();
    }, [onCanPlay]);

    const handleCanPlayThrough = useCallback(() => {
        setIsLoading(false);
        setIsReady(true);
    }, []);

    const handleProgress = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            setBuffered(bufferedEnd);
        }
    }, []);

    const handleError = useCallback((error) => {
        console.error("Video loading error:", error);
        setIsLoading(false);
        setHasError(true);
        onError?.(error);
    }, [onError]);

    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch((err) => {
                        console.warn("Play failed:", err);
                        setIsPlaying(false);
                    });
            }
        } else {
            video.pause();
            setIsPlaying(false);
        }
    }, []);

    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    }, []);

    const handleTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (video) setCurrentTime(video.currentTime);
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        const video = videoRef.current;
        if (video) setDuration(video.duration);
    }, []);

    const handleSeek = useCallback((e) => {
        const video = videoRef.current;
        if (!video) return;
        const seekTime = parseFloat(e.target.value);
        video.currentTime = seekTime;
        setCurrentTime(seekTime);
    }, []);

    const formatTime = useCallback((time) => {
        if (!time || isNaN(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }, []);

    // Initialize video when component mounts
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Set video properties for optimal loading
        video.preload = "auto";
        video.muted = muted;
        video.playsInline = playsInline;
        video.loop = loop;
        
        // Force immediate loading
        preloadVideo();

        // Add event listeners
        video.addEventListener('loadstart', handleLoadStart);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('canplaythrough', handleCanPlayThrough);
        video.addEventListener('progress', handleProgress);
        video.addEventListener('error', handleError);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            video.removeEventListener('loadstart', handleLoadStart);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('canplaythrough', handleCanPlayThrough);
            video.removeEventListener('progress', handleProgress);
            video.removeEventListener('error', handleError);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [muted, playsInline, loop, preloadVideo, handleLoadStart, handleCanPlay, handleCanPlayThrough, handleProgress, handleError, handleTimeUpdate, handleLoadedMetadata]);

    // Handle play/pause based on viewport visibility
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isReady) return;

        if (isSingleVideoInView && autoPlay) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch((err) => {
                        console.warn("Autoplay failed:", err);
                        setIsPlaying(false);
                    });
            }
        } else {
            video.pause();
            setIsPlaying(false);
        }
    }, [isSingleVideoInView, autoPlay, isReady]);

    // Auto-play when ready
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isReady || !autoPlay) return;

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => setIsPlaying(true))
                .catch((err) => {
                    console.warn("Autoplay failed:", err);
                    setIsPlaying(false);
                });
        }
    }, [isReady, autoPlay]);

    return (
        <div
            className={`relative md:w-full w-[100%] mx-auto rounded-[12px] md:rounded-[24px] md:bg-black overflow-hidden ${className}`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            ref={singleVideoRefInView}
        >
            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="flex flex-col items-center gap-3 text-white">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-sm">Loading video...</span>
                    </div>
                </div>
            )}

            {/* Error overlay */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="flex flex-col items-center gap-3 text-white text-center p-4">
                        <span className="text-sm">Failed to load video</span>
                        <button 
                            onClick={preloadVideo}
                            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Video element */}
            <video
                ref={videoRef}
                className="w-full rounded-[12px] md:rounded-[24px]"
                playsInline={playsInline}
                autoPlay={autoPlay}
                loop={loop}
                muted={isMuted}
                preload="auto"
                poster={poster}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
            >
                <source src={src} type="video/mp4" />
                <source src={src} type="video/webm" />
                <source src={src} type="video/ogg" />
                Your browser does not support the video tag.
            </video>

            {/* Controls */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 flex items-center gap-4 text-white text-sm transition-opacity duration-300 ${
                    showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
                {/* Play/Pause */}
                <button 
                    onClick={togglePlay}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                {/* Mute */}
                <button 
                    onClick={toggleMute}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                >
                    {isMuted ? <VolumeOff size={18} /> : <Volume2 size={18} />}
                </button>

                {/* Time */}
                <span className="min-w-[40px]">{formatTime(currentTime)}</span>

                {/* Progress bar */}
                <div className="flex-1 relative">
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        step="0.1"
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, white 0%, white ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`
                        }}
                    />
                    {/* Buffered indicator */}
                    {buffered > 0 && (
                        <div 
                            className="absolute top-0 left-0 h-1 bg-white/50 rounded-full pointer-events-none"
                            style={{ width: `${(buffered / duration) * 100}%` }}
                        />
                    )}
                </div>

                <span className="min-w-[40px]">{formatTime(duration)}</span>
            </div>

            {/* Buffering indicator */}
            {isLoading && isReady && (
                <div className="absolute top-4 right-4 bg-black/50 px-2 py-1 rounded text-xs text-white">
                    Buffering...
                </div>
            )}
        </div>
    );
}
