import "./../../../css/story.css";

import playicon from './../../../img/play-icon.png';
import React from "react";
import { useForm,usePage, router, Link } from "@inertiajs/react";
import axios from 'axios';
import { Modal } from "@mui/material";
import CommentModal from "../Modals/CommentModal";
import { useState } from "react";
import useIsDesktop from "@/Hooks/useIsDesktop";
export default function AllHighlightStories({
  item,
  onOpenGiftModal,
  storyList,
  onOpenVideoModal,
  displayGift,
  isGlobalMuted,
  onToggleGlobalMute,
  onOpenShareModal,
  selectedStoryId,
  setSelectedStoryId,
  onOpenDeleteModal,
  showDelete = false
}) {
    const { auth } = usePage().props;
    const authorId = auth?.user?.id;
    const {data, setData, post, processing, errors} = useForm({
        story_id: item.id,
        type: item?.isLiked ? "unlike" : "like",
    });
    const handleGiftClick = () => {
        if (auth.user && displayGift) {
            onOpenGiftModal();
        } else {
            router.visit(route("login"));
        }
    };
    const [open, setOpen] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [commentClosed, setIsCommentClosed] = useState(false);

    const handleLike = async(type) => {
        console.log("type",type)
        if (auth.user) {
            const response = await axios.post(route('user.stories.like', {
                story_id: item.id,
                type: type,
                story_page: "all-stories",
            }));
        } else {
            router.visit(route("login"));
        }
    };
    const handleOpen = () => {
        if(!isMobile){
            console.log("is Testetd",item.id);
            router.visit(route("stories.highlight",{story_id:item.id}));
        }else{
            console.log("video")
            setOpen(true);
        }
    }
    const handleOpenCommentModal = () => {
        setOpen(true);
        if(!isMobile){
            setIsCommentClosed(true);
        }
    }
    const handleCloseCommentModal = () =>{
        setOpen(false);
        if(!isMobile){
            setIsCommentClosed(false);
        }
    }
    const handleClose = () =>{
        if(isMobile){
            setOpen(false);
        }
        if(!isMobile){
            setIsClicked(false);
        }
    }
    const isMobile = useIsDesktop(992);

    const SwipeableCardDesktop = () => (
        <div
            className="story-card"
        >
            <div className="video-thumbnail">
                <img src={item?.thumbnail} className='fullimg' />
                <img src={playicon} className="play-button" width={34} height={34} onClick={handleOpen}  />
            </div>
            <div className="user-name">
                <div>
                    <img src={item?.author?.avatar} className='hightpro' />
                </div>
                <span>
                    <Link href={route("user.profile.index",{user_id:item.author.id})}>{item?.author?.name}</Link>
                </span>
            </div>
        </div>
    );
    return (
        <>
            {(isMobile && open) && (
                <Modal className="desktopmodal" open={open} onClose={handleClose}>
                    <CommentModal open={open} closeModal={handleClose}  item={item} handleGiftClick={onOpenGiftModal} />
                </Modal>
            )}
            <SwipeableCardDesktop />
        </>
    );
}
