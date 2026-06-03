<?php

namespace App\Contracts\Services;

interface PollPopupServiceInterface
{
    public function getPollPopupData(): array;

    public function updatePollPopup($content = null): array;
}
