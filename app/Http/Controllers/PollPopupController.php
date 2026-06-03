<?php

namespace App\Http\Controllers;

use App\Contracts\Services\PollPopupServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PollPopupController extends Controller
{
    private PollPopupServiceInterface $pollPopupService;
    private array $pollPopupData;

    public function __construct(PollPopupServiceInterface $pollPopupService)
    {
        $this->pollPopupService = $pollPopupService;
        $this->pollPopupData = $this->pollPopupService->getPollPopupData();
    }

    public function edit()
    {
        return Inertia::render('Dashboard/Popup/PollPopupEdit', [
            'data' => $this->pollPopupData['content'],
        ]);
    }

    public function update(Request $request)
    {
        $this->pollPopupService->updatePollPopup(content: [
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'src' => $request->input('src'),
        ]);

        return redirect()->route('admin.poll-popup.edit')->with('message', 'Data saved successfully');
    }
}
