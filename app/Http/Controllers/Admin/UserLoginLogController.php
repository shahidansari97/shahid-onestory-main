<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Services\UserLoginLogServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserLoginLogController extends Controller
{
    private UserLoginLogServiceInterface $userLoginLogService;

    public function __construct(UserLoginLogServiceInterface $userLoginLogService)
    {
        $this->userLoginLogService = $userLoginLogService;
    }

    public function index(Request $request)
    {
        $search = $request->get('search');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        $logs = $this->userLoginLogService->getPaginatedLogs(
            search: $search,
            startDate: $startDate,
            endDate: $endDate,
            quantity: 10
        );

        return Inertia::render('Dashboard/UserLoginLogs/Index', [
            'logs' => $logs->items(),
            'currentPage' => $logs->currentPage(),
            'lastPage' => $logs->lastPage(),
            'perPage' => $logs->perPage(),
            'totalLogs' => $logs->total(),
            'search' => $search,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }
}
