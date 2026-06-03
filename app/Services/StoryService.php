<?php

namespace App\Services;

use App\Contracts\Services\StoryServiceInterface;
use App\Models\GiftTransaction;
use App\Models\Story;
use App\Models\StoryLike;
use App\Models\StoryVoting;
use App\Models\Homepage;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
class StoryService implements StoryServiceInterface
{
    private ?User $user = null;

    public function __construct(Request $request)
    {
        if (Auth::check()) {
            $this->user = Auth::user();
        }

        if ($request->user_id) {
            $this->user = User::find($request->user_id);
        }
    }

    public function allStories(): Collection
    {
        return $this->getFormattedStories(
            Story::with('user:id,name,avatar,world_message')
                ->where('story_status_id', 1)
                ->get()
        );
    }

    public function allStoriesFromUser(): ?Collection
    {
        return $this->user ? $this->getFormattedStories(
            $this->getUserStories($this->user->id)
        ) : null;
    }

    public function allAnotherStoriesFromUser($id): ?Collection
    {
        return $id ? $this->getFormattedStories(
            $this->getAnotherUserStories($id)
        ) : null;
    }


    public function mySpaceAllStoriesFromUser(): ?Collection
    {
        return $this->user ? $this->getFormattedStories(
            $this->getUserMySpaceStories($this->user->id)
        ) : null;
    }
    public function viewCountStoriesFromUser(): ?Collection
    {
        return $this->user ? $this->getFormattedStories(
            $this->getUserCountStories($this->user->id)
        ) : null;
    }
    public function store(int $userId, string $src,string $master_url, string $preview, string $thumbnail, string $name, array $categories, string $publish_type = 'public'): void
    {
        Story::create([
            'user_id' => $userId,
            'name' => $name,
            'src' => $src,
            'master_url' => $master_url,
            'thumbnail' => $thumbnail,
	        'preview' => $preview,
            'categories' => $categories,
            'story_status_id' => 1,
            'publish_type' => $publish_type
        ]);
    }
    // public function store(int $userId, string $src, $thumbnail = '', string $name, array $categories): void
    // {
    //     Story::create([
    //         'user_id' => $userId,
    //         'name' => $name,
    //         'src' => $src,
    //         'thumbnail' => $thumbnail,
    //         'categories' => ["story"],
    //         'story_status_id' => 1,
    //     ]);
    // }
    // public function store(int $userId, string $src, string $thumbnail, string $name, array $categories): void
    // {
    //     Story::create([
    //         'user_id' => $userId,
    //         'name' => $name,
    //         'src' => $src,
    //         'thumbnail' => $thumbnail,
    //         'categories' => $categories,
    //     ]);
    // }

    public function delete(int $id): ?bool
    {
        return Story::find($id)?->delete();
    }

    public function storeThumbnail(UploadedFile $thumbnail): string
    {
        return $this->storeInLocal($thumbnail, 'thumbnails');
    }

    public function getStory(int $id): array
    {
        $data = $this->getStoryData($id);
        if (!$data) {
            return [];
        }
        return $this->formatSingleStory($data);
    }

    public function getStoriesByIds(array $storyIds): Collection
    {
        $stories = Story::with(['comments', 'user'])
            ->withCount('likes')
            ->whereIn('id', $storyIds)
            ->where('story_status_id', 2)
            ->limit(8)
            ->get();
        return $this->getFormattedStories($this->sortStoriesByOrder($stories, $storyIds));
    }

    public function getFirstTwentyStories(): Collection
    {
        return $this->getFormattedStories(
            Story::with(['comments','user'])
                ->where('master_url','!=',NULL)
                ->withCount('likes')
                ->where('story_status_id', 2)
                ->orderBy('created_at', 'desc')
                ->limit(20)
                ->get()
        );
    }


