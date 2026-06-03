import { useState, useRef, useLayoutEffect, useEffect } from "react";
import CloseIcon from './../../../img/close.svg';
import loadingimg from './../../../img/loading-icon.png';
import { Box, Typography, IconButton } from "@mui/material";
import gift from './../../../img/icons/gift.svg';
import UserImg from './../../../img/user-3.jpg';
import shareImg from './../../../img/send.png';
import desktopmsgSend from "./../../../img/desktop-msgbtn.png";
import contactsvg from './../../../img/icons/contact.svg';
import msgSend from "./../../../img/msg-sendbtn.png";
import useIsDesktop from "@/Hooks/useIsDesktop";
import Comment from "../Story/Comment";
import Picker from "emoji-picker-react";
import { usePage, router, Link } from "@inertiajs/react";
import HlsPlayer from "../HlsPlayer";
import axios from "axios";
import toast from "react-hot-toast";

export default function CommentModal({ item, gifts, user, modalData, activeCardIndex, handleGiftClick, sendGift, error, setError, loading, validationCode, setValidationCode, openModal, closeModal, serverError, open = false, }) {
    // console.log("ITems",item)
    const [comments, setComments] = useState(item.comments || []);
    const [loadings, setLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const { auth } = usePage().props;
    const [replyContent, setReplyContent] = useState({});
    const [story, setStory] = useState(item);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const videoRef = useRef(null);
    const viewTrackedRef = useRef(false); // Track if view API has been called
    const resolvedVideoSrc = item?.isBannerCard
        ? (item?.video || item?.src || item?.video_url || item?.master_url || "")
        : (item?.master_url || item?.src || item?.video_url || item?.video || "");

    // Track story view when video plays in modal
    const trackStoryView = async () => {
        // Only track if modal is open and hasn't been tracked yet for this story
        if (!open || viewTrackedRef.current || !item?.id) {
            return;
        }

        try {
            const userId = auth.user ? auth.user.id : null;
            console.log('Tracking story view from modal:', { user_id: userId, story_id: item.id, modal_open: open });
            await axios.post(route('user.story.view.store'), {
                user_id: userId,
                story_id: item.id,
                ip_address: null, // Backend will get IP from request if null
            });
            viewTrackedRef.current = true; // Mark as tracked
            console.log('Story view tracked successfully from modal');
        } catch (error) {
            // Log error but don't interrupt video playback
            console.error('Failed to track story view:', error);
        }
    };

    // Reset tracking when story changes or modal closes
    useEffect(() => {
        viewTrackedRef.current = false;
    }, [item?.id, open]);

    // Track when user clicks play button in modal video (works on both desktop and mobile)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Ensure mobile compatibility
        const setupMobileVideo = () => {
            if (video) {
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.playsInline = true;
            }
        };

        setupMobileVideo();

        const handlePlay = () => {
            // Track view when video plays in modal (user clicked play)
            // Only track if modal is open
            if (open && !viewTrackedRef.current && item?.id) {
                trackStoryView();
            }
        };

        // Track when user clicks on video element (to play)
        const handleVideoClick = (e) => {
            // Only track if modal is open, video is paused, and user clicks to play
            if (open && video.paused && !viewTrackedRef.current && item?.id) {
                // Ensure mobile compatibility before playing
                setupMobileVideo();
                // Play will trigger the 'play' event which will call trackStoryView
                video.play().catch(() => { });
            }
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('click', handleVideoClick);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('click', handleVideoClick);
        };
    }, [open, item?.id]);

    useEffect(() => {
        const video = videoRef.current;
        if (!open || !video || !item?.autoplay) return;
        video.play().catch(() => { });
    }, [open, item?.id, item?.autoplay]);
    const onEmojiClick = (emojiObject, event) => {
        setNewComment((prev) => prev + emojiObject.emoji);
        setShowEmojiPicker(false);
    };
    // console.log("auth",auth)
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
    const sendImg = shareImg;
    const itemUserImg = item?.author?.avatar ? item?.author?.avatar : UserImg;

    const [value, setValue] = useState("");
    const textareaRef = useRef(null);
    const handleCommentSubmit = async () => {

        if (auth.user) {
            if (!value.trim()) return;
            setLoading(true);
            try {
                const response = await axios.post(route('stories.comments.store', {
                    story_id: item.id,
                    content: value,
                }));

                if (response.data.status) {
                    const createdComment = response.data.data;
                    setComments((prevComments) => {
                        return [createdComment, ...(prevComments || [])];
                    });
                    setNewComment("");
                    setValue("");
                }
            } finally {
                setLoading(false);
            }
        } else {
            //router.visit(route("login"));
            toast.error("Please login before posting your comment");
        }
    };
    const addCommentOnEnter = (e) => {
        // console.log("e",e)
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleCommentSubmit();
        }
    };
    const isMobile = useIsDesktop(992);
    const showCommentOnlyLayout = !isMobile && open && !item?.isBannerCard;

    useEffect(() => {
        if (!item?.id) return; // skip if no story id

        const fetchComments = async () => {
            try {
                setLoading(true);
                // 👇 adjust if you use Laravel named route helpers or plain URL
                const response = await axios.get(route('stories.allcomments', { story_id: item.id }));
                console.log("response", response)
                setComments(response.data.data || response.data.data); // depends on your API format
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [item?.id]);
    useLayoutEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) return;
        textarea.style.height = "35px";
        console.log(value, 'value')
        const lineHeight = 21;
        const maxHeight = lineHeight * 20;
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);
        if (value) {
            textarea.style.height = `${newHeight}px`;
        }
        textarea.style.overflowY =
            textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [value]);

    return (
        <>
            {(showCommentOnlyLayout) ? (
                <div className="commentModalWrapper">
                    <div className="mainphonemodal" style={{ display: `block` }}>
                        <div className='phonemodal'>
                            <Box className="commentmodal" >
                                {/* Modal Header */}
                                <Typography variant="h6" className="modal-header">
                                    Comments ({comments.length})
                                </Typography>
                                <IconButton
                                    onClick={closeModal}
                                    sx={{
                                        position: "absolute",
                                        top: 3,
                                        right: 0,
                                        zIndex: 1000,
                                    }}>
                                    <img src={CloseIcon} style={{ width: '30px' }} className='closebtn' />
                                </IconButton>
                                {/* Comments Section */}
                                <Box
                                    className="comments-section"
                                    sx={{ maxHeight: "400px", overflowY: "auto", mt: 2 }}
                                >
                                    {comments.map((comment) => (
                                        <Comment key={comment.id} story={item} comment={comment} />
                                    ))}
                                </Box>

                                {/* Add Comment Input */}
                                <Box
                                    className="add-comment-section"
                                    sx={{ mt: 2, display: "flex", alignItems: "center" }}
                                >
                                    <div className="commentBox">
                                        <img src={auth?.user?.avatar} className="profile-avatar" />
                                        <textarea
                                            ref={textareaRef}
                                            className="comment-textarea"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                            placeholder="Add your comment..."
                                        />
                                        <div className="emoji-icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</div>
                                        {showEmojiPicker && (
                                            <div style={{ position: "absolute", zIndex: 1000, left: "-7px", bottom: "58px" }}>
                                                <button
                                                    style={{
                                                        position: "absolute",
                                                        top: "-20px",
                                                        right: "4px",
                                                        padding: '8px 10px',
                                                        background: '#E9C9C6',
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "50%",
                                                        cursor: "pointer",
                                                        zIndex: '999'
                                                    }}
                                                    onClick={() => setShowEmojiPicker(false)}
                                                >
                                                    ✖
                                                </button>
                                                <Picker onEmojiClick={onEmojiClick} className="inputemoji" />
                                            </div>
                                        )}
                                        <div className="msgsendbtn" onClick={handleCommentSubmit}>
                                            <img src={loadings ? loadingimg : msgSend} />
                                        </div>
                                    </div>


                                </Box>
                            </Box>
                        </div>
                    </div>
                </div>
            ) : (
                <Box className={`videomodal ${item?.isBannerCard ? "videomodal--banner" : ""}`} sx={modalStyles}>
                    <div className="modal-content">
                        <IconButton
                            onClick={closeModal}
                            sx={{
                                position: "absolute",
                                top: -38,
                                right: -100,
                                zIndex: 1000,

                                // backgroundColor:'grey',
                                // padding:'5px',
                            }}>
                            <img src={CloseIcon} className='closebtn' />
                        </IconButton>
                        <div className="os-gift-modal">
                            <div className="os-video__player">
                                <div className="os-video__panel">
                                    {/* <HlsPlayer 
                                        src={item.master_url || item.src || item.video_url}
                                        poster={item.thumbnail}
                                        classes={`os-video__iframe os-video__iframe--500`}
                                        autoPlay={true}
                                        controls={true}
                                    /> */}
                                    <video
                                        key={resolvedVideoSrc}
                                        ref={videoRef}
                                        className="os-video__iframe os-video__iframe--500"
                                        preload="metadata"
                                        controls
                                        autoPlay={!!item?.autoplay}
                                        poster={item?.thumbnail}
                                        playsInline
                                        webkit-playsinline="true"
                                        style={{ WebkitAppearance: "none" }}
                                    >
                                        <source src={resolvedVideoSrc} type="video/mp4" />
                                    </video>
                                </div>

                                <div className='videoprofile'>
                                    <div className="os-video__storyteller-content">
                                        <img src={item?.author?.avatar} alt="Profile" className="os-video__storytellr-photo" />
                                        <div className="os-video__storyteller-info">
                                            <Link href={route("user.profile.index", { user_id: item.author.id })}>
                                                <div className="os-video__storyteller-name">{item?.author?.name}</div>
                                            </Link>
                                            <div className="os-video__storyteller-desc">
                                                <b>{item?.author?.worldMessage}</b>
                                            </div>
                                            {/* <div className="os-video__storyteller-desc">{item?.author?.story}</div> */}
                                        </div>
                                    </div>
                                    <div className="os-video__storyteller-buttons">
                                        <a className="os-btn os-btn--fw-bold os-btn--outline os-btn--gap-16 os-btn--p-s os-btn--with-icon" href={`/chatify/${item?.author?.id}`} >
                                            <img src={contactsvg} alt="" className="os-btn__icon os-btn__icon--w-24" width="32" height="32" />Connect Storyteller</a>
                                        <button onClick={handleGiftClick} className="os-btn os-btn--fw-bold os-btn--fs-lg os-btn--primary os-btn--gap-16 os-btn--p-s os-btn--with-icon os-btn--w-full-mob">
                                            <img src={gift} alt="" className="os-btn__icon os-btn__icon--w-24" width="32" height="32" />Gift the Creator</button>
                                    </div>
                                </div>
                            </div>
                            {!item?.hideComments && (
                                <div className='comment-sec'>
                                    <Box className="main-commentmodal">
                                        <Box className="commentmodal">
                                            <Typography variant="h6" className="modal-header">
                                                Comments
                                            </Typography>
                                            {comments.map((comment) => (
                                                <Comment key={comment.id} story={item} comment={comment} />
                                            ))}

                                        </Box>
                                        <Box className="add-comment-section" sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                                            <div className="add-comment-inner">
                                                <div className="commentBox">
                                                    <div className="profile-avatar" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</div>

                                                    <textarea
                                                        ref={textareaRef}
                                                        className="comment-textarea"
                                                        value={value}
                                                        onChange={(e) => setValue(e.target.value)}
                                                        placeholder="Add your comment..."
                                                    />
                                                    <div className='senbtn' onClick={handleCommentSubmit}>
                                                        <img src={loadings ? loadingimg : desktopmsgSend} />
                                                    </div>

                                                    {showEmojiPicker && (
                                                        <div style={{ position: "absolute", zIndex: 10000000, left: "-23px" }}>
                                                            <button
                                                                style={{
                                                                    position: "absolute",
                                                                    top: "-20px",
                                                                    right: "4px",
                                                                    padding: '8px 10px',
                                                                    background: '#E9C9C6',
                                                                    color: "white",
                                                                    border: "none",
                                                                    borderRadius: "50%",
                                                                    cursor: "pointer",
                                                                    zIndex: '999'
                                                                }}
                                                                onClick={() => setShowEmojiPicker(false)}
                                                            >
                                                                ✖
                                                            </button>
                                                            <Picker onEmojiClick={onEmojiClick} className="inputemoji" />
                                                        </div>
                                                    )}

                                                </div>
                                            </div>

                                        </Box>
                                    </Box>
                                </div>
                            )}
                        </div>
                    </div>
                </Box>
            )}
        </>
    );
}
