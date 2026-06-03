<?php

return [

    'currency' => env('PAYPAL_CURRENCY', 'USD'),
    'client_id' => env('PAYPAL_CLIENT_ID', 'USD'),
    'client_secret' => env('PAYPAL_CLIENT_SECRET', 'USD'),
    'mode' => env('PAYPAL_MODE', 'sandbox'),
    'url' => env('PAYPAL_URL', 'https://api-m.sandbox.paypal.com'),
    'webhook_id' => env('PAYPAL_WEBHOOK_ID', ''),
    'redirect_uri' => env('PAYPAL_REDIRECT_URI', 'https://onestoryplanet.com/paypal/callback'),
    'scope'         => env('PAYPAL_SCOPE'),
    'paypal_attribute'         => 'https://uri.paypal.com/services/paypalattributes',
    'auth_url'      => [
        'sandbox' => 'https://www.sandbox.paypal.com/signin/authorize',
        'live'    => 'https://www.paypal.com/signin/authorize',
    ],
    'token_url'     => [
        'sandbox' => 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        'live'    => 'https://api-m.paypal.com/v1/oauth2/token',
    ],
    'user_info_url' => [
        'sandbox' => 'https://api.sandbox.paypal.com/v1/identity/oauth2/userinfo?schema=paypalv1.1',
        'live'    => 'https://api.paypal.com/v1/identity/oauth2/userinfo?schema=paypalv1.1',
    ],



];
