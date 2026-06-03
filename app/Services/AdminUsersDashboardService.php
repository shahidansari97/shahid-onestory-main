<?php

namespace App\Services;

use App\Contracts\Services\AdminUsersDashboardServiceInterface;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Carbon\CarbonImmutable;
use Carbon\Carbon;

class AdminUsersDashboardService implements AdminUsersDashboardServiceInterface
{
    private function getTodayUtcRange(): array
    {
        $appTimezone = config('app.timezone', 'UTC');
        $startOfDayUtc = CarbonImmutable::now($appTimezone)->startOfDay()->setTimezone('UTC');
        $endOfDayUtc = CarbonImmutable::now($appTimezone)->endOfDay()->setTimezone('UTC');

        return [$startOfDayUtc, $endOfDayUtc];
    }

    public function getPaginatedUsers(string $search = null, string $sort = 'asc', int $quantity = 15, string $filter = 'all'): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = User::query()->select('id', 'username', 'email', 'avatar', 'created_at', 'is_creator', 'active_status', 'creator_status');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        }

        // Apply filter based on user type
        if ($filter === 'normal') {
            $query->where('is_creator', 0);
        } elseif ($filter === 'creator') {
            $query->where('is_creator', 1);
        } elseif ($filter === 'today') {
            $query->whereDate('created_at', today());


            // [$startOfDayUtc, $endOfDayUtc] = $this->getTodayUtcRange();
            // $query->whereBetween('created_at', [$startOfDayUtc, $endOfDayUtc]);
        }
        // 'all' filter shows all users, no additional where clause needed

        return $query->orderBy('created_at', $sort)->paginate($quantity);
    }

    public function getUserCounts(): array
    {
        $totalUsers = User::count();
        $normalUsers = User::where('is_creator', 0)->count();
        $creatorUsers = User::where('is_creator', 1)->count();
        $appTimezone = config('app.timezone', 'UTC');
        // $todaySignups = User::whereNotNull('created_at')
        //     ->get(['created_at'])
        //     ->filter(function ($user) use ($appTimezone) {
        //         return $user->created_at?->copy()->setTimezone($appTimezone)->isToday();
        //     })
        //     ->count();
        $todaySignups = User::whereDate('created_at', today())->count();

        return [
            'total' => $totalUsers,
            'normal' => $normalUsers,
            'creator' => $creatorUsers,
            'today' => $todaySignups,
        ];
    }

    public function getUserById(int $id): ?User
    {
        return User::with([
            'stories' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'giftTransactionsSent' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'giftTransactionsSent.gift' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'giftTransactionsSent.recipient' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'giftTransactionsReceived' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'giftTransactionsReceived.gift' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'giftTransactionsReceived.sender' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'topUps' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'withdrawals' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'donations' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'donations.variant' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'answers' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'answers.variant' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'answers.variant.question' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
        ])->find($id);
    }


    public function deleteUser(int $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Invalid user identification'], 404);
        }

        $user->delete();

        return response()->json(['success' => 'User has been removed'], 200);
    }

    public function updateUser(int $id, array $data): bool
    {
        $user = User::find($id);

        if (!$user) {
            return false;
        }

        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        return $user->save();
    }

    public function updateUserStatus(int $id, int $activeStatus): bool
    {
        $user = User::find($id);

        if (!$user) {
            return false;
        }

        $user->active_status = $activeStatus;
        return $user->save();
    }

    public function updateCreatorStatus(int $id, int $creatorStatus): bool
    {
        $user = User::find($id);

        if (!$user) {
            return false;
        }

        $user->creator_status = $creatorStatus;
        return $user->save();
    }
}
