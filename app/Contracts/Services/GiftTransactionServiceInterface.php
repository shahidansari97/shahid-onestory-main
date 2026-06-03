<?php

namespace App\Contracts\Services;

interface GiftTransactionServiceInterface
{
    public function send($recipient_id, $gift_id): array;
    public function requires2FA($giftId): bool;
}
