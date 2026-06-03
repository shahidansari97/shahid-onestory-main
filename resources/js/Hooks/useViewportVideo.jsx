import { useState, useEffect, useRef } from 'react';

const useViewportVideo = (videoSrc, thumbnailSrc, isMobile = false, isIOS = false, isAndroid = false) => {
    const [isInViewport, setIsInViewport] = useState(false);
    const [isFullyVisible, setIsFullyVisible] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [shouldShowVideo, setShouldShowVideo] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        // Platform-specific viewport detection
        let visibilityThreshold, thresholds, rootMargin;
        
        if (isIOS) {
            // iOS: More aggressive detection - trigger at 20% visibility for faster autoplay
            // iOS needs earlier detection due to stricter autoplay policies
            visibilityThreshold = 0.2;
            thresholds = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5];
            rootMargin = '50px'; // Start loading slightly before entering viewport
        } else if (isAndroid) {
            // Android: Standard detection - trigger at 25% visibility for smooth autoplay
            // Android is more lenient with autoplay
            visibilityThreshold = 0.25;
            thresholds = [0.1, 0.25, 0.4, 0.5, 0.6];
            rootMargin = '30px'; // Small margin for smoother transitions
        } else if (isMobile) {
            // Generic mobile: use 30% threshold
            visibilityThreshold = 0.3;
            thresholds = [0.1, 0.3, 0.5, 0.7];
            rootMargin = '0px';
        } else {
            // Desktop: use higher threshold for better UX
            visibilityThreshold = 0.9;
            thresholds = [0.9, 0.9, 1.0];
            rootMargin = '50px';
        }

        // Enable viewport detection with platform-specific settings
        // Wrap in try-catch to prevent errors on mobile devices
        let observer = null;
        try {
            // Check if IntersectionObserver is supported
            if (typeof IntersectionObserver === 'undefined') {
                // Fallback: Show video immediately on mobile if IntersectionObserver not supported
                if (isMobile || isIOS || isAndroid) {
                    setIsInViewport(true);
                    setIsFullyVisible(true);
                    setIsVideoLoaded(true);
                }
                return;
            }

            observer = new IntersectionObserver(
                (entries) => {
                    try {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                setIsInViewport(true);
                                const isVisible = entry.intersectionRatio >= visibilityThreshold;
                                setIsFullyVisible(isVisible);
                                // Start loading video when in viewport
                                if (!isVideoLoaded) {
                                    setIsVideoLoaded(true);
                                }
                            } else {
                                setIsInViewport(false);
                                setIsFullyVisible(false);
                            }
                        });
                    } catch (error) {
                        // Silently handle errors in observer callback to prevent white screen
                    }
                },
                {
                    threshold: thresholds,
                    rootMargin: rootMargin
                }
            );

            if (elementRef.current) {
                observer.observe(elementRef.current);
            }
        } catch (error) {
            // Fallback: Show video immediately if observer creation fails
            // Silently handle error to prevent white screen
            if (isMobile || isIOS || isAndroid) {
                setIsInViewport(true);
                setIsFullyVisible(true);
                setIsVideoLoaded(true);
            }
        }

        return () => {
            try {
                if (observer && elementRef.current) {
                    observer.unobserve(elementRef.current);
                }
            } catch (error) {
                // Silently handle cleanup errors
            }
        };
    }, [isMobile, isIOS, isAndroid]); // Removed isVideoLoaded to prevent infinite loops

    useEffect(() => {
        // Platform-specific video display logic
        if (isIOS) {
            // iOS: Show video immediately when in viewport (don't wait for load)
            // iOS needs immediate display due to autoplay restrictions
            if (isInViewport && isFullyVisible) {
                setShouldShowVideo(true);
            } else {
                setShouldShowVideo(false);
            }
        } else if (isAndroid) {
            // Android: Show video when in viewport (can wait slightly for better UX)
            if (isInViewport && isFullyVisible) {
                setShouldShowVideo(true);
            } else {
                setShouldShowVideo(false);
            }
        } else if (isMobile) {
            // Generic mobile: Show video when in viewport
            if (isInViewport && isFullyVisible) {
                setShouldShowVideo(true);
            } else {
                setShouldShowVideo(false);
            }
        } else {
            // Desktop: Show video when loaded and fully visible
            if (isVideoLoaded && isInViewport && isFullyVisible) {
                setShouldShowVideo(true);
            } else {
                setShouldShowVideo(false);
            }
        }
    }, [isVideoLoaded, isInViewport, isFullyVisible, isMobile, isIOS, isAndroid]);

    return {
        elementRef,
        shouldShowVideo,
        isInViewport,
        isFullyVisible,
        isVideoLoaded
    };
};

export default useViewportVideo; 