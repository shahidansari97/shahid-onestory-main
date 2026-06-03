import {Link, usePage} from '@inertiajs/react';
import Header from "@/Components/Header.jsx";
import Footer from "@/Components/Footer.jsx";
import Popup from "@/Components/Popup.jsx";
import Button from "@/Components/UI/Button.jsx";
import { FaArrowLeft } from "react-icons/fa";
import {useEffect, useState} from "react";
import useIsDesktop from '@/Hooks/useIsDesktop';
import GoogleAnalyticsTracker from '@/Components/GoogleAnalyticsTracker';
export default function Guest({className, children, addContainer = true}) {
    const {auth, pollPopup, donationPopup} = usePage().props;
    const siteSettings = (typeof window !== 'undefined' && window.siteSettings?.[0]) ? window.siteSettings[0] : {};
    const [isHomePage, setIsHomePage] = useState(null);
    const [isHeader, setIsHeader] = useState(false);
    const isDesktop = useIsDesktop(768);
    useEffect(() => {
        const path = window.location.pathname.split('/');
        setIsHomePage(path[1] === '' || path[1] === 'user-profile');
        setIsHeader(path[1] === 'followers' || path[1] === 'following');
    }, []);
    const shouldShowHeader = (isDesktop && isHeader) || !isHeader;
    const handleBackClick = () => {
        window.history.back();
    };
    return (
        <div className={className}>
            {shouldShowHeader && (
                <Header/>
            )}
            {isHomePage === false && (
                <div className='os-container os-container--lg'>
                    <Button
                        onClick={handleBackClick}
                        variant="grey"
                        padding={'s'}
                        icon={true}
                        gap={16}
                        className={'os-btn--back'}
                        // className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-transparent rounded-md"
                    >
                        <FaArrowLeft />
                        {/* <img src='/img/icons/arrow-left.svg' alt="Back"/> */}
                        Back
                    </Button>
                </div>

                // <Button
                //     onClick={handleBackClick}
                //     padding="s"
                //     icon={true}
                //     gap={16}
                //     className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-transparent rounded-md"
                // >
                //     <FaArrowLeft />
                //     Back
                // </Button>
            )}
            <div className="os-main-page">
                <div className={addContainer ? 'os-container' : ''}>
                    <GoogleAnalyticsTracker />
                    {children}
                </div>
            </div>
            {/* {auth.user ? (
                <>
                {siteSettings.voting_popup_enabled === 'true' ? (
                    <Popup
                        title={pollPopup?.title}
                        imgSrc={pollPopup?.src}
                        href={route('user.poll.index')}
                        btnText={'Vote'}
                        variant={'vote'}
                    >
                        {pollPopup?.content}
                    </Popup>
                ) : (
                    <Popup
                        title={donationPopup?.title}
                        imgSrc={donationPopup?.src}
                        href={route('donation.index')}
                        btnText={'Donate'}
                        delay={1000}
                    >
                        {donationPopup?.content}
                    </Popup>
                )}
                </>
            ) : ''} */}
            <Footer/>
        </div>
    );
}
