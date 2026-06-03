<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Services\CameraEventServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CameraEventController extends Controller
{
    private CameraEventServiceInterface $cameraEventService;

    public function __construct(CameraEventServiceInterface $cameraEventService)
    {
        $this->cameraEventService = $cameraEventService;
    }

    public function index(Request $request)
    {
        $search = trim((string) $request->get('search', ''));
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        $events = $this->cameraEventService->getPaginatedEvents(
            search: $search,
            startDate: $startDate,
            endDate: $endDate,
            quantity: 10
        );

        return Inertia::render('Dashboard/CameraEvents/Index', [
            'events' => $events->items(),
            'currentPage' => $events->currentPage(),
            'lastPage' => $events->lastPage(),
            'perPage' => $events->perPage(),
            'totalEvents' => $events->total(),
            'search' => $search,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }
}
