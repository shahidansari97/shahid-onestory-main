"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, VolumeOff, Volume2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function CustomFakeSectionVideoDesktop({ src, poster ,classNames }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false); // thumbnail until ready

  const [singleVideoRefInView, isSingleVideoInView] = useInView({
    threshold: 0.5,
  });

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true; // required for autoplay
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Autoplay failed:", err);
          });
      }
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isSingleVideoInView) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isSingleVideoInView]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) setDuration(video.duration);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const seekTime = parseFloat(e.target.value);
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className="relative left-[-75px] desktop_fake_video"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      ref={singleVideoRefInView}
    >
      <video
        ref={videoRef}
        className={`  bottom-0  object-cover rounded-2xl opacity-100 home_video`}
        playsInline
        autoPlay
        loop
        muted={isMuted}
        preload="auto"
        poster={poster || ''}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={() => setIsVideoReady(true)} // show video only when ready
        onClick={togglePlay}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Controls */}
      <div className="relative ">
      <div
        className={`absolute w-100 rounded-bl-2xl rounded-br-2xl bottom-[0px] right-0 bg-black/60 px-[1px] py-2 flex items-center gap-4 text-white text-sm transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-100 pointer-events-none"
        }`}
      >
        {/* Play/Pause */}
        <button onClick={togglePlay}>
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {/* Mute */}
        <button onClick={toggleMute}>
          {isMuted ? <VolumeOff size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Time */}
        <span>{formatTime(currentTime)}</span>

        {/* Progress bar */}
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1 accent-white"
        />

        <span>{formatTime(duration)}</span>
      </div>
    </div>
    </div>
  );
}
