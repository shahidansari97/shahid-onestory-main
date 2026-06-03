import React from "react";
import { useState, useEffect } from "react";
import "../../../css/story.css";
import "../../../css/home.css";
import "../../../css/form.css";
import "../../../css/gift.css";
import "../../../css/allheighlightstory.css";
import {
    Mic, Trash2,
    Lock,
    Share2,
    Pencil,
    ArrowLeft,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Volume1,
    ChevronUp,
    ChevronDown
} from "lucide-react";

import profilecover from "./../../../img/profile-cover.jpg";
import Profile from "./../../../img/profile.jpg";
import {
    Modal,
} from "@mui/material";
import GuestLayout from "@/Layouts/GuestLayout";
import { Img } from "@/Components/UI/Content.jsx";
import { usePage, router, Link, Head } from "@inertiajs/react";
import { useRef } from "react";
import axios from "axios";
import { convertToWav, getAudioDuration, isWebAudioSupported, needsConversion } from "@/Utils/audioConverter";

const Recorder = ({ data }) => {
    const { user } = data;
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const UserCoverImage = user.cover_photo ? user.cover_photo : profilecover;
    const { auth } = usePage().props;
    const visibility =
        auth?.user?.id === user?.id ? true : user?.visibility ? true : false;

    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioStream, setAudioStream] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedFile, setRecordedFile] = useState(null);
    const [recordTime, setRecordTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isPrivateMessage, setIsPrivateMessage] = useState(false);
    const [isPublicMessage, setIsPublicMessage] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1); // 0 to 1
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);
    const finalDurationRef = useRef(0);
    const timerRef = useRef(null);
    const chunks = useRef([]);
    // const MAX_RECORD_TIME = 0;

    // Detect device type
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isIOSDevice = /iPhone|iPad|iPod/i.test(userAgent);
        const isAndroidDevice = /Android/i.test(userAgent);
        setIsIOS(isIOSDevice);
        setIsAndroid(isAndroidDevice);

        // Check if MediaDevices API is available
        // if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        //     setError('Your browser does not support audio recording. Please use HTTPS or a modern browser (Chrome, Firefox, Safari, Edge).');
        // }

        // // Check if MediaRecorder API is available
        // if (!window.MediaRecorder) {
        //     setError('Your browser does not support MediaRecorder API. Please use a modern browser.');
        // }

        // // Check if running on insecure context (not HTTPS)
        // if (window.location.protocol !== 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        //     setError('Audio recording requires a secure connection (HTTPS). Please access this page via HTTPS.');
        // }
    }, []);

    // Cleanup on unmount only
    useEffect(() => {
        return () => {
            // Only cleanup on component unmount, not on state changes
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
    }, []); // Empty dependency array - only run on unmount


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
        return ''; // Browser will use default
    };

    // Get file extension based on MIME type
    const getFileExtension = (mimeType) => {
        if (mimeType.includes('webm')) return 'webm';
        if (mimeType.includes('mp4')) return 'm4a';
        if (mimeType.includes('mpeg')) return 'mp3';
        if (mimeType.includes('ogg')) return 'ogg';
        if (mimeType.includes('wav')) return 'wav';
        if (mimeType.includes('aac')) return 'aac';
        return 'webm'; // default
    };

    const startRecording = async () => {
        try {
            // Reset and initialize recording state
            finalDurationRef.current = 0;
            setRecordTime(0);
            setError(null);
            chunks.current = [];

            // Clear any existing timer first
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            // Check if mediaDevices API is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('MediaDevices API is not supported. Please use HTTPS or a modern browser.');
            }

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100,
                }
            });

            setAudioStream(stream);

            // Check if MediaRecorder is supported
            if (!window.MediaRecorder) {
                throw new Error('MediaRecorder API is not supported in this browser');
            }

            // Get compatible MIME type
            const mimeType = getCompatibleMimeType();
            const options = mimeType ? { mimeType } : {};

            // Create MediaRecorder with compatible options
            const recorder = new MediaRecorder(stream, options);

            console.log("MediaRecorder created with MIME type:", recorder.mimeType || 'default');
            console.log("Supported types:", MediaRecorder.isTypeSupported);

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunks.current.push(e.data);
                }
            };

            recorder.onerror = (e) => {
                console.error("MediaRecorder error:", e);
                setError("Recording error occurred. Please try again.");
                stopRecording();
            };

            recorder.onstop = async () => {
                clearInterval(timerRef.current);
                const duration = finalDurationRef.current;

                // Stop all tracks
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }

                if (chunks.current.length === 0) {
                    setError("No audio data recorded. Please try again.");
                    alert("No audio data recorded. Please try again.");
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
                            setLoading(true);
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
                            setError("Warning: Could not convert to WAV format. Using original format.");
                            // Fallback to original blob
                            finalBlob = originalBlob;
                            finalMimeType = blobMimeType;
                            finalExtension = getFileExtension(blobMimeType);
                        } finally {
                            setLoading(false);
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
                    const fileName = generateName(finalExtension);
                    const file = new File([finalBlob], fileName, { type: finalMimeType });

                    // Store actual duration for upload
                    finalDurationRef.current = actualDuration;

                    setRecordedFile(file);
                    const url = URL.createObjectURL(file);
                    setAudioURL(url);
                    setIsRecording(false);
                    setRecordTime(0);
                } catch (error) {
                    console.error('Error processing recording:', error);
                    setError("Failed to process recording: " + error.message);
                    setIsRecording(false);
                    setRecordTime(0);
                }
            };

            // Start recording with timeslice for better compatibility
            recorder.start(100); // Collect data every 100ms
            setMediaRecorder(recorder);

            // Reset timer values
            finalDurationRef.current = 0;
            setRecordTime(0);

            // Set recording state first
            setIsRecording(true);

            // Clear any existing timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            // Start timer immediately
            setIsTimerRunning(true);

            // Ensure timer is cleared before starting
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            // Start timer that updates every second
            // Use a function to ensure we capture the latest state
            timerRef.current = setInterval(() => {
                setRecordTime(prev => {
                    const newTime = prev + 1;
                    finalDurationRef.current = newTime;
                    console.log("Recording time:", newTime, "seconds"); // Debug log
                    return newTime;
                });
            }, 1000);

            console.log("Timer started, ID:", timerRef.current);

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
            alert(errorMessage);
        }
    };
    const stopRecording = () => {
        // Only enforce minimum time if MAX_RECORD_TIME is greater than 0
        // if (MAX_RECORD_TIME > 0 && recordTime < MAX_RECORD_TIME) {
        //     alert(`Recording will stop after ${MAX_RECORD_TIME} second(s)`);
        //     return;
        // }

        // Stop timer first
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsTimerRunning(false);

        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }

        // Stop stream tracks
        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
            setAudioStream(null);
        }
    };

    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // iOS requires user interaction to play audio
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // console.error("Playback error:", error);
                    // setError("Unable to play audio. Please try again.");
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

    const increaseVolume = () => {
        if (!audioRef.current) return;
        const newVolume = Math.min(1, audioRef.current.volume + 0.1);
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
        if (audioRef.current.muted && newVolume > 0) {
            audioRef.current.muted = false;
            setIsMuted(false);
        }
    };

    const decreaseVolume = () => {
        if (!audioRef.current) return;
        const newVolume = Math.max(0, audioRef.current.volume - 0.1);
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
        if (newVolume === 0) {
            audioRef.current.muted = true;
            setIsMuted(true);
        }
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

        // Initialize states
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

    const deleteRecording = () => {
        // Revoke object URL to free memory
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }

        // Stop any active recording
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }

        // Stop stream tracks
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
    };
    const uploadAudio = async (type) => {
        if (!recordedFile) {
            alert("No audio to upload");
            return;
        }
        if (type === 'private') {
            setIsPrivateMessage(true);
        } else if (type === 'public') {
            setIsPublicMessage(true);
        } else {
            setIsPrivateMessage(false);
            setIsPublicMessage(false);
        }

        setLoading(true);
        setError(null);

        const form = new FormData();
        form.append("userId", auth?.user?.id);
        form.append("audio", recordedFile);
        form.append("publish_type", type);
        form.append("recording_type", "quick");
        // Send duration as a number (seconds)
        const duration = finalDurationRef.current || 0;
        form.append("finalDurationRef_current", duration.toString());

        console.log('Uploading audio:', {
            fileName: recordedFile.name,
            fileType: recordedFile.type,
            fileSize: recordedFile.size,
            duration: duration
        });

        try {
            const response = await axios.post(route('user.recorder.store'), form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    // console.log(`Upload progress: ${percentCompleted}%`);

                },

            });

            if (response.data?.status) {
                deleteRecording();
                setTimeout(() => {
                    setIsPrivateMessage(false);
                    setIsPublicMessage(false);

                    // alert(`Your ${type} recording is saved in MySpace`);
                    deleteRecording();
                }, 3000);
            } else {
                throw new Error(response.data?.message || "Upload failed");
            }
        } catch (error) {
            // console.error("Upload failed:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || "Failed to upload audio. Please try again.";
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    const generateName = (extension = 'webm') => {
        const now = new Date();
        return `voice_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-` +
            `${String(now.getDate()).padStart(2, '0')}_` +
            `${String(now.getHours()).padStart(2, '0')}-` +
            `${String(now.getMinutes()).padStart(2, '0')}-` +
            `${String(now.getSeconds()).padStart(2, '0')}.${extension}`;
    };

    // Format duration in seconds to MM:SS or HH:MM:SS
    const formatDuration = (seconds) => {
        // Handle invalid values: null, undefined, NaN, Infinity
        if (!seconds || isNaN(seconds) || !isFinite(seconds)) {
            return '00:00';
        }

        // Ensure seconds is a valid number
        const secs = Math.max(0, Math.floor(seconds));
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const remainingSecs = secs % 60;

        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
        }
        return `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <>
            <GuestLayout addContainer={false}>
                <Head title="Recorder">
                    <style>{`
                        /* Custom White Theme Audio Player */
                        .custom-audio-player {
                                        background: #ffffff;
                                        border-radius: 12px;
                                        padding: 10px 18px;
                                        display: flex;
                                        align-items: center;
                                        gap: 16px;
                                        /* box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                                        0 2px 4px -1px rgba(0, 0, 0, 0.06),
                                        0 0 0 1px rgba(0, 0, 0, 0.05); */
                                         transition: box-shadow 0.3s ease;
                                         box-shadow: 0px 0px 5px #b9b9b9;
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
                            
                            /* Row 1: Duration with Play/Pause */
                            .custom-audio-player .row-1 {
                                display: flex;
                                align-items: center;
                                width: 100%;
                                gap: 12px;
                                // margin-bottom: 12px;
                            }
                            
                            .custom-audio-player .row-1 .play-button {
                                flex-shrink: 0;
                            }
                            
                            .custom-audio-player .row-1 .progress-section {
                                flex: 1;
                                min-width: 0;
                            }
                            
                            /* Row 2: Speaker Icon with Volume Slider */
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
                        
                        /* Custom Range Slider Styles - White Theme */
                        input[type="range"].slider,
                        input[type="range"].volume-slider {
                            -webkit-appearance: none;
                            appearance: none;
                            outline: none;
                            background: transparent;
                            cursor: pointer;
                        }
                        
                        /* Progress Bar Slider - Black thumb */
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
                        
                        /* Volume Slider - Black thumb */
                        input[type="range"].volume-slider {
                            height: 10px;
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

                        /* Mobile Audio Player Styles */
                        audio.audio-player-mobile {
                            -webkit-appearance: none !important;
                            appearance: none !important;
                        }
                        
                        audio.audio-player-mobile::-webkit-media-controls-panel {
                            background-color: #f3f4f6 !important;
                            border-radius: 8px !important;
                        }
                        
                        audio.audio-player-mobile::-webkit-media-controls-play-button {
                            background-color: #f97316 !important;
                            border-radius: 50% !important;
                        }
                        
                        /* Hide the entire timeline container (progress bar) */
                        audio.audio-player-mobile::-webkit-media-controls-timeline-container {
                            display: none !important;
                            visibility: hidden !important;
                            width: 0 !important;
                            height: 0 !important;
                            opacity: 0 !important;
                        }
                        
                        /* Hide time displays and progress bar */
                        audio.audio-player-mobile::-webkit-media-controls-current-time-display,
                        audio.audio-player-mobile::-webkit-media-controls-time-remaining-display {
                            display: none !important;
                        }
                        
                        /* Hide the progress bar/timeline (red indicator) completely */
                        audio.audio-player-mobile::-webkit-media-controls-timeline {
                            display: none !important;
                            visibility: hidden !important;
                            width: 0 !important;
                            height: 0 !important;
                            opacity: 0 !important;
                            -webkit-appearance: none !important;
                            appearance: none !important;
                        }
                        
                        /* Hide progress indicator for Firefox and other browsers */
                        audio.audio-player-mobile::-moz-range-track {
                            display: none !important;
                        }
                        
                        audio.audio-player-mobile::-moz-range-progress {
                            display: none !important;
                        }
                        
                        /* Hide the timeline container wrapper */
                        audio.audio-player-mobile::-webkit-media-controls-timeline-container {
                            display: none !important;
                            visibility: hidden !important;
                            width: 0 !important;
                            height: 0 !important;
                            opacity: 0 !important;
                        }
                        
                        /* Additional selectors to hide progress bar */
                        audio.audio-player-mobile::-webkit-media-controls-timeline::-webkit-slider-runnable-track {
                            display: none !important;
                        }
                        
                        audio.audio-player-mobile::-webkit-media-controls-timeline::-webkit-slider-thumb {
                            display: none !important;
                        }
                        
                        /* Ensure controls are visible on mobile */
                        @media (max-width: 768px) {
                            audio.audio-player-mobile {
                                min-height: 56px !important;
                                height: auto !important;
                            }
                            
                            audio.audio-player-mobile::-webkit-media-controls-panel {
                                display: flex !important;
                                flex-direction: row !important;
                                align-items: center !important;
                            }
                        }
                    `}</style>
                </Head>

                {/* <div className="user-profile">
                    <div className="card hovercard text-center">

                        <div style={{ padding: 40 }}>
                            <h2>Voice Recorder</h2>

                            {isRecording && (
                                <div style={{ color: "red", fontWeight: "bold" }}>
                                    REC{" "}
                                    {Math.floor(recordTime / 60)
                                        .toString()
                                        .padStart(2, "0")}
                                    :
                                    {(recordTime % 60).toString().padStart(2, "0")}
                                </div>
                            )}

                            {!isRecording && !audioURL && (
                                <button onClick={startRecording}>Start Recording</button>
                            )}

                            {isRecording && (
                                <>
                                    <button onClick={stopRecording}>Stop</button>
                                    <button onClick={deleteRecording}>Delete</button>
                                </>
                            )}

                            {audioURL && !isRecording && (
                                <>
                                    <audio controls src={audioURL} />
                                    <br />
                                    <button onClick={startRecording}>Record Again</button>
                                    <br />
                                    <button onClick={() => uploadAudio("private")}>
                                        Publish as Private
                                    </button>
                                    <br />
                                    <button onClick={() => uploadAudio("public")}>
                                        Publish as Public
                                    </button>
                                    <br />
                                    <button onClick={deleteRecording}>Delete</button>
                                </>
                            )}
                        </div>
                    </div>
                </div> */}

                <div className="md:min-h-screen md:flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 px-4">
                    <div className="w-full md:max-w-[30rem]    p-6 text-center">

                        {/* Title */}
                        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                            Say Anything
                        </h1>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Loading Indicator */}
                        {/* {loading && (
                            <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-sm text-center">
                                {isRecording ? 'Processing audio...' : 'Uploading audio...'}
                            </div>
                        )} */}

                        {/* Mic Button */}
                        <div className="flex justify-center  bg-white p-[2.5rem] rounded-xl mb-3">


                            {!isRecording && !audioURL && (
                                // <button onClick={startRecording}>Start Recording</button>
                                <button onClick={startRecording} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-orange-400 to-pink-500 hover:scale-105`} >
                                    <div className="">
                                        <Mic className="text-white" />
                                    </div>
                                </button>
                            )}


                            {isRecording && (
                                <div className="flex flex-col gap-3 items-center">
                                    <button onClick={stopRecording}
                                        className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center animate-breatheSoft">
                                        <Mic className="text-white" size={22} />
                                    </button>
                                    <p>Press to stop</p>
                                    <div className="text-red-500 font-bold text-lg flex items-center gap-2">

                                        {/*<span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>*/}
                                        {/*<span>REC</span>*/}
                                        {/* <span className="font-mono min-w-[50px] text-left">
                                            {String(Math.floor(recordTime / 60)).padStart(2, "0")}
                                            :
                                            {String(recordTime % 60).padStart(2, "0")}
                                        </span>*/}
                                    </div>
                                    {/* Debug info - remove in production */}
                                    {process.env.NODE_ENV === 'development' && (
                                        <div className="text-xs text-gray-400">
                                            Timer: {isTimerRunning ? 'Running' : 'Stopped'} | State: {recordTime}s | Ref: {finalDurationRef.current}s
                                        </div>
                                    )}
                                </div>
                            )}


                            {audioURL && !isRecording && (
                                <div className="flex flex-col gap-3 items-center">
                                    <button onClick={startRecording} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-orange-400 to-pink-500 hover:scale-105`} >
                                        <div className="">
                                            <Mic className="text-white" />
                                        </div>
                                    </button>

                                </div>
                            )}

                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            {audioURL && !isRecording && (
                                <div className="max-w-[300px] flex flex-col gap-2 items-center">
                                    {/* Hidden audio element for playback */}
                                    <audio
                                        ref={audioRef}
                                        playsInline
                                        preload="metadata"
                                        src={audioURL}
                                        style={{
                                            display: 'none',
                                        }}
                                        {...(isIOS && { webkitPlaysinline: true })}
                                        onError={(e) => {
                                            // console.error("Audio playback error:", e);
                                            // setError("Unable to play audio. The file may be corrupted.");
                                        }}
                                        onLoadedMetadata={(e) => {
                                            const duration = e.target.duration;
                                            // Only set duration if it's valid (not Infinity, not NaN, and finite)
                                            if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
                                                setAudioDuration(duration);
                                                console.log("Audio metadata loaded successfully, duration:", duration);
                                            } else {
                                                console.warn("Invalid audio duration:", duration, "- using recorded time instead");
                                                // Use recorded time as fallback
                                                setAudioDuration(null);
                                            }
                                        }}
                                        onDurationChange={(e) => {
                                            const duration = e.target.duration;
                                            // Only update if duration is valid
                                            if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
                                                setAudioDuration(duration);
                                            }
                                        }}
                                    >
                                        Your browser does not support the audio element.
                                    </audio>

                                    {/* Custom White Theme Audio Player */}
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
                                            {/* <div className="progress-section flex-1 flex flex-col gap-2 min-w-0">
                                                  
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
                                                </div> */}

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
                                            {/* <div className="volume-section flex-1 min-w-[100px] max-w-[150px] relative">
                                                   
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
                                                </div> */}
                                        </div>

                                        {/* Mobile Layout - 2 Rows */}
                                        <div className="flex md:hidden items-center w-full">
                                            {/* Row 1: Duration with Play/Pause */}
                                            <div className="row-1">
                                                {/* Play/Pause Button */}
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

                                                {/* Progress Bar Section with Duration */}
                                                <div className="progress-section flex-1 flex flex-col gap-2 min-w-0">
                                                    {/* Time Duration Display */}
                                                    {/* <div className="text-gray-700 text-xs font-medium text-center whitespace-nowrap">
                                                            {formatDuration(currentTime)} / {
                                                                (audioDuration && isFinite(audioDuration) && audioDuration > 0) 
                                                                    ? formatDuration(audioDuration) 
                                                                    : formatDuration(finalDurationRef.current || 0)
                                                            }
                                                        </div> */}

                                                    {/* Progress Bar */}
                                                    {/* <div className="relative w-full">
                                                            
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
                                                        </div> */}
                                                </div>
                                            </div>

                                            {/* Row 2: Speaker Icon with Volume Slider */}
                                            <div className="row-2">
                                                {/* Speaker Icon */}
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

                                                {/* Volume Slider */}
                                                {/* <div className="volume-section flex-1 relative">
                                                      
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
                                                    </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


                        <div className="space-y-3 md:max-w-[80%] mx-auto px-5  mt-3">

                            <button
                                onClick={deleteRecording}
                                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all
                                    flex items-center justify-start px-3 gap-2
                                    ${(!audioURL || isRecording || loading)
                                        ? "allbtn-disabled opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                                        : "bg-white text-gray-900 hover:bg-[linear-gradient(57.17deg,_#9DC2F6_0.14%,_#9DC2F6_0.15%,_#E9C9C6_85%)] hover:text-white"
                                    }
                                `}
                                disabled={!audioURL || isRecording || loading}
                            >
                                <Trash2 size={18} />
                                Delete
                            </button>

                            <button onClick={() => uploadAudio("private")}
                                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex justify-between items-center px-3 gap-2 ${(!audioURL || isRecording || loading)
                                    ? "allbtn-disabled opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                                    : "hover:bg-white hover:text-black"
                                    }`}
                                style={
                                    (!audioURL || isRecording || loading)
                                        ? undefined
                                        : { background: "var(--gradient-1)", color: "white" }
                                }
                                disabled={!audioURL || isRecording || loading}
                            >
                                <span className="flex gap-[9px] items-center">
                                    <Lock size={18} />
                                    <span>Publish as Private</span>
                                </span>

                                <span>
                                    (default)
                                </span>

                            </button>
                            {/* Private upload message */}
                            {isPrivateMessage && (
                                <p className="text-xs text-gray-700 mt-2">
                                    Private recordings are stored in MySpace
                                </p>
                            )}

                            <button onClick={() => uploadAudio("public")}
                                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all
                                flex items-center justify-start px-3 gap-2 ${(!audioURL || isRecording || loading)
                                        ? "allbtn-disabled opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                                        : "bg-white text-gray-900 hover:bg-[linear-gradient(57.17deg,_#9DC2F6_0.14%,_#9DC2F6_0.15%,_#E9C9C6_85%)] hover:text-white"
                                    }`}
                                disabled={!audioURL || isRecording || loading}
                            >
                                <Share2 size={18} />
                                Publish as Public
                            </button>

                            {/* <button
                                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all
                                bg-white text-gray-900 hover:bg-[linear-gradient(57.17deg,_#9DC2F6_0.14%,_#9DC2F6_0.15%,_#E9C9C6_85%)] hover:text-white
                                flex items-center justify-start px-3 gap-2 ${!audioURL && !isRecording ? "allbtn-disabled" : ""} 
                             `}
                            >
                                <Pencil size={18} />
                                Edit
                            </button> */}
                        </div>


                        {/* Public upload message */}
                        {isPublicMessage && (
                            <p className="text-[0.8rem] bg-white  rounded-xl text-gray-800 mt-[3.5rem] flex items-center justify-center  cursor-pointer hover:text-gray-700 px-4 py-2">
                                Your public recording is being reviewed and will be published soon!
                            </p>
                        )}

                        {/* Footer */}
                        <Link href={route("home")}>
                            <p className="text-xs text-gray-700 mt-[3.5rem] flex items-center justify-center gap-1 cursor-pointer hover:text-gray-600">
                                <ArrowLeft size={16} />
                                Back to home
                            </p>
                        </Link>


                    </div>
                </div>
            </GuestLayout>
        </>
    );
};

export default Recorder;
