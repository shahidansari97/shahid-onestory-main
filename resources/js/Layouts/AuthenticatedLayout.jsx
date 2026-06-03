import {useState} from 'react';
import '../../css/dashboard/echo.css';
import '../../css/dashboard/app.css';
import '../../css/dashboard/dagger.css';
import '../../css/dashboard/simplebar.css';
import '../../css/dashboard/tippy.css';
import {Link} from "@inertiajs/react";
import MenuList from "@/Components/Dashboard/Sidemenu/MenuList.jsx";
import Breadcrumbs from "@/Components/Dashboard/Sidemenu/Breadcrumbs.jsx";
import MobileMenu from "@/Components/Dashboard/Sidemenu/MobileMenu.jsx";
import GoogleAnalyticsTracker from '@/Components/GoogleAnalyticsTracker';
export default function Authenticated({user, header, children}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    document.body.classList.remove('overflow-hidden');
    const handleOpenMobileMenu = () => {
        setIsMobileMenuOpen(true);
        document.body.classList.add('overflow-hidden');
    };

    const handleCloseMobileMenu = () => {
        setIsMobileMenuOpen(false);
        document.body.classList.remove('overflow-hidden');
    };

    return (
        <div
            className="dagger before:content-[''] before:bg-gradient-to-b before:from-slate-100 before:to-slate-50 before:fixed before:inset-0">
            <div className="h-screen relative ">
                <div className="fixed top-0 left-0 z-50 h-screen side-menu group">
                    <div className="box fixed inset-x-0 top-0 z-10 flex h-[65px] rounded-none border-x-0 border-t-0">
                        <div
                            className="side-menu__content bg-white flex-none flex items-center z-10 px-5 h-full w-full flex justify-between overflow-hidden relative duration-300 group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000001f] before:content-[''] before:hidden before:xl:block before:absolute before:right-0 before:border-r before:border-dashed before:border-slate-300/70 before:h-4/6 before:group-[.side-menu--collapsed.side-menu--on-hover]:xl:border-solid before:group-[.side-menu--collapsed.side-menu--on-hover]:xl:h-full">
                            <a
                                className="items-center transition-[margin] xl:flex group-[.side-menu--collapsed.side-menu--on-hover]:xl:ml-0 group-[.side-menu--collapsed]:xl:ml-2"
                                href={route('home')}
                            >
                                <img src="/img/logo.png" className='w-32'/>
                            </a>
                            <div className="flex items-center gap-1 xl:hidden ml-auto">
                                <div
                                    onClick={handleOpenMobileMenu}
                                    className="p-2 rounded-full open-mobile-menu hover:bg-slate-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round"
                                         className="lucide lucide-align-justify stroke-[1] w-[18px] h-[18px]">
                                        <line x1="3" x2="21" y1="6" y2="6"></line>
                                        <line x1="3" x2="21" y1="12" y2="12"></line>
                                        <line x1="3" x2="21" y1="18" y2="18"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <Breadcrumbs/>
                    </div>
                    <div className="side-menu__content absolute inset-y-0 z-10 xl:top-[65px] xl:z-0">
                        <div
                            className="box xl:ml-0 border-y-0 border-l-0 rounded-none w-[275px] duration-300 transition-[width,margin] group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000000f] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px] relative overflow-hidden h-full flex flex-col after:content-[''] after:fixed after:inset-0 after:bg-black/80 after:z-[-1] after:xl:hidden group-[.side-menu--mobile-menu-open]:ml-0 group-[.side-menu--mobile-menu-open]:after:block -ml-[275px] after:hidden">
                            <div
                                className="scrollable-ref w-full h-full z-20 px-5 overflow-y-auto overflow-x-hidden pb-3 [-webkit-mask-image:-webkit-linear-gradient(top,rgba(0,0,0,0),black_30px)] [&:-webkit-scrollbar]:w-0 [&:-webkit-scrollbar]:bg-transparent [&_.simplebar-content]:p-0 [&_.simplebar-track.simplebar-vertical]:w-[10px] [&_.simplebar-track.simplebar-vertical]:mr-0.5 [&_.simplebar-track.simplebar-vertical_.simplebar-scrollbar]:before:bg-slate-400/30">
                                <MenuList/>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="content transition-[margin,width] duration-100 px-5 mt-[65px] pt-[31px] pb-16 relative z-10 content--compact xl:ml-[275px] [&.content--compact]:xl:ml-[275px]">
                    <div className="container">
                        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                            <div className="col-span-12">
                                <div>
                                    <GoogleAnalyticsTracker />
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                {isMobileMenuOpen && <MobileMenu onClose={handleCloseMobileMenu}/>}
            </div>
        </div>
    );
}
