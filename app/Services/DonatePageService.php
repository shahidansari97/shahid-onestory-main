<?php

namespace App\Services;

use App\Contracts\Services\DonatePageServiceInterface;
use App\Models\Commission;
use App\Models\Voting\Variant;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DonatePageService implements DonatePageServiceInterface
{
    public function getDonors(): Collection
    {
        return DB::table('users AS u')
            ->select('u.username')
            ->join('donations AS d', 'u.id', '=', 'd.user_id')
            ->groupBy('u.username')
            ->get();
    }

    public function getDonatedFunds()
    {
        $content = $this->getArrayFromJsonDonatePageData();
        $variant_id = $content['variant_id'] ?? null;

        if ($variant_id) {
            $variant = Variant::find($variant_id);
            if ($variant) {
                return $variant->funds;
            }
        }

        return 0;
    }

    public function getDonatePageData(): array
    {
        $content = $this->getArrayFromJsonDonatePageData();

        if (!empty($content['video'])) {
            $content['video'] = $this->getFullVideoUrl($content['video']);
        }

        return ['content' => $content];
    }

    private function getArrayFromJsonDonatePageData()
    {
        $donatePage = DB::table('donate_page')->where('key', 'content')->first();
        return json_decode($donatePage->value, true);
    }

    private function getFullVideoUrl(string $filename): string
    {
        return Storage::disk('public')->url("videos/$filename");
    }

    public function updateDonatePage($content = null)
    {
        $videoFilename = basename($content['video']);

        DB::table('donate_page')
            ->updateOrInsert(
                ['key' => 'content'],
                ['value' => json_encode([
                    'title' => $content['title'],
                    'paragraph' => $content['paragraph'],
                    'video' => $videoFilename,
                    'target_amount' => $content['target_amount'],
                    'end_date' => $content['end_date'],
                    'variant_id' => $content['variant_id'],
                ])]
            );

        return ['success' => 'Page has been updated.'];
    }
}
