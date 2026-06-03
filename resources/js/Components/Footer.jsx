import React from 'react';
import { Link } from "@inertiajs/react";
import { Img } from "@/Components/UI/Content.jsx";

export default function Footer() {
    const siteSettings = window.siteSettings[0];
    return (
        <footer className='os-footer'>
            <div className='os-footer__left'>
                <Link href='/' >
                    <Img src="/img/logo.png" alt="Logo" className="os-footer__logo" width="270" />
                </Link>
            </div>
            <div className="os-footer__menu">
                <Link href={route('about-page.index')}>About</Link>
                <div className="footer-dropdown">
                    <span className="footer-dropdown-title">Privacy Policy</span>

                    <div className="footer-dropdown-menu">
                        <Link href={route('static.page', 'privacy-eu')}>
                            EU
                        </Link>

                        <Link href={route('static.page', 'privacy-us')}>
                            US
                        </Link>
                    </div>
                </div>
                <div className="footer-dropdown">
                    <span className="footer-dropdown-title">Manage Cookies</span>
                    <div className="footer-dropdown-menu">
                        <Link href={route('static.page', 'privacy-eu')}>
                            EU
                        </Link>

                        <Link href={route('static.page', 'privacy-us')}>
                            US
                        </Link>
                    </div><br/>

                </div>
                <Link href={route('share.info.index')}>Do Not Sale my Info</Link>
                {/* <Link href={route('static.page', 'privacy-eu')}>Privacy Policy</Link>
                <Link href={route('static.page', 'privacy-us')}>Privacy Policy US</Link> */}
                <Link href={route('static.page', 'terms-of-use')}>Terms of Use</Link>
                <Link href={route('connect-with-us.index')}>Connect</Link>
                {/* {siteSettings.voting_popup_enabled === 'true' ? (
                    <Link href={route('user.poll.index')}>Monthly Pol</Link>
                ) : (
                    <Link href={route('donation.index')}>Donate</Link>
                )} */}
            </div>
            <div className='os-footer__right'>
                © {(new Date().getFullYear())} OneStoryPlanet
            </div>
        </footer>
    );
}
