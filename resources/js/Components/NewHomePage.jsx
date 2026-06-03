import './../../css/home.css';
import './../../css/form.css';
import './../../css/gift.css';
import Button from "@/Components/UI/Button.jsx";
import GuestLayout from '@/Layouts/GuestLayout';
import Carousel from "@/Components/Story/StoryCarousel.jsx";
import {Img} from "@/Components/UI/Content.jsx";
import Story from "@/Components/Story/Story.jsx";
import Modal from "@/Components/Modal.jsx";
import {useEffect, useState} from "react";
import StoryCarousel from "@/Components/StoryCarousel.jsx";
import {Head, usePage} from "@inertiajs/react";
import ModalContent from "@/Components/Modals/ModalContent.jsx";
import Preloader from '@/Components/Preloader';

export default function Home({data}) {

    const {hero, story, stories, about, gifts} = data;
    const orderedStories = Object.values(story.storiesOrder);
    const {success, message, new_balance, auth, refill_success} = usePage().props;
    const user = auth.user;
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [customAmount, setCustomAmount] = useState(0.00);
    const [activeCardIndex, setActiveCardIndex] = useState(null);
    const [wallet, setWallet] = useState();
    const [error, setError] = useState(false);
    const [activeDepositCard, setActiveDepositCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refillSuccess, setRefillSuccess] = useState(false);

    useEffect(() => {
        if (success) {
            setWallet(new_balance);
            openModal(null, "success", modalData?.author);
        }
    }, [success, message, new_balance]);

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


    const openModal = (item, type, author) => {
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

    const [isMuted, setIsMuted] = useState(true);
    const [showPreloader, setShowPreloader] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    const handleStart = () => {
        setIsMuted(false);
        setShowPreloader(false);
        setIsPlaying(true);
    };

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
            setShowPreloader(true);
            localStorage.setItem('hasVisited', 'true');
        } else {
            setShowPreloader(false);
        }
    }, []);

    return (
        <>
            <Head title="Home"/>
            {
                showPreloader ? (
                    <Preloader onStart={handleStart}/>
                ) : (
                    <GuestLayout displayMenu={true} addContainer={false}>
                        <div className="os-container">
                            <div className="os-hero">
                                <div className="os-gradient-bg os-gradient-bg--w-90"></div>
                                <div className="os-hero__title-sec">
                                    {hero?.title && (
                                        <div className="os-title os-title--h1">{hero.title}</div>
                                    )}
                                    {hero?.subtitle1 && (
                                        <div className="os-hero__desc">{hero.subtitle1}</div>
                                    )}
                                    {hero?.subtitle2 && (
                                        <div className="os-hero__subtitle">{hero.subtitle2}</div>
                                    )}
                                </div>

                                <div className="os-hero__video">
                                    <StoryCarousel stories={orderedStories} isMuted={isMuted} isPlaying={isPlaying}
                                                   setIsPlaying={setIsPlaying}/>
                                </div>
                                <Button tag={'a'} href={route('user.stories.create')} fontWeight={'bold'}
                                        padding={'xxl'}
                                        fontSize={'m'}
                                        className={'os-btn--w-760'}>Share Your Story</Button>
                                {hero?.textUnderVideo && (
                                    <div className="os-hero__text">
                                        {hero.textUnderVideo}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="os-story">
                            <div className="os-story__title-block">
                                <div className="os-title os-title--h2">
                                    {story?.title}
                                </div>
                                <div className="os-title os-title--h6"
                                     dangerouslySetInnerHTML={{__html: story?.description}}>
                                </div>
                            </div>
                            <div className="os-story__btns">
                                <Button
                                    tag={'a'}
                                    href={route('user.stories.create')}
                                    fontWeight={'bold'}
                                    padding={'xxl'}
                                    fontSize={'m'}
                                >
                                    Share Your Story
                                </Button>
                                <Button tag={'a'} href={route('about-page.index') + '#create-story-section'}
                                        variant={'outline'} padding={'xl'} fontWeight={'bold'}>
                                    Create a story
                                </Button>
                            </div>
                            <div className="os-story__advice">
                                {story?.advice}
                            </div>
                            <div className="os-story__content">
                                <div className="os-gradient-bg"></div>
                                <Carousel items={stories}>
                                    {(item, index) => (
                                        <Story
                                            item={item}
                                            displayGift={true}
                                            onOpenGiftModal={() => openModal(item, "gift", item.author)}
                                            onOpenVideoModal={() => openModal(item, "video", item.author)}
                                            onOpenShareModal={() => openModal(item.id, "share",)}
                                        />
                                    )}
                                </Carousel>
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
                                <Button tag={'a'} href={route('stories.allStories')} fontWeight={'bold'} fontSize={'m'}
                                        padding={'xxl'} className={'os-btn--w-760'}>View all stories</Button>
                                <div className="os-story__columns-wrapper">
                                    <div className="os-story__columns">
                                        <div className="os-story__col">
                                            <div className="os-story__col-icon">
                                                <Img
                                                    src={`img/gear.svg`}
                                                    alt="play/pause"
                                                    width={64}
                                                    height={64}
                                                    className=""
                                                />
                                            </div>
                                            <div className="os-story__col-content">
                                                <div className="os-title os-title--h5 os-title--bold">
                                                    {story?.info?.setting?.title}
                                                </div>
                                                <div className="os-title os-title--h6">
                                                    {story?.info?.setting?.description}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="os-story__col">
                                            <div className="os-story__col-icon">
                                                <Img
                                                    src={`img/play.svg`}
                                                    alt="play/pause"
                                                    width={64}
                                                    height={64}
                                                    className=""
                                                />
                                            </div>
                                            <div className="os-story__col-content">
                                                <div className="os-title os-title--h5 os-title--bold">
                                                    {story?.info?.play?.title}
                                                </div>
                                                <div className="os-title os-title--h6">
                                                    {story?.info?.play?.description}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="os-story__col">
                                            <div className="os-story__col-icon">
                                                <Img
                                                    src={`img/heart.svg`}
                                                    alt="play/pause"
                                                    width={64}
                                                    height={64}
                                                    className=""
                                                />
                                            </div>
                                            <div className="os-story__col-content">
                                                <div className="os-title os-title--h5 os-title--bold">
                                                    {story?.info?.like?.title}
                                                </div>
                                                <div className="os-title os-title--h6">
                                                    {story?.info?.like?.description}
                                                </div>
                                            </div>
                                        </div>
                                        <Img
                                            src={`img/columns-line.png`}
                                            width={60}
                                            height={60}
                                            className="os-story__columns-line"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GuestLayout>
                )
            }
        </>
    );
};
