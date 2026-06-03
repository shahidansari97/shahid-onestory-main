<?php

namespace App\Http\Controllers;

use App\Contracts\Services\ProfileServiceInterface;
use App\Contracts\Services\StoryServiceInterface;
use App\Contracts\Services\FollowServiceInterface;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\Gift;
use App\Models\StoryView;
use App\Models\User;
use App\Models\Withdrawal;
use App\Models\GiftTransaction;
use App\Models\VideoRewardTransaction;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    private StoryServiceInterface $storyService;
    private ProfileServiceInterface $profileService;
    private FollowServiceInterface $followService;
    public function __construct(ProfileServiceInterface $profileService, StoryServiceInterface $storyService, FollowServiceInterface $followService)
    {
        $this->profileService = $profileService;
        $this->storyService = $storyService;
        $this->followService = $followService;
    }

    // public function index()
    // {
    //     $userData = $this->profileService->getUserGiftInfo();

    //     // return Inertia::render('Profile/Index', [
    //     return Inertia::render('Profile/UserProfile', [
    //         'stories' => $this->storyService->allStoriesFromUser(),
    //         'user' => $userData,
    //         'gifts' => $userData['gifts'],
    //         'coins' => $userData['coins'],
    //     ]);
    // }
    public function index(Request $request)
    {
        if(!Auth::user() && !$request->user_id){
            return redirect()->route('login');
        }
        if($request->user_id){
            $storyUser = $this->storyService->allAnotherStoriesFromUser($request->user_id);
        }else{
            $storyUser = $this->storyService->allStoriesFromUser();
        }
        $data = [
            'stories' => $storyUser,
            'user' => $this->profileService->getUserInfoForPublicProfile(),
            'gifts' => Gift::all(),
            'followers' =>  $this->followService->getFollowers(),
            'following' =>  $this->followService->getFollowing()
        ];
        return Inertia::render('Profile/UserProfile', ['data' => $data]);
    }
    public function mySpace(Request $request)
    {
        if(!Auth::user() && !$request->user_id){
            return redirect()->route('login');
        }
        
        $data = [
            'stories' => $this->storyService->mySpaceAllStoriesFromUser(),
            'user' => $this->profileService->getUserInfoForPublicProfile(),
            'gifts' => Gift::all(),
            'followers' =>  $this->followService->getFollowers(),
            'following' =>  $this->followService->getFollowing()
        ];
        return Inertia::render('Profile/UserMySpace', ['data' => $data]);
    }
    public function creatorDashboard(Request $request)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        if (!$user->is_creator) {
            return redirect()->route('user.profile.index');
        }
        if (!$user->creator_status) {
            return Redirect::to('/');
        }
        
        // Get user's stories
        $stories = $this->storyService->viewCountStoriesFromUser();
        
        // Calculate dashboard statistics
        $storyIds = $stories->pluck('id');
        $totalViews = StoryView::whereIn('story_id', $storyIds)
        ->where(function ($query) use ($user) {
            $query->whereNull('user_id')
                ->orWhere('user_id', '!=', $user->id);
        })
        ->count();

        //$totalViews = StoryView::where('user_id', '!=', $user->id)->whereIn('story_id', $storyIds)->count();
        $totalVideos = $stories->count();
        $avgViewsPerVideo = $totalVideos > 0 ? (float) $totalViews / $totalVideos : 0.0;
        //$avgViewsPerVideo = $totalVideos > 0 ? round($totalViews / $totalVideos) : 0;
        
        // Calculate growth rate (views in last 30 days vs previous 30 days)
        $thirtyDaysAgo = now()->subDays(30);
        $sixtyDaysAgo = now()->subDays(60);
        $recentViews = StoryView::whereIn('story_id', $storyIds)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->count();
        $previousViews = StoryView::whereIn('story_id', $storyIds)
            ->where('created_at', '>=', $sixtyDaysAgo)
            ->where('created_at', '<', $thirtyDaysAgo)
            ->count();
        $growthRate = $previousViews > 0 ? round((($recentViews - $previousViews) / $previousViews) * 100, 1) : 0;
        
        // Get user balance
        $balance = $user->balance ?? 0;
        
        // Calculate total earnings from gifts (gifts have cost field)
        // $giftTransactions = GiftTransaction::where('recipient_id', $user->id)
        //     ->with('gift')
        //     ->get();

        $totalVideoRewardTransactions = VideoRewardTransaction::where('user_id', $user->id)->where('type', 'CREDIT')
            ->get();
        
        $totalEarnings = $totalVideoRewardTransactions->sum(function ($transaction) {
            return $transaction->amount ?? 0;
        });
        
        // $thisMonthEarnings = $giftTransactions
        //     ->filter(function ($transaction) {
        //         return $transaction->created_at->isCurrentMonth();
        //     })
        //     ->sum(function ($transaction) {
        //         return $transaction->gift->cost ?? 0;
        //     });
        
        // Get Reward withdrawal history
        $withdrawals = VideoRewardTransaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $withdrawals->getCollection()->transform(function ($withdrawal) {
            return [
                'id' => $withdrawal->id,
                'amount' => number_format($withdrawal->amount, 3),
                'status' => $withdrawal->status ?? 'pending',
                'type' => $withdrawal->type ?? 'N/A',
                'created_at' => $withdrawal->created_at
                    ? \Carbon\Carbon::parse($withdrawal->created_at)->format('M d, Y')
                    : null,
            ];
        });

        $thisMonthEarnings = VideoRewardTransaction::where('user_id', $user->id)
        ->where('type', 'credit')
        ->whereBetween('created_at', [
            now()->startOfMonth(),
            now()->endOfMonth()
        ])
        ->sum('amount');

        // Attach view counts to each story so the frontend can display per-story views
        // $stories = $stories->map(function ($story) use ($user) {
        //     $story->views = StoryView::where('story_id', $story->id)
        //         ->where('user_id', '!=', $user->id)
        //         ->count();

        //     return $story;
        // });

        $stories = $stories->map(function ($story) use ($user) {
            $story->views = StoryView::where('story_id', $story->id)
                ->where(function ($query) use ($user) {
                    $query->whereNull('user_id')
                        ->orWhere('user_id', '!=', $user->id);
                })
                ->count();

            return $story;
        });
        
        // Get video performance data (paginated)
        $page = $request->input('videoPage', 1);
        $perPage = 10;
        // Get video performance data (paginated)
        $page = $request->input('videoPage', 1);
        $perPage = 10;
        
        $allVideoPerformance = $stories->map(function ($story) use ($user) {
            // $views = StoryView::where('user_id', '!=', $user->id)->where('story_id', $story->id)->count();
            $views = StoryView::where('story_id', $story->id)
            ->where(function ($query) use ($user) {
                $query->where('user_id', '!=', $user->id)
                    ->orWhereNull('user_id');
            })
            ->count();
            
            $earning = config('app.per_view_rate'); // 0.007
            // Calculate earnings: 1 view = $0.007
            $storyEarnings = $views * $earning;
            
            return [
                'id' => $story->id,
                'title' => $story->name,
                'views' => $views,
                'earnings' => (float) number_format($storyEarnings, 3),
                'thumbnail' => $story->thumbnail,
                'created_at' => $story->created_at->format('M d, Y'),
            ];
        })->sortByDesc('views')->values();
        
        // Paginate the results
        $videoPerformance = new \Illuminate\Pagination\Paginator(
            $allVideoPerformance->slice(($page - 1) * $perPage, $perPage),
            $perPage,
            $page,
            [
                'path' => route('user.creator.dashboard'),
                'query' => $request->query(),
            ]
        );
        $videoPerformance->setCollection(collect($videoPerformance->items()));
        
        // Paginate the results
        $videoPerformance = new \Illuminate\Pagination\Paginator(
            $allVideoPerformance->slice(($page - 1) * $perPage, $perPage),
            $perPage,
            $page,
            [
                'path' => route('user.creator.dashboard'),
                'query' => $request->query(),
            ]
        );
        $videoPerformance->setCollection(collect($videoPerformance->items()));
        
        $data = [
            'stories' => $stories,
            'user' => $this->profileService->getUserInfoForPublicProfile(),
            'gifts' => Gift::all(),
            'followers' => $this->followService->getFollowers(),
            'following' => $this->followService->getFollowing(),
            // Dashboard statistics
            'stats' => [
                'totalViews' => $totalViews,
                'totalVideos' => $totalVideos,
                'avgViewsPerVideo' => $avgViewsPerVideo,
                'growthRate' => $growthRate,
            ],
            'balance' => $balance,
            'totalEarnings' => $totalEarnings,
            'thisMonthEarnings' => $thisMonthEarnings,
            'withdrawals' => $withdrawals,
            'videoPerformance' => $videoPerformance,
        ];

        // dd($data);
        
        return Inertia::render('Profile/CreatorDashboard', ['data' => $data]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse|JsonResponse
    {
      
        $validatedProfileData = $request->validated();
        $user = $request->user();

        if ($request->has('avatar')) {
            $validatedProfileData['avatar'] = $this->normalizeProfileMediaPath(
                $request->input('avatar'),
                'users-avatar'
            );
        }

        if ($request->has('cover_photo')) {
            $validatedProfileData['cover_photo'] = $this->normalizeProfileMediaPath(
                $request->input('cover_photo'),
                'cover-images'
            );
        }

        $user->fill($validatedProfileData);

        if (array_key_exists('avatar', $validatedProfileData)) {
            $avatar = $validatedProfileData['avatar'];
            $user->setAttribute(
                'avatar',
                $avatar ? $this->appendMediaCacheVersion($avatar) : ''
            );
        }

        if (array_key_exists('cover_photo', $validatedProfileData)) {
            $coverPhoto = $validatedProfileData['cover_photo'];
            $user->setAttribute(
                'cover_photo',
                $coverPhoto ? $this->appendMediaCacheVersion($coverPhoto) : ''
            );
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'avatar' => $user->avatar,
            ]);
        }

        return Redirect::route('user.profile.edit');
    }

    private function normalizeProfileMediaPath(?string $value, string $folder): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim($value);
        if ($value === '') {
            return '';
        }

        $value = strtok($value, '?') ?: $value;

        $appUrl = rtrim((string) config('app.url'), '/');
        if ($appUrl !== '' && str_starts_with($value, $appUrl)) {
            $value = substr($value, strlen($appUrl)) ?: '';
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            $path = parse_url($value, PHP_URL_PATH);
            if (is_string($path) && $path !== '') {
                $value = $path;
            }
        }

        if (
            str_starts_with($value, '/storage/') ||
            str_starts_with($value, '/img/')
        ) {
            return $value;
        }

        return '/storage/' . trim($folder, '/') . '/' . basename($value);
    }

    private function appendMediaCacheVersion(string $path): string
    {
        $base = strtok($path, '?') ?: $path;

        return $base . '?v=' . time();
    }

    public function delete(Request $request): RedirectResponse
    {
        $request->validate(['password' => ['required', 'current_password']]);

        $user = $request->user();
        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Autocomplete users by username/name for header search.
     */
    public function autocompleteUsers(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        if ($q === '' || strlen($q) < 1) {
            return response()->json(['data' => []]);
        }

        $users = User::query()
            ->select(['id', 'username', 'name', 'avatar'])
            ->where(function ($query) use ($q) {
                $query->where('username', 'like', '%' . $q . '%')
                    ->orWhere('name', 'like', '%' . $q . '%');
            })
            // ->where(function ($query) {
            //     $query->whereNull('active_status')
            //         ->orWhere('active_status', 1);
            // })
            ->orderBy('username')
            ->limit(8)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->username ?: ($user->name ?: 'User'),
                    'avatar' => $user->avatar ?: '/img/avatar.png',
                ];
            })
            ->values();

        return response()->json(['data' => $users]);
    }
}
