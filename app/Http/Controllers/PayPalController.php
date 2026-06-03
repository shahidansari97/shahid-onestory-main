<?php

namespace App\Http\Controllers;

use App\Contracts\Services\PayPalServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Percent;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\PayPalWithdrawal;

define('CENT_COEFFICIENT', 100);

class PayPalController extends Controller
{
    private PayPalServiceInterface $paypalService;
    private User $user;

    public function __construct(PayPalServiceInterface $paypalService)
    {
        $this->paypalService = $paypalService;
        $this->user = Auth::user();
    }

    public function withdraw(Request $request)
    {
        $request->validate(['amount' => 'required|numeric|min:1']);
        $response = $this->paypalService->processPayment($request->amount);

        return response()->json($response);   
    }
    public function paypalWithdrwalList()
    {
       
        return response()->json($response);   
    }




}