    public function getFirstTwentyStoriesasPerAdmin($storyIds): Collection
    {
        // Check if storyIds is not empty and is an array
        if(!empty($storyIds) && is_array($storyIds) && count($storyIds) > 0){
           $storiesOrder = $storyIds;
           return $this->getFormattedStories(
                Story::with(['comments','user'])
                    ->where('master_url','!=',NULL)
                    ->withCount('likes')
                    ->whereIn('id', $storiesOrder)
                    ->where('story_status_id', 2)
                    ->orderByRaw('FIELD(id, ' . implode(',', $storiesOrder) . ')')
                    ->limit(20)
                    ->get()
            );
        }else{
            return $this->getFormattedStories(
                Story::with(['comments','user'])
                    ->where('master_url','!=',NULL)
                    ->withCount('likes')
                    ->where('story_status_id', 2)
                    ->orderBy('created_at', 'desc')
                    ->limit(20)
                    ->get()
            );
        }
    }
    public function getStoriesForContest($limit,$page)
    {
       $query = Story::with('user:id,name,avatar,world_message,story','comments','best_edit_vote_by_user','best_content_vote_by_user')
            ->whereHas('user', function($query){
                $query->where('is_contestant', 1);
            })
            // ->whereIn('id',[50,51,52,54,58,66,67,132,137])
            ->withCount(['likes','best_edit_voting','best_content_voting'])
            ->where('story_status_id', 2)
            ->orderBy('created_at', 'desc');

        $stories = $query->paginate($limit, ['*'], 'page', $page);
        $formattedStories = $this->getFormattedStories($stories->getCollection());
        $formattedStories->transform(function ($story) {
            $story->has_voted_best_edit = $story->best_edit_vote_by_user ? true : false;
            $story->has_voted_best_content = $story->best_content_vote_by_user ? true : false;
            return $story;
        });
        $stories->setCollection($formattedStories);
        return $stories;
    }
    // public function getStoriesForContest($limit,$page)
    // {
    //    $query = Story::with('user:id,name,avatar,world_message,story','comments')
    //         ->whereHas('user', function($query){
    //             $query->where('is_contestant', 1);
    //         })
    //         ->withCount('likes')
    //         ->where('story_status_id', 2)
    //         ->orderBy('created_at', 'desc');

    //     $stories = $query->paginate($limit, ['*'], 'page', $page);
    //     $formattedStories = $this->getFormattedStories($stories->getCollection());
    //     $stories->setCollection($formattedStories);
    //     return $stories;
    // }
    public function getHighlightedStories(): Collection
    {
        return $this->getFormattedStories(
            Story::with(['comments','user'])
                ->withCount('likes')
                ->where('story_status_id', 2)
                ->orderBy('likes_count', 'desc')
                ->limit(20)
                ->get()
        );
    }
    public function getSharedStoryOnly($story_id): Collection
    {
        return $this->getFormattedStories(
            Story::with(['comments','user'])
                ->withCount('likes')
                ->where('id', $story_id)
                ->where('story_status_id', 2)
                ->get()
        );
    }
    public function getStoriesForEditor(array $storyOrder): array
    {
        $storiesCollection = $this->allStories();
        $selectedStories = $storiesCollection->filter(fn($story) => in_array($story->id, $storyOrder))->values();

        return [
            'availableStories' => $storiesCollection->reject(fn($story) => in_array($story->id, $storyOrder))->values(),
            'selectedStories' => $this->sortStoriesByOrder($selectedStories, $storyOrder),
        ];
    }

    private function getUserStories($userId): Collection
    {
        return Story::with('user:id,name,avatar,world_message')
            ->where('user_id', $userId)
            // ->where('story_status_id', 1)
            ->whereIn('story_status_id', [1, 2])
            ->where('publish_type', 'public')
            ->get();
    }
    private function getAnotherUserStories($userId): Collection
    {
        return Story::with('user:id,name,avatar,world_message')
            ->where('user_id', $userId)
            // ->where('story_status_id', 1)
            ->where('story_status_id', 2)
            ->where('publish_type', 'public')
            ->get();
    }
    private function getUserMySpaceStories($userId): Collection
    {
        return Story::with('user:id,name,avatar,world_message')
            ->where('user_id', $userId)
            // ->where('story_status_id', 1)
            // ->where('story_status_id', 2)
            ->whereIn('story_status_id', [1, 2])
            // ->where('publish_type', 'private')
            ->get();
    }
    private function getUserCountStories($userId): Collection
    {
        return Story::with('user:id,name,avatar,world_message')
            ->where('user_id', $userId)
            // ->where('story_status_id', 1)
            ->where('story_status_id', 2)
            ->where('publish_type', 'public')
            ->get();
    }

