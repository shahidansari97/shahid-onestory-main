<?php

namespace App\Services;

use App\Contracts\Services\UserLoginLogServiceInterface;
use App\Models\UserLoginLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserLoginLogService implements UserLoginLogServiceInterface
{
    public function getPaginatedLogs(
        string $search = null,
        string $startDate = null,
        string $endDate = null,
        int $quantity = 10
    ): LengthAwarePaginator {
        $logsQuery = UserLoginLog::query()
            ->with('user')
            ->orderByDesc('login_at');

        if ($search) {
            $searchTerm = "%{$search}%";

            $logsQuery->where(function ($query) use ($searchTerm) {
                $query->where('ip_address', 'like', $searchTerm)
                    ->orWhere('user_agent', 'like', $searchTerm)
                    ->orWhere('status', 'like', $searchTerm)
                    ->orWhereHas('user', function ($userQuery) use ($searchTerm) {
                        $userQuery->where('username', 'like', $searchTerm)
                            ->orWhere('email', 'like', $searchTerm);
                    });
            });
        }

        if ($startDate) {
            $logsQuery->whereDate('login_at', '>=', $startDate);
        }

        if ($endDate) {
            $logsQuery->whereDate('login_at', '<=', $endDate);
        }

        return $logsQuery->paginate($quantity)->appends([
            'search' => $search,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
    }
}
