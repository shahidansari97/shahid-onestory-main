<?php

namespace App\Contracts\Services;

interface SiteSettingsServiceInterface
{
    public function all(): array;
    public function update(
        $header = null,
        $footer = null,
    ): void;
    public static function getValueFromSiteSettings(array $array): array;
}