    private function sortStoriesByOrder(Collection $stories, array $order): Collection
    {
        return $stories->sortBy(fn($story) => array_search($story->id, $order))->values();
    }

    private function storeInLocal($media, $directory = 'videos'): string
    {
        $filename = $this->generateUniqueFilename($media);
        $media->storeAs($directory, $filename, 'public');

        return $filename;
    }

    private function generateUniqueFilename($media): string
    {
        $uuid = Str::uuid()->toString();
        $extension = $media->getClientOriginalExtension();

        return $uuid . '.' . $extension;
    }

    private function getFormattedStories(Collection $stories): Collection
    {
        return $stories->map(fn($story) => $this->formatStory($story));
    }

    private function formatStory($story)
    {
        $this->formatMediaUrls($story);

        $story->author = $this->formatAuthor($story->user);
        unset($story->user);

        return $story;
    }

    private function formatSingleStory(object $data): array
    {
        $author = User::find($data->id ?? null);
        if (!$author) {
            return [];
        }

        $categories = $data->categories ?? null;
        $decodedCategories = is_string($categories)
            ? json_decode($categories, true)
            : (is_array($categories) ? $categories : []);

        return [
            'src' => $data->src,
            'thumbnail' => $data->thumbnail,
            'categories' => is_array($decodedCategories) ? $decodedCategories : [],
            'author' => $this->formatAuthor($author),
        ];
    }

    private function formatMediaUrls($story): void
    {
        // $story->src = $this->getMediaUrl('videos', $story->src);
        // $story->thumbnail = $this->getMediaUrl('thumbnails', $story->thumbnail);
        $story->src = $story->src;
        $story->thumbnail = $story->thumbnail;
    }

    // private function getMediaUrl(string $type, string $filename): string
    // {
    //     return Storage::disk('public')->url("$type/$filename");
    // }

    private function getMediaUrl(string $type, string $filename): string
    {
        return 'https://onestoryplanet.com/storage/'.$type.'/'.$filename;
    }
    public function formatAuthor(User $user): array
    {
        $isFollowing = false;
        if (Auth::check()) {
            try {
                $isFollowing = Auth::user()->isFollowing($user);
            } catch (\Throwable $e) {
                $isFollowing = false;
            }
        }

        return [
            'id' => $user->id,
            'avatar' => $user->avatar,
            'username' => $user->username,
            'cover_photo' => $user->cover_photo,
            'story' => $user->story,
            'name' => $user->name,
            'worldMessage' => $user->world_message,
            'visibility' => $user->visibility,
            'giftsCount' => $this->countGifts($user->id),
            'is_following' => $isFollowing,
        ];
    }

    private function getStoryData(int $id)
    {
        // return DB::table('stories AS s')
        //     ->select(['s.src', 's.thumbnail', 's.categories', 'u.id', 'u.name AS name',  'u.avatar', 'world_message'])
        //     ->join('users AS u', 's.user_id', '=', 'u.id')
        //     ->where('s.id', $id)
        //     ->first();
        return DB::table('stories AS s')
            ->select([
                's.src',
                's.thumbnail',
                's.categories',
                'u.id',
                'u.name AS name',
                'u.username',
                'u.cover_photo',
                'u.avatar',
                'u.story',
                'u.visibility',
                'u.world_message',
            ])
            ->join('users AS u', 's.user_id', '=', 'u.id')
            ->where('s.id', $id)
            ->first();
    }

