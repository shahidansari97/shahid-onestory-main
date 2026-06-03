import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Optimized video hook with performance improvements
 * Removes console logging, optimizes event handling, and manages resources efficiently
 */
export const useOptimizedVideo = (videoSrc, options = {}) => {
    const {
        preloadBuffer = 3, // Reduced buffer size for better performance
        autoPlay = false,
        muted = true,
        playsInline = true,
        loop = false,
        enableLogging = false // Only enable in development if needed
    } = options;

    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [buffered, setBuffered] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Throttled time update to reduce re-renders
    const timeUpdateRef = useRef(0);
    const throttledTimeUpdate = useCallback(() => {
        const now = Date.now();
        if (now - timeUpdateRef.current > 200) { // Update every 200ms
            setCurrentTime(videoRef.current?.currentTime || 0);
            timeUpdateRef.current = now;
        }
    }, []);

    // Throttled progress update
    const progressUpdateRef = useRef(0);
    const throttledProgressUpdate = useCallback(() => {
        const now = Date.now();
        if (now - progressUpdateRef.current > 500) { // Update every 500ms
            const video = videoRef.current;
            if (video && video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                setBuffered(bufferedEnd);
            }
            progressUpdateRef.current = now;
        }
    }, []);

    // Device detection
    const isAppleDevice = useCallback(() => {
        return /iPad|iPhone|iPod|Mac/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }, []);

    const isSafari = useCallback(() => {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }, []);

    // Optimized event handlers
    const handleLoadStart = useCallback(() => {
        setIsLoading(true);
        setHasError(false);
    }, []);

    const handleCanPlay = useCallback(() => {
        setIsLoading(false);
        setIsReady(true);
    }, []);

    const handleCanPlayThrough = useCallback(() => {
        setIsLoading(false);
        setIsReady(true);
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            setDuration(video.duration);
        }
    }, []);

    const handleError = useCallback((error) => {
        setHasError(true);
        setIsLoading(false);
        
        // Only log errors in development
        if (enableLogging && process.env.NODE_ENV === 'development') {
            console.warn('Video error:', error);
        }
    }, [enableLogging]);

    const handlePlay = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const handlePause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    // Optimized play function
    const playVideo = useCallback(async () => {
        const video = videoRef.current;
        if (!video || !isReady) return;

        try {
            // For Apple devices, ensure muted state for autoplay
            if (isAppleDevice() && !video.muted) {
                video.muted = true;
            }

            const playPromise = video.play();
            if (playPromise !== undefined) {
                await playPromise;
                setIsPlaying(true);
            }
        } catch (error) {
            setIsPlaying(false);
            
            // Only log in development
            if (enableLogging && process.env.NODE_ENV === 'development') {
                console.warn('Play failed:', error);
            }
        }
    }, [isReady, isAppleDevice, enableLogging]);

    // Pause video
    const pauseVideo = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        
        video.pause();
        setIsPlaying(false);
    }, []);

    // Seek to specific time
    const seekTo = useCallback((time) => {
        const video = videoRef.current;
        if (!video) return;
        
        video.currentTime = Math.max(0, Math.min(time, duration));
    }, [duration]);

    // Initialize video optimization
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoSrc) return;

        // Set basic properties
        video.muted = muted;
        video.playsInline = playsInline;
        video.loop = loop;
        video.autoplay = autoPlay;
        video.preload = 'metadata'; // Changed from 'auto' for better performance

        // Apply Apple-specific optimizations
        if (isAppleDevice()) {
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('playsinline', 'true');
            video.setAttribute('x-webkit-airplay', 'allow');
            
            // Force hardware acceleration
            video.style.transform = 'translateZ(0)';
            video.style.webkitTransform = 'translateZ(0)';
            video.style.backfaceVisibility = 'hidden';
            video.style.webkitBackfaceVisibility = 'hidden';
        }

        // Add event listeners
        video.addEventListener('loadstart', handleLoadStart);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('canplaythrough', handleCanPlayThrough);
        video.addEventListener('progress', throttledProgressUpdate);
        video.addEventListener('timeupdate', throttledTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('error', handleError);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        // Cleanup function
        return () => {
            video.removeEventListener('loadstart', handleLoadStart);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('canplaythrough', handleCanPlayThrough);
            video.removeEventListener('progress', throttledProgressUpdate);
            video.removeEventListener('timeupdate', throttledTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('error', handleError);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, [
        videoSrc, muted, playsInline, loop, autoPlay,
        handleLoadStart, handleCanPlay, handleCanPlayThrough,
        throttledProgressUpdate, throttledTimeUpdate, handleLoadedMetadata,
        handleError, handlePlay, handlePause, isAppleDevice
    ]);

    // Auto-play when ready
    useEffect(() => {
        if (isReady && autoPlay) {
            playVideo();
        }
    }, [isReady, autoPlay, playVideo]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Clean up HLS instance if it exists
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, []);

    return {
        videoRef,
        isReady,
        isLoading,
        hasError,
        buffered,
        currentTime,
        duration,
        isPlaying,
        isAppleDevice: isAppleDevice(),
        isSafari: isSafari(),
        playVideo,
        pauseVideo,
        seekTo
    };
};
