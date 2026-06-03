<?php

namespace App\Services;

use App\Contracts\Services\FollowServiceInterface;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
class FollowService implements FollowServiceInterface
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


    public function followUnFollow($request): array
    {
        $follower = $this->user;
        $userToFollow = User::findOrFail($request->following_id);
        // Toggle the follow/unfollow
        if ($this->user->isFollowing($userToFollow)) {
            $this->user->unfollow($userToFollow);
            $message = 'Unfollowed successfully.';
        } else {
            $this->user->follow($userToFollow);
            $message = 'Followed successfully.';
        }
        $followedUsers = $this->user->following;
        return ['message' => $message, 'followedUsers' => $followedUsers];
    }

    // Get Followers
    public function getFollowers():Collection
    {
        return $this->user->followers()->get()->map(function ($follower) {
            $follower->is_following = $this->user->isFollowing($follower);
            return $follower;
        });
    }
    // Get Followers
    public function getFollowing():Collection
    {
        return $this->user->following()->get()->map(function ($following) {
            $following->is_following = $this->user->isFollowing($following);
            return $following;
        });
    }
}
