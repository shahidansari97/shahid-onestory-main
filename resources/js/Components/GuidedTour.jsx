import React, { useState } from 'react';

const GuidedTour = ({ steps, isTourActive, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isTourActive) {
        return null;
    }

    const { top, left, bottom, width, height, content, tooltipPosition } = steps[currentStep];

    return (
        <>
            <div
                className="highlight-box"
                style={{
                    position: 'absolute',
                    top: `${top}`,
                    bottom: `${bottom}`,
                    left: `${left}`,
                    width: `${width}`,
                    height: `${height}`,
                    border: '3px solid red',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 0, 0, 0.05)',
                    zIndex: 999,
                }}
            ></div>

            <div
                className="guided-tour-tooltip"
                style={{
                    position: 'absolute',
                    top: `${tooltipPosition.top}`,
                    bottom: `${tooltipPosition.bottom}`,
                    left: `${tooltipPosition.left}`,
                    width: '300px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#151617',
                    padding: '15px',
                    borderRadius: '8px',
                    zIndex: 1000,
                }}
            >
                <div className="tooltip-content">
                    <button
                        onClick={handleClose}
                        style={{
                            marginTop: '0px',
                            background: '#e74c3c',
                            border: 'none',
                            padding: '1px 10px',
                            color: 'white',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            position: 'absolute',
                            right: '10px',
                            top: '10px',
                        }}
                    >
                        x
                    </button>
                    <h3 style={{ paddingRight: '30px' }}>{content.title}</h3>
                    <p>{content.text}</p>
                </div>
                <div className="tooltip-navigation" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    {currentStep > 0 && (
                        <button
                            onClick={handlePrevious}
                            style={{ background: 'transparent', border: 'none', color: '#151617', cursor: 'pointer' }}
                        >
                            Previous
                        </button>
                    )}
                    {currentStep < steps.length - 1 && (
                        <button
                            onClick={handleNext}
                            style={{ background: 'transparent', border: 'none', color: '#151617', cursor: 'pointer' }}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default GuidedTour;
