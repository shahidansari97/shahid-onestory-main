<div class="benefit-for-you-container">
    <div class="benefit-for-you">
        <div class="benefit-for-you-title">
            <div class="title">
                <h2><span>{{ __('home.benefit-for-you-container.benefit-for-you-title.span') }} </span>{{ __('home.benefit-for-you-container.benefit-for-you-title.h2') }}</h2>
            </div>
            <div>
                <div class="benefit-for-you-button-container">
                    <button class="benefit-button active" id="for-company">{{ __('home.benefit-for-you-container.benefit-for-you-title.btn1') }}</button>
                    <button class="benefit-button" id="for-team">{{ __('home.benefit-for-you-container.benefit-for-you-title.btn2') }}</button>
                </div>
            </div>
        </div>
        <div class="benefit-for-you-grid active">
            <div class="swiper benefit-swiper-command">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <div class="grid-slider">
                            <div>
                                <img class="img-responsive" src="{{Vite::asset('resources/img/BenefitForYou/img_1.png')}}" alt="BenefitForYou">
                            </div>
                            <div class="benefit-for-you-grid-desc">
                                <h3>{{ __('home.benefit-for-you-container.benefit-for-you-grid-desc.1.h3') }}</h3>
                                <p>{{ __('home.benefit-for-you-container.benefit-for-you-grid-desc.1.p') }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="grid-slider">
                            <div>
                                <img class="img-responsive" src="{{Vite::asset('resources/img/BenefitForYou/img_1.png')}}" alt="BenefitForYou">
                            </div>
                            <div class="benefit-for-you-grid-desc">
                                 <h3>{{ __('home.benefit-for-you-container.benefit-for-you-grid-desc.2.h3') }}</h3>
                                 <p>{{ __('home.benefit-for-you-container.benefit-for-you-grid-desc.2.p') }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="grid-slider">
                            <div>
                                <img class="img-responsive" src="{{Vite::asset('resources/img/BenefitForYou/img_1.png')}}" alt="BenefitForYou">
                            </div>
                            <div class="benefit-for-you-grid-desc">
                                 <h3>{{ __('home.benefit-for-you-container.benefit-for-you-grid-desc.3.h3') }}</h3>
                                 <p>{{ __('home.benefit-for-you-container.benefit-for-you-grid-desc.3.p') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="horizontal-stripe"></div>

            <div class="benefit-for-you-footer">
                <button class="benefit-command-button-prev  button-swiper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.53 5.46983C10.6705 5.61045 10.7494 5.80108 10.7494 5.99983C10.7494 6.19858 10.6705 6.3892 10.53 6.52983L5.81001 11.2498H20C20.1989 11.2498 20.3897 11.3288 20.5303 11.4695C20.671 11.6102 20.75 11.8009 20.75 11.9998C20.75 12.1987 20.671 12.3895 20.5303 12.5302C20.3897 12.6708 20.1989 12.7498 20 12.7498H5.81001L10.53 17.4698C10.6037 17.5385 10.6628 17.6213 10.7038 17.7133C10.7448 17.8053 10.7668 17.9046 10.7686 18.0053C10.7704 18.106 10.7519 18.206 10.7141 18.2994C10.6764 18.3928 10.6203 18.4776 10.549 18.5489C10.4778 18.6201 10.393 18.6762 10.2996 18.714C10.2062 18.7517 10.1062 18.7702 10.0055 18.7684C9.90479 18.7666 9.80547 18.7446 9.71347 18.7036C9.62147 18.6626 9.53867 18.6035 9.47001 18.5298L3.47001 12.5298C3.32956 12.3892 3.25067 12.1986 3.25067 11.9998C3.25067 11.8011 3.32956 11.6105 3.47001 11.4698L9.47001 5.46983C9.61064 5.32938 9.80126 5.25049 10 5.25049C10.1988 5.25049 10.3894 5.32938 10.53 5.46983Z" fill="#219EBC"/>
                    </svg>
                </button>
                <div class="pagination">
                    <div class="benefit-command-swiper-pagination"></div>
                </div>

                <button class="benefit-command-button-next button-swiper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.47 18.5302C13.3296 18.3895 13.2507 18.1989 13.2507 18.0002C13.2507 17.8014 13.3296 17.6108 13.47 17.4702L18.1901 12.7502L4.00005 12.7502C3.80114 12.7502 3.61037 12.6712 3.46972 12.5305C3.32907 12.3898 3.25005 12.1991 3.25005 12.0002C3.25005 11.8013 3.32907 11.6105 3.46972 11.4698C3.61037 11.3292 3.80114 11.2502 4.00005 11.2502L18.1901 11.2502L13.4701 6.53017C13.3964 6.46151 13.3373 6.37871 13.2963 6.28671C13.2553 6.19471 13.2332 6.0954 13.2315 5.99469C13.2297 5.89399 13.2482 5.79396 13.2859 5.70057C13.3236 5.60719 13.3798 5.52235 13.451 5.45113C13.5222 5.37991 13.6071 5.32377 13.7005 5.28605C13.7938 5.24833 13.8939 5.2298 13.9946 5.23158C14.0953 5.23336 14.1946 5.2554 14.2866 5.29639C14.3786 5.33738 14.4614 5.39648 14.5301 5.47017L20.5301 11.4702C20.6705 11.6108 20.7494 11.8014 20.7494 12.0002C20.7494 12.1989 20.6705 12.3895 20.5301 12.5302L14.53 18.5302C14.3894 18.6706 14.1988 18.7495 14 18.7495C13.8013 18.7495 13.6107 18.6706 13.47 18.5302Z" fill="#219EBC"/>
                    </svg>

                </button>
            </div>
        </div>
        <div class="benefit-for-you-grid">
            <div class="swiper benefit-swiper-team">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <div class="grid-slider">
                            <div>
                                <img class="img-responsive" src="{{Vite::asset('resources/img/BenefitForYou/img_1.png')}}" alt="BenefitForYou">
                            </div>
                            <div class="benefit-for-you-grid-desc">

                                <h3>{{ __('home.benefit-for-you-container.benefit-for-you-grid-desc.4.h3') }}</h3>
                                <p>{{ __('home.benefit-for-you-container.benefit-for-you-grid-desc.4.p') }}</p>
                            </div>

                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="grid-slider">
                            <div>
                                <img class="img-responsive" src="{{Vite::asset('resources/img/BenefitForYou/img_1.png')}}" alt="BenefitForYou">
                            </div>
                            <div class="benefit-for-you-grid-desc">
                               <h3>{{ __('home.benefit-for-you-container.benefit-for-you-grid-desc.5.h3') }}</h3>
                               <p>{{ __('home.benefit-for-you-container.benefit-for-you-grid-desc.5.p') }}</p>
                            </div>

                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="grid-slider">
                            <div>
                                <img class="img-responsive" src="{{Vite::asset('resources/img/BenefitForYou/img_1.png')}}" alt="BenefitForYou">
                            </div>
                            <div class="benefit-for-you-grid-desc">
                                <h3>{{ __('home.benefit-for-you-container.benefit-for-you-grid-desc.6.h3') }}</h3>
                                <p>{{ __('home.benefit-for-you-container.benefit-for-you-grid-desc.6.p') }}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="horizontal-stripe"></div>


            <div class="benefit-for-you-footer">
                <button class="benefit-team-button-prev button-swiper">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.53 5.46983C10.6705 5.61045 10.7494 5.80108 10.7494 5.99983C10.7494 6.19858 10.6705 6.3892 10.53 6.52983L5.81001 11.2498H20C20.1989 11.2498 20.3897 11.3288 20.5303 11.4695C20.671 11.6102 20.75 11.8009 20.75 11.9998C20.75 12.1987 20.671 12.3895 20.5303 12.5302C20.3897 12.6708 20.1989 12.7498 20 12.7498H5.81001L10.53 17.4698C10.6037 17.5385 10.6628 17.6213 10.7038 17.7133C10.7448 17.8053 10.7668 17.9046 10.7686 18.0053C10.7704 18.106 10.7519 18.206 10.7141 18.2994C10.6764 18.3928 10.6203 18.4776 10.549 18.5489C10.4778 18.6201 10.393 18.6762 10.2996 18.714C10.2062 18.7517 10.1062 18.7702 10.0055 18.7684C9.90479 18.7666 9.80547 18.7446 9.71347 18.7036C9.62147 18.6626 9.53867 18.6035 9.47001 18.5298L3.47001 12.5298C3.32956 12.3892 3.25067 12.1986 3.25067 11.9998C3.25067 11.8011 3.32956 11.6105 3.47001 11.4698L9.47001 5.46983C9.61064 5.32938 9.80126 5.25049 10 5.25049C10.1988 5.25049 10.3894 5.32938 10.53 5.46983Z" fill="#219EBC"/>
                                                    </svg>
                </button>
                <div class="pagination">
                    <div class="benefit-team-swiper-pagination"></div>
                </div>
                <button class="benefit-team-button-next button-swiper">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                       <path fill-rule="evenodd" clip-rule="evenodd" d="M13.47 18.5302C13.3296 18.3895 13.2507 18.1989 13.2507 18.0002C13.2507 17.8014 13.3296 17.6108 13.47 17.4702L18.1901 12.7502L4.00005 12.7502C3.80114 12.7502 3.61037 12.6712 3.46972 12.5305C3.32907 12.3898 3.25005 12.1991 3.25005 12.0002C3.25005 11.8013 3.32907 11.6105 3.46972 11.4698C3.61037 11.3292 3.80114 11.2502 4.00005 11.2502L18.1901 11.2502L13.4701 6.53017C13.3964 6.46151 13.3373 6.37871 13.2963 6.28671C13.2553 6.19471 13.2332 6.0954 13.2315 5.99469C13.2297 5.89399 13.2482 5.79396 13.2859 5.70057C13.3236 5.60719 13.3798 5.52235 13.451 5.45113C13.5222 5.37991 13.6071 5.32377 13.7005 5.28605C13.7938 5.24833 13.8939 5.2298 13.9946 5.23158C14.0953 5.23336 14.1946 5.2554 14.2866 5.29639C14.3786 5.33738 14.4614 5.39648 14.5301 5.47017L20.5301 11.4702C20.6705 11.6108 20.7494 11.8014 20.7494 12.0002C20.7494 12.1989 20.6705 12.3895 20.5301 12.5302L14.53 18.5302C14.3894 18.6706 14.1988 18.7495 14 18.7495C13.8013 18.7495 13.6107 18.6706 13.47 18.5302Z" fill="#219EBC"/>
                                                   </svg>
                </button>
            </div>
        </div>
        <div class="benefit-for-you-footer-block">
            <h3><span>data+ </span>{{ __('home.benefit-for-you-container.benefit-for-you-footer-block.h3') }} </h3>
            <a href="{{ route('demo') }}" class="btn btn-outline">{{ __('home.benefit-for-you-container.benefit-for-you-footer-block.a') }}</a>
        </div>
    </div>
</div>
