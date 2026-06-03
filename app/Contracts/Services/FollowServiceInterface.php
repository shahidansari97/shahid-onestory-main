<?php

namespace App\Contracts\Services;

use App\Models\Follow;

interface FollowServiceInterface
{
    public function followUnFollow($data): array;
}
