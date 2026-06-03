<?php

namespace App\Http\Controllers;

use App\Contracts\Services\DonationServiceInterface;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    private DonationServiceInterface $donationService;

    public function __construct(DonationServiceInterface $donationService)
    {
        $this->donationService = $donationService;

    }

    public function store(Request $request)
    {
        $request->validate(['amount' => 'required|numeric|min:1|max:10000']);

        $checkoutSession = $this->donationService->makeCheckoutSession($request->amount);

        if (isset($checkoutSession->url)) {
            return response()->json(['url' => $checkoutSession->url]);
        }

        return response()->json(['error' => 'Failed to create Stripe session'], 500);
    }

    public function success()
    {
        if (!session()->exists('donation_amount')) {
            return redirect()->route('donation.index')->with(['error' => 'Session expired.']);
        }

        $this->donationService->storeTransactionData(session('donation_amount'));

        session()->flash('donation_success', true);

        return redirect()->route('donation.index');
    }

    public function cancel()
    {
        return back()->with(['error' => 'Donation has been canceled.']);
    }
}
