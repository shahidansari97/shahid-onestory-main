import { useState, useEffect } from 'react';

const useIsDesktop = (minWidth = 768) => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= minWidth);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= minWidth);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [minWidth]);

    return isDesktop;
};

export default useIsDesktop;
