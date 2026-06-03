<?php

namespace App\Console\Commands;

use App\Models\Homepage;
use App\Models\Story;
use Illuminate\Console\Command;

class CheckStoryOrder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'story:check-order';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check the current admin-set story order for homepage carousel';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $homepage = Homepage::where('key', 'storyBlock')->first();
        
        if (!$homepage) {
            $this->error('StoryBlock configuration not found in homepage table!');
            return 1;
        }

        $storyOrder = $homepage->value['storiesOrder'] ?? [];
        
        if (empty($storyOrder)) {
            $this->warn('No story order is currently set in admin panel.');
            $this->info('Stories will be displayed in default order (created_at DESC)');
            return 0;
        }

        $this->info('=== Current Admin Story Order ===');
        $this->info('Total stories in order: ' . count($storyOrder));
        $this->newLine();

        // Get story details
        $stories = Story::whereIn('id', $storyOrder)
            ->where('story_status_id', 2) // Only approved stories
            ->get()
            ->keyBy('id');

        $this->table(
            ['Position', 'Story ID', 'Story Name', 'Status', 'Has Master URL', 'Created At'],
            collect($storyOrder)->map(function ($storyId, $index) use ($stories) {
                $story = $stories->get($storyId);
                
                return [
                    $index + 1,
                    $storyId,
                    $story ? ($story->name ?? 'N/A') : '⚠️ NOT FOUND',
                    $story ? ($story->story_status_id == 2 ? '✅ Approved' : '❌ Not Approved') : '❌ Missing',
                    $story ? ($story->master_url ? '✅ Yes' : '❌ No') : 'N/A',
                    $story ? $story->created_at->format('Y-m-d H:i:s') : 'N/A',
                ];
            })->toArray()
        );

        // Show which stories won't be displayed
        $missingStories = collect($storyOrder)->filter(function ($id) use ($stories) {
            $story = $stories->get($id);
            return !$story || $story->story_status_id != 2 || !$story->master_url;
        });

        if ($missingStories->isNotEmpty()) {
            $this->newLine();
            $this->warn('⚠️  The following story IDs in order will NOT be displayed:');
            $this->warn('   (They are either missing, not approved, or have no master_url)');
            $this->line('   ' . $missingStories->implode(', '));
        }

        // Show which stories will actually be displayed (first 20)
        $displayableStories = collect($storyOrder)->filter(function ($id) use ($stories) {
            $story = $stories->get($id);
            return $story && $story->story_status_id == 2 && $story->master_url;
        })->take(20);

        $this->newLine();
        $this->info('✅ Stories that WILL be displayed on homepage (first 20):');
        $this->line('   ' . $displayableStories->implode(', '));

        return 0;
    }
}
