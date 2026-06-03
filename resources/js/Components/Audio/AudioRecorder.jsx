import React, { useState, useEffect, useRef } from "react";
import {
    Mic,
    Play,
    Pause,
    Volume2,
    VolumeX,
} from "lucide-react";
import { convertToWav, getAudioDuration, isWebAudioSupported, needsConversion } from "@/Utils/audioConverter";

/**
 * Reusable Audio Recorder Component
 * 
 * @param {Object} props
 * @param {Function} props.onRecordingComplete - Callback when recording is complete, receives (audioFile, audioBlob, duration)
 * @param {Function} props.onDelete - Callback when recording is deleted
 * @param {Function} props.onError - Callback for errors, receives (errorMessage)
 * @param {boolean} props.showControls - Show playback controls (default: true)
 * @param {boolean} props.autoPlay - Auto-play after recording (default: false)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @param {boolean} props.showMicButton - Show microphone button (default: true)
 * @param {number} props.maxDuration - Maximum recording duration in seconds (0 = unlimited)
 */
const AudioRecorder = ({
    onRecordingComplete,
    onDelete,
    onError,
    showControls = true,
    autoPlay = false,
    className = "",
    style = {},
    showMicButton = true,
    maxDuration = 0,
}) => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioStream, setAudioStream] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedFile, setRecordedFile] = useState(null);
    const [recordTime, setRecordTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [error, setError] = useState(null);
    const [isConverting, setIsConverting] = useState(false);

    const audioRef = useRef(null);
    const finalDurationRef = useRef(0);
    const timerRef = useRef(null);
    const chunks = useRef([]);

    // Detect device type
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isIOSDevice = /iPhone|iPad|iPod/i.test(userAgent);
        setIsIOS(isIOSDevice);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (audioURL) {
                URL.revokeObjectURL(audioURL);
            }
        };
    }, []);

    // Get compatible MIME type for MediaRecorder
    const getCompatibleMimeType = () => {
        // iOS Safari has limited MediaRecorder support
        if (isIOS) {
            // iOS 14.3+ supports MediaRecorder with limited formats
            const iosTypes = [
                'audio/mp4',
                'audio/aac',
                'audio/mpeg',
            ];
            
            for (const type of iosTypes) {
                if (MediaRecorder.isTypeSupported(type)) {
                    return type;
                }
            }
            // Fallback - iOS will use default (usually mp4/aac)
            return '';
        }
        
        // For other browsers
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4',
            'audio/mpeg',
            'audio/ogg;codecs=opus',
            'audio/wav',
            'audio/aac',
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        return '';
    };

    // Get file extension based on MIME type
    const getFileExtension = (mimeType) => {
        if (mimeType.includes('webm')) return 'webm';
        if (mimeType.includes('mp4')) return 'm4a';
        if (mimeType.includes('mpeg')) return 'mp3';
        if (mimeType.includes('ogg')) return 'ogg';
        if (mimeType.includes('wav')) return 'wav';
        if (mimeType.includes('aac')) return 'aac';
        return 'webm';
    };

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

    const startRecording = async () => {
        try {
            finalDurationRef.current = 0;
            setRecordTime(0);
            setError(null);
            chunks.current = [];
            
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100,
                } 
            });
            
            setAudioStream(stream);

            if (!window.MediaRecorder) {
                throw new Error('MediaRecorder API is not supported in this browser');
            }

            const mimeType = getCompatibleMimeType();
            const options = mimeType ? { mimeType } : {};

            const recorder = new MediaRecorder(stream, options);
            
            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunks.current.push(e.data);
                }
            };

            recorder.onerror = (e) => {
                console.error("MediaRecorder error:", e);
                const errorMsg = "Recording error occurred. Please try again.";
                setError(errorMsg);
                if (onError) onError(errorMsg);
                stopRecording();
            };

            recorder.onstop = async () => {
                clearInterval(timerRef.current);
                const duration = finalDurationRef.current;

                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }

                if (chunks.current.length === 0) {
                    const errorMsg = "No audio data recorded. Please try again.";
                    setError(errorMsg);
                    if (onError) onError(errorMsg);
                    return;
                }

                try {
                    // Create blob with detected MIME type
                    const blobMimeType = recorder.mimeType || 'audio/webm';
                    const originalBlob = new Blob(chunks.current, { type: blobMimeType });
                    chunks.current = [];

                    let finalBlob = originalBlob;
                    let finalMimeType = blobMimeType;
                    let finalExtension = 'webm';
                    let actualDuration = duration;

                    // Convert to WAV if Web Audio API is supported and conversion is needed
                    if (isWebAudioSupported() && needsConversion(blobMimeType)) {
                        try {
                            setIsConverting(true);
                            setError(null);
                            
                            // Convert to WAV
                            finalBlob = await convertToWav(originalBlob, blobMimeType);
                            finalMimeType = 'audio/wav';
                            finalExtension = 'wav';
                            
                            // Get accurate duration from audio buffer
                            try {
                                const detectedDuration = await getAudioDuration(originalBlob, blobMimeType);
                                if (detectedDuration > 0) {
                                    actualDuration = detectedDuration;
                                }
                            } catch (durError) {
                                console.warn('Could not detect duration, using recorded time:', durError);
                                // Use recorded duration as fallback
                            }
                            
                            console.log('Audio converted to WAV successfully');
                        } catch (conversionError) {
                            console.error('WAV conversion failed, using original format:', conversionError);
                            const errorMsg = "Warning: Could not convert to WAV format. Using original format.";
                            setError(errorMsg);
                            if (onError) onError(errorMsg);
                            // Fallback to original blob
                            finalBlob = originalBlob;
                            finalMimeType = blobMimeType;
                            finalExtension = getFileExtension(blobMimeType);
                        } finally {
                            setIsConverting(false);
                        }
                    } else {
                        // No conversion needed or Web Audio API not supported
                        finalExtension = getFileExtension(blobMimeType);
                        
                        // Try to get duration if Web Audio API is available
                        if (isWebAudioSupported()) {
                            try {
                                const detectedDuration = await getAudioDuration(originalBlob, blobMimeType);
                                if (detectedDuration > 0) {
                                    actualDuration = detectedDuration;
                                }
                            } catch (durError) {
                                console.warn('Could not detect duration:', durError);
                            }
                        }
                    }

                    // Generate filename with correct extension
                    const fileName = `recording_${Date.now()}.${finalExtension}`;
                    const file = new File([finalBlob], fileName, { type: finalMimeType });
                    
                    // Update duration ref
                    finalDurationRef.current = actualDuration;
                    
                    setRecordedFile(file);
                    const url = URL.createObjectURL(file);
                    setAudioURL(url);
                    setIsRecording(false);
                    setRecordTime(0);

                    // Callback with recording data
                    if (onRecordingComplete) {
                        onRecordingComplete(file, finalBlob, actualDuration);
                    }

                    // Auto-play if enabled
                    if (autoPlay && audioRef.current) {
                        setTimeout(() => {
                            audioRef.current?.play().catch(err => {
                                console.error("Auto-play failed:", err);
                            });
                        }, 100);
                    }
                } catch (error) {
                    console.error('Error processing recording:', error);
                    const errorMsg = "Failed to process recording: " + error.message;
                    setError(errorMsg);
                    if (onError) onError(errorMsg);
                    setIsRecording(false);
                    setRecordTime(0);
                }
            };

            recorder.start(100);
            setMediaRecorder(recorder);
            
            finalDurationRef.current = 0;
            setRecordTime(0);
            setIsRecording(true);
            setIsTimerRunning(true);
            
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            
            timerRef.current = setInterval(() => {
                setRecordTime(prev => {
                    const newTime = prev + 1;
                    finalDurationRef.current = newTime;
                    
                    // Check max duration
                    if (maxDuration > 0 && newTime >= maxDuration) {
                        stopRecording();
                    }
                    
                    return newTime;
                });
            }, 1000);

        } catch (error) {
            console.error("Recording error:", error);
            setIsRecording(false);
            
            let errorMessage = "Failed to start recording";
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                errorMessage = "Please allow microphone permission to start recording.";
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                errorMessage = "No microphone found. Please connect a microphone and try again.";
            } else if (error.name === 'NotSupportedError') {
                errorMessage = "Your browser doesn't support audio recording. Please use a modern browser.";
            } else {
                errorMessage = "Failed to start recording: " + (error.message || "Unknown error");
            }
            
            setError(errorMessage);
            if (onError) onError(errorMessage);
        }
    };

    const stopRecording = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsTimerRunning(false);
        
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        
        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
            setAudioStream(null);
        }
    };

    const deleteRecording = () => {
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }
        
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        
        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
            setAudioStream(null);
        }
        
        setAudioURL(null);
        setRecordedFile(null);
        setAudioDuration(null);
        setIsRecording(false);
        setIsTimerRunning(false);
        setIsPlaying(false);
        setIsMuted(false);
        setVolume(1);
        setCurrentTime(0);
        setRecordTime(0);
        chunks.current = [];
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setError(null);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }

        if (onDelete) {
            onDelete();
        }
    };

    const togglePlayPause = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Playback error:", error);
                    const errorMsg = "Unable to play audio. Please try again.";
                    setError(errorMsg);
                    if (onError) onError(errorMsg);
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

    // Handle audio events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
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

        setIsMuted(audio.muted);
        setVolume(audio.muted ? 0 : audio.volume);
        setCurrentTime(audio.currentTime || 0);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('volumechange', handleVolumeChange);
        audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('volumechange', handleVolumeChange);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [audioURL]);

    return (
        <div className={`audio-recorder-wrapper ${className}`} style={style}>
            <style>{`
                /* Custom White Theme Audio Player */
                .custom-audio-player {
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    box-shadow: 0px 0px 5px #b9b9b9;
                    transition: box-shadow 0.3s ease;
                }
                
                .custom-audio-player:hover {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
                                0 4px 6px -2px rgba(0, 0, 0, 0.05),
                                0 0 0 1px rgba(0, 0, 0, 0.05);
                }
                
                /* Responsive Design - Mobile 2 Row Layout */
                @media (max-width: 640px) {
                    .custom-audio-player {
                        padding: 14px 16px;
                        gap: 0;
                        flex-direction: column;
                    }
                    
                    .custom-audio-player .row-1 {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        gap: 12px;
                        margin-bottom: 12px;
                    }
                    
                    .custom-audio-player .row-1 .play-button {
                        flex-shrink: 0;
                    }
                    
                    .custom-audio-player .row-1 .progress-section {
                        flex: 1;
                        min-width: 0;
                    }
                    
                    .custom-audio-player .row-2 {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        gap: 12px;
                    }
                    
                    .custom-audio-player .row-2 .speaker-button {
                        flex-shrink: 0;
                    }
                    
                    .custom-audio-player .row-2 .volume-section {
                        flex: 1;
                        min-width: 0;
                        max-width: none;
                    }
                }
                
                /* Custom Range Slider Styles */
                input[type="range"].slider,
                input[type="range"].volume-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    outline: none;
                    background: transparent;
                    cursor: pointer;
                }
                
                input[type="range"].slider {
                    height: 5px;
                }
                
                input[type="range"].slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #1f2937;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 
                                0 0 0 2px rgba(31, 41, 55, 0.1);
                    transition: all 0.2s ease;
                    margin-top: -5.5px;
                }
                
                input[type="range"].slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #1f2937;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 
                                0 0 0 2px rgba(31, 41, 55, 0.1);
                    transition: all 0.2s ease;
                }
                
                input[type="range"].slider::-webkit-slider-thumb:hover,
                input[type="range"].slider::-webkit-slider-thumb:active {
                    transform: scale(1.15);
                    background: #111827;
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3), 
                                0 0 0 3px rgba(31, 41, 55, 0.15);
                }
                
                input[type="range"].slider::-moz-range-thumb:hover,
                input[type="range"].slider::-moz-range-thumb:active {
                    transform: scale(1.15);
                    background: #111827;
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3), 
                                0 0 0 3px rgba(31, 41, 55, 0.15);
                }
                
                input[type="range"].slider::-webkit-slider-runnable-track {
                    height: 5px;
                    border-radius: 3px;
                    background: transparent;
                }
                
                input[type="range"].slider::-moz-range-track {
                    height: 5px;
                    border-radius: 3px;
                    background: transparent;
                }
                
                input[type="range"].volume-slider {
                    height: 5px;
                }
                
                input[type="range"].volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #1f2937;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 
                                0 0 0 2px rgba(31, 41, 55, 0.1);
                    transition: all 0.2s ease;
                    margin-top: -5.5px;
                }
                
                input[type="range"].volume-slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #1f2937;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 
                                0 0 0 2px rgba(31, 41, 55, 0.1);
                    transition: all 0.2s ease;
                }
                
                input[type="range"].volume-slider::-webkit-slider-thumb:hover,
                input[type="range"].volume-slider::-webkit-slider-thumb:active {
                    transform: scale(1.15);
                    background: #111827;
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3), 
                                0 0 0 3px rgba(31, 41, 55, 0.15);
                }
                
                input[type="range"].volume-slider::-moz-range-thumb:hover,
                input[type="range"].volume-slider::-moz-range-thumb:active {
                    transform: scale(1.15);
                    background: #111827;
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3), 
                                0 0 0 3px rgba(31, 41, 55, 0.15);
                }
                
                input[type="range"].volume-slider::-webkit-slider-runnable-track {
                    height: 5px;
                    border-radius: 3px;
                    background: transparent;
                }
                
                input[type="range"].volume-slider::-moz-range-track {
                    height: 5px;
                    border-radius: 3px;
                    background: transparent;
                }
            `}</style>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Recording State */}
            {isRecording && (
                <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-sm text-center">
                    Recording... {formatDuration(recordTime)}
                    {maxDuration > 0 && ` / ${formatDuration(maxDuration)}`}
                </div>
            )}

            {/* Converting State */}
            {isConverting && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-sm text-center">
                    Converting to WAV format... Please wait.
                </div>
            )}

            {/* Mic Button - Show when no recording exists */}
            {showMicButton && !audioURL && !isRecording && (
                <div className="flex justify-center mb-4">
                    <button
                        onClick={startRecording}
                        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-orange-400 to-pink-500 hover:scale-105"
                    >
                        <Mic className="text-white" size={24} />
                    </button>
                </div>
            )}

            {/* Recording State - Show when recording */}
            {isRecording && (
                <div className="flex justify-center mb-4">
                    <button
                        onClick={stopRecording}
                        className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center animate-pulse"
                    >
                        <Mic className="text-white" size={22} />
                    </button>
                </div>
            )}

            {/* Audio Player - Show when recording exists */}
            {audioURL && !isRecording && showControls && (
                <>
                    {/* Hidden audio element */}
                    <audio
                        ref={audioRef}
                        playsInline
                        preload="metadata"
                        src={audioURL}
                        style={{ display: 'none' }}
                        {...(isIOS && { webkitPlaysinline: true })}
                        onError={(e) => {
                            console.error("Audio playback error:", e);
                            const errorMsg = "Unable to play audio. The file may be corrupted.";
                            setError(errorMsg);
                            if (onError) onError(errorMsg);
                        }}
                        onLoadedMetadata={(e) => {
                            const duration = e.target.duration;
                            if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
                                setAudioDuration(duration);
                            } else {
                                setAudioDuration(null);
                            }
                        }}
                        onDurationChange={(e) => {
                            const duration = e.target.duration;
                            if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
                                setAudioDuration(duration);
                            }
                        }}
                    >
                        Your browser does not support the audio element.
                    </audio>

                    {/* Custom Audio Player */}
                    <div className="custom-audio-player w-full max-w-[600px] mx-auto">
                        {/* Desktop Layout - Single Row */}
                        <div className="hidden md:flex items-center gap-4 w-full">
                            {/* Play/Pause Button */}
                            <button
                                onClick={togglePlayPause}
                                className="flex items-center justify-center transition-all hover:scale-110 active:scale-95 flex-shrink-0"
                                aria-label={isPlaying ? "Pause audio" : "Play audio"}
                            >
                                {isPlaying ? (
                                    <Pause className="text-gray-500" size={22} />
                                ) : (
                                    <Play className="text-gray-500 ml-0.5" size={22} />
                                )}
                            </button>

                            {/* Progress Bar Section */}
                            <div className="progress-section flex-1 flex flex-col gap-2 min-w-0">
                                {/* Progress Bar */}
                                <div className="relative w-full">
                                    <div
                                        className="absolute top-1/2 left-0 h-[5px] rounded-[3px] -translate-y-1/2 bg-gray-600"
                                        style={{
                                            width: `${(currentTime / (audioDuration && isFinite(audioDuration) && audioDuration > 0 ? audioDuration : (finalDurationRef.current || 1))) * 100}%`
                                        }}
                                    />
                                    <div
                                        className="absolute top-1/2 right-0 h-[5px] rounded-[3px] -translate-y-1/2 bg-gray-200"
                                        style={{
                                            width: `${100 - (currentTime / (audioDuration && isFinite(audioDuration) && audioDuration > 0 ? audioDuration : (finalDurationRef.current || 1))) * 100}%`
                                        }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max={audioDuration && isFinite(audioDuration) && audioDuration > 0 ? audioDuration : (finalDurationRef.current || 0)}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="w-full slider relative z-10"
                                    />
                                </div>
                            </div>

                            {/* Speaker Icon */}
                            <button
                                onClick={toggleMute}
                                className="flex items-center justify-center transition-all hover:scale-110 active:scale-95 flex-shrink-0"
                                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                            >
                                {isMuted ? (
                                    <VolumeX className="text-gray-500" size={22} />
                                ) : (
                                    <Volume2 className="text-gray-500" size={22} />
                                )}
                            </button>

                            {/* Volume Slider */}
                            <div className="volume-section flex-1 min-w-[100px] max-w-[150px] relative">
                                <div
                                    className="absolute top-1/2 left-0 h-[5px] rounded-[3px] -translate-y-1/2 bg-gray-600"
                                    style={{
                                        width: `${(isMuted ? 0 : volume) * 100}%`
                                    }}
                                />
                                <div
                                    className="absolute top-1/2 right-0 h-[5px] rounded-[3px] -translate-y-1/2 bg-gray-200"
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
                                    className="w-full volume-slider relative z-10"
                                />
                            </div>
                        </div>

                        {/* Mobile Layout - 2 Rows */}
                        <div className="flex md:hidden flex-col w-full">
                            {/* Row 1: Duration with Play/Pause */}
                            <div className="row-1">
                                <button
                                    onClick={togglePlayPause}
                                    className="play-button flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                    aria-label={isPlaying ? "Pause audio" : "Play audio"}
                                >
                                    {isPlaying ? (
                                        <Pause className="text-gray-500" size={22} />
                                    ) : (
                                        <Play className="text-gray-500 ml-0.5" size={22} />
                                    )}
                                </button>

                                <div className="progress-section flex-1 flex flex-col gap-2 min-w-0">
                                    <div className="text-gray-700 text-xs font-medium text-center whitespace-nowrap">
                                        {formatDuration(currentTime)} / {
                                            (audioDuration && isFinite(audioDuration) && audioDuration > 0) 
                                                ? formatDuration(audioDuration) 
                                                : formatDuration(finalDurationRef.current || 0)
                                        }
                                    </div>
                                    
                                    <div className="relative w-full">
                                        <div
                                            className="absolute top-1/2 left-0 h-[5px] rounded-[3px] -translate-y-1/2 bg-gray-600"
                                            style={{
                                                width: `${(currentTime / (audioDuration && isFinite(audioDuration) && audioDuration > 0 ? audioDuration : (finalDurationRef.current || 1))) * 100}%`
                                            }}
                                        />
                                        <div
                                            className="absolute top-1/2 right-0 h-[5px] rounded-[3px] -translate-y-1/2 bg-gray-200"
                                            style={{
                                                width: `${100 - (currentTime / (audioDuration && isFinite(audioDuration) && audioDuration > 0 ? audioDuration : (finalDurationRef.current || 1))) * 100}%`
                                            }}
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max={audioDuration && isFinite(audioDuration) && audioDuration > 0 ? audioDuration : (finalDurationRef.current || 0)}
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="w-full slider relative z-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Speaker Icon with Volume Slider */}
                            <div className="row-2">
                                <button
                                    onClick={toggleMute}
                                    className="speaker-button flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                                >
                                    {isMuted ? (
                                        <VolumeX className="text-gray-500" size={22} />
                                    ) : (
                                        <Volume2 className="text-gray-500" size={22} />
                                    )}
                                </button>

                                <div className="volume-section flex-1 relative">
                                    <div
                                        className="absolute top-1/2 left-0 h-[5px] rounded-[3px] -translate-y-1/2 bg-gray-600"
                                        style={{
                                            width: `${(isMuted ? 0 : volume) * 100}%`
                                        }}
                                    />
                                    <div
                                        className="absolute top-1/2 right-0 h-[5px] rounded-[3px] -translate-y-1/2 bg-gray-200"
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
                                        className="w-full volume-slider relative z-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AudioRecorder;
