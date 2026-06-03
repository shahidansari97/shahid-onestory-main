import '../../../css/gift.css';
import '../../../css/profile.css';
import '../../../css/story.css';
import '../../../css/form.css';
import React, { useEffect, useState, useCallback } from "react";
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import Story from "@/Components/Story/Story.jsx";
import Modal from "@/Components/Modal.jsx";
import Tabs from "@/Components/UI/Tabs.jsx";
import ModalContent from "@/Components/Modals/ModalContent.jsx";
import {Head, usePage} from "@inertiajs/react";
import axios from 'axios';

export default function Index({ storiesByCategory = {}, categories = [], gifts, sharedStory }) {
    const { success, message, new_balance, auth } = usePage().props;
    const user = auth.user;

    const [activeCategory, setActiveCategory] = useState(categories[0] || '');
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [activeCardIndex, setActiveCardIndex] = useState(null);
    const [wallet, setWallet] = useState();
    const [error, setError] = useState(false);
    const [activeDepositCard, setActiveDepositCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refillSuccess, setRefillSuccess] = useState(false);
    const [storiesData, setStoriesData] = useState(storiesByCategory);
    const [page, setPage] = useState({});

    useEffect(() => {
        if (sharedStory) {
            openModal(sharedStory, "video", sharedStory.author);
        }
    }, [sharedStory ]);

    useEffect(() => {
        if (categories.length) {
            const initialPage = categories.reduce((acc, category) => {
                acc[category] = 2;
                return acc;
            }, {});
            setPage(initialPage);
        }
    }, [categories]);

    const openModal = (item, type, author) => {
        setModalData({ item, author });
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
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const refillSuccessParam = params.get('refill_success');

        if (refillSuccessParam === '1') {
            openModal(null, "refill-success");

            const url = new URL(window.location);
            params.delete('refill_success');
            window.history.replaceState({}, '', url.pathname);
        }
    }, []);
    const handleGiftClick = (index) => {
        setActiveCardIndex(index);
    };

    const loadMoreStories = useCallback(async (category) => {
        if (loading || !storiesData[category] || storiesData[category].currentPage >= storiesData[category].lastPage) {
            return;
        }

        setLoading(true);

        try {
            const currentPage = page[category] || 1;
            const response = await axios.get(`/all-stories/load-more-stories/${category}`, {
                params: { page: currentPage },
            });

            setStoriesData((prevData) => {
                const updatedStories = response.data.stories;
                const existingStories = prevData[category]?.stories || [];

                return {
                    ...prevData,
                    [category]: {
                        ...prevData[category],
                        stories: [...existingStories, ...updatedStories],
                        currentPage: response.data.currentPage,
                        lastPage: response.data.lastPage,
                    },
                };
            });

            setPage((prevPages) => ({
                ...prevPages,
                [category]: currentPage + 1,
            }));
        } catch (error) {
            console.error('Error loading more stories:', error);
        } finally {
            setLoading(false);
            console.log('Loading state set to false');
        }
    }, [loading, page, storiesData]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.documentElement.scrollHeight - 100;

            if (scrollPosition >= threshold && !loading) {
                loadMoreStories(activeCategory);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [activeCategory, loading, loadMoreStories]);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    return (
        <GuestLayout>
            <Head title='Stories' />
            <Tabs categories={categories} onTabChange={handleCategoryChange} enableScrolling={true}>
                {categories.map((category, index) => (
                    <div key={index} className="os-profile__stories-grid os-profile__stories-grid--all-stories">
                        {storiesData[category]?.stories?.map((item) => (
                            <Story
                                key={item.id}
                                item={item}
                                displayGift={true}
                                onOpenGiftModal={() => openModal(item, "gift", item.author)}
                                onOpenVideoModal={() => openModal(item, "video", item.author)}
                                onOpenShareModal={() => openModal(item.id, "share")}
                            />
                        ))}
                    </div>
                ))}
            </Tabs>

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
