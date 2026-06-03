import { useEffect, useState, useRef, useCallback,useMemo, memo } from "react";
import { X } from "lucide-react";
import FocusedStory from "@/Components/Story/FocusedStory.jsx";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";

// Memoized FocusedStoryOverlay component
const FocusedStoryOverlay = memo(function FocusedStoryOverlay({
  is_featured=false,
  stories,
  focusedId,
  displayGift,
  onClose,
  onOpenGiftModal,
  onOpenVideoModal,
  onOpenShareModal,
  onConnect
}) {
  const [isMuted, setIsMuted] = useState(true); // default muted
  const [currentId, setCurrentId] = useState(focusedId);
  const [direction, setDirection] = useState(0);
  const sliderRef = useRef();
  
  // Memoize current story calculation
  const currentIndex = stories.findIndex((s) => s.id == currentId);
  const currentStory = stories[currentIndex];
  
  // Memoize navigation functions
  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentId(
      stories[(currentIndex + 1) % stories.length].id
    );
  }, [stories, currentIndex]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentId(
      stories[(currentIndex - 1 + stories.length) % stories.length].id
    );
  }, [stories, currentIndex]);

  // Memoize swipe handlers
  const swipeHandlers = useSwipeable({
    ...(is_featured
      ? { onSwipedUp: goNext, onSwipedDown: goPrev }
      : { onSwipedLeft: goNext, onSwipedRight: goPrev }),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  // Memoize keyboard handler
  const handleKeyDown = useCallback((e) => {
    if (is_featured) {
      if (e.key === "ArrowUp") goNext();
      if (e.key === "ArrowDown") goPrev();
    } else {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    if (e.key === "Escape") onClose();
  }, [is_featured, goNext, goPrev, onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
  // Memoize animation variants
  const variants = useMemo(() => ({
    enter: (dir) => ({
      x: is_featured ? 0 : dir * 300,
      y: is_featured ? dir * 300 : 0,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: (dir) => ({
      x: is_featured ? 0 : -dir * -300,
      y: is_featured ? -dir * -300 : 0,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    }),
  }), [is_featured]);
  return (
    <div className="focused-story-overlay prettify-overlay">
      <div className="focused-overlay prettify-overlay-inner" {...swipeHandlers}>
        <div className="backdrop" onClick={onClose} />
          <button
            className="close-btn prettify-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={28} />
          </button>

        <div
          className="gallery-slider"
          ref={sliderRef}
          style={{
            width: "100vw",
            height: "100%",
            flexShrink: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
            <AnimatePresence custom={direction}  initial={false} mode="popLayout">
              <motion.div
                  key={currentStory.id}
                  className="gallery-slide active"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "tween" },
                    y: { type: "tween" },
                  }}
                  style={{
                    width: "100vw",
                    height: "100vh",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
              >
                  <div className="peek-story-inner">
                    <FocusedStory
                      item={currentStory}
                      displayGift={displayGift}
                      isFocused={currentStory.id === currentId}
                      isMuted={isMuted}
                      onToggleMute={() => setIsMuted((prev) => !prev)}
                      onOpenGiftModal={() => onOpenGiftModal(currentStory , "gift", currentStory.author)}
                      onOpenVideoModal={() =>
                        onOpenVideoModal(currentStory, "video", currentStory.author)
                      }
                      onOpenShareModal={() => onOpenShareModal(currentStory.id, "share")}
                      onConnect={onConnect}
                    />
                  </div>
              </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

export default FocusedStoryOverlay;
