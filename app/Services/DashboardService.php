<?php


namespace App\Services;

use App\Contracts\Services\DashboardServiceInterface;
use App\Models\SiteSettings;

class DashboardService implements DashboardServiceInterface
{
    public function getSiteSettings(): array
    {
        return SiteSettings::all()->keyBy('key')->map->value->toArray();
    }

    public function updateMode(string $mode): void
    {
        if ($mode === 'voting') {
            SiteSettings::updateOrCreate(['key' => 'voting_page_enabled'], ['value' => json_encode(true)]);
            SiteSettings::updateOrCreate(['key' => 'voting_popup_enabled'], ['value' => json_encode(true)]);
            SiteSettings::updateOrCreate(['key' => 'donation_page_enabled'], ['value' => json_encode(false)]);
            SiteSettings::updateOrCreate(['key' => 'donation_popup_enabled'], ['value' => json_encode(false)]);
        } elseif ($mode === 'donation') {
            SiteSettings::updateOrCreate(['key' => 'donation_page_enabled'], ['value' => json_encode(true)]);
            SiteSettings::updateOrCreate(['key' => 'donation_popup_enabled'], ['value' => json_encode(true)]);
            SiteSettings::updateOrCreate(['key' => 'voting_page_enabled'], ['value' => json_encode(false)]);
            SiteSettings::updateOrCreate(['key' => 'voting_popup_enabled'], ['value' => json_encode(false)]);
        }
    }
}
