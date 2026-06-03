<?php

namespace App\Http\Controllers;

use App\Models\SpokenStoryRecording;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpokenStoryController extends Controller
{
    public function publicShow(SpokenStoryRecording $spokenStoryRecording)
    {
        $spokenStoryRecording->load('user:id,name,username');
        $spokenStoryRecording->loadCount('comments');

        return Inertia::render('SpokenStories/Show', [
            'spokenStoryRecording' => $spokenStoryRecording,
        ]);
    }

    public function share(Request $request)
    {
        $validated = $request->validate([
            'spoken_story_recording_id' => 'required|exists:spoken_story_recordings,id',
        ]);

        $id = (int) $validated['spoken_story_recording_id'];

        SpokenStoryRecording::where('id', $id)->increment('total_share');

        return response()->json([
            'success' => true,
        ]);
    }
}

