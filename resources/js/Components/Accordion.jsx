import React, { useState } from 'react';
import '../../css/accordion.css';

const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`os-accordion ${isOpen ? 'os-accordion--open' : ''}`}>
            <div className="os-accordion__header" onClick={toggleAccordion} dangerouslySetInnerHTML={{ __html: title }} />
            <div className={`os-accordion__content ${isOpen ? 'os-accordion__content--visible' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default Accordion;
