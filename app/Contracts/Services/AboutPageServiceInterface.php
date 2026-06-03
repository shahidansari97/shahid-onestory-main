<?php

namespace App\Contracts\Services;

interface AboutPageServiceInterface
{
    public function getAboutPageData(): array;
    public function updateAboutPage($content = null): array;
}
