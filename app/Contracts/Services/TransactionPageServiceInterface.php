<?php

namespace App\Contracts\Services;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface TransactionPageServiceInterface
{
    public function getSentGiftTransactions(int $userId, array $options): Collection;
    public function getReceivedGiftTransactions(int $userId, array $options): Collection;
    public function getUserDonations(int $userId, array $options): Collection;
    public function getUserTopUps(int $userId, array $options): Collection;
    public function getUserWithdrawals(int $userId, array $options = null): Collection;
    public function getPaginatedTransactions(int $page = 1, int $perPage = 15): LengthAwarePaginator;
    public function getPaginatedDonations(int $page = 1, int $perPage = 15): LengthAwarePaginator;
    public function getPaginatedTopUps(int $page = 1, int $perPage = 15): LengthAwarePaginator;
    public function getPaginatedWithdrawals(int $page = 1, int $perPage = 15): LengthAwarePaginator;
    public function updatePercents(int $founder_percent, int $donation_percent, int $coins_to_money_divider): array;
    public function getUserPaypalWithdrawals(int $userId, array $options = null): Collection;

}
