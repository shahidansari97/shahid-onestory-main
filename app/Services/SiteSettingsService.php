<?php

namespace App\Services;

use App\Contracts\Services\SiteSettingsServiceInterface;
use App\Models\SiteSettings;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class SiteSettingsService implements SiteSettingsServiceInterface
{
    public function all(): array
    {
        return SiteSettings::all()->toArray();
    }

    public function update(
        $header = null,
        $footer = null,
    ): void
    {
        if (isset($header)) {
            DB::table('site_settings')
                ->where('key', 'header')
                ->update(['value' => $header]);
        }
        if (isset($footer)) {
            DB::table('site_settings')
                ->where('key', 'footer')
                ->update(['value' => $footer]);
        }
    }

    public static function getValueFromSiteSettings(array $array): array
    {
        $keys = ['header', 'footer', 'shareBlock'];

        return Arr::only(
            Arr::pluck($array, 'value', 'key'),
            $keys
        );
    }
}
