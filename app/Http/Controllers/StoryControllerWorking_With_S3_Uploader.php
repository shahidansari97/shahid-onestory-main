<?php

namespace App\Http\Controllers;

use App\Contracts\Services\StoryServiceInterface;
use App\Http\Requests\StoryRequest;
use App\Models\EditorDraft;
use App\Models\Gift;
use App\Models\Story;
use App\Models\User;
use App\Models\StoryStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
class StoryController extends Controller
{
    private StoryServiceInterface $storyService;

    public function __construct(StoryServiceInterface $storyService)
    {
        $this->storyService = $storyService;
    }

    public function allStories(Request $request, $id = null)
    {
        $sharedStory = Story::find($id);
        // $categories = [
        //     "story",
        //     "Abuse",
        //     "Art",
        //     "Compassion",
        //     "Conflict",
        //     "Conquering Fears",
        //     "Loss",
        //     "Love",
        //     "Other",
        //     "Passion",
        //     "Sexual Identity",
        //     "Starting Over",
        //     "Substance"
        // ];
        $categories = [
            "All",
            "Love",
            "Substance Abuse",
            "Sexual Identity",
            "Conflict",
            "Art",
            "Loss",
            "Starting Over",
            "Compassion",
            "Conquering Fears",
            "Passion",
            "other",
        ];
        // $categories = $this->storyService->getAllCategories();
        $storiesByCategory = [];
        $hightLightStories = $this->storyService->getHighlightedStories();
        foreach ($categories as $category) {
            $stories = $this->storyService->getPaginatedStoriesByCategory(
                $category,
                $request->get("page_$category", 1)
            );

            $storiesByCategory[$category] = [
                'stories' => $stories->items(),
                'currentPage' => $stories->currentPage(),
                'lastPage' => $stories->lastPage(),
            ];
        }

        if ($sharedStory) {
            $sharedStory = $this->storyService->getStory($sharedStory->id);
        }

        return Inertia::render('Profile/AllStories', [
            'storiesByCategory' => $storiesByCategory,
            'categories' => $categories,
            'gifts' => Gift::all(),
            'sharedStory' => $sharedStory,
            'hightLightStories' => $hightLightStories
        ]);
    }

    public function allHighlightStories(Request $request, $story_id = null, $type=null)
    {
        if($type){
            $hightLightStories = $this->storyService->getSharedStoryOnly($story_id);
        }else{
            $hightLightStories = $this->storyService->getHighlightedStories();
        }
        return Inertia::render('Profile/HighlightStories', [
            'gifts' => Gift::all(),
            'story_id' => $story_id,
            'hightLightStories' => $hightLightStories
        ]);
    }	


    public function loadMoreStories(Request $request, $category)
    {
        $page = $request->get('page', 1);
        $stories = $this->storyService->getPaginatedStoriesByCategory($category, $page);

        return response()->json([
            'stories' => $stories->items(),
            'currentPage' => $stories->currentPage(),
            'lastPage' => $stories->lastPage(),
        ]);
    }

    public function getAllCommentsInStory(Request $request, $story_id)
    {
        $page = $request->get('page', 1);
        $comments = $this->storyService->getAllCommentsForStory($story_id);

        return response()->json([
            'data' => $comments,
        ]);
    }

