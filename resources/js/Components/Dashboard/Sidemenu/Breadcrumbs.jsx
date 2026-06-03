import {Link} from "@inertiajs/react";

export default function Breadcrumbs({  }) {

    return (
        <div className="absolute inset-x-0 h-full transition-[padding] duration-100 xl:pl-[275px] group-[.side-menu--collapsed]:xl:pl-[91px]">
            <div className="flex items-center w-full h-full px-5">
                <nav
                    aria-label="breadcrumb"
                    className="flex flex-1 hidden xl:block"
                >
                    <ol className="flex items-center text-theme-1 dark:text-slate-300">
                        <li className="">
                            <Link href="/">App</Link>
                        </li>
                        <li className="relative ml-5 pl-0.5 before:content-[''] before:w-[14px] before:h-[14px] before:bg-chevron-black before:transform before:rotate-[-90deg] before:bg-[length:100%] before:-ml-[1.125rem] before:absolute before:my-auto before:inset-y-0 dark:before:bg-chevron-white">
                            <div>Dashboards</div>
                        </li>
                    </ol>
                </nav>
            </div>
        </div>
    );
}
