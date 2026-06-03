<?php

namespace App\Http\Controllers;

use App\Contracts\Services\PaymentServiceInterface;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    private PaymentServiceInterface $paymentService;
    private $connectedStripeAccount;

    public function __construct(PaymentServiceInterface $paymentService, Request $request)
    {
        $this->paymentService = $paymentService;
        $this->connectedStripeAccount = $this->paymentService->initConnectedStripeAccount($request->getClientIp());
    }

    public function store(Request $request)
    {
        $request->validate(['amount' => 'required|numeric|min:1|max:10000']);

        $checkoutSession = $this->paymentService->makeCheckoutSession($request->amount);

        return response()->json(['url' => $checkoutSession->url]);
    }

    public function success()
    {
        if (!session()->exists('refill_amount')) {
            return redirect()->route('home')->with(['error' => 'Session expired.']);
        }

        $this->paymentService->storeTransactionData(amount: session('refill_amount'));

        session()->flash('refill_success', true);

        return redirect()->route('home', ['refill_success' => true])
            ->with(['success' => 'Thank you for your support!']);
    }

    public function cancel()
    {
        return redirect()->route('home')->with(['error' => 'Wallet refilling has been canceled.']);
    }

    // TODO() - make store payment method for stripe payout
    public function storePaymentMethod(Request $request)
    {
        $account = $this->paymentService->addFullUserDataToConnectedStripeAccount($request);

        return response()->json(['success' => 'Bank account/card added successfully.']);
    }
}
