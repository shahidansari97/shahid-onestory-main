<?php

namespace App\Http\Controllers;

use App\Contracts\Services\DashboardServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private DashboardServiceInterface $dashboardService;

    public function __construct(DashboardServiceInterface $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index()
    {
        $settings = $this->dashboardService->getSiteSettings();

        return Inertia::render('Dashboard/Index', [
            'siteSettings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mode' => 'required|in:voting,donation',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $mode = $request->input('mode');
        $this->dashboardService->updateMode($mode);

        return redirect()->route('admin.dashboard')->with('message', 'Налаштування оновлено успішно.');
    }
}
