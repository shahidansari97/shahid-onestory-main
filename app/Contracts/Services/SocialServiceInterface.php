<?php

namespace App\Contracts\Services;

use App\Models\User;

interface SocialServiceInterface
{
    public function getOrCreateUser($socialUser, $driver): array;
    // public function getOrCreateUser($socialUser, $driver): User;
}
