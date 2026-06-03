import '../../../css/home.css';
import '../../../css/form.css';
import '../../../css/competition.css';
import NewContestStory from "@/Components/Story/NewContestStory.jsx";
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import Modal from "@/Components/Modal.jsx";
import { useEffect, useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Head, usePage ,router, Link } from "@inertiajs/react";
import ModalContent from "@/Components/Modals/ModalContent.jsx";
import CommentModal from "@/Components/Modals/CommentModal.jsx";
import useUserMedia from "@/Hooks/useUserMedia";
import { useEditorRedirectionContext } from "@/Contexts/EditorRedirectionContext";
import { FiFilter } from "react-icons/fi";


export default function ContestNew({ data }) {
    const [loading, setLoading] = useState(false);
    const { stories, gifts } = useMemo(() => data, [data]);
    const { success, message, new_balance, auth } = usePage().props;
    const user = useMemo(() => auth.user, [auth.user]);
    const [storyList, setStoryList] = useState(stories);
    console.log("storyList", storyList)
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const limit = 6;
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
    
    const handleToOpenVideoEditor = async() => {
        if(auth.user){
            if(media && media.length > 0){
                window.location.href = 'https://onestoryplanet.com/draft';
            }else{
                window.location.href = `${url}&is_draft=false`;
            }
        }else{
            router.visit(route("register",{is_contestant:true}));
        }
    }
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
        const params = new URLSearchParams(window.location.search);
        const refillSuccessParam = params.get('refill_success');

        if (refillSuccessParam === '1') {
            setModalState({ show: true, data: { item: null, author: null }, type: "refill-success" });
            const url = new URL(window.location);
            params.delete('refill_success');
            window.history.replaceState({}, '', url.pathname);
        }
    }, []);

    const openModal = useCallback((item, type, author) => {
        setModalState({ show: true, data: { item, author }, type });
    }, []);

    const closeModal = useCallback(() => {
        setModalState({ show: false, data: null, type: null });
        setUiState(prev => ({ ...prev, activeCardIndex: null }));
        setWalletState(prev => ({ ...prev, error: false, refillSuccess: false }));
    }, []);

    const handleGiftClick = useCallback((index) => {
        setUiState(prev => ({ ...prev, activeCardIndex: index }));
    }, []);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
            localStorage.setItem('hasVisited', 'true');
        } else {
            setUiState(prev => ({ ...prev, showPreloader: false }));
        }
    }, []);

    const handleActivateFocus = useCallback((id) => {
        setUiState(prev => ({ ...prev, focusedId: id }));
    }, []);

    const handleCloseFocus = useCallback(() => {
        setUiState(prev => ({ ...prev, focusedId: null }));
    }, []);


    const handleConnectToStoryTeller = (e, item) => {
        if (e) e.stopPropagation();
        window.location.href = `/chatify/${item?.author?.id}`;
    }
    const loadMore = async () => {
        if (!hasMore) return;
        setLoadingMore(true);
        try {
            const response = await axios.get(`/editor-contest/load-more-stories`, {
                params: { page: page + 1, limit: limit },
            });
            if (response.data.stories.length === 0) {
                setHasMore(false); // no more items
            } else {
                setStoryList(prev => ({
                    ...prev,
                    data: [...prev.data, ...response.data.stories]
                }));
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error("Load More Error:", error);
        }
        setLoadingMore(false);
    };
    return (
        <>
            <GuestLayout displayMenu={true} addContainer={false}>
                <Head title="New Contest" />

                {/* top section */}
                <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden bg-[#f7edf9] px-4">

                    {/* Background Blobs */}
                    <div className="absolute top-[30%] left-[-10%] w-[450px] h-[450px] md:bg-[#d8bbf3]/70 rounded-full blur-3xl"></div>
                    <div className="absolute top-[5%] right-[-10%] w-[500px] h-[500px] md:bg-[#ffeaa7]/80 rounded-full blur-3xl"></div>

                    {/* Voting tag */}
                    <div className="border px-4 py-1 rounded-full bg-white shadow-sm flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-sm font-bold">Voting is now open</span>
                    </div>

                    {/* Heading */}
                    <h1 className="md:text-[62px] text-[30px] font-extrabold leading-tight text-black">
                        OneStoryPlanet
                    </h1>

                    {/* Gradient Text */}
                    <h2 className="md:text-[62px] text-[30px] font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent -mt-3">
                        Creator Showdown
                    </h2>

                    {/* Sub Text */}
                    <p className="text-gray-600 mt-4 text-2xl">
                        Make something unforgettable. Win $1,000. Twice.
                    </p>
                    <p className="text-gray-500 text-md mt-3">
                        Two creative champions. Two massive wins.
                    </p>

                    {/* Prize Boxes */}
                    <div className="mt-12 flex flex-col md:flex-row gap-6">
                        <div className="bg-white shadow-lg rounded-2xl px-10 py-7 text-center border w-[300px]">
                            <h3 className="text-3xl md:text-4xl font-extrabold">$1,000</h3>
                            <p className="mt-1 text-gray-500 text-sm">FOR BEST EDIT</p>
                        </div>

                        <div className="bg-white shadow-lg rounded-2xl px-10 py-7 text-center border w-[300px]">
                            <h3 className="text-3xl md:text-4xl font-extrabold">$1,000</h3>
                            <p className="mt-1 text-gray-500 text-sm">FOR BEST CONTENT</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-12">
                        <button onClick={handleToOpenVideoEditor} className="px-8 py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 font-bold shadow-md transition">
                            Submit Your Entry
                        </button>
                        <Link href={route('competition-page.index')}>
                            <button className="px-8 py-3 rounded-full bg-white border shadow-sm font-bold hover:bg-gray-50 transition">
                                View Rules
                            </button>
                        </Link>
                    </div>
                </div>

                {/* vote champion section */}

                <div className="w-full   min-h-[500px] h-[500px] ">
                    <div className='bg-[#fcf9fd] min-h-[350px] h-[350px] w-full  flex flex-col items-center justify-center  px-4 py-16 md:pt-[260px]'>

                        {/* Heading */}
                        <h1 className="text-4xl md:text-5xl font-extrabold text-black text-center">
                            Vote for the Champions
                        </h1>

                        {/* Sub text */}
                        <p className="text-gray-600 text-center max-w-2xl mt-4 leading-relaxed">
                            Help us decide who takes home the $1,000 prize. Watch the entries and vote for
                            your favorites in each category.
                            Winner Notification Email within 7 days, 72h to respond.
                        </p>

                        {/* Box 1 */}
                        <div className="mt-12 w-full max-w-3xl bg-gradient-to-r from-pink-200 to-purple-200/40 p-6 rounded-2xl shadow-sm">
                            <p className="text-black font-semibold">
                                Free to enter. Entry Period:
                                <span className="font-normal text-gray-700"> 12/15–12/22</span>
                            </p>
                        </div>

                        {/* Box 2 */}
                        <div className="mt-6 w-full max-w-3xl bg-gradient-to-r from-pink-200 to-purple-200/40 p-6 rounded-2xl shadow-sm">
                            <p className="font-semibold text-black">Disclaimers:</p>

                            <p className="text-gray-700 text-sm leading-relaxed mt-1">
                                Not liable for tech issues.
                                This contest will run only if we receive at least 50 eligible entries. If not,
                                it will be postponed and the prize will roll over to $2,000 for the following week.
                            </p>
                        </div>

                    </div>
                </div>


                {/* Cardbox section*/}

                <div className="container mx-auto">
                    <div className="w-full px-6 py-10">
                        {/* Header */}
                        <div className="md:flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold">All Entries ({storyList.total})</h2>

                            {/* <div className="flex gap-3 mt-4 md:mt-0">
                                <button className="px-4 py-2 border rounded-full flex items-center gap-2 hover:bg-gray-100 text-sm font-bold">
                                    <FiFilter className="text-black text-md" />
                                    <span>Most Recent</span>
                                </button>
                                <button className="px-4 py-2 border rounded-full bg-black text-white flex items-center gap-2 text-sm font-bold">
                                    Most Popular
                                </button>
                            </div> */}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {storyList.data.length > 0 && storyList.data.map((item, index) => (
                                <NewContestStory 
                                    item={item}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="text-center flex justify-center">
                        {hasMore && storyList?.data.length > 0 &&  (
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="py-2 rounded-full os-btn--fw-bold os-btn--fs-m os-btn--primary bg-white px-10 border border-gray-300 flex items-center justify-center gap-2"
                            >
                                {loadingMore ? (
                                    <span className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    "Load more entries"
                                )}
                            </button>
                        )}
                        
                    </div>
                </div>
            </GuestLayout>
        </>
    );
};
