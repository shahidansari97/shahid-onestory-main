import './../../../css/gift.css';
import './../../../css/profile.css';
import './../../../css/story.css';
import './../../../css/tabs.css';
import './../../../css/form.css';
import React, {useEffect, useRef, useState} from "react";
import GuestLayout from '@/Layouts/GuestLayout';
import {Img} from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import Story from "@/Components/Story/Story.jsx";
import Modal from "@/Components/Modal.jsx";
import VideoPlayer from "@/Components/Video/VideoPlayer.jsx";
import ShareModal from "@/Components/Modals/ShareModal.jsx";
import axios from "axios";
import {Head} from "@inertiajs/react";

export default function Index({ user, coins, gifts, stories }) {
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [activeCardIndex, setActiveCardIndex] = useState(null);
    const [error, setError] = useState(false);
    const [sortOrder, setSortOrder] = useState('oldest');
    const [isPrevVisible, setIsPrevVisible] = useState(false);
    const [isNextVisible, setIsNextVisible] = useState(false);
    const [storiesList, setStoriesList] = useState(stories);

    const giftsRef = useRef(null);

    const handlePrevClick = () => {
        if (giftsRef.current) {
            giftsRef.current.scrollBy({ left: -150, behavior: 'smooth' });
        }
    };

    const handleNextClick = () => {
        if (giftsRef.current) {
            giftsRef.current.scrollBy({ left: 150, behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        if (giftsRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = giftsRef.current;

            setIsPrevVisible(scrollLeft > 0);
            setIsNextVisible(scrollLeft + clientWidth < scrollWidth);
        }
    };

    useEffect(() => {
        const giftsContainer = giftsRef.current;
        if (giftsContainer) {
            giftsContainer.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            if (giftsContainer) {
                giftsContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        if (giftsRef.current) {
            const { scrollWidth, clientWidth } = giftsRef.current;
            setIsNextVisible(scrollWidth > clientWidth);
        }
    }, [gifts]);

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
    };
    const sortedStories = [...storiesList].sort((a, b) => {
        if (sortOrder === 'oldest') {
            return new Date(a.created_at) - new Date(b.created_at);
        } else {
            return new Date(b.created_at) - new Date(a.created_at);
        }
    });
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };
    const handleDeleteStory = async (storyId) => {
        if (storyId) {
            try {
                const response = await axios.post(route('user.stories.delete', {id: storyId}));

                if (response.status === 200) {
                    setStoriesList(prevStories => prevStories.filter(story => story.id !== storyId));
                    closeModal();
                }
            } catch (error) {
                console.error('Error deleting story:', error);
            }
        }
    };
    return (
        <GuestLayout>
            <Head title="Profile"/>
            <div className="os-profile">
                <div className="os-profile__hero">
                    <Img src={user.avatar} alt="Profile" className="os-profile__hero-img" height={250}/>
                    <div className="os-profile__hero-content">
                        <div className="os-profile__hero-content-top">
                            <div className='os-title--h3 os-title--bold'>
                                {user.name}
                            </div>
                            <Button
                                variant="outline"
                                tag={'a'}
                                href={route('user.profile.edit')}
                                fontWeight={'bold'}
                                fontSize={'xs'}
                                padding={'s'}
                            >
                                Edit profile
                            </Button>
                        </div>
                        <div className='os-title os-title--h5'>@{user.username}</div>
                        <div className='os-text'>{user.world_message}</div>
                    </div>
                </div>
                <div className="os-profile__gifts">
                    <div className="os-profile__gifts-title">
                        <div className="os-title os-title--h5 os-title--bold">My Gifts</div>
                        <div className="os-profile__gifts-count">
                            Gifts: <span className="os-text os-text--bold"> {gifts.length} </span>
                        </div>
                        <div className="os-profile__gifts-wallet-coins">
                            Coins:
                            <span className="os-text os-text--bold">{coins}</span>
                        </div>
                    </div>
                    <div className='os-profile__gifts-carousel'>
                        {isPrevVisible && (
                            <div
                                className="os-profile__gifts-carousel-control os-profile__gifts-carousel-control--prev"
                                onClick={handlePrevClick}
                            >
                                <Img
                                    src={'/img/icons/next.svg'}
                                    width={6}
                                    height={12}
                                />
                            </div>
                        )}
                        <div className="os-profile__gifts-carousel-wrapper" ref={giftsRef}>
                            {gifts.map((item, index) => (
                                <div
                                    key={index}
                                    className={`os-gift-card os-gift-card--profile ${activeCardIndex === index ? 'os-gift-card--active' : ''} ${
                                        error && activeCardIndex === index ? 'os-gift-card--error' : ''
                                    }`}
                                >
                                    <Img
                                        src={'/img/gift/' + item.picture}
                                        width={128}
                                        height={128}
                                    />
                                    <div>
                                        <div className="os-text os-text--sm os-text--bold">{item.name}</div>
                                        <div className="os-text os-text--sm">@{item.sender}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {isNextVisible && (
                            <div
                                className="os-profile__gifts-carousel-control os-profile__gifts-carousel-control--next"
                                onClick={handleNextClick}
                            >
                                <Img
                                    src={'/img/icons/next.svg'}
                                    width={6}
                                    height={12}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="os-profile__stories">
                    <div className="os-profile__stories-header">
                        <div className='os-title--h3 os-title--bold'>Stories</div>
                        <div className={'os-sort-stories'}>
                            <div className="os-text">Sort by date:</div>
                            <select value={sortOrder} onChange={handleSortChange} className="os-sort-stories__dropdown">
                                <option value="oldest">Oldest</option>
                                <option value="newest">Latest</option>
                            </select>
                        </div>
                    </div>
                    <div className="os-profile__stories-grid">
                        {sortedStories.map((item, index) => (
                            <Story
                                key={index}
                                item={item}
                                gift={false}
                                onOpenVideoModal={() => openModal(item, "video", item.author)}
                                onOpenShareModal={() => openModal(item.id, "share")}
                                onOpenDeleteModal={() => openModal(item.id, "delete")}
                                showDelete={true}
                            />
                        ))}
                    </div>
                </div>
                {showModal && modalData && (
                    <Modal
                        show={showModal}
                        onClose={closeModal}
                        maxWidth={modalType === 'share' || modalType === 'delete' ? 'lg' : 'xl'}
                        className={`modal__panel${modalType === 'deposit' ? '--deposit' : modalType === 'video' ? '--video' : ''}`}
                    >
                        {modalType === "video" && (
                            <VideoPlayer
                                video={modalData}
                                type={'story'}
                                height={500}
                                showStorytellerButtons={false}
                                onOpenShareModal={() => openModal(modalData.item.id, "share")}
                            />
                        )}
                        {modalType === "share" && (
                            <div className="modal-content">
                                <div className="os-gift-modal">
                                    <ShareModal story={modalData.item} />
                                </div>
                            </div>
                        )}
                        {modalType === "delete" && (
                            <div className="modal-content">
                                <div className={'os-form os-form--center'}>
                                <div className={'os-title os-title--h5 os-title--center'}>Are you sure you want to delete the story?</div>
                                <div className={'os-btns os-btns--center'}>
                                    <Button onClick={() => handleDeleteStory(modalData.item)} variant={'outline'}>Yes</Button>
                                    <Button onClick={closeModal}>No</Button>
                                </div>
                                </div>
                            </div>
                        )}
                    </Modal>
                )}
            </div>
        </GuestLayout>
    );
}
