import React, { memo } from "react";
import useIsDesktop from "@/Hooks/useIsDesktop";
import DesktopAllimgStory from "./DesktopAllimgStory";
import MobileAllimgStory from "./MobileAllimgStory";

// Main AllimgStory component that conditionally renders desktop or mobile version
const AllimgStory = memo(function AllimgStory({
    item,
    onOpenGiftModal,
    onOpenVideoModal,
    displayGift,
    onOpenShareModal,
    onOpenDeleteModal,
    showDelete = false,
    isUserProfilePage = false,
}) {
    const isDesktop = useIsDesktop(992);
    
    // Conditionally render desktop or mobile version
    if (isDesktop) {
        return (
            <DesktopAllimgStory
                item={item}
                onOpenGiftModal={onOpenGiftModal}
                onOpenVideoModal={onOpenVideoModal}
                displayGift={displayGift}
                onOpenShareModal={onOpenShareModal}
                onOpenDeleteModal={onOpenDeleteModal}
                showDelete={showDelete}
                isUserProfilePage={isUserProfilePage}
            />
        );
        } else {
    return (
            <MobileAllimgStory
                item={item}
                onOpenGiftModal={onOpenGiftModal}
                onOpenVideoModal={onOpenVideoModal}
                displayGift={displayGift}
                onOpenShareModal={onOpenShareModal}
                onOpenDeleteModal={onOpenDeleteModal}
                showDelete={showDelete}
                isUserProfilePage={isUserProfilePage}
            />
        );
    }
});

export default AllimgStory;
