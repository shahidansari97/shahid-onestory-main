import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { useForm, usePage, router, Link } from "@inertiajs/react";
import { default as NewModal } from '@/Components/Modal';
import axios from 'axios';
import useViewportVideo from "@/Hooks/useViewportVideo";
import { Modal } from "@mui/material";
import LikeButton from "../UI/LikeButton";
import CommentModal from "../Modals/CommentModal";
import VideoModal from "../Modals/VideoModal";
import Button from "@/Components/UI/Button.jsx";
import { Trash } from 'lucide-react';
import { useGlobalSound } from "@/Contexts/GlobalSoundContext";
import "./../../../css/story.css";
import "./../../../css/allheighlightstory.css";
import shareImg from "./../../../img/send.png";
import story_tellerImg from "./../../../img/icons/story_teller_img.png";
import commentImg from "./../../../img/comment.png";
import valumeUp from "./../../../img/sound.gif";
import valumemute from "./../../../img/mute-sound.png";
import { Img } from "@/Components/UI/Content.jsx";
import Follow from "@/Components/Story/Follow";
// Mobile-specific AllimgStory component with touch behavior
const MobileAllimgStory = memo(function MobileAllimgStory({
    item,
    onOpenGiftModal,
    onOpenVideoModal,
    displayGift,
    onOpenShareModal,
    onOpenDeleteModal,
    showDelete = false,
    isUserProfilePage = false,
    allStories = [],
    currentIndex = 0,
}) {
    const { auth } = usePage().props;
    const authorId = auth?.user?.id;
    const isCurrentUserStory = auth?.user?.id === authorId;
    const [confirmingStoryDeletion, setConfirmStoryDeletion] = useState(false);
    
    // Detect iOS and Android devices IMMEDIATELY (synchronously) before using in hook
    // This must be done before any hooks that depend on these values
    // Wrap in try-catch to prevent errors on mobile devices
    let isIOSDevice = false;
    let isAndroidDevice = false;
    
    try {
        if (typeof navigator !== 'undefined') {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
            isIOSDevice = /iPhone|iPad|iPod/i.test(userAgent);
            isAndroidDevice = /Android/i.test(userAgent);
        }
    } catch (error) {
        // Fallback: Assume mobile if detection fails
        // Silently handle error to prevent white screen
        isIOSDevice = false;
        isAndroidDevice = false;
    }
    
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const userInteractionRef = useRef(false);
    
    // IMPORTANT: Call ALL hooks in the same order every time
    // Call useGlobalSound FIRST before useViewportVideo
    const { isGlobalMuted, toggleGlobalSound } = useGlobalSound();
    
    // Call useViewportVideo hook AFTER device detection
    const { elementRef, shouldShowVideo, isInViewport, isFullyVisible } =
        useViewportVideo(item?.src, item?.thumbnail, true, isIOSDevice, isAndroidDevice);
    
    const menuRef = useRef(null);
    const videoRef = useRef(null);
    const muteClickInProgress = useRef(false);
    const viewTrackedRef = useRef(false); // Track if view API has been called for this story
    const [showMenu, setShowMenu] = useState(false);

    // Capture ANY user interaction to enable autoplay with sound (especially important for iOS)
    // This unlocks autoplay capability but doesn't block playback
    useEffect(() => {
        // Wrap in try-catch to prevent errors
        try {
            const enableAutoplay = () => {
                try {
                    if (!userInteractionRef.current) {
                        userInteractionRef.current = true;
                        setHasUserInteracted(true);
                        
                        // Mark interaction in localStorage for future visits
                        localStorage.setItem('oneStory-user-interacted', 'true');
                        
                        // For iOS: Unlock autoplay by playing and unmuting any video
                        if (isIOSDevice) {
                            const currentVideo = videoRef.current || document.querySelector('video.card-video');
                            if (currentVideo && currentVideo.paused) {
                                // Unmute and play to unlock autoplay with sound on iOS
                                currentVideo.muted = false;
                                currentVideo.play().then(() => {
                                    // After unlocking, ensure all videos in viewport play with audio
                                    setTimeout(() => {
                                        try {
                                            const videosInViewport = document.querySelectorAll('video.card-video');
                                            videosInViewport.forEach(video => {
                                                if (video.paused && !isGlobalMuted) {
                                                    video.muted = false;
                                                    video.play().catch(() => {});
                                                }
                                            });
                                        } catch (e) {
                                            // Silently handle errors
                                        }
                                    }, 100);
                                }).catch(() => {
                                    // Silently handle errors
                                });
                            }
                        }
                    }
                } catch (error) {
                    // Silently handle errors
                }
            };

            // Check if interaction already happened (from page load or previous visit)
            const checkExistingInteraction = () => {
                const existingInteraction = localStorage.getItem('oneStory-user-interacted') === 'true';
                if (existingInteraction) {
                    userInteractionRef.current = true;
                    setHasUserInteracted(true);
                }
            };
            
            // Check immediately on mount
            checkExistingInteraction();
            
            // Capture various user interactions to unlock autoplay
            // Use capture phase for earlier detection
            const events = ['touchstart', 'touchend', 'click', 'scroll', 'wheel', 'mousedown', 'keydown', 'touchmove'];
            events.forEach(event => {
                try {
                    document.addEventListener(event, enableAutoplay, { once: true, passive: true, capture: true });
                } catch (e) {
                    // Fallback without capture if not supported
                    document.addEventListener(event, enableAutoplay, { once: true, passive: true });
                }
            });

            return () => {
                events.forEach(event => {
                    try {
                        document.removeEventListener(event, enableAutoplay, { capture: true });
                    } catch (e) {
                        document.removeEventListener(event, enableAutoplay);
                    }
                });
            };
        } catch (error) {
            // Silently handle errors to prevent white screen
        }
    }, [isIOSDevice, isAndroidDevice, isGlobalMuted]);

    const handleGiftClick = useCallback(() => {
        if (auth?.user && displayGift) {
            onOpenGiftModal();
        } else {
            router.visit(route("login"));
        }
    }, [auth?.user, displayGift, onOpenGiftModal]);
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const {
        delete: destroy,
        processing,
    } = useForm({});

    const confirmStoryDeletion = () => {
        console.log('confirmStoryDeletion');
        setConfirmStoryDeletion(true);
    };

    const deleteStory = (e) => {
        e.preventDefault();

        destroy(route('story.destroy', item.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    const closeModal = () => {
        setConfirmStoryDeletion(false);
    };

    const [openCommentModal, setOpenCommentModal] = useState(false);
    const [openVideoModal, setOpenVideoModal] = useState(false);

    const handleCloseCommentModal = () => setOpenCommentModal(false);
    const handleOpenCommentModal = () => {
        setOpenCommentModal(true);
    }

    const handleCloseVideoModal = () => setOpenVideoModal(false);
    const handleOpenVideoModal = () => {
        setOpenVideoModal(true);
    }

    // Navigation handlers
    const handleNextVideo = () => {
        console.log('🎬 Mobile Next video requested, current index:', currentIndex, 'total stories:', allStories.length);
        if (currentIndex < allStories.length - 1 && onOpenVideoModal) {
            const nextStory = allStories[currentIndex + 1];
            console.log('🎬 Mobile Opening next story:', nextStory.id);
            onOpenVideoModal(nextStory, "video", nextStory.author);
        }
    };

    const handlePrevVideo = () => {
        console.log('🎬 Mobile Previous video requested, current index:', currentIndex);
        if (currentIndex > 0 && onOpenVideoModal) {
            const prevStory = allStories[currentIndex - 1];
            console.log('🎬 Mobile Opening previous story:', prevStory.id);
            onOpenVideoModal(prevStory, "video", prevStory.author);
        }
    };

    // Handle global sound toggle - affects all videos on the page
    // Audio is ON by default, user can toggle to mute/unmute
    const handleToggleMute = (e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        if (muteClickInProgress.current) {
            return;
        }

        muteClickInProgress.current = true;

        // Toggle global mute state - this affects ALL videos on the page
        toggleGlobalSound();
        
        // Apply to all videos immediately
        const allVideos = document.querySelectorAll('video.card-video');
        const newMutedState = !isGlobalMuted; // Toggle to opposite of current state
        
        allVideos.forEach((v) => {
            v.muted = newMutedState;
            // If unmuting and video is in viewport, ensure it plays
            if (!newMutedState && v === videoRef.current && shouldShowVideo && v.paused) {
                v.play().catch(() => {
                    // Silently handle play errors
                });
            }
        });
        
        muteClickInProgress.current = false;
    };

    // Mobile video playback: play only when in viewport, automatically unmute when in viewport
    useEffect(() => {
        // Wrap in try-catch to prevent white screen errors
        try {
            const video = videoRef.current;
            if (!video) {
                return;
            }

        // CRITICAL: Always pause all other videos first when this video enters viewport
        // This ensures only one video plays at a time
        const allVideos = document.querySelectorAll('video.card-video');
        
        allVideos.forEach((v) => {
            if (v !== video) {
                // Pause all other videos immediately
                if (!v.paused) {
                    v.pause();
                    v.currentTime = 0; // Reset to start for better UX
                }
                // Apply global mute state to other videos (they're paused anyway)
                v.muted = isGlobalMuted;
            }
        });

        // When video enters viewport: AUTOMATICALLY UNMUTE AND PLAY WITH AUDIO
        if (shouldShowVideo) {
            // CRITICAL: Set audio ON by default (unmuted) before any play attempts
            // Audio should play automatically without user clicking sound button
            if (!isGlobalMuted) {
                video.muted = false; // Audio ON - no click required
            } else {
                video.muted = true; // Audio OFF only if globally muted
            }

            // Platform-specific playback handlers - AUTOPLAY WITH AUDIO (NO CLICKS REQUIRED)
            const tryPlayIOS = async () => {
                try {
                    // iOS-specific: Set up video for autoplay
                    video.playsInline = true;
                    video.setAttribute('playsinline', '');
                    video.setAttribute('webkit-playsinline', '');
                    
                    // Ensure video has src
                    if (!video.getAttribute('src') && item?.src) {
                        video.src = item.src;
                        video.load();
                        await new Promise((resolve) => {
                            const onCanPlay = () => {
                                video.removeEventListener('canplay', onCanPlay);
                                video.removeEventListener('error', onError);
                                resolve();
                            };
                            const onError = () => {
                                video.removeEventListener('canplay', onCanPlay);
                                video.removeEventListener('error', onError);
                                resolve();
                            };
                            video.addEventListener('canplay', onCanPlay);
                            video.addEventListener('error', onError);
                            setTimeout(resolve, 800);
                        });
                    } else if (video.readyState < 3) {
                        await new Promise((resolve) => {
                            const onReady = () => {
                                video.removeEventListener('canplaythrough', onReady);
                                video.removeEventListener('canplay', onReady);
                                resolve();
                            };
                            video.addEventListener('canplaythrough', onReady);
                            video.addEventListener('canplay', onReady);
                            setTimeout(resolve, 500);
                        });
                    }
                    
                    // CRITICAL: Set audio ON by default - AUTOPLAY WITH AUDIO (NO CLICK REQUIRED)
                    if (!isGlobalMuted) {
                        video.muted = false; // Audio ON - plays automatically
                        // Multiple unmute checks for iOS to ensure audio plays
                        await new Promise(resolve => setTimeout(resolve, 10));
                        video.muted = false;
                        await new Promise(resolve => setTimeout(resolve, 5));
                        video.muted = false;
                    } else {
                        video.muted = true; // Audio OFF only if globally muted
                    }
                    
                    // Play with audio immediately - no user interaction required
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        await playPromise;
                        
                        // Track story view when video starts playing
                        trackStoryView();
                        
                        // Ensure audio stays ON after play - continuous checks
                        if (!isGlobalMuted) {
                            video.muted = false;
                            setTimeout(() => {
                                if (video && !isGlobalMuted) {
                                    video.muted = false;
                                }
                            }, 30);
                            setTimeout(() => {
                                if (video && !isGlobalMuted) {
                                    video.muted = false;
                                }
                            }, 100);
                            setTimeout(() => {
                                if (video && !isGlobalMuted) {
                                    video.muted = false;
                                }
                            }, 200);
                        }
                    }
                } catch(error) {
                    // Fallback: try muted play first, then immediately unmute for audio
                    if (!isGlobalMuted) {
                        try {
                            video.muted = true;
                            await video.play();
                            
                            // Track story view when video starts playing (iOS fallback)
                            trackStoryView();
                            
                            // Immediately unmute after play starts - audio plays automatically
                            setTimeout(() => {
                                if (shouldShowVideo && !isGlobalMuted && video) {
                                    video.muted = false;
                                }
                            }, 50);
                            setTimeout(() => {
                                if (shouldShowVideo && !isGlobalMuted && video) {
                                    video.muted = false;
                                }
                            }, 150);
                        } catch(e) {
                            // Silently handle fallback errors
                        }
                    }
                }
            };

            const tryPlayAndroid = async () => {
                try {
                    // Android-specific: Standard playback with immediate unmute
                    video.playsInline = true;
                    video.setAttribute('playsinline', '');
                    
                    // Ensure video has src
                    if (!video.getAttribute('src') && item?.src) {
                        video.src = item.src;
                        video.load();
                        await new Promise((resolve) => {
                            const onCanPlayThrough = () => {
                                video.removeEventListener('canplaythrough', onCanPlayThrough);
                                video.removeEventListener('canplay', onCanPlay);
                                resolve();
                            };
                            const onCanPlay = () => {
                                if (video.readyState >= 3) {
                                    video.removeEventListener('canplaythrough', onCanPlayThrough);
                                    video.removeEventListener('canplay', onCanPlay);
                                    resolve();
                                }
                            };
                            video.addEventListener('canplaythrough', onCanPlayThrough);
                            video.addEventListener('canplay', onCanPlay);
                            setTimeout(resolve, 800);
                        });
                    } else if (video.readyState < 3) {
                        await new Promise((resolve) => {
                            const onReady = () => {
                                video.removeEventListener('canplaythrough', onReady);
                                video.removeEventListener('canplay', onReady);
                                resolve();
                            };
                            video.addEventListener('canplaythrough', onReady);
                            video.addEventListener('canplay', onReady);
                            setTimeout(resolve, 400);
                        });
                    }
                    
                    // CRITICAL: Set audio ON by default - AUTOPLAY WITH AUDIO (NO CLICK REQUIRED)
                    if (!isGlobalMuted) {
                        video.muted = false; // Audio ON - plays automatically
                        // Double-check unmute state
                        video.muted = false;
                    } else {
                        video.muted = true; // Audio OFF only if globally muted
                    }
                    
                    // Play immediately with audio - no user interaction required
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        await playPromise;
                        
                        // Track story view when video starts playing
                        trackStoryView();
                        
                        // Ensure audio stays ON after play - continuous checks
                        if (!isGlobalMuted) {
                            video.muted = false;
                            setTimeout(() => {
                                if (video && !isGlobalMuted && shouldShowVideo) {
                                    video.muted = false;
                                }
                            }, 30);
                            setTimeout(() => {
                                if (video && !isGlobalMuted && shouldShowVideo) {
                                    video.muted = false;
                                }
                            }, 100);
                        }
                    }
                } catch(error) {
                    // Fallback: try muted play first, then immediately unmute for audio
                    if (!isGlobalMuted) {
                        try {
                            video.muted = true;
                            await video.play();
                            
                            // Track story view when video starts playing (Android fallback)
                            trackStoryView();
                            
                            // Immediately unmute after play starts - audio plays automatically
                            setTimeout(() => {
                                if (shouldShowVideo && !isGlobalMuted && video) {
                                    video.muted = false;
                                }
                            }, 50);
                            setTimeout(() => {
                                if (shouldShowVideo && !isGlobalMuted && video) {
                                    video.muted = false;
                                }
                            }, 150);
                        } catch(e) {
                            // Silently handle fallback errors
                        }
                    }
                }
            };

            // Call platform-specific handler
            if (isIOSDevice) {
                tryPlayIOS();
            } else if (isAndroidDevice) {
                tryPlayAndroid();
            } else {
                // Fallback for other mobile devices
                tryPlayAndroid();
            }
        } else {
            // Video is not in viewport - pause it immediately
            if (!video.paused) {
                video.pause();
                // Optionally reset to start for better UX when scrolling back
                // video.currentTime = 0;
            }
            // Apply global mute state (but this doesn't matter since video is paused)
            video.muted = isGlobalMuted;
        }
        } catch (error) {
            // Silently handle errors to prevent white screen
        }
    }, [shouldShowVideo, isGlobalMuted, isAndroidDevice, isIOSDevice, item?.src, item?.id]); // Removed hasUserInteracted dependency

    // iOS-specific: Listen for global sound changes and ensure videos are unmuted
    useEffect(() => {
        if (!isIOSDevice) return;

        const handleGlobalSoundChange = (e) => {
            const video = videoRef.current;
            if (!video) return;

            const isMuted = e.detail?.isMuted ?? isGlobalMuted;
            if (!isMuted && shouldShowVideo) {
                // If global state is unmuted and video is in viewport, ensure it's unmuted
                video.muted = false;
            }
        };

        window.addEventListener('globalSoundChanged', handleGlobalSoundChange);
        return () => {
            window.removeEventListener('globalSoundChanged', handleGlobalSoundChange);
        };
    }, [isIOSDevice, isGlobalMuted, shouldShowVideo]);

    // Sync with global mute state changes - apply to current video
    // Audio is ON by default (isGlobalMuted = false)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Explicitly set mute state based on global state
        // Default is unmuted (audio ON)
        if (!isGlobalMuted) {
            video.muted = false; // Audio ON
        } else {
            video.muted = true; // Audio OFF (muted)
        }
        
        // If video is in viewport and we're unmuting, ensure it plays
        if (!isGlobalMuted && shouldShowVideo && video.paused) {
            video.play().then(() => {
                // Track story view when video starts playing
                trackStoryView();
            }).catch(() => {
                // Silently handle play errors
            });
        }
    }, [isGlobalMuted, shouldShowVideo]);

    // Android & iOS: Handle scrolling to ensure videos play/pause correctly when entering/leaving viewport
    useEffect(() => {
        if (!isAndroidDevice && !isIOSDevice) return;

        const handleScroll = () => {
            const video = videoRef.current;
            if (!video) return;

            // CRITICAL: Pause all other videos when scrolling
            const allVideos = document.querySelectorAll('video.card-video');
            allVideos.forEach((v) => {
                if (v !== video && !v.paused) {
                    v.pause();
                }
            });

            // If video should be shown but is paused, try to play it
            if (shouldShowVideo && video.paused) {
                // Ensure correct mute state - audio ON by default
                if (!isGlobalMuted) {
                    video.muted = false;
                } else {
                    video.muted = true;
                }
                
                // Try to play with audio
                video.play().then(() => {
                    // Track story view when video starts playing
                    trackStoryView();
                    
                    if (!isGlobalMuted) {
                        video.muted = false;
                    }
                }).catch(() => {
                    // Silently handle play errors
                });
            } else if (!shouldShowVideo && !video.paused) {
                // Video left viewport - pause it immediately
                video.pause();
                video.muted = isGlobalMuted;
            }
        };

        // Throttle scroll events for performance
        let scrollTimeout;
        const throttledScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 150);
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        window.addEventListener('touchmove', throttledScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', throttledScroll);
            window.removeEventListener('touchmove', throttledScroll);
            clearTimeout(scrollTimeout);
        };
    }, [shouldShowVideo, isAndroidDevice, isIOSDevice, isGlobalMuted, item?.id]);

    // Mobile-specific: mute videos when modal opens (but don't change user preference)
    useEffect(() => {
        if (videoRef.current && open) {
            videoRef.current.muted = true;
        }
    }, [open]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            try {
                if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.src = '';
                    videoRef.current.load();
                }
                muteClickInProgress.current = false;
            } catch (error) {
                // Silently handle cleanup errors
            }
        };
    }, [item.id]);

    const handleLike = useCallback(async (type) => {
        if (auth?.user) {
            await axios.post(route('user.stories.like', {
                story_id: item.id,
                type,
                story_page: "all-stories",
            }));
        } else {
            router.visit(route("login"));
        }
    }, [auth?.user, item.id]);

    const handleOpenShareModal = useCallback(() => {
        onOpenShareModal(item);
    }, [onOpenShareModal, item]);

    const isPlaying = shouldShowVideo;

    const handleOpenComment = useCallback((e) => {
        if (e) e.stopPropagation();
        console.log('Opening comment modal for item:', item.id);
        handleOpenCommentModal();
    }, [handleOpenCommentModal, item.id]);

    // Track story view when video plays in viewport - for mobile viewport-based playback
    const trackStoryView = useCallback(async () => {
        // Only track if:
        // 1. Video is in viewport (shouldShowVideo is true)
        // 2. Video is actually playing (not paused)
        // 3. Hasn't been tracked yet for this story
        const video = videoRef.current;
        if (!shouldShowVideo || viewTrackedRef.current || !video || video.paused) {
            return;
        }

        try {
            const userId = auth?.user ? auth.user.id : null;
            console.log('Tracking story view (mobile viewport):', { 
                user_id: userId, 
                story_id: item.id, 
                in_viewport: shouldShowVideo,
                video_playing: !video.paused
            });
            await axios.post(route('user.story.view.store'), {
                user_id: userId,
                story_id: item.id,
                ip_address: null, // Backend will get IP from request if null
            });
            viewTrackedRef.current = true; // Mark as tracked
            console.log('Story view tracked successfully (mobile viewport)');
        } catch (error) {
            // Log error but don't interrupt video playback
            console.error('Failed to track story view:', error);
        }
    }, [auth?.user, item.id, shouldShowVideo]);

    // Reset tracking when story changes
    useEffect(() => {
        viewTrackedRef.current = false;
    }, [item?.id]);

    const handleOpenVideo = useCallback((e) => {
        if (e) e.stopPropagation();
        console.log('🎬 Mobile Opening video modal for item:', item.id);
        console.log('🎬 Mobile Item data:', item);
        handleOpenVideoModal();
    }, [handleOpenVideoModal, item.id]);
    const handleConnectToStoryTeller = (e) => {
        if (e) e.stopPropagation();
        try {
            window.location.href = `/chatify/${item?.author?.id}`;
        } catch (error) {
            // Silently handle navigation errors
        }
    }
    
    // Ensure component always renders, even if there are errors
    // Don't return null - render a placeholder instead to prevent white screen
    if (!item || !item.id) {
        return (
            <div className="os-carousel__item video-wrapper" style={{ position: 'relative', minHeight: '200px' }}>
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
            </div>
        );
    }
    
    return (

        <>
      
        <div
            className={`os-carousel__item video-wrapper${isIOSDevice ? ' Ios_player' : ''}`}
            ref={elementRef}
            style={{ position: 'relative' }}
            onClick={(e) => {
                console.log('🎬 Mobile CONTAINER CLICKED!', e);
                handleOpenVideo(e);
            }}
        >

              {openCommentModal && (
                    <div>
                        <CommentModal
                            open={openCommentModal}
                            closeModal={handleCloseCommentModal}
                            item={item}
                            handleGiftClick={onOpenGiftModal}
                            allStories={allStories}
                            currentIndex={currentIndex}
                            onNextVideo={handleNextVideo}
                            onPrevVideo={handlePrevVideo}
                        />
                    </div>
            )} 


            <Img
                className="os-story-card__img"
                src={item?.thumbnail}
                onClick={(e) => {
                    console.log('🎬 Mobile IMG CLICKED!', e);
                    handleOpenVideo(e);
                }}
            />
            {shouldShowVideo && (
                <video
                    className="card-video"
                    ref={videoRef}
                    src={item?.src}
                    poster={item?.thumbnail}
                    autoPlay={true}
                    loop
                    muted={isGlobalMuted}
                    playsInline
                    preload="auto"
                    controls={false}
                    disablePictureInPicture={true}
                    disableRemotePlayback={true}
                    // AUTOPLAY WITH AUDIO when video is ready - NO CLICK REQUIRED
                    onCanPlay={(e) => {
                        const video = e.target;
                        if (shouldShowVideo && video.paused) {
                            // Set audio ON by default - plays automatically
                            if (!isGlobalMuted) {
                                video.muted = false; // Audio ON
                            }
                            video.play().then(() => {
                                // Track story view when video starts playing
                                trackStoryView();
                            }).catch(() => {
                                // Silently handle play errors
                            });
                        }
                    }}
                    onCanPlayThrough={(e) => {
                        const video = e.target;
                        if (shouldShowVideo && video.paused) {
                            // Set audio ON by default - plays automatically
                            if (!isGlobalMuted) {
                                video.muted = false; // Audio ON
                            }
                            video.play().then(() => {
                                // Track story view when video starts playing
                                trackStoryView();
                            }).catch(() => {
                                // Silently handle play errors
                            });
                        }
                    }}
                    onPlay={(e) => {
                        // When video starts playing, ensure audio is ON
                        const video = e.target;
                        if (!isGlobalMuted) {
                            video.muted = false; // Audio ON - no click required
                            // iOS: Additional unmute checks
                            if (isIOSDevice) {
                                setTimeout(() => {
                                    if (video && !isGlobalMuted) {
                                        video.muted = false;
                                    }
                                }, 50);
                            }
                        }
                        // Track story view when video starts playing in viewport
                        trackStoryView();
                    }}
                    onPlaying={(e) => {
                        // When video is playing, ensure audio stays ON
                        const video = e.target;
                        if (!isGlobalMuted && isIOSDevice) {
                            video.muted = false; // Audio ON
                        }
                    }}
                    style={{ 
                        WebkitAppearance: "none",
                        appearance: "none",
                        // Hide iOS play icon overlay completely
                        ...(isIOSDevice && {
                            pointerEvents: 'auto',
                            WebkitTouchCallout: 'none',
                            WebkitUserSelect: 'none',
                            objectFit: 'cover',
                        })
                    }}
                    // iOS-specific attributes to prevent play button overlay
                    {...(isIOSDevice && {
                        'x-webkit-airplay': 'allow',
                        'webkit-playsinline': 'true',
                        'playsinline': 'true',
                        'controls': false,
                        'disablePictureInPicture': true,
                    })}
                    onLoadedData={async (e) => {
                        // AUTOPLAY WITH AUDIO when video loads - NO CLICK REQUIRED
                        const video = e.target;
                        if (!shouldShowVideo) {
                            video.muted = isGlobalMuted;
                            return;
                        }
                        
                        // CRITICAL: Set audio ON by default before play
                        if (!isGlobalMuted) {
                            video.muted = false; // Audio ON - plays automatically
                        } else {
                            video.muted = true; // Audio OFF only if globally muted
                        }
                        
                        if (isIOSDevice) {
                            // iOS-specific: Multiple unmute checks to ensure audio plays
                            if (!isGlobalMuted) {
                                video.muted = false;
                                await new Promise(resolve => setTimeout(resolve, 10));
                                video.muted = false;
                                await new Promise(resolve => setTimeout(resolve, 5));
                                video.muted = false;
                            }
                            
                            try {
                                // Play immediately with audio - no click required
                                await video.play();
                                
                                // Track story view when video starts playing
                                trackStoryView();
                                
                                // Ensure audio stays ON after play
                                if (!isGlobalMuted) {
                                    video.muted = false;
                                    setTimeout(() => {
                                        if (video && !isGlobalMuted) video.muted = false;
                                    }, 30);
                                    setTimeout(() => {
                                        if (video && !isGlobalMuted) video.muted = false;
                                    }, 100);
                                    setTimeout(() => {
                                        if (video && !isGlobalMuted) video.muted = false;
                                    }, 200);
                                }
                            } catch (error) {
                                // Fallback: try muted play, then immediately unmute
                                try {
                                    video.muted = true;
                                    await video.play();
                                    // Immediately unmute - audio plays automatically
                                    setTimeout(() => {
                                        if (!isGlobalMuted && video) {
                                            video.muted = false;
                                        }
                                    }, 50);
                                    setTimeout(() => {
                                        if (!isGlobalMuted && video) {
                                            video.muted = false;
                                        }
                                    }, 150);
                                } catch(e) {
                                    // Silently handle errors
                                }
                            }
                        } else if (isAndroidDevice) {
                            // Android-specific: Immediate unmute and play
                            if (!isGlobalMuted) {
                                video.muted = false; // Audio ON
                                video.muted = false; // Double-check
                            }
                            
                            try {
                                // Play immediately with audio - no click required
                                await video.play();
                                
                                // Track story view when video starts playing
                                trackStoryView();
                                
                                // Ensure audio stays ON after play
                                if (!isGlobalMuted) {
                                    video.muted = false;
                                    setTimeout(() => {
                                        if (video && !isGlobalMuted && shouldShowVideo) {
                                            video.muted = false;
                                        }
                                    }, 30);
                                    setTimeout(() => {
                                        if (video && !isGlobalMuted && shouldShowVideo) {
                                            video.muted = false;
                                        }
                                    }, 100);
                                }
                            } catch (error) {
                                // Fallback: try muted play, then immediately unmute
                                if (!isGlobalMuted) {
                                    try {
                                        video.muted = true;
                                        await video.play();
                                        // Immediately unmute - audio plays automatically
                                        setTimeout(() => {
                                            if (shouldShowVideo && !isGlobalMuted && video) {
                                                video.muted = false;
                                            }
                                        }, 50);
                                        setTimeout(() => {
                                            if (shouldShowVideo && !isGlobalMuted && video) {
                                                video.muted = false;
                                            }
                                        }, 150);
                                    } catch(e) {
                                        // Silently handle errors
                                    }
                                }
                            }
                        } else {
                            // Generic mobile fallback
                            if (!isGlobalMuted) {
                                video.muted = false;
                            } else {
                                video.muted = true;
                            }
                            
                            try {
                                await video.play();
                                
                                // Track story view when video starts playing
                                trackStoryView();
                                
                                if (!isGlobalMuted) {
                                    video.muted = false;
                                }
                            } catch (error) {
                                // Silently handle errors
                            }
                        }
                    }}
                    onClick={(e) => {
                        console.log('🎬 Mobile VIDEO CLICKED!', e);
                        handleOpenVideo(e);
                    }}
                />
            )}


 {/* Delete icon - only show on user-profile page */}
            {/* {isUserProfilePage && showDelete && auth?.user?.id === item?.author?.id && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        confirmStoryDeletion();
                    }}
                    style={{
                        position: 'absolute',
                        top: 8,
                        right: 6,
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'rgb(139 130 114)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 9999,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <Trash size={20} color="white" strokeWidth={2.5} />
                </div>
            )} */}

            {/* Mobile sound toggle overlay - larger for better touch interaction */}
            <span
                className="os-story-card__sound"
                onClick={handleToggleMute}
                style={{
                    position: 'absolute',
                    top: 8,
                    right: isUserProfilePage && showDelete && auth?.user?.id === item?.author?.id ? 12 : 8,
                    cursor: 'pointer',
                    zIndex: 10,
                    padding: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '44px',
                    minHeight: '44px'
                }}
            >
                <img
                    src={isGlobalMuted ? valumemute : valumeUp}
                    className={isGlobalMuted ? "volumemute" : "volumeunmute"}
                    alt={isGlobalMuted ? "Muted" : "Unmuted"}
                    style={{ width: '32px', height: '32px' }}
                />
            </span>

           

            {/* {auth?.user?.id === item?.author?.id && (
                <>
                    <p className="os-story-card__doticon" onClick={() => setShowMenu(!showMenu)} style={{'top':'12px','zIndex':'999'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="5" r="1.5"></circle>
                            <circle cx="12" cy="12" r="1.5"></circle>
                            <circle cx="12" cy="19" r="1.5"></circle>
                        </svg>
                        {showMenu && showDelete && (
                            <div
                                ref={menuRef}
                                style={{
                                    position: 'absolute',
                                    top: '30px',
                                    right: 0,
                                    background: '#fff',
                                    color: 'red',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                    zIndex: 99999999,
                                    minWidth: '100px'
                                }}
                            >
                                <div
                                    onClick={confirmStoryDeletion}
                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <Trash size={16} /> Delete
                                </div>
                            </div>
                        )}
                    </p>
                </>
            )} */}

            <NewModal show={confirmingStoryDeletion} onClose={closeModal} maxWidth="sm">
                <form onSubmit={deleteStory} className="os-form">
                    <h2 className="text-lg font-medium text-gray-900">
                        Are you sure you want to delete this story?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Once your story is deleted, it will be removed permanently.
                    </p>
                    <div className="mt-6" style={{ 'width':'100%','display':'flex','justifyContent':'center', 'gap':'20px' }}>
                        <Button type="button" onClick={closeModal}>Cancel</Button>

                        <Button type="submit" className="outline">
                            Delete Story
                        </Button>
                    </div>
                </form>
            </NewModal>

            {/* {openVideoModal && (
                <VideoModal
                    open={openVideoModal}
                    onClose={handleCloseVideoModal}
                    item={item}
                    onOpenGiftModal={onOpenGiftModal}
                />
            )} */}

            <div className="shareandiconsec sharedesktop" style={{ zIndex: 10, position: 'absolute', right: '12px',  display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'none' }}>
                <div style={{ pointerEvents: 'auto' }}>
                    <LikeButton
                        initialLiked={item?.isLiked}
                        initialLikesCount={item?.likes_count}
                        onLike={() => handleLike("like")}
                        onDislike={() => handleLike("unlike")}
                        iconSize={28}
                    />
                </div>
                <span className="os-story-card__comment" onClick={(e) => { e.stopPropagation(); console.log('Comment clicked'); handleOpenCommentModal(); }} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    opacity: 1,
                    pointerEvents: 'auto',
                    padding: '8px',
                    minWidth: '40px',
                    minHeight: '40px',
                    justifyContent: 'center'
                }}>
                    <Img src={commentImg} width={28} height={28} style={{ opacity: 1, filter: 'brightness(1)', pointerEvents: 'auto' }} />
                    <span style={{ color: 'white', fontSize: '12px', opacity: 1, pointerEvents: 'auto', fontWeight: 'bold' }}>{item?.comments?.length}</span>
                </span>
                <span className="os-story-card__share" onClick={(e) => { e.stopPropagation(); console.log('Share clicked'); handleOpenShareModal(); }} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    opacity: 1,
                    pointerEvents: 'auto',
                    padding: '8px',
                    minWidth: '40px',
                    minHeight: '40px',
                    justifyContent: 'center'
                }}>
                    <Img src={shareImg} width={28} height={28} style={{ opacity: 1, cursor: 'pointer', filter: 'brightness(1)', pointerEvents: 'auto' }} />
                    <span style={{ color: 'white', fontSize: '12px', opacity: 1, pointerEvents: 'auto', fontWeight: 'bold' }}>{item?.total_share}</span>
                </span>
                <a href="javascript:void(0);"  onClick={(e)=>handleConnectToStoryTeller(e)}>
                        <span className="os-story-card__share story_tellerImg"  style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            gap: '4px', 
                            cursor: 'pointer', 
                            opacity: 1, 
                            pointerEvents: 'auto',
                            // padding: '8px',
                            minWidth: '40px',
                            minHeight: '40px',
                            justifyContent: 'center'
                        }}>
                       <img src={story_tellerImg} width={28} height={28} alt="" />
                    </span>
                </a>
            </div>

            <div className="os-story-card__content-top">

                <div className="userprofile">
                    <img src={item?.author?.avatar} width={50} height={50} />
                </div>
                <div className="os-story-card__content-bottom-left">
                    <div className="os-story-card__title">
                        <Link href={route("user.profile.index", { user_id: item.author.id })}>
                            {item?.author?.name}
                        </Link>
                    </div>
                    {item.categories && (
                        <div className="os-story-card__categories flex-wrap">
                            {item.categories
                                .filter(category => category !== "All")
                                .slice(0, 1)
                                .map((category, index) => (
                                    <div className="os-story-card__category" key={index}>
                                        {category}
                                    </div>
                                ))}
                        </div>
                    )}
                    <div className="os-story-card__content-bottom-left d-block">
                        <div className="os-story-card__categories">
                            <Follow userId={authorId} isFollowing={item?.author?.is_following} pages="story" />
                            <div className="os-story-card__category" onClick={handleGiftClick}>Gift Storyteller</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


         {isUserProfilePage && showDelete && auth?.user?.id === item?.author?.id && (
                            <div className="delete_btn_ourStory mt-0">
                                <button className=""
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        confirmStoryDeletion();
                                    }}
        
                                    onMouseEnter={(e) => {
                                        // e.currentTarget.style.backgroundColor = 'rgb(139 130 114)';
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        // e.currentTarget.style.backgroundColor = 'rgb(139 130 114)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <Trash size={18} color="red" strokeWidth={2.5} />
                                </button>
                            </div>
                        )}
      </>
    );
});

export default MobileAllimgStory;
