<?php

namespace App\Contracts\Services;

use Illuminate\Support\Collection;

interface DonatePageServiceInterface
{
    public function getDonors(): Collection;
    public function getDonatedFunds();
    public function getDonatePageData(): array;
    public function updateDonatePage($content = null);
}
