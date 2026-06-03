import "./../../../css/story.css";
import shareImg from "./../../../img/send.png";
import commentImg from "./../../../img/comment.png";
import valumeUp from "./../../../img/sound.gif";
import valumemute from "./../../../img/mute-sound.png";
import dummy_video from "./../../../img/dummy_video.mp4";
import { Img } from "@/Components/UI/Content.jsx";
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useForm, usePage, router, Link } from "@inertiajs/react";
import story_tellerImg from "./../../../img/icons/story_teller_img.png";
import Follow from "./Follow";
import useIsDesktop from "@/Hooks/useIsDesktop";
import CommentModal from "../Modals/CommentModal";
import { Modal } from "@mui/material";
import LikeButton from "../UI/LikeButton";
import { useInView } from 'react-intersection-observer';
import HlsPlayer from "../HlsPlayer";
import { useMute } from "@/Contexts/MuteContext";
import axios from 'axios';
import { useStoryLikeState } from "@/Hooks/useStoryLikeState";
// Memoized FocusedStory component
const FocusedStory = memo(function FocusedStory({
  item,
  index,
  onOpenGiftModal,
  onOpenVideoModal,
  displayGift,
  onToggleMute,
  onOpenShareModal,
  onOpenDeleteModal,
  showDelete = false,
  onActivateFocus,
  onConnect
}) {
  // console.log("item",item);
  const { isMuted, toggleMute } = useMute();
  const isMobile = useIsDesktop(992);
  const { auth } = usePage().props;
  const authorId = item?.author?.id;
  const isCurrentUserStory = auth.user?.id === authorId;
  const { data, setData, post, processing, errors } = useForm({
    story_id: item.id,
    type: item?.isLiked ? "unlike" : "like",
    story_page: 'home'
  });
  const storyRef = useRef(null);
  const handleGiftClick = useCallback(() => {
    if (auth.user && displayGift) {
      onOpenGiftModal();
    } else {
      router.visit(route("login"));
    }
  }, [auth.user, displayGift, onOpenGiftModal]);
  const [isPlaying, setIsPlaying] = useState(true);
  const playLock = useRef(false);
  const debounceTimeout = useRef(null);
  const [open, setOpen] = useState(false);
  const { storyLiked, storyLikesCount, handleLike } = useStoryLikeState(item);
  const videoRef = useRef(null);
  const viewTrackedRef = useRef(false); // Track if view API has been called
  const { ref, inView } = useInView({
    threshold: 1, // Fully in view
  });

  // Track story view when video plays - ONLY when modal is open and user clicks play
  const trackStoryView = useCallback(async () => {
    // Only track if:
    // 1. Modal is open (open === true)
    // 2. User is authenticated
    // 3. Hasn't been tracked yet for this story
    if (!open || viewTrackedRef.current) {
      return;
    }

    try {
      const userId = auth?.user ? auth.user.id : null;
      console.log('Tracking story view:', { user_id: userId, story_id: item.id, modal_open: open });
      await axios.post(route('user.story.view.store'), {
        user_id: userId,
        story_id: item.id,
        ip_address: null, // Backend will get IP from request if null
      });
      viewTrackedRef.current = true; // Mark as tracked
      console.log('Story view tracked successfully');
    } catch (error) {
      // Log error but don't interrupt video playback
      console.error('Failed to track story view:', error);
    }
  }, [auth?.user, item.id, open]);

  // Reset tracking when story changes or modal closes
  useEffect(() => {
    viewTrackedRef.current = false;
  }, [item.id, open]);

  // useEffect(() => {
  //     const video = videoRef.current;
  //     if (!video) return;
  //     if (inView) {
  //         video.play().catch(() => {});
  //     }
  // }, [inView]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Clear any previous debounce
    clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      if (inView) {
        try {
          if (video.paused && !playLock.current) {
            playLock.current = true;
            await video.play();
            // Don't track here - only track when modal is open and user clicks play
            playLock.current = false;
          }
        } catch (err) {
          // console.warn("Play failed", err);
          playLock.current = false;
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    }, 100); // Small delay to avoid race conditions

    return () => {
      clearTimeout(debounceTimeout.current);
    };
  }, [inView]);

  const handleCommentClick = useCallback(() => {
    setOpen(true);
  }, []);

  // Open/Close Modal
  const handleOpen = useCallback(() => {
    if (!isMobile) {
      scrollStoryToCenter(); // ⬅ center it
    }
    setOpen(true);
  }, [isMobile]);

  const handleClose = useCallback(() => {
    if (!isMobile) {
      const track = document.querySelector(".carousel-track");
      if (track) {
        track.classList.remove("paused", "carousel-trackstop");
      }
    }
    setOpen(false);
  }, [isMobile]);
  // const [isMuted, setIsMuted] = useState(true);
  // useEffect(() => {
  //     const handleMouseOver = () => {
  //       if (open) return;
  //       if (videoRef.current) {
  //           videoRef.current.pause();
  //       }
  //     };

  //     // const handleMouseOut = () => {
  //     //     if (videoRef.current) {
  //     //         videoRef.current.play();
  //     //     }
  //     // };

  //     const element = videoRef.current;
  //     if (element) {
  //       if (!open) {
  //         element.addEventListener("mouseover", handleMouseOver);
  //       }
  //       element.addEventListener('mouseout', handleMouseOut);
  //       element.addEventListener('touchstart', handleMouseOver);
  //       element.addEventListener('touchend', handleMouseOut);
  //     }

  //     return () => {
  //       if (element) {
  //         element.removeEventListener('mouseover', handleMouseOver);
  //         element.removeEventListener('mouseout', handleMouseOut);
  //         element.removeEventListener('touchstart', handleMouseOver);
  //         element.removeEventListener('touchend', handleMouseOut);
  //       }
  //     };
  // }, []);
  // const toggleMute = useCallback(() => {
  //     onToggleMute();
  // }, [onToggleMute]);

  // Track user-initiated play clicks when modal is open
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Track when user manually plays video (only when modal is open)
    const handlePlay = () => {
      // Only track if modal is open and user clicked play
      if (open && !viewTrackedRef.current) {
        trackStoryView();
      }
    };

    // Track when user clicks on video element (to play)
    const handleVideoClick = (e) => {
      // Only track if modal is open, video is paused, and user clicks to play
      if (open && video.paused && !viewTrackedRef.current) {
        // Play will trigger the 'play' event which will call trackStoryView
        video.play().catch(() => {});
      }
    };

    // Always add listeners, but check open state inside handlers
    video.addEventListener('play', handlePlay);
    video.addEventListener('click', handleVideoClick);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('click', handleVideoClick);
    };
  }, [trackStoryView, open]);
  const modalStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px",
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 3,
  };

  useEffect(() => {
    if (!isMobile || !videoRef.current) return;
    const pauseOtherVideos = () => {
      const videos = document.querySelectorAll("video.card-video");
      videos.forEach((v) => {
        if (v !== videoRef.current) {
          v.pause();
          v.currentTime = 0;
        }
      });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio === 1) {
          pauseOtherVideos();
          videoRef.current.play().then(() => {
            // Don't track here - only track when modal is open and user clicks play
          }).catch(() => { });
        } else {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      },
      {
        threshold: 1.0
      }
    );

    observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, [!isMobile]);

  useEffect(() => {
    const track = document.querySelector(".carousel-track");
    if (!track || isMobile) return;

    if (open) {
      track.classList.add("paused", "carousel-trackstop");
    } else {
      track.classList.remove("paused", "carousel-trackstop");
    }
  }, [open, isMobile]);

  const scrollStoryToCenter = useCallback(() => {
    const storyEl = storyRef.current;
    const trackEl = document.querySelector(".carousel-track");
    if (!storyEl || !trackEl) return;

    const trackRect = trackEl.getBoundingClientRect();
    const storyRect = storyEl.getBoundingClientRect();

    const offset = storyRect.left - trackRect.left;
    const centerOffset = offset - (trackEl.clientWidth / 2 - storyEl.clientWidth / 2);

    // Smooth scroll the track to center the item
    trackEl.scrollTo({
      left: trackEl.scrollLeft + centerOffset,
      behavior: "smooth"
    });
  }, []);

  return (
    <div ref={storyRef} className="os-carousel__item video-wrapper">
      {/* <HlsPlayer
        src={item?.master_url}
        poster={item?.thumbnail}
        muted={isMuted}
        style={{
          position: 'absolute',
          zIndex: 2
        }}
      /> */}
      <video
          className="card-video"
          ref={videoRef}
          src={item?.src}
          poster={item?.thumbnail} // shows thumbnail until loaded
          autoPlay={!open} // Don't autoplay when modal is open
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          controls={open} // Show controls when modal is open so user can click play
          style={{ WebkitAppearance: "none" }} // prevents iOS UI
          onLoadedData={(e) => {
            if (!open) {
              e.target.play().catch(() => {});
            }
          }}
          onClick={(e) => {
            // Track when user clicks play button (when modal is open)
            const video = e.target;
            if (open && video.paused && auth.user && !viewTrackedRef.current) {
              video.play().then(() => {
                // Play event will trigger tracking via handlePlay listener
              }).catch(() => {});
            }
          }}
        />
      {/* {(isMobile) ? (
            <video
              className="card-video"
              ref={videoRef}
              src={item?.src}
              poster={item?.thumbnail} // shows thumbnail until loaded
              autoPlay
              loop
              muted // hard-coded muted for iOS autoplay
              playsInline
              preload="auto"
              controls={false} // must not be conditionally rendered
              style={{ WebkitAppearance: "none" }} // prevents iOS UI
              onLoadedData={(e) => e.target.play().catch(() => {})} // force play after load
            />
        ) :(
          inView && (
            <video
              className="card-video"
              ref={videoRef}
              src={item?.src}
              poster={item?.thumbnail} // shows thumbnail until loaded
              autoPlay
              loop
              muted // hard-coded muted for iOS autoplay
              playsInline
              preload="auto"
              controls={false} // must not be conditionally rendered
              style={{ WebkitAppearance: "none" }} // prevents iOS UI
              onLoadedData={(e) => e.target.play().catch(() => {})} // force play after load
            />
          )


            // <video
            //   className="card-video"
            //   src={item?.src}
            //   ref={videoRef}
            //   playsInline
            //   autoPlay
            //   loop
            //   muted={isMuted}
            //   controls={false}
            //   preload="auto"
            // ></video>
        )} */}

      {(!isMobile && open) && (
        <CommentModal open={open} closeModal={handleClose} item={item} handleGiftClick={onOpenGiftModal} />
      )}

      <div className="shareandiconsec">
        {(isMobile) && (
          <Modal className="desktopmodal" open={open} onClose={handleClose}>
            <CommentModal open={open} closeModal={handleClose} item={item} handleGiftClick={onOpenGiftModal} />
          </Modal>
        )}
        {(!open) && (
          <>
            <LikeButton
              liked={storyLiked}
              likesCount={storyLikesCount}
              onLike={() => handleLike("like")}
              onDislike={() => handleLike("unlike")}
            />
            <span className="os-story-card__comment" onClick={handleCommentClick}>
              <Img src={commentImg} width={24} height={24} />
              {item?.comments?.length}
            </span>

            <span className="os-story-card__share">
              <Img
                src={shareImg}
                width={24}
                height={24}
                onClick={() => onOpenShareModal(item)}
              />
              {item?.total_share}
            </span>
            <a href="javascript:void(0);"  onClick={(e)=>onConnect(e,item)}>
                <span className="os-story-card__share story_tellerImg"  style={{ 
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
                    <img src={story_tellerImg} width={24} height={24} alt="" />
                </span>
            </a>
          </>
        )}
      </div>
      {item?.story_status_id === 1 && (
        <>
          <div className="os-story-card__pending">Pending</div>
          {showDelete && (
            <Img
              src={"/img/icons/delete.svg"}
              width={20}
              height={22}
              className="os-story-card__delete"
              onClick={onOpenDeleteModal}
            />
          )}
        </>
      )}
      <div className="os-story-card__content">
        <div className="os-story-card__content-top">
          <div className="userprofile">
            <img
              src={item?.author?.avatar || "/img/avatar.png"}
              width={50}
              height={50}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              alt={item?.author?.name || "Story author"}
            />
          </div>
          <div className="os-story-card__content-bottom-left d-block">
            <div className="os-story-card__title">
              <Link href={route("user.profile.index", { user_id: item.author.id })}>{item?.author?.name} </Link>
            </div>

            <div className="os-story-card__categories">
              <Follow userId={authorId} isFollowing={item?.author?.is_following} pages="story" />
              <div className="os-story-card__category" onClick={handleGiftClick}>Gift Storyteller</div>
            </div>
          </div>
          <span className="os-story-card__sound" onClick={toggleMute}>
            <img
              src={isMuted ? valumemute : valumeUp}
              className={isMuted ? "volumemute" : "volumeunmute"}
              alt={isMuted ? "Muted" : "Unmuted"}
            />
          </span>
        </div>
      </div>
    </div>
  );
});

export default FocusedStory;
