<?php

namespace App\Listeners;

use App\Events\GiftTransactionCreated;
use App\Models\GiftTransactionLog;
class FraudDetectionListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(GiftTransactionCreated $event): void
    {
        $transaction = $event->giftTransactionLog;

        $recentTransactions = GiftTransactionLog::where('ip_address', $transaction->ip_address)
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($recentTransactions >= 5) {
            $transaction->update(['status' => 'flagged']);
            $transaction->save();
        }
    }
}
