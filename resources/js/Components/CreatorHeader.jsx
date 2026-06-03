import { Link, usePage, router } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import { Img } from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import { useEffect, useState } from "react";
import useIsDesktop from "@/Hooks/useIsDesktop";
import useUserMedia from "@/Hooks/useUserMedia";
import { useEditorRedirectionContext } from "@/Contexts/EditorRedirectionContext";
import { trackCreateStoryClick } from '@/Utils/analytics';
import '../../css/creator.css';

import {
    Bell, User
} from "lucide-react";


// Temporarily disabled
// import HelpTutorialModal from "@/Components/HelpTutorialModal.jsx";
// import { HelpCircle } from "lucide-react";
export default function CreatorHeader() {
    const { auth } = usePage().props;
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    // Temporarily disabled
    // const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const { media } = useUserMedia(auth?.user?.id);
    const editorRedirection = useEditorRedirectionContext();
    const { url } = editorRedirection;

    // console.log("Auth in Headerssssssss-->", media);
    const toggleNav = () => {
        setIsNavOpen((prev) => !prev);
    };

    const isMobile = useIsDesktop(992);
    const toggleUserMenu = () => {
        setIsUserMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        document.body.classList.toggle('os-body--dropdown-open', isNavOpen || isUserMenuOpen);
        return () => {
            document.body.classList.remove('os-body--dropdown-open');
        };
    }, [isNavOpen, isUserMenuOpen]);

    const headerLinks = [
        { href: '/', label: 'Home' },
        { href: route('about-page.index'), label: 'About' },
        { href: route('stories.allStories'), label: 'All stories' },
        { href: route('connect-with-us.index'), label: 'Connect' },
    ];

    const renderLinks = (Component) =>
        headerLinks.map((link) => (
            <Component key={link.label} href={link.href}>
                {link.label}
            </Component>
        ));

    const DropdownCloseIcon = () => (
        <div className='os-dropdown__close os-dropdown__close--is-visible'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                viewBox="0 0 18 18" fill="none">
                <path
                    d="M17.4 0.613387C17.2766 0.489783 17.1301 0.391719 16.9688 0.324811C16.8075 0.257902 16.6346 0.223462 16.46 0.223462C16.2854 0.223462 16.1125 0.257902 15.9512 0.324811C15.7899 0.391719 15.6433 0.489783 15.52 0.613387L8.99999 7.12005L2.47999 0.600054C2.35655 0.476611 2.21 0.378691 2.04872 0.311885C1.88743 0.245078 1.71457 0.210693 1.53999 0.210693C1.36542 0.210693 1.19255 0.245078 1.03127 0.311885C0.869983 0.378691 0.723435 0.476611 0.599993 0.600054C0.47655 0.723496 0.37863 0.870044 0.311824 1.03133C0.245017 1.19261 0.210632 1.36548 0.210632 1.54005C0.210632 1.71463 0.245017 1.88749 0.311824 2.04878C0.37863 2.21006 0.47655 2.35661 0.599993 2.48005L7.11999 9.00005L0.599993 15.5201C0.47655 15.6435 0.37863 15.79 0.311824 15.9513C0.245017 16.1126 0.210632 16.2855 0.210632 16.4601C0.210632 16.6346 0.245017 16.8075 0.311824 16.9688C0.37863 17.1301 0.47655 17.2766 0.599993 17.4001C0.723435 17.5235 0.869983 17.6214 1.03127 17.6882C1.19255 17.755 1.36542 17.7894 1.53999 17.7894C1.71457 17.7894 1.88743 17.755 2.04872 17.6882C2.21 17.6214 2.35655 17.5235 2.47999 17.4001L8.99999 10.8801L15.52 17.4001C15.6434 17.5235 15.79 17.6214 15.9513 17.6882C16.1126 17.755 16.2854 17.7894 16.46 17.7894C16.6346 17.7894 16.8074 17.755 16.9687 17.6882C17.13 17.6214 17.2765 17.5235 17.4 17.4001C17.5234 17.2766 17.6214 17.1301 17.6882 16.9688C17.755 16.8075 17.7894 16.6346 17.7894 16.4601C17.7894 16.2855 17.755 16.1126 17.6882 15.9513C17.6214 15.79 17.5234 15.6435 17.4 15.5201L10.88 9.00005L17.4 2.48005C17.9067 1.97339 17.9067 1.12005 17.4 0.613387Z"
                    fill="#BDBDBD" />
            </svg>
        </div>
    );

    const HamburgerIcon = () => (
        <div className="os-header__hamburger">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                viewBox="0 0 52 52" fill="none">
                <g clipPath="url(#clip0_1585_2585)">

                    <rect x="0.75" y="0.75" width="50.5" height="50.5" rx="4" ry="4" fill="#c3b5f5" stroke="#BDBDBD" strokeWidth="1.5" />

                    <path
                        d="M15 35H37C37.55 35 38 34.55 38 34C38 33.45 37.55 33 37 33H15C14.45 33 14 33.45 14 34C14 34.55 14.45 35 15 35ZM15 27H37C37.55 27 38 26.55 38 26C38 25.45 37.55 25 37 25H15C14.45 25 14 25.45 14 26C14 26.55 14.45 27 15 27ZM14 19C14 19.55 14.45 20 15 20H37C37.55 20 38 19.55 38 19C38 18.45 37.55 18 37 18H15C14.45 18 14 18.45 14 19Z"
                        fill="white" />
                </g>
                <defs>
                    <clipPath id="clip0_1585_2585">
                        <rect width="52" height="52" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );

    const ProfileIcon = () => (
        <>
            {auth?.user?.avatar ?
                <Img src={auth?.user?.avatar} alt="Profile" width={52}
                    className="os-header__profile-img" />
                : ''}
        </>
    );

    const NavDropdownContent = () => (
        <>
            {renderLinks(Dropdown.Link)}

            {!auth.user && (
                <>
                    <div className="os-delimeter os-delimeter--sm"></div>
                    <Dropdown.Link href={route('login')}>Log In</Dropdown.Link>
                    <Dropdown.Link href={route('register')}>Sign Up</Dropdown.Link>
                </>
            )}
        </>
    );



    return (
        <nav className="w-full border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-2 creator-header-logo">
                    <ApplicationLogo />
                </Link>
                {/* <div className="flex items-center gap-2 creator-header-logo">
                    <ApplicationLogo />
                </div> */}

                {/* Right: Icons */}
                <div className="flex items-center gap-5">
                    <button className="relative">
                        <Bell className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                        {/* Notification dot */}
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>

                    <button>
                        <User className="h-6 w-6 text-gray-600 hover:text-gray-900" />
                    </button>
                </div>

            </div>
        </nav>
    );
}
