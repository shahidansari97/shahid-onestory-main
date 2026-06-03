import '../../../css/home.css';
import '../../../css/form.css';
import '../../../css/gift.css';
import '../../../css/spoken-story-comments.css';
// import { FaMicrophone } from "react-icons/fa";

import { FaMicrophone, FaRegCommentDots, FaPaperPlane, FaChevronLeft, FaChevronRight, FaPlay, FaPause } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { GoShareAndroid } from "react-icons/go";

import { MdLock } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrShareOption } from "react-icons/gr";
import Button from "@/Components/UI/Button.jsx";
import GuestLayout from '@/Layouts/GuestLayout';
import Carousel from "@/Components/Story/StoryCarousel.jsx";
import Story from "@/Components/Story/Story.jsx";
import StoryAppleMobile from "@/Components/Story/StoryAppleMobile.jsx";
import Modal from "@/Components/Modal.jsx";
import { Modal as MuiModal, Box, IconButton } from "@mui/material";
import { useEffect, useRef, useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import Preloader from '@/Components/Preloader';
import homepagevideo from '../../../img/custum_homepage_video.mp4';
// import homepagevideoScreenShot from '../../../img/custum_homepage_video_screenshot.png';
import homepagevideoScreenShot from '../../../img/custum_homepage_video_screenshot.webp';
// import creatorImg1 from '../../../img/1.png';
// import creatorImg2 from '../../../img/2.png';
// import creatorImg3 from '../../../img/3.png';
// import creatorImg4 from '../../../img/4.png';
import creatorImg1 from '../../../img/1.webp';
import creatorImg2 from '../../../img/2.webp';
import creatorImg3 from '../../../img/3.webp';
import creatorImg4 from '../../../img/4.webp';
import heroReference from '../../../img/heroReference.webp';


import axios from 'axios';


import dustie from '../../../img/dustie.webp';
import karina_lowke from '../../../img/karina_lowke.webp';

import brittporterb from '../../../img/brittporterb.webp';
import soulknight from '../../../img/soulknight.webp';
import porcellana from '../../../img/porcellana.webp';
import kimberlyhockenheimer from '../../../img/kimberlyhockenheimer.webp';
import queenneek from '../../../img/queenneek.webp';
import dustiecahoon from '../../../img/dustiecahoon.webp';
import thelouisianasho from '../../../img/thelouisianasho.webp';

import ck from '../../../img/ck.webp';
import week_message from '../../../img/week_message.webp';
import dez_tech from '../../../img/dez_tech.webp';
import kenya_harlen from '../../../img/kenya_harlen.webp';
import ajstayfit from '../../../img/ajstayfit.webp';
import moochi from '../../../img/moochi.webp';
import itsmonica from '../../../img/itsmonica.webp';
import tommynai from '../../../img/tommynai.webp';
import otterking from '../../../img/otterking.webp';
import denimalcharly from '../../../img/denimalcharly.webp';
import kylin from '../../../img/kylin.webp';
import renas from '../../../img/renas.webp';
import laurya from '../../../img/laurya.webp';
import iammark from '../../../img/iammark.webp';
import kaoz from '../../../img/kaoz.webp';
import maddisin from '../../../img/maddisin.webp';
import paull from '../../../img/paull.webp';
import idyli from '../../../img/idyli.webp';
import poet from '../../../img/poet.webp';






import { FaCheck } from "react-icons/fa6";
import useIsDesktop from "@/Hooks/useIsDesktop";
import useUserMedia from "@/Hooks/useUserMedia";
import { redirectToDraftOrNewStory } from "@/Utils/draftVideo";
import { useEditorRedirectionContext } from "@/Contexts/EditorRedirectionContext";
import { router } from '@inertiajs/react';
import ProfilePhotoUploadModal from '@/Components/Modals/ProfilePhotoUploadModal.jsx';
import useProfilePhotoPublishGate from '@/Hooks/useProfilePhotoPublishGate.js';
import { IoArrowForwardOutline } from "react-icons/io5";
import { convertToWav, getAudioDuration, isWebAudioSupported, needsConversion } from "@/Utils/audioConverter";

import { authRoute } from '@/Utils/authPublishMessage';

const loginUrlForPublishMessage = () => authRoute('login', {}, true);

// Lazy load heavy components
const FocusedStoryOverlay = lazy(() => import("@/Components/Story/FocusedStoryOverlay.jsx"));
const ModalContent = lazy(() => import("@/Components/Modals/ModalContent.jsx"));
const CommentModal = lazy(() => import("@/Components/Modals/CommentModal.jsx"));
const DeferredCustomVideoPlayer = lazy(() => import("@/Components/UI/CustomVideoPlayer.jsx"));
const DeferredCustumHomepage = lazy(() => import('@/Components/Custum_homepage'));
const DeferredCustomHomeSectionMobile = lazy(() => import('@/Components/CustomHomeSectionMobile'));
import CloseIcon from "../../../img/close.svg";
import msgSend from "../../../img/msg-sendbtn.png";
import UserImg from "../../../img/user-3.jpg";
import weeklySpokenStoryWav from "../../../audio/weekly-spoken-story.wav";

export default function Home({ data }) {


    // audit
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };


    // const formatTime = (time) => {
    //     if (!time) return "0:00";
    //     const min = Math.floor(time / 60);
    //     const sec = Math.floor(time % 60)
    //         .toString()
    //         .padStart(2, "0");
    //     return `${min}:${sec}`;
    // };


    const sliderRef = useRef(null);
    const { success, message, new_balance, auth, refill_success } = usePage().props;
    const user = useMemo(() => auth.user, [auth.user]);
    const {
        showProfilePhotoModal,
        requestPublish,
        closeProfilePhotoModal,
        completeProfilePhotoUpload,
        displayAvatar,
        userHasProfilePhoto,
        effectiveUser,
    } = useProfilePhotoPublishGate(auth?.user);
    const requestPublishRef = useRef(requestPublish);

    useEffect(() => {
        requestPublishRef.current = requestPublish;
    }, [requestPublish]);

    // Static featured audio (weekly spoken story) used in the wave-style player UI.
    // const WEEKLY_SPOKEN_STORY_SRC = "/audio/weekly-spoken-story.wav";

    const WEEKLY_SPOKEN_STORY_SRC = weeklySpokenStoryWav;

    const weeklySpokenAudioRef = useRef(null);
    const [weeklySpokenIsPlaying, setWeeklySpokenIsPlaying] = useState(false);
    const [weeklySpokenDuration, setWeeklySpokenDuration] = useState(0);
    const [weeklySpokenLoadError, setWeeklySpokenLoadError] = useState('');

    const pauseOtherHtmlAudios = useCallback((exceptEl) => {
        try {
            const audios = Array.from(document.querySelectorAll("audio"));
            for (const a of audios) {
                if (!a || a === exceptEl) continue;
                try {
                    a.pause?.();
                } catch (_) { }
            }
        } catch (_) { }
    }, []);

    const toggleWeeklySpokenAudio = useCallback(async () => {
        const el = weeklySpokenAudioRef.current;
        if (!el) return;

        try {
            if (weeklySpokenLoadError) {
                alert(weeklySpokenLoadError);
                return;
            }
            if (el.paused) {
                pauseOtherHtmlAudios(el);
                try {
                    el.muted = false;
                    el.volume = 1;
                } catch (_) { }
                // Ensure the browser actually attempts to load the file
                if (el.readyState === 0) {
                    try { el.load?.(); } catch (_) { }
                }
                await el.play();
            } else {
                el.pause();
            }
        } catch (e) {
            console.error("Featured audio play failed:", e);
            const name = e?.name ? String(e.name) : 'Error';
            alert(`Audio could not play (${name}).`);
        }
    }, [pauseOtherHtmlAudios, weeklySpokenLoadError]);

    useEffect(() => {
        const el = weeklySpokenAudioRef.current;
        if (!el) return undefined;

        const onLoaded = () => {
            const d = Number(el.duration);
            if (Number.isFinite(d) && d > 0) setWeeklySpokenDuration(Math.round(d));
        };
        const onPlay = () => setWeeklySpokenIsPlaying(true);
        const onPause = () => setWeeklySpokenIsPlaying(false);
        const onEnded = () => setWeeklySpokenIsPlaying(false);
        const onError = () => {
            const code = el?.error?.code;
            // 1: aborted, 2: network, 3: decode, 4: src not supported
            let msg = "Audio could not be loaded.";
            if (code === 2) msg = "Audio file not found or network blocked. Please upload `public/audio/weekly-spoken-story.wav` on the server.";
            if (code === 3) msg = "Audio file format could not be decoded by the browser.";
            if (code === 4) msg = "Audio source is not supported by the browser/server.";
            setWeeklySpokenLoadError(msg);
        };

        el.addEventListener("loadedmetadata", onLoaded);
        el.addEventListener("play", onPlay);
        el.addEventListener("pause", onPause);
        el.addEventListener("ended", onEnded);
        el.addEventListener("error", onError);
        return () => {
            el.removeEventListener("loadedmetadata", onLoaded);
            el.removeEventListener("play", onPlay);
            el.removeEventListener("pause", onPause);
            el.removeEventListener("ended", onEnded);
            el.removeEventListener("error", onError);
        };
    }, []);

    const formatAbsoluteDateTime = useCallback((isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        if (Number.isNaN(d.getTime())) return '';
        try {
            return new Intl.DateTimeFormat(undefined, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            }).format(d);
        } catch (_) {
            return d.toLocaleString();
        }
    }, []);

    const formatRelativeTime = useCallback((isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        const ms = d.getTime();
        if (Number.isNaN(ms)) return '';
        const diffMs = Date.now() - ms;
        const diffSec = Math.floor(diffMs / 1000);
        const absSec = Math.abs(diffSec);

        const units = [
            ['year', 60 * 60 * 24 * 365],
            ['month', 60 * 60 * 24 * 30],
            ['day', 60 * 60 * 24],
            ['hour', 60 * 60],
            ['minute', 60],
            ['second', 1],
        ];

        const [unit, unitSeconds] = units.find(([, s]) => absSec >= s) || ['second', 1];
        const value = Math.floor(absSec / unitSeconds) * (diffSec < 0 ? -1 : 1);

        try {
            const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
            return rtf.format(-value, unit);
        } catch (_) {
            const v = Math.abs(value);
            return `${v} ${unit}${v === 1 ? '' : 's'} ago`;
        }
    }, []);

    // Written story share bumps must be declared before featuredWrittenMessage memo.
    const [writtenShareBumps, setWrittenShareBumps] = useState({});
    const onWrittenShareRecorded = useCallback((writtenMessageId) => {
        const id = Number(writtenMessageId);
        if (!Number.isFinite(id)) return;
        setWrittenShareBumps((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
    }, []);

    // Written story comment bumps (so comment count updates immediately on UI)
    const [writtenCommentBumps, setWrittenCommentBumps] = useState({});
    const bumpWrittenCommentCount = useCallback((writtenMessageId, delta = 1) => {
        const id = Number(writtenMessageId);
        if (!Number.isFinite(id)) return;
        const inc = Number(delta) || 1;
        setWrittenCommentBumps((prev) => ({
            ...prev,
            [id]: (prev?.[id] || 0) + inc,
        }));
    }, []);

    // Spoken story share bumps (so share count updates immediately on UI)
    const [spokenShareBumps, setSpokenShareBumps] = useState({});
    const onSpokenShareRecorded = useCallback((spokenRecordingId) => {
        const id = Number(spokenRecordingId);
        if (!Number.isFinite(id)) return;
        setSpokenShareBumps((prev) => ({
            ...prev,
            [id]: (prev?.[id] || 0) + 1,
        }));
    }, []);

    // Spoken story comment bumps (so comment count updates immediately on UI)
    const [spokenCommentBumps, setSpokenCommentBumps] = useState({});
    const bumpSpokenCommentCount = useCallback((spokenRecordingId, delta = 1) => {
        const id = Number(spokenRecordingId);
        if (!Number.isFinite(id)) return;
        const inc = Number(delta) || 1;
        setSpokenCommentBumps((prev) => ({
            ...prev,
            [id]: (prev?.[id] || 0) + inc,
        }));
    }, []);

    const featuredWrittenMessage = useMemo(() => {
        const list = data?.written_messages;
        const base = Array.isArray(list) && list.length ? list[0] : null;
        if (!base?.id) return base;
        const shareBump = writtenShareBumps[base.id] || 0;
        const commentBump = writtenCommentBumps[base.id] || 0;
        return {
            ...base,
            total_share: (Number(base.total_share) || 0) + shareBump,
            comments_count: (Number(base.comments_count) || 0) + commentBump,
        };
    }, [data, writtenShareBumps, writtenCommentBumps]);

    const featuredSpokenRecording = useMemo(() => {
        const base = data?.spoken_story_recording || null;
        if (!base?.id) return base;
        const bump = spokenCommentBumps[base.id] || 0;
        const shareBump = spokenShareBumps[base.id] || 0;
        return {
            ...base,
            comments_count: (Number(base.comments_count) || 0) + bump,
            total_share: (Number(base.total_share) || 0) + shareBump,
        };
    }, [data, spokenCommentBumps, spokenShareBumps]);

    const ensureFeaturedSpokenRecordingOrAlert = useCallback(() => {
        if (featuredSpokenRecording?.id) return true;
        alert('Spoken story is not available right now. Please try again in a moment.');
        return false;
    }, [featuredSpokenRecording?.id]);

    const [writtenCommentsOpen, setWrittenCommentsOpen] = useState(false);
    const [activeWrittenMessage, setActiveWrittenMessage] = useState(null);
    const [writtenComments, setWrittenComments] = useState([]);
    const [writtenCommentsLoading, setWrittenCommentsLoading] = useState(false);
    const [writtenCommentText, setWrittenCommentText] = useState('');
    const [writtenCommentSubmitting, setWrittenCommentSubmitting] = useState(false);
    const [writtenReplyOpenById, setWrittenReplyOpenById] = useState({});
    const [writtenReplyTextById, setWrittenReplyTextById] = useState({});

    // Spoken story comments (for featured spoken recording) — must be declared before callbacks below
    const [spokenCommentsOpen, setSpokenCommentsOpen] = useState(false);
    const [activeSpokenRecording, setActiveSpokenRecording] = useState(null);
    const [spokenComments, setSpokenComments] = useState([]);
    const [spokenCommentsLoading, setSpokenCommentsLoading] = useState(false);
    const [spokenCommentText, setSpokenCommentText] = useState('');
    const [spokenCommentSubmitting, setSpokenCommentSubmitting] = useState(false);
    const [spokenReplyOpenById, setSpokenReplyOpenById] = useState({});
    const [spokenReplyTextById, setSpokenReplyTextById] = useState({});

    const requireAuthOrRedirect = useCallback(() => {
        if (auth?.user?.id) return true;
        router.visit(route('login'), { replace: true });
        return false;
    }, [auth?.user?.id, router]);

    const openWrittenComments = useCallback(async (message) => {
        if (!message?.id) return;
        if (!requireAuthOrRedirect()) return;
        setActiveWrittenMessage(message);
        setWrittenCommentsOpen(true);
        setWrittenCommentsLoading(true);
        setWrittenReplyOpenById({});
        setWrittenReplyTextById({});
        try {
            const res = await axios.get(route('written-messages.comments.index', message.id), {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            const comments = res?.data?.data?.comments;
            setWrittenComments(Array.isArray(comments) ? comments : []);
        } catch (e) {
            setWrittenComments([]);
        } finally {
            setWrittenCommentsLoading(false);
        }
    }, [requireAuthOrRedirect, router]);

    const openSpokenComments = useCallback(async (recording) => {
        if (!recording?.id) return;
        if (!requireAuthOrRedirect()) return;

        setActiveSpokenRecording(recording);
        setSpokenCommentsOpen(true);
        setSpokenCommentsLoading(true);
        setSpokenComments([]);
        setSpokenReplyOpenById({});
        setSpokenReplyTextById({});

        try {
            const res = await axios.get(route('spoken-stories.comments.index', recording.id), {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            const next = res?.data?.data?.comments;
            setSpokenComments(Array.isArray(next) ? next : []);
        } catch (e) {
            console.error('Failed to load spoken story comments:', e);
            setSpokenComments([]);
        } finally {
            setSpokenCommentsLoading(false);
        }
    }, [requireAuthOrRedirect, router]);

    const closeSpokenComments = useCallback(() => {
        setSpokenCommentsOpen(false);
        setActiveSpokenRecording(null);
        setSpokenComments([]);
        setSpokenCommentText('');
        setSpokenReplyOpenById({});
        setSpokenReplyTextById({});
        setSpokenCommentsLoading(false);
        setSpokenCommentSubmitting(false);
    }, []);

    const submitSpokenComment = useCallback(async () => {
        if (!activeSpokenRecording?.id) return;
        if (!requireAuthOrRedirect()) return;
        const text = String(spokenCommentText || '').trim();
        if (!text) return;
        setSpokenCommentSubmitting(true);
        try {
            const res = await axios.post(
                route('spoken-stories.comments.store', activeSpokenRecording.id),
                { comment: text },
                { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }
            );
            const created = res?.data?.data;
            if (created?.id) {
                setSpokenComments((prev) => [...(Array.isArray(prev) ? prev : []), created]);
                setSpokenCommentText('');
                bumpSpokenCommentCount(activeSpokenRecording.id, 1);
            }
        } catch (e) {
            console.error('Failed to submit spoken comment:', e);
            alert(e?.response?.data?.message || 'Failed to add comment.');
        } finally {
            setSpokenCommentSubmitting(false);
        }
    }, [activeSpokenRecording?.id, spokenCommentText, bumpSpokenCommentCount, requireAuthOrRedirect]);

    const toggleSpokenReply = useCallback((commentId) => {
        if (!commentId) return;
        setSpokenReplyOpenById((prev) => ({ ...prev, [commentId]: !prev?.[commentId] }));
    }, []);

    const submitSpokenReply = useCallback(async (parentId) => {
        if (!activeSpokenRecording?.id || !parentId) return;
        if (!requireAuthOrRedirect()) return;
        const text = String(spokenReplyTextById?.[parentId] || '').trim();
        if (!text) return;
        setSpokenCommentSubmitting(true);
        try {
            const res = await axios.post(
                route('spoken-stories.comments.store', activeSpokenRecording.id),
                { comment: text, parent_id: parentId },
                { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }
            );
            const created = res?.data?.data;
            if (created?.id) {
                // refetch to keep nesting correct
                const idx = await axios.get(route('spoken-stories.comments.index', activeSpokenRecording.id), {
                    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                });
                const next = idx?.data?.data?.comments;
                setSpokenComments(Array.isArray(next) ? next : []);
                setSpokenReplyTextById((prev) => ({ ...prev, [parentId]: '' }));
                setSpokenReplyOpenById((prev) => ({ ...prev, [parentId]: false }));
                bumpSpokenCommentCount(activeSpokenRecording.id, 1);
            }
        } catch (e) {
            console.error('Failed to submit spoken reply:', e);
            alert(e?.response?.data?.message || 'Failed to add reply.');
        } finally {
            setSpokenCommentSubmitting(false);
        }
    }, [activeSpokenRecording?.id, spokenReplyTextById, bumpSpokenCommentCount, requireAuthOrRedirect]);

    const renderSpokenCommentNode = useCallback(function renderNode(node, depth = 0) {
        if (!node?.id) return null;
        const indent = Math.min(depth, 6) * 14;
        const isReplyOpen = !!spokenReplyOpenById?.[node.id];
        const replyText = spokenReplyTextById?.[node.id] ?? '';

        return (
            <div key={node.id} className="mt-3" style={{ marginLeft: indent }}>
                <div className="flex items-start gap-3">
                    <img
                        src={node?.user?.avatar || UserImg}
                        className="h-7 w-7 rounded-full object-cover"
                        alt=""
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <div className="text-[13px] font-semibold text-black">
                                {node?.user?.name || node?.user?.username || 'User'}
                            </div>
                            <div className="text-[11px] text-gray-400">
                                {formatRelativeTime(node?.created_at)}
                            </div>
                        </div>
                        <div className="mt-1 text-[13px] leading-5 text-[#111827] whitespace-pre-wrap break-words">
                            {node?.comment}
                        </div>
                        <div className="mt-2 flex items-center justify-end">
                            <button
                                type="button"
                                className="inline-flex items-center gap-1 text-[12px] font-medium text-gray-600"
                                onClick={() => toggleSpokenReply(node.id)}
                            >
                                <span className="text-[14px] leading-none opacity-80">↩</span>
                                Reply
                            </button>
                        </div>

                        {isReplyOpen && (
                            <div className="mt-2 flex items-center gap-2">
                                <textarea
                                    className="ssc-textarea"
                                    value={replyText}
                                    onChange={(e) => setSpokenReplyTextById((prev) => ({ ...prev, [node.id]: e.target.value }))}
                                    placeholder="Write a reply..."
                                    rows={1}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            submitSpokenReply(node.id);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="flex items-center justify-center rounded-full bg-[#ff4667] p-[12px] disabled:opacity-55"
                                    onClick={() => submitSpokenReply(node.id)}
                                    disabled={spokenCommentSubmitting || !String(replyText || '').trim()}
                                    aria-label="Send reply"
                                >
                                    <img src={msgSend} alt="" style={{ width: 20, height: 20 }} />
                                </button>
                            </div>
                        )}

                        {Array.isArray(node?.replies) && node.replies.length > 0 && (
                            <div className="mt-2">
                                {node.replies.map((child) => renderNode(child, depth + 1))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }, [UserImg, formatRelativeTime, msgSend, spokenCommentSubmitting, spokenReplyOpenById, spokenReplyTextById, submitSpokenReply, toggleSpokenReply]);

    const closeWrittenComments = useCallback(() => {
        setWrittenCommentsOpen(false);
        setActiveWrittenMessage(null);
        setWrittenComments([]);
        setWrittenCommentText('');
        setWrittenReplyOpenById({});
        setWrittenReplyTextById({});
    }, []);

    const submitWrittenComment = useCallback(async () => {
        const msg = activeWrittenMessage;
        const text = String(writtenCommentText || '').trim();
        if (!msg?.id || !text) return;
        if (!requireAuthOrRedirect()) return;

        setWrittenCommentSubmitting(true);
        try {
            const res = await axios.post(
                route('written-messages.comments.store', msg.id),
                { comment: text, parent_id: null },
                { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }
            );
            const newComment = res?.data?.data;
            if (newComment) {
                newComment.replies = [];
                setWrittenComments((prev) => [newComment, ...(Array.isArray(prev) ? prev : [])]);
                bumpWrittenCommentCount(msg.id, 1);
            }
            setWrittenCommentText('');
        } catch (e) {
            alert(e?.response?.data?.message || 'Failed to save comment. Please try again.');
        } finally {
            setWrittenCommentSubmitting(false);
        }
    }, [activeWrittenMessage, writtenCommentText, bumpWrittenCommentCount, requireAuthOrRedirect]);

    const toggleWrittenReply = useCallback((commentId) => {
        setWrittenReplyOpenById((prev) => ({ ...(prev || {}), [commentId]: !prev?.[commentId] }));
    }, []);

    const submitWrittenReply = useCallback(async (parentId) => {
        const msg = activeWrittenMessage;
        const text = String(writtenReplyTextById?.[parentId] || '').trim();
        if (!msg?.id || !parentId || !text) return;
        if (!requireAuthOrRedirect()) return;

        try {
            const res = await axios.post(
                route('written-messages.comments.store', msg.id),
                { comment: text, parent_id: parentId },
                { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }
            );
            const newReply = res?.data?.data;
            if (!newReply) return;

            const insertReply = (nodes, targetId, replyNode) => {
                if (!Array.isArray(nodes)) return nodes;
                return nodes.map((n) => {
                    if (!n) return n;
                    if (Number(n.id) === Number(targetId)) {
                        const replies = Array.isArray(n.replies) ? n.replies : [];
                        return { ...n, replies: [...replies, replyNode] };
                    }
                    if (Array.isArray(n.replies) && n.replies.length) {
                        return { ...n, replies: insertReply(n.replies, targetId, replyNode) };
                    }
                    return n;
                });
            };

            setWrittenComments((prev) => insertReply(prev, parentId, newReply));

            setWrittenReplyTextById((prev) => ({ ...(prev || {}), [parentId]: '' }));
            setWrittenReplyOpenById((prev) => ({ ...(prev || {}), [parentId]: false }));
            bumpWrittenCommentCount(msg.id, 1);
        } catch (e) {
            alert(e?.response?.data?.message || 'Failed to save reply. Please try again.');
        }
    }, [activeWrittenMessage, writtenReplyTextById, bumpWrittenCommentCount, requireAuthOrRedirect]);

    const renderWrittenCommentNode = useCallback(function renderNode(node, depth = 0) {
        if (!node) return null;
        const displayName = node?.user?.username ? `@${node.user.username}` : (node?.user?.name || 'User');
        const avatar = node?.user?.avatar || UserImg;
        const rel = formatRelativeTime(node?.created_at);
        const indent = Math.min(depth, 6) * 24; // cap indentation
        const id = node?.id;

        return (
            <div key={id} className="border-b border-gray-100 px-[6px] py-[14px]" style={{ paddingLeft: indent ? `${indent}px` : undefined }}>
                <div className="flex items-start gap-3">
                    <img
                        src={avatar}
                        alt=""
                        className={`${depth > 0 ? 'h-[30px] w-[30px]' : 'h-[35px] w-[35px]'} rounded-full object-cover bg-gray-200`}
                    />
                    <div className="min-w-0">
                        <div className={`${depth > 0 ? 'text-[13px]' : ''} font-bold text-black`}>{displayName}</div>
                        <div className={`mt-1 ${depth > 0 ? 'text-[13px]' : 'text-[14px]'} text-gray-600 break-words`}>{node?.comment}</div>
                    </div>
                </div>

                <div className={`mt-2 flex items-center justify-between ${depth > 0 ? 'pl-[30px]' : 'pl-[42px]'}`}>
                    <p className="m-0 text-[12px] font-medium text-gray-400">{rel ? `Post ${rel}` : ""}</p>
                    <button
                        type="button"
                        className="m-0 cursor-pointer text-[12px] font-medium text-gray-600 inline-flex items-center gap-1"
                        onClick={() => toggleWrittenReply(id)}
                    >
                        <span className="text-[14px] leading-none opacity-80">↩</span>
                        {writtenReplyOpenById?.[id] ? 'Close' : 'Reply'}
                    </button>
                </div>

                {writtenReplyOpenById?.[id] && (
                    <div className={`mt-3 ${depth > 0 ? 'pl-[30px]' : 'pl-[42px]'}`}>
                        <div className="flex items-center gap-3 rounded-[18px] border border-[#d8d0d0] bg-white px-3 py-2">
                            <textarea
                                className="flex-1 appearance-none border-0 bg-transparent text-[13px] text-black outline-none resize-none overflow-hidden h-[20px] leading-[20px] placeholder:text-gray-400"
                                value={writtenReplyTextById?.[id] || ''}
                                onChange={(e) => setWrittenReplyTextById((prev) => ({ ...(prev || {}), [id]: e.target.value }))}
                                placeholder="Add your reply..."
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        submitWrittenReply(id);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="flex items-center justify-center rounded-full bg-[#ff4667] px-3 py-2 text-white text-[12px] font-semibold disabled:opacity-55"
                                onClick={() => submitWrittenReply(id)}
                                disabled={!String(writtenReplyTextById?.[id] || '').trim()}
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                )}

                {Array.isArray(node?.replies) && node.replies.length > 0 && (
                    <div className="mt-2">
                        {node.replies.map((child) => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    }, [
        UserImg,
        formatRelativeTime,
        submitWrittenReply,
        toggleWrittenReply,
        writtenReplyOpenById,
        writtenReplyTextById,
    ]);

    const writtenCommentsBoxSx = useMemo(() => ({
        width: { xs: "calc(100vw - 24px)", sm: "min(92vw, 420px)" },
        maxWidth: { xs: "calc(100vw - 24px)", sm: "min(92vw, 420px)" },
        outline: "none",
    }), []);

    const spokenCommentsBoxSx = useMemo(() => ({
        width: { xs: "calc(100vw - 24px)", sm: "min(92vw, 420px)" },
        maxWidth: { xs: "calc(100vw - 24px)", sm: "min(92vw, 420px)" },
        outline: "none",
    }), []);
    const [isAutoplay, setIsAutoplay] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAppleDevice, setIsAppleDevice] = useState(false);
    const [activeStoryIndex, setActiveStoryIndex] = useState(0);
    const [isIOS, setIsIOS] = useState(false);

    // Message to The World recording state
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [universalMessage, setUniversalMessage] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordingTimer, setRecordingTimer] = useState(null);
    const [isRecordingPaused, setIsRecordingPaused] = useState(false);
    const [showPublishButton, setShowPublishButton] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [publishedMessageType, setPublishedMessageType] = useState('public');
    const [isPrivateRecording, setIsPrivateRecording] = useState(false);
    const [alertAnytime, setAlertAnytime] = useState(false);
    const [writtenShowSuccess, setWrittenShowSuccess] = useState(false);
    const [writtenPublishedType, setWrittenPublishedType] = useState('public'); // private | public

    // Spoken Stories (separate recorder; does not touch existing recorder state)
    const [spokenStoryIsRecording, setSpokenStoryIsRecording] = useState(false);
    const [spokenStoryIsPaused, setSpokenStoryIsPaused] = useState(false);
    const [spokenStoryDuration, setSpokenStoryDuration] = useState(0);
    const [spokenStoryBlob, setSpokenStoryBlob] = useState(null);
    const [spokenStoryShowActions, setSpokenStoryShowActions] = useState(false);
    const [spokenStoryIsPublishing, setSpokenStoryIsPublishing] = useState(false);
    const [spokenStoryPublishType, setSpokenStoryPublishType] = useState('private'); // private | public
    const [spokenStoryShowPublishButton, setSpokenStoryShowPublishButton] = useState(false);
    const [spokenStoryShowSuccess, setSpokenStoryShowSuccess] = useState(false);
    const [spokenStoryPublishedType, setSpokenStoryPublishedType] = useState('private'); // private | public
    const [showMicPermissionBox, setShowMicPermissionBox] = useState(false);
    // Spoken Stories microphone permission UI
    // 'unknown' | 'granted' | 'prompt' | 'denied' | 'unsupported' | 'insecure'
    const [spokenMicStatus, setSpokenMicStatus] = useState('unknown');

    // Track which UI initiated the current recording so other sections don't mirror timer/state visually.
    const [recordingContext, setRecordingContext] = useState('message-world'); // 'message-world' | 'spoken-panel'
    const [visibleMessageCards, setVisibleMessageCards] = useState(4);
    const [messageSlideIndex, setMessageSlideIndex] = useState(0);
    const [isMessageAnimating, setIsMessageAnimating] = useState(true);
    const messageWheelLockRef = useRef(false);
    const messageWheelUnlockTimerRef = useRef(null);
    const messageTouchStartXRef = useRef(0);
    const messageTouchStartYRef = useRef(0);
    const messageTouchStartTimeRef = useRef(0);
    const messageMobileScrollerRef = useRef(null);
    const messageSectionRef = useRef(null);
    const discardRecordingOnStopRef = useRef(false);
    const recordingTimerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const pendingPublishAfterStopRef = useRef(false);
    const recordingDurationRef = useRef(0);
    const universalMessageRef = useRef('');
    const isPrivateRecordingRef = useRef(false);
    const doPublishRef = useRef(null);

    // Spoken Stories recorder refs (fully isolated)
    const spokenStoryRecorderRef = useRef(null);
    const spokenStoryStreamRef = useRef(null);
    const spokenStoryTimerRef = useRef(null);
    const spokenStoryDurationRef = useRef(0);
    const spokenStoryResetTimerRef = useRef(null);
    // WebAudio fallback recorder refs (for browsers without MediaRecorder)
    const spokenStoryAudioCtxRef = useRef(null);
    const spokenStoryProcessorRef = useRef(null);
    const spokenStorySourceRef = useRef(null);
    const spokenStoryPcmChunksRef = useRef([]);
    const spokenStorySampleRateRef = useRef(44100);
    const writtenResetTimerRef = useRef(null);

    const [pendingStoryCreation, setPendingStoryCreation] = useState(false);
    const [shouldLoadDeferredSections, setShouldLoadDeferredSections] = useState(false);
    const [shouldRenderMessageSection, setShouldRenderMessageSection] = useState(true);

    // Mobile banner-cards: play inline inside poster box
    const [inlineBannerPlayingId, setInlineBannerPlayingId] = useState(null);
    const [inlineBannerEndedByKey, setInlineBannerEndedByKey] = useState({});
    const [bannerVideosPreload, setBannerVideosPreload] = useState(false);
    const bannerStripRef = useRef(null);
    const bannerVideoRefs = useRef(new Map());

    // Memoize data extraction to prevent unnecessary re-renders
    const {
        stories,
        gifts,
        banner_stories: bannerStories = [],
        banner_cards: backendBannerCards = [],
        community_stories: backendCommunityStories = [],
    } = useMemo(() => data, [data]);
    const bannerStoriesById = useMemo(() => {
        const map = new Map();
        (Array.isArray(bannerStories) ? bannerStories : []).forEach((story) => {
            if (story?.id != null) {
                map.set(Number(story.id), story);
            }
        });
        return map;
    }, [bannerStories]);

    const bannerCards = useMemo(() => {
        if (!Array.isArray(backendBannerCards)) return [];
        return backendBannerCards
            .slice(0, 3)
            .map((card, index) => {
                const story = bannerStoriesById.get(Number(card?.storyId));
                const categories = Array.isArray(story?.categories) ? story.categories : [];
                const categoryLabel =
                    typeof card?.category === 'string' && card.category
                        ? card.category
                        : categories.find(
                            (c) => c && String(c).toLowerCase() !== 'all'
                        ) || categories[0] || 'Story';
                const authorFromCard = card?.author;
                const authorFromStory = story?.author;
                const author = authorFromCard?.name
                    ? {
                        ...authorFromCard,
                        is_following: !!authorFromCard.is_following,
                    }
                    : authorFromStory?.name
                        ? {
                            id: authorFromStory.id,
                            name: authorFromStory.name,
                            avatar: authorFromStory.avatar || '/img/avatar.png',
                            is_following: !!authorFromStory.is_following,
                        }
                        : null;

                return {
                    id: Number(card?.id ?? index + 1),
                    storyId: Number(card?.storyId),
                    poster: card?.poster || null,
                    video: card?.video || null,
                    alt: card?.alt || `Featured story ${index + 1}`,
                    author,
                    category: categoryLabel,
                };
            })
            .filter((card) => Number.isFinite(card.storyId));
    }, [backendBannerCards, bannerStoriesById]);

    /** Mobile banner strip: index of the card closest to horizontal center (gets larger “focus” styles). */
    const [bannerFocusIndex, setBannerFocusIndex] = useState(0);

    // Consolidate modal state
    const [modalState, setModalState] = useState({
        show: false,
        data: null,
        type: null
    });

    const [walletState, setWalletState] = useState({
        wallet: null,
        error: false,
        loading: false,
        refillSuccess: false
    });

    const [uiState, setUiState] = useState({
        customAmount: '',
        activeCardIndex: null,
        activeVideoId: null,
        activeDepositCard: null,
        focusedId: null,
        isMuted: true,
        showPreloader: false,
        isPlaying: true
    });

    const { media } = useUserMedia(auth?.user?.id);

    const editorRedirection = useEditorRedirectionContext();
    const { url } = editorRedirection;

    const isDesktop = useIsDesktop(992);

    const updateBannerFocusFromScroll = useCallback(() => {
        const strip = bannerStripRef.current;
        if (!strip) return;
        const nodes = strip.querySelectorAll('.os-hero-beyond__banner-card');
        if (!nodes.length) return;
        const centerX = strip.scrollLeft + strip.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        nodes.forEach((el, i) => {
            const mid = el.offsetLeft + el.offsetWidth / 2;
            const d = Math.abs(mid - centerX);
            if (d < bestDist) {
                bestDist = d;
                best = i;
            }
        });
        setBannerFocusIndex((prev) => (prev === best ? prev : best));
    }, []);

    useEffect(() => {
        if (bannerCards.length < 1) {
            setBannerFocusIndex(0);
            return;
        }
        setBannerFocusIndex(Math.floor((bannerCards.length - 1) / 2));
    }, [bannerCards.length]);

    const centerBannerCardByIndex = useCallback((index, behavior = 'smooth') => {
        const strip = bannerStripRef.current;
        if (!strip) return;
        const cards = strip.querySelectorAll('.os-hero-beyond__banner-card');
        const el = cards[index];
        if (!el) return;
        const left = Math.max(0, el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2);
        try {
            strip.scrollTo({ left, behavior });
        } catch (_) {
            strip.scrollLeft = left;
        }
    }, []);

    const getNearestBannerCardIndex = useCallback(() => {
        const strip = bannerStripRef.current;
        if (!strip) return 0;
        const nodes = strip.querySelectorAll('.os-hero-beyond__banner-card');
        if (!nodes.length) return 0;
        const centerX = strip.scrollLeft + strip.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        nodes.forEach((el, i) => {
            const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - centerX);
            if (d < bestDist) {
                bestDist = d;
                best = i;
            }
        });
        return best;
    }, []);

    // Mobile: smooth card 1 ↔ 2 ↔ 3 scroll — update focus + gentle center only when swipe ends
    useEffect(() => {
        if (isDesktop) return;
        const strip = bannerStripRef.current;
        if (!strip || bannerCards.length < 1) return;

        let scrollEndTimer = null;

        const onScrollEnd = () => {
            strip.classList.remove('is-banner-scrolling');
            const best = getNearestBannerCardIndex();
            setBannerFocusIndex((prev) => (prev === best ? prev : best));
            if (bannerCards.length >= 2) {
                centerBannerCardByIndex(best, 'smooth');
            }
        };

        const onScroll = () => {
            strip.classList.add('is-banner-scrolling');
            if (scrollEndTimer) window.clearTimeout(scrollEndTimer);
            scrollEndTimer = window.setTimeout(onScrollEnd, 200);
        };

        strip.addEventListener('scroll', onScroll, { passive: true });
        strip.addEventListener('scrollend', onScrollEnd);
        window.addEventListener('resize', updateBannerFocusFromScroll);

        return () => {
            strip.removeEventListener('scroll', onScroll);
            strip.removeEventListener('scrollend', onScrollEnd);
            window.removeEventListener('resize', updateBannerFocusFromScroll);
            if (scrollEndTimer) window.clearTimeout(scrollEndTimer);
        };
    }, [
        isDesktop,
        bannerCards.length,
        getNearestBannerCardIndex,
        centerBannerCardByIndex,
        updateBannerFocusFromScroll,
    ]);

    // Mobile: start centered on card 2 (no animation on first load)
    useEffect(() => {
        if (isDesktop) return;
        const strip = bannerStripRef.current;
        if (!strip || bannerCards.length < 2) return;
        const middleIndex = Math.floor((bannerCards.length - 1) / 2);
        const run = () => {
            centerBannerCardByIndex(middleIndex, 'auto');
            updateBannerFocusFromScroll();
        };
        requestAnimationFrame(run);
        const t = window.setTimeout(run, 150);
        return () => window.clearTimeout(t);
    }, [isDesktop, bannerCards, updateBannerFocusFromScroll, centerBannerCardByIndex]);
    const [shareBumps, setShareBumps] = useState({});

    const onStoryShareRecorded = useCallback((storyId) => {
        const id = Number(storyId);
        if (!Number.isFinite(id)) return;
        setShareBumps((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
    }, []);

    // Memoize stories to prevent unnecessary re-renders; merge live share counts from ShareModal
    const memoizedStories = useMemo(() => {
        if (!stories || !Array.isArray(stories)) return [];
        return stories.map((s) => ({
            ...s,
            total_share:
                (Number(s.total_share) || 0) + (shareBumps[s.id] || 0),
        }));
    }, [stories, shareBumps]);

    const communityStories = useMemo(() => {
        if (Array.isArray(backendCommunityStories) && backendCommunityStories.length > 0) {
            return backendCommunityStories.map((s) => ({
                ...s,
                total_share:
                    (Number(s.total_share) || 0) + (shareBumps[s.id] || 0),
            }));
        }
        return memoizedStories;
    }, [backendCommunityStories, memoizedStories, shareBumps]);




    // Optimize useEffect hooks
    useEffect(() => {
        if (success) {
            setWalletState(prev => ({ ...prev, wallet: new_balance }));
            setModalState(prev => ({
                show: true,
                data: { item: null, author: prev.data?.author },
                type: "success"
            }));
        }
    }, [success, message, new_balance]);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isIOSDevice = /iPhone|iPad|iPod/i.test(userAgent);
        setIsIOS(isIOSDevice);
        if (/iPhone|iPad|iPod|Macintosh/i.test(userAgent)) {
            setIsAppleDevice(true);
        }
    }, []);

    const trackSignupEvent = useCallback(async (userId) => {
        try {
            const analytics = await import('@/Utils/analytics');
            analytics?.trackSignup?.(userId);
        } catch (_) {
            // Analytics should never block UX.
        }
    }, []);

    const trackCreateStoryClickEvent = useCallback(async (userId) => {
        try {
            const analytics = await import('@/Utils/analytics');
            analytics?.trackCreateStoryClick?.(userId);
        } catch (_) {
            // Analytics should never block UX.
        }
    }, []);

    // Competition modal temporarily disabled
    // useEffect(() => {
    //     const modalShown = sessionStorage.getItem("competitionModalShown");

    //     if (!modalShown) {
    //         const timer = setTimeout(() => {
    //         setModalState({
    //             show: true,
    //             data: { item: null, author: null },
    //             type: "competition",
    //         });
    //         }, 6000);
    //         return () => clearTimeout(timer);
    //     }
    // }, []);    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const refillSuccessParam = params.get('refill_success');
        const signupParam = params.get('signup');
        const startStoryParam = params.get('start-story');

        if (refillSuccessParam === '1') {
            setModalState({ show: true, data: { item: null, author: null }, type: "refill-success" });
            const url = new URL(window.location);
            params.delete('refill_success');
            window.history.replaceState({}, '', url.pathname);
        }

        // Track social signup if present
        if (signupParam === 'social' && auth.user?.id) {
            trackSignupEvent(auth.user.id);
            // Clean up URL parameter
            const url = new URL(window.location);
            params.delete('signup');
            window.history.replaceState({}, '', url.pathname);
        }

        // Handle start-story URL parameter
        if (startStoryParam) {
            if (auth.user) {
                // User is logged in - show popup
                setModalState({
                    show: true,
                    data: { item: null, author: null },
                    type: "create-our-story"
                });
                // Clean up URL parameter
                const url = new URL(window.location);
                params.delete('start-story');
                window.history.replaceState({}, '', url.pathname);
            } else {
                // User is not logged in - redirect to login with start-story parameter preserved
                const currentUrl = window.location.pathname + window.location.search;
                router.visit(route('login') + '?redirect=' + encodeURIComponent(currentUrl));
            }
        }
    }, [auth.user, router, trackSignupEvent]);

    // Memoize event handlers to prevent unnecessary re-renders
    const openModal = useCallback((item, type, author, extraData = null) => {
        setModalState({
            show: true,
            data: { item, author, ...(extraData && typeof extraData === 'object' ? extraData : {}) },
            type
        });
    }, []);

    const closeModal = useCallback(() => {
        console.log("modalState.type", modalState.type)
        if (modalState.type === 'competition') {
            sessionStorage.setItem("competitionModalShown", true);
        }
        setModalState({ show: false, data: null, type: null });
        setUiState(prev => ({ ...prev, activeCardIndex: null }));
        setWalletState(prev => ({ ...prev, error: false, refillSuccess: false }));
    }, [modalState.type]);

    const handleGiftClick = useCallback((index) => {
        setUiState(prev => ({ ...prev, activeCardIndex: index }));
    }, []);

    const handleStart = useCallback(() => {
        setUiState(prev => ({ ...prev, isMuted: false, showPreloader: false, isPlaying: true }));
    }, []);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
            localStorage.setItem('hasVisited', 'true');
        } else {
            setUiState(prev => ({ ...prev, showPreloader: false }));
        }
    }, []);

    useEffect(() => {
        if (shouldLoadDeferredSections) return undefined;

        let timeoutId = null;
        let idleCallbackId = null;

        const loadDeferredSections = () => setShouldLoadDeferredSections(true);

        const scheduleDeferredLoad = () => {
            if ('requestIdleCallback' in window) {
                idleCallbackId = window.requestIdleCallback(loadDeferredSections, { timeout: 2500 });
            } else {
                timeoutId = window.setTimeout(loadDeferredSections, 2500);
            }
        };

        const onInteraction = () => loadDeferredSections();

        window.addEventListener('pointerdown', onInteraction, { once: true, passive: true });
        window.addEventListener('keydown', onInteraction, { once: true, passive: true });
        window.addEventListener('touchstart', onInteraction, { once: true, passive: true });
        window.addEventListener('scroll', onInteraction, { once: true, passive: true });

        if (document.readyState === 'complete') {
            scheduleDeferredLoad();
        } else {
            window.addEventListener('load', scheduleDeferredLoad, { once: true });
        }

        return () => {
            window.removeEventListener('pointerdown', onInteraction);
            window.removeEventListener('keydown', onInteraction);
            window.removeEventListener('touchstart', onInteraction);
            window.removeEventListener('scroll', onInteraction);
            window.removeEventListener('load', scheduleDeferredLoad);
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
            if (idleCallbackId && 'cancelIdleCallback' in window) {
                window.cancelIdleCallback(idleCallbackId);
            }
        };
    }, [shouldLoadDeferredSections]);

    useEffect(() => {
        if (shouldRenderMessageSection) return undefined;
        const sectionEl = messageSectionRef.current;
        if (!sectionEl) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setShouldRenderMessageSection(true);
                    observer.disconnect();
                }
            },
            { root: null, rootMargin: '320px 0px', threshold: 0.01 }
        );

        observer.observe(sectionEl);

        return () => observer.disconnect();
    }, [shouldRenderMessageSection]);

    // Add a separate effect to handle stopping recording when stop button is clicked
    useEffect(() => {
        // This effect is only for cleanup during component unmount
        return () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
                recordingTimerRef.current = null;
            }
        };
    }, [mediaRecorder]);

    const handleActivateFocus = useCallback((id) => {
        setUiState(prev => ({ ...prev, focusedId: id }));
    }, []);

    const handleCloseFocus = useCallback(() => {
        setUiState(prev => ({ ...prev, focusedId: null }));
    }, []);

    // const handleToOpenVideoEditor = useCallback(() => {
    //     const userId = auth?.user?.id || null;
    //     trackCreateStoryClick(userId);

    //     if (!auth?.user) {
    //         router.visit(route('login'), { replace: true });
    //         return;
    //     }

    //     if (Array.isArray(media) && media.length > 0) {
    //         window.location.href = '/draft';
    //     } else {
    //         window.location.href = `${url}&is_draft=false`;
    //     }
    // }, [
    //     auth,
    //     media,
    //     url,
    //     router,
    //     trackCreateStoryClick
    // ]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get('open_editor') === '1') {
            // Clean up URL parameter after triggering
            const url = new URL(window.location);
            params.delete('open_editor');
            window.history.replaceState({}, '', url.pathname);
            
            // Delay to ensure auth state is fully loaded
            setTimeout(() => {
                handleToOpenVideoEditor();
            }, 500);
        }
    }, []);


    // useEffect(() => {
    //     const params = new URLSearchParams(window.location.search);

    //     if (params.get('open_editor') === '1' && auth?.user?.id) {
    //         handleToOpenVideoEditor();
    //     }
    // }, [auth?.user?.id, handleToOpenVideoEditor]);


    // const handleToOpenVideoEditor = useCallback((e) => {
    //     e?.preventDefault();

    //     const userId = auth?.user?.id || null;
    //     trackCreateStoryClick(userId);

    //     if (!auth?.user?.id) {
    //         router.visit(route('login'), { replace: true });
    //         return;
    //     }

    //     if (Array.isArray(media) && media.length > 0) {
    //         window.location.href = '/draft';
    //     } else {
    //         window.location.href = `${url}&is_draft=false`;
    //     }
    // }, [
    //     auth?.user?.id,
    //     media,
    //     url,
    //     router,
    //     trackCreateStoryClick
    // ]);



    //Its working code below before email redirection editor template
    // const handleToOpenVideoEditor = useCallback((e) => {
    //     e?.preventDefault();

    //     const userId = auth?.user?.id || null;
    //     trackCreateStoryClick(userId);

    //     if (!auth?.user?.id) {
    //         router.visit(route('login'), { replace: true });
    //         return;
    //     }

    //     setTimeout(() => {

    //         if (Array.isArray(media) && media.length > 0) {
    //             window.location.href = '/draft';
    //         } else if (url) {
    //             window.location.href = `${url}&is_draft=false`;
    //         } else {
    //             console.warn("Editor URL still not ready");
    //         }

    //     }, 5000); // wait 1 second

    // }, [
    //     auth?.user?.id,
    //     media,
    //     url,
    //     router,
    //     trackCreateStoryClick
    // ]);


    const handleToOpenVideoEditor = useCallback((e) => {
        e?.preventDefault();
        const userId = auth?.user?.id || null;
        trackCreateStoryClickEvent(userId);

        if (!userId) {
            router.visit(route('login'), { replace: true });
            return;
        }

        if (url) {
            redirectToDraftOrNewStory({ media, newStoryUrl: url });
            return;
        }

        setPendingStoryCreation(true);
        console.warn("Waiting for editor URL...");
    }, [auth?.user?.id, media, url, router, trackCreateStoryClickEvent]);

    // useEffect(() => {
    //     const params = new URLSearchParams(window.location.search);

    //     if (params.get('open_editor') === '1' && auth?.user?.id) {
    //         handleToOpenVideoEditor();
    //     }
    // }, [auth?.user?.id, handleToOpenVideoEditor]);

    useEffect(() => {
        if (pendingStoryCreation && url && auth?.user?.id) {
            redirectToDraftOrNewStory({ media, newStoryUrl: url });
            setPendingStoryCreation(false);
        }
    }, [url, pendingStoryCreation, auth?.user?.id, media]);


    const messages = useMemo(() => [
        {
            id: 1,
            name: "brittporterb2226",
            subtitle: "",
            message: "Stop waiting. We don't have time for anything besides what truly matters. Before you know it, your back hurts every time you bend over, your parents grow old and pass away, and your kids are suddenly graduating while you're still reminiscing about their first day of preschool. Time is borrowed, and it's limited. So do it now — whatever it is, whatever you've been putting off. Do it !!",
            img: brittporterb,
        },
        {
            id: 2,
            name: "Soulknight89",
            message: "Love one another stop fighting",
            img: soulknight,
        },
        {
            id: 3,
            name: "Porcellana",
            message: "My message is about transformation, healing, and self-restoration. I believe pain does not define you — purpose does. No matter your past or what you've been through, you can rise, heal, reclaim your voice, and become whole again.",
            img: porcellana,
        },
        {
            id: 4,
            name: "Kimberly Hockenheimer",
            message: "They say God doesn't give you more than you can handle. They say He gives the hardest battles to His strongest soldiers... but sometimes, I'm just tired of being strong.",
            img: kimberlyhockenheimer,
        },
        {
            id: 5,
            name: "QueenNeek",
            message: "Be good to people, for no reason.",
            img: queenneek,
        },
        {
            id: 6,
            name: "thelouisianasho",
            message: "c'est la vie.",
            img: thelouisianasho,
        },
        {
            id: 7,
            name: "Thomas Naishma",
            // name: "TommyNai",
            subtitle: "",
            message: "Live & Speak Your Truth , Stand In your Power , Gifts & Authenticity",
            img: tommynai,
        },
        {
            id: 8,
            name: "Fancee",
            subtitle: "",
            message: "Life doesn’t always unfold the way we expect. Sometimes we make mistakes. Sometimes things fall apart. And sometimes we’re left carrying lessons we never asked for. But none of that means your story is over.",
            img: week_message,
        },
        {
            id: 9,
            name: "Danimal Charles",
            subtitle: "Kaylin Richards",
            message: "Staying matters. Staying present, honest, alive, not staying positive. You don’t have to fix your pain to exist. You’re not broken for struggling. Staying, especially when it’s hard, is courage. Perspective can change everything.",
            img: denimalcharly,
        },
        {
            id: 10,
            name: "KAOZ",
            subtitle: "",
            message: "They told us to be realistic. They told us the world couldn’t change. But another world is already beginning, and we can feel it. Millennials and Gen Z were born for this moment. Our time is now. Let’s bring that better world into being.",
            img: kaoz,
        },
        {
            id: 11,
            name: "CK777",
            subtitle: "",
            message: "We’re all just walking each other home.",
            img: ck,
        },
        {
            id: 12,
            name: "DezTechs",
            subtitle: "",
            message: "Take your time; the world isn't going anywhere.",
            img: dez_tech,
        },
        {
            id: 13,
            name: "Kenya Harlan",
            subtitle: "",
            message: "Don't worry so much about other people or what they want, need, like or don't.  Don't let anyone clown you.  Reciprocity is everything in a relationship",
            img: kenya_harlen,
        },
        {
            id: 14,
            name: "Ajstayfit",
            subtitle: "",
            message: "Fear nothing",
            img: ajstayfit,
        },
        {
            id: 15,
            name: "Moochious",
            subtitle: "",
            message: "Broken but not useless We can be broken and cracked, but that doesnt mean we cant be mended back together, and still made usable.",
            img: moochi,
        },
        {
            id: 16,
            name: "ItsMonicaAgain",
            subtitle: "Kaylin Richards",
            message: "Your mess isn’t your shame. It’s your power. Own your story, laugh at the chaos, and turn every mistake into fuel. The world doesn’t need perfect people. It needs real ones. 🔥",
            img: itsmonica,
        },
        {
            id: 17,
            name: "OtterViking",
            subtitle: "",
            message: "We only have this one life, to know this is key to life, so harm none- have fun in it ! Don't fwell in what's happened. Or what's not happened , just BE Happy and fun wherever life turns out to be.... & Never, Never play leapfrog with a univorn...",
            img: otterking,
        },
        {
            id: 18,
            name: "Kaylyn Richard",
            subtitle: "",
            message: "(Lol entertainment love out loud )Be the love you always wanted",
            img: kylin,
        },
        {
            id: 19,
            name: "RenascentAngel78",
            subtitle: "",
            message: "All our knowledge has it's origin in our perceptions - Leonardo da Vinci",
            img: renas,
        },
        {
            id: 20,
            name: "LaurCzech11",
            subtitle: "",
            message: "The Light Shines in the Darkness, and the darkness shall Not overcome it... BE the Light. ♥",
            img: laurya,
        },
        {
            id: 21,
            name: "iammark1900-3505aa",
            subtitle: "",
            message: "Despite what the world throws at you, be humble and kind. That does not mean you let anyone tread on you. May you be well, happy, and peaceful.",
            img: iammark,
        },
        {
            id: 22,
            name: "MadysinLynn",
            subtitle: "",
            message: "Humility is humanities greatest weapon",
            img: maddisin,
        },
        // {
        //     id: 23,
        //     name: "paulleverich-9eeac1",
        //     subtitle: "",
        //     message: "I don’t speak from perfection. I speak from experience. Life will try to make you smaller. It’ll test you, break you, push you into corners you didn’t know existed. People will doubt you, label you, judge you by your worst moments Let them.",
        //     img: paull,
        // },
        {
            id: 23,
            name: "Idylilith69",
            subtitle: "",
            message: "Stop shrinking to survive in a world that was never built for your magic. Own your power. Even when it’s inconvenient. Especially when it scares people.",
            img: idyli,
        },
        {
            id: 24,
            name: "Poetssoul30",
            subtitle: "",
            message: "Your first Love should always be yourself. And to always be learning until the day you die.",
            img: poet,
        }



    ], []);

    useEffect(() => {
        const updateVisibleCards = () => {
            if (window.innerWidth < 768) {
                setVisibleMessageCards(1);
                return;
            }
            if (window.innerWidth >= 1280) {
                setVisibleMessageCards(5);
                return;
            }
            if (window.innerWidth < 1024) {
                setVisibleMessageCards(2);
                return;
            }
            setVisibleMessageCards(4);
        };

        updateVisibleCards();
        window.addEventListener('resize', updateVisibleCards);
        return () => window.removeEventListener('resize', updateVisibleCards);
    }, []);

    const messageCloneCount = useMemo(
        () => Math.min(visibleMessageCards, Math.max(messages.length, 1)),
        [messages.length, visibleMessageCards]
    );

    const loopedMessageItems = useMemo(() => {
        if (!messages.length) return [];
        if (messages.length <= visibleMessageCards) return messages;

        const head = messages.slice(0, messageCloneCount);
        const tail = messages.slice(-messageCloneCount);
        return [...tail, ...messages, ...head];
    }, [messages, visibleMessageCards, messageCloneCount]);

    const nextMessagePage = useCallback(() => {
        if (messages.length <= visibleMessageCards) return;
        setIsMessageAnimating(true);
        setMessageSlideIndex((prev) => prev + 1);
    }, [messages.length, visibleMessageCards]);

    const prevMessagePage = useCallback(() => {
        if (messages.length <= visibleMessageCards) return;
        setIsMessageAnimating(true);
        setMessageSlideIndex((prev) => prev - 1);
    }, [messages.length, visibleMessageCards]);

    const MESSAGE_CAROUSEL_AUTOPLAY_DELAY_MS = 3000;
    const MESSAGE_CAROUSEL_AUTOPLAY_INTERVAL_MS = 4200;

    useEffect(() => {
        let intervalTimer = null;
        let delayTimer = null;
        const armDesktopAutoplay = () => {
            if (intervalTimer) {
                clearInterval(intervalTimer);
                intervalTimer = null;
            }
            if (delayTimer) {
                clearTimeout(delayTimer);
                delayTimer = null;
            }
            if (messages.length <= visibleMessageCards) return;
            // Below md: mobile uses messageMobileScrollerRef autoplay instead
            if (typeof window !== 'undefined' && window.innerWidth < 768) return;

            const step = () => {
                setIsMessageAnimating(true);
                setMessageSlideIndex((prev) => prev + 1);
            };

            delayTimer = setTimeout(() => {
                delayTimer = null;
                step();
                intervalTimer = setInterval(step, MESSAGE_CAROUSEL_AUTOPLAY_INTERVAL_MS);
            }, MESSAGE_CAROUSEL_AUTOPLAY_DELAY_MS);
        };

        armDesktopAutoplay();
        window.addEventListener('resize', armDesktopAutoplay);
        return () => {
            window.removeEventListener('resize', armDesktopAutoplay);
            if (delayTimer) clearTimeout(delayTimer);
            if (intervalTimer) clearInterval(intervalTimer);
        };
    }, [messages.length, visibleMessageCards]);

    // Mobile strip: 3s delay before first scroll, then same cadence as desktop (4200ms)
    useEffect(() => {
        let intervalId = null;
        let delayId = null;
        const MD_BREAKPOINT = 768;

        const clear = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            if (delayId) {
                clearTimeout(delayId);
                delayId = null;
            }
        };

        const isMobileStripActive = () =>
            typeof window !== 'undefined' && window.innerWidth < MD_BREAKPOINT;

        const setup = () => {
            clear();
            if (!isMobileStripActive() || messages.length < 2) return;

            const scroller = messageMobileScrollerRef.current;
            if (scroller) {
                scroller.scrollLeft = 0;
            }

            let slideIdx = 0;

            const tick = () => {
                if (!isMobileStripActive()) return;
                const el = messageMobileScrollerRef.current;
                if (!el) return;

                slideIdx = (slideIdx + 1) % messages.length;
                const child = el.children[slideIdx];
                if (!child) return;

                const reduceMotion =
                    typeof window !== 'undefined' &&
                    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                el.scrollTo({
                    left: child.offsetLeft,
                    behavior: reduceMotion ? 'auto' : 'smooth',
                });
            };

            delayId = setTimeout(() => {
                delayId = null;
                tick();
                intervalId = setInterval(tick, MESSAGE_CAROUSEL_AUTOPLAY_INTERVAL_MS);
            }, MESSAGE_CAROUSEL_AUTOPLAY_DELAY_MS);
        };

        setup();
        window.addEventListener('resize', setup);
        return () => {
            window.removeEventListener('resize', setup);
            clear();
        };
    }, [messages.length]);

    useEffect(() => {
        // Keep responsive changes smooth by resetting to the first real card.
        setIsMessageAnimating(false);
        setMessageSlideIndex(messageCloneCount);
        const id = requestAnimationFrame(() => setIsMessageAnimating(true));
        return () => cancelAnimationFrame(id);
    }, [messageCloneCount]);

    const handleMessageTrackTransitionEnd = useCallback(() => {
        if (messages.length <= visibleMessageCards) return;

        if (messageSlideIndex < messageCloneCount) {
            setIsMessageAnimating(false);
            setMessageSlideIndex(messages.length + messageCloneCount - 1);
            requestAnimationFrame(() => setIsMessageAnimating(true));
            return;
        }

        if (messageSlideIndex >= messages.length + messageCloneCount) {
            setIsMessageAnimating(false);
            setMessageSlideIndex(messageCloneCount);
            requestAnimationFrame(() => setIsMessageAnimating(true));
        }
    }, [messages.length, visibleMessageCards, messageSlideIndex, messageCloneCount]);

    const queueMessageWheelUnlock = useCallback(() => {
        if (messageWheelUnlockTimerRef.current) {
            clearTimeout(messageWheelUnlockTimerRef.current);
        }
        messageWheelUnlockTimerRef.current = setTimeout(() => {
            messageWheelLockRef.current = false;
        }, 760);
    }, []);

    const handleMessageWheel = useCallback((e) => {
        if (messages.length <= visibleMessageCards || messageWheelLockRef.current) return;
        if (Math.abs(e.deltaY) < 8 && Math.abs(e.deltaX) < 8) return;

        e.preventDefault();
        messageWheelLockRef.current = true;

        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (delta > 0) {
            nextMessagePage();
        } else {
            prevMessagePage();
        }

        queueMessageWheelUnlock();
    }, [messages.length, visibleMessageCards, nextMessagePage, prevMessagePage, queueMessageWheelUnlock]);

    const handleMessageTouchStart = useCallback((e) => {
        if (!e.touches?.length) return;
        messageTouchStartXRef.current = e.touches[0].clientX;
        messageTouchStartYRef.current = e.touches[0].clientY;
        messageTouchStartTimeRef.current = Date.now();
    }, []);

    const handleMessageTouchEnd = useCallback((e) => {
        if (messages.length <= visibleMessageCards || !e.changedTouches?.length || messageWheelLockRef.current) return;

        const touch = e.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;
        const deltaX = messageTouchStartXRef.current - endX;
        const deltaY = messageTouchStartYRef.current - endY;
        const gestureTime = Date.now() - messageTouchStartTimeRef.current;

        // iOS emits noisy/diagonal touch signals; keep only intentional horizontal swipes.
        if (gestureTime > 520) return;
        if (Math.abs(deltaX) < 42) return;
        if (Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;

        messageWheelLockRef.current = true;

        if (deltaX > 0) {
            nextMessagePage();
        } else {
            prevMessagePage();
        }

        queueMessageWheelUnlock();
    }, [messages.length, visibleMessageCards, nextMessagePage, prevMessagePage, queueMessageWheelUnlock]);

    useEffect(() => {
        return () => {
            if (messageWheelUnlockTimerRef.current) {
                clearTimeout(messageWheelUnlockTimerRef.current);
            }
        };
    }, []);

    // const handleToOpenVideoEditor = useCallback(async() => {
    //     // Track "Create A Story" click event
    //     const userId = auth.user?.id || null;
    //     trackCreateStoryClick(userId);


    //     if (auth.user) {

    //         if(media && media.length > 0){
    //             window.location.href = 'https://onestoryplanet.com/draft';

    //         }else{
    //             window.location.href = `${url}&is_draft=false`;
    //         }
    //     } else {
    //         router.visit(route("login"));
    //     }
    // }, [media, url, auth.user]);
    const handleConnectToStoryTeller = (e, item) => {
        if (e) e.stopPropagation();
        window.location.href = `/chatify/${item?.author?.id}`;
    }

    // Get compatible MIME type for MediaRecorder based on device
    const getCompatibleMimeType = () => {
        // iOS Safari has limited MediaRecorder support
        if (isIOS) {
            // iOS 14.3+ supports MediaRecorder with limited formats
            const iosTypes = [
                'audio/mp4',
                'audio/aac',
                'audio/mpeg',
            ];

            for (const type of iosTypes) {
                if (MediaRecorder.isTypeSupported(type)) {
                    return type;
                }
            }
            // Fallback - iOS will use default (usually mp4/aac)
            return '';
        }

        // For other browsers
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4',
            'audio/mpeg',
            'audio/ogg;codecs=opus',
            'audio/wav',
            'audio/aac',
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        return ''; // Browser will use default
    };

    // Get file extension based on MIME type
    const getFileExtension = (mimeType) => {
        if (mimeType.includes('webm')) return 'webm';
        if (mimeType.includes('mp4')) return 'm4a';
        if (mimeType.includes('mpeg')) return 'mp3';
        if (mimeType.includes('ogg')) return 'ogg';
        if (mimeType.includes('wav')) return 'wav';
        if (mimeType.includes('aac')) return 'aac';
        return 'webm'; // default
    };

    const stopRecordingTimer = useCallback(() => {
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
            setRecordingTimer(null);
        }
    }, []);

    const startRecordingTimer = useCallback(() => {
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }

        const timer = setInterval(() => {
            setRecordingDuration((prev) => prev + 1);
        }, 1000);

        recordingTimerRef.current = timer;
        setRecordingTimer(timer);
    }, []);

    // Keep refs in sync for use inside recorder.onstop (stop-then-publish)
    useEffect(() => {
        recordingDurationRef.current = recordingDuration;
        universalMessageRef.current = universalMessage;
        isPrivateRecordingRef.current = isPrivateRecording;
    }, [recordingDuration, universalMessage, isPrivateRecording]);

    // Keep Spoken Stories recorder refs in sync
    useEffect(() => {
        spokenStoryDurationRef.current = spokenStoryDuration;
    }, [spokenStoryDuration]);

    // Spoken Stories: track microphone permission to show "Allow" prompt UI
    useEffect(() => {
        if (!auth?.user?.id) {
            setSpokenMicStatus('unknown');
            return;
        }

        if (typeof window !== 'undefined' && window.isSecureContext === false) {
            setSpokenMicStatus('insecure');
            return;
        }

        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
            setSpokenMicStatus('unsupported');
            return;
        }

        let active = true;
        const update = async () => {
            try {
                const perm = await navigator.permissions?.query?.({ name: 'microphone' });
                const state = perm?.state;
                if (!active) return;
                if (state === 'granted') setSpokenMicStatus('granted');
                else if (state === 'denied') setSpokenMicStatus('denied');
                else setSpokenMicStatus('prompt');

                if (perm && typeof perm.onchange !== 'undefined') {
                    perm.onchange = () => {
                        const s = perm.state;
                        if (!active) return;
                        if (s === 'granted') setSpokenMicStatus('granted');
                        else if (s === 'denied') setSpokenMicStatus('denied');
                        else setSpokenMicStatus('prompt');
                    };
                }
            } catch (_) {
                if (active) setSpokenMicStatus('prompt');
            }
        };

        void update();
        return () => {
            active = false;
        };
    }, [auth?.user?.id]);

    const requestSpokenMicPermission = useCallback(async () => {
        if (!auth?.user?.id) {
            router.visit(loginUrlForPublishMessage(), { replace: true });
            return;
        }
        if (typeof window !== 'undefined' && window.isSecureContext === false) {
            try {
                if (window.location?.protocol === 'http:') {
                    const next = `https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`;
                    window.location.href = next;
                    return;
                }
            } catch (_) { }
            alert('Microphone requires HTTPS. Please open using HTTPS (SSL) and try again.');
            setSpokenMicStatus('insecure');
            return;
        }
        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
            alert('Recording is not supported in this browser.');
            setSpokenMicStatus('unsupported');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            try { stream.getTracks().forEach((t) => t.stop()); } catch (_) { }
            setSpokenMicStatus('granted');
        } catch (e) {
            const code = e?.name || e?.code;
            if (code === 'NotAllowedError' || code === 'PermissionDeniedError') {
                setSpokenMicStatus('denied');
            } else {
                setSpokenMicStatus('prompt');
            }
        }
    }, [auth?.user?.id, router]);

    const stopSpokenStoryTimer = useCallback(() => {
        if (spokenStoryTimerRef.current) {
            clearInterval(spokenStoryTimerRef.current);
            spokenStoryTimerRef.current = null;
        }
    }, []);

    const startSpokenStoryTimer = useCallback(() => {
        stopSpokenStoryTimer();
        spokenStoryTimerRef.current = setInterval(() => {
            setSpokenStoryDuration((prev) => prev + 1);
        }, 1000);
    }, [stopSpokenStoryTimer]);

    const getUserMediaAny = useCallback((constraints) => {
        const nav = typeof navigator !== 'undefined' ? navigator : null;
        if (!nav) {
            return Promise.reject(new Error('Navigator not available'));
        }

        if (nav.mediaDevices?.getUserMedia) {
            return nav.mediaDevices.getUserMedia(constraints);
        }

        const legacy = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia;
        if (!legacy) {
            return Promise.reject(new Error('getUserMedia not available'));
        }

        return new Promise((resolve, reject) => {
            legacy.call(nav, constraints, resolve, reject);
        });
    }, []);

    const encodeWav16 = useCallback((channels, sampleRate) => {
        const numChannels = channels.length;
        const length = channels[0]?.length || 0;
        const bytesPerSample = 2;
        const blockAlign = numChannels * bytesPerSample;
        const byteRate = sampleRate * blockAlign;
        const dataSize = length * blockAlign;

        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);
        let offset = 0;

        const writeString = (s) => {
            for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
            offset += s.length;
        };
        const writeUint32 = (v) => { view.setUint32(offset, v, true); offset += 4; };
        const writeUint16 = (v) => { view.setUint16(offset, v, true); offset += 2; };

        writeString('RIFF');
        writeUint32(36 + dataSize);
        writeString('WAVE');
        writeString('fmt ');
        writeUint32(16);
        writeUint16(1); // PCM
        writeUint16(numChannels);
        writeUint32(sampleRate);
        writeUint32(byteRate);
        writeUint16(blockAlign);
        writeUint16(16); // bits
        writeString('data');
        writeUint32(dataSize);

        // interleave
        for (let i = 0; i < length; i++) {
            for (let ch = 0; ch < numChannels; ch++) {
                const s = Math.max(-1, Math.min(1, channels[ch][i] || 0));
                view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
                offset += 2;
            }
        }

        return new Blob([buffer], { type: 'audio/wav' });
    }, []);

    // New, isolated handler for Spoken Stories recording (does not modify existing recorder logic)
    const handleSpokenStoryRecording = useCallback(async () => {
        // Login gate (match existing behavior)
        if (!auth?.user?.id) {
            router.visit(loginUrlForPublishMessage(), { replace: true });
            return;
        }
        setShowMicPermissionBox(true);

        const current = spokenStoryRecorderRef.current;
        if (current && (current.state === 'recording' || current.state === 'paused')) {
            current.stop();
            stopSpokenStoryTimer();
            setSpokenStoryIsRecording(false);
            setSpokenStoryIsPaused(false);
            return;
        }

        // WebAudio fallback stop
        if (!current && spokenStoryAudioCtxRef.current) {
            try {
                spokenStoryProcessorRef.current?.disconnect?.();
                spokenStorySourceRef.current?.disconnect?.();
            } catch (_) { }
            try {
                spokenStoryAudioCtxRef.current?.close?.();
            } catch (_) { }

            const chunks = spokenStoryPcmChunksRef.current || [];
            const sampleRate = spokenStorySampleRateRef.current || 44100;
            spokenStoryPcmChunksRef.current = [];

            if (chunks.length) {
                // Merge chunks into single Float32Array per channel (mono recording)
                const total = chunks.reduce((sum, arr) => sum + (arr?.length || 0), 0);
                const mono = new Float32Array(total);
                let pos = 0;
                for (const c of chunks) {
                    mono.set(c, pos);
                    pos += c.length;
                }
                const wavBlob = encodeWav16([mono], sampleRate);
                setSpokenStoryBlob(wavBlob);
                setSpokenStoryShowActions(true);
                setSpokenStoryShowPublishButton(true);
            }

            spokenStoryAudioCtxRef.current = null;
            spokenStoryProcessorRef.current = null;
            spokenStorySourceRef.current = null;

            stopSpokenStoryTimer();
            setSpokenStoryIsRecording(false);
            setSpokenStoryIsPaused(false);
            if (spokenStoryStreamRef.current) {
                try { spokenStoryStreamRef.current.getTracks().forEach((t) => t.stop()); } catch (_) { }
                spokenStoryStreamRef.current = null;
            }
            return;
        }

        try {
            setSpokenStoryBlob(null);
            setSpokenStoryShowActions(false);
            setSpokenStoryShowPublishButton(false);
            setSpokenStoryDuration(0);
            setSpokenStoryPublishType('private');

            if (typeof navigator === 'undefined') {
                alert('Recording is not available. Please try again.');
                return;
            }

            // Microphone access requires HTTPS (or localhost).
            if (typeof window !== 'undefined' && window.isSecureContext === false) {
                try {
                    // Best-effort: upgrade http -> https automatically when available.
                    if (window.location?.protocol === 'http:') {
                        const next = `https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`;
                        window.location.href = next;
                        return;
                    }
                } catch (_) { }

                alert('Microphone recording requires HTTPS. This site is currently opened on HTTP, so recording will not work. Please open using HTTPS (SSL) and try again.');
                return;
            }

            // If permissions API is available and user already denied mic, explain what to do.
            try {
                const perm = await navigator.permissions?.query?.({ name: 'microphone' });
                if (perm?.state === 'denied') {
                    alert('Microphone permission is blocked for this site. Please allow microphone in your browser/site settings and reload.');
                    return;
                }
            } catch (_) {
                // ignore
            }

            const preferredConstraints = {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100,
                },
            };

            let stream = null;
            try {
                stream = await getUserMediaAny(preferredConstraints);
            } catch (e) {
                // Some browsers/devices reject advanced constraints. Retry with simple audio.
                stream = await getUserMediaAny({ audio: true });
            }

            spokenStoryStreamRef.current = stream;

            // Prefer MediaRecorder when available, otherwise fall back to WebAudio→WAV.
            if (typeof MediaRecorder === 'undefined') {
                const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextCtor) {
                    alert('Audio recording is not supported in this browser.');
                    return;
                }

                const ctx = new AudioContextCtor();
                spokenStoryAudioCtxRef.current = ctx;
                spokenStorySampleRateRef.current = ctx.sampleRate || 44100;
                spokenStoryPcmChunksRef.current = [];

                const source = ctx.createMediaStreamSource(stream);
                spokenStorySourceRef.current = source;
                const processor = ctx.createScriptProcessor(4096, 1, 1);
                spokenStoryProcessorRef.current = processor;
                processor.onaudioprocess = (e) => {
                    const input = e.inputBuffer.getChannelData(0);
                    // Copy to detach from buffer
                    spokenStoryPcmChunksRef.current.push(new Float32Array(input));
                };
                source.connect(processor);
                processor.connect(ctx.destination);

                setSpokenStoryIsRecording(true);
                setSpokenStoryIsPaused(false);
                startSpokenStoryTimer();
                return;
            }

            const mimeType = getCompatibleMimeType();
            const options = mimeType ? { mimeType } : {};
            const recorder = new MediaRecorder(stream, options);
            const chunks = [];

            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            recorder.onerror = (e) => {
                console.error('Spoken Stories MediaRecorder error:', e);
            };

            recorder.onstop = () => {
                try {
                    const blobMimeType = recorder.mimeType || 'audio/webm';
                    const blob = new Blob(chunks, { type: blobMimeType });
                    setSpokenStoryBlob(blob);
                    setSpokenStoryShowActions(true);
                    setSpokenStoryShowPublishButton(true);
                } finally {
                    stopSpokenStoryTimer();
                    setSpokenStoryIsRecording(false);
                    setSpokenStoryIsPaused(false);
                    spokenStoryRecorderRef.current = null;
                    if (spokenStoryStreamRef.current) {
                        spokenStoryStreamRef.current.getTracks().forEach((t) => t.stop());
                        spokenStoryStreamRef.current = null;
                    }
                }
            };

            spokenStoryRecorderRef.current = recorder;
            recorder.start();
            setSpokenStoryIsRecording(true);
            setSpokenStoryIsPaused(false);
            startSpokenStoryTimer();
        } catch (error) {
            console.error('Error starting Spoken Stories recording:', error);
            const code = error?.name || error?.code;
            if (code === 'NotAllowedError' || code === 'PermissionDeniedError') {
                alert('Microphone permission was denied. Please click the lock icon in the address bar, allow Microphone, then reload and try again.');
            } else if (code === 'NotFoundError' || code === 'DevicesNotFoundError') {
                alert('No microphone device was found. Please connect a microphone and try again.');
            } else if (code === 'NotReadableError' || code === 'TrackStartError') {
                alert('Microphone is in use by another app (Zoom/Meet/etc). Close other apps using the mic and try again.');
            } else {
                alert('Microphone access is required to record. Please allow microphone permission and try again.');
            }
            setSpokenStoryIsRecording(false);
            setSpokenStoryIsPaused(false);
            stopSpokenStoryTimer();
        }
    }, [auth?.user?.id, router, getCompatibleMimeType, startSpokenStoryTimer, stopSpokenStoryTimer]);

    const handleSpokenStoryDeleteRecording = useCallback(() => {
        // Stop active recorder (if any) then clear
        const current = spokenStoryRecorderRef.current;
        if (current && (current.state === 'recording' || current.state === 'paused')) {
            current.stop();
        }
        stopSpokenStoryTimer();
        setSpokenStoryIsRecording(false);
        setSpokenStoryIsPaused(false);
        setSpokenStoryDuration(0);
        setSpokenStoryBlob(null);
        setSpokenStoryShowActions(false);
        setSpokenStoryShowPublishButton(false);
        setSpokenStoryPublishType('private');
    }, [stopSpokenStoryTimer]);

    // New requirement: "Publish as Private/Public" should only change publish type (no save)
    const handleSpokenStorySelectPublishType = useCallback((publishType) => {
        setSpokenStoryPublishType(publishType === 'public' ? 'public' : 'private');
    }, []);

    const executeSpokenStoryPublishMessage = useCallback(async () => {
        if (!auth?.user?.id) {
            router.visit(loginUrlForPublishMessage(), { replace: true });
            return;
        }

        if (!spokenStoryBlob) return;

        setSpokenStoryIsPublishing(true);
        try {
            let finalBlob = spokenStoryBlob;
            let finalExtension = getFileExtension(spokenStoryBlob.type);
            if (spokenStoryBlob && isWebAudioSupported() && needsConversion(spokenStoryBlob.type)) {
                try {
                    finalBlob = await convertToWav(spokenStoryBlob, spokenStoryBlob.type);
                    finalExtension = 'wav';
                } catch (e) {
                    finalBlob = spokenStoryBlob;
                    finalExtension = getFileExtension(spokenStoryBlob.type);
                }
            }

            const formData = new FormData();
            formData.append('userId', auth.user.id);
            formData.append('audio', finalBlob, `spoken-story.${finalExtension}`);
            formData.append('publish_type', spokenStoryPublishType);
            formData.append('duration', String(spokenStoryDurationRef.current ?? 0));
            formData.append('message', '');

            const response = await axios.post(route('spoken.recorder.store'), formData, {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });

            if (!response?.data?.status) {
                throw new Error(response?.data?.message || 'Failed to publish spoken story');
            }

            setSpokenStoryPublishedType(spokenStoryPublishType === 'public' ? 'public' : 'private');
            setSpokenStoryShowSuccess(true);
            if (spokenStoryResetTimerRef.current) {
                clearTimeout(spokenStoryResetTimerRef.current);
            }
            spokenStoryResetTimerRef.current = setTimeout(() => {
                setSpokenStoryShowSuccess(false);
                setSpokenStoryBlob(null);
                setSpokenStoryDuration(0);
                setSpokenStoryShowActions(false);
                setSpokenStoryShowPublishButton(false);
                setSpokenStoryPublishType('private');
            }, 3000);
        } catch (e) {
            console.error('Failed to publish Spoken Story:', e);
            alert(e?.response?.data?.message || e?.message || 'Failed to publish spoken story. Please try again.');
        } finally {
            setSpokenStoryIsPublishing(false);
        }
    }, [auth?.user?.id, router, spokenStoryBlob, spokenStoryPublishType]);

    // Actual submit happens only when user clicks "Publish Message"
    const handleSpokenStoryPublishMessage = useCallback(() => {
        if (!auth?.user?.id) {
            router.visit(loginUrlForPublishMessage(), { replace: true });
            return;
        }

        requestPublish(() => {
            void executeSpokenStoryPublishMessage();
        });
    }, [auth?.user?.id, router, requestPublish, executeSpokenStoryPublishMessage]);

    // Drive timer from state so it starts reliably on first record (not only after pause/resume)
    useEffect(() => {
        if (!isRecording || isRecordingPaused) {
            stopRecordingTimer();
            return;
        }
        startRecordingTimer();
        return () => stopRecordingTimer();
    }, [isRecording, isRecordingPaused, startRecordingTimer, stopRecordingTimer]);

    const handleAbortAnytimeClick = useCallback(() => {
        if (!mediaRecorder || !isRecording) {
            return;
        }

        if (mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
            setIsRecordingPaused(true);
            setAlertAnytime(true);
            return;
        }

        if (mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
            setIsRecordingPaused(false);
            setAlertAnytime(false);
        }
    }, [mediaRecorder, isRecording]);

    // Handle Message to The World Recording
    const handleRecordClick = useCallback(async () => {
        // Check if user is logged in
        if (!auth?.user?.id) {
            router.visit(loginUrlForPublishMessage(), { replace: true });
            return;
        }

        // Check if already recording - if so, stop it
        if (mediaRecorderRef.current && (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')) {
            mediaRecorderRef.current.stop();

            // Stop the timer
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
                recordingTimerRef.current = null;
                setRecordingTimer(null);
            }

            setIsRecording(false);
            setIsRecordingPaused(false);
            setAlertAnytime(false);
            return;
        }

        try {
            setAudioBlob(null);
            setShowPublishButton(false);
            setIsPrivateRecording(true);
            setPublishedMessageType('private');

            // Microphone access requires HTTPS (or localhost).
            if (typeof window !== 'undefined' && window.isSecureContext === false) {
                try {
                    if (window.location?.protocol === 'http:') {
                        const next = `https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`;
                        window.location.href = next;
                        return;
                    }
                } catch (_) { }
                alert('Microphone recording requires HTTPS. This site is currently opened on HTTP, so recording will not work. Please open using HTTPS (SSL) and try again.');
                return;
            }

            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100,
                }
            });

            // Get compatible MIME type
            const mimeType = getCompatibleMimeType();
            const options = mimeType ? { mimeType } : {};

            // Create MediaRecorder with compatible options
            const recorder = new MediaRecorder(stream, options);
            const audioChunks = [];

            console.log("MediaRecorder created with MIME type:", recorder.mimeType || 'default');

            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blobMimeType = recorder.mimeType || 'audio/webm';
                const blob = new Blob(audioChunks, { type: blobMimeType });

                if (discardRecordingOnStopRef.current) {
                    discardRecordingOnStopRef.current = false;
                } else {
                    setAudioBlob(blob);
                    setShowPublishButton(true);
                    setIsRecording(false);
                    setIsRecordingPaused(false);
                    setAlertAnytime(false);
                    stopRecordingTimer();
                    setMediaRecorder(null);
                    mediaRecorderRef.current = null;
                    if (pendingPublishAfterStopRef.current) {
                        pendingPublishAfterStopRef.current = false;
                        requestPublishRef.current?.(() => {
                            const publish = doPublishRef.current;
                            if (publish && auth?.user?.id) {
                                void publish(blob, recordingDurationRef.current, universalMessageRef.current, isPrivateRecordingRef.current, auth.user.id);
                            }
                        });
                    }
                }

                stream.getTracks().forEach(track => track.stop());
            };

            recorder.onerror = (e) => {
                console.error("MediaRecorder error:", e);
                alert("Recording error occurred. Please try again.");
            };

            recorder.start();
            setMediaRecorder(recorder);
            mediaRecorderRef.current = recorder;
            setRecordingDuration(0);
            setIsRecording(true);
            setIsRecordingPaused(false);
            setAlertAnytime(false);
            // Timer is started by useEffect when isRecording && !isRecordingPaused
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Unable to access microphone. Please grant permission and try again.');
        }
    }, [auth?.user?.id, router, isIOS, stopRecordingTimer]);

    const handleRecordClickMessageWorld = useCallback(async () => {
        setRecordingContext('message-world');
        await handleRecordClick();
    }, [handleRecordClick]);

    const handleRecordClickSpokenPanel = useCallback(async () => {
        setRecordingContext('spoken-panel');
        await handleRecordClick();
    }, [handleRecordClick]);

    const handleDeleteRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            discardRecordingOnStopRef.current = true;
            mediaRecorderRef.current.stop();
        }

        // Reset recording state
        setAudioBlob(null);
        setRecordingDuration(0);
        setShowPublishButton(false);
        setIsRecording(false);
        setIsRecordingPaused(false);
        setMediaRecorder(null);
        mediaRecorderRef.current = null;
        setIsPrivateRecording(true);
        setAlertAnytime(false);

        // Clear timer if it exists
        stopRecordingTimer();
    }, [stopRecordingTimer]);

    // Upload and reset; blob is optional (text-only allowed)
    const doPublish = useCallback(async (blob, duration, message, isPrivate, userId) => {
        if (!userId) return;
        setIsPublishing(true);
        try {
            let finalBlob = blob;
            let finalExtension = blob ? getFileExtension(blob.type) : null;
            if (blob && isWebAudioSupported() && needsConversion(blob.type)) {
                try {
                    finalBlob = await convertToWav(blob, blob.type);
                    finalExtension = 'wav';
                } catch (e) {
                    finalBlob = blob;
                    finalExtension = getFileExtension(blob.type);
                }
            }
            const formData = new FormData();
            formData.append('userId', userId);
            if (finalBlob && finalExtension) {
                formData.append('audio', finalBlob, `recording.${finalExtension}`);
            }
            formData.append('finalDurationRef_current', String(duration ?? 0));
            formData.append('message', (message && String(message).trim()) ? String(message).trim() : '');
            formData.append('publish_type', isPrivate ? 'private' : 'public');
            formData.append('recording_type', 'story');
            const response = await axios.post(route('user.recorder.store'), formData, {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (response.data?.status) {
                setPublishedMessageType(isPrivate ? 'private' : 'public');
                setShowSuccessMessage(true);

                setTimeout(() => {
                    setAudioBlob(null);
                    setUniversalMessage('');
                    setRecordingDuration(0);
                    setShowPublishButton(false);
                    setIsRecording(false);
                    setIsRecordingPaused(false);
                    setMediaRecorder(null);
                    mediaRecorderRef.current = null;
                    setIsPrivateRecording(false);
                    setAlertAnytime(false);
                    stopRecordingTimer();
                    setShowSuccessMessage(false);
                }, 3000);
                // setAudioBlob(null);
                // setUniversalMessage('');
                // setRecordingDuration(0);
                // setShowPublishButton(false);
                // setIsRecording(false);
                // setIsRecordingPaused(false);
                // setMediaRecorder(null);
                // mediaRecorderRef.current = null;
                // setIsPrivateRecording(true);
                // setAlertAnytime(false);
                // stopRecordingTimer();
                // setTimeout(() => setShowSuccessMessage(false), 5000);


            } else {
                throw new Error(response.data?.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error publishing message:', error);
            alert(error.response?.data?.message || 'Failed to upload audio. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    }, [stopRecordingTimer]);

    useEffect(() => {
        doPublishRef.current = doPublish;
    }, [doPublish]);

    const resolveBannerCardVideoSrc = useCallback((card) => {
        if (!card) return null;
        if (card.video) return card.video;

        const storyFromBannerSet = Array.isArray(bannerStories)
            ? bannerStories.find((story) => Number(story?.id) === Number(card?.storyId))
            : null;
        const storyFromId = memoizedStories?.find(
            (story) => Number(story?.id) === Number(card?.storyId)
        );
        const sourceStory =
            storyFromBannerSet ||
            storyFromId ||
            memoizedStories?.[0] ||
            null;

        return (
            sourceStory?.src
            || sourceStory?.master_url
            || sourceStory?.video_url
            || sourceStory?.video
            || null
        );
    }, [bannerStories, memoizedStories]);

    const warmBannerVideo = useCallback((bannerKey) => {
        const video = bannerVideoRefs.current.get(bannerKey);
        if (!video) return;
        try {
            video.preload = 'auto';
            if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
                video.load();
            }
        } catch (_) { /* ignore */ }
    }, []);

    const handleBannerWatchStory = useCallback((card, index) => {
        const src = resolveBannerCardVideoSrc(card);
        const clickedKey = card?.id ?? card?.storyId ?? index;

        if (inlineBannerPlayingId === clickedKey) {
            const current = bannerVideoRefs.current.get(clickedKey);
            try { current?.pause(); } catch (_) { /* ignore */ }
            setInlineBannerPlayingId(null);
            return;
        }

        if (!src) {
            return;
        }

        if (inlineBannerPlayingId != null && inlineBannerPlayingId !== clickedKey) {
            const previous = bannerVideoRefs.current.get(inlineBannerPlayingId);
            try { previous?.pause(); } catch (_) { /* ignore */ }
        }

        warmBannerVideo(clickedKey);
        setInlineBannerEndedByKey((prev) => ({ ...prev, [clickedKey]: false }));
        setInlineBannerPlayingId(clickedKey);
    }, [resolveBannerCardVideoSrc, inlineBannerPlayingId, warmBannerVideo]);

    // Preload banner story videos once the strip is near the viewport.
    useEffect(() => {
        const strip = bannerStripRef.current;
        if (!strip || bannerCards.length < 1) return undefined;

        const startPreload = () => {
            setBannerVideosPreload(true);
            bannerCards.forEach((card, index) => {
                const key = card?.id ?? card?.storyId ?? index;
                warmBannerVideo(key);
            });
        };

        if (typeof IntersectionObserver === 'undefined') {
            startPreload();
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    startPreload();
                    observer.disconnect();
                }
            },
            { rootMargin: '240px 0px', threshold: 0.01 }
        );
        observer.observe(strip);
        return () => observer.disconnect();
    }, [bannerCards, warmBannerVideo]);

    // Start playback on the already-mounted (preloaded) video element.
    useEffect(() => {
        if (inlineBannerPlayingId == null) return undefined;

        const video = bannerVideoRefs.current.get(inlineBannerPlayingId);
        if (!video) return undefined;

        const playVideo = () => {
            try {
                if (typeof window !== 'undefined') {
                    window.__homeInlineBannerPlaying = true;
                }
                video.play().catch(() => { /* autoplay policy / user gesture */ });
            } catch (_) { /* ignore */ }
        };

        if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
            playVideo();
            return undefined;
        }

        const onCanPlay = () => playVideo();
        video.addEventListener('canplay', onCanPlay, { once: true });
        try {
            video.preload = 'auto';
            video.load();
        } catch (_) { /* ignore */ }

        return () => video.removeEventListener('canplay', onCanPlay);
    }, [inlineBannerPlayingId]);

    const scrollToMessageWorld = useCallback(() => {
        const el = messageSectionRef.current;
        if (!el) return;
        try {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (_) {
            const top = el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
            window.scrollTo({ top: Math.max(0, top - 16), behavior: 'smooth' });
        }
    }, []);

    const getBannerEndCardSrc = useCallback((index) => {
        // User-provided end cards (2nd/3rd/4th screenshots) copied to public/img.
        const mapping = ['/img/banner-end-1.webp', '/img/banner-end-2.webp', '/img/banner-end-3.webp'];
        return mapping[index] || mapping[mapping.length - 1];
    }, []);

    // Mobile/global coordinator: whenever any <video> starts playing, stop all others.
    // This prevents overlapping audio from banner + community cards + any other videos.
    useEffect(() => {
        const onAnyVideoPlay = (e) => {
            const target = e?.target;
            if (!(target instanceof HTMLVideoElement)) return;

            // "Mobile viewport" rule (targeting all mobile devices)
            const isMobileViewport = typeof window !== 'undefined' && window.matchMedia
                ? window.matchMedia('(max-width: 991px)').matches
                : (typeof window !== 'undefined' ? window.innerWidth <= 991 : false);

            if (!isMobileViewport) return;

            try {
                const isBanner = target.classList?.contains('os-hero-beyond__banner-video');
                window.__homeInlineBannerPlaying = !!isBanner;
            } catch (_) { }

            try {
                document.querySelectorAll('video').forEach((v) => {
                    if (v === target) return;
                    try { v.pause(); } catch (_) { }
                    try { v.muted = true; } catch (_) { }
                });
            } catch (_) { }
        };

        // Capture so we run before other handlers.
        document.addEventListener('play', onAnyVideoPlay, true);
        return () => document.removeEventListener('play', onAnyVideoPlay, true);
    }, []);

    const executePublishMessage = useCallback(async () => {
        if (!auth?.user?.id) {
            router.visit(loginUrlForPublishMessage(), { replace: true });
            return;
        }

        const mr = mediaRecorderRef.current;
        const isActive = mr && (mr.state === 'recording' || mr.state === 'paused');
        if (audioBlob) {
            await doPublish(audioBlob, recordingDuration, universalMessage, isPrivateRecording, auth?.user?.id);
            return;
        }
        if (isActive) {
            pendingPublishAfterStopRef.current = true;
            mr.stop();
            return;
        }
        await doPublish(null, 0, universalMessage, isPrivateRecording, auth?.user?.id);
    }, [audioBlob, recordingDuration, universalMessage, isPrivateRecording, auth?.user?.id, doPublish, router]);

    const handlePublishMessage = useCallback(() => {
        if (!auth?.user?.id) {
            router.visit(loginUrlForPublishMessage(), { replace: true });
            return;
        }

        requestPublish(() => {
            void executePublishMessage();
        });
    }, [auth?.user?.id, requestPublish, executePublishMessage, router]);

    const executePublishWrittenMessage = useCallback(async () => {
        if (!auth?.user?.id) {
            router.visit(loginUrlForPublishMessage(), { replace: true });
            return;
        }

        const trimmed = String(universalMessage || '').trim();
        if (!trimmed) return;

        setIsPublishing(true);
        try {
            const response = await axios.post(
                route('written-messages.store'),
                {
                    message: trimmed,
                    publish_type: isPrivateRecording ? 'private' : 'public',
                },
                { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }
            );

            if (response?.data?.success) {
                const publishedType = isPrivateRecording ? 'private' : 'public';
                setWrittenPublishedType(publishedType);
                setWrittenShowSuccess(true);
                setUniversalMessage('');
                if (writtenResetTimerRef.current) {
                    clearTimeout(writtenResetTimerRef.current);
                }
                writtenResetTimerRef.current = setTimeout(() => {
                    setWrittenShowSuccess(false);
                }, 3000);
            } else {
                throw new Error(response?.data?.message || 'Failed to save message');
            }
        } catch (error) {
            console.error('Error publishing written message:', error);
            alert(error.response?.data?.message || 'Failed to publish message. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    }, [auth?.user?.id, router, universalMessage, isPrivateRecording]);

    const handlePublishWrittenMessage = useCallback(() => {
        if (!auth?.user?.id) {
            router.visit(loginUrlForPublishMessage(), { replace: true });
            return;
        }

        requestPublish(() => {
            void executePublishWrittenMessage();
        });
    }, [auth?.user?.id, router, requestPublish, executePublishWrittenMessage]);

    const handlePublishSpokenMessage = useCallback(async () => {
        // If user is not logged in, redirect to login instead of silently doing nothing.
        if (!auth?.user?.id) {
            router.visit(loginUrlForPublishMessage(), { replace: true });
            return;
        }

        const mr = mediaRecorderRef.current;
        const isActive = mr && (mr.state === 'recording' || mr.state === 'paused');
        if (audioBlob) {
            await doPublish(audioBlob, recordingDuration, '', isPrivateRecording, auth?.user?.id);
            return;
        }
        if (isActive) {
            pendingPublishAfterStopRef.current = true;
            mr.stop();
        }
    }, [audioBlob, recordingDuration, isPrivateRecording, auth?.user?.id, doPublish, router]);

    const renderMessageWorldCard = (item) => {
        return (
            <div className="main_os-message-world__card w-full">
                <div className="os-message-world__card">
                    <div className="os-message-world__avatar">
                        <img src={item.img} alt={item.name} loading="lazy" decoding="async" />
                    </div>
                    <div className="os-message-world__info">
                        <p className="os-message-world__name">{item.name}</p>
                    </div>
                </div>
                <p className="os-message-world__message">
                    "{item.message}"
                </p>
            </div>
        );
    };

    const messageTheWorldSection = (
        <section className="mt-4 mb-0 md:my-4 mx-auto w-full min-w-0 max-w-full">
            {/* Mobile: title → lead → strap. Desktop (≥992px): lead → title → strap (matches reference screenshots). */}
            <div className="os-message-world__heading-stack flex flex-col items-center w-full min-w-0">
                <div className="os-message-world__single-line order-1 min-[992px]:order-2 w-full">
                    <h2 className="os-message-world__title">My Message to the World</h2>
                </div>
                <div className="os-message-world__single-line order-2 min-[992px]:order-1 w-full">
                    <p className="os-message-world__subtitle os-message-world__subtitle--lead">Not Ready for a Full Story Yet? Start here!</p>
                </div>
                <div className="os-message-world__single-line order-3 w-full">
                    <p className="os-message-world__subtitle os-message-world__subtitle--strap">Real voices. Real wisdom. Real impact.</p>
                </div>
            </div>

            <div className="flex items-center justify-center p-1 max-[991px]:p-0">
                <div className="w-full max-w-3xl max-[991px]:max-w-full p-1 sm:p-6 max-[991px]:px-0 space-y-5">
                    <div className="flex flex-col items-center gap-1">
                        <button
                            type="button"
                            onClick={handleRecordClickMessageWorld}
                            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 ${(isRecording && recordingContext === 'message-world') ? 'bg-red-100 shadow-[0_0_0_8px_rgba(244,114,182,0.12)]' : 'bg-red-100 hover:scale-105'}`}
                        >
                            <div className={`bg-red-500 shadow-lg shadow-red-500/40 ${(isRecording && recordingContext === 'message-world') ? 'h-[12px] w-[12px] rounded-full' : 'h-[12px] w-[12px] rounded-full'}`}></div>
                        </button>

                        <div className="text-center">
                            <div className="text-[14px] font-medium text-black leading-tight">{(isRecording && recordingContext === 'message-world') ? 'Press to stop' : 'Record'}</div>
                            <div className="text-[11px] font-semibold leading-none text-black mt-1">
                                {((isRecording && recordingContext === 'message-world') || (recordingContext === 'message-world' && audioBlob)) ? formatTime(recordingDuration) : ''}
                            </div>
                        </div>
                    </div>


                    {showPublishButton && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">

                            {/* Delete */}
                            <div className="flex flex-col items-center text-center">
                                <button
                                    type="button"
                                    onClick={handleDeleteRecording}
                                    className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-[#e9e9e9] bg-[#f3f3f3] px-3 py-3 text-[15px] font-medium text-[#1f2937] shadow-sm hover:bg-[#ececec]"
                                >
                                    <RiDeleteBin6Line className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>

                            {/* Private */}
                            {/* <div className="flex flex-col items-center text-center">
                                <button
                                    type="button"
                                    onClick={() => setIsPrivateRecording(true)}
                                    className={`w-full inline-flex items-center justify-center gap-3 rounded-xl px-3 py-2 text-[15px] font-medium shadow-sm ${isPrivateRecording
                                        ? "bg-[linear-gradient(90deg,#e9b8f0_0%,#f2b36e_100%)] text-white"
                                        : "border border-[#e9e9e9] bg-white text-[#1f2937]"
                                        }`}
                                >
                                    <MdLock className="h-4 w-4" />
                                    Publish as Private
                                </button>

                                {isPrivateRecording && (
                                    <p className="text-[12px] font-medium text-[#7d6a9d] mt-2">
                                        Private recordings are stored in MySpace
                                    </p>
                                )}
                            </div> */}

                            <div className="flex flex-col items-center text-center">
                                <button
                                    type="button"
                                    onClick={() => setIsPrivateRecording(true)}
                                    className={`w-full inline-flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium shadow-sm ${isPrivateRecording
                                        ? "bg-[linear-gradient(90deg,#e9b8f0_0%,#f2b36e_100%)] text-white"
                                        : "border border-[#e9e9e9] bg-white text-[#1f2937]"
                                        }`}
                                >
                                    {/* 👇 Left side (icon + text) */}
                                    <div className="flex items-center gap-3">
                                        <MdLock className="h-4 w-4" />
                                        <span>Publish as Private</span>
                                    </div>

                                    {/* 👇 Right side (default text) */}
                                    <span className="text-[12px] font-normal opacity-80">
                                        (default)
                                    </span>

                                </button>

                                {isPrivateRecording && (
                                    <p className="text-[12px] font-medium text-[#7d6a9d] mt-2">
                                        Private recordings are stored in MySpace
                                    </p>
                                )}
                            </div>

                            {/* Public */}
                            <div className="flex flex-col items-center text-center">
                                <button
                                    type="button"
                                    onClick={() => setIsPrivateRecording(false)}
                                    className={`w-full inline-flex items-center justify-center gap-3 rounded-xl px-3 py-2 text-[15px] font-medium shadow-sm ${!isPrivateRecording
                                        ? "bg-[linear-gradient(90deg,#e9b8f0_0%,#f2b36e_100%)] text-white"
                                        : "border border-[#e9e9e9] bg-white text-[#1f2937]"
                                        }`}
                                >
                                    <GrShareOption className="h-4 w-4" />
                                    <div className="flex flex-col items-start leading-tight">
                                        <span>Publish as Public</span>
                                        <span className="text-[11px] font-normal opacity-80">
                                            (Requires profile photo)
                                        </span>
                                    </div>
                                </button>
                                {/* ✅ ALWAYS visible (no condition at all) */}
                                {/* <p className="text-[12px] text-gray-400 mt-1">
                                    (Requires profile photo)
                                </p> */}

                                {!isPrivateRecording && (
                                    <p className="text-[12px] font-medium text-[#7d6a9d] mt-2">
                                        {/* Publish for message */}
                                    </p>
                                )}
                            </div>

                        </div>


                    )}


                    {showSuccessMessage && (
                        <div className="mt-1  text-black rounded-xl flex justify-center items-center gap-2 animate-fade-in">
                            {/* <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg> */}
                            <span className="font-medium">
                                {publishedMessageType === 'private'
                                    ? 'Your private message was submitted successfully.'
                                    : 'Your public message was submitted successfully.'}
                            </span>
                        </div>
                    )}

                    <div>
                        <textarea
                            value={universalMessage}
                            onChange={(e) => setUniversalMessage(e.target.value)}
                            placeholder="Type your universal message"
                            className="w-full h-24 md:h-36 resize-none rounded-xl border border-[#c8a9ef] bg-transparent px-3 py-2 md:px-4 md:py-3 text-[13px] md:text-[15px] text-gray-700 placeholder:text-gray-400 focus:border-[#c8a9ef] focus:outline-none focus:ring-2 focus:ring-[#c8a9ef]/30"
                        />
                    </div>



                    {/* <p className="text-[12px] font-medium text-[#7d6a9d] mt-2 mb-2">
                    </p> */}

                    <button
                        onClick={handlePublishMessage}
                        disabled={
                            isPublishing ||
                            !(
                                // Enable when user typed something OR recorded audio exists
                                ((universalMessage && universalMessage.trim().length > 0) || !!audioBlob)
                            )
                        }
                        className="!mt-0 w-full rounded-xl bg-[#b596d8] py-2.5 text-[15px] font-semibold text-white shadow-md transition-colors duration-200 hover:bg-[#ab89d1] disabled:cursor-not-allowed disabled"
                    >
                        {isPublishing ? 'Publishing...' : 'Publish Message'}
                    </button>
                    {!userHasProfilePhoto ? (
                        <p className="mt-1 text-center text-[16px] font-bold text-[#1f1f1f]">
                            Add a Profile photo to share your message
                        </p>
                    ) : null}



                    {/* <p className="mt-1 text-center text-[16px] font-bold text-[#1f1f1f]">
                        Add a Profile photo to share youre message
                    </p> */}


                </div>
            </div>

            {/* Mobile: native horizontal scroll (md breakpoint and below uses this strip) */}
            <div className="w-full min-w-0 max-w-full md:hidden mt-2 px-0">
                <div
                    ref={messageMobileScrollerRef}
                    className="os-message-world__mobile-scroll flex min-w-0 gap-0 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory"
                    style={{
                        width: "100vw",
                        maxWidth: "100vw",
                        marginLeft: "calc(50% - 50vw)",
                        marginRight: "calc(50% - 50vw)",
                    }}
                    role="list"
                    aria-label="Community messages"
                >
                    {messages.map((item) => (
                        <div
                            key={item.id}
                            className="os-message-world__mobile-slide snap-center shrink-0 box-border"
                            style={{
                                width: "100vw",
                                flex: "0 0 100vw",
                                paddingLeft: 28,
                                paddingRight: 28,
                            }}
                            role="listitem"
                        >
                            {renderMessageWorldCard(item)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop (md+): smooth slide carousel with arrows */}
            <div
                className="os-message-world__container relative mt-2 hidden md:block"
                onWheel={handleMessageWheel}
                onTouchStart={handleMessageTouchStart}
                onTouchEnd={handleMessageTouchEnd}
            >
                <button
                    type="button"
                    onClick={prevMessagePage}
                    className="absolute left-3 md:left-4 top-1/2 z-30 -translate-y-1/2 text-black transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous messages"
                    disabled={messages.length <= visibleMessageCards}
                >
                    <FaChevronLeft className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={nextMessagePage}
                    className="absolute right-3 md:right-4 top-1/2 z-30 -translate-y-1/2 text-black transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Next messages"
                    disabled={messages.length <= visibleMessageCards}
                >
                    <FaChevronRight className="h-5 w-5" />
                </button>
                <div className="overflow-hidden">
                    <div
                        className={`flex ${isMessageAnimating ? 'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]' : ''}`}
                        style={{
                            transform: `translateX(-${messageSlideIndex * (100 / visibleMessageCards)}%)`,
                            willChange: 'transform',
                        }}
                        onTransitionEnd={handleMessageTrackTransitionEnd}
                    >
                        {loopedMessageItems.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className="shrink-0 px-1.5 box-border"
                                style={{
                                    flex: `0 0 ${100 / visibleMessageCards}%`,
                                    maxWidth: `${100 / visibleMessageCards}%`,
                                }}
                            >
                                {renderMessageWorldCard(item)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <>
            <Head title="Home" />
            {
                uiState.showPreloader ? (
                    <Preloader onStart={handleStart} />
                ) : (
                    <GuestLayout displayMenu={true} addContainer={false}>

                        <section className="home-top-band">
                            <div className="os-container">
                                <div className="os-story__content addmore-css os-hero-beyond">
                                    <div className="os-hero-beyond__card !px-0">
                                        <div className="os-hero-beyond__header hidden">
                                            <h2
                                                className="os-hero-beyond__title os-hero-beyond__strapline text-center font-bold max-[991px]:whitespace-normal max-[991px]:px-2 max-[991px]:text-balance min-[992px]:whitespace-nowrap leading-[1.15] tracking-tight text-[clamp(0.82rem,4.1vw,1.45rem)] min-[992px]:text-[40px] xl:text-[48px] px-0"
                                            >
                                                Authentic Personal Stories Beyond the Feed
                                            </h2>
                                        </div>
                                        <div className="os-hero-beyond__image-wrap">
                                            <div className="os-hero-beyond__image">
                                                <img src={heroReference} alt="Hero story visual" className="os-hero-beyond__img" fetchPriority="high" decoding="async" />
                                                <div className="os-hero-beyond__overlay-copy">
                                                    <h2 className="os-hero-beyond__overlay-title">
                                                        <span className="os-hero-beyond__overlay-title-desktop">
                                                            Authentic Personal Stories Beyond the Feed
                                                        </span>
                                                        <span className="os-hero-beyond__overlay-title-mobile">Authentic Personal Stories</span>
                                                        <span className="os-hero-beyond__overlay-title-mobile">Beyond the Feed</span>
                                                    </h2>
                                                    <p className="os-hero-beyond__overlay-subtitle">
                                                        Share The Stories You Usually Keep To Yourself: Privately Or Publicly
                                                    </p>
                                                    <p className="os-hero-beyond__overlay-subtitle">
                                                        <span className="text-[#FFDA79]">Private By Default.</span> You Choose What The World Sees
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            ref={bannerStripRef}
                                            className={`os-hero-beyond__banner-strip ${modalState.show && modalState.type === 'video' ? 'is-modal-open' : ''}`}
                                            aria-label="Featured stories"
                                        >
                                            {bannerCards.map((card, index) => {
                                                const bannerKey = card?.id ?? card?.storyId ?? index;
                                                const bannerVideoSrc = resolveBannerCardVideoSrc(card);
                                                const isThisPlaying = inlineBannerPlayingId === bannerKey;
                                                const showEndCard = !!inlineBannerEndedByKey?.[bannerKey];
                                                const isFocusedBanner =
                                                    bannerCards.length === 1 ||
                                                    (bannerCards.length >= 2 && index === bannerFocusIndex);
                                                return (
                                                    <div
                                                        key={card.id}
                                                        className={`os-hero-beyond__banner-card${isFocusedBanner ? ' os-hero-beyond__banner-card--middle' : ''}${isThisPlaying ? ' is-playing' : ''}`}
                                                    >
                                                        {(card.author?.name || card.category) && (
                                                            <div
                                                                className="os-hero-beyond__banner-meta"
                                                                aria-label={`${card.author?.name || 'Storyteller'}${card.category ? `, ${card.category}` : ''}`}
                                                            >
                                                                {card.author?.avatar ? (
                                                                    <img
                                                                        src={card.author.avatar}
                                                                        alt=""
                                                                        className="os-hero-beyond__banner-meta__avatar"
                                                                        width={50}
                                                                        height={50}
                                                                        loading="lazy"
                                                                        decoding="async"
                                                                        onError={(e) => {
                                                                            e.currentTarget.src = '/img/avatar.png';
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                <div className="os-hero-beyond__banner-meta__info">
                                                                    {card.author?.name ? (
                                                                        <span className="os-hero-beyond__banner-meta__name">
                                                                            {card.author.name}
                                                                        </span>
                                                                    ) : null}
                                                                    {card.category ? (
                                                                        <span className="os-hero-beyond__banner-meta__category">
                                                                            {card.category}
                                                                        </span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {bannerVideoSrc ? (
                                                            <div className="os-hero-beyond__banner-video-wrap">
                                                                <video
                                                                    ref={(el) => {
                                                                        if (el) {
                                                                            bannerVideoRefs.current.set(bannerKey, el);
                                                                        } else {
                                                                            bannerVideoRefs.current.delete(bannerKey);
                                                                        }
                                                                    }}
                                                                    className="os-hero-beyond__banner-video"
                                                                    src={bannerVideoSrc}
                                                                    poster={card.poster}
                                                                    playsInline
                                                                    controls={isThisPlaying}
                                                                    preload={bannerVideosPreload ? 'auto' : 'metadata'}
                                                                    aria-hidden={!isThisPlaying}
                                                                    aria-label={isThisPlaying ? `Playing ${card.alt}` : undefined}
                                                                    tabIndex={isThisPlaying ? 0 : -1}
                                                                    onPlay={() => {
                                                                        if (typeof window !== 'undefined') {
                                                                            window.__homeInlineBannerPlaying = true;
                                                                        }
                                                                    }}
                                                                    onEnded={() => {
                                                                        setInlineBannerEndedByKey((prev) => ({ ...prev, [bannerKey]: true }));
                                                                    }}
                                                                />
                                                                {isThisPlaying && showEndCard && (
                                                                    <div className="os-hero-beyond__banner-endcard" role="group" aria-label="Continue to My Message to the World">
                                                                        <img
                                                                            src={getBannerEndCardSrc(index)}
                                                                            alt="Continue to My Message to the World"
                                                                            className="os-hero-beyond__banner-endcard-img"
                                                                            loading="lazy"
                                                                            decoding="async"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            className="os-hero-beyond__banner-endcard-btn"
                                                                            onClick={() => {
                                                                                const current = bannerVideoRefs.current.get(bannerKey);
                                                                                try { current?.pause(); } catch (_) { /* ignore */ }
                                                                                setInlineBannerPlayingId(null);
                                                                                scrollToMessageWorld();
                                                                            }}
                                                                        >
                                                                            Click Here
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : null}
                                                        {!isThisPlaying && (
                                                            <>
                                                                <img
                                                                    src={card.poster}
                                                                    alt={card.alt}
                                                                    className="os-hero-beyond__banner-poster"
                                                                    loading={index === bannerFocusIndex ? 'eager' : 'lazy'}
                                                                    decoding="async"
                                                                />
                                                                <div className="os-hero-beyond__banner-card__shade" aria-hidden="true" />
                                                                <button
                                                                    type="button"
                                                                    className="os-hero-beyond__banner-watch"
                                                                    onPointerEnter={() => warmBannerVideo(bannerKey)}
                                                                    onFocus={() => warmBannerVideo(bannerKey)}
                                                                    onClick={() => handleBannerWatchStory(card, index)}
                                                                    aria-label={`Watch story: ${card.alt}`}
                                                                >
                                                                    Watch Story
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {!auth?.user?.id && (
                                            <div className="os-hero-beyond__signup-slot">
                                                <Link href={route('register')}>
                                                    <a className="os-hero-beyond__cta-btn os-hero-beyond__cta-btn--primary signup-btn-larger">
                                                        Sign Up
                                                    </a>
                                                </Link>
                                            </div>
                                        )}

                                        {/* Footer outside image-wrap so copy uses full card width (image-wrap is max 60%/75%) */}
                                        <div className="os-hero-beyond__footer hidden w-full px-3 sm:px-6 md:px-8">
                                            <p className="os-hero-beyond__subtitle os-hero-beyond__footer-copy font-semibold text-gray-700 text-[clamp(1.2rem,2.5vw,1.45rem)] leading-[1.2] mx-auto text-center w-full">

                                                {/* Mobile/tablet (under 992px): exactly two lines — nowrap + vw clamp so both fit on SE/13 */}
                                                <span className="os-hero-beyond__footer-line-mobile block min-[992px]:hidden whitespace-nowrap text-center tracking-tight leading-tight px-1 text-gray-700">
                                                    Share The Stories You Usually Keep To Yourself
                                                </span>
                                                <span className="os-hero-beyond__footer-line-mobile block min-[992px]:hidden whitespace-nowrap text-center font-semibold leading-tight tracking-tight mt-1 px-1">
                                                    <span className="text-[#FFDA79]">Private By Default.</span>
                                                    <span className="text-gray-700"> You Choose What The World Sees</span>
                                                </span>
                                                <span className="hidden min-[992px]:block whitespace-nowrap">
                                                    Share The Stories You Usually Keep To Yourself: Privately Or Publicly
                                                </span>
                                                <span className="hidden min-[992px]:block whitespace-nowrap mt-1">
                                                    <span className="text-[#FFDA79]">Private By Default.</span> You Choose What The World Sees
                                                </span>

                                            </p>
                                        </div>

                                        <div className="mt-2 flex w-full flex-col items-center justify-center px-3 sm:px-6">
                                            <h3 className="mt-4 font-bold max-[991px]:!font-bold text-[clamp(10px,4.3vw,36px)] text-black leading-tight text-center whitespace-normal max-[991px]:px-3 max-[991px]:text-balance min-[992px]:whitespace-nowrap">
                                                Real Stories From Our Community
                                            </h3>
                                            <p className="mt-1 text-center font-semibold text-[clamp(18px,4vw,28px)] leading-tight text-black">
                                                Visual stories
                                            </p>
                                        </div>
                                        <div className="os-hero-beyond__carousel-wrap">
                                            {uiState.focusedId === null ? (
                                                <Carousel
                                                    items={communityStories}
                                                    disableAutoScroll={true}
                                                    sliderRef={sliderRef}
                                                    isAutoplay={isAutoplay}
                                                    setIsAutoplay={setIsAutoplay}
                                                    currentSlide={currentSlide}
                                                    isAppleDevice={isAppleDevice}
                                                    setCurrentSlide={setCurrentSlide}
                                                    isFocusedMode={uiState.focusedId}
                                                >
                                                    {(item, index) => (
                                                        isDesktop ? (
                                                            <Story
                                                                key={item.id}
                                                                item={item}
                                                                displayGift={true}
                                                                index={index}
                                                                currentSlide={currentSlide}
                                                                isActive={item.id === uiState.activeVideoId}
                                                                onActivate={() => setUiState(prev => ({ ...prev, activeVideoId: item.id }))}
                                                                onActivateFocus={() => handleActivateFocus(item.id)}
                                                                onOpenGiftModal={() => openModal(item, "gift", item.author)}
                                                                onOpenVideoModal={() => openModal(item, "video", item.author)}
                                                                onOpenShareModal={() => openModal(item.id, "share")}
                                                                onConnect={handleConnectToStoryTeller}
                                                            />
                                                        ) : (
                                                            <StoryAppleMobile
                                                                key={item.id}
                                                                item={item}
                                                                displayGift={true}
                                                                index={index}
                                                                isMobile={true}
                                                                currentSlide={currentSlide}
                                                                isActive={item.id === uiState.activeVideoId}
                                                                onActivate={() => setUiState(prev => ({ ...prev, activeVideoId: item.id }))}
                                                                onActivateFocus={() => handleActivateFocus(item.id)}
                                                                onOpenGiftModal={() => openModal(item, "gift", item.author)}
                                                                onOpenVideoModal={() => openModal(item, "video", item.author)}
                                                                onOpenShareModal={() => openModal(item.id, "share")}
                                                                onConnect={handleConnectToStoryTeller}
                                                            />
                                                        )
                                                    )}
                                                </Carousel>
                                            ) : (
                                                <Suspense fallback={<div>Loading...</div>}>
                                                    <FocusedStoryOverlay
                                                        stories={communityStories}
                                                        focusedId={uiState.focusedId}
                                                        displayGift={true}
                                                        onClose={handleCloseFocus}
                                                        onOpenGiftModal={openModal}
                                                        onOpenVideoModal={openModal}
                                                        onOpenShareModal={openModal}
                                                        onConnect={handleConnectToStoryTeller}
                                                    />
                                                </Suspense>
                                            )}
                                        </div>
                                        {/* <div className="stories-text">
                                        <p>Welcome to a new kind of social network. One where your story is the spotlight and your</p>
                                        <p>voice is celebrated. Here you&apos;re free to be real, to share your truth, and to recognize the</p>
                                        <p> beauty of your unique path. No judgment. No noise. Just meaningful connections, a </p>
                                        <p>community that lifts you up.</p>
                                    </div> */}

                                        <div className="stories-text">
                                            <p>
                                                OneStoryPlanet is built for the moments people usually keep to themselves. Here, you
                                                don&apos;t have to perform, polish, or pretend. You can share what actually matters to you, at
                                                your pace, in your voice, with people who are here to listen.
                                            </p>
                                        </div>

                                        <div className="os-hero-beyond__cta-wrap mt-2 w-full px-0 flex flex-wrap items-center justify-center gap-3">
                                            <Link href={route('stories.allStories')}>
                                                <a className="os-hero-beyond__cta-btn os-hero-beyond__cta-btn--secondary">All Stories</a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {modalState.show && modalState.type === 'video' && (
                            <Suspense fallback={<div>Loading...</div>}>
                                {(() => {
                                    const videoModalItem = modalState?.data?.item ?? modalState?.data;
                                    const isBannerVideoModal = !!videoModalItem?.isBannerCard;
                                    const videoModalNode = (
                                        <CommentModal
                                            item={videoModalItem}
                                            gifts={gifts}
                                            user={user}
                                            modalData={videoModalItem}
                                            activeCardIndex={uiState.activeCardIndex}
                                            handleGiftClick={() => openModal(videoModalItem, "gift", videoModalItem?.author)}
                                            sendGift={null}
                                            error={walletState.error}
                                            setError={(error) => setWalletState(prev => ({ ...prev, error }))}
                                            loading={walletState.loading}
                                            validationCode={""}
                                            setValidationCode={() => { }}
                                            openModal={openModal}
                                            closeModal={closeModal}
                                            serverError={""}
                                            open={modalState.show}
                                        />
                                    );

                                    // Apply mobile MUI wrapper only for banner-card video popups.
                                    return (!isDesktop && isBannerVideoModal) ? (
                                        <MuiModal className="desktopmodal" open={modalState.show} onClose={closeModal}>
                                            <div>{videoModalNode}</div>
                                        </MuiModal>
                                    ) : (
                                        videoModalNode
                                    );
                                })()}
                            </Suspense>
                        )}

                        {/* Mobile banner cards now play inline (no modal). */}

                        {modalState.show && modalState.type !== 'video' && (
                            <Modal
                                show={modalState.show}
                                onClose={closeModal}
                                maxWidth={modalState.type === 'share' ? 'lg' : modalState.type === 'create-our-story' ? 'md' : 'xl'}
                                className={
                                    `modal__panel${modalState.type === 'competition'
                                        ? '--competition p-0 rounded-[2.5rem]'
                                        : modalState.type === 'share'
                                            ? '--deposit'
                                            : modalState.type === 'create-our-story'
                                                ? '--create-our-story'
                                                : ''
                                    }`
                                }
                            >
                                <Suspense fallback={<div>Loading...</div>}>
                                    <ModalContent
                                        modalType={modalState.type}
                                        modalData={modalState.data}
                                        gifts={gifts}
                                        user={user}
                                        activeCardIndex={uiState.activeCardIndex}
                                        handleGiftClick={handleGiftClick}
                                        error={walletState.error}
                                        openModal={openModal}
                                        loading={walletState.loading}
                                        closeModal={closeModal}
                                        activeDepositCard={uiState.activeDepositCard}
                                        handleDepositCardClick={(card) => setUiState(prev => ({ ...prev, activeDepositCard: card }))}
                                        customAmount={uiState.customAmount}
                                        setCustomAmount={(amount) => setUiState(prev => ({ ...prev, customAmount: amount }))}
                                        setLoading={(loading) => setWalletState(prev => ({ ...prev, loading }))}
                                        setWallet={(wallet) => setWalletState(prev => ({ ...prev, wallet }))}
                                        setError={(error) => setWalletState(prev => ({ ...prev, error }))}
                                        setRefillSuccess={(success) => setWalletState(prev => ({ ...prev, refillSuccess: success }))}
                                        onCreateStory={() => {
                                            closeModal();
                                            handleToOpenVideoEditor();
                                        }}
                                        refillSuccess={walletState.refillSuccess}
                                        onStoryShareRecorded={onStoryShareRecorded}
                                    />
                                </Suspense>
                            </Modal>
                        )}

                        {/* homepage_audioSection START */}

                        {/* {audioRecording && (
                            <div className="addmore-css w-full homepage_audioSection" >
                                <div className="w-full flex items-center justify-center  pt-4 pb-8">
                                    <div className="w-full max-w-xl px-4">
                                    
                                        <h2 className="text-center text-2xl font-bold text-black mb-6">
                                            Today I am feeling...
                                        </h2>

                                     
                                        <div className="bg-white rounded-xl p-3 shadow md:p-5 border-2 border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                            <div className="flex items-center gap-4 md:flex-row flex-col">
                                              
                                                 <div className="flex-shrink-0 border-[3px] border-[#d99cfb] rounded-full">
                                                                <img
                                                                    src={audioRecording.user?.avatar || "https://i.pravatar.cc/100?img=32"}
                                                                    alt={audioRecording.user?.name || "User"}
                                                                    className="w-[4.9rem] h-[4.9rem] rounded-full object-cover border-3 border-purple-200 shadow-md"
                                                                />
                                                            </div> 

                                         
                                                <div className="w-[80%] min-w-0 mx-auto">
                                                    <div className="w-full max-w-3xl p-6 space-y-5">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={handleRecordClickMessageWorld}
                                                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${(isRecording && recordingContext === 'message-world') ? 'bg-red-100 shadow-[0_0_0_8px_rgba(254,226,226,0.9)]' : 'bg-red-100 hover:scale-105'}`}
                                                            >
                                                                <div className={`bg-red-500 shadow-lg shadow-red-500/40 ${(isRecording && recordingContext === 'message-world') ? 'w-4 h-4 rounded-[4px]' : 'w-4 h-4 rounded-full'}`}></div>
                                                            </button>
                                                            <div className="text-center">
                                                                <p className="text-[26px] font-semibold leading-none text-[#4b5563] tracking-[0.04em]">
                                                                    {((isRecording && recordingContext === 'message-world') || (recordingContext === 'message-world' && audioBlob)) ? formatTime(recordingDuration) : ''}
                                                                </p>
                                                                <p className="text-[30px] font-medium text-[#7b7b7b] leading-tight">
                                                                    Record
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <textarea
                                                                value={universalMessage}
                                                                onChange={(e) => setUniversalMessage(e.target.value)}
                                                                placeholder="Type your universal masage"
                                                                className="w-full h-32 resize-none rounded-2xl border border-[#cba8ef] focus:outline-none focus:ring-2 focus:ring-[#cba8ef] focus:border-[#cba8ef] px-4 py-3 text-[15px] text-gray-700 placeholder:text-gray-400 bg-transparent"
                                                            />
                                                        </div>

                                                        {showPublishButton && (
                                                            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                                                <button
                                                                    type="button"
                                                                    onClick={handleDeleteRecording}
                                                                    className="inline-flex items-center gap-3 rounded-2xl border border-[#ececec] bg-[#f4f4f4]  px-3 py-2 text-[15px] font-medium text-[#1f2937] shadow-sm transition hover:bg-[#ededed]"
                                                                >
                                                                    <FaTrash className="h-4 w-4 text-[#1f2937]" />
                                                                    <span>Delete</span>
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => setIsPrivateRecording(true)}
                                                                    className={`inline-flex items-center gap-3 rounded-2xl  px-3 py-2 text-[15px] font-medium shadow-sm transition ${isPrivateRecording ? 'bg-[linear-gradient(90deg,#e8b1f1_0%,#f3b36a_100%)] text-white' : 'border border-[#ececec] bg-white text-[#1f2937] hover:bg-[#f9f9f9]'}`}
                                                                >
                                                                    <MdLock className={`h-4 w-4 ${isPrivateRecording ? 'text-white' : 'text-[#6b7280]'}`} />
                                                                    <span>Publish as Private</span>
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => setIsPrivateRecording(false)}
                                                                    className={`inline-flex items-center gap-3 rounded-2xl  px-3 py-2 text-[15px] font-medium shadow-sm transition ${!isPrivateRecording ? 'bg-[linear-gradient(90deg,#8fd3f4_0%,#84fab0_100%)] text-white' : 'border border-[#ececec] bg-white text-[#1f2937] hover:bg-[#f9f9f9]'}`}
                                                                >
                                                                    <FaPaperPlane className={`h-4 w-4 ${!isPrivateRecording ? 'text-white' : 'text-[#6b7280]'}`} />
                                                                    <span>Publish as Public</span>
                                                                    <span className={`text-[12px] ${!isPrivateRecording ? 'text-white/90' : 'text-[#9ca3af]'}`}>(default)</span>
                                                                </button>
                                                            </div>
                                                        )}

                                                        <p className="text-[12px] font-medium text-[#7d6a9d] mt-2 mb-2">
                                                            Public messages are reviewed before publishing
                                                        </p>

                                                        <button
                                                            onClick={handlePublishWrittenMessage}
                                                            disabled={
                                                                isPublishing ||
                                                                !(
                                                                    (universalMessage && universalMessage.trim().length > 0)
                                                                )
                                                            }
                                                            className="w-full rounded-2xl bg-[#b795d9] hover:bg-[#a886cf] text-white text-[17px] font-semibold py-4 shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isPublishing ? 'Publishing...' : 'Publish Message'}
                                                        </button>
                                                onClick={() => setActiveStoryIndex(index)}
                                                className={`group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${index === activeStoryIndex
                                                    ? "border-4 border-[#b89adf]"
                                                    : "border border-gray-200"
                                                    }`}
                                            >
                                                <div className="h-40 overflow-hidden">
                                                    <img
                                                        src={story.image}
                                                        alt={story.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>

                                                <div className="p-5 text-left">
                                                    <h3 className="font-bold text-black">
                                                        {story.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        {story.desc}
                                                    </p>

                                 
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                

                                <div className="  flex items-center justify-center p-4">
                                    <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-6 md:p-10">
                                        
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex items-center gap-2 text-[#9b7bd3] font-medium">
                                                <FaRegCommentDots />
                                                <span className="text-black font-bold">Share your voice</span>
                                            </div>

                                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2ea3d6] hover:bg-[#2593c2] transition-colors shadow-md">
                                                <FaMicrophone className="w-4 h-4 text-white" />
                                            </button>
                                        </div>

                                       
                                        <div className="mt-6">
                                            <div className="relative">
                                                <FaRegCommentDots className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c5aee8]" />
                                                <input
                                                    type="text"
                                                    placeholder="Type..."
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c5aee8] focus:border-[#c5aee8] text-gray-700 bg-[#faf8fc]"
                                                />
                                            </div>
                                        </div>

                                    
                                        <button className="mt-4 w-full flex items-center justify-center gap-3 bg-[#f2cd57] hover:bg-[#e6be45] transition-colors text-black font-medium py-2 rounded-xl shadow-md">
                                            <FaPaperPlane />
                                            Share Your Thoughts
                                        </button>
                                    </div>
                                </div>
                            </section> */}
                        {/* </div> */}




                        {/* homepage_audioSection END */}

                        <div ref={messageSectionRef} className="os-container home-message-world-section min-w-0 max-w-full">
                            <div className="os-story__content addmore-css os-hero-beyond min-w-0 w-full max-w-full">
                                {messageTheWorldSection}
                            </div>
                        </div>

                        <section className="voice-transform-section">
                            <div className="voice-transform-section__container">
                                <h2 className="voice-transform-section__heading">This week&apos;s message to the world</h2>

                                {/* Hidden audio element for the featured wave-style player (Fancee). */}
                                <audio
                                    ref={weeklySpokenAudioRef}
                                    src={WEEKLY_SPOKEN_STORY_SRC}
                                    preload="metadata"
                                    style={{ display: "none" }}
                                />

                                <div className="voice-transform-featured">
                                    <div className="voice-transform-featured__head">
                                        <div className="voice-transform-featured__avatar">
                                            <img src={dustie} alt="Dustie Cahoon" />
                                        </div>
                                        <p className="voice-transform-featured__name">Dustie Cahoon</p>
                                    </div>
                                    <p className="voice-transform-featured__text">
                                        Never stop loving. It's the only thing that matters in life. Nothing you have , you keep, except love. Love is the only thing you can hold onto forever
                                    </p>
                                </div>

                                <div className="voice-transform-grid">
                                    <div className="voice-transform-panel">
                                        <div className="voice-transform-panel__title-row">
                                            <span className="voice-transform-panel__icon voice-transform-panel__icon--written">
                                                <IoDocumentTextOutline />
                                            </span>
                                            <div>
                                                <h3 className="voice-transform-panel__title">Written Stories</h3>
                                                <p className="voice-transform-panel__subtitle">Thoughts and lived experiences, captured  <br className="block md:hidden" />
                                                    in words</p>
                                            </div>
                                        </div>

                                        <textarea
                                            value={universalMessage}
                                            onChange={(e) => setUniversalMessage(e.target.value)}
                                            placeholder="Type your universal message"
                                            className="voice-transform-panel__textarea"
                                        />

                                        {writtenShowSuccess && (
                                            <div className="mt-2 flex items-center justify-center">
                                                <span className="text-black font-medium animate-fade-in">
                                                    {writtenPublishedType === 'private'
                                                        ? 'Your Written Storie private message was submitted successfully.'
                                                        : 'Your Written Storie public message was submitted successfully.'}
                                                </span>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handlePublishWrittenMessage}
                                            className="voice-transform-panel__publish-btn"
                                            disabled={isPublishing || !universalMessage.trim()}
                                        >
                                            {isPublishing ? 'Publishing...' : 'Publish Message'}
                                        </button>

                                        {!userHasProfilePhoto ? (
                                            <p className="voice-transform-panel__helper text-[16px] font-bold md:font-normal">
                                                Add a profile photo to share your message
                                            </p>
                                        ) : null}

                                    </div>

                                    <div className="voice-transform-panel flex flex-col">
                                        <div className="voice-transform-panel__title-row">
                                            <span className="voice-transform-panel__icon voice-transform-panel__icon--spoken">
                                                <FaMicrophone />
                                            </span>
                                            <div>
                                                <h3 className="voice-transform-panel__title">Spoken Stories</h3>
                                                <p className="voice-transform-panel__subtitle">
                                                    Real moments, told by the people who lived
                                                    <br className="block md:hidden" />
                                                    them.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Old Spoken Stories recorder UI removed (keeps existing functionality untouched elsewhere) */}

                                        {/* Enable mic prompt (shows before first recording) */}
                                        {auth?.user?.id && spokenMicStatus !== 'granted' && showMicPermissionBox && (
                                            <div className="mt-4 w-full flex items-center justify-center">
                                                <div className="w-full rounded-[18px] bg-[#bda4dd] px-5 py-4 text-center">
                                                    <div className="text-[14px] font-semibold text-white">
                                                        {spokenMicStatus === 'denied'
                                                            ? 'Microphone permission is blocked'
                                                            : spokenMicStatus === 'unsupported'
                                                                ? 'Microphone not supported'
                                                                : 'Please enable your microphone'}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={requestSpokenMicPermission}
                                                        disabled={spokenMicStatus === 'unsupported'}
                                                        className="mt-3 inline-flex items-center justify-center rounded-full bg-[#f2cd57] px-10 py-2 text-[14px] font-semibold text-black shadow-sm hover:bg-[#e6be45] disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        Allow
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* New: isolated Spoken Stories recorder + action buttons (no changes to existing handlers) */}
                                        <div className="mt-4 flex flex-col items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleSpokenStoryRecording}
                                                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 ${spokenStoryIsRecording ? 'bg-red-100 shadow-[0_0_0_8px_rgba(244,114,182,0.12)]' : 'bg-red-100 hover:scale-105'}`}
                                                aria-label={spokenStoryIsRecording ? 'Stop recording' : 'Start recording'}
                                            >
                                                <div className="bg-red-500 shadow-lg shadow-red-500/40 h-[12px] w-[12px] rounded-full"></div>
                                            </button>

                                            <div className="text-center">
                                                <div className="text-[14px] font-medium text-black leading-tight">
                                                    {spokenStoryIsRecording ? 'Press to stop' : 'Record'}
                                                </div>
                                                <div className="text-[11px] font-semibold leading-none text-black mt-1">
                                                    {(spokenStoryIsRecording || spokenStoryBlob) ? formatTime(spokenStoryDuration) : ''}
                                                </div>
                                            </div>
                                        </div>

                                        {spokenStoryShowActions && (
                                            <div className="mt-6 w-full flex flex-col md:flex-row md:flex-wrap md:items-start gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleSpokenStoryDeleteRecording}
                                                    className="min-w-0 w-full md:flex-1 h-[56px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#e9e9e9] bg-[#f3f3f3] px-3 sm:px-4 text-[13px] sm:text-[14px] md:text-[15px] font-medium text-[#1f2937] shadow-sm hover:bg-[#ececec]"
                                                    disabled={spokenStoryIsPublishing}
                                                >
                                                    <RiDeleteBin6Line className="h-4 w-4 shrink-0" />
                                                    <span>Delete</span>
                                                </button>

                                                <div className="min-w-0 w-full md:flex-1 flex flex-col items-center text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSpokenStorySelectPublishType('private')}
                                                        className={`min-w-0 w-full min-h-[56px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#e9e9e9] px-3 sm:px-4 py-2 text-[13px] sm:text-[14px] md:text-[15px] font-medium shadow-sm hover:opacity-95 ${spokenStoryPublishType === 'private'
                                                            ? 'bg-[linear-gradient(90deg,#c084fc_0%,#f9a8d4_100%)] text-white'
                                                            : 'bg-white text-[#111827]'
                                                            }`}
                                                        disabled={spokenStoryIsPublishing}
                                                    >
                                                        <span className="w-full inline-flex items-center justify-between gap-3">
                                                            <span className="inline-flex items-center gap-2 min-w-0">
                                                                <MdLock className="h-4 w-4 shrink-0" />
                                                                <span className="whitespace-nowrap">Publish as Private</span>
                                                            </span>
                                                            <span className="text-[11px] opacity-90 whitespace-nowrap">(default)</span>
                                                        </span>
                                                    </button>
                                                    <div className="text-[12px] text-[#7c3aed] mt-1 leading-tight">
                                                        Private recordings are stored in MySpace
                                                    </div>
                                                </div>

                                                <div className="min-w-0 w-full md:flex-1 flex flex-col items-center text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSpokenStorySelectPublishType('public')}
                                                        className={`min-w-0 w-full min-h-[56px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#e9e9e9] px-3 sm:px-4 py-2 text-[13px] sm:text-[14px] md:text-[15px] font-medium shadow-sm hover:bg-[#fafafa] ${spokenStoryPublishType === 'public'
                                                            ? 'bg-[#111827] text-white'
                                                            : 'bg-white text-[#111827]'
                                                            }`}
                                                        disabled={spokenStoryIsPublishing}
                                                    >
                                                        <GrShareOption className="h-4 w-4 shrink-0" />
                                                        <span className="whitespace-nowrap">Publish as Public</span>
                                                    </button>
                                                    <div className="text-[12px] text-[#6b7280] mt-1 leading-tight">
                                                        (Requires profile photo)
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {spokenStoryShowSuccess && (
                                            <div className="mt-4 flex items-center justify-center">
                                                <div className="text-black rounded-xl flex justify-center items-center gap-2 animate-fade-in">
                                                    <span className="font-medium">
                                                        {spokenStoryPublishedType === 'private'
                                                            ? 'Your private message was submitted successfully.'
                                                            : 'Your public message was submitted successfully.'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleSpokenStoryPublishMessage}
                                            className="voice-transform-panel__publish-btn voice-transform-panel__publish-btn--spoken mt-5"
                                            disabled={spokenStoryIsPublishing || spokenStoryIsRecording || !spokenStoryBlob}
                                        >
                                            {spokenStoryIsPublishing ? 'Publishing...' : 'Publish Message'}
                                        </button>

                                        {/* Old Spoken Stories publish button removed (new isolated flow uses its own Publish Message) */}

                                        {!userHasProfilePhoto ? (
                                            <p className="voice-transform-panel__helper text-[16px] font-bold md:font-normal">
                                                Add a profile photo to share your message
                                            </p>
                                        ) : null}

                                        {/* Mobile only: featured Fancee audio at bottom of Spoken Stories */}
                                        <div className="voice-transform-spoken-featured-audio-wrap hidden max-[991px]:block w-full min-w-0 shrink-0">
                                            <div className="voice-transform-below__audio" aria-label="Featured audio">
                                                <div
                                                    className="voice-transform-panel__audio-preview-wrap"
                                                    aria-label="Audio preview"
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={toggleWeeklySpokenAudio}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" || e.key === " ") {
                                                            e.preventDefault();
                                                            void toggleWeeklySpokenAudio();
                                                        }
                                                    }}
                                                >
                                                    <span className="voice-transform-panel__audio-play" aria-hidden="true">
                                                        {weeklySpokenIsPlaying ? <FaPause /> : <FaPlay />}
                                                    </span>
                                                    <div className="voice-transform-panel__audio-preview">
                                                        <div className="voice-transform-panel__audio-head">
                                                            <img src={week_message} alt="Fancee" className="voice-transform-panel__audio-avatar" />
                                                            <span className="voice-transform-panel__audio-name">Fancee</span>
                                                            <span className="voice-transform-panel__audio-time">
                                                                {weeklySpokenDuration ? formatTime(weeklySpokenDuration) : "00:00"}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={`voice-transform-panel__audio-wave ${weeklySpokenIsPlaying ? 'voice-transform-panel__audio-wave--playing' : ''}`}
                                                            aria-hidden="true"
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="message-card__actions" aria-label="Audio reactions">
                                                    <span
                                                        className="message-card__actions"
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => {
                                                            if (!ensureFeaturedSpokenRecordingOrAlert()) return;
                                                            if (!requireAuthOrRedirect()) return;
                                                            openModal(featuredSpokenRecording, "spoken-share", null, { onShareRecorded: onSpokenShareRecorded });
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                if (!ensureFeaturedSpokenRecordingOrAlert()) return;
                                                                if (!requireAuthOrRedirect()) return;
                                                                openModal(featuredSpokenRecording, "spoken-share", null, { onShareRecorded: onSpokenShareRecorded });
                                                            }
                                                        }}
                                                        aria-label="Share spoken story"
                                                    >
                                                        <GoShareAndroid />
                                                        {featuredSpokenRecording?.total_share ?? 0}
                                                    </span>
                                                    <span
                                                        className="message-card__actions"
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => {
                                                            if (!ensureFeaturedSpokenRecordingOrAlert()) return;
                                                            if (!requireAuthOrRedirect()) return;
                                                            openSpokenComments(featuredSpokenRecording);
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                if (!ensureFeaturedSpokenRecordingOrAlert()) return;
                                                                if (!requireAuthOrRedirect()) return;
                                                                openSpokenComments(featuredSpokenRecording);
                                                            }
                                                        }}
                                                        aria-label="Open spoken story comments"
                                                    >
                                                        <IoChatbubbleEllipsesOutline />
                                                        {featuredSpokenRecording?.comments_count ?? 0}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* <p className="mt-4 text-center text-[16px] font-bold md:font-normal text-[#1f1f1f]">
                                                Add a profile photo to share your story
                                            </p> */}
                                            {/* <p className="profile-text-heavy">
                                                Add a profile photo to share your story
                                            </p> */}
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop (≥992px): Karina + featured audio side by side. Mobile: audio only under Spoken Stories; Karina full width here. */}
                                <div className="voice-transform-below">
                                    <div className="voice-transform-below__left">

                                        <div className="message-card">

                                            <div className="message-card__header">
                                                <img
                                                    src={paull}
                                                    alt=""
                                                    width={32}
                                                    height={32}
                                                    decoding="async"
                                                    className="message-card__avatar"
                                                />
                                                <h3 className="message-card__name">
                                                    Paul Leverich
                                                </h3>

                                                {/* <h3 className="message-card__name">
                                                    {featuredWrittenMessage?.user?.name || 'Karina Lowke'}
                                                </h3> */}
                                            </div>

                                            <p className="message-card__text">

                                                {/* There is always a point where you can start over in life. I started over when I was 41. Abandonment, being lost, abuse, substance use; that is where I was for most of my life from 18 years old on. When I turned 41 I got the opportunity of a lifetime. To go live with my biological mother that I have not seen since I was 4 and 1/2 after 35 whole lost years. Now I am here loving my best life that I can with my fiance who has been through the same thing that I went though also. He is my real life twin flame. Now here together. We go through this transformation of the renewal of our minds through Chris Jesus. You'll experience our changing lives as we go through struggles and tribulations in learning how to become better people without drugs. All we have to say about this is that we owe it all to God Almighty. */}
                                                I’m not here to fit into your version of how life is supposed to look. I’m here to build mine in real time. I’ve been through enough to know that pain either breaks you or builds you, and I chose to build. Not perfectly, not clean, but honestly. Everything you see from me is unfiltered. The thoughts, the chaos, the growth, the mistakes, the wins. I don’t separate who I am from what I create, because that’s the whole point. I’m proof that you don’t have to shrink to survive. You don’t have to silence yourself to belong. And you don’t have to have everything figured out to start becoming something more. I’m still becoming. Every day. And if there’s anything I stand on, it’s this: Be real, even when it’s uncomfortable. Build, even when it’s messy. And never trade who you are just to be accepted by people who were never meant to understand you. I’m not here to be perfect. I’m here to be undeniable.
                                            </p>

                                            {/* <p className="message-card__text">
                                                {featuredWrittenMessage?.message || (
                                                    <>There is always a point where you can start over in life. I started over when I was 41. Abandonment, being lost, abuse, substance use; that is where I was for most of my life from 18 years old on. When I turned 41 I got the opportunity of a lifetime. To go live with my biological mother that I have not seen since I was 4 and 1/2 after 35 whole lost years. Now I am here loving my best life that I can with my fiance who has been through the same thing that I went though also. He is my real life twin flame. Now here together. We go through this transformation of the renewal of our minds through Chris Jesus. You'll experience our changing lives as we go through struggles and tribulations in learning how to become better people without drugs. All we have to say about this is that we owe it all to God Almighty.</>
                                                )}
                                            </p> */}

                                            <div className="message-card__actions">
                                                <span
                                                    className="action-item"
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => {
                                                        if (!featuredWrittenMessage?.id) {
                                                            alert('No written story found to share yet.');
                                                            return;
                                                        }
                                                        if (!requireAuthOrRedirect()) return;
                                                        openModal(featuredWrittenMessage, "written-share", null, { onShareRecorded: onWrittenShareRecorded });
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            if (!featuredWrittenMessage?.id) {
                                                                alert('No written story found to share yet.');
                                                                return;
                                                            }
                                                            if (!requireAuthOrRedirect()) return;
                                                            openModal(featuredWrittenMessage, "written-share", null, { onShareRecorded: onWrittenShareRecorded });
                                                        }
                                                    }}
                                                >
                                                    <GoShareAndroid />
                                                    56
                                                    {/* {featuredWrittenMessage?.total_share ?? 0} */}
                                                </span>

                                                <span
                                                    className="action-item"
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => {
                                                        if (!featuredWrittenMessage?.id) {
                                                            alert('No written story found yet.');
                                                            return;
                                                        }
                                                        if (!requireAuthOrRedirect()) return;
                                                        openWrittenComments(featuredWrittenMessage);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            if (!featuredWrittenMessage?.id) {
                                                                alert('No written story found yet.');
                                                                return;
                                                            }
                                                            if (!requireAuthOrRedirect()) return;
                                                            openWrittenComments(featuredWrittenMessage);
                                                        }
                                                    }}
                                                >
                                                    <IoChatbubbleEllipsesOutline />
                                                    {featuredWrittenMessage?.comments_count ?? 0}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="voice-transform-below__right hidden min-[992px]:block min-w-0">
                                        <div className="voice-transform-below__audio" aria-label="Featured audio">
                                            <div
                                                className="voice-transform-panel__audio-preview-wrap"
                                                aria-label="Audio preview"
                                                role="button"
                                                tabIndex={0}
                                                onClick={toggleWeeklySpokenAudio}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        void toggleWeeklySpokenAudio();
                                                    }
                                                }}
                                            >
                                                <span className="voice-transform-panel__audio-play" aria-hidden="true">
                                                    {weeklySpokenIsPlaying ? <FaPause /> : <FaPlay />}
                                                </span>
                                                <div className="voice-transform-panel__audio-preview">
                                                    <div className="voice-transform-panel__audio-head">
                                                        <img src={week_message} alt="Fancee" className="voice-transform-panel__audio-avatar" />
                                                        <span className="voice-transform-panel__audio-name">Fancee</span>
                                                        <span className="voice-transform-panel__audio-time">
                                                            {weeklySpokenDuration ? formatTime(weeklySpokenDuration) : "00:00"}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className={`voice-transform-panel__audio-wave ${weeklySpokenIsPlaying ? 'voice-transform-panel__audio-wave--playing' : ''}`}
                                                        aria-hidden="true"
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="message-card__actions" aria-label="Audio reactions">
                                                <span
                                                    className="message-card__actions"
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => {
                                                        if (!ensureFeaturedSpokenRecordingOrAlert()) return;
                                                        if (!requireAuthOrRedirect()) return;
                                                        openModal(featuredSpokenRecording, "spoken-share", null, { onShareRecorded: onSpokenShareRecorded });
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            if (!ensureFeaturedSpokenRecordingOrAlert()) return;
                                                            if (!requireAuthOrRedirect()) return;
                                                            openModal(featuredSpokenRecording, "spoken-share", null, { onShareRecorded: onSpokenShareRecorded });
                                                        }
                                                    }}
                                                    aria-label="Share spoken story"
                                                >
                                                    <GoShareAndroid />
                                                    102
                                                    {/* {featuredSpokenRecording?.total_share ?? 0} */}
                                                </span>
                                                <span
                                                    className="message-card__actions"
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => {
                                                        if (!ensureFeaturedSpokenRecordingOrAlert()) return;
                                                        if (!requireAuthOrRedirect()) return;
                                                        openSpokenComments(featuredSpokenRecording);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            if (!ensureFeaturedSpokenRecordingOrAlert()) return;
                                                            if (!requireAuthOrRedirect()) return;
                                                            openSpokenComments(featuredSpokenRecording);
                                                        }
                                                    }}
                                                    aria-label="Open spoken story comments"
                                                >
                                                    <IoChatbubbleEllipsesOutline />
                                                    {featuredSpokenRecording?.comments_count ?? 0}
                                                </span>
                                            </div>
                                        </div>
                                        {/* <p className="mt-4 text-center text-[16px] font-bold md:font-normal text-[#1f1f1f]">
                                            Add a profile photo to share your story
                                        </p> */}
                                    </div>
                                </div>

                                <MuiModal
                                    className="desktopmodal"
                                    open={writtenCommentsOpen}
                                    onClose={closeWrittenComments}
                                    sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
                                >
                                    <Box sx={writtenCommentsBoxSx}>
                                        <div className="relative w-[min(92vw,420px)] max-w-[min(92vw,420px)] overflow-visible">
                                            <div className="relative w-full overflow-hidden rounded-[10px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] min-h-[420px] max-h-[min(82vh,640px)] pb-[84px]">
                                                <div className="px-4 pt-4 pb-2 text-left font-bold text-black" style={{ fontFamily: "Roboto, sans-serif" }}>
                                                    Comments
                                                </div>
                                                <IconButton
                                                    onClick={closeWrittenComments}
                                                    sx={{
                                                        position: "absolute",
                                                        top: -48,
                                                        right: -48,
                                                        zIndex: 1000,
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: 9999,
                                                        background: "rgba(0,0,0,0.35)",
                                                        backdropFilter: "blur(6px)",
                                                    }}
                                                    aria-label="Close"
                                                >
                                                    <img src={CloseIcon} alt="" className="h-6 w-6 invert" />
                                                </IconButton>

                                                <div className="px-[10px] overflow-y-auto max-h-[calc(min(82vh,640px)-150px)] [scrollbar-width:thin]">
                                                    {writtenCommentsLoading ? (
                                                        <div className="p-4 text-sm text-gray-600">Loading...</div>
                                                    ) : (Array.isArray(writtenComments) && writtenComments.length ? (
                                                        writtenComments.map((c) => renderWrittenCommentNode(c, 0))
                                                    ) : (
                                                        <div className="p-4 text-sm text-gray-600">No comments yet.</div>
                                                    ))}
                                                </div>

                                                <div className="absolute bottom-0 left-0 right-0 bg-transparent px-[10px] py-4">
                                                    <div className="flex items-center gap-4 rounded-[20px] border border-[#d8d0d0] bg-white px-4 py-3">
                                                        <img
                                                            src={displayAvatar || UserImg}
                                                            className="h-7 w-7 rounded-full object-cover"
                                                            alt=""
                                                        />
                                                        <textarea
                                                            className="flex-1 appearance-none border-0 bg-transparent text-[14px] text-black outline-none resize-none overflow-hidden h-[22px] leading-[22px] placeholder:text-gray-400"
                                                            value={writtenCommentText}
                                                            onChange={(e) => setWrittenCommentText(e.target.value)}
                                                            placeholder="Add your comment..."
                                                            rows={1}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter" && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    submitWrittenComment();
                                                                }
                                                            }}
                                                            style={{ resize: "none" }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="flex items-center justify-center rounded-full bg-[#ff4667] p-[14px] disabled:opacity-55"
                                                            onClick={submitWrittenComment}
                                                            disabled={writtenCommentSubmitting || !String(writtenCommentText || "").trim()}
                                                            aria-label="Send comment"
                                                        >
                                                            <img src={msgSend} alt="" style={{ width: 22, height: 22 }} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Box>
                                </MuiModal>

                                <MuiModal
                                    className="desktopmodal spoken-story-comments-modal"
                                    open={spokenCommentsOpen}
                                    onClose={closeSpokenComments}
                                    sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
                                >
                                    <Box sx={spokenCommentsBoxSx}>
                                        <div className="ssc-shell">
                                            <div className="ssc-card">
                                                <div className="ssc-title">Comments</div>
                                                <IconButton
                                                    onClick={closeSpokenComments}
                                                    sx={{
                                                        position: "absolute",
                                                        top: -48,
                                                        right: -48,
                                                        zIndex: 1000,
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: 9999,
                                                        background: "rgba(0,0,0,0.35)",
                                                        backdropFilter: "blur(6px)",
                                                    }}
                                                    aria-label="Close"
                                                >
                                                    <img src={CloseIcon} alt="" className="h-6 w-6 invert" />
                                                </IconButton>

                                                <div className="ssc-list max-h-[calc(min(82vh,640px)-150px)] [scrollbar-width:thin]">
                                                    {spokenCommentsLoading ? (
                                                        <div className="p-4 text-sm text-gray-600">Loading...</div>
                                                    ) : (Array.isArray(spokenComments) && spokenComments.length ? (
                                                        spokenComments.map((c) => renderSpokenCommentNode(c, 0))
                                                    ) : (
                                                        <div className="p-4 text-sm text-gray-600">No comments yet.</div>
                                                    ))}
                                                </div>

                                                <div className="ssc-composer">
                                                    <div className="flex items-center gap-4 rounded-[20px] border border-[#d8d0d0] bg-white px-4 py-3">
                                                        <img
                                                            src={displayAvatar || UserImg}
                                                            className="h-7 w-7 rounded-full object-cover"
                                                            alt=""
                                                        />
                                                        <textarea
                                                            className="flex-1 appearance-none border-0 bg-transparent text-[14px] text-black outline-none resize-none overflow-hidden h-[22px] leading-[22px] placeholder:text-gray-400"
                                                            value={spokenCommentText}
                                                            onChange={(e) => setSpokenCommentText(e.target.value)}
                                                            placeholder="Add your comment..."
                                                            rows={1}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter" && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    submitSpokenComment();
                                                                }
                                                            }}
                                                            style={{ resize: "none" }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="flex items-center justify-center rounded-full bg-[#ff4667] p-[14px] disabled:opacity-55"
                                                            onClick={submitSpokenComment}
                                                            disabled={spokenCommentSubmitting || !String(spokenCommentText || "").trim()}
                                                            aria-label="Send comment"
                                                        >
                                                            <img src={msgSend} alt="" style={{ width: 22, height: 22 }} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Box>
                                </MuiModal>



                            </div>
                        </section>

                        <div className="homepage_audioSection md:mt-0 w-full">
                            <div className="top-title home_titlepage" style={{ textAlign: 'center' }}>

                                <h2 className="md:hidden block text-[25px]">A Space Where Your Voice Has<br /> The Power To Transform </h2>
                                <h1 className="hidden md:block">A Space Where Your Voice Has The  <br /> Power To Transform </h1>
                                {/* <div className="os-message-world__single-line home_titlepage__tagline-mobile w-full min-w-0 max-w-full px-2">
                                    <span className="os-home-tagline-mobile">
                                        Just meaningful connections and a community that lifts you up.
                                    </span>
                                </div> */}
                                <div className="os-message-world__single-line home_titlepage__tagline-mobile w-full min-w-0 max-w-full px-2 mb-[20px] sm:mb-0">
                                    <span className="os-home-tagline-mobile">
                                        Just meaningful connections and a community that lifts you up.
                                    </span>
                                </div>
                                {/* <h1>No judgment. No noise. </h1> */}
                            </div>
                        </div>

                        <div className="os-container ">
                            <div className="os-story__content addmore-css os-hero-beyond ">


                                <div className="os-hero addmore-css container w-full mx-auto" style={{ paddingTop: '0px' }}>


                                    <div className="os-hero__video">
                                        {shouldLoadDeferredSections ? (
                                            <Suspense fallback={<img src={homepagevideoScreenShot} alt="Story sharing preview" loading="lazy" decoding="async" />}>
                                                <DeferredCustomVideoPlayer src={homepagevideo} poster={homepagevideoScreenShot} />
                                            </Suspense>
                                        ) : (
                                            <img src={homepagevideoScreenShot} alt="Story sharing preview" loading="lazy" decoding="async" />
                                        )}
                                    </div>
                                    <div className='homepage2btn'>

                                        <Button
                                            tag={'a'}
                                            href={route('user.recorder')}
                                            fontWeight={'bold'}
                                            padding={'l'}
                                            fontSize={'m'}
                                            className={''}
                                            style={{ fontSize: '20px', padding: ' 22px 32px', background: 'var(--gradient-1)', color: 'white' }}>How you're feeling today?
                                        </Button>


                                        <Button
                                            onClick={handleToOpenVideoEditor}
                                            tag={'a'}
                                            fontWeight={'bold'}
                                            padding={'l'}
                                            fontSize={'m'}
                                            className={''} style={{ fontSize: '20px', padding: '22px 32px' }}>Create A Story
                                        </Button>
                                        <Button
                                            tag={'a'}
                                            href={route('about-page.index')}
                                            fontWeight={'bold'}
                                            padding={'l'}
                                            fontSize={'m'}
                                            className={''}
                                            style={{ fontSize: '20px', padding: ' 22px 32px' }}>Our Story
                                        </Button>
                                        <Button
                                            href={route('how.to.create.a.story')}
                                            tag={'a'}
                                            fontWeight={'bold'}
                                            padding={'l'}
                                            fontSize={'m'}
                                            className={''} style={{ fontSize: '20px', padding: '22px 32px' }}>How To Create Your Story
                                        </Button>

                                    </div>
                                </div>

                            </div>
                            {/* <div className="os-story">
                            </div> */}
                        </div>

                        <section className="os-creator-community">
                            <div className="os-creator-community__inner">
                                <div className="os-creator-community__grid">
                                    <div className="os-creator-community__cell os-creator-community__cell--img">
                                        <img src={creatorImg1} alt="" loading="lazy" decoding="async" />
                                    </div>
                                    <div className="os-creator-community__cell os-creator-community__cell--img">
                                        <img src={creatorImg2} alt="" loading="lazy" decoding="async" />
                                    </div>
                                    <div className="os-creator-community__cell os-creator-community__cell--img">
                                        <img src={creatorImg3} alt="" loading="lazy" decoding="async" />
                                    </div>
                                    <div className="os-creator-community__cell os-creator-community__cell--img">
                                        <img src={creatorImg4} alt="" loading="lazy" decoding="async" />
                                    </div>
                                </div>
                                <div className="os-creator-community__content">
                                    <h2 className="os-creator-community__title">
                                        <span className="os-creator-community__title-line">Join Our Creator Community</span>
                                    </h2>
                                    <p className="os-creator-community__text">
                                        <span className="os-creator-community__sub-line">Share your authentic stories</span>
                                    </p>
                                    <ul className="os-creator-community__benefits">
                                        <li>
                                            <span className="os-creator-community__check" aria-hidden="true"><FaCheck /></span>
                                            <span className="os-creator-community__benefit-label">No follower minimum required</span>
                                        </li>
                                        <li>
                                            <span className="os-creator-community__check" aria-hidden="true"><FaCheck /></span>
                                            <span className="os-creator-community__benefit-label">$7 per 1,000 views</span>
                                        </li>
                                        <li>
                                            <span className="os-creator-community__check" aria-hidden="true"><FaCheck /></span>
                                            <span className="os-creator-community__benefit-label">Withdraw at just $50</span>
                                        </li>
                                        <li>
                                            <span className="os-creator-community__check" aria-hidden="true"><FaCheck /></span>
                                            <span className="os-creator-community__benefit-label">Get approved within 24 hours</span>
                                        </li>
                                    </ul>
                                    <div className="os-creator-community__cta-wrap">
                                        <Link href={user?.is_creator ? route('user.creator.dashboard') : user ? route('creator.upgrade') : route('creator')} className="os-creator-community__btn">
                                            Become a Creator <span className="os-creator-community__btn-arrow"><IoArrowForwardOutline /></span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="os-container">
                            <div className="os-story__content addmore-css os-hero-beyond">
                                {shouldLoadDeferredSections ? (
                                    <Suspense fallback={<div className="min-h-[320px]" aria-hidden="true" />}>
                                        {!isDesktop ? (
                                            <DeferredCustomHomeSectionMobile linkToVideoEditor={handleToOpenVideoEditor} />
                                        ) : (
                                            <DeferredCustumHomepage linkToVideoEditor={handleToOpenVideoEditor} />
                                        )}
                                    </Suspense>
                                ) : (
                                    <div className="min-h-[320px]" aria-hidden="true" />
                                )}
                            </div>
                        </div>

                    </GuestLayout>
                )
            }

            <ProfilePhotoUploadModal
                show={showProfilePhotoModal}
                user={effectiveUser}
                onClose={closeProfilePhotoModal}
                onComplete={completeProfilePhotoUpload}
            />
        </>
    );
};