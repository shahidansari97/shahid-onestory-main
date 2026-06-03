import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Button from "@/Components/UI/Button.jsx";
import './../../css/help-tutorial-modal.css';

const defaultSteps = [
    {
        title: "How to use red marker",
        description: "Learn how to use the red marker feature in the video editor",
    },
    {
        title: "How to add Animation",
        description: "Discover how to add animations to your video elements",
    },
    {
        title: "How to move Element",
        description: "Learn how to move and position elements in your video",
    },
    {
        title: "How to split and Delete Element",
        description: "Master splitting and deleting elements in your timeline",
    },
];

export default function HelpTutorialModal({ 
    open = false, 
    onClose = () => {},
    videoUrls = {}
}) {
    const [currentStep, setCurrentStep] = useState(0);
    const [videoError, setVideoError] = useState(null);
    const [videoLoading, setVideoLoading] = useState(true);
    const videoRef = useRef(null);

    // Map video URLs to steps
    const steps = defaultSteps.map((step, index) => {
        let videoUrl;
        switch (index) {
            case 0:
                videoUrl = videoUrls.redMarker;
                break;
            case 1:
                videoUrl = videoUrls.animation;
                break;
            case 2:
                videoUrl = videoUrls.moveElement;
                break;
            case 3:
                videoUrl = videoUrls.splitDelete;
                break;
            default:
                videoUrl = null;
        }
        return { ...step, videoUrl };
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setVideoError(null);
            setVideoLoading(true);
            // Reset video when step changes
            if (videoRef.current) {
                videoRef.current.load();
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setVideoError(null);
            setVideoLoading(true);
            // Reset video when step changes
            if (videoRef.current) {
                videoRef.current.load();
            }
        }
    };

    const handleStepClick = (stepIndex) => {
        setCurrentStep(stepIndex);
        setVideoError(null);
        setVideoLoading(true);
        // Reset video when step changes
        if (videoRef.current) {
            videoRef.current.load();
        }
    };

    const handleClose = () => {
        setCurrentStep(0);
        setVideoError(null);
        setVideoLoading(true);
        // Pause video when closing
        if (videoRef.current) {
            videoRef.current.pause();
        }
        onClose();
    };

    const currentStepData = steps[currentStep];

    // Auto-play video when modal opens or step changes
    useEffect(() => {
        if (open && videoRef.current && currentStepData?.videoUrl) {
            const video = videoRef.current;
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Autoplay was prevented, user will need to interact
                    console.log('Autoplay prevented:', error);
                });
            }
        }
    }, [open, currentStep, currentStepData?.videoUrl]);

    return (
        <Transition show={open} leave="modal__transition-leave">
            <Dialog
                as="div"
                className="modal help-tutorial-modal"
                onClose={handleClose}
            >
                <TransitionChild
                    enter="modal__content-transition-enter"
                    enterFrom="modal__content-transition-enter-from"
                    enterTo="modal__content-transition-enter-to"
                    leave="modal__content-transition-leave"
                    leaveFrom="modal__content-transition-leave-from"
                    leaveTo="modal__content-transition-leave-to"
                >
                    <DialogPanel className="modal__panel modal__panel--help-tutorial">
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="help-tutorial-modal__close"
                            aria-label="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Header */}
                        <div className="help-tutorial-modal__header">
                            <h2 className="help-tutorial-modal__title">
                                Video Editor Tutorial
                            </h2>
                        </div>

                        {/* Content Area */}
                        <div className="help-tutorial-modal__content">
                            {/* Left Column - Video Content */}
                            <div className="help-tutorial-modal__video-container">
                                <div className="help-tutorial-modal__video-wrapper">
                                    {currentStepData.videoUrl ? (
                                        <>
                                            {videoLoading && !videoError && (
                                                <div className="help-tutorial-modal__loading">
                                                    <div className="help-tutorial-modal__spinner"></div>
                                                    <p className="help-tutorial-modal__loading-text">Loading video...</p>
                                                </div>
                                            )}
                                            {videoError ? (
                                                <div className="help-tutorial-modal__error">
                                                    <Play className="help-tutorial-modal__error-icon" />
                                                    <p className="help-tutorial-modal__error-text">Failed to load video</p>
                                                    <p className="help-tutorial-modal__error-detail">{videoError}</p>
                                                    <Button
                                                        variant="outline"
                                                        padding="s"
                                                        onClick={() => {
                                                            setVideoError(null);
                                                            setVideoLoading(true);
                                                            if (videoRef.current) {
                                                                videoRef.current.load();
                                                            }
                                                        }}
                                                    >
                                                        Retry
                                                    </Button>
                                                </div>
                                            ) : (
                                                <video
                                                    ref={videoRef}
                                                    key={currentStepData.videoUrl}
                                                    src={currentStepData.videoUrl}
                                                    controls
                                                    className="help-tutorial-modal__video"
                                                    preload="auto"
                                                    playsInline
                                                    autoPlay
                                                    muted
                                                    onLoadStart={() => {
                                                        setVideoLoading(true);
                                                        setVideoError(null);
                                                    }}
                                                    onCanPlay={() => {
                                                        setVideoLoading(false);
                                                        setVideoError(null);
                                                        // Ensure video plays when ready
                                                        if (videoRef.current) {
                                                            videoRef.current.play().catch(err => {
                                                                console.log('Autoplay prevented:', err);
                                                            });
                                                        }
                                                    }}
                                                    onError={(e) => {
                                                        setVideoLoading(false);
                                                        const target = e.target;
                                                        const error = target.error;
                                                        let errorMessage = 'Failed to load video';
                                                        if (error) {
                                                            switch (error.code) {
                                                                case error.MEDIA_ERR_ABORTED:
                                                                    errorMessage = 'Video loading aborted';
                                                                    break;
                                                                case error.MEDIA_ERR_NETWORK:
                                                                    errorMessage = 'Network error while loading video';
                                                                    break;
                                                                case error.MEDIA_ERR_DECODE:
                                                                    errorMessage = 'Video decoding error';
                                                                    break;
                                                                case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                                                                    errorMessage = 'Video format not supported';
                                                                    break;
                                                                default:
                                                                    errorMessage = `Error code: ${error.code}`;
                                                            }
                                                        }
                                                        setVideoError(errorMessage);
                                                        console.error('Video loading error:', errorMessage, 'Source:', target.src);
                                                    }}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                        </>
                                    ) : (
                                        <div className="help-tutorial-modal__placeholder">
                                            <Play className="help-tutorial-modal__placeholder-icon" />
                                            <p className="help-tutorial-modal__placeholder-text">
                                                Video tutorial coming soon
                                                <br />
                                                <span className="help-tutorial-modal__placeholder-step">
                                                    Step {currentStep + 1} of {steps.length}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Tutorial Steps */}
                            <div className="help-tutorial-modal__steps-container">
                                <div className="help-tutorial-modal__steps">
                                    {steps.map((step, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleStepClick(index)}
                                            className={`help-tutorial-modal__step ${
                                                index === currentStep
                                                    ? 'help-tutorial-modal__step--active'
                                                    : index < currentStep
                                                    ? 'help-tutorial-modal__step--completed'
                                                    : ''
                                            }`}
                                        >
                                            <div className="help-tutorial-modal__step-number">
                                                {index + 1}
                                            </div>
                                            <div className="help-tutorial-modal__step-content">
                                                <p className="help-tutorial-modal__step-title">
                                                    {step.title}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Footer */}
                        <div className="help-tutorial-modal__footer">
                            <Button
                                variant="outline"
                                padding="s"
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="help-tutorial-modal__nav-text">Previous</span>
                            </Button>

                            <div className="help-tutorial-modal__step-indicator">
                                Step {currentStep + 1} of {steps.length}
                            </div>

                            <Button
                                variant="primary"
                                padding="s"
                                onClick={currentStep === steps.length - 1 ? handleClose : handleNext}
                            >
                                <span className="help-tutorial-modal__nav-text">
                                    {currentStep === steps.length - 1 ? "Finish" : "Next"}
                                </span>
                                {currentStep < steps.length - 1 && (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}

