<?php

namespace App\Http\Controllers;

use App\Contracts\Services\PayPalAuthServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Percent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\User;
use App\Models\PayPalWithdrawal;
use Inertia\Inertia;
use Inertia\Response;

class PayPalAuthController extends Controller
{
    private PayPalAuthServiceInterface $paypalAuthService;
    private User $user;

    public function __construct(PayPalAuthServiceInterface $paypalAuthService)
    {
        $this->paypalAuthService = $paypalAuthService;
        if(Auth::user()) {
            $this->user = Auth::user();
        }
    }
    public function redirectToPayPal(Request $request){
        $result = $this->paypalAuthService->redirectToPayPal();

        return response()->json($result);
    }

    public function handlePayPalCallback(Request $request)
    {
        $request = $request->all();
        $result = $this->paypalAuthService->handlePayPalCallback($request);

        
        // return Inertia::render('Profile/Edit', [
        //     'mustVerifyEmail' =>  $this->user instanceof MustVerifyEmail,
        //     'status' => $result['status'],
        // ]);


        if($result['status']){
            return redirect()->route('user.profile.edit', ['paypal' => true]);
        }else{
            return redirect()->route('user.profile.edit', ['paypal' => false]);
        }
    }
    public function paypalAccountRemove(Request $request)
    {
        $response = $this->paypalAuthService->paypalAccountRemove($request);
        return response()->json($response);
    }




}
