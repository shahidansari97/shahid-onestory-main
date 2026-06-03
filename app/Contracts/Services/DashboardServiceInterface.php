<?php

namespace App\Contracts\Services;

use Illuminate\Http\Request;

interface DashboardServiceInterface
{
    public function getSiteSettings(): array;
    public function updateMode(string $mode): void;
}
