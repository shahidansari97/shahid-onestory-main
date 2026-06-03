<?php

namespace App\Services;

use App\Contracts\Services\CameraEventServiceInterface;
use App\Models\CameraEvent;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CameraEventService implements CameraEventServiceInterface
{
    public function getPaginatedEvents(
        string $search = null,
        string $startDate = null,
        string $endDate = null,
        int $quantity = 10
    ): LengthAwarePaginator {
        $eventsQuery = CameraEvent::query()
            ->with('user:id,username,email')
            ->orderByDesc('createdAt');

        if ($search) {
            $searchTerm = "%{$search}%";

            $eventsQuery->where(function ($query) use ($searchTerm) {
                $query->where('userId', 'like', $searchTerm)
                    ->orWhere('name', 'like', $searchTerm)
                    ->orWhere('email', 'like', $searchTerm)
                    ->orWhere('eventType', 'like', $searchTerm)
                    ->orWhere('themeTitle', 'like', $searchTerm)
                    ->orWhereHas('user', function ($userQuery) use ($searchTerm) {
                        $userQuery->where('username', 'like', $searchTerm)
                            ->orWhere('email', 'like', $searchTerm);
                    });
            });
        }

        if ($startDate) {
            $eventsQuery->whereDate('createdAt', '>=', $startDate);
        }

        if ($endDate) {
            $eventsQuery->whereDate('createdAt', '<=', $endDate);
        }

        return $eventsQuery->paginate($quantity)->appends([
            'search' => $search,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
    }
}
