<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Account;
use Stripe\Exception\ApiErrorException;
use Stripe\Stripe;
use Symfony\Component\HttpFoundation\Response;

class HandlePayoutRequest
{
    private User $user;

    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
        $this->user = Auth::user();
    }

    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     * @throws ApiErrorException
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (empty($this->user->stripe_account_id)) {
            return redirect()->route('stripe.onboarding');
        }

        $stripeAccount = Account::retrieve($this->user->stripe_account_id);

        if (!empty($requirements = $stripeAccount->requirements->eventually_due)) {
            return response()->json([
                'error' => true,
                'message' => 'Please, complete your account verification.',
                'requirements' => $requirements,
                'type' => 'verification_required'
            ], 400);
        }

        return $next($request);
    }
}
