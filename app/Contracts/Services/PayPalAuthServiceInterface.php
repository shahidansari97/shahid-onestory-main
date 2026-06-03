<?php

namespace App\Contracts\Services;

use Illuminate\Http\JsonResponse;

interface PayPalAuthServiceInterface
{
    // public function checkPayPalAccountExists($email);
    public function redirectToPayPal();
    public function handlePayPalCallback($re);
    public function paypalAccountRemove($re);

}
