<?php

namespace App\Http\Controllers;

use App\Models\SpokenStoryComment;
use App\Models\SpokenStoryRecording;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SpokenStoryCommentController extends Controller
{
    public function index(SpokenStoryRecording $spokenStoryRecording)
    {
        $all = SpokenStoryComment::query()
            ->where('spoken_story_recording_id', $spokenStoryRecording->id)
            ->with('user:id,name,username,avatar')
            ->orderBy('created_at', 'asc')
            ->limit(500)
            ->get();

        $byParent = [];
        foreach ($all as $c) {
            $pid = $c->parent_id ?: 0;
            if (!array_key_exists($pid, $byParent)) {
                $byParent[$pid] = [];
            }
            $byParent[$pid][] = $c;
        }

        $buildTree = function ($parentId, $depth) use (&$buildTree, &$byParent) {
            if ($depth > 10) {
                return [];
            }
            $nodes = $byParent[$parentId] ?? [];
            foreach ($nodes as $node) {
                $node->setRelation('replies', collect($buildTree($node->id, $depth + 1)));
            }
            return $nodes;
        };

        $comments = $buildTree(0, 0);

        return response()->json([
            'success' => true,
            'data' => [
                'spoken_story_recording_id' => $spokenStoryRecording->id,
                'comments' => $comments,
            ],
        ]);
    }

    public function store(Request $request, SpokenStoryRecording $spokenStoryRecording)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $validated = $request->validate([
            'comment' => 'required|string|max:2000',
            'parent_id' => 'nullable|integer|exists:spoken_story_comments,id',
        ]);

        $parentId = $validated['parent_id'] ?? null;
        if ($parentId) {
            $parent = SpokenStoryComment::query()
                ->where('id', $parentId)
                ->where('spoken_story_recording_id', $spokenStoryRecording->id)
                ->first();
            if (!$parent) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid parent comment',
                ], 422);
            }
        }

        $comment = SpokenStoryComment::create([
            'spoken_story_recording_id' => $spokenStoryRecording->id,
            'parent_id' => $parentId,
            'user_id' => Auth::id(),
            'comment' => $validated['comment'],
        ]);

        $comment->load('user:id,name,username,avatar');
        $comment->setRelation('replies', collect([]));

        return response()->json([
            'success' => true,
            'message' => 'Comment saved successfully',
            'data' => $comment,
        ]);
    }
}

