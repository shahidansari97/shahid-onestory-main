import '../../../css/home.css';
import '../../../css/form.css';
import '../../../css/competition.css';
import ContestStory from "@/Components/Story/ContestStory.jsx";
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import Modal from "@/Components/Modal.jsx";
import { useEffect, useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Head, usePage } from "@inertiajs/react";
import ModalContent from "@/Components/Modals/ModalContent.jsx";
import CommentModal from "@/Components/Modals/CommentModal.jsx";
import useUserMedia from "@/Hooks/useUserMedia";
import { useEditorRedirectionContext } from "@/Contexts/EditorRedirectionContext";
export default function Contest({ data }) {
    const [loading, setLoading] = useState(false);
    const { stories, gifts } = useMemo(() => data, [data]);
    const { success, message, new_balance, auth } = usePage().props;
    const user = useMemo(() => auth.user, [auth.user]);
    const [storyList, setStoryList] = useState(stories);

    console.log("storyList",storyList)
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
                params: { page: page + 1,limit:limit },
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
                <Head title="Contest" />
                <div className="os-container">
                    <div className="os-story__content addmore-css">
                        {storyList?.data.length == 0 && (
                            <div className="top-title text-center">
                                <h6 className='os-title-home_subtitle' style={{ textTransform: 'capitalize' }}>No Stories for Contest</h6>
                            </div>
                        )}
                        <div className="os-gradient-bg rounded-[16px] md:max-w-[100%]  max-w-full "></div>
                        <div className="os-carousel os-carouselMain content_story w-full max-w-[100%] mx-auto grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-0 justify-items-center md:px-4 md:py-6 py-3 px-3 [1400px]:grid-cols-4 gap-y-5">
                            {storyList?.data.length > 0 &&
                                storyList?.data.map((item, index) => {
                                    return (
                                        <ContestStory
                                            key={item.id}
                                            item={item}
                                            displayGift={true}
                                            index={index}
                                            isActive={item.id === uiState.activeVideoId}
                                            onActivate={() =>
                                                setUiState((prev) => ({ ...prev, activeVideoId: item.id }))
                                            }
                                            onActivateFocus={() => handleActivateFocus(item.id)}
                                            onOpenGiftModal={() => openModal(item, "gift", item.author)}
                                            onOpenVideoModal={() => openModal(item, "video", item.author)}
                                            onOpenShareModal={() => openModal(item.id, "share")}
                                            onConnect={handleConnectToStoryTeller}
                                        />
                                    );
                                })
                            }
                            {modalState.show && modalState.type === 'video' && (
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
                            )}

                            {modalState.show && modalState.type !== 'video' && (
                                <Modal
                                    show={modalState.show}
                                    onClose={closeModal}
                                    maxWidth={modalState.type === 'share' ? 'lg' : 'xl'}
                                    className={
                                        `modal__panel${modalState.type === 'competition'
                                            ? '--competition p-0 rounded-[2.5rem]'
                                            : modalState.type === 'share'
                                                ? '--deposit'
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
                                            refillSuccess={walletState.refillSuccess}
                                        />
                                    </Suspense>
                                </Modal>
                            )}
                        </div>
                        <div className="text-center">
                            {hasMore && storyList?.data.length > 0 &&  (
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="os-btn os-btn--fw-bold os-btn--fs-m os-btn--primary px-12 flex items-center justify-center gap-2"
                                >
                                    {loadingMore ? (
                                        <span className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        "Load more"
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </GuestLayout>
        </>
    );
};
