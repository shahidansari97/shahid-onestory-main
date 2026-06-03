<?php

namespace App\Http\Controllers;

use App\Contracts\Services\TermsOfUseServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TermsOfUseController extends Controller
{
    private TermsOfUseServiceInterface $termsOfUseService;
    private array $termsOfUseData;

    public function __construct(TermsOfUseServiceInterface $termsOfUseService)
    {
        $this->termsOfUseService = $termsOfUseService;
        $this->termsOfUseData = $this->termsOfUseService->getTermsOfUseData();
    }

    public function edit()
    {
        return Inertia::render('Dashboard/StaticPage/EditTermsOfUse', [
            'data' => $this->termsOfUseData['content'],
        ]);
    }

    public function update(Request $request)
    {
        $this->termsOfUseService->updateTermsOfUsePage(
            content: [
                'title' => $request->input('title'),
                'content' => $request->input('content'),
            ],
        );

        return redirect()->route('admin.terms-of-use.edit')->with('message', 'Data saved successfully');
    }
}
