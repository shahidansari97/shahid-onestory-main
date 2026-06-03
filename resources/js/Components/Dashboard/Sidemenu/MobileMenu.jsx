import MenuList from "@/Components/Dashboard/Sidemenu/MenuList.jsx";

export default function MobileMenu({ onClose }) {
    return (
        <div className="absolute inset-y-0 xl:top-[65px] z-50 h-full">
            <div className="box xl:ml-0 border-y-0 border-l-0 rounded-none w-[275px] duration-300 transition-[width,margin] group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000000f] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px] relative overflow-hidden h-full flex flex-col after:content-[''] after:fixed after:inset-0 after:bg-black/80 after:z-[-1] after:xl:hidden ml-0 after:block">
                <div
                    onClick={onClose}
                    className="close-mobile-menu fixed ml-[275px] w-10 h-10 items-center justify-center xl:hidden flex"
                >
                    <a href="#" className="mt-5 ml-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-x stroke-[1] w-8 h-8 text-white">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </a>
                </div>
                <div
                    className="w-full h-full z-20 px-5 overflow-x-hidden pb-3 [-webkit-mask-image:-webkit-linear-gradient(top,rgba(0,0,0,0),black_30px)] [&amp;:-webkit-scrollbar]:w-0 [&amp;:-webkit-scrollbar]:bg-transparent [&amp;_.simplebar-content]:p-0 [&amp;_.simplebar-track.simplebar-vertical]:w-[10px] [&amp;_.simplebar-track.simplebar-vertical]:mr-0.5 [&amp;_.simplebar-track.simplebar-vertical_.simplebar-scrollbar]:before:bg-slate-400/30 simplebar-scrollable-y"
                    data-simplebar="init"
                >
                    <div className="simplebar-wrapper">
                        <div className="simplebar-height-auto-observer-wrapper">
                            <div className="simplebar-height-auto-observer"></div>
                        </div>
                        <div className="simplebar-mask">
                            <div className="simplebar-offset">
                                <div className="simplebar-content-wrapper px-4 overflow-y-auto" tabIndex="0" role="region"
                                     aria-label="scrollable content">
                                    <div className="simplebar-content ">
                                        <MenuList/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="simplebar-placeholder"></div>
                    </div>
                    <div className="simplebar-track simplebar-horizontal">
                        <div className="simplebar-scrollbar"></div>
                    </div>
                    <div className="simplebar-track simplebar-vertical">
                        <div className="simplebar-scrollbar"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
