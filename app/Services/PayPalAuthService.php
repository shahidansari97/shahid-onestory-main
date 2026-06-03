<?php

namespace App\Services;

use App\Contracts\Services\PayPalAuthServiceInterface;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use App\Models\Percent;
use App\Models\User;
use Exception;
use App\Models\PayPalWithdrawal;

class PayPalAuthService implements PayPalAuthServiceInterface
{
    private $client;
    private $baseUrl;
    private $clientId;
    private $clientSecret;
    private $mode;
    private $scope;
    private $redirectUri;
    private $paypalAttribute;
    private User $user;

    public function __construct()
    {
        $this->baseUrl = config('paypal.mode') === 'sandbox'
            ? config('paypal.url')
            : config('paypal.url');

        $this->client = new Client();
        if(Auth::user()) {
            $this->user = Auth::user();
        }
        $this->clientId = config('paypal.client_id');
        $this->clientSecret = config('paypal.client_secret');
        $this->mode = config('paypal.mode');
        $this->scope = config('paypal.scope');
        $this->redirectUri = config('paypal.redirect_uri');
        $this->paypalAttribute = config('paypal.paypal_attribute');
    }

    public function redirectToPayPal()
    {
        $authUrls = config('paypal.auth_url');
        if (empty($this->clientId) || empty($this->scope) || empty($this->redirectUri) || !isset($authUrls[$this->mode])) {
            return ['status' => false, 'message' => 'Missing or invalid PayPal configuration'];
        }
        $queryParams = [
            'client_id'     => $this->clientId,
            'response_type' => 'code',
            'scope'         => implode(' ', [$this->scope, $this->paypalAttribute]),
            'redirect_uri'  => $this->redirectUri,
        ];
        $authUrl = $authUrls[$this->mode] . '?' . http_build_query($queryParams);
        return ['status' => true, 'url' => $authUrl];

    }

    public function handlePayPalCallback($request)
    {

        $code = $request['code'];
        if (!$code) {
            return ['status' => false, 'message' => 'Authorization code missing'];
        }
        $tokenUrl = config("paypal.token_url.$this->mode");
        if (!$tokenUrl) {
            return ['status' => false, 'message' => 'Invalid PayPal token URL'];
        }
        $tokenResponse = Http::asForm()->withBasicAuth($this->clientId, $this->clientSecret)
        ->withOptions(['verify' => true])
        ->post($tokenUrl, [
            'grant_type' => 'authorization_code',
            'code'       => $code,
        ]);

        if ($tokenResponse->failed()) {
            return ['status' => false, 'message' => 'Failed to obtain access token'];
        }
        $tokenData = $tokenResponse->json();
        $accessToken = $tokenData['access_token'];
        if (!$accessToken) {
            return ['status' => false, 'message' => 'Access token missing'];
        }

         return $userInfoDetails = $this->getPayPalUserInfo($accessToken);

    }

    // Step 4: Fetch PayPal User Information
    private function getPayPalUserInfo($accessToken)
    {
        try {
            $paypalUserInfoUrls = [
                'sandbox' => config('paypal.user_info_url.sandbox'),
                'live'    => config('paypal.user_info_url.live'),
            ];
            if (!isset($paypalUserInfoUrls[$this->mode])) {
                return ['status'=>false, 'message' => 'Invalid PayPal mode'];
            }
            $userInfoUrl = $paypalUserInfoUrls[$this->mode] ?? $paypalUserInfoUrls['sandbox'];
            if (!$userInfoUrl) {
                return ['status' => false, 'message' => 'PayPal User Info URL missing'];
            }
            $userResponse = Http::withToken($accessToken)
                ->withOptions(['verify' => false]) // Disable SSL verification
                ->get($userInfoUrl);

            if ($userResponse->failed()) {
                $decodedError = json_decode($userResponse->body(), true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    return ['status'  => false, 'message' => $decodedError['error_description'] ?? $decodedError['message'] ?? 'Unknown PayPal API error'];
                }
                return ['status'=>false, 'message' => $userResponse->body()];
            }
            $userInfo = $userResponse->json();

            if (!isset($userInfo['payer_id']) || empty($userInfo['payer_id'])) {
                return ['status'=>false, 'message' => 'Invalid PayPal user info'];
            }
            $user = User::find($this->user->id);
            if ($user) {
                $user->update([
                    'paypal_id' => $userInfo['payer_id'],
                    'paypal_email' => @$userInfo['emails'][0]['value'] ?? null,
                ]);
            }
            return ['status' => true, 'message' => 'PayPal info updated'];
        } catch (\Throwable $e) {
            $errorMessage = $e->getMessage();
            if ($e instanceof \Illuminate\Http\Client\RequestException) {
                $response = $e->response;
                if ($response) {
                    $decodedError = json_decode($response->body(), true);

                    if (json_last_error() === JSON_ERROR_NONE) {
                        if (isset($decodedError['error_description'])) {
                            return ['status' => false, 'message' => $decodedError['error_description']];
                        }
                        if (isset($decodedError['message'])) {
                            return ['status' => false, 'message' => $decodedError['message']];
                        }
                    }
                }
            }
            return ['status' => false, 'message' => $errorMessage];

        }

    }
    public function paypalAccountRemove($request)
    {
        $user = User::find($this->user->id);
        if($user){
            $user->update(['paypal_id' => null, 'paypal_email'=> null]);
            return ['status' => true, 'message' => 'PayPal Account Removed!'];
        }else{
            return ['status' => true, 'message' => 'Something went wrong!'];
        }

    }



}
