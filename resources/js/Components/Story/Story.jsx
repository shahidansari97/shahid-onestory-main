import React, { memo } from "react";
import useIsDesktop from "@/Hooks/useIsDesktop";
import DesktopStory from "./DesktopStory";
import MobileStory from "./MobileStory";
// Main Story component that conditionally renders desktop or mobile version
const Story = memo(function Story({
  item,
  index,
  isActive,
  onActivate,
  currentSlide,
  onOpenGiftModal,
  onOpenVideoModal,
  displayGift,
  onOpenShareModal,
  onOpenDeleteModal,
  showDelete = false,
  onActivateFocus,
  onConnect
}) {
    const isDesktop = useIsDesktop(992);
    
    // Conditionally render desktop or mobile version
    if (isDesktop) {
        return (
            <DesktopStory
                item={item}
                index={index}
                isActive={isActive}
                onActivate={onActivate}
                currentSlide={currentSlide}
                onOpenGiftModal={onOpenGiftModal}
                onOpenVideoModal={onOpenVideoModal}
                displayGift={displayGift}
                onOpenShareModal={onOpenShareModal}
                onOpenDeleteModal={onOpenDeleteModal}
                showDelete={showDelete}
                onActivateFocus={onActivateFocus}
                onConnect={onConnect}
            />
        );
        } else {
    return (
            <MobileStory
                item={item}
                index={index}
                isActive={isActive}
                onActivate={onActivate}
                currentSlide={currentSlide}
                onOpenGiftModal={onOpenGiftModal}
                onOpenVideoModal={onOpenVideoModal}
                displayGift={displayGift}
                onOpenShareModal={onOpenShareModal}
                onOpenDeleteModal={onOpenDeleteModal}
                showDelete={showDelete}
                onActivateFocus={onActivateFocus}
                onConnect={onConnect}
            />
        );
    }
});

// Add cleanup for cached video URLs
Story.cleanup = function() {
    // This will be called when the component is unmounted
    if (window.__oneStoryVideoCache) {
        // Clear all cached URLs when component unmounts
        for (const [id, url] of window.__oneStoryVideoCache.objectUrls.entries()) {
            try { URL.revokeObjectURL(url); } catch (_) {}
        }
        window.__oneStoryVideoCache.objectUrls.clear();
    }
};

export default Story;
