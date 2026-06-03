import React, { useRef, useState, useEffect } from "react";

const VideoPlayer = () => {
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const animationRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentLink, setCurrentLink] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const linksData = [
        { start: 0, end: 30, link: "https://example.com/link1" },
        { start: 30, end: 60, link: "https://example.com/link2" },
        { start: 60, end: 120, link: "https://example.com/link3" },
    ];

    useEffect(() => {
        const currentLinkObj = linksData.find(
            (item) => currentTime >= item.start && currentTime <= item.end
        );
        setCurrentLink(currentLinkObj ? currentLinkObj.link : null);
    }, [currentTime]);

    useEffect(() => {
        const videoElement = videoRef.current;

        const handleLoadedMetadata = () => {
            setDuration(videoElement.duration);
        };

        const updateProgress = () => {
            if (!isDragging) {
                setCurrentTime(videoElement.currentTime);
            }
            animationRef.current = requestAnimationFrame(updateProgress);
        };

        videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);

        if (isPlaying && !isDragging) {
            animationRef.current = requestAnimationFrame(updateProgress);
        }

        return () => {
            videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
            cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, isDragging]);

    const handlePlayPause = () => {
        const videoElement = videoRef.current;
        if (isPlaying) {
            videoElement.pause();
        } else {
            videoElement.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleRewind = (seconds) => {
        const videoElement = videoRef.current;
        videoElement.currentTime = Math.max(0, videoElement.currentTime + seconds);
        setCurrentTime(videoElement.currentTime);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const handleProgressClick = (positionX) => {
        const progressElement = progressRef.current;
        const rect = progressElement.getBoundingClientRect();
        const clickPosition = positionX - rect.left;
        const clickTime = (clickPosition / rect.width) * duration;
        videoRef.current.currentTime = Math.min(Math.max(0, clickTime), duration);
        setCurrentTime(videoRef.current.currentTime);
    };

    const handleMouseDown = (event) => {
        setIsDragging(true);
        cancelAnimationFrame(animationRef.current);
        handleProgressClick(event.clientX);
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            handleProgressClick(event.clientX);
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            videoRef.current.currentTime = currentTime;
            setIsDragging(false);
            if (isPlaying) {
                animationRef.current = requestAnimationFrame(() => {
                    setCurrentTime(videoRef.current.currentTime);
                });
            }
        }
    };

    const handleTouchStart = (event) => {
        setIsDragging(true);
        cancelAnimationFrame(animationRef.current);
        handleProgressClick(event.touches[0].clientX);
    };

    const handleTouchMove = (event) => {
        if (isDragging) {
            handleProgressClick(event.touches[0].clientX);
        }
    };

    const handleTouchEnd = () => {
        if (isDragging) {
            videoRef.current.currentTime = currentTime;
            setIsDragging(false);
            if (isPlaying) {
                animationRef.current = requestAnimationFrame(() => {
                    setCurrentTime(videoRef.current.currentTime);
                });
            }
        }
    };

    useEffect(() => {
        const handleMouseMoveGlobal = (event) => handleMouseMove(event);
        const handleMouseUpGlobal = () => handleMouseUp();
        const handleTouchMoveGlobal = (event) => handleTouchMove(event);
        const handleTouchEndGlobal = () => handleTouchEnd();

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMoveGlobal);
            document.addEventListener("mouseup", handleMouseUpGlobal);
            document.addEventListener("touchmove", handleTouchMoveGlobal);
            document.addEventListener("touchend", handleTouchEndGlobal);
        } else {
            document.removeEventListener("mousemove", handleMouseMoveGlobal);
            document.removeEventListener("mouseup", handleMouseUpGlobal);
            document.removeEventListener("touchmove", handleTouchMoveGlobal);
            document.removeEventListener("touchend", handleTouchEndGlobal);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMoveGlobal);
            document.removeEventListener("mouseup", handleMouseUpGlobal);
            document.removeEventListener("touchmove", handleTouchMoveGlobal);
            document.removeEventListener("touchend", handleTouchEndGlobal);
        };
    }, [isDragging]);

    return (
        <div className="os-video__player">
            <div className="os-video__panel">
                <a
                    href={currentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="os-video__storyteller-icon"
                    style={{ pointerEvents: currentLink ? "auto" : "none" }}
                >
                    <img src="/img/icons/storyteller-border.svg" alt="Storyteller Border" />
                    <img src="/img/icons/storyteller-arrow.svg" alt="Storyteller Arrow" />
                </a>
                <video ref={videoRef} className="os-video__iframe" width="1910" height="715" controls={false}>
                    <source src="/video/video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div
                    className="os-video__timeline"
                >
                    <span className="time">{formatTime(currentTime)}</span>
                    <div
                        className="os-video__progress"
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        ref={progressRef}
                    >
                        <div className="os-video__progress-bg"></div>
                        <div
                            className="os-video__progress-current"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        >
                            <div
                                className="os-video__progress-thumb"
                                style={{
                                    left: `${(currentTime / duration) * 100}%`,
                                    cursor: isDragging ? "grabbing" : "grab"
                                }}
                            ></div>
                        </div>
                    </div>
                    <span className="time">{formatTime(duration)}</span>
                </div>
            </div>

            <div className="os-video__control">
                <img
                    className="os-video__control-icon os-video__control-icon--forward"
                    src="img/icons/forward-prev.svg"
                    alt="rewind"
                    onClick={() => handleRewind(-10)}
                />
                <img
                    className="os-video__control-icon os-video__control-icon--play"
                    src={`img/icons/${isPlaying ? "pause" : "play"}.svg`}
                    alt="play/pause"
                    onClick={handlePlayPause}
                />
                <img
                    className="os-video__control-icon os-video__control-icon--forward"
                    src="img/icons/forward-next.svg"
                    alt="forward"
                    onClick={() => handleRewind(10)}
                />
            </div>
        </div>
    );
};

export default VideoPlayer;
