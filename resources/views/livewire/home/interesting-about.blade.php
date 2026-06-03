<div class="interesting">
    <div class="title">
        <h2><span>{{ __('home.interesting-about.title.span') }}</span> {{ __('home.interesting-about.title.h2') }} <span
                class='title-logo'>DATA+</span></h2>
    </div>
    <div class="interesting-items">
        <div class="swiper swiper-interesting-items">
            <div class="swiper-wrapper">
                @foreach($pages as $page)
                    <div class="swiper-slide">
                        <a href="/page/{{ $page['slug'] }}">
                            <div class="interesting-item">
                                <div class="interesting-item-photo">
                                    <img class="img-responsive" src="{{ asset('storage/' . $page['image']) }}"
                                         alt="No pic">
                                </div>
                                <div class="interesting-item-title">
                                    <h6>{!! \Illuminate\Support\Str::limit($page['title'], 70, $end='...') !!}</h6>
                                </div>
                                <div class="interesting-item-desc">
                                    <p>{!! \Illuminate\Support\Str::limit($page['content'], 150, $end='...') !!}</p>
                                </div>
                                <div class="interesting-item-footer">
                                    <p> {{ \Carbon\Carbon::parse($page['updated_at'])->format('d.m.Y') }} </p>
                                </div>
                            </div>
                        </a>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
    <div class="swiper-pagination-interesting"></div>
</div>
