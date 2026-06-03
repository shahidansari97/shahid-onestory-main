import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import './../../css/popup.css';
import { Img } from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";

export default function Popup({ title, imgSrc, href, btnText, variant = 'donate', children, className, delay = 3000 }) {
    const [show, setShow] = useState(false);

    const close = () => {
        setShow(false);
        localStorage.setItem(`${variant}_popupClosed`, 'true');
    };

    useEffect(() => {
        const popupClosed = localStorage.getItem(`${variant}_popupClosed`);
        if (!popupClosed) {
            const timer = setTimeout(() => {
                setShow(true);
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [delay, variant]);

    return (
        <div className={`os-popup os-popup--${variant} ${show ? 'os-popup--visible' : ''}`}>
            <div className="os-popup__top">
                <div className="os-title os-title--h5">
                    {title}
                </div>
                <div onClick={close} className="os-popup__close">
                    <Img src='/img/popup/close.svg' width={13} height={13} />
                </div>
            </div>
            <Img
                src={imgSrc}
            />
            <div className="os-popup__body">
                {children}

                <Button
                    tag='a'
                    className="os-btn--fw-bold os-btn--gap-16"
                    href={href}
                    icon={true}
                >
                    {btnText}
                    <Img
                        src={'/img/icons/btn-arrow.svg'}
                        width={14}
                        height={14}
                    />
                </Button>
            </div>
        </div>
    );
}
