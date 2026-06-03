<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Contracts\Services\CommentServiceInterface;
use Illuminate\Support\Facades\Redirect;
use App\Models\Comment;
use App\Models\User;
use Inertia\Inertia;

class CommentController extends Controller
{
    private CommentServiceInterface $commentService;

    public function __construct(CommentServiceInterface $commentService)
    {
        $this->commentService = $commentService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'story_id' => 'required|exists:stories,id',
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);
        $comment = $this->commentService->store($request);
        return response()->json(['status'=>true,'message'=>'Comment Added successfully','data'=>$comment]);
    }
}
