<?php

namespace App\Contracts\Services;

interface SupportServiceInterface
{
    public function all(): array;
    public function getImages(): array;
    public function updateSupportPage(
        $content = null,
        $images = null
    ): array;
    public function deleteImage($id): array;
    public function getSupportData(): array;
}