    public function getPaginatedStories(int $page = 1, int $perPage = 12, bool $onlyPublished = true, string $search = null, string $category = null, int $statusId = null, string $publishType = null)
    {
        $query = Story::with('user:id,name,avatar,world_message')
            ->orderBy('created_at', 'desc');

        if ($onlyPublished) {
            $query->where('story_status_id', 2);
        }
        
        // Apply status filter if provided
        if ($statusId !== null) {
            $query->where('story_status_id', $statusId);
        }
        
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($category) {
            $query->where('categories', 'like', "%{$category}%");
        }

        if ($publishType) {
            $query->where('publish_type', $publishType);
        }
        $stories = $query->paginate($perPage, ['*'], 'page', $page);

        $formattedStories = $this->getFormattedStories($stories->getCollection());

        $stories->setCollection($formattedStories);

        return $stories;
    }
    public function getPaginatedStoriesByCategory(string $category, int $page = 1, int $perPage = 12)
    {

        $query = Story::with('user:id,name,avatar,world_message','comments')
            ->withCount('likes')
            ->where('categories', 'like', "%$category%")
            ->where('story_status_id', 2)
            ->orderBy('created_at', 'desc');

        $stories = $query->paginate($perPage, ['*'], 'page', $page);

        $formattedStories = $this->getFormattedStories($stories->getCollection());

        $stories->setCollection($formattedStories);

        return $stories;
    }

    public function updateStory(int $id, array $data): bool
    {
        $story = Story::find($id);
        if (!$story) {
            return false;
        }

        if (isset($data['name'])) {
            $story->name = $data['name'];
        }

        if (isset($data['categories']) && is_array($data['categories'])) {
            $story->categories = $data['categories'];
        }

        if (isset($data['story_status_id'])) {
            $story->story_status_id = $data['story_status_id'];
        }

        return $story->save();
    }

    public function updateStoryStatus(int $status_id, int $story_id)
    {
        $story = Story::find($story_id);
        $story->story_status_id = $status_id;
        $story->save();

        return ['success' => 'Story status has been updated'];
    }

    public function getAllCategories(bool $onlyPublished = true): array
    {
        $query = Story::select('categories')->whereNotNull('categories');

        if ($onlyPublished) {
            $query->where('story_status_id', 2);
        }

        return $query->get()
            ->pluck('categories')
            ->map(function ($item) {
                return is_array($item) ? $item : json_decode($item, true);
            })
            ->flatten()
            ->unique()
            ->values()
            ->toArray();
    }
    public function getAllCommentsForStory($story_id): array
    {
        $query = Comment::with(['user','replies','story'])->where('story_id',$story_id);
        return $query->orderBy('created_at','DESC')->get()
            ->toArray();
    }

    private function countGifts(int $userId): int
    {
        return GiftTransaction::where('recipient_id', $userId)->count();
    }
    public function like($request)
    {

        if($request->type == 'like'){
            return $this->likeStory($request);
        } else {
            return $this->unlikeStory($request);
        }
    }
    public function likeStory($request){
        StoryLike::create([
            'story_id' => $request->story_id,
            'liked_by' => Auth::user()->id
        ]);
    }
    public function unlikeStory($request){
        StoryLike::where('story_id', $request->story_id)->where('liked_by',Auth::user()->id)->delete();
    }
    public function shareStoy($request){
        $story = Story::find($request->story_id);
        return $story->increment('total_share');
    }
    public function deleteStory($id){
        $story = Story::find($id);
        return $story->delete();
    }

    public function voting($request)
    {
        
        $userVoteCount = StoryVoting::where('voter_id', Auth::id())
            ->where(function ($q) {
                $q->where('best_edit', 1)
                ->orWhere('best_content', 1);
            })
            ->count();
        if($userVoteCount < 2){
            if($request->type == 'best_edit'){
                return $this->votingForBestEdit($request);
            } else {
                return $this->votingForBestContent($request);
            }
        }
        return false;
    }
    public function votingForBestEdit($request){
        $userVotedBestEdit = StoryVoting::where(['voter_id'=>Auth::user()->id,'best_edit'=>1])->first();
        if(!$userVotedBestEdit){
            StoryVoting::create([
                'story_id' => $request->story_id,
                'voter_id' => Auth::user()->id,
                'best_edit' => 1,
                'status' => 1
            ]);
            
            return true;
        }
        return false;
    }
    public function votingForBestContent($request){
        $userVotedBestContent = StoryVoting::where(['voter_id'=>Auth::user()->id,'best_content'=>1])->first();
        if(!$userVotedBestContent){
            StoryVoting::create([
                'story_id' => $request->story_id,
                'voter_id' => Auth::user()->id,
                'best_content' => 1,
                'status' => 1
            ]);
            return true;
        }
        return false;
    }
}
