import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';

const GlobalSoundContext = createContext();

export const useGlobalSound = () => {
    const context = useContext(GlobalSoundContext);
    if (!context) {
        throw new Error('useGlobalSound must be used within a GlobalSoundProvider');
    }
    return context;
};

export const GlobalSoundProvider = ({ children }) => {
    // Global sound state - starts UNMUTED for autoplay with sound on first visit
    const [isGlobalMuted, setIsGlobalMuted] = useState(false);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [isIPhone, setIsIPhone] = useState(false);
    
    // Reset global state when navigating between pages
    useEffect(() => {
        const handlePageNavigation = () => {
            console.log('🔄 Page navigation detected, resetting global sound state');
            // Reset to default muted state
            setIsGlobalMuted(true);
            // Pause all videos on the page
            const allVideos = document.querySelectorAll('video');
            allVideos.forEach(video => {
                if (!video.paused) {
                    video.pause();
                }
            });
            // Clear any global video management
            if (window.__activeStoryId) {
                window.__activeStoryId = null;
            }
        };
        
        // Listen for page navigation events
        window.addEventListener('beforeunload', handlePageNavigation);
        window.addEventListener('popstate', handlePageNavigation);
        
        // Listen for Inertia.js navigation events
        const unsubscribeStart = router.on('start', handlePageNavigation);
        const unsubscribeFinish = router.on('finish', () => {
            console.log('🔄 Inertia navigation finished, ensuring clean state');
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                const allVideos = document.querySelectorAll('video');
                allVideos.forEach(video => {
                    if (!video.paused) {
                        video.pause();
                    }
                });
            }, 100);
        });
        
        return () => {
            window.removeEventListener('beforeunload', handlePageNavigation);
            window.removeEventListener('popstate', handlePageNavigation);
            if (unsubscribeStart) unsubscribeStart();
            if (unsubscribeFinish) unsubscribeFinish();
        };
    }, []);
    
    
    // Detect iPhone/iOS device
    useEffect(() => {
        const checkIPhone = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
            const isIOSChrome = /CriOS/.test(userAgent);
            const isIOSSafari = /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor);
            
            setIsIPhone(isIOS || isIOSChrome || isIOSSafari);
        };
        
        checkIPhone();
    }, []);

    // Show iPhone sound indicator
    useEffect(() => {
        if (isIPhone && !hasUserInteracted) {
            const indicator = document.createElement('div');
            indicator.className = 'global-sound-indicator';
            indicator.textContent = '🔊 Tap to enable sound';
            document.body.appendChild(indicator);
            
            return () => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            };
        }
    }, [isIPhone, hasUserInteracted]);

    // Load saved sound preference from localStorage
    // BUT: For first visit autoplay, start unmuted regardless of saved state
    useEffect(() => {
        const savedInteractionState = localStorage.getItem('oneStory-user-interacted');
        
        // Only load saved mute state if user has previously interacted
        // For first visit, always start unmuted for autoplay with sound
        if (savedInteractionState === 'true') {
            const savedMuteState = localStorage.getItem('oneStory-global-mute');
            if (savedMuteState !== null) {
                setIsGlobalMuted(JSON.parse(savedMuteState));
            }
        } else {
            // First visit - ensure unmuted for autoplay
            setIsGlobalMuted(false);
        }
        
        if (savedInteractionState !== null) {
            setHasUserInteracted(JSON.parse(savedInteractionState));
        }
    }, []);

    // Save sound preference to localStorage
    useEffect(() => {
        localStorage.setItem('oneStory-global-mute', JSON.stringify(isGlobalMuted));
    }, [isGlobalMuted]);

    useEffect(() => {
        localStorage.setItem('oneStory-user-interacted', JSON.stringify(hasUserInteracted));
    }, [hasUserInteracted]);

    // Global mute/unmute function - applies to ALL videos INCLUDING Story videos
    const toggleGlobalSound = useCallback(() => {
        const newMutedState = !isGlobalMuted;
        console.log('🔊 Toggling global sound from', isGlobalMuted, 'to', newMutedState);
        
        // Mark that user has interacted with sound
        setHasUserInteracted(true);
        
        // Toggle global sound state
        setIsGlobalMuted(newMutedState);
        
        // Apply to ALL video elements on the page INCLUDING Story components
        const allVideos = document.querySelectorAll('video');
        console.log('🔊 Found', allVideos.length, 'video elements to update');
        
        allVideos.forEach((video) => {
            video.muted = newMutedState;
        });
        
        console.log(`🔊 Updated ALL ${allVideos.length} videos to muted=${newMutedState}`);
        
        // Trigger custom event for components that need to know about sound changes
        window.dispatchEvent(new CustomEvent('globalSoundChanged', { 
            detail: { isMuted: newMutedState } 
        }));
    }, [isGlobalMuted]);

    // Set global mute state directly
    const setGlobalMute = useCallback((muted) => {
        setHasUserInteracted(true);
        setIsGlobalMuted(muted);
        
        // Apply to all video elements EXCEPT Story components
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(video => {
            // Skip videos that are inside Story components
            const isInStory = video.closest('.os-carousel__item') || 
                             video.closest('.video-wrapper') ||
                             video.closest('[data-story-id]');
            
            if (!isInStory) {
                video.muted = muted;
            }
        });
        
        const reactPlayers = document.querySelectorAll('.react-player video');
        reactPlayers.forEach(video => {
            // Skip ReactPlayer videos that are inside Story components
            const isInStory = video.closest('.os-carousel__item') || 
                             video.closest('.video-wrapper') ||
                             video.closest('[data-story-id]');
            
            if (!isInStory) {
                video.muted = muted;
            }
        });
        
        window.dispatchEvent(new CustomEvent('globalSoundChanged', { 
            detail: { isMuted: muted } 
        }));
    }, []);

    // Handle user interaction for iPhone autoplay
    const handleUserInteraction = useCallback(() => {
        if (!hasUserInteracted) {
            setHasUserInteracted(true);
        }
    }, [hasUserInteracted]);

    // iPhone-specific sound handling - simplified to work like Android
    const handleIPhoneSoundToggle = useCallback(() => {
        // For iOS, just toggle global sound like Android
        // User interaction is already captured by the component
        toggleGlobalSound();
    }, [toggleGlobalSound]);

    // Show global sound message
    const showGlobalSoundMessage = useCallback((message) => {
        const messageEl = document.createElement('div');
        messageEl.className = 'global-sound-state show';
        messageEl.textContent = message;
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 2000);
    }, []);

    // Apply global sound state to new videos (excluding Story components)
    const applyGlobalSoundToVideo = useCallback((videoElement) => {
        if (videoElement && videoElement.tagName === 'VIDEO') {
            // Skip videos that are inside Story components
            const isInStory = videoElement.closest('.os-carousel__item') || 
                             videoElement.closest('.video-wrapper') ||
                             videoElement.closest('[data-story-id]');
            
            if (!isInStory) {
                // For iPhone, only unmute if user has interacted and explicitly unmuted
                if (isIPhone && !hasUserInteracted) {
                    videoElement.muted = true;
                } else {
                    videoElement.muted = isGlobalMuted;
                }
            }
        }
    }, [isGlobalMuted, isIPhone, hasUserInteracted]);

    // Listen for new videos being added to the DOM
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const videos = node.querySelectorAll ? node.querySelectorAll('video') : [];
                        videos.forEach(applyGlobalSoundToVideo);
                        
                        // Also check if the node itself is a video
                        if (node.tagName === 'VIDEO') {
                            applyGlobalSoundToVideo(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return () => observer.disconnect();
    }, [applyGlobalSoundToVideo]);

    // Function for individual videos to control global sound state
    const setGlobalSoundFromVideo = useCallback((muted) => {
        console.log('🔊 Individual video setting global sound to:', muted);
        setHasUserInteracted(true);
        setIsGlobalMuted(muted);
    }, []);



    const value = {
        isGlobalMuted,
        hasUserInteracted,
        isIPhone,
        toggleGlobalSound: handleIPhoneSoundToggle,
        setGlobalMute,
        setGlobalSoundFromVideo,
        handleUserInteraction,
        applyGlobalSoundToVideo
    };

    return (
        <GlobalSoundContext.Provider value={value}>
            {children}
        </GlobalSoundContext.Provider>
    );
};

export default GlobalSoundContext;
