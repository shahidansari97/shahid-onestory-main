import './../../css/home.css';
import './../../css/form.css';
import './../../css/gift.css';
import heroBeyondImg from '../../img/section_2_video_screen_shot.png';
import Button from "@/Components/UI/Button.jsx";
import GuestLayout from '@/Layouts/GuestLayout';
import Carousel from "@/Components/Story/StoryCarousel.jsx";
import {Img} from "@/Components/UI/Content.jsx";
import Story from "@/Components/Story/Story.jsx";
import Modal from "@/Components/Modal.jsx";
import {useEffect, useState, useCallback, useMemo} from "react";
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
    // console.log('stories', stories);
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


    // Memoize event handlers to prevent unnecessary re-renders
    const openModal = useCallback((item, type, author) => {
        setModalData({item, author});
        setModalType(type);
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setModalData(null);
        setModalType(null);
        setActiveCardIndex(null);
        setError(false);
        setRefillSuccess(false);
    }, []);

    const handleGiftClick = useCallback((index) => {
        setActiveCardIndex(index);
    }, []);

    const [isMuted, setIsMuted] = useState(true);
    const [showPreloader, setShowPreloader] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [activeCarousel, setActiveCarousel] = useState(0); // Track which carousel is active

    const handleStart = useCallback(() => {
        try { window.__userInteracted = true; } catch(_) {}
        setIsMuted(false);
        setShowPreloader(false);
        setIsPlaying(true);
    }, []);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
            setShowPreloader(true);
            localStorage.setItem('hasVisited', 'true');
        } else {
            try { window.__userInteracted = true; } catch(_) {}
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

                        <div className="os-story__content addmore-css os-hero-beyond">
                                <div className="os-hero-beyond__header">
                                    <h2 className="os-hero-beyond__title">For stories beyond the feed</h2>
                                    <p className="os-hero-beyond__subtitle">Private By Default</p>
                                </div>
                                <div className="os-hero-beyond__image-wrap">
                                    <div className="os-hero-beyond__image">
                                        <img src={heroBeyondImg} alt="" className="os-hero-beyond__img" />
                                    </div>
                                </div>
                                <div className="os-stories-carousel-overlap">
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
                                </div>
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
                                <div className="stories-text">
                                    <p>Welcome to a new kind of social network. One where your story is the spotlight and your voice is celebrated. Here you&apos;re free to be real, to share your truth, and to recognize the beauty of your unique path. No judgment. No noise. Just meaningful connections, a community that lifts you up.</p>
                                </div>
                                <Button tag="a" href={route('stories.allStories')} fontWeight="bold" fontSize="m" padding="l" className="">All Stories</Button>
                            </div>
                            <div className="os-hero addmore-css">
                                <div className="top-title">
                                    <div className="os-title os-title-home"> Your story can </div>
                                    <div className="os-title os-title-home"> Make a Difference </div>
                                </div>

                                <div className="os-hero__video">
                                    <StoryCarousel 
                                        stories={orderedStories} 
                                        isMuted={isMuted} 
                                        isPlaying={isPlaying && activeCarousel === 1}
                                        setIsPlaying={setIsPlaying} 
                                        fullControl={false}
                                        onFocus={() => setActiveCarousel(1)}
                                    />
                                </div>

                                {hero?.textUnderVideo && (
                                    <div className="os-hero__text">
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia provident magnam libero. Vero earum hic corrupti laborum velit quae culpa nisi quo eaque eligendi. Adipisci, facilis ab! Ab, voluptatum optio labore ut nisi deserunt praesentium laboriosam earum consectetur est commodi, suscipit mollitia officia, unde itaque doloribus incidunt ipsam! A, quia dolorem quisquam pariatur dicta laborum. Nemo cupiditate aliquam deserunt deleniti aspernatur ea eligendi sit perferendis eveniet fugit vitae iure qui quia facere reiciendis ducimus dolor delectus suscipit quidem, architecto sapiente at? Esse, sunt qui, adipisci reiciendis praesentium et eaque consequuntur recusandae quod saepe provident nam, numquam perferendis ipsum similique iste.</p>
                                    </div>
                                )}
                                <Button tag={'a'} href="" fontWeight={'bold'}
                                        padding={'l'}
                                        fontSize={'m'}
                                        className={''}>Our Story</Button>
                            </div>
                            <div className="os-hero addmore-css ">
                                <div className="os-gradient-bg os-gradient-bg--w-90"></div>
                                <div className="top-title" style={{'padding':'0px'}}>

                <div className="os-title os-title-home"> Stories That Inspire </div>
                <div className="os-title os-title-home"> Voice That Shine  </div>
</div>

                                <div className="os-hero__video">
                                    <StoryCarousel 
                                        stories={orderedStories} 
                                        isMuted={isMuted} 
                                        isPlaying={isPlaying && activeCarousel === 2}
                                        setIsPlaying={setIsPlaying} 
                                        fullControl={true} 
                                        isPopup={true}
                                        onFocus={() => setActiveCarousel(2)}
                                    />
                                </div>

                                {hero?.textUnderVideo && (
                                    <div className="os-hero__text">
                                        {hero.textUnderVideo}
                                    </div>
                                )}

<Button tag={'a'} href="" fontWeight={'bold'}
                                        padding={'l'}
                                        fontSize={'m'}
                                        className={''}>Share Your Story</Button>
                            </div>
                        </div>
                        <div className="os-story">
                            {/* <div className="os-story__title-block">
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
                            </div> */}
                            {/* <div className="os-story__content">
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
                            </div> */}
                        </div>
                    </GuestLayout>
                )
            }
        </>
    );
};
