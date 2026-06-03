import { Link } from "@inertiajs/react";

export default function MenuList({ }) {

    return (
        <ul className="scrollable">
            <li className="side-menu__divider">DASHBOARD</li>
            <li>
                <a
                    href={route('admin.dashboard')}
                    className={'side-menu__link ' + (route().current('admin.dashboard') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="album"
                        className="lucide lucide-album stroke-[1] w-5 h-5 side-menu__link__icon">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <polyline points="11 3 11 11 14 8 17 11 17 3"></polyline>
                    </svg>
                    <div className="side-menu__link__title">Dashboard</div>
                </a>
            </li><li>
                <Link
                    href={route('admin.users.index')}
                    className={'side-menu__link ' + (route().current('admin.users.index') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-square-user stroke-[1] w-5 h-5 side-menu__link__icon">
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <circle cx="12" cy="10" r="3"></circle>
                        <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <div className="side-menu__link__title">Users</div>
                </Link>
            </li><li>
                <Link
                    href={route('admin.stories.all')}
                    className={'side-menu__link ' + (route().current('admin.stories.all') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-gallery-horizontal-end stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M2 7v10"></path>
                        <path d="M6 5v14"></path>
                        <rect width="12" height="18" x="10" y="3" rx="2"></rect>
                    </svg>
                    <div className="side-menu__link__title">All stories</div>
                </Link>
            </li><li>
                <Link
                    href={route('admin.audio-recordings.all')}
                    className={'side-menu__link ' + (route().current('admin.audio-recordings.all') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-gallery-horizontal-end stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M2 7v10"></path>
                        <path d="M6 5v14"></path>
                        <rect width="12" height="18" x="10" y="3" rx="2"></rect>
                    </svg>
                    <div className="side-menu__link__title">Audio Recordings</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.written-messages.all')}
                    className={'side-menu__link ' + (route().current('admin.written-messages.all') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-file-text stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <path d="M14 2v6h6"></path>
                        <path d="M16 13H8"></path>
                        <path d="M16 17H8"></path>
                        <path d="M10 9H8"></path>
                    </svg>
                    <div className="side-menu__link__title">Written Stories</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.spoken-stories.all')}
                    className={'side-menu__link ' + (route().current('admin.spoken-stories.all') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-mic stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M12 14a4 4 0 0 0 4-4V4a4 4 0 0 0-8 0v6a4 4 0 0 0 4 4Z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" x2="12" y1="19" y2="22"></line>
                    </svg>
                    <div className="side-menu__link__title">Spoken Stories</div>
                </Link>
            </li>
            <li className="side-menu__divider">
                Transactions
            </li>
            <li>
                <Link
                    href={route('admin.wallets')}
                    className={'side-menu__link ' + (route().current('admin.wallets') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-percent-square stroke-[1] w-5 h-5 side-menu__link__icon">
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <path d="m15 9-6 6"></path>
                        <path d="M9 9h.01"></path>
                        <path d="M15 15h.01"></path>
                    </svg>
                    <div className="side-menu__link__title">Wallets</div>
                </Link>
            </li> <li>
                <Link
                    href={route('admin.transactions.gift-transactions')}
                    className={'side-menu__link ' + (route().current('admin.transactions.gift-transactions') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-percent-square stroke-[1] w-5 h-5 side-menu__link__icon">
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <path d="m15 9-6 6"></path>
                        <path d="M9 9h.01"></path>
                        <path d="M15 15h.01"></path>
                    </svg>
                    <div className="side-menu__link__title">Gifts</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.transactions.donations.index')}
                    className={'side-menu__link ' + (route().current('admin.transactions.donations.index') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-percent-square stroke-[1] w-5 h-5 side-menu__link__icon">
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <path d="m15 9-6 6"></path>
                        <path d="M9 9h.01"></path>
                        <path d="M15 15h.01"></path>
                    </svg>
                    <div className="side-menu__link__title">Donations</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.transactions.top-ups.index')}
                    className={'side-menu__link ' + (route().current('admin.transactions.top-ups.index') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-percent-square stroke-[1] w-5 h-5 side-menu__link__icon">
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <path d="m15 9-6 6"></path>
                        <path d="M9 9h.01"></path>
                        <path d="M15 15h.01"></path>
                    </svg>
                    <div className="side-menu__link__title">Top ups</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.transactions.withdrawals.index')}
                    className={'side-menu__link ' + (route().current('admin.transactions.withdrawals.index') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-percent-square stroke-[1] w-5 h-5 side-menu__link__icon">
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <path d="m15 9-6 6"></path>
                        <path d="M9 9h.01"></path>
                        <path d="M15 15h.01"></path>
                    </svg>
                    <div className="side-menu__link__title">Withdrawals</div>
                </Link>
            </li>
            <li className="side-menu__divider">
                APPS
            </li>
            <li>
                <Link href={route('homepage.stories-editor.index')}
                    className={'side-menu__link ' + (route().current('homepage.stories-editor.index') ? 'side-menu__link--active' : '')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        data-lucide="clapperboard"
                        className="lucide lucide-clapperboard stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path
                            d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"></path>
                        <path d="m6.2 5.3 3.1 3.9"></path>
                        <path d="m12.4 3.4 3.1 4"></path>
                        <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path>
                    </svg>
                    <div className="side-menu__link__title">Main video editor</div>
                </Link>
            </li>
            <li>
                <a href='/chatify/' className="side-menu__link ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="mail-open"
                        className="lucide lucide-mail-open stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path
                            d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"></path>
                        <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"></path>
                    </svg>
                    <div className="side-menu__link__title">Chat</div>
                </a>
            </li>

            <li className="side-menu__divider">
                PAGES
            </li>
            <li>
                <Link
                    href={route('homepage.edit')}
                    className={'side-menu__link ' + (route().current('homepage.edit') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Homepage</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.about.edit')}
                    className={'side-menu__link ' + (route().current('admin.about.edit') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">About</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.connect.edit')}
                    className={'side-menu__link ' + (route().current('admin.connect.edit') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Connect</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.support.edit')}
                    className={'side-menu__link ' + (route().current('admin.support.edit') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Poll</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.donate-page.edit')}
                    className={'side-menu__link ' + (route().current('admin.donate-page.edit') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Donation</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.privacy-policy.edit')}
                    className={'side-menu__link ' + (route().current('admin.privacy-policy.edit') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Privacy policy</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.privacy-policy.us.edit')}
                    className={'side-menu__link ' + (route().current('admin.privacy-policy.us.edit') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Privacy policy US</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.terms-of-use.edit')}
                    className={'side-menu__link ' + (route().current('admin.terms-of-use.edit') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Term of use</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.creator-guidelines.edit')}
                    className={'side-menu__link ' + (route().current('admin.creator-guidelines.edit') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Creator Guidelines</div>
                </Link>
            </li>

            <li className="side-menu__divider">
                Poll
            </li>
            <li>
                <Link
                    href={route('admin.poll.index')}
                    className={'side-menu__link ' + (route().current('admin.poll.index') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">All polls</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.poll.create')}
                    className={'side-menu__link ' + (route().current('admin.poll.create') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Create Poll</div>
                </Link>
            </li>

            <li className="side-menu__divider">
                Variant
            </li>
            <li>
                <Link
                    href={route('admin.variant.index')}
                    className={'side-menu__link ' + (route().current('admin.variant.index') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">All variants</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.variant.create')}
                    className={'side-menu__link ' + (route().current('admin.variant.create') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Create variant</div>
                </Link>
            </li>
            <li className="side-menu__divider">
                Popup`s
            </li>
            <li>
                <Link
                    href={route('admin.donation-popup.edit')}
                    className={'side-menu__link ' + (route().current('admin.donation-popup.edit') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Donate popup</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.poll-popup.edit')}
                    className={'side-menu__link ' + (route().current('admin.poll-popup.edit') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Poll popup</div>
                </Link>
            </li>
            <li className="side-menu__divider">
                Logs
            </li>
            <li>
                <Link
                    href={route('admin.user-login-logs.index')}
                    className={'side-menu__link ' + (route().current('admin.user-login-logs.index') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-list-clock stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M3 12h5"></path>
                        <path d="M3 6h9"></path>
                        <path d="M3 18h5"></path>
                        <circle cx="17" cy="12" r="4"></circle>
                        <path d="M17 10v3l2 1"></path>
                    </svg>
                    <div className="side-menu__link__title">User Logs</div>
                </Link>
            </li>
            <li>
                <Link
                    href={route('admin.camera-events.index')}
                    className={'side-menu__link ' + (route().current('admin.camera-events.index') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-camera stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path>
                        <circle cx="12" cy="13" r="3"></circle>
                    </svg>
                    <div className="side-menu__link__title">Camera Events</div>
                </Link>
            </li>

            <li className="side-menu__divider">
                Visitors
            </li>
            <li>
                <Link
                    href={route('admin.visitors.index')}
                    className={'side-menu__link ' + (route().current('admin.visitors.index') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="lucide lucide-footprints stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 20c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2Z"></path>
                        <path d="M10 20c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2Z"></path>
                        <path d="M6 10c0-1.66 1.12-3 2.5-3s2.5 1.34 2.5 3-1.12 3-2.5 3S6 11.66 6 10Z"></path>
                        <path d="M12 8c0-2.2 1.34-4 3-4s3 1.8 3 4-1.34 4-3 4-3-1.8-3-4Z"></path>
                    </svg>
                    <div className="side-menu__link__title">Visitors</div>
                </Link>
            </li>
            <li className="side-menu__divider">
                Black list
            </li>
            <li>
                <Link
                    href={route('admin.blacklisted-words.index')}
                    className={'side-menu__link ' + (route().current('admin.blacklisted-words.index') ? 'side-menu__link--active' : '')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" data-lucide="file-type2"
                        className="lucide lucide-file-type2 stroke-[1] w-5 h-5 side-menu__link__icon">
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M2 13v-1h6v1"></path>
                        <path d="M4 18h2"></path>
                        <path d="M5 12v6"></path>
                    </svg>
                    <div className="side-menu__link__title">Words</div>
                </Link>
            </li>
        </ul>
    );
}
