<?php

namespace App\Services;

use App\Contracts\Services\PollPopupServiceInterface;
use Illuminate\Support\Facades\DB;

class PollPopupService implements PollPopupServiceInterface
{
    public function getPollPopupData(): array
    {
        $pollPopup = DB::table('poll_popup')->where('key', 'content')->first();

        if (!$pollPopup || !isset($pollPopup->value)) {
            return ['content' => null];
        }

        $content = json_decode($pollPopup->value, true);

        return ['content' => $content];
    }

    public function updatePollPopup($content = null): array
    {
        DB::table('poll_popup')
            ->updateOrInsert(
                ['key' => 'content'],
                ['value' => json_encode([
                    'title' => $content['title'],
                    'content' => $content['content'],
                    'src' => $content['src'],
                ])]
            );

        return ['success' => 'Page has been updated.'];
    }
}
