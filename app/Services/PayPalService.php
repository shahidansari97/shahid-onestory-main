<?php

namespace App\Services;

use App\Contracts\Services\PayPalServiceInterface;
use GuzzleHttp\Client;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Percent;
use App\Models\PayPalWithdrawal;

class PayPalService implements PayPalServiceInterface
{
    private $client;
    private $baseUrl;
    private $clientId;
    private $clientSecret;
    private User $user;

    public function __construct()
    {
        $this->baseUrl = config('paypal.mode') === 'sandbox'
            ? config('paypal.url')
            : config('paypal.url');

        $this->client = new Client();
        $this->user = Auth::user();
    }

    // Get PayPal access token
    private function getAccessToken()
    {
        
        try {
            $response = $this->client->request('POST', "{$this->baseUrl}/v1/oauth2/token", [
                'auth' => [config('paypal.client_id'), config('paypal.client_secret')],
                'form_params' => ['grant_type' => 'client_credentials'],
                'verify' => true
            ]);
            $body = json_decode($response->getBody(), true);
            return $body['access_token'];
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            return ['error' => json_decode($e->getResponse()->getBody()->getContents(), true)];
        }

    }

    public function processPayment($amount)
    {
        $requestedAmount = $amount * CENT_COEFFICIENT;
        $userBalanceAsFunds = $this->user->balance / Percent::first()->balance_divider * CENT_COEFFICIENT;

        if ($userBalanceAsFunds < $requestedAmount) {
            return ['error' => "Insufficient funds for withdrawal."];
        }
        if (!$this->user->paypal_id) {
            return ['error' => "Please verify your PayPal account first!"];
        }

        $response = $this->sendPayout($this->user, $requestedAmount);

        return $this->handlePayoutResponse($this->user, $amount, $response);
    }


    // Send Payout
    public function sendPayout($user, $amount)
    {
        $accessToken = $this->getAccessToken();
        $response = $this->client->request('POST', "{$this->baseUrl}/v1/payments/payouts", [
            'headers' => [
                'Authorization' => "Bearer $accessToken",
                'Content-Type' => 'application/json'
            ],
            'json' => [
                'sender_batch_header' => [
                    "sender_batch_id"=> "Payouts_".date('Y').'_'.uniqid(),
                    'email_subject' => "You have received a payout!"
                ],
                'items' => [
                    [
                        'recipient_type' => 'PAYPAL_ID',
                        'receiver' => $user->paypal_id, // Dynamic email from request
                        'amount' => [
                            'value' => $amount / 100,
                            'currency' => config('paypal.currency')
                        ],
                        'note' => "Withdrawal from Wallet",
                        'sender_item_id' => uniqid(),
                    ]
                ]
            ],
            'verify' => false
        ]);
        $responseData = json_decode($response->getBody(), true);
        
        if (isset($responseData['batch_header']['payout_batch_id'])) {
            return $this->getPayoutStatus($responseData['batch_header']['payout_batch_id']);
        }

    }
    public function getPayoutStatus($payoutBatchId)
    {
        $accessToken = $this->getAccessToken();
        sleep(10);
        $response = $this->client->request('GET', "{$this->baseUrl}/v1/payments/payouts/{$payoutBatchId}", [
            'headers' => [
                'Authorization' => "Bearer $accessToken",
                'Content-Type' => 'application/json'
            ],
            'verify' => true
        ]);
       
        return json_decode($response->getBody(), true);
    }

    private function handlePayoutResponse($user, $amount, $response)
    {
        $batchStatus = optional($response)['batch_header']['batch_status'] ?? null;

        if ($batchStatus == 'FAILED') {
            return ['error' => 'Payout Failed', 'data' => $response];
        }
        if (in_array($batchStatus, ['PENDING', 'SUCCESS', 'PROCESSING'])) {
            $data = [
                'user_id' => $user->id,
                'payout_batch_id' => optional($response)['batch_header']['payout_batch_id'],
                'batch_status' => $batchStatus,
                'amount' => $amount,
                'wallet_amount' => $user->balance,
                'currency' => @$response['batch_header']['amount']['currency'],
            ];

            PayPalWithdrawal::create($data);

            // Deduct amount from wallet
            $user->balance -= $this->getAmountAsBonusView($amount);
            $user->save();

            $message = ($batchStatus == 'PROCESSING')
                ? 'PayPal email is not registered, Please check email!'
                : 'Payout initiated successfully';

            return ['success' => $message, 'data' => $response];
        }

        return ['error' => 'Unexpected response from PayPal', 'data' => $response];
    }
    private function getAmountAsBonusView($amount): float
    {
        return $amount * Percent::first()->balance_divider;
    }




}
