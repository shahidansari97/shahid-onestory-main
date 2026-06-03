<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Country;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Models\EditorProject;
use App\Models\UserLoginLog;
use App\Models\Visitor;
use App\Mail\AdminUserNotification;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Mail;
use App\Contracts\Services\AdminNotificationInterface;
use App\Support\AuthRedirect;


class RegisteredUserController extends Controller
{

    private AdminNotificationInterface $adminNotificationService;

    public function __construct(AdminNotificationInterface $adminNotificationService)
    {
        $this->adminNotificationService = $adminNotificationService;
    }

    /**
     * Display the registration view.
     */
    public function create(Request $request, $is_contestant = false): Response|RedirectResponse
    {
        $routeParams = $is_contestant ? ['is_contestant' => $is_contestant] : [];

        if ($redirect = AuthRedirect::syncPublishMessageQueryOnPage($request, 'register', $routeParams)) {
            return $redirect;
        }

        return Inertia::render('Auth/Register', [
            'is_contestant' => $is_contestant,
            'fromPublishMessage' => AuthRedirect::hasReturnHomeIntent($request),
        ]);
    }
    public function creator(): Response
    {
        $countries = Country::orderBy('name', 'asc')->get();
        return Inertia::render('Auth/Creator', [
            'countries' => $countries
        ]);
    }
    /**
     * Show the upgrade-to-creator form for already-registered users (no account fields).
     */
    public function upgradeCreator(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        if ($user->is_creator) {
            if($user->creator_status) {
                return redirect()->route('user.creator.dashboard');
            }
        }
        return Inertia::render('Auth/CreatorUpgrade');
    }
    /**
     * Upgrade the current user to creator (set is_creator, assign roles). No account creation.
     */
    public function upgradeCreatorStore(Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($user->is_creator) {
            if($user->creator_status) {
                return redirect()->route('user.creator.dashboard');
            }
            // return redirect(route('stories.allStories', absolute: false));
        }

        //$user->update(['is_creator' => true]);
        $user->update([
            'is_creator' => true,
            'phone_number' => $request->phone_number,
            'youtube_channel' => $request->youtube_channel,
            'tiktok_profile' => $request->tiktok_profile,
            'instagram_username' => $request->instagram_username,
            'other_social_links' => $request->other_social_links,
            // 'creator_category' => $request->creator_category,
            'total_audience_size' => $request->total_audience_size,
            'content_description' => $request->content_description,
        ]);

        $creatorRole = Role::where('name', 'creator')->first();
        $userRole = Role::where('name', 'user')->first();
        if ($creatorRole && !$user->hasRole('creator')) {
            $user->assignRole($creatorRole);
        }
        if ($userRole && !$user->hasRole('user')) {
            $user->assignRole($userRole);
        }
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

         $this->notifyAdmin($user, 'creator_upgraded', $request);

        //$this->adminNotificationService->notifyAdmin($user, 'creator_upgraded', $request);

        if($user->creator_status) {
            return redirect()->route('user.creator.dashboard');
        }
        return redirect(route('stories.allStories', absolute: false));

        // return redirect()->route('user.creator.dashboard');
    }
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse|\Symfony\Component\HttpFoundation\Response
    {
        AuthRedirect::applyIntentFromRequest($request);

        $token = request()->cookie('visitor_token');
        $request->validate([
            'username' => 'required|string|max:255|unique:'.User::class,
            //'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::min(4)],
        ]);


        // if (smtpCheck($request->email)) {
        //     dd("email verified");
        // }               

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => '/img/avatar.png',
            'is_contestant' => $request->is_contestant == true ? 1 : 0,
            'is_creator' => false,
        ]);
        EditorProject::create([
            'name' => 'Project-'.time(),
            'lastModified' => time(),
            'userId' => $user->id,
            'createdAt' => time(),
            'description' => 'Project Description',
        ]);
        UserLoginLog::create([
            'user_id'    => $user->id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'login_at' => now(),
        ]);
        Visitor::where('visitor_token', $token)
            ->update([
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
            ]);


        // Assign user role (regular signups are viewers/community members)
        $userRole = Role::where('name', 'user')->first();
        if ($userRole) {
            $user->assignRole($userRole);
        }

        event(new Registered($user));

        // $this->adminNotificationService->notifyAdmin($user, 'register', $request);

        $this->notifyAdmin($user, 'registered', $request);

        Auth::login($user);
        $request->session()->regenerate();

        if (AuthRedirect::consumeReturnHome()) {
            return redirect()->route('home');
        }

        // Generate editor URL with identification parameters for new users
        $editorUrl = $this->generateEditorUrl($user->id);
        return Inertia::location($editorUrl);
    }
     // public function creatorStore(Request $request): RedirectResponse
    // {
    public function creatorStore(Request $request): RedirectResponse|\Symfony\Component\HttpFoundation\Response
    {
        $token = request()->cookie('visitor_token');
        $request->validate([
            'username' => 'required|string|max:255|unique:'.User::class,
            'name' => 'required|string|max:255',
            //'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::min(4)],
            'phone_number' => 'nullable|string|max:20',
            'youtube_channel' => 'nullable|string|max:255',
            'tiktok_profile' => 'nullable|string|max:255',
            'instagram_username' => 'nullable|string|max:255',
            'other_social_links' => 'nullable|string',
            // 'creator_category' => 'nullable|string|max:100',
            'total_audience_size' => 'nullable|integer|min:0',
            'content_description' => 'nullable|string',
        ]);

        $user = User::create([
            'username' => $request->username,
            'name' => trim($request->name . ' ' . $request->last_name),
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => '/img/avatar.png',
            'is_contestant' => $request->is_contestant == true ? 1 : 0,
            'is_creator' => true,
               
            'phone_number' => $request->phone_number,
            'youtube_channel' => $request->youtube_channel,
            'tiktok_profile' => $request->tiktok_profile,
            'instagram_username' => $request->instagram_username,
            'other_social_links' => $request->other_social_links,
            // 'creator_category' => $request->creator_category,
            'total_audience_size' => $request->total_audience_size,
            'content_description' => $request->content_description,
            
        ]);
        EditorProject::create([
            'name' => 'Project-'.time(),
            'lastModified' => time(),
            'userId' => $user->id,
            'createdAt' => time(),
            'description' => 'Project Description',
        ]);
        UserLoginLog::create([
            'user_id'    => $user->id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'login_at' => now(),
        ]);
        Visitor::where('visitor_token', $token)
            ->update([
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
            ]);


        // Assign creator role AND user role (creators get all user features + creator dashboard)
        $creatorRole = Role::where('name', 'creator')->first();
        $userRole = Role::where('name', 'user')->first();

        if ($creatorRole) {
            $user->assignRole($creatorRole);
        }
        if ($userRole) {
            $user->assignRole($userRole);
        }

        // Clear permission cache so role is available on next request (e.g. shared auth in Inertia)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $this->notifyAdmin($user, 'creator_registered', $request);
        // $this->adminNotificationService->notifyAdmin($user, 'creator_registered', $request);

        Auth::login($user);
        $request->session()->regenerate();

        // Generate editor URL with identification parameters for new creator users
        $editorUrl = $this->generateEditorUrl($user->id);
        return Inertia::location($editorUrl);
    }
    private function notifyAdmin(User $user, string $action, Request $request): void
    {
        $adminEmail = config('mail.admin_address') ?: config('mail.from.address');

        if (!$adminEmail) {
            return;
        }

        Mail::to($user->email)->send(new AdminUserNotification(
            $user,
            $action,
            $request->ip(),
            $request->userAgent()
        ));
    }

    /**
     * Encryption key (must match frontend key)
     * Same as in useEditorRedirection.jsx and AutoLoginController
     */
    private const ENCRYPTION_KEY = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
    ];

    /**
     * Generate editor URL with encrypted user ID
     * Redirects to step-1 for new users who don't have drafts
     */
    private function generateEditorUrl(int $userId): string
    {
        $baseUrl = env('VITE_VIDEO_EDITOR_FRONTEND_BASE_URL', 'https://onestoryplanet.com/editor');

        // Encrypt user ID
        $key = pack('C*', ...self::ENCRYPTION_KEY);
        $iv = random_bytes(16);
        $data = (string)$userId;

        $encrypted = openssl_encrypt($data, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);

        $encryptedBase64 = base64_encode($encrypted);
        $ivBase64 = base64_encode($iv);

        // Build URL with identification parameters for step-1
        $params = [
            'identification' => $encryptedBase64,
            'iv' => $ivBase64,
            'is_draft' => 'false',
        ];

        return $baseUrl . '/record/step-1/?' . http_build_query($params);
    }
}
