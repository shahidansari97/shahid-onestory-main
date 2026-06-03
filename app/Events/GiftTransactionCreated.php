<?php

namespace App\Events;

use App\Models\GiftTransactionLog;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GiftTransactionCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public GiftTransactionLog $giftTransactionLog;

    /**
     * Create a new event instance.
     */
    public function __construct(GiftTransactionLog $giftTransactionLog)
    {
        $this->giftTransactionLog = $giftTransactionLog;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
