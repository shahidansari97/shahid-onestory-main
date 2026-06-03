<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\EditorProject;
use App\Models\UserLoginLog;
use App\Models\Visitor;
use App\Support\AuthRedirect;
class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        if ($redirect = AuthRedirect::syncPublishMessageQueryOnPage($request, 'login')) {
            return $redirect;
        }

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'fromPublishMessage' => AuthRedirect::hasReturnHomeIntent($request),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    // public function store(LoginRequest $request): RedirectResponse
    // {
    //     $request->authenticate();

    //     $request->session()->regenerate();

    //     return redirect()->intended($request->get('redirect', '/'));
    // }

    public function store(LoginRequest $request)
    {
        AuthRedirect::applyIntentFromRequest($request);

        $credentials = $request->only('email', 'password');
        $token = request()->cookie('visitor_token');
        
        //$request->authenticate();
        if($request->remember == ''){
            $request->authenticate();
            // $request->session()->regenerate();
	    $userId = Auth::id();
            $checkProjectExists = EditorProject::where('userId',$userId)->first();
            if(!$checkProjectExists){
                EditorProject::create([
                    'name' => 'Project-'.time(),
                    'lastModified' => time(),
                    'userId' => $userId,
                    'createdAt' => time(),
                    'description' => 'Project Description',
                ]);
            }
            UserLoginLog::create([
                'user_id'    => $userId,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'login_at' => now(),
            ]);
            
            Visitor::where('visitor_token', $token)
            ->update([
                'user_id' => $userId,
                'ip_address' => $request->ip(),
            ]);

            $request->session()->regenerate();

            return AuthRedirect::afterLoginRedirect();
            //return redirect()->intended(route('stories.allStories'));
        }else{
            $remember = $request->remember;
            if (Auth::attempt($credentials, $remember)) {
                // $request->session()->regenerate();
    		$userId = Auth::id();
                $checkProjectExists = EditorProject::where('userId',$userId)->first();
                if(!$checkProjectExists){
                    EditorProject::create([
                        'name' => 'Project-'.time(),
                        'lastModified' => time(),
                        'userId' => $userId,
                        'createdAt' => time(),
                        'description' => 'Project Description',
                    ]);
                }
                UserLoginLog::create([
                    'user_id'    => $userId,
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'login_at' => now(),
                ]);

                Visitor::where('visitor_token', $token)
                ->update([
                    'user_id' => $userId,
                    'ip_address' => $request->ip(),
                ]);

                $request->session()->regenerate();

                return AuthRedirect::afterLoginRedirect();
                //return redirect()->intended(route('stories.allStories'));
            }
        }
        // $request->session()->regenerate();
        // // Redirect to the intended URL or fallback to home
        // return redirect()->intended('/');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
         // 1️⃣ Get user ID before logout
        $userId = Auth::id();

        // 2️⃣ Update login log
        if ($userId) {
            UserLoginLog::where('user_id', $userId)
                ->where('status', 'active')
                ->update([
                    'logout_at' => now(),
                    'status'    => 'logged_out',
                ]);
        }
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
