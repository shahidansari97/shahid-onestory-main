<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Contracts\Services\FollowServiceInterface;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use App\Models\Follow;
use App\Models\User;
use Inertia\Inertia;
class FollowController extends Controller
{
    private FollowServiceInterface $followService;

    public function __construct(FollowServiceInterface $followService)
    {
        $this->followService = $followService;
    }

    public function follow(Request $request)
    {
        $service = $this->followService->followUnFollow($request);
        return Redirect::route('home');
    }
    public function followers(Request $request)
    {
        $userId = $request->user_id ??  Auth::user()->id;
        return Inertia::render('Profile/Followers', [
            'followers' =>  $this->followService->getFollowers(),
            'userId' => $userId
        ]);
    }
    public function following(Request $request)
    {
        $userId = $request->user_id ??  Auth::user()->id;
        return Inertia::render('Profile/Following', [
            'following' =>  $this->followService->getFollowing(),
            'userId' => $userId
        ]);
    }
}
