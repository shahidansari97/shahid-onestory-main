<?php

namespace App\Services;

use App\Contracts\Services\DonationServiceInterface;
use App\Models\Commission;
use App\Models\Donation;
use App\Models\User;
use App\Models\Voting\Variant;
use App\Models\Wallet;
use Illuminate\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;

class DonationService implements DonationServiceInterface
{
    private User $user;

    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $this->user = Auth::user();
    }

    public function makeCheckoutSession($amount)
    {
        session(['donation_amount' => $amount]);

        $checkoutSession = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => 'Donation',
                    ],
                    'unit_amount' => $amount * 100,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('donation.success'),
            'cancel_url' => route('donation.cancel'),
        ]);

        return $checkoutSession;
    }

    public function donate($amount): array
    {
        $commission = Commission::first();

        if ($this->user->balance < $amount) {
            return ['error' => "Insufficient balance"];
        }

        $odeliaTax = $amount * (5.5 / 100); // 5.5% to Odelia
        $netAmount = $amount - $odeliaTax;

        $this->user->balance -= $amount;
        $this->user->save();

        $commission->donation_funds += $netAmount;

        $commission->founder_funds += $odeliaTax;

        $commission->save();

        return ['success' => 'Donation successful'];
    }

    public function storeTransactionData($amount): array
    {
        DB::beginTransaction();

        try {
            $commission = Commission::first();

            $donatePage = DB::table('donate_page')->where('key', 'content')->first();

            if (!$donatePage) {
                throw new \Exception('Donate page content not found.');
            }

            $content = json_decode($donatePage->value, true);

            $variant_id = $content['variant_id'] ?? null;

            if (!$variant_id) {
                throw new \Exception('Variant ID is not set in donate_page content.');
            }

            $variant = Variant::find($variant_id);

            if (!$variant) {
                throw new \Exception("Variant with ID {$variant_id} not found.");
            }

            Donation::create([
                'user_id' => $this->user->id,
                'funds' => $amount,
                'variant_id' => $variant_id,
            ]);

            $commission->charity_funds += $amount;
            $commission->save();

            $variant->funds += $amount;
            $variant->save();

            DB::commit();

            return ['success' => 'Thank you for your support!'];
        } catch (\Exception $e) {
            DB::rollBack();


            return ['error' => 'An error occurred while processing your donation. Please try again later.'];
        }
    }

}
