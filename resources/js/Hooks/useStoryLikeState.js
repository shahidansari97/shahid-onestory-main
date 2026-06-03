import { useState, useEffect, useCallback } from "react";
import { usePage, router } from "@inertiajs/react";
import axios from "axios";
import {
    getStoryLikeFromCache,
    setStoryLikeCache,
} from "@/Utils/storyLikeCache";

/**
 * Like state for a story card: survives carousel unmount/remount (scroll away and back).
 * Merges in-memory session cache with Inertia `item` props (props stay stale until full reload).
 */
export function useStoryLikeState(item) {
    const { auth } = usePage().props;
    const id = item?.id;

    const [storyLiked, setStoryLiked] = useState(() => {
        const c = getStoryLikeFromCache(id);
        return c ? c.liked : !!item?.isLiked;
    });
    const [storyLikesCount, setStoryLikesCount] = useState(() => {
        const c = getStoryLikeFromCache(id);
        return c ? c.likesCount : Number(item?.likes_count) || 0;
    });

    useEffect(() => {
        const c = getStoryLikeFromCache(id);
        if (c) {
            setStoryLiked(c.liked);
            setStoryLikesCount(c.likesCount);
        } else {
            setStoryLiked(!!item?.isLiked);
            setStoryLikesCount(Number(item?.likes_count) || 0);
        }
    }, [id, item?.isLiked, item?.likes_count]);

    const handleLike = useCallback(
        async (type) => {
            if (!auth?.user) {
                router.visit(route("login"));
                return;
            }
            const willLike = type === "like";
            setStoryLiked(willLike);
            setStoryLikesCount((prev) => {
                const next = willLike
                    ? (Number(prev) || 0) + 1
                    : Math.max(0, (Number(prev) || 0) - 1);
                setStoryLikeCache(id, willLike, next);
                return next;
            });
            try {
                await axios.post(
                    route("user.stories.like", {
                        story_id: id,
                        type,
                        story_page: "all-stories",
                    })
                );
            } catch (_) {}
        },
        [auth?.user, id]
    );

    return { storyLiked, storyLikesCount, handleLike };
}
