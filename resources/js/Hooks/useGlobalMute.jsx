import { useState, useEffect } from 'react';

const useGlobalMute = () => {
    const [isGlobalMuted, setIsGlobalMuted] = useState(true);

    const toggleGlobalMute = () => {
        setIsGlobalMuted(!isGlobalMuted);
    };

    const setGlobalMute = (muted) => {
        setIsGlobalMuted(muted);
    };

    return {
        isGlobalMuted,
        toggleGlobalMute,
        setGlobalMute
    };
};

export default useGlobalMute; 