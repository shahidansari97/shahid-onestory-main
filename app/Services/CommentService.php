<?php

namespace App\Services;

use App\Contracts\Services\CommentServiceInterface;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
class CommentService implements CommentServiceInterface
{
    private User $user;

    public function __construct(Request $request)
    {
        if(Auth::user()) {
            $this->user = Auth::user();
        }

        if($request->user_id) {
            $this->user =  User::find($request->user_id);
        }

    }


    public function store($request)
    {
        $comment = Comment::create([
            'user_id' => Auth::user()->id,
            'story_id' => $request->story_id,
            'parent_id' => $request->parent_id,
            'content' => $request->content,
        ]);
        $comment->load('user');
        return $comment;
    }
}
