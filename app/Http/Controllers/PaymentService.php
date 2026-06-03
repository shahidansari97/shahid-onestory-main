<?php

namespace App\Services;

use App\Contracts\Services\PaymentServiceInterface;
use App\Models\TopUp;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Stripe\Account;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Exception\ApiErrorException;
use Stripe\Payout;
use Stripe\Stripe;
use Stripe\Token;
use Stripe\Transfer;

class PaymentService implements PaymentServiceInterface
{
    private User $user;

    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $this->user = Auth::user();
    }

    public function makeCheckoutSession($amount)
    {
        session(['refill_amount' => $amount]);

        $checkoutSession = StripeSession::create([
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

        return $checkoutSession;
    }

    public function storeTransactionData($amount): array
    {
        $coinsAmount = $amount * 5;

        $topUp = TopUp::create([
            'user_id' => $this->user->id,
            'funds' => $amount,
            'coins' => $coinsAmount,
        ]);

        $this->user->balance += $coinsAmount;
        $this->user->save();

        return ['success' => 'Thank you for your support!'];
    }

    // TODO() - make init connected account for stripe payouts
    public function initConnectedStripeAccount($ip): Account
    {
        if ($this->user->stripe_account_id) {
            if ($this->checkAccountExisting($this->user->stripe_account_id)) {
                return Account::retrieve($this->user->stripe_account_id);
            }
        }

        $userLocation = $this->getUserLocation($ip);

        $stripeAccount = Account::create([
            'type' => 'custom',
//            'country' => $userLocation->countryCode,
            'country' => 'IL',
            'capabilities' => [
                'transfers' => ['requested' => true],
//                'card_payments' => ['requested' => true],
            ],
            'business_type' => 'individual',
            "business_profile" => [
                "mcc" => 7929,
                "url" => "https://exmple.com", // TODO() - add a user's profile link here
            ],
            'tos_acceptance' => [
                'date' => 1609798905,
                'ip' => $ip,
                'service_agreement' => 'recipient',
            ],
        ]);

        $this->user->stripe_account_id = $stripeAccount->id;
        $this->user->save();

        return $stripeAccount;
    }

    // TODO() - make inserting full data to connected account for stripe payouts
    /**
     * @throws ApiErrorException
     */
    public function addFullUserDataToConnectedStripeAccount($request): Account
    {
        $userIp = $request;

        $userLocation = $this->getUserLocation($userIp);

        $stripeToken = Token::create([
            'bank_account' => [
                'account_number' => '00012345',
                'country' => 'GB',
                'currency' => 'GBP',
            ],
        ]);
        Account::createExternalAccount($this->user->stripe_account_id, [
//            "external_account" => 'tok_visa_debit',
            "external_account" => $stripeToken->id,
        ]);

        $stripeAccount = Account::update($this->user->stripe_account_id, [
            "individual" => [
                "first_name" => "Test",
                "last_name" => "User",
                "phone" => "+16505551234",
                "email" => "test@example.com",
                "address" => [ // TODO() - add user's address form Request
//                    "state" => "Oregon", // must-have for USA users
                    "city" => "London",
//                    "city" => "Condon",
                    "line1" => "address_full_match",
//                    "line1" => "126 NE Church St",
                    "postal_code" => "TF5 0DL",
//                    "postal_code" => '97823',
                ],
                "dob" => [
                    "day" => 01,
                    "month" => 01,
                    "year" => 1901,
                ],
//                "ssn_last_4" => "4532", // must-have for USA users
//                "id_number" => "543-18-4532", // must-have for USA users
            ],
//            'tos_acceptance' => [
//                'date' => 1609798905,
//                'ip' => $userIp,
//                'service_agreement' => 'recipient',
//            ],
        ]);

//        $stripeAccount = Account::update($this->user->stripe_account_id, [
//            'external_account' => [],
//            'individual' => [
//                'first_name' => $request->first_name,
//                'last_name' => $request->last_name,
//                "email" => $request->email,
//                'phone' => $request->number,
//                'address' => [
//                    'state' => $request->state ?? null,
//                    'city' => $request->city,
//                    'line1' => $request->line1,
//                    'postal_code' => $request->postal_code,
//                ],
//                'dob' => [
//                    'day' => $request->day,
//                    'month' => $request->month,
//                    'year' => $request->year,
//                ],
//                'ssn_last_4' => $request->ssn_last_4, // must-have for USA users
//                'id_number' => $request->id_number, // must-have for USA users
//            ],
//            'tos_acceptance' => [
//                'date' => Carbon::now()->timestamp,
//                'ip' => $userIp,
//            ],
//        ]);


        return $stripeAccount;
    }

    public function savePaymentMethod()
    {

    }

    public function withdraw($request): JsonResponse
    {
        $destination = [];
        $externalAccounts = Account::retrieve($this->user->stripe_account_id)->external_accounts->all([
            'object' => $request,
        ]);

        foreach ($externalAccounts->data as $account) {
            $destination = $account->id;
        }

        if ($this->user->balance < 500) {
            return response()->json(['error' => 'Not enough funds on the balance.']);
        }

        Transfer::create([
            'amount' => 500,
            'currency' => 'gbp',
            'destination' => $this->user->stripe_account_id,
            'description' => 'Transfer funds to connected stripe account.'
        ]);

        Payout::create([
            'amount' => 500,
            'currency' => 'gbp',
            'destination' => $destination,
        ], [
            'stripe_account' => $this->user->stripe_account_id,
        ]);

        $this->user->balance -= 500;
        $this->user->save();

        return response()->json(['success' => 'Successful payout.']);
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
        $location = file_get_contents("http://ip-api.com/json/$ip");

        return json_decode($location);
    }
}
