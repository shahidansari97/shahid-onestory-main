<?php

namespace App\Http\Controllers;

use App\Models\WrittenMessage;
use App\Models\WrittenMessageComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WrittenMessageCommentController extends Controller
{
    public function index(WrittenMessage $writtenMessage)
    {
        // Fetch flat list, then build a nested tree (reply-to-reply supported).
        $all = WrittenMessageComment::query()
            ->where('written_message_id', $writtenMessage->id)
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

        // Root comments: parent_id NULL => key 0
        $comments = $buildTree(0, 0);

        return response()->json([
            'success' => true,
            'data' => [
                'written_message_id' => $writtenMessage->id,
                'comments' => $comments,
            ],
        ]);
    }

    public function store(Request $request, WrittenMessage $writtenMessage)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $validated = $request->validate([
            'comment' => 'required|string|max:2000',
            'parent_id' => 'nullable|integer|exists:written_message_comments,id',
        ]);

        $parentId = $validated['parent_id'] ?? null;
        if ($parentId) {
            $parent = WrittenMessageComment::query()
                ->where('id', $parentId)
                ->where('written_message_id', $writtenMessage->id)
                ->first();
            if (!$parent) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid parent comment',
                ], 422);
            }
        }

        $comment = WrittenMessageComment::create([
            'written_message_id' => $writtenMessage->id,
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

