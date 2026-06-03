<?php

namespace App\Services;

use App\Contracts\Services\HomepageServiceInterface;
use App\Models\Homepage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class HomepageService implements HomepageServiceInterface
{
    public function all(): array
    {
        return Homepage::all()->toArray();
    }

    public function update($hero = null, $storyBlock = null): void
    {
        if (isset($hero)) {
            DB::table('homepage')->where('key', 'hero')->update(['value' => $hero]);
        }
        if (isset($storyBlock)) {
            DB::table('homepage')->where('key', 'storyBlock')->update(['value' => $storyBlock]);
        }
    }

    public function updateStoryOrder(array $storyIds): void
    {
        $homepage = Homepage::where('key', 'storyBlock')->first();
        if ($homepage) {
            $storyBlock = $homepage->value;
            $storyBlock['storiesOrder'] = $storyIds;
            $homepage->update(['value' => $storyBlock]);
        }
    }

    public function getValueFromHomepage(array $array): array
    {
        $keys = ['hero', 'storyBlock', 'buttons', 'videoBlock', 'purposeBlock', 'createBlock', 'connectBlock'];

        return Arr::only(
            Arr::pluck($array, 'value', 'key'),
            $keys
        );
    }
}
