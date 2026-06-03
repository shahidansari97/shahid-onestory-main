import React from 'react';
import Button from "@/Components/UI/Button.jsx";
import { Img } from "@/Components/UI/Content.jsx";

export default function CreateOurStoryModal({ onClose, onCreateStory }) {
    return (
        <div className="os-create-our-story-modal">
            <div className="os-create-our-story-modal__content">
                <div className="os-create-our-story-modal__header">
                    <h2 className="os-title os-title--h2">Create Our Story</h2>
                    <p className="os-text os-text--center">
                        Share your story and inspire others. Let's create something amazing together!
                    </p>
                </div>
                
                <div className="os-create-our-story-modal__body">
                    <div className="os-create-our-story-modal__icon">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="80" 
                            height="80" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            style={{ color: '#FFD700' }}
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                            <path d="M2 12l10 5 10-5"></path>
                        </svg>
                    </div>
                    
                    <p className="os-text os-text--center os-text--sm" style={{ marginTop: '20px', marginBottom: '30px' }}>
                        Click the button below to start creating your story
                    </p>
                </div>
                
                <div className="os-create-our-story-modal__footer">
                    <Button
                        onClick={onCreateStory}
                        tag="button"
                        variant="primary"
                        fontWeight="bold"
                        padding="l"
                        fontSize="m"
                        icon={true}
                        fullWidth={true}
                        style={{ fontSize: '18px', padding: '16px 32px' }}
                    >
                        Create Our Story
                        <Img
                            src={'img/icons/btn-arrow.svg'}
                            width={14}
                            height={14}
                        />
                    </Button>
                    
                    <Button
                        onClick={onClose}
                        tag="button"
                        variant="grey"
                        padding="m"
                        style={{ marginTop: '12px' }}
                    >
                        Maybe Later
                    </Button>
                </div>
            </div>
        </div>
    );
}