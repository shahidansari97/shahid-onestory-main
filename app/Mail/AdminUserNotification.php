<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminUserNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $action,
        public ?string $ipAddress = null,
        public ?string $userAgent = null
    ) {
    }

    public function envelope(): Envelope
    {
        $subject = 'New User Registration';

        if ($this->action === 'creator_registered') {
            $subject = 'New Creator Registration';
        } elseif ($this->action === 'creator_upgraded') {
            $subject = 'User Upgraded to Creator';
        }

        return new Envelope(
            subject: $subject,
        );
    }

    public function content(): Content
    {
        $view = 'mail.admin-user-notification';

        if ($this->action === 'creator_upgraded') {
            $view = 'mail.admin-user-creator-upgraded';
        }

        return new Content(
            view: $view,
            with: [
                'user' => $this->user,
                'action' => $this->action,
                'ipAddress' => $this->ipAddress,
                'userAgent' => $this->userAgent,
                'url'   => config('app.url') ?: config('app.url'),
                'support_email'   => config('app.support_email') ?: config('app.support_email'),
                'your_email'   => config('app.your_email') ?: config('app.your_email'),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
