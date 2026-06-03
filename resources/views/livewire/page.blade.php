<div class="container">
    <div class="container-news">
        <div class="news-photo">
            <img class="img-responsive" src="{{ asset("storage/" . $page[0]['image']) }}" alt="error">
        </div>

        <div class="news-item">
            <div class="news-title">
                <h3>{!! $page[0]['title'] !!}</h3>
            </div>
            <div class="news-content">
                {!! $page[0]['content'] !!}
            </div>
        </div>
    </div>
</div>
