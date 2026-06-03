<?php

namespace App\Notifications;

use App\Models\GiftTransactionLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FraudAlertNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private GiftTransactionLog $giftTransactionLog)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Fraudulent Transaction Detected')
            ->line('A potentially fraudulent transaction has been flagged.')
            ->line('Transaction ID: ' . $this->giftTransactionLog->id)
            ->line('Gift ID: ' . $this->giftTransactionLog->gift_id)
            ->line('IP Address: ' . $this->giftTransactionLog->ip_address)
            ->line('Sender ID: ' . $this->giftTransactionLog->sender_id)
            ->line('Recipient ID: ' . $this->giftTransactionLog->recipient_id)
            ->action('Review Transaction', url('/admin/transactions/gift-transactions'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            "transaction_id" => $this->giftTransactionLog->id,
            "gift_id" => $this->giftTransactionLog->gift_id,
            "ip_address" => $this->giftTransactionLog->ip_address,
            "sender_id" => $this->giftTransactionLog->sender_id,
            "recipient_id" => $this->giftTransactionLog->recipient_id,
        ];
    }
}
