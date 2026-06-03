<?php

namespace App\Http\Controllers\Auth\OAuth;

use App\Contracts\Services\SocialServiceInterface;
use App\Http\Controllers\Controller;
use App\Support\AuthRedirect;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleSocialController extends Controller
{
    public SocialServiceInterface $socialService;

    public function __construct(SocialServiceInterface $socialService)
    {
        $this->socialService = $socialService;
    }

    public function redirect(Request $request)
    {
        AuthRedirect::rememberReturnHome($request);

        // Stateless on redirect + callback avoids lost session state on iOS Safari during OAuth.
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $result = $this->socialService->getOrCreateUser(socialUser: $googleUser, driver: 'google');

            $request->session()->regenerate();

            return AuthRedirect::afterOAuthRedirect(!empty($result['isNewUser']));
        } catch (\Throwable $e) {
            Log::error('Google OAuth callback failed', [
                'message' => $e->getMessage(),
                'exception' => $e,
            ]);

            return redirect('/login')->with('error', 'Authentication failed. Please try again.');
        }
    }
}
