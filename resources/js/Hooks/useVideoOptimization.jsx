import { useRef, useEffect, useState, useCallback } from 'react';

export const useVideoOptimization = (videoSrc, options = {}) => {
    const {
        preloadBuffer = 5, // Buffer 5 seconds by default
        autoPlay = false,
        muted = true,
        playsInline = true,
        loop = false
    } = options;

    const videoRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [buffered, setBuffered] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Detect Apple devices
    const isAppleDevice = useCallback(() => {
        return /iPad|iPhone|iPod|Mac/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }, []);

    // Detect Safari
    const isSafari = useCallback(() => {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }, []);

    // Optimize video for Apple devices
    const optimizeForApple = useCallback(() => {
        const video = videoRef.current;
        if (!video || !isAppleDevice()) return;

        // Apple-specific optimizations
        video.preload = 'auto';
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('x-webkit-airplay', 'allow');
        
        // Force hardware acceleration
        video.style.transform = 'translateZ(0)';
        video.style.webkitTransform = 'translateZ(0)';
        video.style.backfaceVisibility = 'hidden';
        video.style.webkitBackfaceVisibility = 'hidden';
    }, [isAppleDevice]);

    // Force aggressive preloading
    const forcePreload = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        // Set aggressive preloading
        video.preload = 'auto';
        
        // Force load the video
        video.load();
        
        // Start buffering immediately
        if (video.readyState < 2) {
            video.load();
        }

        // For Apple devices, try to preload more aggressively
        if (isAppleDevice()) {
            // Create a temporary video element to preload
            const tempVideo = document.createElement('video');
            tempVideo.src = videoSrc;
            tempVideo.preload = 'auto';
            tempVideo.muted = true;
            tempVideo.style.display = 'none';
            
            // Add to DOM temporarily to force loading
            document.body.appendChild(tempVideo);
            
            // Remove after a delay
            setTimeout(() => {
                if (document.body.contains(tempVideo)) {
                    document.body.removeChild(tempVideo);
                }
            }, 10000); // Remove after 10 seconds
        }
    }, [videoSrc, isAppleDevice]);

    // Handle video events
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

    const handleProgress = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            setBuffered(bufferedEnd);
        }
    }, []);

    const handleTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            setCurrentTime(video.currentTime);
        }
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            setDuration(video.duration);
        }
    }, []);

    const handleError = useCallback((error) => {
        console.error('Video optimization error:', error);
        setIsLoading(false);
        setHasError(true);
    }, []);

    const handlePlay = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const handlePause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    // Play video with Apple device compatibility
    const playVideo = useCallback(async () => {
        const video = videoRef.current;
        if (!video || !isReady) return;

        try {
            // For Apple devices, ensure muted state
            if (isAppleDevice()) {
                video.muted = true;
            }

            const playPromise = video.play();
            if (playPromise !== undefined) {
                await playPromise;
                setIsPlaying(true);
            }
        } catch (error) {
            console.warn('Play failed:', error);
            
            // For Apple devices, try muted autoplay
            if (isAppleDevice() && !video.muted) {
                try {
                    video.muted = true;
                    await video.play();
                    setIsPlaying(true);
                } catch (mutedError) {
                    console.warn('Muted autoplay also failed:', mutedError);
                }
            }
        }
    }, [isReady, isAppleDevice]);

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
        if (!video) return;

        // Set basic properties
        video.muted = muted;
        video.playsInline = playsInline;
        video.loop = loop;
        video.autoplay = autoPlay;

        // Apply Apple-specific optimizations
        optimizeForApple();

        // Force preloading
        forcePreload();

        // Add event listeners
        video.addEventListener('loadstart', handleLoadStart);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('canplaythrough', handleCanPlayThrough);
        video.addEventListener('progress', handleProgress);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('error', handleError);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        return () => {
            video.removeEventListener('loadstart', handleLoadStart);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('canplaythrough', handleCanPlayThrough);
            video.removeEventListener('progress', handleProgress);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('error', handleError);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, [
        muted, playsInline, loop, autoPlay,
        optimizeForApple, forcePreload,
        handleLoadStart, handleCanPlay, handleCanPlayThrough,
        handleProgress, handleTimeUpdate, handleLoadedMetadata,
        handleError, handlePlay, handlePause
    ]);

    // Auto-play when ready
    useEffect(() => {
        if (isReady && autoPlay) {
            playVideo();
        }
    }, [isReady, autoPlay, playVideo]);

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
        seekTo,
        retry: forcePreload
    };
};
