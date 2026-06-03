<?php

namespace App\Contracts\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CameraEventServiceInterface
{
    public function getPaginatedEvents(
        string $search = null,
        string $startDate = null,
        string $endDate = null,
        int $quantity = 10
    ): LengthAwarePaginator;
}
