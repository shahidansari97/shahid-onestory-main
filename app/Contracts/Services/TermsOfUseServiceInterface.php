<?php

namespace App\Contracts\Services;

interface TermsOfUseServiceInterface
{
    public function getTermsOfUseData(): array;

    public function updateTermsOfUsePage($content = null): array;
}
