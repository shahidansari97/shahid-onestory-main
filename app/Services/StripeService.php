<?php

namespace App\Services;

use App\Contracts\Services\StripeServiceInterface;
use App\Models\Percent;
use App\Models\TopUp;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Stripe\Account;
use Stripe\AccountLink;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Exception\ApiErrorException;
use Stripe\Payout;
use Stripe\Stripe;
use Stripe\Transfer;
use App\Mail\CoinPurchaseMail;
use Illuminate\Support\Facades\Mail;
define('CENT_COEFFICIENT', 100);

class StripeService implements StripeServiceInterface
{
    private User $user;

    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
        $this->user = Auth::user();
    }

    /**
     * @throws ApiErrorException
     */
    public function makeCheckoutSession($amount)
    {
        session(['refill_amount' => $amount]);
        return StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => 'Wallet Refill',
                    ],
                    'unit_amount' => $amount * 100,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('payment.success'),
            'cancel_url' => route('payment.cancel'),
        ]);
    }

    public function storeTopUpData($amount): array
    {
	    // if($amount < 3 && $amount >= 1){
        //     $coinsAmount = $amount * 50;
        // }else{
        //     $coinsAmount = 200;   
        // }
        $coinsAmount = $amount * 50;
        // if ($amount == 12) {
        //     $coinsAmount = 15 * 10;
        // }

        $topUp = TopUp::create([
            'user_id' => $this->user->id,
            'funds' => $amount,
            'coins' => $coinsAmount,
        ]);
        $this->user->balance += $coinsAmount;
        $this->user->save();
	    $date = Carbon::now()->format('d M Y H:i:s');
        Mail::to($this->user->email)->send(new CoinPurchaseMail(
            $this->user->username,
            $coinsAmount,
            $amount,
            $date
        ));

        return ['success' => 'Thank you for your support!'];
    }

    /**
     * @throws ApiErrorException
     */
    public function findOrCreateConnectedAccount($ip): Account
    {
        if ($this->user->stripe_account_id) {
            if ($this->checkAccountExisting($this->user->stripe_account_id)) {
                return Account::retrieve($this->user->stripe_account_id);
            }
        }
        $userLocation = $this->getUserLocation($ip);
        $userData = [
            'type' => 'custom',
            'country' => $userLocation->countryCode,
            'capabilities' => [
                'transfers' => ['requested' => true],
            ],
            'business_type' => 'individual',
            "business_profile" => [
                "mcc" => 7929,
                "url" => "https://onestoryplanet.com",
            ],
            'tos_acceptance' => [
                'date' => Carbon::now()->timestamp,
                'ip' => $ip,
                'service_agreement' => $userLocation->countryCode === 'US' ? 'full': 'recipient',
            ],
        ];

        $stripeAccount = Account::create($userData);

        $this->user->stripe_account_id = $stripeAccount->id;
        $this->user->save();

        return $stripeAccount;
    }

    /**
     * @throws ApiErrorException
     */
    public function payoutFundsToExternalAccount(float $amount): array
    {
        $requestedAmount = $amount * CENT_COEFFICIENT;
        $userBalanceAsFunds = $this->user->balance / Percent::first()->balance_divider * CENT_COEFFICIENT;

        if ($userBalanceAsFunds < $requestedAmount) {
            return ['error' => "Insufficient funds for withdrawal."];
        }

        $externalAccounts = Account::retrieve($this->user->stripe_account_id)->external_accounts;

        if (empty($externalAccounts->data)) {
            return ['error' => 'No external accounts available for payout.'];
        }

        $destination = null;
        $externalAccountCurrency = null;

        foreach ($externalAccounts->data as $account) {
            $destination = $account->id;
            $externalAccountCurrency = $account->currency;
            break;
        }

        try {
            $transfer = Transfer::create([
                'amount' => $requestedAmount,
                'currency' => 'usd',
                'destination' => $this->user->stripe_account_id,
                'description' => 'Transfer funds to connected stripe account.',
            ]);

            $payout = Payout::create([
                'amount' => $requestedAmount,
                'currency' => $externalAccountCurrency,
                'destination' => $destination,
            ], [
                'stripe_account' => $this->user->stripe_account_id,
            ]);

            $this->user->balance -= $this->getAmountAsBonusView($amount);
            $this->user->save();

            Withdrawal::query()->create([
                'user_id' => $this->user->id,
                'amount' => $amount,
                'status' => $payout->status,
                'external_account_type' => $payout->type,
                'stripe_transaction_id' => $payout->id,
                'stripe_account_id' => $this->user->stripe_account_id,
                'arrival_date' => Carbon::createFromTimestamp($payout->arrival_date),
            ]);

            return ['success' => 'Successful payout.', 'new_balance' => $this->user->balance];
        } catch (\Exception $e) {
            return ['error' => 'Payout failed. Please try again later.'];
        }
    }

    public function getOnboardingLink()
    {
        $accountLink = AccountLink::create([
            'account' => $this->user->stripe_account_id,
            'refresh_url' => route('stripe.refresh'),
            'return_url' => route('user.transactions.index', ['fromStripe' => 1]),
            'type' => 'account_onboarding',
            'collection_options' => [
                'fields' => 'eventually_due',
            ],
        ]);

        return $accountLink->url;
    }

    private function getAmountAsBonusView($amount): float
    {
        return $amount * Percent::first()->balance_divider;
    }

    private function checkAccountExisting($accountID): bool
    {
        try {
            Account::retrieve($accountID);
            return true;
        } catch (ApiErrorException $e) {
            return false;
        }
    }

    private function getUserLocation($ip)
    {
        return json_decode(file_get_contents("http://ip-api.com/json/$ip"));
    }

    /**
     * @throws ApiErrorException
     */
    public function getAccountData($stripeId): Account
    {
        return Account::retrieve($stripeId);
    }
}
