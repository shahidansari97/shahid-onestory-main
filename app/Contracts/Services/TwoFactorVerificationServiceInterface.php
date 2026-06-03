<?php

namespace App\Contracts\Services;

interface TwoFactorVerificationServiceInterface
{
    public function sendVerificationCode(): array;

    public function deleteLastGiftTransactionLog($ip): array;

    public function verifyCode($code): array;
}
