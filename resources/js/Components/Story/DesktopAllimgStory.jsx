import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { useForm, usePage, router, Link } from "@inertiajs/react";
import { default as NewModal } from '@/Components/Modal';
import axios from 'axios';
import useViewportVideo from "@/Hooks/useViewportVideo";
import { Modal } from "@mui/material";
import LikeButton from "../UI/LikeButton";
import CommentModal from "../Modals/CommentModal";
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

// Desktop-specific AllimgStory component with hover behavior
const DesktopAllimgStory = memo(function DesktopAllimgStory({
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
    const isCurrentUserStory = auth.user?.id === authorId;
    const [confirmingStoryDeletion, setConfirmStoryDeletion] = useState(false);
    const { elementRef, shouldShowVideo, isInViewport, isFullyVisible } =
        useViewportVideo(item?.src, item?.thumbnail, true); // true for desktop
    const menuRef = useRef(null);
    const videoRef = useRef(null);
    const muteClickInProgress = useRef(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Use GlobalSoundContext for global audio management
    const { isGlobalMuted, setGlobalSoundFromVideo } = useGlobalSound();

    const [isMuted, setIsMuted] = useState(true);

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
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const handleCloseCommentModal = () => {
        console.log('🎬 Closing comment modal');
        setOpenCommentModal(false);
    };
    const handleOpenCommentModal = () => {
        setOpenCommentModal(true);
    }

    // Navigation handlers
    const handleNextVideo = () => {
        console.log('🎬 Next video requested, current index:', currentIndex, 'total stories:', allStories.length);
        if (currentIndex < allStories.length - 1 && onOpenVideoModal) {
            const nextStory = allStories[currentIndex + 1];
            console.log('🎬 Opening next story:', nextStory.id);
            onOpenVideoModal(nextStory, "video", nextStory.author);
        }
    };

    const handlePrevVideo = () => {
        console.log('🎬 Previous video requested, current index:', currentIndex);
        if (currentIndex > 0 && onOpenVideoModal) {
            const prevStory = allStories[currentIndex - 1];
            console.log('🎬 Opening previous story:', prevStory.id);
            onOpenVideoModal(prevStory, "video", prevStory.author);
        }
    };

    // Determine if this video should be muted based on viewport visibility and global mute state
    const shouldMute = isHovered ? isGlobalMuted : (isMuted || !isFullyVisible);

    const handleToggleMute = (e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        if (muteClickInProgress.current) {
            console.log(`⏸️ Video ${item.id}: Mute click already in progress, ignoring`);
            return;
        }

        const video = videoRef.current;
        if (!video) return;

        muteClickInProgress.current = true;

        const nextMuted = !isMuted;
        console.log(`🔊 Video ${item.id}: Toggle mute from ${isMuted} to ${nextMuted}`);

        setIsMuted(nextMuted);
        setGlobalSoundFromVideo(nextMuted);
        video.muted = nextMuted;

        if (isHovered && !video.paused) {
            console.log(`🔄 Video ${item.id}: Restarting to apply mute state`);
            const currentTime = video.currentTime;
            video.pause();
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.currentTime = currentTime;
                    videoRef.current.muted = nextMuted;
                    videoRef.current.play().catch((err) => {
                        console.log('Play failed:', err);
                    });
                }
                muteClickInProgress.current = false;
            }, 100);
        } else {
            muteClickInProgress.current = false;
        }
    };

    // Desktop video playback: play on hover or when fully visible
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        console.log(`🎵 Video ${item.id}: shouldMute=${shouldMute}, isHovered=${isHovered}, isGlobalMuted=${isGlobalMuted}, isMuted=${isMuted}`);
        video.muted = shouldMute;

        // Desktop: play on hover or when fully visible
        const wantPlay = isHovered || (shouldShowVideo && isFullyVisible);

        const tryPlay = async () => {
            try {
                video.playsInline = true;
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
            } catch (_) { }
            try { await video.play(); } catch (_) { }
        };

        if (!wantPlay) {
            if (!video.paused) {
                video.pause();
            }
            return;
        }

        // Ensure video has src
        if (!video.getAttribute('src') && item?.src) {
            video.src = item.src;
            video.load();
        }
        tryPlay();
    }, [isHovered, shouldShowVideo, isFullyVisible, shouldMute, item?.src, isGlobalMuted]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log(`🧹 Cleaning up DesktopAllimgStory component ${item.id}`);
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.src = '';
                videoRef.current.load();
            }
            muteClickInProgress.current = false;
        };
    }, [item.id]);

    const handleLike = useCallback(async (type) => {
        if (auth.user) {
            await axios.post(route('user.stories.like', {
                story_id: item.id,
                type,
                story_page: "all-stories",
            }));
        } else {
            router.visit(route("login"));
        }
    }, [auth.user, item.id]);

    const handleOpenShareModal = useCallback(() => {
        onOpenShareModal(item);
    }, [onOpenShareModal, item]);

    const isPlaying = isHovered || (shouldShowVideo && isFullyVisible);

    const handleOpenComment = useCallback((e) => {
        if (e) e.stopPropagation();
        console.log('Opening comment modal for item:', item.id);
        handleOpenCommentModal();
    }, [handleOpenCommentModal, item.id]);

    const handleOpenVideo = useCallback((e) => {
        setOpenCommentModal(true);
    }, [handleOpenCommentModal, item.id]);

    const handleConnectToStoryTeller = (e) => {
        if (e) e.stopPropagation();
        window.location.href = `/chatify/${item?.author?.id}`;
    }
    return (
        <>
        <div className="">
             <div
                className="os-carousel__item video-wrapper "
                ref={elementRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ position: 'relative' }}
                onClick={(e) => {
                    e.stopPropagation();
                    console.log('🎬 CONTAINER CLICKED!', e);
                    handleOpenVideo(e);
                }}
            >
                <Img
                    className="os-story-card__img"
                    src={item?.thumbnail}
                    onClick={(e) => {
                        console.log('🎬 IMG CLICKED!', e);
                        handleOpenVideo(e);
                    }}
                    style={{ cursor: 'pointer' }}
                />
                {(isHovered || shouldShowVideo) && (
                    <video
                        className="card-video"
                        ref={videoRef}
                        src={(isHovered || isFullyVisible) ? item?.src : undefined}
                        poster={item?.thumbnail}
                        autoPlay={isPlaying}
                        loop
                        muted={shouldMute}
                        playsInline
                        preload={isHovered ? "auto" : "metadata"}
                        controls={false}
                        style={{ WebkitAppearance: "none" }}
                        onLoadedData={(e) => e.target.play().catch(() => { })}
                        onClick={(e) => {
                            console.log('🎬 VIDEO CLICKED!', e);
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
                            top: 10,
                            right: 12,
                            width: '34px',
                            height: '34px',
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
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgb(139 130 114)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgb(139 130 114)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <Trash size={18} color="white" strokeWidth={2.5} />
                    </div>
                )} */}


                {/* Top-right sound toggle overlay */}
                <span
                    className="os-story-card__sound"
                    onClick={handleToggleMute}
                    style={{ position: 'absolute', top: 8, right: isUserProfilePage && showDelete && auth?.user?.id === item?.author?.id ? 12 : 12, cursor: 'pointer', zIndex: 9999 }}
                >
                    <img
                        src={isPlaying ? valumeUp : valumemute}
                        className={isPlaying ? "volumeunmute" : "volumemute"}
                        alt={isPlaying ? "Playing" : "Paused"}
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



                <div className="shareandiconsec sharedesktop" style={{ zIndex: 10, position: 'absolute', right: '12px', bottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'none' }}>
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
                    <a href="javascript:void(0);" onClick={(e) => handleConnectToStoryTeller(e)}>
                        <span className="os-story-card__share story_tellerImg" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            opacity: 1,
                            pointerEvents: 'auto',
                            minWidth: '40px',
                            minHeight: '40px',
                            justifyContent: 'center'
                        }}>
                            <img src={story_tellerImg} width={28} height={28} alt="" />
                        </span>
                    </a>
                </div>

                <div className="os-story-card__content">
                    <div className="os-story-card__content-top">
                        <div className="userprofile">
                            <img src={item?.author?.avatar} width={50} height={50} />
                        </div>
                        <div className="os-story-card__content-bottom-left  block d-block">
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
                        </div>
                    </div>
                </div>
               
            </div>
             {isUserProfilePage && showDelete && auth?.user?.id === item?.author?.id && (
                    <div className="delete_btn_ourStory">
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
        </div>
           
            <NewModal show={confirmingStoryDeletion} onClose={closeModal} maxWidth="sm">
                <form onSubmit={deleteStory} className="os-form">
                    <h2 className="text-lg font-medium text-gray-900">
                        Are you sure you want to delete this story?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Once your story is deleted, it will be removed permanently.
                    </p>
                    <div className="mt-6" style={{ 'width': '100%', 'display': 'flex', 'justifyContent': 'center', 'gap': '20px' }}>
                        <Button type="button" onClick={closeModal}>Cancel</Button>

                        <Button type="submit" className="outline">
                            Delete Story
                        </Button>
                    </div>
                </form>
            </NewModal>
            {openCommentModal && (
                <Modal className="desktopmodal" open={openCommentModal} onClose={handleCloseCommentModal}>
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
                </Modal>
            )}
        </>
    );
});

export default DesktopAllimgStory;
