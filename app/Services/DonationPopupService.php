<?php

namespace App\Services;

use App\Contracts\Services\DonationPopupServiceInterface;
use Illuminate\Support\Facades\DB;

class DonationPopupService implements DonationPopupServiceInterface
{
    public function getDonationPopupData(): array
    {
        $donationPopup = DB::table('donation_popup')->where('key', 'content')->first();

        if (!$donationPopup || !isset($donationPopup->value)) {
            return ['content' => null];
        }

        $content = json_decode($donationPopup->value, true);

        return ['content' => $content];
    }

    public function updateDonationPopup($content = null): array
    {
        DB::table('donation_popup')
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
