<?php

namespace App\Http\Controllers;

use App\Contracts\Services\StoryServiceInterface;
use Illuminate\Http\Request;

class StoryStatusController extends Controller
{
    private StoryServiceInterface $storyService;

    public function __construct(StoryServiceInterface $storyService)
    {
        $this->storyService = $storyService;
    }

    public function update(Request $request)
    {
        $request->validate([
            'story_id' => 'required|exists:stories,id',
            'story_status_id' => 'required|exists:story_statuses,id',
        ]);

        return response()->json($this->storyService->updateStoryStatus(
            status_id: $request->story_status_id,
            story_id: $request->story_id
        ));
    }
}
