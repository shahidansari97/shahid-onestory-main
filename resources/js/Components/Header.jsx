import { Link, usePage, router } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import { Img } from "@/Components/UI/Content.jsx";
// import "./../../../css/visitor.css";
import '../../css/visitor.css';
// D:\shahid\onestory-main-site\resources\css\visitor.css
import Button from "@/Components/UI/Button.jsx";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { useEffect, useId, useRef, useState } from "react";
import useIsDesktop from "@/Hooks/useIsDesktop";
import useUserMedia from "@/Hooks/useUserMedia";
import { redirectToDraftOrNewStory } from "@/Utils/draftVideo";
import { useEditorRedirectionContext } from "@/Contexts/EditorRedirectionContext";
import { trackCreateStoryClick } from '@/Utils/analytics';
// Temporarily disabled
// import HelpTutorialModal from "@/Components/HelpTutorialModal.jsx";
// import { HelpCircle } from "lucide-react";
export default function Header() {
    const { auth } = usePage().props;
    /* Guests: keep search visible after leaving home (e.g. opening a profile from results).
       Autocomplete is public (`users.autocomplete`); previously `route().current("home")` hid the whole control on any other page. */
    const showHeaderSearch = false;
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
    const [isOpeningEditor, setIsOpeningEditor] = useState(false);
    const searchBoxRef = useRef(null);
    const searchPopupRef = useRef(null);
    const searchInputRef = useRef(null);
    const profileChevronClipDesktop = useId().replace(/:/g, "");
    const profileChevronClipMobile = useId().replace(/:/g, "");
    // Temporarily disabled
    // const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const { media } = useUserMedia(auth?.user?.id);
    const editorRedirection = useEditorRedirectionContext();
    const { url } = editorRedirection;

    // console.log("Auth in Headerssssssss-->", media);
    const isWideHeader = useIsDesktop(992);
    const toggleUserMenu = () => {
        setIsUserMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        document.body.classList.toggle('os-body--dropdown-open', isUserMenuOpen || isNavOpen);
        return () => {
            document.body.classList.remove('os-body--dropdown-open');
        };
    }, [isUserMenuOpen, isNavOpen]);

    useEffect(() => {
        if (!showHeaderSearch) return;
        const onDocClick = (event) => {
            const t = event.target;
            if (searchBoxRef.current?.contains(t)) return;
            if (searchPopupRef.current?.contains(t)) return;
            setShowSuggestions(false);
            setIsSearchPopupOpen(false);
            if (!searchQuery.trim()) {
                setIsSearchExpanded(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [showHeaderSearch, searchQuery]);

    useEffect(() => {
        if (!isSearchPopupOpen) return;
        const onKey = (e) => {
            if (e.key === "Escape") {
                setIsSearchPopupOpen(false);
                setShowSuggestions(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isSearchPopupOpen]);

    useEffect(() => {
        if (!isSearchPopupOpen) return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isSearchPopupOpen]);

    useEffect(() => {
        if (!isSearchPopupOpen) return;
        const id = requestAnimationFrame(() => {
            searchInputRef.current?.focus();
        });
        return () => cancelAnimationFrame(id);
    }, [isSearchPopupOpen]);

    useEffect(() => {
        if (!isWideHeader) {
            setIsSearchExpanded(false);
        }
    }, [isWideHeader]);

    useEffect(() => {
        if (isWideHeader && isSearchPopupOpen) {
            setIsSearchPopupOpen(false);
        }
    }, [isWideHeader, isSearchPopupOpen]);

    useEffect(() => {
        if (!showHeaderSearch) return;
        const q = searchQuery.trim();
        if (!q) {
            setUserSuggestions([]);
            setIsSearchLoading(false);
            return;
        }

        let isCancelled = false;
        setIsSearchLoading(true);

        const timer = setTimeout(async () => {
            try {
                const response = await axios.get(route("users.autocomplete"), {
                    params: { q },
                    headers: { Accept: "application/json" },
                });
                if (!isCancelled) {
                    setUserSuggestions(
                        Array.isArray(response?.data?.data) ? response.data.data : []
                    );
                }
            } catch (_) {
                if (!isCancelled) {
                    setUserSuggestions([]);
                }
            } finally {
                if (!isCancelled) {
                    setIsSearchLoading(false);
                }
            }
        }, 220);

        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [showHeaderSearch, searchQuery]);

    const handleSelectSuggestion = (userId) => {
        setShowSuggestions(false);
        setSearchQuery("");
        setUserSuggestions([]);
        setIsSearchExpanded(false);
        setIsSearchPopupOpen(false);
        router.visit(`/user-profile/${userId}`);
    };

    const handleSearchIconClick = () => {
        setShowSuggestions(true);
        if (isWideHeader) {
            setIsSearchExpanded(true);
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 0);
        } else {
            setIsSearchPopupOpen(true);
        }
    };

    const closeHeaderSearchPopup = () => {
        setIsSearchPopupOpen(false);
        setShowSuggestions(false);
        if (!searchQuery.trim()) {
            setIsSearchExpanded(false);
        }
    };

    const HamburgerIcon = () => (
        <div className="os-header__hamburger">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                viewBox="0 0 52 52" fill="none" aria-hidden="true">
                <g clipPath="url(#clip0_header_hamburger)">
                    <rect x="0.75" y="0.75" width="50.5" height="50.5" rx="4" ry="4" fill="#c3b5f5" stroke="#BDBDBD" strokeWidth="1.5" />
                    <path
                        d="M15 35H37C37.55 35 38 34.55 38 34C38 33.45 37.55 33 37 33H15C14.45 33 14 33.45 14 34C14 34.55 14.45 35 15 35ZM15 27H37C37.55 27 38 26.55 38 26C38 25.45 37.55 25 37 25H15C14.45 25 14 25.45 14 26C14 26.55 14.45 27 15 27ZM14 19C14 19.55 14.45 20 15 20H37C37.55 20 38 19.55 38 19C38 18.45 37.55 18 37 18H15C14.45 18 14 18.45 14 19Z"
                        fill="white" />
                </g>
                <defs>
                    <clipPath id="clip0_header_hamburger">
                        <rect width="52" height="52" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );

    const NavDropdownContent = () => (
        <>
            <Dropdown.Link href="/">Home</Dropdown.Link>
            <Dropdown.Link href={route('about-page.index')}>About</Dropdown.Link>
            <Dropdown.Link href={route('stories.allStories')}>All stories</Dropdown.Link>
            <Dropdown.Link href={route('connect-with-us.index')}>Connect</Dropdown.Link>
        </>
    );

    const NavMenuCloseIcon = () => (
        <div
            className={`os-dropdown__close ${isNavOpen ? 'os-dropdown__close--is-visible' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                setIsNavOpen(false);
            }}
            role="button"
            tabIndex={isNavOpen ? 0 : -1}
            aria-label="Close navigation menu"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                    d="M17.4 0.613387C17.2766 0.489783 17.1301 0.391719 16.9688 0.324811C16.8075 0.257902 16.6346 0.223462 16.46 0.223462C16.2854 0.223462 16.1125 0.257902 15.9512 0.324811C15.7899 0.391719 15.6433 0.489783 15.52 0.613387L8.99999 7.12005L2.47999 0.600054C2.35655 0.476611 2.21 0.378691 2.04872 0.311885C1.88743 0.245078 1.71457 0.210693 1.53999 0.210693C1.36542 0.210693 1.19255 0.245078 1.03127 0.311885C0.869983 0.378691 0.723435 0.476611 0.599993 0.600054C0.47655 0.723496 0.37863 0.870044 0.311824 1.03133C0.245017 1.19261 0.210632 1.36548 0.210632 1.54005C0.210632 1.71463 0.245017 1.88749 0.311824 2.04878C0.37863 2.21006 0.47655 2.35661 0.599993 2.48005L7.11999 9.00005L0.599993 15.5201C0.47655 15.6435 0.37863 15.79 0.311824 15.9513C0.245017 16.1126 0.210632 16.2855 0.210632 16.4601C0.210632 16.6346 0.245017 16.8075 0.311824 16.9688C0.37863 17.1301 0.47655 17.2766 0.599993 17.4001C0.723435 17.5235 0.869983 17.6214 1.03127 17.6882C1.19255 17.755 1.36542 17.7894 1.53999 17.7894C1.71457 17.7894 1.88743 17.755 2.04872 17.6882C2.21 17.6214 2.35655 17.5235 2.47999 17.4001L8.99999 10.8801L15.52 17.4001C15.6434 17.5235 15.79 17.6214 15.9513 17.6882C16.1126 17.755 16.2854 17.7894 16.46 17.7894C16.6346 17.7894 16.8074 17.755 16.9687 17.6882C17.13 17.6214 17.2765 17.5235 17.4 17.4001C17.5234 17.2766 17.6214 17.1301 17.6882 16.9688C17.755 16.8075 17.7894 16.6346 17.7894 16.4601C17.7894 16.2855 17.755 16.1126 17.6882 15.9513C17.6214 15.79 17.5234 15.6435 17.4 15.5201L10.88 9.00005L17.4 2.48005C17.9067 1.97339 17.9067 1.12005 17.4 0.613387Z"
                    fill="#BDBDBD" />
            </svg>
        </div>
    );

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

    const ProfileIcon = () => (
        <>
            {auth?.user?.avatar ?
                <Img
                    src={auth?.user?.avatar}
                    alt="Profile"
                    width={52}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="os-header__profile-img"
                />
                : ''}
        </>
    );

    const UserDropdownContent = () => (
        <>
            {auth.user ? (
                <>
                    <div className='os-mob-content os-mob-content--between'>
                        <div className="dropdown__profile">
                            {auth?.user?.avatar && (
                                <Img
                                    src={auth?.user?.avatar}
                                    alt="Profile"
                                    width={52}
                                    loading="lazy"
                                    decoding="async"
                                    fetchPriority="low"
                                    className="os-header__profile-img"
                                />
                            )}
                            {auth.user.username}
                        </div>
                        <a onClick={handleToOpenVideoEditor} className="os-header__add-story">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                viewBox="0 0 14 14" fill="none">
                                <path
                                    d="M8 7.49805H7.5V7.99805V12.998C7.5 13.1307 7.44732 13.2578 7.35355 13.3516C7.25979 13.4454 7.13261 13.498 7 13.498C6.86739 13.498 6.74021 13.4454 6.64645 13.3516C6.55268 13.2578 6.5 13.1307 6.5 12.998V7.99805V7.49805H6H1C0.867392 7.49805 0.740215 7.44537 0.646447 7.3516C0.552678 7.25783 0.5 7.13065 0.5 6.99805C0.5 6.86544 0.552678 6.73826 0.646447 6.64449C0.740215 6.55073 0.867392 6.49805 1 6.49805H6H6.5V5.99805V0.998047C6.5 0.865439 6.55268 0.738261 6.64645 0.644493C6.74021 0.550725 6.86739 0.498047 7 0.498047C7.13261 0.498047 7.25979 0.550725 7.35355 0.644493C7.44732 0.738261 7.5 0.865439 7.5 0.998047V5.99805V6.49805H8H13C13.1326 6.49805 13.2598 6.55073 13.3536 6.64449C13.4473 6.73826 13.5 6.86544 13.5 6.99805C13.5 7.13066 13.4473 7.25783 13.3536 7.3516C13.2598 7.44537 13.1326 7.49805 13 7.49805H8Z"
                                    fill="#151617" stroke="#151617" />
                            </svg>
                        </a>
                    </div>
                    <div className="os-delimeter os-delimeter--sm"></div>
                    <div className="dropdown__balance">
                        <span className="os-text os-text--sm os-text--c-grey">
                            Balance:
                        </span>
                        <span className="os-text os-text--bold">
                            {auth.user.balance}
                        </span>
                        <span className="os-text os-text--sm"> coins</span>
                    </div>
                    <div className="os-delimeter os-delimeter--sm"></div>
                    {/* <Dropdown.Link href={route('user.stories.create')}>
                        Share your story
                    </Dropdown.Link> */}
                    <Dropdown.Link>
                        <a
                            onClick={handleToOpenVideoEditor}
                        >
                            Create A Story
                        </a>
                    </Dropdown.Link>
                    {/*<Dropdown.Link href={route('user.profile.index')}>
                        Profile
                    </Dropdown.Link>*/}
                    <Dropdown.Link href={route('user.profile.myspace')}>
                        MySpace
                    </Dropdown.Link>
                    {/* <Dropdown.Link href={route('user.recordings.index')}>
                        Recordings
                    </Dropdown.Link> */}

                    {/* <Dropdown.Link href={route('story.manual.upload.video')}>
                        Manual Video
                    </Dropdown.Link> */}
                    {/* {auth.user?.is_creator && auth.user?.creator_status && (
                        <Dropdown.Link href={route('user.creator.dashboard')}>
                            Creator Dashboard
                        </Dropdown.Link>
                    )} */}

                    {auth.user?.is_creator == '1' && auth.user?.creator_status == '1' && (
                        <Dropdown.Link href={route('user.creator.dashboard')}>
                            Creator Dashboard
                        </Dropdown.Link>
                    )}
                    <Dropdown.Link href={route('user.transactions.index')}>
                        Transactions
                    </Dropdown.Link>
                    <Dropdown.Link href={route('user.profile.edit')}>
                        Edit profile
                    </Dropdown.Link>
                    <Dropdown.Link href={route('stories.allStories')}>
                        All Stories
                    </Dropdown.Link>
                    <div className="os-delimeter os-delimeter--sm"></div>
                    <Dropdown.Link href={route('logout')} method="post">
                        Sign Out
                    </Dropdown.Link>

                </>
            ) : (
                <>
                    <Dropdown.Link href={route('login')}>Log In</Dropdown.Link>
                    <Dropdown.Link href={route('register')}>Sign Up</Dropdown.Link>
                </>
            )}
        </>
    );

    const handleToOpenVideoEditor = async (e) => {
        e?.preventDefault?.();
        if (isOpeningEditor) return;
        setIsOpeningEditor(true);
        // Track "Create A Story" click event
        const userId = auth.user?.id || null;
        trackCreateStoryClick(userId);
        //     console.log("media shahid", auth.user)
        //     alert("sdfskjdfkjsdjkfjh");
        // localStorage.setItem("auth_user_data", JSON.stringify(auth.user));
        // localStorage.setItem("media", JSON.stringify(media));
        // localStorage.setItem("media_length_data", JSON.stringify(media.length));
        // localStorage.setItem("auth_data", JSON.stringify(auth));
        // localStorage.setItem("auth_data_url", url);

        if (auth.user) {
            try {
                const ensuredUrl = url || (await editorRedirection.regenerate());
                if (ensuredUrl) {
                    await redirectToDraftOrNewStory({ media, newStoryUrl: ensuredUrl });
                    return;
                }
            } catch (_) {
                // no-op (we'll reset loading below)
            }
        } else {
            router.visit(route("login"));
        }
        setIsOpeningEditor(false);
    }
    return (
        <div className="os-header">
            <div className="os-header__start">
                {auth.user ? (
                    <div className="os-mob-content">
                        <a href="/chatify/" className="os-header__chat">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none">
                                <path
                                    d="M5.5 18V17.5H5H4C3.17314 17.5 2.5 16.8269 2.5 16V8C2.5 7.17314 3.17314 6.5 4 6.5H16C16.8269 6.5 17.5 7.17314 17.5 8V16C17.5 16.8269 16.8269 17.5 16 17.5H11.277H11.1385L11.0198 17.5712L6.25777 20.4282L6.25775 20.4283L5.5 20.8829V18ZM4 7.5H3.5V8V16V16.5H4H6.5V18.234V19.1171L7.25726 18.6627L10.8615 16.5H16H16.5V16V8V7.5H16H4Z"
                                    fill="#151617" stroke="#151617" />
                                <path
                                    d="M20 2H8C6.897 2 6 2.897 6 4H18C19.103 4 20 4.897 20 6V14C21.103 14 22 13.103 22 12V4C22 2.897 21.103 2 20 2Z"
                                    fill="#151617" />
                            </svg>
                            <div className="os-header__messages-count">
                                {auth.unseenMessages}
                            </div>
                        </a>
                    </div>
                ) : null}
            </div>

            <div className="os-header__center">
                <div className="os-header__brand-with-nav">
                    <Link href="/" className="os-header__logo">
                        <ApplicationLogo />
                    </Link>
                    <nav className="os-header__left" aria-label="Main navigation">
                        <Link href={'/'}>Home</Link>
                        <Link href={route('about-page.index')}>About</Link>
                        <Link href={route('stories.allStories')}>Stories</Link>
                    </nav>
                </div>
            </div>

            <div className="os-header__end">
                <div className="os-header__right !gap-1 min-[992px]:!gap-3 shrink-0 min-[992px]:min-w-0 min-[992px]:shrink">
                    {showHeaderSearch && (
                        <div
                            ref={searchBoxRef}
                            className="os-header__guest-search relative mr-0 flex shrink-0 items-center gap-1 min-[992px]:min-w-0 min-[992px]:shrink min-[992px]:gap-2"
                        >
                            {(!isWideHeader || !isSearchExpanded) && (
                                <button
                                    type="button"
                                    onClick={handleSearchIconClick}
                                    className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#cfcfcf] bg-[#efefef] text-[#7a7a7a] transition-colors hover:bg-[#e8e8e8] min-[992px]:h-9 min-[992px]:w-9"
                                    aria-label="Search users"
                                >
                                    <FaSearch className="text-[11px] min-[992px]:text-[15px]" />
                                </button>
                            )}

                            {isWideHeader && (
                                <div
                                    className={`transition-all duration-300 ease-out ${isSearchExpanded
                                        ? "w-full max-w-[200px] min-w-0 overflow-visible opacity-100"
                                        : "w-0 overflow-hidden opacity-0"
                                        }`}
                                >
                                    <div className="relative min-w-0">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setShowSuggestions(true);
                                            }}
                                            onFocus={() => setShowSuggestions(true)}
                                            placeholder="Search…"
                                            className="box-border w-full min-w-0 rounded-xl border border-gray-300 bg-white py-1 pl-2 pr-7 text-[10px] focus:border-[#c7b0ef] focus:outline-none focus:ring-2 focus:ring-[#bfa4ef]/40 min-[992px]:px-3 min-[992px]:py-1.5 min-[992px]:text-xs"
                                        />
                                        {/* <FaSearch className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 min-[992px]:text-xs" /> */}
                                    </div>
                                </div>
                            )}

                            {isWideHeader &&
                                isSearchExpanded &&
                                showSuggestions &&
                                (searchQuery.trim() || isSearchLoading) && (
                                    <div className="absolute right-0 top-full z-50 mt-1 max-h-72 w-[min(100vw-2rem,220px)] overflow-y-auto overflow-x-hidden rounded-xl border border-gray-200 bg-white shadow-lg min-[992px]:w-[200px]">
                                        {isSearchLoading ? (
                                            <div className="px-3 py-2 text-xs text-gray-500">
                                                Searching…
                                            </div>
                                        ) : userSuggestions.length > 0 ? (
                                            userSuggestions.map((user) => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleSelectSuggestion(user.id)
                                                    }
                                                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left transition-colors hover:bg-gray-50 min-[992px]:gap-3 min-[992px]:px-3 min-[992px]:py-2"
                                                >
                                                    <img
                                                        src={user.avatar || "/img/avatar.png"}
                                                        alt={user.name}
                                                        loading="lazy"
                                                        decoding="async"
                                                        fetchPriority="low"
                                                        className="h-7 w-7 shrink-0 rounded-full border border-gray-200 object-cover min-[992px]:h-8 min-[992px]:w-8"
                                                    />
                                                    <span className="truncate text-xs text-gray-800 min-[992px]:text-sm">
                                                        {user.name}
                                                    </span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-xs text-gray-500">
                                                No users found
                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>
                    )}
                    {auth.user ? (
                        <>
                            <Button
                                onClick={handleToOpenVideoEditor}
                                tag="a"
                                variant="primary"
                                fontWeight="bold"
                                gap="16"
                                padding="s"
                                icon
                                disabled={isOpeningEditor}
                                className="os-header__create-story !min-w-[86px] !h-[32px] max-[991px]:!min-w-0 max-[991px]:!h-[26px] max-[991px]:!px-[5px] max-[991px]:!text-[9px] max-[991px]:!gap-1"
                            >
                                {isOpeningEditor ? "Creating…" : "Create A Story"}
                            </Button>

                            {isWideHeader && (
                                <div className="os-header__profile-chat">
                                    <div onClick={toggleUserMenu}>
                                        <Dropdown isOpen={isUserMenuOpen} onClose={toggleUserMenu}>
                                            <Dropdown.Trigger>
                                                {isUserMenuOpen && <DropdownCloseIcon />}
                                                <div className={'os-header__profile'}>
                                                    <ProfileIcon />
                                                    <div className={'os-header__profile-dropdown'}>
                                                        <div className="os-pc-content"> {auth.user.username}</div>
                                                        <div className='os-pc-content'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                                viewBox="0 0 24 24" fill="none">
                                                                <g clipPath={`url(#${profileChevronClipDesktop})`}>
                                                                    <path fillRule="evenodd" clipRule="evenodd"
                                                                        d="M12.707 15.7071C12.5194 15.8946 12.2651 15.9999 12 15.9999C11.7348 15.9999 11.4805 15.8946 11.293 15.7071L5.63598 10.0501C5.54047 9.95785 5.46428 9.84751 5.41188 9.7255C5.35947 9.6035 5.33188 9.47228 5.33073 9.3395C5.32957 9.20672 5.35487 9.07504 5.40516 8.95215C5.45544 8.82925 5.52969 8.7176 5.62358 8.6237C5.71747 8.52981 5.82913 8.45556 5.95202 8.40528C6.07492 8.355 6.2066 8.32969 6.33938 8.33085C6.47216 8.332 6.60338 8.35959 6.72538 8.412C6.84739 8.46441 6.95773 8.54059 7.04998 8.6361L12 13.5861L16.95 8.6361C17.1386 8.45394 17.3912 8.35315 17.6534 8.35542C17.9156 8.3577 18.1664 8.46287 18.3518 8.64828C18.5372 8.83369 18.6424 9.0845 18.6447 9.3467C18.6469 9.60889 18.5461 9.8615 18.364 10.0501L12.707 15.7071Z"
                                                                        fill="#151617" />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id={profileChevronClipDesktop}>
                                                                        <rect width="24" height="24" fill="white" />
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                            </Dropdown.Trigger>
                                            <Dropdown.Content>
                                                <UserDropdownContent />
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                    {/* Temporarily disabled */}
                                    {/* <button 
                                    onClick={() => setIsHelpModalOpen(true)}
                                    className="os-header__help"
                                    aria-label="Help"
                                >
                                    <HelpCircle className="w-6 h-6" />
                                </button> */}
                                    <div className="os-header__chat-wrap">
                                        <a href="/chatify/" className="os-header__chat">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                fill="none">
                                                <path
                                                    d="M5.5 18V17.5H5H4C3.17314 17.5 2.5 16.8269 2.5 16V8C2.5 7.17314 3.17314 6.5 4 6.5H16C16.8269 6.5 17.5 7.17314 17.5 8V16C17.5 16.8269 16.8269 17.5 16 17.5H11.277H11.1385L11.0198 17.5712L6.25777 20.4282L6.25775 20.4283L5.5 20.8829V18ZM4 7.5H3.5V8V16V16.5H4H6.5V18.234V19.1171L7.25726 18.6627L10.8615 16.5H16H16.5V16V8V7.5H16H4Z"
                                                    fill="#151617" stroke="#151617" />
                                                <path
                                                    d="M20 2H8C6.897 2 6 2.897 6 4H18C19.103 4 20 4.897 20 6V14C21.103 14 22 13.103 22 12V4C22 2.897 21.103 2 20 2Z"
                                                    fill="#151617" />
                                            </svg>
                                            <div className="os-header__messages-count">
                                                {auth.unseenMessages}
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            )}







                            <div className="os-mob-content">
                                <div onClick={toggleUserMenu}>
                                    <Dropdown isOpen={isUserMenuOpen} onClose={toggleUserMenu}>
                                        <Dropdown.Trigger>
                                            {isUserMenuOpen && <DropdownCloseIcon />}
                                            <div className={'os-header__profile'}>
                                                <ProfileIcon />
                                                <div className={'os-header__profile-dropdown'}>
                                                    <div className="os-pc-content"> {auth.user.username}</div>
                                                    <div className='os-pc-content'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            viewBox="0 0 24 24" fill="none">
                                                            <g clipPath={`url(#${profileChevronClipMobile})`}>
                                                                <path fillRule="evenodd" clipRule="evenodd"
                                                                    d="M12.707 15.7071C12.5194 15.8946 12.2651 15.9999 12 15.9999C11.7348 15.9999 11.4805 15.8946 11.293 15.7071L5.63598 10.0501C5.54047 9.95785 5.46428 9.84751 5.41188 9.7255C5.35947 9.6035 5.33188 9.47228 5.33073 9.3395C5.32957 9.20672 5.35487 9.07504 5.40516 8.95215C5.45544 8.82925 5.52969 8.7176 5.62358 8.6237C5.71747 8.52981 5.82913 8.45556 5.95202 8.40528C6.07492 8.355 6.2066 8.32969 6.33938 8.33085C6.47216 8.332 6.60338 8.35959 6.72538 8.412C6.84739 8.46441 6.95773 8.54059 7.04998 8.6361L12 13.5861L16.95 8.6361C17.1386 8.45394 17.3912 8.35315 17.6534 8.35542C17.9156 8.3577 18.1664 8.46287 18.3518 8.64828C18.5372 8.83369 18.6424 9.0845 18.6447 9.3467C18.6469 9.60889 18.5461 9.8615 18.364 10.0501L12.707 15.7071Z"
                                                                    fill="#151617" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id={profileChevronClipMobile}>
                                                                    <rect width="24" height="24" fill="white" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <UserDropdownContent />
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>


                        </>
                    ) : (
                        <>

                            <div className="os-header__btns">
                                <Button
                                    href={route('login')}
                                    tag="a"
                                    variant="outline"
                                    fontWeight="bold"
                                    gap="16"
                                    padding="s"
                                    icon
                                    className="border border-gray-300 !min-w-[86px] !h-[32px] max-[991px]:!min-w-0 max-[991px]:!h-[26px] max-[991px]:!px-[5px] max-[991px]:!text-[9px] max-[991px]:!gap-1"
                                >
                                    <img src="/img/icons/login_icon.svg" alt="Log In" className="w-5 h-5 max-[991px]:!h-[11px] max-[991px]:!w-[11px] object-contain" />
                                    Log In
                                </Button>
                                <Button
                                    href={route('register')}
                                    tag="a"
                                    variant="primary"
                                    fontWeight="bold"
                                    gap="16"
                                    padding="s"
                                    className="os-header__signup !min-w-[86px] !h-[32px] max-[991px]:!min-w-0 max-[991px]:!h-[26px] max-[991px]:!px-[5px] max-[991px]:!text-[9px] max-[991px]:!gap-1"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </>
                    )}

                    <div className="os-mob-content os-header__nav-mob">
                        <Dropdown open={isNavOpen} onOpenChange={setIsNavOpen}>
                            <Dropdown.Trigger>
                                <NavMenuCloseIcon />
                                {!isNavOpen && (
                                    <button
                                        type="button"
                                        className="os-header__hamburger-btn"
                                        aria-label="Open navigation menu"
                                    >
                                        <HamburgerIcon />
                                    </button>
                                )}
                            </Dropdown.Trigger>
                            <Dropdown.Content align="left" contentClasses="dropdown__content-inner">
                                <NavDropdownContent />
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </div>

            {showHeaderSearch && !isWideHeader && isSearchPopupOpen && (
                <div
                    ref={searchPopupRef}
                    className="fixed inset-0 z-[220] flex items-start justify-center bg-black/45 px-4 pt-[4.5rem] backdrop-blur-sm min-[992px]:hidden"
                    onClick={closeHeaderSearchPopup}
                    role="presentation"
                >
                    <div
                        className="w-full max-w-sm rounded-2xl border border-violet-200/90 bg-white p-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="os-header-search-title"
                    >
                        <div className="mb-3 flex items-center justify-between gap-2">
                            <h2
                                id="os-header-search-title"
                                className="text-sm font-semibold text-gray-900"
                            >
                                Search users
                            </h2>
                            <button
                                type="button"
                                onClick={closeHeaderSearchPopup}
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                                aria-label="Close search"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    aria-hidden
                                >
                                    <path
                                        d="M5 5L15 15M15 5L5 15"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="relative mb-2">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="Search…"
                                className="w-full rounded-full border border-violet-200/80 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#c7b0ef] focus:outline-none focus:ring-2 focus:ring-[#bfa4ef]/40"
                                autoComplete="off"
                            />
                            <FaSearch className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
                        </div>
                        {showSuggestions && (searchQuery.trim() || isSearchLoading) && (
                            <div className="max-h-60 overflow-y-auto overflow-x-hidden rounded-xl border border-gray-100 bg-gray-50/80">
                                {isSearchLoading ? (
                                    <div className="px-3 py-3 text-sm text-gray-500">
                                        Searching…
                                    </div>
                                ) : userSuggestions.length > 0 ? (
                                    userSuggestions.map((user) => (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() => handleSelectSuggestion(user.id)}
                                            className="flex w-full items-center gap-3 border-b border-gray-100/80 px-3 py-2.5 text-left last:border-0 hover:bg-white"
                                        >
                                            <img
                                                src={user.avatar || "/img/avatar.png"}
                                                alt={user.name}
                                                loading="lazy"
                                                decoding="async"
                                                fetchPriority="low"
                                                className="h-9 w-9 shrink-0 rounded-full border border-gray-200 object-cover"
                                            />
                                            <span className="truncate text-sm text-gray-800">
                                                {user.name}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-3 text-sm text-gray-500">
                                        No users found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Help Tutorial Modal - Temporarily disabled */}
            {/* <HelpTutorialModal
                open={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                videoUrls={{
                    redMarker: '/tutorials/how_to_use_red_marker.mp4',
                    animation: '/tutorials/how_to_add_animation.mp4',
                    moveElement: '/tutorials/how_to_move_elements.mp4',
                    splitDelete: '/tutorials/how_to_split_delete.mp4',
                }}
            /> */}
        </div>
    );
}
