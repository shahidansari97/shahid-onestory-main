import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import './../../css/modal.css';
import {Img} from "@/Components/UI/Content.jsx";
export default function Modal({ children, show = false, maxWidth = 'xl', closeable = true, onClose = () => {}, className }) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'modal__panel--sm',
        md: 'modal__panel--md',
        lg: 'modal__panel--lg',
        xl: 'modal__panel--xl',
        '2xl': 'modal__panel--2xl',
    }[maxWidth];

    return (
        <Transition show={show} leave="modal__transition-leave">
            <Dialog
                as="div"
                id="modal"
                className="modal"
                onClose={close}
            >
                <Img src='/img/modal/close.svg' width={128} height={128} className="modal__close" />
                <TransitionChild
                    enter="modal__content-transition-enter"
                    enterFrom="modal__content-transition-enter-from"
                    enterTo="modal__content-transition-enter-to"
                    leave="modal__content-transition-leave"
                    leaveFrom="modal__content-transition-leave-from"
                    leaveTo="modal__content-transition-leave-to"
                >
                    <DialogPanel className={`modal__panel ${maxWidthClass} ${className}`}>
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
