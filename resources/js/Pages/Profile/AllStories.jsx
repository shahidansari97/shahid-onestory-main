import './../../../css/gift.css';
import './../../../css/profile.css';
import './../../../css/story.css';
import './../../../css/form.css';
import { useSwipeable } from "react-swipeable";
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import GuestLayout from '@/Layouts/GuestLayout';
import {
    Modal,
} from "@mui/material";
import Tabs from "@/Components/UI/Tabs.jsx";
import { default as CustomModal } from "@/Components/Modal.jsx";
import ModalContent from "@/Components/Modals/ModalContent.jsx";
import { Head, usePage, router } from "@inertiajs/react";
import axios from 'axios';
import Allimgstory from '@/Components/Story/Allimgstory';
import useIsDesktop from "@/Hooks/useIsDesktop";
import useGlobalMute from "@/Hooks/useGlobalMute";
import AllHighlightStories from '@/Components/Story/AllHighlightStories';
import Carousel from "@/Components/Story/StoryCarousel.jsx";
import { motion, AnimatePresence } from "framer-motion";
import CommentModal from "../../../js/Components/Modals/CommentModal";
export default function AllStories({ storiesByCategory = {}, categories = [], gifts, sharedStory ,hightLightStories
}) {
    const [open, setOpen] = useState(false);
    const { success, message, new_balance, auth } = usePage().props;
    const isMobile = useIsDesktop(992);
    const user = auth.user;
    const path = window.location.pathname;
    const { isGlobalMuted, toggleGlobalMute, setGlobalMute } = useGlobalMute();
    const [currentStoryId, setCurrentStoryId] = useState(null);
    const [activeCategory, setActiveCategory] = useState(categories[0] || '');
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [customAmount, setCustomAmount] = useState(0.00);
    const [activeCardIndex, setActiveCardIndex] = useState(null);
    const [wallet, setWallet] = useState();
    const [error, setError] = useState(false);
    const [activeDepositCard, setActiveDepositCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refillSuccess, setRefillSuccess] = useState(false);
    const [storiesData, setStoriesData] = useState(storiesByCategory);
    const [page, setPage] = useState({});
    const [selectedStoryId, setSelectedStoryId] = useState(null);
    useEffect(() => {
        if (sharedStory) {
            setOpen(true);
        }
    }, [sharedStory]);

    useEffect(() => {
        if (categories.length) {
            const initialPage = categories.reduce((acc, category) => {
                acc[category] = 2;
                return acc;
            }, {});
            setPage(initialPage);
        }
    }, [categories]);

    const openModal = (item, type, author) => {
        setModalData({ item, author });
        setModalType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalData(null);
        setModalType(null);
        setActiveCardIndex(null);
        setError(false);
        setRefillSuccess(false);
    };

    const handleGiftClick = (index) => {
        setActiveCardIndex(index);
    };

    const loadMoreStories = useCallback(async (category) => {
        if (loading || !storiesData[category] || storiesData[category].currentPage >= storiesData[category].lastPage) {
            return;
        }

        setLoading(true);

        try {
            const currentPage = page[category] || 1;
            const response = await axios.get(`/all-stories/load-more-stories/${category}`, {
                params: { page: currentPage },
            });

            setStoriesData((prevData) => {
                const updatedStories = response.data.stories;
                const existingStories = prevData[category]?.stories || [];

                return {
                    ...prevData,
                    [category]: {
                        ...prevData[category],
                        stories: [...existingStories, ...updatedStories],
                        currentPage: response.data.currentPage,
                        lastPage: response.data.lastPage,
                    },
                };
            });

            setPage((prevPages) => ({
                ...prevPages,
                [category]: currentPage + 1,
            }));
        } catch (error) {
            console.error('Error loading more stories:', error);
        } finally {
            setLoading(false);
            //console.log('Loading state set to false');
        }
    }, [loading, page, storiesData]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.documentElement.scrollHeight - 100;

            if (scrollPosition >= threshold && !loading) {
                loadMoreStories(activeCategory);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [activeCategory, loading, loadMoreStories]);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    // Calculate today's date once using useMemo to avoid hoisting issues
    const { todayTimestamp, todayFormatted, todayDateString } = useMemo(() => {
        const today = new Date();
        // Get date string in YYYY-MM-DD format for comparison (timezone-independent)
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        // Also set hours to 0 for timestamp comparison
        today.setHours(0, 0, 0, 0);
        const timestamp = today.getTime();
        
        const formatted = today.toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric' 
        });
        
        console.log('Today calculated:', { dateString, formatted, timestamp });
        
        return { todayTimestamp: timestamp, todayFormatted: formatted, todayDateString: dateString };
    }, []);

    const storyIdFromPath = useMemo(() => {
        const segments = path.split("/").filter(Boolean);
        if (segments[0] === "all-stories" && segments[1]) {
            setCurrentStoryId(segments[1]);
        }
    }, [path]);
    useEffect(() => {
        if(!isMobile && currentStoryId){
            setOpen(false);
            router.visit(route("stories.highlight",{story_id:currentStoryId,type:'shared'}));
        }
    }, [currentStoryId]);


    const trackRef = useRef(null);
    const animationRef = useRef(null);
    const currentX = useRef(0);
    const [isPaused, setIsPaused] = useState(false);
    const speed = 1;

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const totalWidth = () => track.scrollWidth / 2;

        const animate = () => {
        if (!isPaused) {
            currentX.current -= speed;

            if (Math.abs(currentX.current) >= totalWidth()) {
            currentX.current = 0;
            }

            track.style.transform = `translateX(${currentX.current}px)`;
        }

        animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationRef.current);
    }, [isPaused]);
    const handleClose = () => setOpen(false);
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);
    return (
        <GuestLayout>
            <Head title='Stories' />
            <div
                className="overflow-hidden w-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={trackRef}
                    className="heighlightstory carousel-trackallstory flex whitespace-nowrap will-change-transform"

                >
                    {/* {[...Array(2)].map((_, i) => ( */}
                    <div
                        
                        className="allstory_scroll flex gap-4 sm:gap-6 md:gap-8 lg:gap-10"
                    >
                        {hightLightStories.map((item, index) => (
                        <div
                            key={`${index}`}
                            className="md:w-full"
                        >
                            <AllHighlightStories
                                item={item}
                                storyList={hightLightStories}
                                displayGift={true}
                                isGlobalMuted={isGlobalMuted}
                                onToggleGlobalMute={toggleGlobalMute}
                                onOpenGiftModal={() => openModal(item, "gift", item.author)}
                                onOpenVideoModal={() => openModal(item, "video", item.author)}
                                onOpenShareModal={() => openModal(item.id, "share")}
                            />
                        </div>
                        ))}
                    </div>
                    {/* ))} */}
                </div>
            </div>
            <Tabs
                categories={categories}
                onTabChange={handleCategoryChange}
                enableScrolling={false}
                isIcon={true}
            >
                {categories.map((category, index) => {
                    const stories = storiesData[category]?.stories || [];
                    
                    // Group stories by date (today vs others)
                    const todayStories = [];
                    const otherStories = [];
                    
                    stories.forEach((item) => {
                        // Check for created_at in various formats
                        const storyDateStr = item.created_at || item.createdAt || item.created;
                        
                        if (storyDateStr) {
                            const storyDate = new Date(storyDateStr);
                            if (!isNaN(storyDate.getTime())) {
                                // Extract date string in YYYY-MM-DD format (timezone-independent comparison)
                                const storyYear = storyDate.getFullYear();
                                const storyMonth = String(storyDate.getMonth() + 1).padStart(2, '0');
                                const storyDay = String(storyDate.getDate()).padStart(2, '0');
                                const storyDateString = `${storyYear}-${storyMonth}-${storyDay}`;
                                
                                // Debug logging for first story
                                if (category === 'All' && stories.indexOf(item) === 0) {
                                    console.log('First story date comparison:', {
                                        id: item.id,
                                        created_at: item.created_at,
                                        storyDateString: storyDateString,
                                        todayDateString: todayDateString,
                                        isToday: storyDateString === todayDateString
                                    });
                                }
                                
                                // Compare date strings (timezone-independent)
                                if (storyDateString === todayDateString) {
                                    todayStories.push(item);
                                } else {
                                    otherStories.push(item);
                                }
                            } else {
                                // Invalid date, add to others
                                otherStories.push(item);
                            }
                        } else {
                            // If no date, add to others
                            otherStories.push(item);
                        }
                    });
                    
                    // Debug logging
                    if (category === 'All') {
                        console.log(`Category: ${category}`, {
                            totalStories: stories.length,
                            todayStories: todayStories.length,
                            otherStories: otherStories.length,
                            todayDate: todayFormatted
                        });
                    }
                    
                    return (
                        <div key={index} style={{ width: '100%' }}>
                            {/* Today's Stories Section */}
                            {(todayStories.length > 0 || category === 'All') && (
                                <>
                                    <div style={{ 
                                        width: '100%', 
                                        padding: '24px 0', 
                                        marginBottom: '24px',
                                        marginTop: '24px',
                                        boxSizing: 'border-box',
                                        backgroundColor: 'transparent'
                                    }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '16px', 
                                            width: '100%',
                                            maxWidth: '100%',
                                            justifyContent: 'flex-start'
                                        }}>
                                            <h2 style={{ 
                                                fontSize: '28px', 
                                                fontWeight: 'bold', 
                                                color: '#111827', 
                                                whiteSpace: 'nowrap', 
                                                margin: 0,
                                                padding: 0,
                                                flexShrink: 0,
                                                lineHeight: '1.2'
                                            }}>{todayFormatted}</h2>
                                            {/* <div style={{ 
                                                flex: 1, 
                                                height: '2px', 
                                                backgroundColor: '#6B7280',
                                                minWidth: 0,
                                                opacity: 1
                                            }}></div> */}
                                        </div>
                                    </div>
                                    {/* video */}
                                    {todayStories.length > 0 && (
                                        <div
                                            className={((path === '/all-stories' || path.startsWith('/all-stories/')) && isMobile) ? 'os-profile__stories-grid os-profile__stories-grid--all-stories allstoriesSec justify-start' : 'os-profile__stories-grid os-profile__stories-grid--all-stories'}
                                        >
                                            {todayStories.map((item) => (
                                                <Allimgstory
                                                    key={item.id}
                                                    item={item}
                                                    displayGift={true}
                                                    onOpenGiftModal={() => openModal(item, "gift", item.author)}
                                                    onOpenVideoModal={() => openModal(item, "video", item.author)}
                                                    onOpenShareModal={() => openModal(item.id, "share")}
                                                />
                                            ))}
                                        </div>
                                    )}
                                   

                                    {/* Separator after today's stories */}
                                    {otherStories.length > 0 && (
                                        <div style={{ 
                                            width: '100%', 
                                            padding: '24px 16px', 
                                            marginTop: '24px', 
                                            marginBottom: '24px',
                                            boxSizing: 'border-box'
                                        }}>
                                            <div style={{ 
                                                height: '2px', 
                                                backgroundColor: '#9CA3AF',
                                                width: '100%'
                                            }}></div>
                                        </div>
                                    )}
                                </>
                            )}
                            
                            {/* Other Stories */}
                            <div
                                className={((path === '/all-stories' || path.startsWith('/all-stories/')) && isMobile) ? 'os-profile__stories-grid os-profile__stories-grid--all-stories allstoriesSec' : 'os-profile__stories-grid os-profile__stories-grid--all-stories'}
                            >
                                {otherStories.map((item) => (
                                    <Allimgstory
                                        key={item.id}
                                        item={item}
                                        displayGift={true}
                                        onOpenGiftModal={() => openModal(item, "gift", item.author)}
                                        onOpenVideoModal={() => openModal(item, "video", item.author)}
                                        onOpenShareModal={() => openModal(item.id, "share")}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </Tabs>
            
                {open && (
                    <Modal
                        className="desktopmodal"
                        open={open}
                        onClose={handleClose}
                    >
                        <CommentModal
                            open={open}
                            closeModal={handleClose}
                            item={sharedStory}
                            handleGiftClick={() => openModal(item, "gift", item.author)}
                        />
                    </Modal>
                )}
                {showModal && (
                    <CustomModal
                        show={showModal}
                        onClose={closeModal}
                        maxWidth={modalType === 'share' ? 'lg' : 'xl'}
                        className={`modal__panel${modalType === 'deposit' ? '--deposit' : modalType === 'video' ? '--video' : ''}`}
                    >
                        <ModalContent
                            modalType={modalType}
                            modalData={modalData}
                            gifts={gifts}
                            user={user}
                            activeCardIndex={activeCardIndex}
                            handleGiftClick={handleGiftClick}
                            error={error}
                            openModal={openModal}
                            loading={loading}
                            closeModal={closeModal}
                            activeDepositCard={activeDepositCard}
                            handleDepositCardClick={setActiveDepositCard}
                            customAmount={customAmount}
                            setCustomAmount={setCustomAmount}
                            setLoading={setLoading}
                            setWallet={setWallet}
                            setError={setError}
                            setRefillSuccess={setRefillSuccess}
                            refillSuccess={refillSuccess}
                        />
                    </CustomModal>
                )}
        </GuestLayout>
    );
}


// const SwipeableStories = ({ category, stories, isMobile, ...props }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [direction, setDirection] = useState(0);
//   const containerRef = useRef(null);

//   const handlers = useSwipeable({
//     onSwipedLeft: () => {
//       setDirection(1);
//       if (currentIndex < stories.length - 1) setCurrentIndex(currentIndex + 1);
//     },
//     onSwipedRight: () => {
//       setDirection(-1);
//       if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
//     },
//     preventScrollOnSwipe: true,
//     trackTouch: true,
//   });

//   useEffect(() => {
//     if (isMobile) return;
//     const interval = setInterval(() => {
//       setDirection(1);
//       setCurrentIndex((prev) => (prev + 1) % stories.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [isMobile, stories.length]);

//   const variants = {
//     initial: (dir) => ({
//       x: dir > 0 ? "100%" : "-100%",
//       opacity: 0,
//       position: "absolute",
//     }),
//     animate: {
//       x: 0,
//       opacity: 1,
//       position: "relative",
//       transition: { duration: 0.6, ease: "easeInOut" },
//     },
//     exit: (dir) => ({
//       x: dir > 0 ? "-100%" : "100%",
//       opacity: 0,
//       position: "absolute",
//       transition: { duration: 0.6, ease: "easeInOut" },
//     }),
//   };

//   return (
//     <div
//       className="relative w-full h-[90vh] overflow-hidden flex items-center justify-center"
//       ref={containerRef}
//       {...handlers}
//     >
//       <AnimatePresence custom={direction} initial={false} mode="sync">
//         <motion.div
//           key={stories[currentIndex]?.id}
//           custom={direction}
//           variants={variants}
//           initial="initial"
//           animate="animate"
//           exit="exit"
//           className="w-full h-full flex items-center justify-center"
//         >
//           <div className="w-full h-full max-w-[700px] mx-auto bg-white rounded-md shadow-lg overflow-hidden">
//             <Allimgstory
//               item={stories[currentIndex]}
//               displayGift={true}
//               isGlobalMuted={props.isGlobalMuted}
//               onToggleGlobalMute={props.onToggleGlobalMute}
//               onOpenGiftModal={() => props.onOpenGiftModal(stories[currentIndex])}
//               onOpenVideoModal={() => props.onOpenVideoModal(stories[currentIndex])}
//               onOpenShareModal={() => props.onOpenShareModal(stories[currentIndex])}
//             />
//           </div>
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// };
