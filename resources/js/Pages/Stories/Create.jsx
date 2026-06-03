import '../../../css/auth.css';
import '../../../css/profile.css';
import '../../../css/gift.css';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import CreativeEditorSDKComponent from "@/Components/Video/CreativeEditorSDKComponent.jsx";
import ImageGenerator from "@/ImageGenerator.jsx";
import CreateStory from "@/Pages/Stories/Partials/CreateStory.jsx";
import React, {useEffect, useState} from "react";
import GuidedTour from '@/Components/GuidedTour';
import Button from "@/Components/UI/Button.jsx";
import {Head} from "@inertiajs/react";
import Modal from "@/Components/Modal.jsx";

export default function Create({auth, draft}) {
    const [videoData, setVideoData] = useState({videoName: '', videoUrl: ''});
    const [isTourActive, setIsTourActive] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);

    useEffect(() => {
        const isWelcomeShown = localStorage.getItem('welcomeShown');
        if (!isWelcomeShown) {
            setModalType('welcome');
            setShowModal(true);
        }
    }, []);

    const closeModal = () => {
        setShowModal(false);
        setModalType(null);
    };

    const handleVideoUpload = (data) => {
        setVideoData(data);
    };

    const startTour = () => {
        setIsTourActive(true);
    };

    const closeTour = () => {
        setIsTourActive(false);
    };
    const handleStartTutorial = () => {
        closeModal();
        startTour();
        localStorage.setItem('welcomeShown', 'true');
    };
    const steps = [
        {
            top: '180px',
            left: '8px',
            width: '75px',
            height: '540px',
            tooltipPosition: {top: '180px', bottom: 'auto', left: '95px'},
            content: {
                title: 'Add Elements',
                text: 'You can add all types of elements such as videos, images, and shapes.',
            },
        },
        {
            top: '400px',
            left: '8px',
            width: '75px',
            height: '75px',
            tooltipPosition: {top: '400px', bottom: 'auto', left: '95px'},
            content: {
                title: 'Add Audio',
                text: 'You can upload your own audio tracks to enhance your video.',
            },
        },
        {
            top: '125px',
            left: '110px',
            width: 'calc(100% - 180px)',
            height: '316px',
            tooltipPosition: {top: '450px', bottom: 'auto', left: '95px'},
            content: {
                title: 'Edit',
                text: 'Move elements on this area',
            },
        },
        {
            top: 'auto',
            bottom: '116px',
            left: '90px',
            width: 'calc(100% - 180px)',
            height: '94px',
            tooltipPosition: {top: 'auto', bottom: '223px', left: '95px'},
            content: {
                title: 'Edit',
                text: 'Arrange and move elements on the timeline to organize your video.',
            },
        },
        {
            top: '555px',
            left: '8px',
            width: '75px',
            height: '75px',
            tooltipPosition: {top: '430px', bottom: 'auto', left: '95px'},
            content: {
                title: 'Add Texts and Captions',
                text: 'Insert text layers for captions and additional information.',
            },
        },
        {
            top: '555px',
            left: '8px',
            width: '75px',
            height: '75px',
            tooltipPosition: {top: '430px', bottom: 'auto', left: '95px'},
            content: {
                title: 'Translate Your Video',
                text: 'Use text layers to add subtitles and translate your video.',
            },
        },
        {
            top: 'auto',
            bottom: '30px',
            left: '147px',
            width: '145px',
            height: '50px',
            tooltipPosition: {top: 'auto', bottom: '96px', left: '115px'},
            content: {
                title: 'Add clip',
                text: '\n' +
                    'Use add clip to add a new clip (video or image) to an existing editing project. The clip is integrated into the timeline, allowing for its editing and customization.',
            },
        },
        {
            top: '64px',
            left: '95px',
            width: '625px',
            height: '55px',
            tooltipPosition: {top: '128px', bottom: 'auto', left: '95px'},
            content: {
                title: 'Add Effects and Shapes',
                text: 'Enhance your video with effects, shapes, and transitions. Use fade to smoothly transition between clips by adjusting the duration for fade-in or fade-out effects',
            },
        },
        {
            top: '7px',
            left: 'calc(100% - 195px)',
            width: '182px',
            height: '45px',
            tooltipPosition: {top: '55px', bottom: 'auto', left: 'calc(100% - 324px)'},
            content: {
                title: 'Export',
                text: '😍 Once you are done, export your video in your preferred format.',
            },
        },
    ];

    return (
        <GuestLayout user={auth.user} addContainer={false}>
            <Head title="Create story"/>
            <div className={'os-container'}>
                <div className={'os-pc-content'}>
                    <div className={'os-editor-info'}>
                        <Button
                            onClick={startTour}
                            fontWeight={'bold'}
                            variant={'gradient'}
                            padding={'s'}
                            style={{
                                marginBottom: '20px',
                            }}
                        >
                            How to use Video Editor
                        </Button>
                        <div className='os-text'>
                            Please use only materials you own or have permission to use. Unauthorized use of copyrighted
                            content may lead to legal consequences. Thank you for respecting copyright laws!
                        </div>
                        <br/>
                    </div>
                    <Modal
                        show={showModal}
                        onClose={closeModal}
                        maxWidth={'md'}
                    >
                        <div className="modal-content">
                            <div className="os-gift-modal">
                                <h2 className='os-title os-title--h3 os-title--center'>Welcome!</h2>
                                <p className='os-text'>Would you like to view a tutorial?</p>
                                <Button onClick={handleStartTutorial} fontWeight='bold'>View the tutorial</Button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
            <div className="os-profile os-profile--editor">
                <div className={'os-gide'}>
                    <GuidedTour steps={steps} isTourActive={isTourActive} onClose={closeTour}/>
                    <CreativeEditorSDKComponent onVideoUpload={handleVideoUpload} initialScene={draft}/>
                </div>
                <div className={'os-container'}>
                    <div className="os-profile__create-story">
                        <div className="os-pc-content">
                            <ImageGenerator/>
                        </div>
                        <CreateStory videoData={videoData}/>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
