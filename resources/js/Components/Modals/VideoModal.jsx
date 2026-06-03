import '../../../css/video-modal.css';
import React, { useState, useEffect } from 'react';
import { usePage, router } from "@inertiajs/react";
import axios from 'axios';
import { Img } from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import OptimizedVideoPlayer from "@/Components/UI/OptimizedVideoPlayer.jsx";
import Comment from "../Story/Comment";
import Picker from "emoji-picker-react";

export default function VideoModal({ item, onClose, onOpenGiftModal, onOpenShareModal }) {
    const { auth } = usePage().props;
    const [comments, setComments] = useState(item?.comments || []);
    const [newComment, setNewComment] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCommentSubmit = async () => {
        if (auth.user) {
            if (!newComment.trim()) return;
            setLoading(true);
            try {
                const response = await axios.post(route('stories.comments.store', {
                    story_id: item.id,
                    content: newComment,
                }));

                if (response.data.status) {
                    const createdComment = response.data.data;
                    setComments((prevComments) => {
                        return [createdComment, ...(prevComments || [])];
                    });
                    setNewComment("");
                }
            } finally {
                setLoading(false);
            }
        } else {
            router.visit(route("login"));
        }
    };

    const addCommentOnEnter = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleCommentSubmit();
        }
    };

    const onEmojiClick = (emojiObject, event) => {
        setNewComment((prev) => prev + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const handleGiftClick = () => {
        if (auth.user) {
            onOpenGiftModal();
        } else {
            router.visit(route("login"));
        }
    };

    const handleShareClick = () => {
        if (onOpenShareModal) {
            onOpenShareModal();
        }
    };

    return (
        <div className="video-modal-container">
            {/* Left Panel - Video */}
            <div className="video-modal-left">
                <div className="video-player-container">
                    <OptimizedVideoPlayer
                        src={item?.master_url || item?.src}
                        poster={item?.thumbnail}
                        autoPlay={true}
                        loop={false}
                        muted={false}
                        playsInline={true}
                        className="video-modal-player"
                    />
                    
                    {/* Video Overlay Text */}
                    <div className="video-overlay">
                        <div className="video-overlay-top">
                            <span className="video-username">{item?.author?.name}</span>
                        </div>
                        <div className="video-overlay-bottom">
                            <span className="video-story-text">{item?.name}</span>
                        </div>
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="video-profile-section">
                    <div className="video-profile-content">
                        <Img 
                            src={item?.author?.avatar} 
                            alt="Profile" 
                            className="video-profile-avatar"
                        />
                        <div className="video-profile-info">
                            <div className="video-profile-name">{item?.author?.name}</div>
                            <div className="video-profile-message">{item?.author?.worldMessage}</div>
                        </div>
                    </div>
                    <div className="video-profile-buttons">
                        <a 
                            className="video-btn video-btn--outline" 
                            href={`/chatify/${item?.author?.id}`}
                        >
                            <Img
                                src="/img/icons/contact.svg"
                                width={24}
                                height={24}
                                className="video-btn-icon"
                            />
                            Connect Storyteller
                        </a>
                        <button 
                            className="video-btn video-btn--primary"
                            onClick={handleGiftClick}
                        >
                            <Img
                                src="/img/icons/gift.svg"
                                width={24}
                                height={24}
                                className="video-btn-icon"
                            />
                            Gift the Creator
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Panel - Comments */}
            <div className="video-modal-right">
                <div className="comments-header">
                    <h3>Comments</h3>
                    <button className="close-btn" onClick={onClose}>
                        <Img src="/img/modal/close.svg" width={24} height={24} />
                    </button>
                </div>
                
                <div className="comments-list">
                    {comments.map((comment) => (
                        <Comment key={comment.id} story={item} comment={comment} />
                    ))}
                </div>

                <div className="add-comment-section">
                    <div className="comment-input-container">
                        <div className="emoji-picker-trigger" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                            😊
                        </div>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={addCommentOnEnter}
                            placeholder="Add your comment..."
                            className="comment-input"
                        />
                        {showEmojiPicker && (
                            <div className="emoji-picker-container">
                                <button
                                    className="emoji-picker-close"
                                    onClick={() => setShowEmojiPicker(false)}
                                >
                                    ✖
                                </button>
                                <Picker onEmojiClick={onEmojiClick} />
                            </div>
                        )}
                    </div>
                    <button 
                        className="send-btn"
                        onClick={handleCommentSubmit}
                        disabled={loading || !newComment.trim()}
                    >
                        <Img src="/img/desktop-msgbtn.png" width={24} height={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
