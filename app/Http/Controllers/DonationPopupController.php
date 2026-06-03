<?php

namespace App\Http\Controllers;

use App\Contracts\Services\DonationPopupServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonationPopupController extends Controller
{
    private DonationPopupServiceInterface $donationPopupService;
    private array $donationPopupData;

    public function __construct(DonationPopupServiceInterface $donationPopupService)
    {
        $this->donationPopupService = $donationPopupService;
        $this->donationPopupData = $this->donationPopupService->getDonationPopupData();
    }

    public function edit()
    {
        return Inertia::render('Dashboard/Popup/DonationPopupEdit', [
            'data' => $this->donationPopupData['content'],
        ]);
    }

    public function update(Request $request)
    {
        $this->donationPopupService->updateDonationPopup(content: [
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'src' => $request->input('src'),
        ]);

        return redirect()->route('admin.donation-popup.edit')->with('message', 'Data saved successfully');
    }
}
