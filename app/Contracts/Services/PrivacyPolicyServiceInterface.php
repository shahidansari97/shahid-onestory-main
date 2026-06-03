<?php

namespace App\Contracts\Services;

interface PrivacyPolicyServiceInterface
{
    public function getPrivacyPolicyData(): array;

    public function updatePrivacyPolicyPage($content = null): array;
}
