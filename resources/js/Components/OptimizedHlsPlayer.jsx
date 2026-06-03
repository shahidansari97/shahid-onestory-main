import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import Hls from "hls.js";
import { useMute } from "@/Contexts/MuteContext";

/**
 * Optimized HLS Player with performance improvements
 * - Removes console logging
 * - Optimizes buffer settings
 * - Better resource management
 * - Throttled event handlers
 */
const OptimizedHlsPlayer = memo(function OptimizedHlsPlayer({ 
  src, 
  poster, 
  classes = "card-video", 
  autoPlay = true, 
  controls = false,
  enableLogging = false // Only enable in development if needed
}) {
  const { isMuted, unmute, hasUnmutedOnce } = useMute();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [showPoster, setShowPoster] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Optimized HLS configuration for better performance
  const hlsConfig = useCallback(() => ({
    startLevel: -1,
    maxBufferLength: 3, // Reduced from default 30s
    maxMaxBufferLength: 5, // Reduced from default 600s
    capLevelToPlayerSize: true,
    lowLatencyMode: false, // Disable for better performance
    backBufferLength: 2, // Reduced back buffer
    maxBufferSize: 60 * 1000 * 1000, // 60MB max buffer
    maxBufferHole: 0.5, // Reduce buffer holes
    highBufferWatchdogPeriod: 2, // Faster buffer monitoring
    nudgeOffset: 0.1,
    nudgeMaxRetry: 3,
    maxSeekHole: 2,
    seekHoleNudgeDuration: 0.01,
    maxFragLookUpTolerance: 0.25,
    liveSyncDurationCount: 1,
    liveMaxLatencyDurationCount: 3,
    enableWorker: true,
    enableSoftwareAES: true,
    manifestLoadingTimeOut: 10000,
    manifestLoadingMaxRetry: 1,
    manifestLoadingRetryDelay: 1000,
    levelLoadingTimeOut: 10000,
    levelLoadingMaxRetry: 1,
    levelLoadingRetryDelay: 1000,
    fragLoadingTimeOut: 20000,
    fragLoadingMaxRetry: 1,
    fragLoadingRetryDelay: 1000,
    startFragPrefetch: false,
    testBandwidth: false,
    progressive: false
  }), []);

  // Optimized event handlers
  const handleFirstFrame = useCallback(() => {
    setShowPoster(false);
    setIsLoading(false);
  }, []);

  const handleError = useCallback((error) => {
    setHasError(true);
    setIsLoading(false);
    
    // Only log errors in development
    if (enableLogging && process.env.NODE_ENV === 'development') {
      console.warn('HLS Player error:', error);
    }
  }, [enableLogging]);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  // Initialize HLS player
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls;
    
    if (Hls.isSupported()) {
      hls = new Hls(hlsConfig());
      hlsRef.current = hls;
      
      hls.loadSource(src);
      hls.attachMedia(video);

      // Optimized event handlers
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch(() => {
            // Silently handle autoplay failures
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          handleError(data);
        }
      });

      hls.on(Hls.Events.FRAG_LOADED, () => {
        setIsLoading(false);
      });

    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = src;
      video.load();
    }

    // Add video event listeners
    video.addEventListener("loadeddata", handleFirstFrame);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("error", handleError);

    // Cleanup
    return () => {
      video.removeEventListener("loadeddata", handleFirstFrame);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("error", handleError);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay, hlsConfig, handleFirstFrame, handleError, handleLoadStart]);

  // Handle mute state changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <>
      <video
        ref={videoRef}
        className={classes}
        autoPlay={autoPlay}
        loop
        playsInline
        muted={isMuted}
        preload="metadata" // Changed from "auto" for better performance
        controls={controls}
      />
      
      {/* Show poster until video is ready */}
      {showPoster && (
        <img
          className="card-thumbnail"
          src={poster}
          alt="Story thumbnail"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "10px",
            position: "absolute",
            zIndex: 1,
            display: "block",
          }}
        />
      )}
      
      {/* Loading indicator */}
      {isLoading && !showPoster && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
          style={{ zIndex: 2 }}
        >
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
});

export default OptimizedHlsPlayer;
