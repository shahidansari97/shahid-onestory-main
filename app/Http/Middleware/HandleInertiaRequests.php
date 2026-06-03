<?php

namespace App\Http\Middleware;

use App\Models\ChMessage;
use App\Models\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $unseenMessages = [];

        if ($user = $request->user()) {
            if (!$user->avatar) {
                $user->avatar = '/img/avatar.png';
            }
        }

        if (Auth::check()) {
            $unseenMessages = ChMessage::where('to_id', Auth::id())->where('seen', 0)->count();
        }
        $pollPopupData = false;
        $donationPopupData = false;
        $pollPopup = DB::table('poll_popup')->where('key', 'content')->first();
        if ($pollPopup) {
            $pollPopupData = json_decode($pollPopup->value, true);
        }
        $donationPopup = DB::table('donation_popup')->where('key', 'content')->first();
        if ($donationPopup) {
            $donationPopupData = json_decode($donationPopup->value, true);
        }
        $user = $request->user();
        $authUser = null;

        if ($user) {
            $user->load('roles');
            $authUser = $user->toArray();
            $authUser['role_names'] = $user->getRoleNames()->toArray();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $authUser ?? $user,
                'unseenMessages' => $unseenMessages,
            ],
            'siteSettings' => [
                SiteSettings::all()->keyBy('key')->map->value,
            ],
            'pollPopup' => $pollPopupData,
            'donationPopup' => $donationPopupData,
            'flash' => [
                'message' => fn () => $request->session()->get('message')
            ],
        ];
    }
}
