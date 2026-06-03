<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CoinPurchaseMail extends Mailable
{
    use Queueable, SerializesModels;
    public $userName;
    public $coins;
    public $amount;
    public $date;
    /**
     * Create a new message instance.
     */
    public function __construct($userName, $coins, $amount, $date)
    {
        $this->userName = $userName;
        $this->coins = $coins;
        $this->amount = $amount;
        $this->date = $date;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Purchased Coins Receipt',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.coin-purchase',
            with: [
                'userName' => $this->userName,
                'coins' => $this->coins,
                'amount' => $this->amount,
                'date' => $this->date,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
