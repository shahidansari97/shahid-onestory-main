import React, { useState, useEffect, useRef } from "react";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
} from "lucide-react";

/**
 * Simple Audio Player Component for Playback Only
 * 
 * @param {Object} props
 * @param {string} props.src - Audio file URL
 * @param {number} props.duration - Audio duration in seconds (optional, will be detected)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.compact - Compact mode for table cells (default: true)
 */
const AudioPlayer = ({
    src,
    duration: initialDuration,
    className = "",
    compact = true,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(initialDuration || null);
    const [isIOS, setIsIOS] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const audioRef = useRef(null);
    const pauseOtherAudios = () => {
        if (typeof document === 'undefined') return;
        const current = audioRef.current;
        document.querySelectorAll('audio').forEach((el) => {
            if (!current) return;
            if (el !== current && !el.paused) {
                try {
                    el.pause();
                } catch (_) {
                    // ignore
                }
            }
        });
    };

    // Normalize the URL - ensure it's a valid URL (must be defined before useEffects)
    const normalizeUrl = (url) => {
        if (!url) return null;
        // If it's already a full URL, return as is
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        // If it starts with /, it's a relative URL - should work as is
        if (url.startsWith('/')) {
            return url;
        }
        // Otherwise, prepend /storage/ if it's a path
        if (!url.startsWith('/storage/')) {
            return `/storage/${url}`;
        }
        return url;
    };

    const audioSrc = normalizeUrl(src);

    // Detect iOS
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isIOSDevice = /iPhone|iPad|iPod/i.test(userAgent);
        setIsIOS(isIOSDevice);
    }, []);

    // Format duration in seconds to MM:SS or HH:MM:SS
    const formatDuration = (seconds) => {
        if (!seconds || isNaN(seconds) || !isFinite(seconds)) {
            return '00:00';
        }
        
        const secs = Math.max(0, Math.floor(seconds));
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const remainingSecs = secs % 60;
        
        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
        }
        return `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
    };

    const togglePlayPause = () => {
        if (!audioRef.current) {
            console.error("Audio ref is null");
            return;
        }
        
        if (isPlaying) {
            audioRef.current.pause();
                } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Playback error:", error);
                    console.error("Audio src:", audioSrc);
                    setError("Unable to play audio. " + error.message);
                });
            }
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(audioRef.current.muted);
    };

    const handleVolumeChange = (e) => {
        if (!audioRef.current) return;
        const newVolume = parseFloat(e.target.value);
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
        if (newVolume > 0 && audioRef.current.muted) {
            audioRef.current.muted = false;
            setIsMuted(false);
        } else if (newVolume === 0) {
            audioRef.current.muted = true;
            setIsMuted(true);
        }
    };

    const handleSeek = (e) => {
        if (!audioRef.current) return;
        const newTime = parseFloat(e.target.value);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // Reset audio when src changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioSrc) return;
        
        // Reset audio state when src changes
        setIsPlaying(false);
        setCurrentTime(0);
        setError(null);
        setIsLoading(true);
        
        // Load the new source
        audio.load();
    }, [audioSrc]);

    // Debug logging
    useEffect(() => {
        if (audioSrc) {
            console.log('AudioPlayer - Source URL:', audioSrc);
            console.log('AudioPlayer - Initial Duration:', initialDuration);
        }
    }, [audioSrc, initialDuration]);

    // Handle audio events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioSrc) return;

        const handlePlay = () => {
            pauseOtherAudios();
            setIsPlaying(true);
        };
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };
        const handleVolumeChange = () => {
            setIsMuted(audio.muted);
            setVolume(audio.muted ? 0 : audio.volume);
        };
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };
        const handleLoadedMetadata = () => {
            const duration = audio.duration;
            if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
                setAudioDuration(duration);
            }
        };

        setIsMuted(audio.muted);
        setVolume(audio.muted ? 0 : audio.volume);
        setCurrentTime(audio.currentTime || 0);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('volumechange', handleVolumeChange);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('volumechange', handleVolumeChange);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [audioSrc]);

    if (!audioSrc) {
        console.warn('AudioPlayer - No valid source URL provided');
        return null;
    }

    if (compact) {
        // Compact inline player for table cells
        return (
            <div className={`inline-audio-player w-full px-3 py-2 cursor-pointer  text-gray-800 flex justify-center ${className}`}>
                <style>{`
                    .inline-audio-player input[type="range"] {
                        -webkit-appearance: none;
                        appearance: none;
                        outline: none;
                        background: transparent;
                        cursor: pointer;
                        height: 4px;
                    }
                    
                    .inline-audio-player input[type="range"]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #1f2937;
                        cursor: pointer;
                        border: 2px solid #ffffff;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                        transition: all 0.2s ease;
                        margin-top: -4px;
                    }
                    
                    .inline-audio-player input[type="range"]::-moz-range-thumb {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #1f2937;
                        cursor: pointer;
                        border: 2px solid #ffffff;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                        transition: all 0.2s ease;
                    }
                    
                    .inline-audio-player input[type="range"]::-webkit-slider-thumb:hover {
                        transform: scale(1.2);
                    }
                    
                    .inline-audio-player input[type="range"]::-moz-range-thumb:hover {
                        transform: scale(1.2);
                    }
                    
                    .inline-audio-player input[type="range"]::-webkit-slider-runnable-track {
                        height: 4px;
                        border-radius: 2px;
                        background: transparent;
                    }
                    
                    .inline-audio-player input[type="range"]::-moz-range-track {
                        height: 4px;
                        border-radius: 2px;
                        background: transparent;
                    }
                `}</style>

                <audio
                    ref={audioRef}
                    playsInline
                    preload="metadata"
                    src={audioSrc}
                    crossOrigin="anonymous"
                    style={{ display: 'none' }}
                    {...(isIOS && { webkitPlaysinline: true })}
                    onError={(e) => {
                        const audio = e.target;
                        const errorCode = audio.error?.code;
                        let errorMsg = "Unable to play audio.";
                        
                        switch(errorCode) {
                            case 1: // MEDIA_ERR_ABORTED
                                errorMsg = "Audio loading was aborted.";
                                break;
                            case 2: // MEDIA_ERR_NETWORK
                                errorMsg = "Network error while loading audio.";
                                break;
                            case 3: // MEDIA_ERR_DECODE
                                errorMsg = "Audio decoding error.";
                                break;
                            case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
                                errorMsg = "Audio format not supported.";
                                break;
                            default:
                                errorMsg = `Unable to play audio. Error code: ${errorCode || 'unknown'}`;
                        }
                        
                        console.error("Audio playback error:", {
                            error: audio.error,
                            code: errorCode,
                            message: audio.error?.message,
                            src: audioSrc,
                            networkState: audio.networkState,
                            readyState: audio.readyState
                        });
                        
                        setError(errorMsg);
                        setIsLoading(false);
                    }}
                    onLoadStart={() => {
                        setIsLoading(true);
                        setError(null);
                        console.log('Audio loading started:', audioSrc);
                    }}
                    onCanPlay={() => {
                        setIsLoading(false);
                        setError(null);
                        console.log('Audio can play:', audioSrc);
                    }}
                    onLoadedMetadata={(e) => {
                        const duration = e.target.duration;
                        console.log('Audio metadata loaded:', {
                            duration,
                            src: audioSrc,
                            networkState: e.target.networkState,
                            readyState: e.target.readyState
                        });
                        if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
                            setAudioDuration(duration);
                        }
                        setIsLoading(false);
                    }}
                />

                {error && (
                    <div className="text-xs text-red-500 mb-1">
                        {error}
                    </div>
                )}
                
                <div className="flex items-center gap-5 flex-wrap rounded   border px-3 py-2  bg-gray-100 text-gray-800 border-gray-300 ">
                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePlayPause}
                        disabled={isLoading || !!error}
                        className={`flex items-center justify-center transition-all hover:scale-110 active:scale-95 flex-shrink-0 ${
                            isLoading || error ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        aria-label={isPlaying ? "Pause audio" : "Play audio"}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : isPlaying ? (
                            <Pause className="text-gray-600" size={18} />
                        ) : (
                            <Play className="text-gray-600 ml-0.5" size={18} />
                        )}
                    </button>

                    {/* Progress Bar */}
                    {/* <div className="flex-1 min-w-[120px] relative">
                        <div
                            className="absolute top-1/2 left-0 h-[4px] rounded-[2px] -translate-y-1/2 bg-gray-800"
                            style={{
                                width: `${(currentTime / (audioDuration || 1)) * 100}%`
                            }}
                        />
                        <div
                            className="absolute top-1/2 right-0 h-[4px] rounded-[2px] -translate-y-1/2 bg-gray-200"
                            style={{
                                width: `${100 - (currentTime / (audioDuration || 1)) * 100}%`
                            }}
                        />
                        <input
                            type="range"
                            min="0"
                            max={audioDuration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full relative z-10"
                        />
                    </div> */}

                    {/* Duration */}
                    {/* <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                        {formatDuration(currentTime)} / {formatDuration(audioDuration || initialDuration || 0)}
                    </span> */}

                    {/* Volume Control */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            onClick={toggleMute}
                            className="flex items-center justify-center transition-all hover:scale-110"
                            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                        >
                            {isMuted ? (
                                <VolumeX className="text-gray-500" size={16} />
                            ) : (
                                <Volume2 className="text-gray-500" size={16} />
                            )}
                        </button>
                        {/* <div className="w-12 relative">
                            <div
                                className="absolute top-1/2 left-0 h-[3px] rounded-[2px] -translate-y-1/2 bg-gray-800"
                                style={{
                                    width: `${(isMuted ? 0 : volume) * 100}%`
                                }}
                            />
                            <div
                                className="absolute top-1/2 right-0 h-[3px] rounded-[2px] -translate-y-1/2 bg-gray-200"
                                style={{
                                    width: `${100 - (isMuted ? 0 : volume) * 100}%`
                                }}
                            />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-full relative z-10"
                            />
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }

    // Full player (same as AudioRecorder's player)
    return (
        <div className={`custom-audio-player w-full max-w-[600px] mx-auto ${className}`}>
            {/* Same full player UI as AudioRecorder */}
            {/* Implementation similar to AudioRecorder but without recording functionality */}
        </div>
    );
};

export default AudioPlayer;
