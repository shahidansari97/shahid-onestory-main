<?php

namespace App\Contracts\Services;

interface HomepageServiceInterface
{
    public function all(): array;
    public function update(array $hero = null, array $storyBlock = null): void;
    public function updateStoryOrder(array $storyIds): void;
}
