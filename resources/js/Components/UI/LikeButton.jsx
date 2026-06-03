import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

/**
 * Heart like control. Pass `liked` + `likesCount` for controlled mode (persists when unmounted, e.g. story modal).
 * Omit them to use legacy uncontrolled `initialLiked` / `initialLikesCount`.
 */
const LikeButton = ({
    initialLiked,
    initialLikesCount,
    liked: likedProp,
    likesCount: likesCountProp,
    onLike,
    onDislike,
    // Lucide Heart size; match adjacent comment/share icon dimensions when needed
    iconSize = 24,
}) => {
    const controlled =
        likedProp !== undefined && likesCountProp !== undefined;

    const [liked, setLiked] = useState(!!initialLiked);
    const [likesCount, setLikesCount] = useState(
        Number(initialLikesCount) || 0
    );

    useEffect(() => {
        if (controlled) return;
        setLiked(!!initialLiked);
    }, [initialLiked, controlled]);

    useEffect(() => {
        if (controlled) return;
        setLikesCount(Number(initialLikesCount) || 0);
    }, [initialLikesCount, controlled]);

    const isLiked = controlled ? !!likedProp : liked;
    const count = controlled
        ? Number(likesCountProp) || 0
        : likesCount;

    const handleClick = () => {
        if (isLiked) {
            onDislike?.();
            if (!controlled) {
                setLiked(false);
                setLikesCount((prev) => Math.max(0, prev - 1));
            }
        } else {
            onLike?.();
            if (!controlled) {
                setLiked(true);
                setLikesCount((prev) => prev + 1);
            }
        }
    };

    return (
        <span className="os-story-card__heart" onClick={handleClick}>
            <Heart
                size={iconSize}
                strokeWidth={2.25}
                className="transition-colors"
                style={{
                    color: isLiked ? "#30D5C8" : "#FFFFFF",
                    fill: isLiked ? "#30D5C8" : "transparent",
                }}
            />
            {count}
        </span>
    );
};

export default LikeButton;
