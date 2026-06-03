<?php

namespace App\Http\Controllers;

use App\Contracts\Services\ProfileServiceInterface;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\User;
use App\Models\StoryView;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class StoryViewController extends Controller
{
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'story_id' => 'required|exists:stories,id',
            'ip_address' => 'nullable',
        ]);

        // Get IP address
        $ipAddress = $validated['ip_address'] ?? $request->ip();
        
        // Determine if user is authenticated
        $isAuthenticated = Auth::check();
        $userId = $isAuthenticated ? Auth::id() : null;

        // If user is authenticated, verify userId matches (if provided)
        if ($isAuthenticated && !empty($validated['user_id']) && Auth::id() != $validated['user_id']) {
            return response()->json([
                'status' => false,
                'message' => 'User ID mismatch'
            ], 403);
        }

        try {
            // Check for duplicate views: one view per IP address per story
            // This applies to all users (authenticated and unauthenticated)
            $exists = StoryView::where('story_id', $validated['story_id'])
                ->where('ip_address', $ipAddress)
                ->exists();

            if ($exists) {
                return response()->json([
                    'status' => true,
                    'message' => 'Story View already recorded for this IP',
                    'data' => [],
                    'duplicate' => true
                ], 200);
            }

            $storyView = StoryView::create([
                'user_id'    => $userId,
                'story_id'   => $validated['story_id'],
                'ip_address' => $ipAddress,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Story View saved successfully',
                'data' => [],
                'duplicate' => false
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to save Story view: ' . $e->getMessage()
            ], 500);
        }
    }
}
