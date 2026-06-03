<?php

namespace App\Contracts\Services;

use Illuminate\Http\JsonResponse;
use Stripe\Account;

interface StripeServiceInterface
{
    public function makeCheckoutSession($amount);
    public function storeTopUpData($amount): array;
    public function findOrCreateConnectedAccount($ip): Account;
    public function payoutFundsToExternalAccount(float $amount): array;
    public function getOnboardingLink();
}
