<?php

namespace App\Services;

use App\Contracts\Services\PrivacyPolicyServiceInterface;
use Illuminate\Support\Facades\DB;

class PrivacyPolicyService implements PrivacyPolicyServiceInterface
{
    public function getPrivacyPolicyData(): array
    {
        $privacyPolicy = DB::table('privacy_policy')->where('key', 'content')->first();
        $content = json_decode($privacyPolicy->value, true);

        return ['content' => $content];
    }

    public function updatePrivacyPolicyPage($content = null): array
    {
        DB::table('privacy_policy')
            ->updateOrInsert(
                ['key' => 'content'],
                ['value' => json_encode($content)]
            );

        return ['success' => 'Page has been updated.'];
    }
        public function getPrivacyPolicyUsData(): array
    {
        $privacyPolicy = DB::table('privacy_policy_us')->where('key', 'content')->first();
        $content = json_decode($privacyPolicy->value, true);

        return ['content' => $content];
    }

    public function updatePrivacyPolicyUsPage($content = null): array
    {
        DB::table('privacy_policy_us')
            ->updateOrInsert(
                ['key' => 'content'],
                ['value' => json_encode($content)]
            );

        return ['success' => 'Page has been updated.'];
    }
}
