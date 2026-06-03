import '../../../css/support.css';
import '../../../css/donate.css';
import '../../../css/form.css';
import '../../../css/gift.css';
import React, {useState, useEffect} from "react";
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import {Img} from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import VideoPlayer from "@/Components/Video/VideoPlayer.jsx";
import Modal from "@/Components/Modal.jsx";
import ModalContent from "@/Components/Modals/ModalContent.jsx";
import {Head, usePage} from "@inertiajs/react";

export default function Index({data}) {
    const {title, paragraph, video, target_amount, end_date} = data.content;
    const {funds, donors, user} = data;
    const {donation_success, auth } = usePage().props;
    const [donationAmount, setDonationAmount] = useState(funds);
    const [donorsCount, setDonorsCount] = useState(donors.length);
    const [usernames, setUsernames] = useState(donors.map(donor => `@${donor.username}`));
    const [timer, setTimer] = useState(calculateTimeRemaining(end_date));
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const openDonationModal = () => {
        if (!user) {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        } else {
            setModalType("donation");
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType(null);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(calculateTimeRemaining(end_date));
        }, 1000);

        return () => clearInterval(interval);
    }, [end_date]);

    useEffect(() => {
        if (donation_success) {
            openModal(null, "donate-success");
        }
    }, [donation_success]);

    function calculateTimeRemaining(endTime) {
        const endDate = new Date(endTime);
        const now = new Date();
        const timeDifference = endDate - now;

        if (timeDifference <= 0) {
            return {days: 0, hours: 0, minutes: 0, seconds: 0};
        }

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);

        return {days, hours, minutes, seconds};
    }

    const formatTime = (value) => value.toString().padStart(2, '0');

    const progressPercentage = target_amount > 0 ? (donationAmount / target_amount) * 100 : 0;
    return (
        <GuestLayout>
            <Head title="Donate"/>
            <div className="os-donate">
                <div className="os-container os-container--xl">
                    <div className="os-title-block os-title-block--p-lg">
                        <div className="os-title os-title--h2">{title}</div>
                        <div className="os-text">{paragraph}</div>
                    </div>
                </div>
                <div className="os-container os-container--sm">
                    <div className="os-donate__content">
                        <video
                            className="os-video__iframe os-video__iframe--500"
                            preload="metadata"
                            muted
                            playsInline
                            controls
                        >
                            <source src={video} type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>

                        <div className="os-progress">
                            <div className="os-progress__top">
                                <div className="os-progress__top-left">
                                    <div className="os-text os-text--sm">Donate</div>
                                    <div className="os-title os-title--h4 os-title--bold">${funds}</div>
                                    <div className="os-progress__bar">
                                        <div className="os-progress__bar-inner"
                                             style={{width: `${(funds / target_amount) * 100}%`}}></div>
                                    </div>
                                </div>
                                {end_date && (
                                    <div className="os-progress__timer">
                                        <div className="os-text os-text--md">Hurry up to donate!</div>
                                        <div className="os-progress__timer-box">
                                            <div className="os-progress__timer-box-item">
                                                {formatTime(timer.days)}
                                            </div>
                                            :
                                            <div className="os-progress__timer-box-item">
                                                {formatTime(timer.hours)}
                                            </div>
                                            :
                                            <div className="os-progress__timer-box-item">
                                                {formatTime(timer.minutes)}
                                            </div>
                                            :
                                            <div className="os-progress__timer-box-item">
                                                {formatTime(timer.seconds)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={openDonationModal}
                            className="os-btn--fw-bold os-btn--gap-16"
                            icon={true}
                        >
                            Donate
                            <Img
                                src={'/img/icons/btn-arrow.svg'}
                                width={14}
                                height={14}
                            />
                        </Button>
                        {showModal && (
                            <Modal
                                show={showModal}
                                onClose={closeModal}
                                maxWidth="md"
                            >
                                <ModalContent
                                    modalType={modalType}
                                    modalData={null}
                                    user={user}
                                    closeModal={closeModal}
                                    setLoading={setLoading}
                                    setError={setError}
                                />
                            </Modal>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
