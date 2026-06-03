<?php

namespace App\Http\Controllers\Auth\OAuth;

use App\Contracts\Services\SocialServiceInterface;
use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;

class GoogleSocialController extends Controller
{
    public SocialServiceInterface $socialService;

    public function __construct(SocialServiceInterface $socialService)
    {
        $this->socialService = $socialService;
    }

    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $result = $this->socialService->getOrCreateUser(socialUser: $googleUser, driver: 'google');
            
            // Add signup flag if it's a new user
            $redirectUrl = route('home');
            if (isset($result['isNewUser']) && $result['isNewUser']) {
                $redirectUrl = route('home', ['signup' => 'social']);
            }
            
            return redirect($redirectUrl);
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Authentication failed. Please try again.');
        }
    }
}
