<?php

namespace App\Services;

use App\Contracts\Services\TermsOfUseServiceInterface;
use Illuminate\Support\Facades\DB;

class TermsOfUseService implements TermsOfUseServiceInterface
{
    public function getTermsOfUseData(): array
    {
        $termsOfUse = DB::table('terms_of_use')->where('key', 'content')->first();
        $content = json_decode($termsOfUse->value, true);

        return ['content' => $content];
    }

    public function updateTermsOfUsePage($content = null): array
    {
        DB::table('terms_of_use')
            ->updateOrInsert(
                ['key' => 'content'],
                ['value' => json_encode($content)]
            );

        return ['success' => 'Page has been updated.'];
    }
}
