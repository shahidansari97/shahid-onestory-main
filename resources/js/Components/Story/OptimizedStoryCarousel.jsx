import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Marquee from "react-fast-marquee";
import useIsDesktop from "@/Hooks/useIsDesktop";
// Memoized story item component to prevent unnecessary re-renders
const MemoizedStoryItem = memo(({ item, index, children }) => {
    return children(item, index);
});

export default function Carousel({ items, children, isFocusedMode }) {
    const [isAppleDevice, setIsAppleDevice] = useState(false);
    const trackRef = useRef(null);
    const isMobile = useIsDesktop(992);
    // New Code 18-07-2025
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const currentTranslate = useRef(0);
    const animationFrame = useRef(null);
    // New Code 18-07-2025
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/iPhone|iPad|iPod|Macintosh/i.test(userAgent)) {
            setIsAppleDevice(true);
        }
    }, []);
   
    // Memoize infinite items to prevent recreation on every render
    const infiniteItems = useMemo(() => {
        // Only create infinite items if we have items and not in focused mode
        if (!items || items.length === 0 || isFocusedMode) return items;
        return [...items, ...items, ...items];
    }, [items, isFocusedMode]);

    // Memoize settings to prevent recreation on every render
    const settings = useMemo(() => ({
        infinite: true,
        speed: 5000,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        arrows: false,
        dots: false,
        cssEase: "linear",
        focusOnSelect: false,
        centerMode: false,
        centerPadding: "0px",
        pauseOnHover: true,
        swipe: false,
        draggable: false,
        responsive: [
            {
                breakpoint: 1170,
                settings: { slidesToShow: 3, slidesToScroll: 1 },
            },
            {
                breakpoint: 1000,
                settings: { slidesToShow: 2, slidesToScroll: 1 },
            },
            {
                breakpoint: 650,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: "0px",
                },
            },
        ],
    }), []);



    // New Code 18-07-2025 - Optimized with useCallback
    // Pause animation
    const pauseAutoScroll = useCallback(() => {
        trackRef.current?.classList.add("paused", "carousel-trackstop");
    }, []);

    const resumeAutoScroll = useCallback(() => {
        trackRef.current?.classList.remove("paused", "carousel-trackstop");
    }, []);

    // Handle touch/swipe
    const handleTouchStart = useCallback((e) => {
        pauseAutoScroll();
        setIsDragging(true);
        startX.current = e.touches[0].clientX;
        if (trackRef.current) {
            currentTranslate.current = getTranslateX(trackRef.current);
            cancelAnimationFrame(animationFrame.current);
        }
    }, [pauseAutoScroll]);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging || !trackRef.current) return;
        const dx = e.touches[0].clientX - startX.current;
        const newTranslate = currentTranslate.current + dx;
        trackRef.current.style.transition = "none";
        // Use transform3d for better performance
        trackRef.current.style.transform = `translate3d(${newTranslate}px, 0, 0)`;
    }, [isDragging]);

    const handleTouchEnd = useCallback((e) => {
        setIsDragging(false);
        resumeAutoScroll();
    }, [resumeAutoScroll]);

    // Utility to get current translateX value
    const getTranslateX = useCallback((element) => {
        const style = window.getComputedStyle(element);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return matrix.m41; // X translation
    }, []);
    // New Code 18-07-2025
    return isAppleDevice ? (
        // iOS/macOS version using react-slick
        isMobile ? (
            !isFocusedMode ? (
                <div 
                    className="os-carouselMain" 
                    onMouseEnter={pauseAutoScroll}
                    onMouseLeave={resumeAutoScroll}
                >
                    <Marquee speed={50} gradient={false} pauseOnHover={true}>
                        {/* {infiniteItems.slice(0, 9).map((item, index) =>
                            React.cloneElement(children(item, index), { key: index })
                        )} */}
                        {infiniteItems.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                style={{ marginRight: 16 }}
                                onMouseEnter={() => {
                                    pauseAutoScroll();
                                    if (item.videoRef?.current) {
                                        item.videoRef.current.muted = false;
                                    }
                                }}
                                onMouseLeave={() => {
                                    resumeAutoScroll();
                                    if (item.videoRef?.current) {
                                        item.videoRef.current.muted = true;
                                    }
                                }}
                            >
                                <MemoizedStoryItem item={item} index={index} children={children} />
                            </div>
                        ))}
                        {/* {React.cloneElement(children(infiniteItems[0], 0), { key: 0 })} */}
                    </Marquee>
                </div>
            ) : null
        ) : (
            !isFocusedMode ? (
                <div 
                    className="os-carouselMain" 
                    onMouseEnter={pauseAutoScroll}
                    onMouseLeave={resumeAutoScroll}
                >
                    <Marquee speed={50} gradient={false} pauseOnHover={true}>
                        {infiniteItems.slice(0,9).map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                style={{ marginRight: 16 }}
                            >
                                <MemoizedStoryItem 
                                    key={`${item.id}-${index}`}
                                    item={item} 
                                    index={index} 
                                    children={children} 
                                />
                            </div>
                        ))}
                    </Marquee>
                </div>    
            ) : null
        )   
    ) : (
        // Other devices using custom animation

        !isFocusedMode ? (
            <div
                className="os-carousel os-carouselMain"
                ref={containerRef}
                onMouseEnter={pauseAutoScroll}
                onMouseLeave={resumeAutoScroll}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="carousel-track" ref={trackRef}>
                    {infiniteItems.map((item, index) => (
                        <MemoizedStoryItem 
                            key={`${item.id}-${index}`}
                            item={item} 
                            index={index} 
                            children={children} 
                        />
                    ))}
                </div>
            </div>
        ) : null
    );
}
