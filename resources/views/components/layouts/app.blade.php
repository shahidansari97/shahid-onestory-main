<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" href="{{Vite::asset('resources/img/favicon.png')}}" type="image/x-icon">

        @vite(['resources/css/style.css', 'resources/css/tablet.css', 'resources/css/mobile.css'])
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>

        <title>{{ !empty($title) ? __($title) : 'Error' }}</title>
    </head>

    <body>

        <header class="header" id="header">
            <div class="logo">
                <a href="{{ route('home') }}">
                    <img class="img-responsive" src="{{Vite::asset('resources/img/HeaderLogo.png')}}" alt="logo">
                </a>
            </div>
            {{--        <div class="mobile-logo">--}}
            {{--            <a href="{{ route('home') }}">--}}
            {{--                <img class="img-responsive" src="{{Vite::asset('resources/img/HeaderLogo.png')}}" alt="logo">--}}
            {{--            </a>--}}
            {{--        </div>--}}
            {{--        <div class="mobile-button-group">--}}
            {{--                <div class="button">--}}
            {{--                    <a href="{{ config('app.contact.cabinet_url') }}" class="btn btn-outline">--}}
            {{--                        {{ __('nav.enter') }}--}}
            {{--                    </a>--}}
            {{--                </div>--}}
            {{--        </div>--}}
            <span class="icon burger" id="bars">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <div class="navigation" id="navigation">
            <span class="icon mobile" id="close">
                <span class="sidebar-logo">
                    <a href="{{ route('home') }}">
                        <img class="img-responsive" src="{{Vite::asset('resources/img/HeaderLogo.png')}}" alt="logo">
                    </a>
                </span>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="20" fill="#E0E1DD"/>
                    <path
                        d="M26.3 13.71C26.2075 13.6173 26.0976 13.5438 25.9766 13.4936C25.8556 13.4434 25.7259 13.4176 25.595 13.4176C25.464 13.4176 25.3343 13.4434 25.2134 13.4936C25.0924 13.5438 24.9825 13.6173 24.89 13.71L20 18.59L15.11 13.7C15.0174 13.6074 14.9075 13.534 14.7865 13.4839C14.6656 13.4338 14.5359 13.408 14.405 13.408C14.274 13.408 14.1444 13.4338 14.0234 13.4839C13.9025 13.534 13.7926 13.6074 13.7 13.7C13.6074 13.7926 13.534 13.9025 13.4839 14.0235C13.4337 14.1444 13.408 14.2741 13.408 14.405C13.408 14.5359 13.4337 14.6656 13.4839 14.7865C13.534 14.9075 13.6074 15.0174 13.7 15.11L18.59 20L13.7 24.89C13.6074 24.9826 13.534 25.0925 13.4839 25.2135C13.4337 25.3344 13.408 25.4641 13.408 25.595C13.408 25.7259 13.4337 25.8556 13.4839 25.9765C13.534 26.0975 13.6074 26.2074 13.7 26.3C13.7926 26.3926 13.9025 26.466 14.0234 26.5161C14.1444 26.5662 14.274 26.592 14.405 26.592C14.5359 26.592 14.6656 26.5662 14.7865 26.5161C14.9075 26.466 15.0174 26.3926 15.11 26.3L20 21.41L24.89 26.3C24.9826 26.3926 25.0925 26.466 25.2134 26.5161C25.3344 26.5662 25.464 26.592 25.595 26.592C25.7259 26.592 25.8556 26.5662 25.9765 26.5161C26.0975 26.466 26.2074 26.3926 26.3 26.3C26.3926 26.2074 26.466 26.0975 26.5161 25.9765C26.5662 25.8556 26.592 25.7259 26.592 25.595C26.592 25.4641 26.5662 25.3344 26.5161 25.2135C26.466 25.0925 26.3926 24.9826 26.3 24.89L21.41 20L26.3 15.11C26.68 14.73 26.68 14.09 26.3 13.71Z"
                        fill="#0D1B2A"/>
                </svg>
            </span>
                <div class="nav-menu">
                    <a href="#what" class="link menu-link">{{ __('nav.product') }}</a>
                    <a href="#functions" class="link menu-link">{{ __('nav.reviews') }}</a>
                    <a href="#integration" class="link menu-link">{{ __('nav.Partners') }}</a>
                    <a href="#interesting" class="link menu-link">{{ __('nav.Blog') }}</a>
                    <a href="#faq" class="link menu-link">{{ __('nav.FAQ') }}</a>
                    <a href="#contacts" class="link menu-link">{{ __('nav.Contacts') }}</a>
                </div>

                <div class="dropdown">
                    <button class="dropbtn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 10L12 15L7 10L17 10Z" fill="#1B263B"/>
                        </svg>
                    </button>
                    <div class="dropdown-content">
                        @foreach(LaravelLocalization::getSupportedLocales() as $localeCode => $properties)
                            <a
                                href="{{ LaravelLocalization::getLocalizedURL($localeCode, null, [], true) }}"
                                data-lang="{{ $localeCode }}"
                            >
                                {{ __('nav.lang.'.$localeCode) }}
                            </a>
                        @endforeach
                    </div>
                </div>
                <div class="mobile-button">
                    <a href="{{ config('app.contact.cabinet_url') }}" class="btn btn-outline">
                        {{ __('nav.enter') }}
                    </a>
                    <a href="/demo" class="btn btn-container">{{ __('nav.Order_a_demo') }}</a>
                </div>
            </div>
            <div class="button-group">
                <a href="{{ config('app.contact.cabinet_url') }}" class="btn btn-outline">
                    {{ __('nav.enter') }}
                </a>
                <a href="/demo" class="btn btn-container">{{ __('nav.Order_a_demo') }}</a>
            </div>

            <div class="backdrop"></div>
        </header>

        {{ $slot }}

        <!--footer-->
        <div class="footer">
            <div class="footer-container">
                <div class="footer-logo">
                    <a href="{{ route('home') }}"><img class="img-responsive" src="{{Vite::asset('resources/img/FooterLogo.png')}}" alt="logo"></a>
                </div>
                <div class="footer-links">
                    <a href="#what">{{ __('nav.product') }}</a>
                    <a href="#functions">{{ __('nav.reviews') }}</a>
                    <a href="#integration">{{ __('nav.Partners') }}</a>
                    <a href="#interesting">{{ __('nav.Blog') }}</a>
                    <a href="#faq">{{ __('nav.FAQ') }}</a>
                    <a href="#contacts">{{ __('nav.Contacts') }}</a>
                </div>
                <div class="footer-social">
                    <a href="/#">
                        <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.838989" width="56" height="56" rx="8" fill="#0D1B2A"/>
                            <path d="M30.839 29.5H33.339L34.339 25.5H30.839V23.5C30.839 22.47 30.839 21.5 32.839 21.5H34.339V18.14C34.013 18.097 32.782 18 31.482 18C28.767 18 26.839 19.657 26.839 22.7V25.5H23.839V29.5H26.839V38H30.839V29.5Z"
                                  fill="white"/>
                        </svg>
                    </a>
                    <a href="/#">
                        <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.838989" width="56" height="56" rx="8" fill="#0D1B2A"/>
                            <path d="M28.84 25C28.0443 25 27.2813 25.3161 26.7187 25.8787C26.1561 26.4413 25.84 27.2044 25.84 28C25.84 28.7956 26.1561 29.5587 26.7187 30.1213C27.2813 30.6839 28.0443 31 28.84 31C29.6356 31 30.3987 30.6839 30.9613 30.1213C31.5239 29.5587 31.84 28.7956 31.84 28C31.84 27.2044 31.5239 26.4413 30.9613 25.8787C30.3987 25.3161 29.6356 25 28.84 25ZM28.84 23C30.1661 23 31.4378 23.5268 32.3755 24.4645C33.3132 25.4021 33.84 26.6739 33.84 28C33.84 29.3261 33.3132 30.5979 32.3755 31.5355C31.4378 32.4732 30.1661 33 28.84 33C27.5139 33 26.2421 32.4732 25.3045 31.5355C24.3668 30.5979 23.84 29.3261 23.84 28C23.84 26.6739 24.3668 25.4021 25.3045 24.4645C26.2421 23.5268 27.5139 23 28.84 23ZM35.34 22.75C35.34 23.0815 35.2083 23.3995 34.9739 23.6339C34.7395 23.8683 34.4215 24 34.09 24C33.7585 24 33.4405 23.8683 33.2061 23.6339C32.9717 23.3995 32.84 23.0815 32.84 22.75C32.84 22.4185 32.9717 22.1005 33.2061 21.8661C33.4405 21.6317 33.7585 21.5 34.09 21.5C34.4215 21.5 34.7395 21.6317 34.9739 21.8661C35.2083 22.1005 35.34 22.4185 35.34 22.75ZM28.84 20C26.366 20 25.962 20.007 24.811 20.058C24.027 20.095 23.501 20.2 23.013 20.39C22.6046 20.5399 22.2354 20.7803 21.933 21.093C21.62 21.3954 21.3793 21.7646 21.229 22.173C21.039 22.663 20.934 23.188 20.898 23.971C20.846 25.075 20.839 25.461 20.839 28C20.839 30.475 20.846 30.878 20.897 32.029C20.934 32.812 21.039 33.339 21.228 33.826C21.398 34.261 21.598 34.574 21.93 34.906C22.267 35.242 22.58 35.443 23.01 35.609C23.504 35.8 24.03 35.906 24.81 35.942C25.914 35.994 26.3 36 28.839 36C31.314 36 31.717 35.993 32.868 35.942C33.65 35.905 34.176 35.8 34.665 35.611C35.073 35.4603 35.4421 35.2201 35.745 34.908C36.082 34.572 36.283 34.259 36.449 33.828C36.639 33.336 36.745 32.81 36.781 32.028C36.833 30.925 36.839 30.538 36.839 28C36.839 25.526 36.832 25.122 36.781 23.971C36.744 23.189 36.638 22.661 36.449 22.173C36.2983 21.765 36.058 21.396 35.746 21.093C35.4437 20.7798 35.0745 20.5392 34.666 20.389C34.176 20.199 33.65 20.094 32.868 20.058C31.765 20.006 31.379 20 28.839 20M28.839 18C31.556 18 31.895 18.01 32.962 18.06C34.026 18.11 34.752 18.277 35.389 18.525C36.049 18.779 36.605 19.123 37.161 19.678C37.6695 20.1779 38.0629 20.7826 38.314 21.45C38.561 22.087 38.729 22.813 38.779 23.878C38.826 24.944 38.839 25.283 38.839 28C38.839 30.717 38.829 31.056 38.779 32.122C38.729 33.187 38.561 33.912 38.314 34.55C38.0636 35.2178 37.6701 35.8226 37.161 36.322C36.661 36.8303 36.0563 37.2238 35.389 37.475C34.752 37.722 34.026 37.89 32.962 37.94C31.895 37.987 31.556 38 28.839 38C26.122 38 25.783 37.99 24.716 37.94C23.652 37.89 22.927 37.722 22.289 37.475C21.6213 37.2245 21.0165 36.8309 20.517 36.322C20.0084 35.8222 19.6149 35.2175 19.364 34.55C19.116 33.913 18.949 33.187 18.899 32.122C18.851 31.056 18.839 30.717 18.839 28C18.839 25.283 18.849 24.944 18.899 23.878C18.949 22.813 19.116 22.088 19.364 21.45C19.6142 20.7822 20.0078 20.1773 20.517 19.678C21.0167 19.1692 21.6214 18.7757 22.289 18.525C22.926 18.277 23.651 18.11 24.716 18.06C25.784 18.013 26.123 18 28.84 18"
                                  fill="white"/>
                        </svg>
                    </a>
                    <a href="/#">
                        <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.838989" width="56" height="56" rx="8" fill="#0D1B2A"/>
                            <path d="M23.7789 21C23.7787 21.5305 23.5677 22.0391 23.1924 22.4139C22.8172 22.7888 22.3084 22.9993 21.7779 22.999C21.2475 22.9988 20.7389 22.7878 20.364 22.4125C19.9891 22.0373 19.7787 21.5285 19.7789 20.998C19.7792 20.4676 19.9902 19.959 20.3654 19.5841C20.7407 19.2092 21.2495 18.9988 21.7799 18.999C22.3104 18.9993 22.819 19.2103 23.1939 19.5855C23.5687 19.9608 23.7792 20.4696 23.7789 21ZM23.8389 24.48H19.8389V37H23.8389V24.48ZM30.1589 24.48H26.1789V37H30.1189V30.43C30.1189 26.77 34.8889 26.43 34.8889 30.43V37H38.8389V29.07C38.8389 22.9 31.7789 23.13 30.1189 26.16L30.1589 24.48Z"
                                  fill="white"/>
                        </svg>
                    </a>
                    <a href="/#">
                        <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.838989" width="56" height="56" rx="8" fill="#0D1B2A"/>
                            <mask id="mask0_53_1354" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="18" y="18"
                                  width="21" height="20">
                                <path d="M18.839 18H38.839V38H18.839V18Z" fill="white"/>
                            </mask>
                            <g mask="url(#mask0_53_1354)">
                                <path d="M34.589 18.9375H37.6561L30.9561 26.6146L38.839 37.0632H32.6676L27.8304 30.7275L22.3018 37.0632H19.2318L26.3976 28.8489L18.839 18.9389H25.1676L29.5333 24.7289L34.589 18.9375ZM33.5104 35.2232H35.2104L24.239 20.6818H22.4161L33.5104 35.2232Z"
                                      fill="white"/>
                            </g>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-copy">
            <div class="footer-copy-container">
                <p>© {{ now()->format('Y') }} DATA+. {{ __('nav.All_rights_reserved') }}</p>
                <div class="footer-copy-container-link">
                    <a href="/#">{{ __('nav.Privacy_policies') }}</a>
                    <a href="/#">{{ __('nav.Terms_of_use') }}</a>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
        <script src="https://unpkg.com/imask"></script>

        @vite(['resources/js/app.js', 'resources/js/main.js', 'resources/js/glide-init.js', 'resources/js/request.js'])
    </body>
</html>
