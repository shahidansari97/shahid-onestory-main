<?php

namespace App\Http\Controllers;

use App\Contracts\Services\AboutPageServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutPageController extends Controller
{
    private AboutPageServiceInterface $aboutPageService;
    private array $aboutPageData;

    public function __construct(AboutPageServiceInterface $aboutPageService)
    {
        $this->aboutPageService = $aboutPageService;
        $this->aboutPageData = $this->aboutPageService->getAboutPageData();
    }

    public function index()
    {
        return Inertia::render('About/Index', [
            'data' => $this->aboutPageData['content'],
        ]);
    }

    public function edit()
    {
        return Inertia::render('Dashboard/About/Edit', [
            'data' => $this->aboutPageData['content'],
        ]);
    }

    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'nullable|string|max:255',
            'paragraphs' => 'nullable|array',
            'paragraphs.*.title' => 'nullable|string|max:255',
            'paragraphs.*.text' => 'nullable|string',
            'paragraphs.*.video' => 'nullable|string',
            'paragraphs.final_paragraph' => 'nullable|string',
        ]);

        $this->aboutPageService->updateAboutPage($validatedData);

        return redirect()->route('admin.about.edit')->with('message', 'Data saved successfully');
    }
}
