<?php

namespace App\Services;

use App\Contracts\Services\AdminNotificationInterface;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminUserNotification;

class AdminNotificationService implements AdminNotificationInterface
{
    public function notifyAdmin(User $user, string $action, Request $request): void
    {
        $adminEmail = config('mail.admin_address') ?: config('mail.from.address');
        if (!$adminEmail) {
            return;
        }

        Mail::to($user->email)->send(
            new AdminUserNotification(
                $user,
                $action,
                $request->ip(),
                $request->userAgent()
            )
        );
    }
}