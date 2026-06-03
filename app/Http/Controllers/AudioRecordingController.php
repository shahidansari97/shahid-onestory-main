<?php

namespace App\Http\Controllers;

use App\Contracts\Services\AudioRecordingServiceInterface;
use App\Contracts\Services\ProfileServiceInterface;
use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\RecorderRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use App\Models\AudioRecording;
use App\Models\Gift;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class AudioRecordingController extends Controller
{
    private ProfileServiceInterface $profileService;
    private AudioRecordingServiceInterface $audioRecordingService;

    public function __construct(
        ProfileServiceInterface $profileService,
        AudioRecordingServiceInterface $audioRecordingService
    )
    {
        $this->profileService = $profileService;
        $this->audioRecordingService = $audioRecordingService;
    }
    public function index(Request $request)
    {
        if(!Auth::user() && !$request->user_id){
            return redirect()->route('login');
        }
        $data = [
            'user' => $this->profileService->getUserInfoForPublicProfile(),
        ];
        return Inertia::render('Recorder/Recorder', ['data' => $data]);
    }
    public function store(Request $request)
    {
        // Validate request (audio is optional - text-only submissions allowed)
        $validated = $request->validate([
            'userId' => 'required|exists:users,id',
            'audio' => 'nullable|file|mimes:webm,mp3,wav,ogg,m4a,aac|max:102400',
            'publish_type' => 'required|in:public,private',
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

            $duration = $request->input('finalDurationRef_current') ?? null;
            $recordingType = $request->input('recording_type') ?? 'quick';
            $message = $request->input('message');
            if ($message === null || $message === '') {
                $message = '';
            }

            $data = $this->audioRecordingService->storeRecording(
                Auth::id(),
                $file,
                $validated['publish_type'],
                $duration,
                $message,
                $recordingType,
            );

            return response()->json([
                'status' => true,
                'message' => 'Audio recording saved successfully',
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to save audio recording: ' . $e->getMessage()
            ], 500);
        }
    }

    public function userRecordingsPage(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        $perPage = 8;
        $recordings = AudioRecording::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', 1);

        $formatted = $this->audioRecordingService->getFormattedRecordings($recordings->getCollection());

        return Inertia::render('Recordings/Index', [
            'recordings'  => $formatted,
            'currentPage' => $recordings->currentPage(),
            'lastPage'    => $recordings->lastPage(),
            'total'       => $recordings->total(),
            'userProfile' => [
                'name'          => $user->name,
                'username'      => $user->username,
                'avatar'        => $user->avatar,
                'cover_photo'   => $user->cover_photo,
                'world_message' => $user->world_message,
                'story'         => $user->story,
                'followers'     => $user->followers()->count(),
                'following'     => $user->following()->count(),
            ],
        ]);
    }

    public function userRecordingsMore(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 401);
        }

        $page    = (int) $request->input('page', 1);
        $perPage = 8;

        $recordings = AudioRecording::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        $formatted = $this->audioRecordingService->getFormattedRecordings($recordings->getCollection());

        return response()->json([
            'recordings'  => $formatted,
            'currentPage' => $recordings->currentPage(),
            'lastPage'    => $recordings->lastPage(),
            'total'       => $recordings->total(),
        ]);
    }

    public function adminAllAudioRecordings(Request $request)
    {
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $perPage = 10;

        // Use service to get recordings
        $recordings = $this->audioRecordingService->getAllRecordings($page, $perPage, $search);

       // dd('shahid',$recordings);
        // Status options: 1 = Published, 2 = Pending
        $statusOptions = [
            ['id' => 1, 'name' => 'Published'],
            ['id' => 2, 'name' => 'Pending']
        ];

        return Inertia::render('Dashboard/AudioRecordings/Index', [
            'recordings' => $recordings->items(),
            'currentPage' => $recordings->currentPage(),
            'lastPage' => $recordings->lastPage(),
            'perPage' => $recordings->perPage(),
            'totalRecordings' => $recordings->total(),
            'links' => $recordings->links(),
            'statusOptions' => $statusOptions,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:audio_recordings,id',
            'publish_type' => 'sometimes|in:public,private',
            'status' => 'sometimes|integer|in:1,2'
        ]);

        try {
            // Use service to update recording
            $data = $this->audioRecordingService->updateRecording(
                $request->id,
                $request->input('publish_type'),
                $request->input('status')
            );

            return response()->json([
                'status' => true,
                'message' => 'Audio recording updated successfully',
                'data' => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update audio recording: ' . $e->getMessage()
            ], 500);
        }
    }

    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:audio_recordings,id'
        ]);

        try {
            // Use service to delete recording
            $this->audioRecordingService->deleteRecording($request->id);

            return response()->json([
                'status' => true,
                'message' => 'Audio recording deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete audio recording: ' . $e->getMessage()
            ], 500);
        }
    }
}
