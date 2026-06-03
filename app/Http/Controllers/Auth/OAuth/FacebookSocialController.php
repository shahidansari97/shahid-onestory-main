<?php

namespace App\Http\Controllers\Auth\OAuth;

use App\Contracts\Services\SocialServiceInterface;
use App\Http\Controllers\Controller;
use App\Support\AuthRedirect;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class FacebookSocialController extends Controller
{
    public SocialServiceInterface $socialService;

    public function __construct(SocialServiceInterface $socialService)
    {
        $this->socialService = $socialService;
    }

    public function redirect(Request $request)
    {
        AuthRedirect::rememberReturnHome($request);

        return Socialite::driver('facebook')->stateless()->redirect();
    }

    public function callback(Request $request)
    {
        try {
            $facebookUser = Socialite::driver('facebook')->stateless()->user();

            $result = $this->socialService->getOrCreateUser(socialUser: $facebookUser, driver: 'facebook');

            $request->session()->regenerate();

            return AuthRedirect::afterOAuthRedirect(!empty($result['isNewUser']));
        } catch (\Throwable $e) {
            Log::error('Facebook OAuth callback failed', [
                'message' => $e->getMessage(),
                'exception' => $e,
            ]);

            return redirect('/login')->with('error', 'Authentication failed. Please try again.');
        }
    }
}
