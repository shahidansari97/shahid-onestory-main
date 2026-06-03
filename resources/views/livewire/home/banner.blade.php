<!--/*Home*/-->
<div class="home">
    <div class="home-container">
        <div class="home-title">
            <h1><span>DATA+</span> <br>{{ __('home.banner.h1') }} <br> {{ __('home.banner.h1_2') }}</h1>
            <p>{{ __('home.banner.p') }}</p>
            <button class="btn btn-container" type="button">
                <a href="{{ route('demo') }}" class="btn btn-container">
                    {{ __('home.banner.btn') }}
                </a>
            </button>

        </div>
        <div class="home-img">
            <img class="img-responsive" src="{{Vite::asset('resources/img/HomeImg.png')}}" alt="home">
        </div>
    </div>
</div>
