<?php

namespace App\Services;

use App\Contracts\Services\CreatorGuidelinesServiceInterface;
use Illuminate\Support\Facades\DB;

class CreatorGuidelinesService implements CreatorGuidelinesServiceInterface
{
    public function getCreatorGuidelinesData(): array
    {
        $creatorGuidelines = DB::table('creator_guidelines')->where('key', 'content')->first();
        
        if (!$creatorGuidelines) {
            return ['content' => ['title' => '', 'content' => '']];
        }
        
        $content = json_decode($creatorGuidelines->value, true);

        return ['content' => $content ?? ['title' => '', 'content' => '']];
    }

    public function updateCreatorGuidelinesPage($content = null): array
    {
        DB::table('creator_guidelines')
            ->updateOrInsert(
                ['key' => 'content'],
                ['value' => json_encode($content)]
            );

        return ['success' => 'Page has been updated.'];
    }
}
