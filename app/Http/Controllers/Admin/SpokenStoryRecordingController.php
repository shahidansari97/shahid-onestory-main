<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SpokenStoryRecording;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpokenStoryRecordingController extends Controller
{
    private function makeShortFilename(?string $filename): ?string
    {
        if (!$filename) {
            return null;
        }

        $len = strlen($filename);
        if ($len <= 20) {
            return $filename;
        }

        return substr($filename, 0, 8) . '...' . substr($filename, -8);
    }

    public function index(Request $request)
    {
        $search = (string) $request->input('search', '');
        $page = (int) $request->input('page', 1);
        $perPage = 10;

        $query = SpokenStoryRecording::query()
            ->with(['user:id,name,username,avatar,email'])
            ->orderByDesc('created_at');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('id', $search)
                    ->orWhere('message', 'like', '%' . $search . '%')
                    ->orWhere('publish_type', 'like', '%' . $search . '%')
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', '%' . $search . '%')
                            ->orWhere('username', 'like', '%' . $search . '%')
                            ->orWhere('email', 'like', '%' . $search . '%');
                    });
            });
        }

        $recordings = $query->paginate($perPage, ['*'], 'page', $page);

        $items = $recordings->getCollection()->map(function (SpokenStoryRecording $r) {
            $filename = $r->path ? basename($r->path) : null;

            return [
                'id' => $r->id,
                'filename' => $filename,
                'short_filename' => $this->makeShortFilename($filename),
                'user' => $r->user ? [
                    'id' => $r->user->id,
                    'name' => $r->user->name,
                    'username' => $r->user->username,
                    'avatar' => $r->user->avatar,
                    'email' => $r->user->email,
                ] : null,
                'path' => $r->path,
                'url' => $r->url,
                'duration' => $r->duration,
                'publish_type' => $r->publish_type,
                'message' => $r->message,
                'status' => $r->status,
                'total_share' => (int) ($r->total_share ?? 0),
                'created_at' => optional($r->created_at)->toISOString(),
            ];
        })->values();

        $statusOptions = [
            ['id' => 1, 'name' => 'Published'],
            ['id' => 2, 'name' => 'Pending'],
        ];

        return Inertia::render('Dashboard/SpokenStories/Index', [
            'recordings' => $items,
            'currentPage' => $recordings->currentPage(),
            'lastPage' => $recordings->lastPage(),
            'perPage' => $recordings->perPage(),
            'totalRecordings' => $recordings->total(),
            'statusOptions' => $statusOptions,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:spoken_story_recordings,id',
            'publish_type' => 'sometimes|in:public,private',
            'status' => 'sometimes|integer|in:1,2',
            'total_share' => 'sometimes|integer|min:0|max:99999999',
        ]);

        $recording = SpokenStoryRecording::findOrFail($request->id);

        if ($request->has('publish_type')) {
            $recording->publish_type = $request->input('publish_type');
        }
        if ($request->has('status')) {
            $recording->status = (int) $request->input('status');
        }
        if ($request->has('total_share')) {
            $recording->total_share = (int) $request->input('total_share');
        }

        $recording->save();

        return response()->json([
            'status' => true,
            'message' => 'Spoken story updated successfully',
        ], 200);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:spoken_story_recordings,id',
        ]);

        $recording = SpokenStoryRecording::findOrFail($request->id);

        if ($recording->path) {
            $fullPath = public_path($recording->path);
            if (is_file($fullPath)) {
                @unlink($fullPath);
            }
        }

        $recording->delete();

        return response()->json([
            'status' => true,
            'message' => 'Spoken story deleted successfully',
        ], 200);
    }

    /**
     * Admin: set spoken story recording total_share only (use 0 to clear).
     */
    public function adminSetTotalShare(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:spoken_story_recordings,id',
            'total_share' => 'required|integer|min:0|max:99999999',
        ]);

        SpokenStoryRecording::query()->whereKey($validated['id'])->update([
            'total_share' => (int) $validated['total_share'],
        ]);

        return response()->json([
            'success' => true,
            'total_share' => (int) $validated['total_share'],
        ]);
    }
}

