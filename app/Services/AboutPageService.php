<?php

namespace App\Services;

use App\Contracts\Services\AboutPageServiceInterface;
use Illuminate\Support\Facades\DB;

class AboutPageService implements AboutPageServiceInterface
{
    public function getAboutPageData(): array
    {
        $support = DB::table('about_page')->where('key', 'content')->first();
        $content = json_decode($support->value, true);

        return ['content' => $content];
    }

    public function updateAboutPage($content = null): array
    {
        DB::table('about_page')
            ->updateOrInsert(
                ['key' => 'content'],
                ['value' => json_encode($content)]
            );

        return ['success' => 'Page has been updated.'];
    }
}
