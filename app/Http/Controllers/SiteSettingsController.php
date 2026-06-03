<?php

namespace App\Http\Controllers;

use App\Contracts\Services\SiteSettingsServiceInterface;
use Inertia\Inertia;

class SiteSettingsController extends Controller
{
    private SiteSettingsServiceInterface $siteSettingsService;
    private array $header;
    private array $footer;

    public function __construct(SiteSettingsServiceInterface $siteSettingsService)
    {
        $this->siteSettingsService = $siteSettingsService;

        $siteSettingsArray = $this->siteSettingsService->getValueFromSiteSettings($this->siteSettingsService->all());

        $this->header = $siteSettingsArray['header'];
        $this->footer = $siteSettingsArray['footer'];
    }

    public function edit()
    {
        $data = [
            'header' => $this->header,
            'footer' => $this->footer,
        ];

        return Inertia::render('SiteSettings', $data);
    }

    public function update()
    {
        $this->siteSettingsService->update(
            header: $this->header,
            footer: $this->footer,
        );

        return redirect('/');
    }
}
