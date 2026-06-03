<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\EditorProject;
use App\Services\DraftService;
use App\Services\EditorUrlService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class AutoLoginController extends Controller
{
    /**
     * Encryption key (must match frontend key)
     * Same as in useEditorRedirection.jsx
     */
    private const ENCRYPTION_KEY = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
    ];

    /**
     * Auto-login user from encrypted token and redirect to editor
     * 
     * This is an independent feature for Mailchimp email campaigns.
     * Does not affect existing authentication or "Create A Story" functionality.
     * 
     * URL format: /create-story?token={encrypted_email}&iv={iv}
     */
    public function createStory(Request $request, DraftService $draftService, EditorUrlService $editorUrlService)
    {
        try {
            $token = $request->query('token');
            $iv = $request->query('iv');

            // Validate required parameters
            if (!$token || !$iv) {
                return redirect()->route('login')->with('error', 'Invalid link. Please login to continue.');
            }

            // Decrypt the token to get user email
            $email = $this->decryptToken($token, $iv);
            
            if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return redirect()->route('login')->with('error', 'Invalid link. Please login to continue.');
            }

            // Find user by email
            $user = User::where('email', $email)->first();

            if (!$user) {
                return redirect()->route('login')->with('error', 'User not found. Please login to continue.');
            }

            // Auto-login the user (independent from existing login flow)
            Auth::login($user);
            $request->session()->regenerate();

            // Create EditorProject if doesn't exist (same logic as regular login)
            $checkProjectExists = EditorProject::where('userId', $user->id)->first();
            if (!$checkProjectExists) {
                EditorProject::create([
                    'name' => 'Project-' . time(),
                    'lastModified' => time(),
                    'userId' => $user->id,
                    'createdAt' => time(),
                    'description' => 'Project Description',
                ]);
            }

            // Redirect based on draft video status (same behavior as "Create A Story" button)
            if ($draftService->hasDraftVideo($user->id)) {
                return redirect('/draft');
            }

            return redirect($editorUrlService->generateStepOneUrl($user->id));

        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Something went wrong. Please login to continue.');
        }
    }

    /**
     * Auto-login user from encrypted token and redirect to draft page.
     * URL format: /draft-login?token={encrypted_email}&iv={iv}
     */
    public function draftPage(Request $request)
    {
        try {
            $token = $request->query('token');
            $iv = $request->query('iv');

            if (!$token || !$iv) {
                return redirect()->route('login')->with('error', 'Invalid link. Please login to continue.');
            }

            $email = $this->decryptToken($token, $iv);

            if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return redirect()->route('login')->with('error', 'Invalid link. Please login to continue.');
            }

            $user = User::where('email', $email)->first();

            if (!$user) {
                return redirect()->route('login')->with('error', 'User not found. Please login to continue.');
            }

            Auth::login($user);
            $request->session()->regenerate();

            return redirect('/draft');
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Something went wrong. Please login to continue.');
        }
    }

    /**
     * Auto-login user from encrypted token and redirect to manual-upload-video page.
     * URL format: /manual-upload-video-login?token={encrypted_email}&iv={iv}
     */
    public function manualUploadVideo(Request $request)
    {
        try {
            $token = $request->query('token');
            $iv = $request->query('iv');

            if (!$token || !$iv) {
                return redirect()->route('login')->with('error', 'Invalid link. Please login to continue.');
            }

            $email = $this->decryptToken($token, $iv);

            if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return redirect()->route('login')->with('error', 'Invalid link. Please login to continue.');
            }

            $user = User::where('email', $email)->first();

            if (!$user) {
                return redirect()->route('login')->with('error', 'User not found. Please login to continue.');
            }

            Auth::login($user);
            $request->session()->regenerate();

            return redirect('https://onestoryplanet.com/manual-upload-video');
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Something went wrong. Please login to continue.');
        }
    }

    /**
     * Decrypt token using AES-256-CBC
     */
    private function decryptToken(string $encryptedToken, string $ivBase64): ?string
    {
        try {
            // Convert encryption key array to binary string
            $key = pack('C*', ...self::ENCRYPTION_KEY);
            
            // Decode IV from base64
            $iv = base64_decode($ivBase64);
            
            // Decode encrypted token from base64
            $encrypted = base64_decode($encryptedToken);
            
            // Decrypt using OpenSSL
            $decrypted = openssl_decrypt($encrypted, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
            
            if ($decrypted === false) {
                return null;
            }
            
            return $decrypted;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Generate editor URL with encrypted user ID
     * Same format as useEditorRedirection hook
     * Updated to redirect directly to Step 3 with theme parameters
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
        
        // Theme parameters for Step 3
        // $themeId = env('MAILCHIMP_THEME_ID', '1');
        // $themeTitle = env('MAILCHIMP_THEME_TITLE', 'My biggest breakthrough');
        // $themeDescription = env('MAILCHIMP_THEME_DESCRIPTION', 'My biggest breakthrough was realizing no one actually knows what they\'re doing - not really. I used to think everyone else had a plan, and I was the only one faking it. Then I tried this thing where I said yes before I felt ready. First job interview? Terrifying. Posted my first project online? Felt cringe. But every time I survived something I thought would destroy me, I leveled up. My breakthrough wasn\'t confidence; it was giving myself permission to try while scared.');
        
        $themeId = 1;
        $themeTitle = 'My biggest breakthrough';
        $themeDescription = 'My biggest breakthrough was realizing no one actually knows what they are doing - not really. I used to think everyone else had a plan, and I was the only one faking it. Then I tried this thing where I said yes before I felt ready. First job interview? Terrifying. Posted my first project online? Felt cringe. But every time I survived something I thought would destroy me, I leveled up. My breakthrough was not confidence it was giving myself permission to try while scared.';

        // Build URL with all parameters
        $params = [
            'identification' => $encryptedBase64,
            'iv' => $ivBase64,
            'is_draft' => 'false',
            'themeId' => $themeId,
            'themeTitle' => $themeTitle,
            'themeDescription' => $themeDescription,
        ];
        
        // Redirect directly to Step 3 with theme parameters
        return $baseUrl . '/record/step-3/?' . http_build_query($params);
    }
}

