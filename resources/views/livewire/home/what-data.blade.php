<div class="what-data" id="what">
    <div class="what-data-container parallax-enabled">
        <div class="what-data-title parallax-text">
            <h2>{{ __('home.what-data.what-data-title.h2') }}
                <span>{{ __('home.what-data.what-data-title.span') }}</span><span class="what-data-title-end">?</span>
            </h2>
            <p>
                <span>DATA+</span>
                {{ __('home.what-data.what-data-title.p') }}
                <span class='accent-text'>{{ __('home.what-data.what-data-title.p1') }}</span>
                {{ __('home.what-data.what-data-title.p2') }}
                <span class='accent-text'>{{ __('home.what-data.what-data-title.p3') }}</span>
                {{ __('home.what-data.what-data-title.p4') }}
                <span class='accent-text'>{{ __('home.what-data.what-data-title.p5') }}</span>


            </p>
            <button class="btn btn-container">
                <a href="{{ route('demo') }}" class="btn btn-container">
                    {{ __('home.what-data.what-data-title.btn') }}
                </a>
            </button>
        </div>
        <div class="what-data-img">
            <div class="what-data-img-item-1">
                <div>
                    <img class="img-responsive" src="{{Vite::asset('resources/img/WhatDataImg/img_1.png')}}"
                         alt="what-data-img">
                </div>
                <div>
                    <img class="img-responsive" src="{{Vite::asset('resources/img/WhatDataImg/img_2.png')}}"
                         alt="what-data-img">
                </div>
            </div>
            <div class="what-data-img-item-2">
                <div>
                    <img class="img-responsive" src="{{Vite::asset('resources/img/WhatDataImg/img_3.png')}}"
                         alt="what-data-img">
                </div>
            </div>
            <div class="what-data-img-item-1">
                <div>
                    <img class="img-responsive" src="{{Vite::asset('resources/img/WhatDataImg/img_4.png')}}"
                         alt="what-data-img">
                </div>
                <div>
                    <img class="img-responsive" src="{{Vite::asset('resources/img/WhatDataImg/img_5.png')}}"
                         alt="what-data-img">
                </div>
            </div>
        </div>
        <div class="what-data-img-mobile-container">
            <div class="what-data-img-mobile">
                <div class="swiper swiper-what-data-img-mobile">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <div class="swiper-what-data-img-mobile-item">
                                <img class="img-responsive" src="{{Vite::asset('resources/img/WhatDataImg/img_1.png')}}"
                                     alt="what-data-img">
                            </div>
                        </div>
                        <div class="swiper-slide">
                            <div class="swiper-what-data-img-mobile-item">
                                <img class="img-responsive" src="{{Vite::asset('resources/img/WhatDataImg/img_2.png')}}"
                                     alt="what-data-img">
                            </div>
                        </div>
                        <div class="swiper-slide">
                            <div class="swiper-what-data-img-mobile-item">
                                <img class="img-responsive" src="{{Vite::asset('resources/img/WhatDataImg/img_3.png')}}"
                                     alt="what-data-img">
                            </div>
                        </div>
                        <div class="swiper-slide">
                            <div class="swiper-what-data-img-mobile-item">
                                <img class="img-responsive" src="{{Vite::asset('resources/img/WhatDataImg/img_4.png')}}"
                                     alt="what-data-img">
                            </div>

                        </div>
                        <div class="swiper-slide">
                            <div class="swiper-what-data-img-mobile-item">
                                <img class="img-responsive" src="{{Vite::asset('resources/img/WhatDataImg/img_5.png')}}"
                                     alt="what-data-img">
                            </div>

                        </div>
                    </div>
                </div>
                <div class="swiper-pagination-what-data"></div>

            </div>
        </div>

    </div>


</div>
