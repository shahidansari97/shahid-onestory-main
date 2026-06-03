<?php

namespace App\Contracts\Services;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ConnectWithUsServiceInterface
{
    public function getStructuredContent(): array;
    public function getRecipientEmail(): string;
    public function updateContent(array $validatedData): void;
}
