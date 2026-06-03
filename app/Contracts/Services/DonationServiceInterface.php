<?php

namespace App\Contracts\Services;

use Illuminate\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

interface DonationServiceInterface
{
    public function makeCheckoutSession($amount);
    public function storeTransactionData($amount): array;
}
