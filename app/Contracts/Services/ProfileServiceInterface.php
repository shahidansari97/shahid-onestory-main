<?php

namespace App\Contracts\Services;

interface ProfileServiceInterface
{
    public function storeInLocal($media, $dir): string;
    public function getUserGiftInfo(): array;
}
