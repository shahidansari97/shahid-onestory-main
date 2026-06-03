<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Http;
use App\Models\PayPalWithdrawal;

use App\Http\Services\PayPalService;

class PayPalWebhookController extends Controller
{
    private $client;
    private $baseUrl;
    private $clientId;
    private $clientSecret;

    public function __construct()
    {
         $this->baseUrl = config('paypal.mode') === 'sandbox'
            ? config('paypal.url')
            : config('paypal.url');
        $this->client = new Client();
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        
        // Verify webhook signature
        if (!$this->verifyWebhookSignature($request)) {
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        // Handle event types
        // Process different payout statuses
    switch ($payload['event_type']) {
        case 'PAYMENT.PAYOUTSBATCH.SUCCESS':
           
            $payoutBatchId = $payload['resource']['batch_header']['payout_batch_id'] ?? null;
            $batchStatus = $payload['resource']['batch_header']['batch_status'] ?? 'PROCESSING';

            $exists = PayPalWithdrawal::where('payout_batch_id', $payoutBatchId)->exists();
            if ($exists) {
                if (!empty($payoutBatchId)) {
                    PayPalWithdrawal::where('payout_batch_id', $payoutBatchId)->update(['batch_status'=> $batchStatus]);
                    
                } else {
                    
                }
            }
            break;

        case 'PAYMENT.PAYOUTSBATCH.DENIED':
            $payoutBatchId = $payload['resource']['batch_header']['payout_batch_id'] ?? null;
            $batchStatus = $payload['resource']['batch_header']['batch_status'] ?? 'DENIED';

            $exists = PayPalWithdrawal::where('payout_batch_id', $payoutBatchId)->exists();
            if ($exists) {
                if (!empty($payoutBatchId)) {
                    PayPalWithdrawal::where('payout_batch_id', $payoutBatchId)->update(['batch_status'=> $batchStatus]);
                    
                } else {
                    
                }
            }
            break;

        case 'PAYMENT.PAYOUTSBATCH.PROCESSING':
            $payoutBatchId = $payload['resource']['batch_header']['payout_batch_id'] ?? null;
            $batchStatus = $payload['resource']['batch_header']['batch_status'] ?? 'PROCESSING';

            $exists = PayPalWithdrawal::where('payout_batch_id', $payoutBatchId)->exists();
            if ($exists) {
                if (!empty($payoutBatchId)) {
                    PayPalWithdrawal::where('payout_batch_id', $payoutBatchId)->update(['batch_status'=> $batchStatus]);
                    
                } else {
                   
                }
            }
            break;

        case 'PAYMENT.PAYOUTSBATCH.FAILED':
            $payoutBatchId = $payload['resource']['batch_header']['payout_batch_id'] ?? null;
            $batchStatus = $payload['resource']['batch_header']['batch_status'] ?? 'FAILED';

            $exists = PayPalWithdrawal::where('payout_batch_id', $payoutBatchId)->exists();
            if ($exists) {
                if (!empty($payoutBatchId)) {
                    PayPalWithdrawal::where('payout_batch_id', $payoutBatchId)->update(['batch_status'=> $batchStatus]);
                    
                } else {
                    
                }
            }
            break;

        default:
            break;
        }

        return response()->json(['message' => 'Webhook processed']);
    }

    public function getAccessToken()
        {
            try {
                $response = $this->client->request('POST', "{$this->baseUrl}/v1/oauth2/token", [
                    'auth' => [config('paypal.client_id'), config('paypal.client_secret')],
                    'form_params' => ['grant_type' => 'client_credentials'],
                    'verify' => false
                ]);
                $body = json_decode($response->getBody(), true);
                return $body['access_token'];
            } catch (\GuzzleHttp\Exception\ClientException $e) {
                return ['error' => json_decode($e->getResponse()->getBody()->getContents(), true)];
            }

        }

    private function verifyWebhookSignature(Request $request)
    {
        $headers = $request->headers->all();
        $paypalWebhookId = config('paypal.webhook_id');
        $paypalClientId = config('paypal.client_id');
        $paypalSecret = config('paypal.client_secret');

        // Ensure PayPal credentials exist
        if (empty($paypalClientId) || empty($paypalSecret) || empty($paypalWebhookId)) {
            return false;
        }


        

        if (!$this->getAccessToken()) {
            return false;
        }


        // Verify webhook signature
        $verificationResponse = Http::withToken($this->getAccessToken())
            ->withOptions(['verify' => true]) // Ensure SSL verification
            ->post('https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature', [
                'auth_algo'        => $headers['paypal-auth-algo'][0],
                'cert_url'         => $headers['paypal-cert-url'][0],
                'transmission_id'  => $headers['paypal-transmission-id'][0],
                'transmission_sig' => $headers['paypal-transmission-sig'][0],
                'transmission_time'=> $headers['paypal-transmission-time'][0],
                'webhook_id'       => $paypalWebhookId,
                'webhook_event'    => $request->all(),
            ]);

        // Handle verification failure
        if ($verificationResponse->failed()) {

            return false;
        }

        // Extract verification status
        $verificationData = $verificationResponse->json();
        if (($verificationData['verification_status'] ?? '') !== 'SUCCESS') {
            return false;
        }
        return true;
    }
    
}
