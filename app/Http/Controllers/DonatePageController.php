<?php

namespace App\Http\Controllers;

use App\Contracts\Services\DonatePageServiceInterface;
use App\Models\Voting\Variant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonatePageController extends Controller
{
    private DonatePageServiceInterface $donatePageService;
    private $donatePageData;

    public function __construct(DonatePageServiceInterface $donatePageService)
    {
        $this->donatePageService = $donatePageService;
        $this->donatePageData = $this->donatePageService->getDonatePageData();
    }

    public function index()
    {
        $donatePageData = $this->donatePageData;
        $donatePageData['funds'] = $this->donatePageService->getDonatedFunds();
        $donatePageData['donors'] = $this->donatePageService->getDonors();

        return Inertia::render('Donate/Index', [
            'data' => $donatePageData,
        ]);
    }


    public function edit()
    {
        return Inertia::render('Dashboard/DonatePage/Edit', [
            'data' => $this->donatePageData['content'],
            'variants' => Variant::all()
        ]);
    }

    public function update(Request $request)
    {
        $this->donatePageService->updateDonatePage( content: [
            'title' => $request->title,
            'paragraph' => $request->paragraph,
            'video' => $request->video,
            'target_amount' => $request->target_amount,
            'end_date' => $request->end_date,
            'variant_id' => $request->variant_id,
        ]);

        return redirect()->route('admin.donate-page.edit')->with('message', 'Data saved successfully');
    }
}
