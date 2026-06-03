<?php

namespace App\Contracts\Services;

use Illuminate\Http\JsonResponse;
use Stripe\Account;

interface PaymentServiceInterface
{
    public function makeCheckoutSession($amount);
    public function storeTransactionData($amount): array;
    public function initConnectedStripeAccount($ip): Account;
    public function addFullUserDataToConnectedStripeAccount($request): Account;
    public function withdraw($request): JsonResponse;
}
