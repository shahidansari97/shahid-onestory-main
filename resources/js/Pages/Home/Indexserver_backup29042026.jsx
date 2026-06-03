import '../../../css/home.css';
import '../../../css/form.css';
import '../../../css/gift.css';
// import { FaMicrophone } from "react-icons/fa";

import { FaMicrophone, FaRegCommentDots, FaPaperPlane, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrShareOption } from "react-icons/gr";
import Button from "@/Components/UI/Button.jsx";
import GuestLayout from '@/Layouts/GuestLayout';
import Carousel from "@/Components/Story/StoryCarousel.jsx";
import Story from "@/Components/Story/Story.jsx";
import StoryAppleMobile from "@/Components/Story/StoryAppleMobile.jsx";
import Modal from "@/Components/Modal.jsx";
import { useEffect, useRef, useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import Preloader from '@/Components/Preloader';
import homepagevideo from '../../../img/custum_homepage_video.mp4';
// import homepagevideoScreenShot from '../../../img/custum_homepage_video_screenshot.png';
import homepagevideoScreenShot from '../../../img/custum_homepage_video_screenshot.webp';
import heroBeyondImg from '../../../img/section_2_video_screen_shot.webp';
// import heroBeyondImg from '../../../img/section_2_video_screen_shot.png';
// import creatorImg1 from '../../../img/1.png';
// import creatorImg2 from '../../../img/2.png';
// import creatorImg3 from '../../../img/3.png';
// import creatorImg4 from '../../../img/4.png';
import creatorImg1 from '../../../img/1.webp';
import creatorImg2 from '../../../img/2.webp';
import creatorImg3 from '../../../img/3.webp';
import creatorImg4 from '../../../img/4.webp';
import axios from 'axios';




import ck from '../../../img/ck.webp';
import dustie from '../../../img/dustie.webp';
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
import { useEditorRedirectionContext } from "@/Contexts/EditorRedirectionContext";
import { router } from '@inertiajs/react';
import { IoArrowForwardOutline } from "react-icons/io5";
import { convertToWav, getAudioDuration, isWebAudioSupported, needsConversion } from "@/Utils/audioConverter";
// Lazy load heavy components
const FocusedStoryOverlay = lazy(() => import("@/Components/Story/FocusedStoryOverlay.jsx"));
const ModalContent = lazy(() => import("@/Components/Modals/ModalContent.jsx"));
const CommentModal = lazy(() => import("@/Components/Modals/CommentModal.jsx"));
const DeferredCustomVideoPlayer = lazy(() => import("@/Components/UI/CustomVideoPlayer.jsx"));
const DeferredCustumHomepage = lazy(() => import('@/Components/Custum_homepage'));
const DeferredCustomHomeSectionMobile = lazy(() => import('@/Components/CustomHomeSectionMobile'));
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

    const [pendingStoryCreation, setPendingStoryCreation] = useState(false);
    const [shouldLoadDeferredSections, setShouldLoadDeferredSections] = useState(false);
    const [shouldRenderMessageSection, setShouldRenderMessageSection] = useState(false);

    // Memoize data extraction to prevent unnecessary re-renders
    const { stories, gifts } = useMemo(() => data, [data]);
    const { success, message, new_balance, auth, refill_success } = usePage().props;
    const user = useMemo(() => auth.user, [auth.user]);
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

    const isMobile = useIsDesktop(992);
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
    const openModal = useCallback((item, type, author) => {
        setModalState({ show: true, data: { item, author }, type });
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

        if (params.get('open_editor') === '1' && auth?.user?.id) {
            // if (params.get('open_editor') === '1') {}
            handleToOpenVideoEditor();
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
            if (Array.isArray(media) && media.length > 0) {
                window.location.replace('/draft');
                // window.location.href = '/draft';
            } else {
                window.location.replace(`${url}&is_draft=false`);
                // window.location.href = `${url}&is_draft=false`;
            }
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
            if (Array.isArray(media) && media.length > 0) {
                window.location.replace('/draft');
                // window.location.href = '/draft';
            } else {
                window.location.replace(`${url}&is_draft=false`);
                // window.location.href = `${url}&is_draft=false`;
            }
            setPendingStoryCreation(false);
        }
    }, [url, pendingStoryCreation, auth?.user?.id, media]);


const messages = useMemo(() => [
        {
            id: 1,
            name: "Thomas Naishma",
            // name: "TommyNai",
            subtitle: "",
            message: "Live & Speak Your Truth , Stand In your Power , Gifts & Authenticity",
            img: tommynai,
        },
        {
            id: 2,
            name: "Dustie Cahoon",
            subtitle: "",
            message: "Never stop loving. It's the only thing that matters in life. Nothing you have , you keep, except love. Love is the only thing you can hold onto forever.",
            img: dustie,
        },
        {
            id: 3,
            name: "Danimal Charles",
            subtitle: "Kaylin Richards",
            message: "Staying matters. Staying present, honest, alive, not staying positive. You don’t have to fix your pain to exist. You’re not broken for struggling. Staying, especially when it’s hard, is courage. Perspective can change everything.",
            img: denimalcharly,
        },
        {
            id: 4,
            name: "KAOZ",
            subtitle: "",
            message: "They told us to be realistic. They told us the world couldn’t change. But another world is already beginning, and we can feel it. Millennials and Gen Z were born for this moment. Our time is now. Let’s bring that better world into being.",
            img: kaoz,
        },
        {
            id: 5,
            name: "CK777",
            subtitle: "",
            message: "We’re all just walking each other home.",
            img: ck,
        },
        {
            id: 6,
            name: "DezTechs",
            subtitle: "",
            message: "Take your time; the world isn't going anywhere.",
            img: dez_tech,
        },


        {
            id: 7,
            name: "Kenya Harlan",
            subtitle: "",
            message: "Don't worry so much about other people or what they want, need, like or don't.  Don't let anyone clown you.  Reciprocity is everything in a relationship",
            img: kenya_harlen,
        },
        {
            id: 8,
            name: "Ajstayfit",
            subtitle: "",
            message: "Fear nothing",
            img: ajstayfit,
        },

        {
            id: 9,
            name: "Moochious",
            subtitle: "",
            message: "Broken but not useless We can be broken and cracked, but that doesnt mean we cant be mended back together, and still made usable.",
            img: moochi,
        },
        {
            id: 10,
            name: "ItsMonicaAgain",
            subtitle: "Kaylin Richards",
            message: "Your mess isn’t your shame. It’s your power. Own your story, laugh at the chaos, and turn every mistake into fuel. The world doesn’t need perfect people. It needs real ones. 🔥",
            img: itsmonica,
        },
        {
            id: 11,
            name: "OtterViking",
            subtitle: "",
            message: "We only have this one life, to know this is key to life, so harm none- have fun in it ! Don't fwell in what's happened. Or what's not happened , just BE Happy and fun wherever life turns out to be.... & Never, Never play leapfrog with a univorn...",
            img: otterking,
        },

        {
            id: 12,
            name: "Kaylyn Richard",
            subtitle: "",
            message: "(Lol entertainment love out loud )Be the love you always wanted",
            img: kylin,
        },

        {
            id: 13,
            name: "RenascentAngel78",
            subtitle: "",
            message: "All our knowledge has it's origin in our perceptions - Leonardo da Vinci",
            img: renas,
        },
        {
            id: 14,
            name: "LaurCzech11",
            subtitle: "",
            message: "The Light Shines in the Darkness, and the darkness shall Not overcome it... BE the Light. ♥",
            img: laurya,
        },

        {
            id: 15,
            name: "iammark1900-3505aa",
            subtitle: "",
            message: "Despite what the world throws at you, be humble and kind. That does not mean you let anyone tread on you. May you be well, happy, and peaceful.",
            img: iammark,
        },


        {
            id: 16,
            name: "MadysinLynn",
            subtitle: "",
            message: "Humility is humanities greatest weapon",
            img: maddisin,
        },

        {
            id: 17,
            name: "paulleverich-9eeac1",
            subtitle: "",
            message: "I don’t speak from perfection. I speak from experience. Life will try to make you smaller. It’ll test you, break you, push you into corners you didn’t know existed. People will doubt you, label you, judge you by your worst moments Let them.",
            img: paull,
        },

        {
            id: 18,
            name: "Idylilith69",
            subtitle: "",
            message: "Stop shrinking to survive in a world that was never built for your magic. Own your power. Even when it’s inconvenient. Especially when it scares people.",
            img: idyli,
        },
        {
            id: 19,
            name: "Poetssoul30",
            subtitle: "",
            message: "Your first Love should always be yourself. And to always be learning until the day you die.",
            img: poet,
        },
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
            router.visit(route('login'), { replace: true });
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
                        const publish = doPublishRef.current;
                        if (publish && auth?.user?.id) {
                            publish(blob, recordingDurationRef.current, universalMessageRef.current, isPrivateRecordingRef.current, auth.user.id);
                        }
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

    const handlePublishMessage = useCallback(async () => {
        // If user is not logged in, redirect to login instead of silently doing nothing.
        if (!auth?.user?.id) {
            router.visit(route('login'), { replace: true });
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
        // Text-only (no recording): allow submit with just message + private/public
        await doPublish(null, 0, universalMessage, isPrivateRecording, auth?.user?.id);
    }, [audioBlob, recordingDuration, universalMessage, isPrivateRecording, auth?.user?.id, doPublish]);

    const renderMessageWorldCard = (item) => (
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

    const messageTheWorldSection = (
        <section className="mt-4 mb-0 md:my-4 mx-auto w-full min-w-0 max-w-full">
            <div className="os-message-world__single-line">
                <p className="os-message-world__subtitle os-message-world__subtitle--lead">Not Ready for a Full Story Yet? Start here!</p>
            </div>
            <div className="os-message-world__single-line">
                <h2 className="os-message-world__title">Message to the world.</h2>
            </div>
            <div className="os-message-world__single-line">
                <p className="os-message-world__subtitle os-message-world__subtitle--strap">Real voices. Real wisdom. Real impact.</p>
            </div>

            <div className="flex items-center justify-center p-1">
                <div className="w-full max-w-3xl p-1 sm:p-6 space-y-5">
                    <div className="flex flex-col items-center gap-1">
                        <button
                            type="button"
                            onClick={handleRecordClick}
                            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 ${isRecording ? 'bg-red-100 shadow-[0_0_0_8px_rgba(244,114,182,0.12)]' : 'bg-red-100 hover:scale-105'}`}
                        >
                            <div className={`bg-red-500 shadow-lg shadow-red-500/40 ${isRecording ? 'h-[12px] w-[12px] rounded-full' : 'h-[12px] w-[12px] rounded-full'}`}></div>
                        </button>

                        <div className="text-center">
                            <div className="text-[14px] font-medium text-black leading-tight">{isRecording ? 'Press to stop' : 'Record'}</div>
                            <div className="text-[11px] font-semibold leading-none text-black mt-1">
                                {isRecording || audioBlob ? formatTime(recordingDuration) : ''}
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
                                // Enable when user typed something
                                (universalMessage && universalMessage.trim().length > 0) ||
                                // Enable when audio is ready
                                (!!audioBlob && audioBlob.size > 0) ||
                                // Enable when user is actively recording (publish will stop+send)
                                isRecording ||
                                isRecordingPaused
                            )
                        }
                        className="!mt-0 w-full rounded-xl bg-[#b596d8] py-2.5 text-[15px] font-semibold text-white shadow-md transition-colors duration-200 hover:bg-[#ab89d1] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPublishing ? 'Publishing...' : 'Publish Message'}
                    </button>
                    <p className="mt-1 text-center text-[14px] font-semibold text-[#1f1f1f]">
                        Profile picture is required
                    </p>


                </div>
            </div>

            {/* Mobile: native horizontal scroll (md breakpoint and below uses this strip) */}
            <div className="w-full min-w-0 max-w-full md:hidden mt-2 px-1 sm:px-2">
                <div
                    ref={messageMobileScrollerRef}
                    className="os-message-world__mobile-scroll flex w-full min-w-0 max-w-full gap-2 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory"
                    role="list"
                    aria-label="Community messages"
                >
                    {messages.map((item) => (
                        <div
                            key={item.id}
                            className="snap-center shrink-0 w-[min(88vw,320px)] px-1 box-border"
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

                        <div className="os-container">
                            <div className="os-story__content addmore-css os-hero-beyond">
                                <div className="os-hero-beyond__card !px-0">
                                    <div className="os-hero-beyond__header">
                                         <h2
                                            className="os-hero-beyond__title os-hero-beyond__strapline text-center font-bold max-[991px]:whitespace-normal max-[991px]:px-2 max-[991px]:text-balance min-[992px]:whitespace-nowrap leading-[1.15] tracking-tight text-[clamp(0.82rem,4.1vw,1.45rem)] min-[992px]:text-[40px] xl:text-[48px] px-0"
                                        >
                                            Authentic Personal Stories Beyond the Feed
                                        </h2>
                                    </div>
                                    <div className="os-hero-beyond__image-wrap">
                                        <div className="os-hero-beyond__image">
                                            <img src={heroBeyondImg} alt="" className="os-hero-beyond__img" fetchPriority="high" decoding="async" />
                                        </div>
                                    </div>

                                    {/* Footer outside image-wrap so copy uses full card width (image-wrap is max 60%/75%) */}
                                    <div className="os-hero-beyond__footer w-full px-3 sm:px-6 md:px-8">
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

                                    {!auth?.user?.id && (
                                        <div className="text-center mt-4 w-full px-3 sm:px-6">
                                            <div className="flex justify-center">
                                                <Button
                                                    href={route('register')}
                                                    tag="a"
                                                    variant="primary"
                                                    fontWeight="bold"
                                                    gap="16"
                                                    padding="s"
                                                    icon
                                                    className="os-hero-beyond__signup-btn"
                                                >
                                                    <img src="/img/icons/person.svg" alt="Sign Up" className="w-5 h-5 object-contain" />
                                                    Sign Up
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-2 flex justify-center items-center w-full px-3 sm:px-6">
                                       {/* <h3 className="mt-4 font-bold text-[clamp(10px,4.3vw,36px)] text-black leading-tight whitespace-nowrap text-center">
                                            Real Stories From Our Community
                                        </h3>*/}

                                         <h3 className="mt-4 font-bold max-[991px]:!font-bold text-[clamp(10px,4.3vw,36px)] text-black leading-tight text-center whitespace-normal max-[991px]:px-3 max-[991px]:text-balance min-[992px]:whitespace-nowrap">
                                            Real Stories From Our Community
                                        </h3>
                                    </div>
                                    <div className="os-hero-beyond__carousel-wrap">
                                        {uiState.focusedId === null ? (
                                            <Carousel
                                                items={memoizedStories}
                                                sliderRef={sliderRef}
                                                isAutoplay={isAutoplay}
                                                setIsAutoplay={setIsAutoplay}
                                                currentSlide={currentSlide}
                                                isAppleDevice={isAppleDevice}
                                                setCurrentSlide={setCurrentSlide}
                                                isFocusedMode={uiState.focusedId}
                                            >
                                                {(item, index) => (
                                                    isMobile ? (
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
                                                            isMobile={isMobile}
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
                                                    stories={memoizedStories}
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

                                     <div className="os-hero-beyond__cta-wrap flex flex-col items-center gap-2 mt-2 w-fit mx-auto px-0">
                                        {auth?.user?.id ? (
                                            <Button
                                                onClick={handleToOpenVideoEditor}
                                                tag="a"
                                                variant="primary"
                                                className="os-btn os-btn--fs-m os-btn--primary inline-flex items-center justify-center font-bold text-[14px] sm:text-[17px] leading-tight px-3 sm:px-[18px] py-[2px] sm:py-2 rounded-full w-fit text-center whitespace-nowrap"
                                            >
                                                Share Your First Story
                                            </Button>
                                        ) : (
                                            <Link href={route('login')}>
                                                <a className="os-btn os-btn--fs-m os-btn--primary inline-flex items-center justify-center font-bold text-[14px] sm:text-[17px] leading-tight px-3 sm:px-[18px] py-[2px] sm:py-2 rounded-full w-fit text-center whitespace-nowrap">
                                                    Share Your First Story
                                                </a>
                                            </Link>
                                        )}
                                        <Link href={route('stories.allStories')}>
                                            <a className="os-btn os-btn--fs-m os-btn--primary inline-flex items-center justify-center font-bold text-[14px] sm:text-[17px] leading-tight px-3 sm:px-[18px] py-[2px] sm:py-2 rounded-full w-fit text-center whitespace-nowrap">All Stories</a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {modalState.show && modalState.type === 'video' && (
                            <Suspense fallback={<div>Loading...</div>}>
                                <CommentModal
                                    item={modalState.data}
                                    gifts={gifts}
                                    user={user}
                                    modalData={modalState.data}
                                    activeCardIndex={uiState.activeCardIndex}
                                    handleGiftClick={() => openModal(modalState.data, "gift", modalState.data.author)}
                                    sendGift={null}
                                    error={walletState.error}
                                    setError={(error) => setWalletState(prev => ({ ...prev, error }))}
                                    loading={walletState.loading}
                                    validationCode={""}
                                    setValidationCode={() => { }}
                                    openModal={openModal}
                                    closeModal={closeModal}
                                    serverError={""}
                                    open={true}
                                />
                            </Suspense>
                        )}

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
                                                                onClick={handleRecordClick}
                                                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${isRecording ? 'bg-red-100 shadow-[0_0_0_8px_rgba(254,226,226,0.9)]' : 'bg-red-100 hover:scale-105'}`}
                                                            >
                                                                <div className={`bg-red-500 shadow-lg shadow-red-500/40 ${isRecording ? 'w-4 h-4 rounded-[4px]' : 'w-4 h-4 rounded-full'}`}></div>
                                                            </button>
                                                            <div className="text-center">
                                                                <p className="text-[26px] font-semibold leading-none text-[#4b5563] tracking-[0.04em]">
                                                                    {isRecording || audioBlob ? formatTime(recordingDuration) : ''}
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
                                                            onClick={handlePublishMessage}
                                                            disabled={
                                                                isPublishing ||
                                                                !(
                                                                    (universalMessage && universalMessage.trim().length > 0) ||
                                                                    (!!audioBlob && audioBlob.size > 0) ||
                                                                    isRecording ||
                                                                    isRecordingPaused
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

                        <div ref={messageSectionRef} className="os-container min-w-0 max-w-full">
                            <div className="os-story__content addmore-css os-hero-beyond min-w-0 w-full max-w-full">
                                {shouldRenderMessageSection ? messageTheWorldSection : <div className="min-h-[420px]" aria-hidden="true" />}
                            </div>
                        </div>

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
                            <div className="os-story">
                            </div>
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
                                        {!isMobile ? (
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
        </>
    );
};
