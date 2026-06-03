<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Story;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReplaceVideoController extends Controller
{
    /**
     * Show the replace video form
     */
    public function index()
    {
        return Inertia::render('Dashboard/Stories/ReplaceVideo');
    }

    /**
     * Replace user's video
     */
    public function replace(Request $request)
    {
        $request->validate([
            'user_id' => 'nullable|integer|exists:users,id',
            'email' => 'nullable|email|exists:users,email',
            'video' => 'required|file|mimes:mp4,mov,avi,flv,mkv|max:102400', // Max 100GB
            'delete_old' => 'nullable|boolean',
        ]);

        // Find user
        $user = null;
        if ($request->user_id) {
            $user = User::find($request->user_id);
        } elseif ($request->email) {
            $user = User::where('email', $request->email)->first();
        }

        if (!$user) {
            return back()->withErrors(['error' => 'User not found']);
        }

        // Find user's story
        $story = Story::where('user_id', $user->id)->first();

        if (!$story) {
            return back()->withErrors(['error' => 'No story found for this user']);
        }

        try {
            // Get old video path for potential deletion
            // Extract filename from old src (could be full URL or just filename)
            $oldVideoFilename = null;
            if ($story->src) {
                // If src is a full URL, extract filename; otherwise use as-is
                if (strpos($story->src, 'http') === 0 || strpos($story->src, 'https') === 0) {
                    // Full URL - extract filename
                    $oldVideoFilename = basename(parse_url($story->src, PHP_URL_PATH));
                } else {
                    // Just filename
                    $oldVideoFilename = $story->src;
                }
                $oldVideoPath = $oldVideoFilename ? "videos/{$oldVideoFilename}" : null;
            } else {
                $oldVideoPath = null;
            }

            // Generate new unique filename
            $extension = $request->file('video')->getClientOriginalExtension();
            $newFilename = Str::uuid()->toString() . '.' . $extension;

            // Determine storage disk - Check if S3 is configured
            $useS3 = env('AWS_BUCKET') && env('AWS_ACCESS_KEY_ID') && env('AWS_SECRET_ACCESS_KEY');
            $disk = $useS3 ? 's3' : 'public';

            // Store the new video
            $path = $request->file('video')->storeAs('videos', $newFilename, $disk);

            // Get the full URL (S3 URL or local URL)
            if ($useS3) {
                // For S3, construct the proper URL
                $bucket = env('AWS_BUCKET');
                $region = env('AWS_DEFAULT_REGION', 'us-east-1');
                $awsUrl = env('AWS_URL');
                
                if ($awsUrl) {
                    // Use custom AWS_URL if configured
                    $fullVideoUrl = rtrim($awsUrl, '/') . '/videos/' . $newFilename;
                } else {
                    // Construct standard S3 URL
                    $fullVideoUrl = "https://{$bucket}.s3.{$region}.amazonaws.com/videos/{$newFilename}";
                }
            } else {
                // Local storage URL
                $fullVideoUrl = Storage::disk('public')->url("videos/{$newFilename}");
            }

            // Update story record with full URL (not just filename)
            $story->src = $fullVideoUrl;
            $story->save();

            // Delete old video if requested
            if ($request->delete_old && $oldVideoPath) {
                try {
                    if (Storage::disk($disk)->exists($oldVideoPath)) {
                        Storage::disk($disk)->delete($oldVideoPath);
                    }
                } catch (\Exception $e) {
                }
            }

            $newVideoUrl = Storage::disk($disk)->url("videos/{$newFilename}");

            return back()->with('success', [
                'message' => 'Video replaced successfully!',
                'user' => $user->name . ' (' . $user->email . ')',
                'story_id' => $story->id,
                'old_video' => $story->src,
                'new_video' => $newFilename,
                'new_video_url' => $newVideoUrl,
            ]);

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error replacing video: ' . $e->getMessage()]);
        }
    }
}
