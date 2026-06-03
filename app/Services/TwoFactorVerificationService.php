<?php

namespace App\Services;

use App\Contracts\Services\TwoFactorVerificationServiceInterface;
use App\Models\GiftTransactionLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class TwoFactorVerificationService implements TwoFactorVerificationServiceInterface
{
    private User $user;

    public function __construct()
    {
        $this->user = Auth::user();
    }

    private function generateTwoFactorVerificationCode(): int
    {
        $code = rand(100000, 999999);

        $this->user->two_factor_secret = $code;
        $this->user->save();

        return $code;
    }

    public function sendVerificationCode(): array
    {
        $code = $this->generateTwoFactorVerificationCode();
        $subject = "Verification code";

        try {
            Mail::raw("Code: $code", function ($mail) use ($subject) {
                $mail
                    ->to($this->user->email)
                    ->subject($subject);
            });

            return ["success" => "Email sent successfully"];
        } catch (\Exception $e) {
            return ["error" => "Failed to send email: " . $e->getMessage()];
        }
    }

    public function deleteLastGiftTransactionLog($ip): array
    {
        try {
            GiftTransactionLog::where('ip_address', "172.23.0.1")
                ->where('created_at', '>=', now()->subHour())
                ->orderBy('created_at', 'desc')
                ->first()->delete();

            return ["success" => "Last gift sending log has been deleted"];
        } catch (\Exception $e) {
            return ["error" => $e->getMessage()];
        }
    }

    public function verifyCode($code): array
    {
        if (is_null($this->user->two_factor_secret)) {
            return ["error" => "Two factor verification code doesn't exist"];
        }

        if ($this->user->two_factor_secret !== $code) {
            return ["error" => "Invalid verification code"];
        }

        $this->user->two_factor_secret = null;
        $this->user->save();

        return ["success" => "Verification completed"];
    }
}
