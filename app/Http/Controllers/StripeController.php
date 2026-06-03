<?php

namespace App\Http\Controllers;

use App\Contracts\Services\StripeServiceInterface;
use Illuminate\Http\Request;

class StripeController extends Controller
{
    private StripeServiceInterface $stripeService;

    public function __construct(StripeServiceInterface $stripeService, Request $request)
    {
        $this->stripeService = $stripeService;
        $this->stripeService->findOrCreateConnectedAccount($request->getClientIp());
    }

    public function store(Request $request)
    {
        $request->validate(['amount' => 'required|numeric|min:1|max:10000']);
        session(['previous_url' => url()->previous()]);

        $checkoutSession = $this->stripeService->makeCheckoutSession($request->amount);

        return response()->json(['url' => $checkoutSession->url]);
    }

    public function success()
    {
        if (!session()->exists('refill_amount')) {
            return redirect()->route('home')->with(['error' => 'Session expired.']);
        }

        $this->stripeService->storeTopUpData(amount: session('refill_amount'));
        session()->flash('refill_success');

        $previousUrl = session('previous_url', route('home'));
        $parsedUrl = parse_url($previousUrl);
        $query = [];
        if (isset($parsedUrl['query'])) {
            parse_str($parsedUrl['query'], $query);
        }
        $query['refill_success'] = true;
        $newQueryString = http_build_query($query);
        $newUrl = (isset($parsedUrl['scheme']) ? $parsedUrl['scheme'] . '://' : '')
            . (isset($parsedUrl['host']) ? $parsedUrl['host'] : '')
            . (isset($parsedUrl['path']) ? $parsedUrl['path'] : '')
            . '?' . $newQueryString;

        return redirect($newUrl)->with(['success' => 'Thank you for your support!']);
    }


    public function cancel()
    {
        return redirect()->route('home')->with(['error' => 'Wallet refilling has been canceled.']);
    }

    public function redirectToOnboardingLink()
    {
        return redirect(to: $this->stripeService->getOnboardingLink());
    }

    public function refresh()
    {
        return redirect()->route('stripe.onboarding-link');
    }

    public function payout(Request $request)
    {
        $request->validate(['amount' => 'required|numeric|min:1']);

        $payoutProcess = $this->stripeService->payoutFundsToExternalAccount(amount: $request->input('amount'));

        return response()->json($payoutProcess);
    }
}
