<?php

namespace App\Http\Controllers;

use App\Models\SpokenStoryRecording;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SpokenStoryRecordingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|exists:users,id',
            'audio' => 'nullable|file|mimes:webm,mp3,wav,ogg,m4a,aac|max:102400',
            'publish_type' => 'required|in:public,private',
            'duration' => 'nullable|numeric',
            'message' => 'nullable|string',
        ]);

        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        if (Auth::id() != $validated['userId']) {
            return response()->json([
                'status' => false,
                'message' => 'User ID mismatch'
            ], 403);
        }

        try {
            $file = $request->file('audio');
            if ($file && !$file->isValid()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Invalid audio file'
                ], 400);
            }

            $path = null;
            $url = null;
            $filename = null;

            if ($file) {
                $uuid = (string) Str::uuid();
                // Spoken stories are stored as WAV (frontend converts when possible)
                $filename = $uuid . '.wav';

                $destinationPath = public_path('spoken-story-recordings');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                $file->move($destinationPath, $filename);
                $path = 'spoken-story-recordings/' . $filename;
                $url = asset($path);
            }

            $recording = SpokenStoryRecording::create([
                'user_id' => Auth::id(),
                'path' => $path,
                'duration' => $request->input('duration'),
                'publish_type' => $validated['publish_type'],
                'message' => $request->input('message', ''),
                'status' => 1,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Spoken story saved successfully',
                'data' => [
                    'id' => $recording->id,
                    'path' => $path,
                    'url' => $url,
                    'filename' => $filename,
                    'duration' => $recording->duration,
                    'publish_type' => $recording->publish_type,
                    'message' => $recording->message,
                    'status' => $recording->status,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to save spoken story: ' . $e->getMessage(),
            ], 500);
        }
    }
}