    public function adminAllStories(Request $request)
    {
        $search = $request->input('search');
        $category = $request->input('category');
        $filter = $request->input('filter', 'all');
        $page = $request->input('page', 1);
        $perPage = 12;

        // Get counts for each status
        $totalStoriesCount = Story::count();
        $totalPublishedStories = Story::where('story_status_id', 2)->count();
        $totalPendingStories = Story::where('story_status_id', 1)->count();
        $totalRejectedStories = Story::where('story_status_id', 3)->count();
        $totalPublicStories = Story::where('publish_type', 'public')->count();
        $totalPrivateStories = Story::where('publish_type', 'private')->count();

        // Apply filter based on status or publish type
        $statusId = match($filter) {
            'published' => 2,
            'pending' => 1,
            'rejected' => 3,
            default => null
        };

        $publishType = match($filter) {
            'public' => 'public',
            'private' => 'private',
            default => null
        };

        $stories = $this->storyService->getPaginatedStories($page, $perPage, false, $search, $category, $statusId, $publishType);
        $storyStatuses = StoryStatus::select('id', 'name')->get();
        $categories = $this->storyService->getAllCategories(onlyPublished: false);

        return Inertia::render('Dashboard/Stories/Index', [
            'stories' => $stories->items(),
            'currentPage' => $stories->currentPage(),
            'lastPage' => $stories->lastPage(),
            'perPage' => $stories->perPage(),
            'totalStories' => $stories->total(),
            'links' => $stories->links(),
            'storyStatuses' => $storyStatuses,
            'categories' => $categories,
            'totalStoriesCount' => $totalStoriesCount,
            'totalPublishedStories' => $totalPublishedStories,
            'totalPendingStories' => $totalPendingStories,
            'totalRejectedStories' => $totalRejectedStories,
            'totalPublicStories' => $totalPublicStories,
            'totalPrivateStories' => $totalPrivateStories,
            'filter' => $filter,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $draft = EditorDraft::where('user_id', $user->id)->latest()->first();

        $scene = null;
        if ($draft) {
            $sceneContent = Storage::get($draft->path);
            $scene = json_decode($sceneContent, true);
        }

        return Inertia::render('Stories/Create', [
//            'draft' => $scene,
        ]);
    }

    public function show($id)
    {
        $story = Story::with('user')->find($id);
        if (!$story) {
            return redirect()->route('admin.stories.all')->with('error', 'Story not found.');
        }

        $storyStatuses = StoryStatus::select('id', 'name')->get();
        $categories = $this->storyService->getAllCategories();

        return Inertia::render('Dashboard/Stories/Show', [
            'story' => $story,
            'storyStatuses' => $storyStatuses,
            'categories' => $categories,
        ]);
    }
    public function edit($id)
    {
        $story = Story::with('user')->find($id);
        if (!$story) {
            return redirect()->route('admin.stories.all')->with('error', 'Story not found.');
        }

        $storyStatuses = StoryStatus::select('id', 'name')->get();
        // $categories = $this->storyService->getAllCategories();
        $categories = [
            "All",
            "Love",
            "Substance Abuse",
            "Sexual Identity",
            "Conflict",
            "Art",
            "Loss",
            "Starting Over",
            "Compassion",
            "Conquering Fears",
            "Passion",
            "other",
        ];
        return Inertia::render('Dashboard/Stories/Edit', [
            'story' => $story,
            'storyStatuses' => $storyStatuses,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'story_status_id' => 'required|integer|exists:story_statuses,id',
        ]);

        $data = $request->only(['name', 'categories', 'story_status_id']);

        $updated = $this->storyService->updateStory($id, $data);

        if ($updated) {
            return redirect()->back()->with('message', 'Story updated successfully.');
        } else {
            return redirect()->back()->with('error', 'Failed to update story.');
        }
    }
    
    public function store(StoryRequest $request)
    {
        $publish_type = $request->input('publishType') 
            ?? $request->input('publish_type') 
            ?? 'public';

        $validatedData = $request->validated();
        $userDetails = User::find($validatedData['userId']);
        $this->storyService->store(
            userId: $validatedData['userId'],
            src: $validatedData['s3Url'],
            master_url: $validatedData['masterUrl'],
	        preview: $validatedData['previewUrl'],
            thumbnail: $validatedData['thumbnailUrl'],
            name: $userDetails ? $userDetails->username : 'Story',
            categories:  $validatedData['categories'],
            publish_type: $publish_type,
        );

        return response()->json(['status'=>true,'message'=>'Story published successfully']);
    }

    /**
     * Store manual video upload with automatic processing
     */
    public function storeManualVideo(Request $request)
    {
        $validatedData = $request->validate([
            'video' => 'required|file|mimes:mp4,mov,avi,flv,mkv,webm|max:524288',
            'userId' => 'required|exists:users,id',
            'publish_type' => 'required|in:public,private',
        ]);

        // Verify user is authenticated and owns the upload
        if (!Auth::check() || Auth::id() != $validatedData['userId']) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $file = $request->file('video');

            // Generate thumbnail from local temp file BEFORE S3 upload
            $thumbnailUrl = $this->generateVideoThumbnail($file->getRealPath());

            // Upload video to S3 with public visibility
            $videoFilename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            Storage::disk('s3')->putFileAs('stories/videos', $file, $videoFilename, ['visibility' => 'public']);
            $videoUrl = Storage::disk('s3')->url('stories/videos/' . $videoFilename);

            // Get user details
            $userDetails = User::find($validatedData['userId']);

            // Store the story
            $this->storyService->store(
                userId: $validatedData['userId'],
                src: $videoUrl,
                master_url: $videoUrl,
                preview: $videoUrl,
                thumbnail: $thumbnailUrl,
                name: $userDetails ? $userDetails->username : 'Story',
                categories: ['story'],
                publish_type: $validatedData['publish_type'],
            );

            return response()->json([
                'status' => true,
                'message' => 'Video uploaded successfully! It will be reviewed and published soon.',
                'data' => [
                    'videoUrl' => $videoUrl,
                    'thumbnailUrl' => $thumbnailUrl,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to upload video: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate thumbnail from video file
     */
    private function generateVideoThumbnail(string $localTempPath): string
    {
        try {
            if (function_exists('exec')) {
                exec('ffmpeg -version 2>&1', $out, $code);
                if ($code === 0) {
                    $thumbnailKey = 'stories/thumbnails/' . Str::uuid() . '.jpg';
                    $localThumbPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . Str::uuid() . '.jpg';

                    $command = 'ffmpeg -i ' . escapeshellarg($localTempPath) . ' -ss 00:00:01 -vframes 1 ' . escapeshellarg($localThumbPath) . ' 2>&1';
                    exec($command, $ffOut, $returnVar);

                    if ($returnVar === 0 && file_exists($localThumbPath)) {
                        Storage::disk('s3')->put($thumbnailKey, file_get_contents($localThumbPath), ['visibility' => 'public']);
                        @unlink($localThumbPath);
                        return Storage::disk('s3')->url($thumbnailKey);
                    }
                }
            }
        } catch (\Exception $e) {
        }

        // Fallback: use a default placeholder
        return asset('img/video-placeholder.jpg');
    }
    
    // public function store(Request $request)
    // {
        
    //     // $validatedData = $request->validated();
    //     $thumbnailPath = null;
    //     if ($request->hasFile('thumbnail')) {
    //         $thumbnailPath = $this->storyService->storeThumbnail($request->file('thumbnail'));
    //     }
    //     $userDetails = User::find($request->userId);
    //     $this->storyService->store(
    //         userId: $request->userId,
    //         src: $request->s3Url,
    //         thumbnail: $thumbnailPath,
    //         name: $userDetails ? $userDetails->username : 'Story',
    //         categories:  ["story"],
    //     );

    //     return response()->json(['status'=>true,'message'=>'Story published successfully']);
    // }

    // public function store(StoryRequest $request)
    // {
    //     $validatedData = $request->validated();

    //     $thumbnailPath = null;
    //     if ($request->hasFile('thumbnail')) {
    //         $thumbnailPath = $this->storyService->storeThumbnail($request->file('thumbnail'));
    //     }

    //     $this->storyService->store(
    //         userId: $validatedData['user_id'],
    //         src: $validatedData['src'],
    //         thumbnail: $thumbnailPath,
    //         name: $validatedData['name'],
    //         categories: $validatedData['categories'],
    //     );

    //     return redirect('/profile/');
    // }

    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:stories,id'
        ]);

        return $this->storyService->delete($request->id);
    }
    public function like(Request $request)
    {
        $request->validate([
            'story_id' => 'required|exists:stories,id',
            'type' => 'required|in:like,unlike'
        ]);
        $this->storyService->like($request);
        if($request->story_page == 'home'){
            return Redirect::route('homepage.index');
        }
        return Redirect::route('stories.allStories');
    }
    public function share(Request $request)
    {
        $request->validate([
            'story_id' => 'required|exists:stories,id'
        ]);
        return $this->storyService->shareStoy($request);
    }
    public function destroy($id)
    {
        $media = $this->storyService->deleteStory($id);
        return redirect()->back()->with('message', 'Story deleted successfully!');
    }


    public function manualUploadVideo()
    {
        return Inertia::render('ManualVideo/ManualVideo', [
            'data' => [
                'user' => auth()->user(),
            ],
        ]);
    }
    // public function uploadManualVideo(Request $request)
    // {
    //     return Inertia::render('ManualVideo/UploadManualVideo', [
    //         'data' => [
    //             'user' => auth()->user(),
    //         ],
    //     ]);
    // }

    
}
