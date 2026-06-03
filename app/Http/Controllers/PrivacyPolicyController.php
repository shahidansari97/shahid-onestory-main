<?php

namespace App\Http\Controllers;

use App\Contracts\Services\PrivacyPolicyServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrivacyPolicyController extends Controller
{
    private PrivacyPolicyServiceInterface $policyService;
    private array $privacyPolicyData;

    public function __construct(PrivacyPolicyServiceInterface $policyService)
    {
        $this->policyService = $policyService;
        $this->privacyPolicyData = $this->policyService->getPrivacyPolicyData();
    }

    public function edit()
    {
        return Inertia::render('Dashboard/StaticPage/EditPrivacyPolicy', [
            'data' => $this->privacyPolicyData['content'],
        ]);
    }

    public function update(Request $request)
    {
        $this->policyService->updatePrivacyPolicyPage(
            content: [
                'title' => $request->input('title'),
                'content' => $request->input('content'),
            ],
        );

        return redirect()->route('admin.privacy-policy.edit')->with('message', 'Data saved successfully');
    }
}
