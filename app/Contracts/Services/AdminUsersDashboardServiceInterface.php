<?php

namespace App\Contracts\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\User;

interface AdminUsersDashboardServiceInterface
{
    public function getPaginatedUsers(string $search = null, string $sort = 'asc', int $quantity = 15, string $filter = 'all'): LengthAwarePaginator;
    public function getUserById(int $id): ?User;
    public function deleteUser(int $id): JsonResponse;
    public function updateUser(int $id, array $data): bool;
    public function updateUserStatus(int $id, int $activeStatus): bool;
    public function updateCreatorStatus(int $id, int $creatorStatus): bool;
    public function getUserCounts(): array;
}
