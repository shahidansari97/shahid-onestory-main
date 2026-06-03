import {useState, useEffect, useRef, useLayoutEffect} from "react";
import { Box,Typography,IconButton} from "@mui/material";
import { usePage, router, Link } from "@inertiajs/react";

import gift from './../../../img/icons/gift.svg';
import UserImg from './../../../img/user-3.jpg';
import shareImg from './../../../img/send.png';
import phoneclose from './../../../img/phone-close.png';
import loadingimg from './../../../img/loading-icon.png';
import profilePage from "@/Pages/Profile/UserProfile";
import contactsvg from './../../../img/icons/contact.svg';
import msgSend from "./../../../img/msg-sendbtn.png";
import desktopmsgSend from "./../../../img/desktop-msgbtn.png";
import heartImg from "./../../../img/heart.png";
import UserImg4 from "./../../../img/user-4.jpg";
import UserImg7 from "./../../../img/user-7.jpg";
import UserImg8 from "./../../../img/user-8.jpg";
import riplyIcon from "./../../../img/riply-icon.png";
import useIsDesktop from "@/Hooks/useIsDesktop";
import LoadingImage from "./../../../img/loading.gif";
import Picker from "emoji-picker-react";
import toast from "react-hot-toast";
export default function Comment({ key,story,comment }) {
    const sendImg = shareImg;
    
    const [isReply,setIsReply] = useState(false);
    const [replies, setReplies] = useState(comment.replies || []);
    const [loadings, setLoading] = useState(false);
    const { auth } = usePage().props;
    const textareaRef = useRef(null);
    const [newReply, setNewReply] = useState("");
    const isMobile = useIsDesktop(992);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const onEmojiClick = (emojiObject, event) => {
        setNewReply((prev) => prev + emojiObject.emoji);
        setShowEmojiPicker(false);
    };
    const formatTimeDifference = (commentTime) => {
        const now = new Date();
        const commentDate = new Date(commentTime);

        // Calculate the difference in seconds
        let diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

        // Fix: if backend time is slightly ahead of client time
        if (diffInSeconds < 0) diffInSeconds = 0;

        if (diffInSeconds < 5) {
            return "Just now";
        } else if (diffInSeconds < 60) {
            return `Post ${diffInSeconds} sec ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `Post ${minutes} min${minutes > 1 ? "s" : ""} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `Post ${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `Post ${days} day${days > 1 ? "s" : ""} ago`;
        }
    };

    const handleReplySubmit = async () => {
        if (auth.user) {
            if (!newReply.trim()) return;
            setLoading(true);
            try {
                const response = await axios.post(route('stories.comments.store', {
                    story_id: story.id,
                    content: newReply,
                    parent_id: comment.id,
                }));
                if (response.data.status) {
                    const createdReplies = response.data.data;
                    setReplies((prevComments) => {
                        return [createdReplies, ...(prevComments || [])];
                    });
                    setNewReply("");
                    setIsReply(false);
                }
            } finally {
                setLoading(false);
            }
        } else {
            //router.visit(route("login"));
            toast.error("Please login before posting your comment");
        }
    };

    const addReplyOnEnter = (e) => {
        console.log("e",e)
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleReplySubmit();
        }
    };
    useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "35px";
        const lineHeight = 21;
        const maxHeight = lineHeight * 20;
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);
         if(newReply){
        textarea.style.height = `${newHeight}px`;
         }
        textarea.style.overflowY =
        textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [newReply]);
    return (
        <>
            {(!isMobile) ? (
                <Box>
                    <div className="comment-item">
                        <div className="userimg">
                            {comment?.user?.avatar ?(
                                <img src={comment?.user?.avatar}   />
                            ):(
                                <img src={UserImg7}   />
                            )}
                        </div>
                        <div className="mobile_screencomment">
                        <Typography variant="body1" className="comment-user">
                            @{comment?.user?.username}
                        </Typography>
                        <Typography variant="body2" className="comment-text">
                            {comment?.content}
                        </Typography>
                        <Typography variant="caption" className="comment-time">
                            {formatTimeDifference(comment?.created_at)}
                            { isReply  ?  (
                                <span onClick={()=>setIsReply(false)} className="commentclose">Close</span>
                            ):(
                                <span onClick={()=>setIsReply(true)} className="commentclose">Reply</span>
                            )}

                        </Typography>
                        { isReply && (
                            <div className="subcommentBox">
                                <div className="emoji-icon"  onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</div>
                                <textarea 
                                    onKeyDown={addReplyOnEnter} 
                                    onChange={(e) => setNewReply(e.target.value)} 
                                    placeholder="Add your reply..." 
                                    value={newReply} 
                                    className="text-dark comment-textarea" 
                                    ref={textareaRef}
                                />

                                 <div className="senbtn" onClick={handleReplySubmit}>
                                    <img src={desktopmsgSend}/>
                                </div>
                                {showEmojiPicker && (
                                    <div style={{ position: "absolute", zIndex: 1000, left: "-7px" }}>
                                        <button
                                            style={{
                                                position: "absolute",
                                                top: "-20px",
                                                right: "4px",
                                                padding:'5px 10px',
                                                background:'grey',
                                                color: "white",
                                                border: "none",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                                zIndex:'999'
                                            }}
                                            onClick={() => setShowEmojiPicker(false)}
                                        >
                                            ✖
                                        </button>
                                        <Picker onEmojiClick={onEmojiClick} className="inputemoji" />
                                    </div>
                                )}
                                {/* <span className="desktop_senbtn" onClick={handleReplySubmit}>
                                    <img src={desktopmsgSend}/>
                                </span> */}
                            </div>
                        )}
                        {/* <p className="reply-button text-white">Reply Comment (17)</p> */}
                        </div>
                    </div>
                    {replies && replies?.length > 0 && (
                        <>
                            {replies.map((reply) => (
                                <div className={comment.level === 1 ? "subcomment" : ""}>
                                    <Comment key={reply.id} story={story} comment={reply} />
                                </div>
                            ))}
                        </>
                    )}
                </Box>
             ):(
                <Box className="comments-section" sx={{ maxHeight: "400px", overflowY: "auto", mt: 2 }}>
                    <Box className="comment-item">
                        <div className="comment-inner">
                            {/* <div className=''>
                                {comment?.user?.avatar ?(
                                    <img src={comment?.user?.avatar}   />
                                ):(
                                    <img src={UserImg8}   />
                                )}
                            </div> */}
                            <div className=''>
                                <div className="comment-name">
                                    <div className=''>
                                        {comment?.user?.avatar ?(
                                            <img src={comment?.user?.avatar}   />
                                        ):(
                                            <img src={UserImg8}   />
                                        )}
                                    </div>
                                    <div className=''>
                                        <Typography variant="body1" className="comment-user">@{comment?.user?.username}</Typography>
                                        <Typography variant="body2" className="comment-text">
                                            {comment?.content}
                                        </Typography>
                                    </div>
                                </div>
                                <div className='chatriply'>
                                    <p className="reply-button text-white">{formatTimeDifference(comment?.created_at)} </p>
                                    {isReply  ?  (
                                        <p className="reply-icon" onClick={()=>setIsReply(false)}> Close </p>
                                    ):(
                                        <p className="reply-icon" onClick={()=>setIsReply(true)}> <img src={riplyIcon} /> Reply </p>
                                    )}
                                </div>
                                {isReply && (
                                    <>
                                        <div className="subcommentBox">
                                            <div 
                                                className="emoji-icon"  
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            >
                                                    😊
                                            </div>
                                            <textarea 
                                                ref={textareaRef}
                                                onKeyDown={addReplyOnEnter} 
                                                onChange={(e) => setNewReply(e.target.value)} 
                                                placeholder="Add your reply..." 
                                                value={newReply} 
                                                className="text-dark comment-textarea" 
                                            />
                                            <span className="desktop_senbtn" onClick={handleReplySubmit}>
                                                <img src={loadings ? loadingimg : desktopmsgSend} />
                                            </span>
                                        </div>
                                        {showEmojiPicker && (
                                            <div 
                                                style={{ 
                                                    position: "absolute", 
                                                    zIndex: 100000000000, 
                                                    left: "-10px",
                                                    padding:'8px 10px', 
                                                    top: 0, 
                                                    width:'100%' 
                                                }}
                                            >
                                                    <button
                                                        style={{
                                                            position: "absolute",
                                                            top: "26px",
                                                            right: "4px",
                                                            padding:'7px 14px',
                                                            background:' rgb(233, 201, 198)',
                                                            color: "#3d277b",
                                                            border: "none",
                                                            borderRadius: "50%",
                                                            cursor: "pointer",
                                                            zIndex:'999',
                                                            fontWeight:'700',
                                                            fontSize:'16px'
                                                        }}
                                                        onClick={() => setShowEmojiPicker(false)}
                                                    >
                                                        ✖
                                                    </button>
                                                <Picker onEmojiClick={onEmojiClick} className="inputemoji" />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        {replies && replies?.length > 0 &&   (
                            <Box className={comment.level === 1 ? "replies-section" : ""} sx={{ mt: 1 }}>
                                <Box className="">
                                    {replies.map((reply) => (
                                        <Comment key={reply.id} story={story} comment={reply} />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
             )}
        </>
    );
}
