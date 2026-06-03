<?php

namespace App\Http\Controllers;

use App\Contracts\Services\CreatorGuidelinesServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreatorGuidelinesController extends Controller
{
    private CreatorGuidelinesServiceInterface $guidelinesService;
    private array $creatorGuidelinesData;

    public function __construct(CreatorGuidelinesServiceInterface $guidelinesService)
    {
        $this->guidelinesService = $guidelinesService;
        $this->creatorGuidelinesData = $this->guidelinesService->getCreatorGuidelinesData();
    }

    public function edit()
    {
        return Inertia::render('Dashboard/EditCreatorGuidelines', [
            'data' => $this->creatorGuidelinesData['content'],
        ]);
    }

    public function update(Request $request)
    {
        $this->guidelinesService->updateCreatorGuidelinesPage(
            content: [
                'title' => $request->input('title'),
                'content' => $request->input('content'),
            ],
        );

        return redirect()->route('admin.creator-guidelines.edit')->with('message', 'Data saved successfully');
    }
}
