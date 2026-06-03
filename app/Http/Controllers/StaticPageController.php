<?php

namespace App\Http\Controllers;

use App\Contracts\Services\PrivacyPolicyServiceInterface;
use App\Contracts\Services\TermsOfUseServiceInterface;
use App\Contracts\Services\CreatorGuidelinesServiceInterface;
use Inertia\Inertia;

class StaticPageController extends Controller
{
    private array $privacyPolicyData;
    private array $privacyPolicyUsData;
    private array $termsOfUseData;
    private array $creatorGuidelinesData;
    private PrivacyPolicyServiceInterface $policyService;
    private TermsOfUseServiceInterface $termsOfUseService;
    private CreatorGuidelinesServiceInterface $creatorGuidelinesService;

    public function __construct(
        PrivacyPolicyServiceInterface $policyService, 
        TermsOfUseServiceInterface $termsOfUseService,
        CreatorGuidelinesServiceInterface $creatorGuidelinesService
    )
    {
        $this->policyService = $policyService;
        $this->termsOfUseService = $termsOfUseService;
        $this->creatorGuidelinesService = $creatorGuidelinesService;
        $this->privacyPolicyData = $this->policyService->getPrivacyPolicyData();
        $this->privacyPolicyUsData = $this->policyService->getPrivacyPolicyUsData();
        $this->termsOfUseData = $this->termsOfUseService->getTermsOfUseData();
        $this->creatorGuidelinesData = $this->creatorGuidelinesService->getCreatorGuidelinesData();
    }

    public function show($page)
    {
        $privacyPolicyContent = $this->privacyPolicyData['content'];
        $privacyPolicyUsContent = $this->privacyPolicyUsData['content'];
        $termsOfUseContent = $this->termsOfUseData['content'];
        $creatorGuidelinesContent = $this->creatorGuidelinesData['content'];

        $pages = [
            'privacy-eu' => [
                'title' => $privacyPolicyContent['title'],
                'content' => $privacyPolicyContent['content'],
            ],
            'privacy-us' => [
                'title' => $privacyPolicyUsContent['title'],
                'content' => $privacyPolicyUsContent['content'],
            ],
            'terms-of-use' => [
                'title' => $termsOfUseContent['title'],
                'content' => $termsOfUseContent['content'],
            ],
            'creator-guidelines' => [
                'title' => $creatorGuidelinesContent['title'],
                'content' => $creatorGuidelinesContent['content'],
            ]
        ];

        if (!array_key_exists($page, $pages)) {
            abort(404);
        }

        return Inertia::render('StaticPage', [
            'title' => $pages[$page]['title'],
            'content' => $pages[$page]['content'],
        ]);
    }
}
