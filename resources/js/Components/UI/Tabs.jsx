import React, { useState, useRef, useEffect } from 'react';
import './../../../css/tabs.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Tabs({
    categories,
    children,
    onTabChange,
    enableScrolling = false,
    isIcon = false,
}) {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const trackRef = useRef(null);

    const shouldEnableScrolling = enableScrolling && categories.length >= 10;
    const infiniteCategories = shouldEnableScrolling
        ? [...categories, ...categories, ...categories]
        : categories;
    
    // Enable horizontal scroll if there are many categories (even without enableScrolling flag)
    const hasManyCategories = categories.length > 8;

    useEffect(() => {
        if (trackRef.current && (isIcon || hasManyCategories)) {
            updateScrollIcons(); // initial icon visibility
            trackRef.current.addEventListener('scroll', updateScrollIcons);
        }
        return () => {
            if (trackRef.current && (isIcon || hasManyCategories)) {
                trackRef.current.removeEventListener('scroll', updateScrollIcons);
            }
        };
    }, [infiniteCategories, isIcon, hasManyCategories]);

    const updateScrollIcons = () => {
        const el = trackRef.current;
        if (!el) return;

        setShowLeft(el.scrollLeft > 10);
        setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    };

    const scrollTabs = (direction) => {
        const container = trackRef.current;
        if (container) {
            const scrollAmount = 200;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleTabClick = (category) => {
        setSelectedCategory(category);
        onTabChange?.(category);
    };

    return (
        <div className='os-tabs' style={{ width: '100%' }}>
            <div
                className='os-tabs__header'
                onMouseEnter={() => trackRef.current?.classList.add('paused')}
                onMouseLeave={() => trackRef.current?.classList.remove('paused')}
                style={{ position: 'relative', width: '100%' }}
            >
                {(isIcon || hasManyCategories) && showLeft && (
                <button
    onClick={() => scrollTabs('left')} // or 'right'
    style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        background: 'white',
        border: '2px solid #FFDA79',
        borderRadius: '50%',
        cursor: 'pointer',
        width: '35px',
        height: '35px',
        boxShadow: '0px 0px 5px #f4e8b6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }}
>
    <ChevronLeft color="black" size={20} />
</button>

                )}

                <div
                    className={shouldEnableScrolling ? 'tabs-track' : 'tabs-static'}
                    ref={trackRef}
                    style={{
                        overflowX: (isIcon || hasManyCategories) ? 'auto' : 'auto',
                        scrollBehavior: 'smooth',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        width: '100%',
                    }}
                >
                    {infiniteCategories.map((category, index) => (
                        <div
                            key={index}
                            className={`os-tabs__tab${
                                selectedCategory === category ? ' os-tabs__tab--active' : ''
                            }`}
                            onClick={() => handleTabClick(category)}
                        >
                            {category}
                        </div>
                    ))}
                </div>

                {(isIcon || hasManyCategories) && showRight && (
                    <button
                        onClick={() => scrollTabs('right')}
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: '50%',
                             transform: 'translateY(-50%)',
        zIndex: 1,
        background: 'white',
        border: '2px solid #FFDA79',
        borderRadius: '50%',
        cursor: 'pointer',
        width: '35px',
        height: '35px',
        boxShadow: '0px 0px 5px #f4e8b6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
                        }}
                    >
                        <ChevronRight color="black" size={20} />
                    </button>
                )}
            </div>

            <div className='os-tab__content'>
                {React.Children.map(children, (child, index) =>
                    categories[index] === selectedCategory ? child : null
                )}
            </div>
        </div>
    );
}
