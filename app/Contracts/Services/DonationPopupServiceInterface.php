<?php

namespace App\Contracts\Services;

interface DonationPopupServiceInterface
{
    public function getDonationPopupData(): array;

    public function updateDonationPopup($content = null): array;
}
