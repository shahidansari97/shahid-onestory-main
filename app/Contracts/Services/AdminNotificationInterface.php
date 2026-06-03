<?php

namespace App\Contracts\Services;

use App\Models\User;
use Illuminate\Http\Request;

interface AdminNotificationInterface
{
    public function notifyAdmin(User $user, string $action, Request $request): void;
}
