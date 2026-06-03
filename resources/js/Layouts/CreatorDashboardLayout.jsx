import { Link, usePage } from '@inertiajs/react';
import Header from "@/Components/Header.jsx";
import CreatorFooter from "@/Components/CreatorFooter.jsx";
import Popup from "@/Components/Popup.jsx";
import Button from "@/Components/UI/Button.jsx";
import { useEffect, useState } from "react";
import useIsDesktop from '@/Hooks/useIsDesktop';
import GoogleAnalyticsTracker from '@/Components/GoogleAnalyticsTracker';
export default function CreatorDashboard({ className, children, addContainer = true }) {
    const { auth, pollPopup, donationPopup } = usePage().props;
    const siteSettings = window.siteSettings[0];
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
                <Header />
            )}
            {/* {isHomePage === false && (
                <div className='os-container os-container--lg'>
                    <Button
                        onClick={handleBackClick}
                        variant="grey"
                        padding={'s'}
                        icon={true}
                        gap={16}
                        className={'os-btn--back'}
                    >
                        <img src='/img/icons/arrow-left.svg' alt="Back" />
                        Back
                    </Button>
                </div>
            )} */}
            <div className="os-main-page">
                <div className={addContainer ? 'os-container' : ''}>
                    <GoogleAnalyticsTracker />
                    {children}
                </div>
            </div>

            <CreatorFooter />
        </div>
    );
}
