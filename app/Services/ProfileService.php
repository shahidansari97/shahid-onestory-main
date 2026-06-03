<?php

namespace App\Services;

use App\Contracts\Services\ProfileServiceInterface;
use App\Contracts\Services\StoryServiceInterface;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class ProfileService implements ProfileServiceInterface
{
    private User $user;
    private StoryServiceInterface $storyService;

    public function __construct(Request $request,StoryServiceInterface $storyService)
    {
        $this->storyService = $storyService;
        if(Auth::user()) {
            $this->user = Auth::user();
        }

        if($request->user_id) {
            $this->user =  User::find($request->user_id);
        }

    }

    public function storeInLocal($media, $dir): string
    {
        $uuid = Str::uuid()->toString();
        $extension = $media->getClientOriginalExtension();
        $filename = $uuid . '.' . $extension;

        $media->storeAs($dir, $filename);

        return $filename;
    }

    public function getUserGiftInfo(): array
    {
        $userGifts = DB::table('gift_transactions AS gt')
            ->select(['gt.id', 's.username AS sender', 'r.name AS recipient', 'g.name', 'g.picture'])
            ->join('gifts AS g', 'gt.gift_id', '=', 'g.id')
            ->join('users AS s', 'gt.sender_id', '=', 's.id')
            ->join('users AS r', 'gt.recipient_id', '=', 'r.id')
            ->where('recipient_id', $this->user->id)->get();

        return [
            'name' => $this->user->name,
            'username' => $this->user->username,
            'avatar' => $this->user->avatar,
            'world_message' => $this->user->world_message,
            'gift_quantity' => $this->user->gift_quantity,
            'gifts' => $userGifts,
            'coins' => $this->user->balance,
        ];
    }
    public function getUserInfoForPublicProfile()
    {
        return User::where('id', $this->user->id)->first();
        // return $this->storyService->formatAuthor($user[0]);
    }
}
