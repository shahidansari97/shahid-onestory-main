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
use App\Models\Story;
use App\Models\VideoRewardTransaction;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

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
        try {
            $ipAddress = $validated['ip_address'] ?? $request->ip();
            $userId = Auth::id();

            $storyId = $validated['story_id'];
            // Check if same story_id AND same ip_address already exists
            // $exists = StoryView::where('story_id', $validated['story_id'])
            //     ->where('ip_address', $ipAddress)
            //     ->exists();

            $exists = StoryView::where('story_id', $storyId)
            ->when($userId, function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }, function ($query) use ($ipAddress) {
                $query->where('ip_address', $ipAddress);
            })
            ->exists();

            if (!$exists) {

                DB::transaction(function () use ($storyId, $userId, $ipAddress) {

                    StoryView::create([
                        'user_id'    => $userId ?? null,
                        'story_id'   => $storyId,
                        'ip_address' => $ipAddress,
                    ]);

                    $earning = config('app.per_view_rate'); // 0.007
                    $userStoryId = Story::where('id', $storyId)->value('user_id');

                    // Create credit entry
                    VideoRewardTransaction::create([
                        'user_id' => $userStoryId,
                        'amount' => $earning,
                        'type' => 'CREDIT',
                        'status' => 'complete',
                    ]);

                    // Update wallet balance
                    User::where('id', $userStoryId)
                        ->increment('wallet_balance', $earning);

                });

            }

            return response()->json([
                'status'  => true,
                'message' => 'Story View saved successfully',
                'data'    => []
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Failed to save Story view'
            ], 500);
        }

    }
}
