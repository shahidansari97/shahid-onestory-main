<?php

namespace App\Http\Controllers;

use App\Contracts\Services\PrivacyPolicyServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrivacyPolicyUsController extends Controller
{
    private PrivacyPolicyServiceInterface $policyService;
    private array $privacyPolicyData;

    public function __construct(PrivacyPolicyServiceInterface $policyService)
    {
        $this->policyService = $policyService;
        $this->privacyPolicyData = $this->policyService->getPrivacyPolicyUsData();
    }

    public function edit()
    {
        return Inertia::render('Dashboard/StaticPage/EditPrivacyPolicyUs', [
            'data' => $this->privacyPolicyData['content'],
        ]);
    }

    public function update(Request $request)
    {
        $this->policyService->updatePrivacyPolicyUsPage(
            content: [
                'title' => $request->input('title'),
                'content' => $request->input('content'),
            ],
        );

        return redirect()->route('admin.privacy-policy.us.edit')->with('message', 'Data saved successfully');
    }
}
