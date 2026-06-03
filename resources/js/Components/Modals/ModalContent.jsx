import React, { useState } from 'react';
import GiftModal from './GiftModal.jsx';
import SuccessModal from './SuccessModal.jsx';
import DepositModal from './DepositModal.jsx';
import ShareModal from './ShareModal.jsx';
import VideoPlayer from "@/Components/Video/VideoPlayer.jsx";
import axios from 'axios';
import RefillSuccessModal from "@/Components/Modals/RefillSuccessModal.jsx";
import DonationModal from "@/Components/Modals/DonationModal.jsx";
import DonateSuccessModal from "@/Components/Modals/DonateSuccessModal.jsx";
import WithdrawalSuccessModal from "@/Components/Modals/WithdrawalSuccessModal.jsx";
import WithdrawalModal from "@/Components/Modals/WithdrawalModal.jsx";
import CompetitionModal from './CompetitionModal.jsx';
import WrittenMessageShareModal from './WrittenMessageShareModal.jsx';
import SpokenStoryShareModal from './SpokenStoryShareModal.jsx';

// export default function ModalContent({ modalType, modalData, gifts, user, activeCardIndex, handleGiftClick, error, openModal, loading, closeModal, activeDepositCard, handleDepositCardClick, customAmount, setCustomAmount, setLoading, setWallet, setError, setRefillSuccess, refillSuccess, setBalance }) {
import CreateOurStoryModal from '@/Components/Modals/CreateOurStoryModal.jsx';
export default function ModalContent({ modalType, modalData, gifts, user, activeCardIndex, handleGiftClick, error, openModal, loading, closeModal, activeDepositCard, handleDepositCardClick, customAmount, setCustomAmount, setLoading, setWallet, setError, setRefillSuccess, refillSuccess, setBalance, onCreateStory, onStoryShareRecorded }) {
     
    const packed = [
        { coins: 50, price: 1.00 },
        { coins: 100, price: 2.00 },
        { coins: 150, price: 3.00 },
    ];
    const [validationCode, setValidationCode] = useState("");
    const [serverError, setServerError] = useState("");

    const sendGift = async () => {
        if (activeCardIndex === null || !modalData) return;

        const gift = gifts[activeCardIndex];
        const recipientId = modalData.author.id;

        setLoading(true);

        try {
            const response = await axios.post(route('user.gift-transaction.store'), {
                recipient_id: recipientId,
                gift_id: gift.id,
                validation_code: validationCode,
            });

            if (response.data.error) {
                setError(true);
                setServerError(response.data.error);
                return { success: false };
            }

            if (response.data.requires_2fa) {
                return { requires_2fa: true };
            }

            if (response.data.success) {
                setWallet(response.data.new_balance);
                openModal(null, "success", modalData.author);
                setError(false);
                setServerError("");
                return { success: true };
            }

            setError(true);
            setServerError("An unknown error occurred. Please try again.");
            return { success: false };
        } catch (error) {
            console.error("Error sending gift:", error);
            setError(true);
            setServerError("Failed to send the gift. Please check your connection.");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const refillBalance = async (amount) => {
        setLoading(true);
        try {
            const response = await axios.post(route('user.gift.balance.refill'), { amount });
            if (response.data.success) {
                setWallet(response.data.new_balance);
                setRefillSuccess(true);
            } else {
                setError(true);
                setServerError("Failed to refill the balance.");
            }
        } catch (error) {
            console.error("Error refilling balance:", error);
            setError(true);
            setServerError("Error during balance refill. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCustomRefill = () => {
        let amountToRefill;

        if (customAmount && !isNaN(customAmount) && customAmount > 0) {
            amountToRefill = customAmount;
        } else if (activeDepositCard !== null) {
            amountToRefill = packed[activeDepositCard].coins;
        } else {
            setError(true);
            setServerError("Invalid refill amount.");
            return;
        }
        refillBalance(amountToRefill);
    };

    const renderModalContent = () => {
        switch (modalType) {
            case "gift":
                return (
                    <GiftModal
                        gifts={gifts}
                        user={user}
                        modalData={modalData}
                        activeCardIndex={activeCardIndex}
                        handleGiftClick={handleGiftClick}
                        sendGift={sendGift}
                        error={error}
                        setError={setError}
                        openModal={openModal}
                        loading={loading}
                        validationCode={validationCode}
                        setValidationCode={setValidationCode}
                        serverError={serverError}
                    />
                );
            case "success":
                return (
                    <SuccessModal
                        gifts={gifts}
                        modalData={modalData}
                        activeCardIndex={activeCardIndex}
                        closeModal={closeModal}
                    />
                );
            case "deposit":
                return (
                    <DepositModal
                        user={user}
                        packed={packed}
                        activeDepositCard={activeDepositCard}
                        handleDepositCardClick={handleDepositCardClick}
                        customAmount={customAmount}
                        setCustomAmount={setCustomAmount}
                        setLoading={setLoading}
                        handleCustomRefill={handleCustomRefill}
                        loading={loading}
                        refillSuccess={refillSuccess}
                        setError={setError}
                    />
                );
            case "share":
                return (
                    <ShareModal
                        story={modalData.item}
                        onShareRecorded={onStoryShareRecorded}
                    />
                );
            case "written-share":
                return (
                    <WrittenMessageShareModal
                        writtenMessage={modalData.item}
                        onShareRecorded={modalData?.onShareRecorded}
                    />
                );
            case "spoken-share":
                return (
                    <SpokenStoryShareModal
                        spokenStoryRecording={modalData.item}
                        onShareRecorded={modalData?.onShareRecorded}
                    />
                );
            case "video":
                return (
                    <VideoPlayer
                        video={modalData}
                        type={"story"}
                        height={500}
                        onOpenGiftModal={() => openModal(modalData, "gift", modalData.author)}
                        onOpenShareModal={() => openModal(modalData.item.id, "share")}
                    />
                );
            case "donation":
                return (
                    <DonationModal
                        user={user}
                        closeModal={closeModal}
                        setLoading={setLoading}
                        setError={setError}
                    />
                );
            case "withdrawal":
                return (
                    <WithdrawalModal
                        user={user}
                        closeModal={closeModal}
                        setLoading={setLoading}
                        setError={setError}
                        setBalance={setBalance}
                    />
                );
            case "withdrawal_paypal":
                return (
                    <WithdrawalModal
                        user={user}
                        closeModal={closeModal}
                        setLoading={setLoading}
                        setError={setError}
                        setBalance={setBalance}
                        modalType={modalType}
                    />
                );
            case "refill-success":
                return (
                    <RefillSuccessModal
                        modalData={modalData}
                        closeModal={closeModal}
                    />
                );
            case "donate-success":
                return (
                    <DonateSuccessModal
                        closeModal={closeModal}
                    />
                );
            case "withdrawal-success":
                return (
                    <WithdrawalSuccessModal
                        closeModal={closeModal}
                    />
                );
            case "competition":
                return (
                    <CompetitionModal
                        closeModal={closeModal}
                    />
                );
            case "create-our-story":
                return (
                    <CreateOurStoryModal
                        closeModal={closeModal}
                        onCreateStory={onCreateStory}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="modal-content">
            {modalType !== "donation" && modalType !== "donate-success" && modalType !== "competition" && (
                <div className="os-gradient-bg os-gradient-bg--modal"></div>
            )}
            <div className="os-gift-modal">
                {renderModalContent()}
            </div>
        </div>
    );
}
