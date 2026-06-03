<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" href="{{asset('/favicon-v2.png')}}" type="image/x-icon">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
        <title>Too Many Requests</title>
        <style>
            html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: hidden; /* Prevent scrollbars */
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .error-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                text-align: center;
                box-sizing: border-box;
            }

            .error-container img {
                max-width: 300px;
                max-height: 300px;
                margin-bottom: 20px;
                animation: float 3s ease-in-out infinite;
            }

            .error-title {
                font-size: 72px;
                font-weight: bold;
                color: #af89c8;
                margin: 0 0 10px;
            }

            .error-subtitle {
                font-size: 24px;
                color: #333;
                margin: 0 0 20px;
            }

            .error-message {
                font-size: 16px;
                color: #555;
                margin: 0 0 30px;
                padding: 0 20px;
            }

            .back-home {
                display: inline-block;
                background-color: #FFDA79;
                color: #fff;
                padding: 12px 24px;
                border-radius: 5px;
                text-decoration: none;
                transition: background-color 0.3s ease;
            }

            .back-home:hover {
                background: linear-gradient(57.17deg, #9DC2F6 .14%, #9DC2F6 .15%, #E9C9C6 85%);
            }

            @keyframes float {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-10px);
                }
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <img src="{{ asset('img/errors/429.png') }}" alt="429 Image" onerror="this.style.display='none'">
            <div class="error-title">429</div>
            <div class="error-subtitle">Too Many Requests</div>
            <div class="error-message">
                You’ve made too many requests in a short period of time.<br>
                Please slow down and try again later.
            </div>
            <a href="{{ url('/') }}" class="back-home">⬅ Go Back to Homepage</a>
        </div>
    </body>
</html>