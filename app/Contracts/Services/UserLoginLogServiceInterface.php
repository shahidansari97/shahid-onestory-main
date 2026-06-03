<?php

namespace App\Contracts\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserLoginLogServiceInterface
{
    public function getPaginatedLogs(
        string $search = null,
        string $startDate = null,
        string $endDate = null,
        int $quantity = 10
    ): LengthAwarePaginator;
}
