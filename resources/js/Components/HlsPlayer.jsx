import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useMute } from "@/Contexts/MuteContext";

const HlsPlayer = ({ src, poster, classes = "card-video", autoPlay = true, controls = false }) => {
  const { isMuted, unmute, hasUnmutedOnce } = useMute();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const [showPoster, setShowPoster] = useState(true); // <-- control poster manually
  const [useNativeVideo, setUseNativeVideo] = useState(false);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Check if src is HLS (.m3u8) or regular video
    const isHlsStream = src.includes('.m3u8') || src.includes('application/vnd.apple.mpegurl');
    
    let hls;
    if (isHlsStream && Hls.isSupported() && !isMobile) {
      // Use HLS for desktop and supported browsers
      hls = new Hls({
        startLevel: -1,
        maxBufferLength: 3,
        maxMaxBufferLength: 5,
        capLevelToPlayerSize: true,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch((error) => {
            console.log('HLS auto-play failed:', error);
            if (isMobile) setNeedsUserInteraction(true);
            // Try to play again after a short delay
            setTimeout(() => {
              video.play().catch(() => {
                if (isMobile) setNeedsUserInteraction(true);
              });
            }, 100);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.log('HLS Error:', data);
        if (data.fatal) {
          // Fallback to native video
          setUseNativeVideo(true);
        }
      });
    } else if (isHlsStream && video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = src;
      video.load();
      if (autoPlay) {
        video.play().catch((error) => {
          console.log('Native HLS auto-play failed:', error);
          if (isMobile) setNeedsUserInteraction(true);
          setTimeout(() => {
            video.play().catch(() => {
              if (isMobile) setNeedsUserInteraction(true);
            });
          }, 100);
        });
      }
    } else {
      // Regular video file or mobile fallback
      setUseNativeVideo(true);
      video.src = src;
      video.load();
      if (autoPlay) {
        video.play().catch((error) => {
          console.log('Native video auto-play failed:', error);
          if (isMobile) setNeedsUserInteraction(true);
          setTimeout(() => {
            video.play().catch(() => {
              if (isMobile) setNeedsUserInteraction(true);
            });
          }, 100);
        });
      }
    }

    const handleFirstFrame = () => setShowPoster(false);
    const handleCanPlay = () => {
      if (autoPlay && video.paused) {
        video.play().catch(() => {});
      }
    };
    
    const handleUserInteraction = () => {
      if (video.paused && autoPlay) {
        video.play().catch(() => {});
        setNeedsUserInteraction(false);
      }
    };
    
    video.addEventListener("loadeddata", handleFirstFrame);
    video.addEventListener("canplay", handleCanPlay);
    
    // Add click handler for mobile auto-play issues
    if (isMobile) {
      video.addEventListener("click", handleUserInteraction);
      video.addEventListener("touchstart", handleUserInteraction);
    }

    return () => {
      video.removeEventListener("loadeddata", handleFirstFrame);
      video.removeEventListener("canplay", handleCanPlay);
      if (isMobile) {
        video.removeEventListener("click", handleUserInteraction);
        video.removeEventListener("touchstart", handleUserInteraction);
      }
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [src, autoPlay]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
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
        preload="auto" // preload at least metadata for faster poster-to-video transition
        controls={controls}
      />
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
      {needsUserInteraction && isMobile && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            background: "rgba(0, 0, 0, 0.7)",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={handleUserInteraction}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "20px solid white",
              borderTop: "12px solid transparent",
              borderBottom: "12px solid transparent",
              marginLeft: "4px",
            }}
          />
        </div>
      )}
    </>
  );
};

export default HlsPlayer;
