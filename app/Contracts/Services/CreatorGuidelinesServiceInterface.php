<?php

namespace App\Contracts\Services;

interface CreatorGuidelinesServiceInterface
{
    public function getCreatorGuidelinesData(): array;

    public function updateCreatorGuidelinesPage($content = null): array;
}
