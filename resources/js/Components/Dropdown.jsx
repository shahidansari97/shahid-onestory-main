import { useState, createContext, useContext } from 'react';
import { Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

const DropDownContext = createContext();

const Dropdown = ({ children, onOpenChange, open: controlledOpen }) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpenState = (value) => {
        if (!isControlled) {
            setInternalOpen(value);
        }
        onOpenChange?.(value);
    };

    const toggleOpen = () => {
        setOpenState(!open);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen: setOpenState, toggleOpen }}>
            <div className="dropdown">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div className="dropdown__trigger" onClick={toggleOpen}>{children}</div>

            {open && <div className="dropdown__overlay" onClick={() => setOpen(false)}></div>}
        </>
    );
};

const Content = ({ align = 'right', width = '48', contentClasses = 'dropdown__content-inner', children }) => {
    const { open, setOpen } = useContext(DropDownContext);

    let alignmentClasses = 'dropdown__content--origin-top';

    if (align === 'left') {
        alignmentClasses = 'dropdown__content--left';
    } else if (align === 'right') {
        alignmentClasses = 'dropdown__content--right';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'dropdown__content--width-48';
    }

    return (
        <>
            <Transition
                show={open}
                enter="dropdown__transition--enter"
                enterFrom="dropdown__transition--enter-from"
                enterTo="dropdown__transition--enter-to"
                leave="dropdown__transition--leave"
                leaveFrom="dropdown__transition--leave-from"
                leaveTo="dropdown__transition--leave-to"
            >
                <div
                    className={`dropdown__content ${alignmentClasses} ${widthClasses}`}
                    onClick={() => setOpen(false)}
                >
                    <div className={contentClasses}>{children}</div>
                </div>
            </Transition>
        </>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    const { setOpen } = useContext(DropDownContext);

    const handleClick = () => {
        setOpen(false);
    };

    return (
        <Link
            {...props}
            className={`dropdown__link ${className}`}
            onClick={handleClick}
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
