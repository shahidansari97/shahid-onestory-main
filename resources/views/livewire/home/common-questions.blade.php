<div class="container" id="faq">
    <div class="questions">
        <div class="title">
            <h2>{{ __('home.common-questions.title.h2') }}
                <span>{{ __('home.common-questions.title.span') }} </span>{{ __('home.common-questions.title.h2_2') }}
                <span class='title-logo'>DATA+</span></h2>
        </div>
        <div class="questions-items">
            @if(isset($FAQ))
                @foreach($FAQ as $key => $faq)
                    <div class="questions-item">
                        <div class="questions-item-title accordion">
                            <div class="accordion-title">
                            <span class="icon inactive">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" fill="white"/>
                                    <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#E0E1DD"/>
                                    <path
                                        d="M26 20.998H21V25.998C21 26.2633 20.8946 26.5176 20.7071 26.7052C20.5196 26.8927 20.2652 26.998 20 26.998C19.7348 26.998 19.4804 26.8927 19.2929 26.7052C19.1054 26.5176 19 26.2633 19 25.998V20.998H14C13.7348 20.998 13.4804 20.8927 13.2929 20.7052C13.1054 20.5176 13 20.2633 13 19.998C13 19.7328 13.1054 19.4785 13.2929 19.2909C13.4804 19.1034 13.7348 18.998 14 18.998H19V13.998C19 13.7328 19.1054 13.4785 19.2929 13.2909C19.4804 13.1034 19.7348 12.998 20 12.998C20.2652 12.998 20.5196 13.1034 20.7071 13.2909C20.8946 13.4785 21 13.7328 21 13.998V18.998H26C26.2652 18.998 26.5196 19.1034 26.7071 19.2909C26.8946 19.4785 27 19.7328 27 19.998C27 20.2633 26.8946 20.5176 26.7071 20.7052C26.5196 20.8927 26.2652 20.998 26 20.998Z"
                                        fill="#219EBC"/>
                                </svg>
                            </span>
                                <span class="icon active">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" fill="#219EBC"/>
                                    <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#E0E1DD"/>
                                    <path
                                        d="M26 20.998H14C13.7348 20.998 13.4804 20.8927 13.2929 20.7052C13.1054 20.5176 13 20.2633 13 19.998C13 19.7328 13.1054 19.4785 13.2929 19.2909C13.4804 19.1034 13.7348 18.998 14 18.998H26C26.2652 18.998 26.5196 19.1034 26.7071 19.2909C26.8946 19.4785 27 19.7328 27 19.998C27 20.2633 26.8946 20.5176 26.7071 20.7052C26.5196 20.8927 26.2652 20.998 26 20.998Z"
                                        fill="white"/>
                                </svg>
                            </span>
                                <h6>{!! $faq['question'] !!}</h6>
                            </div>
                            <h6 class="title-idx">{{ ++$key }}</h6>
                        </div>
                        <div class="questions-item-desc">
                            <p>{!! $faq['answer'] !!}</p>

                        </div>
                    </div>
                    @if(isset($FAQ[$key]))
                        <div class="horizontal-stripe"></div>
                    @endif
                @endforeach
            @endif
        </div>
    </div>
</div>
