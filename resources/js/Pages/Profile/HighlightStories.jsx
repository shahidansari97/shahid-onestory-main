import './../../../css/gift.css';
import './../../../css/profile.css';
import './../../../css/story.css';
import './../../../css/form.css';
import React, { useEffect, useState, useRef } from "react";
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, usePage,router } from "@inertiajs/react";
import useIsDesktop from "@/Hooks/useIsDesktop";
import FocusedStoryOverlay from '@/Components/Story/FocusedStoryOverlay';
import Modal from "@/Components/Modal.jsx";
import ModalContent from "@/Components/Modals/ModalContent.jsx";
export default function HighlightStories({ 
    gifts,
    hightLightStories,
    story_id
}) { 
    // console.log("story_id",story_id);
    const { auth } = usePage().props;
    const isMobile = useIsDesktop(992);
    const user = auth.user;
    const path = window.location.pathname;
    const [focusedId, setFocusedId] = useState(story_id);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [customAmount, setCustomAmount] = useState(0.00);
    const [activeCardIndex, setActiveCardIndex] = useState(null);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [wallet, setWallet] = useState();
    const [error, setError] = useState(false);
    const [activeDepositCard, setActiveDepositCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refillSuccess, setRefillSuccess] = useState(false);

    const handleCloseFocus = () => {
        // console.log("close focus");
        router.visit(route('stories.allStories'));
    }
    const openModal = (item, type, author) => {
        // console.log("item modal click gift",item);
        setModalData({item, author});
        setModalType(type);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setModalData(null);
        setModalType(null);
        setActiveCardIndex(null);
        setError(false);
        setRefillSuccess(false);
    };
    const handleGiftClick = (index) => {
        setActiveCardIndex(index);
    };
    const handleConnectToStoryTeller = (e,item) => {
        if (e) e.stopPropagation();
        window.location.href = `/chatify/${item?.author?.id}`;
    }
    return (
        <GuestLayout>
            <Head title='Highlight Stories' />
            <FocusedStoryOverlay
                is_featured={false}
                stories={hightLightStories}
                displayGift={true}
                focusedId={focusedId}
                initialIndex={hightLightStories.findIndex(story => story.id === focusedId)}
                onClose={handleCloseFocus}
                onOpenGiftModal={openModal}
                onOpenVideoModal={openModal}
                onOpenShareModal={openModal}
                onConnect={handleConnectToStoryTeller}
            />
            {showModal && (
                <Modal
                    show={showModal}
                    onClose={closeModal}
                    maxWidth={modalType === 'share' ? 'lg' : 'xl'}
                    className={`modal__panel${modalType === 'deposit' ? '--deposit' : modalType === 'video' ? '--video' : ''}`}
                >
                    <ModalContent
                        modalType={modalType}
                        modalData={modalData}
                        gifts={gifts}
                        user={user}
                        activeCardIndex={activeCardIndex}
                        handleGiftClick={handleGiftClick}
                        error={error}
                        openModal={openModal}
                        loading={loading}
                        closeModal={closeModal}
                        activeDepositCard={activeDepositCard}
                        handleDepositCardClick={setActiveDepositCard}
                        customAmount={customAmount}
                        setCustomAmount={setCustomAmount}
                        setLoading={setLoading}
                        setWallet={setWallet}
                        setError={setError}
                        setRefillSuccess={setRefillSuccess}
                        refillSuccess={refillSuccess}
                    />
                </Modal>
            )}
        </GuestLayout>
    );
}
