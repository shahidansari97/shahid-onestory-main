import shareImg from "./../../../img/send.png";
import commentImg from "./../../../img/comment.png";
import valumeUp from "./../../../img/sound.gif";
import valumemute from "./../../../img/mute-sound.png";
import dummy_video from "./../../../img/dummy_video.mp4";
import { Img } from "@/Components/UI/Content.jsx";
import React, { useState, useEffect, useRef } from "react";
import { useForm, usePage, router, Link } from "@inertiajs/react";
import story_tellerImg from "./../../../img/icons/story_teller_img.png";
import Follow from "./Follow";
import CommentModal from "../Modals/CommentModal";
import LikeButton from "../UI/LikeButton";
import { useInView } from "react-intersection-observer";
import HlsPlayer from "../HlsPlayer";
import { useStoryLikeState } from "@/Hooks/useStoryLikeState";
export default function StoryAppleMobile({
  item,
  index,
  isMobile,
  currentSlide,
  onOpenGiftModal,
  displayGift,
  onOpenShareModal,
  onActivateFocus,
  onConnect
}) {
  // console.log("Item in mobile",item)
  const { auth } = usePage().props;
  const authorId = item?.author?.id;
  const { setData } = useForm({
    story_id: item.id,
    type: item?.isLiked ? "unlike" : "like",
    story_page: "home",
  });

  const storyRef = useRef(null);
  const videoRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [open, setOpen] = useState(false);
  const { storyLiked, storyLikesCount, handleLike } = useStoryLikeState(item);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoPaused, setVideoPaused] = useState(true);

  // Observe full visibility
  const { ref, inView } = useInView({
    threshold: 1,
    rootMargin: "0px",
  });

  useEffect(() => {
    setIsVisible(inView);
  }, [inView]);

  // Load video only when visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      video.src = item?.preview || dummy_video;
      video.load();
    } else {
      video.pause();
      video.removeAttribute("src");
      video.load();
      setVideoLoaded(false);
      setVideoPaused(true);
    }
  }, [isVisible, item?.src]);

  // Autoplay muted
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible && videoLoaded) {
      video.muted = true; // iOS safe start
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isVisible, videoLoaded]);

  const handleUnmuteClick = (e) => {
    e.stopPropagation();
    // const video = videoRef.current;
    // if (!video) return;
    // if (isMuted) {
    //   video.muted = false;
    //   video.play().catch(() => {});
    // } else {
    //   video.muted = true;
    // }
    setIsMuted(video.muted);
  };

  const handleCommentClick = () => {
    if (!isMobile) {
      onActivateFocus(item.id);
    } else {
      setOpen(true);
    }
  };

  const handleOpen = () => {
      onActivateFocus(item.id);
  };
  return (
    <div
      ref={(el) => {
        storyRef.current = el;
        ref(el);
      }}
      className={`os-carousel__item video-wrapper ${
        currentSlide === index ? "active" : ""
      }`}
      data-story-id={item.id}
      onClick={handleOpen}
    >


      <video
          className="card-video"
          autoPlay={true}
          muted={true}
          src={item?.preview}
          loop
          playsInline
          preload="auto"
          controls={false}
          poster={item?.thumbnail}
          style={{
            position: "absolute",
            zIndex: 2,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "10px",
          }}
      />
      {/* Thumbnail */}
      {/* <img
        className="card-thumbnail"
        src={item?.thumbnail || item?.src}
        alt="Story thumbnail"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "10px",
          position: "absolute",
          zIndex: 1,
          display: isVisible && videoLoaded && !videoPaused ? "none" : "block",
        }}
      /> */}

      {/* Video */}
      {/* {isVisible && (
        <video
          className="card-video"
          ref={videoRef}
          muted={isMuted}
          src={`${item?.src}#t=0,10`}
          loop
          playsInline
          preload="none"
          controls={false}
          poster={item?.thumbnail}
          onLoadStart={() => {
            setVideoLoaded(false);
            setVideoPaused(true);
          }}
          onCanPlay={() => {
            setVideoLoaded(true);
          }}
          onPlay={() => setVideoPaused(false)}
          onPause={() => setVideoPaused(true)}
          style={{
            position: "absolute",
            zIndex: 2,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      )} */}
      {/* <HlsPlayer
          src={item.master_url}
          poster={item.thumbnail}
          muted={isMuted}
          style={{ 
              position: 'absolute',
              zIndex: 2
          }}
      /> */}
      {/* Share, Like, Comment */}
      <div
        className="shareandiconsec"
        style={{ zIndex: 10, position: "relative" }}
      >
        {open && (
          <CommentModal
            open={open}
            closeModal={() => setOpen(false)}
            item={item}
            handleGiftClick={onOpenGiftModal}
          />
        )}

        {!open && (
          <>
            <LikeButton
              liked={storyLiked}
              likesCount={storyLikesCount}
              onLike={() => handleLike("like")}
              onDislike={() => handleLike("unlike")}
            />
            <span
              className="os-story-card__comment"
              onClick={handleCommentClick}
            >
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

      {/* Author + Sound Control */}
      <div
        className="os-story-card__content"
        style={{ zIndex: 10, position: "relative" }}
      >
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
              <Link
                href={route("user.profile.index", {
                  user_id: item.author.id,
                })}
              >
                {item?.author?.name}
              </Link>
            </div>
            <div className="os-story-card__categories">
              <Follow
                userId={authorId}
                isFollowing={item?.author?.is_following}
                pages="story"
              />
              <div
                className="os-story-card__category"
                onClick={onOpenGiftModal}
              >
                Gift Storyteller
              </div>
            </div>
          </div>
          <span className="os-story-card__sound" onClick={handleCommentClick}>
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
}
