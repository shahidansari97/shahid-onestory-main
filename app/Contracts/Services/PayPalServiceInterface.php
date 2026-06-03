<?php

namespace App\Contracts\Services;

use Illuminate\Http\JsonResponse;

interface PayPalServiceInterface
{
    public function processPayment($amount);
}
