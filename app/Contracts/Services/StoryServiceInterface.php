<?php

namespace App\Contracts\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

interface StoryServiceInterface
{
    public function allStories(): Collection;

    public function allStoriesFromUser(): ?Collection;

    public function allAnotherStoriesFromUser($id): ?Collection;

    public function store(int $userId, string $src,string $master_url,string $preview, string $thumbnail, string $name, array $categories, string $publish_type = 'public'): void;

    public function delete(int $id): ?bool;

    public function storeThumbnail(UploadedFile $thumbnail): string;

    public function getStory(int $id): array;

    public function getStoriesByIds(array $storyIds): Collection;

    public function getFirstTwentyStories(): Collection;

    public function getStoriesForEditor(array $storyOrder): array;

    public function getPaginatedStories(int $page = 1, int $perPage = 15, bool $onlyPublished = true, string $search = null, string $category = null, int $statusId = null, string $publishType = null);

    public function updateStoryStatus(int $status_id, int $story_id);

    public function getAllCategories();
}
