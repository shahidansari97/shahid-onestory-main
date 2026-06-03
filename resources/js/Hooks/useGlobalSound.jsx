import { useGlobalSound as useGlobalSoundContext } from '@/Contexts/GlobalSoundContext';

/**
 * Custom hook for accessing global sound state and controls
 * This provides a clean interface for components to interact with global sound
 */
export const useGlobalSound = () => {
    const context = useGlobalSoundContext();
    
    return {
        // Sound state
        isGlobalMuted: context.isGlobalMuted,
        hasUserInteracted: context.hasUserInteracted,
        isIPhone: context.isIPhone,
        
        // Sound controls
        toggleGlobalSound: context.toggleGlobalSound,
        setGlobalMute: context.setGlobalMute,
        setGlobalSoundFromVideo: context.setGlobalSoundFromVideo,
        handleUserInteraction: context.handleUserInteraction,
        
        // Utility functions
        applyGlobalSoundToVideo: context.applyGlobalSoundToVideo,
        
        // Convenience methods
        unmuteAll: () => context.setGlobalMute(false),
        muteAll: () => context.setGlobalMute(true),
        
        // iPhone-specific helpers
        canUnmute: () => !context.isIPhone || context.hasUserInteracted,
        shouldStartMuted: () => context.isIPhone && !context.hasUserInteracted
    };
};

export default useGlobalSound;
