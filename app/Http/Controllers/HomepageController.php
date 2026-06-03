<?php

namespace App\Http\Controllers;

use App\Contracts\Services\AudioRecordingServiceInterface;
use App\Contracts\Services\HomepageServiceInterface;
use App\Contracts\Services\StoryServiceInterface;
use App\Models\AudioRecording;
use App\Models\Gift;
use App\Models\Homepage;
use App\Models\SpokenStoryRecording;
use App\Models\User;
use App\Models\WrittenMessage;
use App\Services\DraftService;
use App\Services\EditorUrlService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomepageController extends Controller
{
    private HomepageServiceInterface $homepageService;
    private StoryServiceInterface $storyService;
    private AudioRecordingServiceInterface $audioRecordingService;
    private array $hero;
    private array $storyBlock;
    private array $aboutBlock;

    public function __construct(
        HomepageServiceInterface $homepageService,
        StoryServiceInterface $storyService,
        AudioRecordingServiceInterface $audioRecordingService
    )
    {
        $this->homepageService = $homepageService;
        $this->storyService = $storyService;
        $this->audioRecordingService = $audioRecordingService;

        $homepageArray = $this->homepageService->getValueFromHomepage($this->homepageService->all());

        $this->hero = $homepageArray['hero'] ?? [];
        $this->storyBlock = $homepageArray['storyBlock'] ?? [];
        $this->aboutBlock = $homepageArray['aboutBlock'] ?? [];
    }

    public function index()
    {
        $storyIds = $this->storyBlock['storiesOrder'] ?? [];
        $stories = $this->storyService->getStoriesByIds($storyIds);
        $this->storyBlock['storiesOrder'] = $stories->all();

        $bannerStoryIds = [58, 50, 66];
        $bannerStories = $this->storyService->getStoriesByIds($bannerStoryIds);
        $staticBannerPosters = [
            58 => '/img/banner-story-2.png',
            50 => '/img/banner-story-3.png',
            66 => '/img/banner-story-1.png',
        ];
        // $bannerStoryIds = [1453, 1501, 140];
        // $staticBannerPosters = [
        //     1453 => '/img/banner-story-2.png',
        //     1501 => '/img/banner-story-3.png',
        //     140 => '/img/banner-story-1.png',
        // ];

        $bannerCards = collect($bannerStoryIds)
            ->map(function ($storyId, $index) use ($bannerStories, $staticBannerPosters) {
                $story = $bannerStories->firstWhere('id', $storyId);
                if (!$story) {
                    return null;
                }

                $categories = $story->categories ?? [];
                if (is_string($categories)) {
                    $categories = json_decode($categories, true) ?: [];
                }
                if (!is_array($categories)) {
                    $categories = [];
                }
                $categoryLabel = collect($categories)
                    ->first(fn ($c) => is_string($c) && $c !== '' && strtolower($c) !== 'all')
                    ?? ($categories[0] ?? 'Story');

                $author = $story->user ?? null;

                return [
                    'id' => $index + 1,
                    'storyId' => (int) $storyId,
                    'poster' => $staticBannerPosters[(int) $storyId] ?? ($story->thumbnail ?? null),
                    'video' => $story->src ?? $story->video_url ?? $story->master_url ?? null,
                    'alt' => $story->name ?? ('Featured story ' . ($index + 1)),
                    'author' => $author ? [
                        'id' => $author->id,
                        'name' => $author->name ?? ($story->name ?? 'Storyteller'),
                        'avatar' => $author->avatar ?? '/img/avatar.png',
                        'is_following' => Auth::check()
                            ? (bool) Auth::user()->isFollowing($author)
                            : false,
                    ] : null,
                    'category' => is_string($categoryLabel) ? $categoryLabel : 'Story',
                ];
            })
            ->filter()
            ->values()
            ->all();

        // Dedicated 4-card section IDs (same backend-driven pattern as 3-card banner IDs).
        $communityStoryIds = [58, 132, 67, 51];
        $communityStories = $this->storyService->getStoriesByIds($communityStoryIds);
        $communityCards = collect($communityStoryIds)
            ->map(function ($storyId, $index) use ($communityStories) {
                $story = $communityStories->firstWhere('id', $storyId);
                if (!$story) {
                    return null;
                }

                return [
                    'id' => $index + 1,
                    'storyId' => (int) $storyId,
                    // Use dynamic story thumbnail (no static image mapping).
                    'poster' => $story->thumbnail ?? null,
                    'video' => $story->src ?? $story->video_url ?? $story->master_url ?? null,
                    'alt' => $story->name ?? ('Community story ' . ($index + 1)),
                ];
            })
            ->filter()
            ->values()
            ->all();

        // Fetch a single published audio recording
        $audioRecording = $this->audioRecordingService->getLatestPublishedRecording('public');

        /**
         * Featured spoken story recording (single weekly featured item).
         * We keep ONE stable record so people can always comment/share it.
         */
        $weeklySpokenPath = 'audio/weekly-spoken-story.wav';
        $weeklySpoken = SpokenStoryRecording::query()
            ->where('path', $weeklySpokenPath)
            ->first();

        // Auto-create the weekly featured record if it doesn't exist yet.
        if (!$weeklySpoken) {
            $fallbackUserId = User::query()->orderBy('id')->value('id');
            if ($fallbackUserId) {
                $weeklySpoken = SpokenStoryRecording::query()->create([
                    'user_id' => $fallbackUserId,
                    'path' => $weeklySpokenPath,
                    'publish_type' => 'public',
                    'duration' => null,
                    'message' => 'Weekly spoken story',
                    'status' => 1,
                    'total_share' => 0,
                ]);
            }
        }

        $spokenStoryRecording = null;
        if ($weeklySpoken) {
            $spokenStoryRecording = SpokenStoryRecording::query()
                ->with('user:id,name,username')
                ->withCount('comments')
                ->whereKey($weeklySpoken->id)
                ->first();
        }

        // Final fallback (should rarely happen, e.g. if users table is empty)
        if (!$spokenStoryRecording) {
            $spokenStoryRecording = SpokenStoryRecording::query()
                ->with('user:id,name,username')
                ->withCount('comments')
                ->where('publish_type', 'public')
                ->whereIn('status', [1, 2])
                ->orderByDesc('created_at')
                ->first();
        }

        // $writtenMessages = WrittenMessage::query()
        //     ->with('user:id,name,username')
        //     ->withCount('comments')
        //     ->where('publish_type', 'public')
        //     ->whereIn('status', [1, 2])
        //     ->orderByDesc('created_at')
        //     ->limit(10)
        //     ->get();

        $writtenMessages = WrittenMessage::query()
            ->with('user:id,name,username')
            ->withCount('comments')
            // Home "Written Stories" section: show latest public written message(s).
            // New submissions are saved as Pending (status=2) until approved, so include them too.
            ->where('publish_type', 'public')
            ->whereIn('status', [1, 2])
            ->orderByDesc('created_at')
            ->limit(1)
            ->get();

        // Fallback: if no public written story exists yet, return the latest item so actions can still work.
        if ($writtenMessages->isEmpty()) {
            $writtenMessages = WrittenMessage::query()
                ->with('user:id,name,username')
                ->withCount('comments')
                ->whereIn('status', [1, 2])
                ->orderByDesc('created_at')
                ->limit(1)
                ->get();
        }

        $data = [
            'hero' => $this->hero,
            'story' => $this->storyBlock,
            'stories' => $this->storyService->getFirstTwentyStoriesasPerAdmin($storyIds),
            'banner_story_ids' => $bannerStoryIds,
            'banner_stories' => $bannerStories->all(),
            'banner_cards' => $bannerCards,
            'community_story_ids' => $communityStoryIds,
            'community_stories' => $communityStories->all(),
            'community_cards' => $communityCards,
            'about' => $this->aboutBlock,
            'gifts' => Gift::all(),
            'audioRecording' => $audioRecording,
            'spoken_story_recording' => $spokenStoryRecording,
            'written_messages' => $writtenMessages,
            'refill_success' => session('refill_success', false),
        ];  
        
        return Inertia::render('Home/Index', ['data' => $data]);
    }
    public function draftPage(DraftService $draftService, EditorUrlService $editorUrlService)
    {
        $user = Auth::user();

        if ($user && !$draftService->hasDraftVideo($user->id)) {
            return redirect()->away($editorUrlService->generateStepOneUrl($user->id));
        }

        $data = [
            'gifts' => Gift::all(),
            'refill_success' => session('refill_success', false),
        ];

        return Inertia::render('Draft/Index', ['data' => $data]);
    }
		
    public function edit()
    {
        $data = [
            'hero' => $this->hero,
            'storyBlock' => $this->storyBlock
        ];

        return Inertia::render('Dashboard/Home/Edit', ['data' => $data]);
    }
    public function shareInformation()
    {
        return Inertia::render('Share/Index');
    }

    public function competition()
    {
        return Inertia::render('Competition/Index');
    }
    public function editorContest()
    {
        $limit = $request->limit ?? 6;
        $page = $request->page ?? 1;
        $data = [
            'hero' => $this->hero,
            'stories' => $this->storyService->getStoriesForContest($limit,$page),
            'about' => $this->aboutBlock,
            'gifts' => Gift::all(),
            'refill_success' => session('refill_success', false),
        ];  
        return Inertia::render('Contest/Index', ['data' => $data]);
    }
    public function editorContestLoadMore(Request $request)
    {
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 2);
        $stories = $this->storyService->getStoriesForContest($limit, $page);
        return response()->json([
            'stories' => $stories->items(),
            'currentPage' => $stories->currentPage(),
            'lastPage' => $stories->lastPage(),
        ]);
    }
    public function update(Request $request)
    {
        $this->homepageService->update(
            hero: $request->hero,
            storyBlock: $request->storyBlock,
        );

        return redirect()->route('homepage.edit')->with('message', 'Data saved successfully');
    }

    public function updateStoryOrder(Request $request)
    {
        $request->validate([
            'storyIds' => 'required|array',
            'storyIds.*' => 'exists:stories,id',
        ]);

        $this->homepageService->updateStoryOrder($request->storyIds);

        return response()->json(['message' => 'Story order updated successfully.']);
    }

    public function storiesEditorIndex()
    {
        $homepage = Homepage::where('key', 'storyBlock')->first();
        $storyOrder = $homepage ? ($homepage->value['storiesOrder'] ?? []) : [];

        $stories = $this->storyService->getStoriesForEditor($storyOrder);

        return Inertia::render('Dashboard/Home/VideoEditor', [
            'availableStories' => $stories['availableStories'],
            'selectedStories' => $stories['selectedStories'],
        ]);
    }
    public function editorNewContest()
    {
        $limit = $request->limit ?? 6;
        $page = $request->page ?? 1;
        $data = [
            'hero' => $this->hero,
            'stories' => $this->storyService->getStoriesForContest($limit,$page),
            'about' => $this->aboutBlock,
            'gifts' => Gift::all(),
            'refill_success' => session('refill_success', false),
        ];
        return Inertia::render('ContestNew/Index', ['data' => $data]);
    }
    public function howToCreateAStory()
    {
        $storyIds = $this->storyBlock['storiesOrder'] ?? [];
        $stories = $this->storyService->getStoriesByIds($storyIds);
        $this->storyBlock['storiesOrder'] = $stories->all();
        $data = [
            'hero' => $this->hero,
            'story' => $this->storyBlock,
            'stories' => $this->storyService->getFirstTwentyStories(),
            'about' => $this->aboutBlock,
            'gifts' => Gift::all(),
            'refill_success' => session('refill_success', false),
        ];
        return Inertia::render('Home/HowToCreateStory', ['data' => $data]);
    }
    public function voting(Request $request)
    {
        $request->validate([
            'story_id' => 'required|exists:stories,id',
            'type' => 'required|in:best_edit,best_content'
        ]);
        $result = $this->storyService->voting($request);
        return response()->json([
            'result' => $result
        ]);
    }

    public function triggerVideoEditor(Request $request)
    {
        return redirect('/?open_editor=1');
    }
}
