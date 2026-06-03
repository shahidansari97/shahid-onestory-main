<?php

namespace App\Services;

use App\Contracts\Services\GiftTransactionServiceInterface;
use App\Mail\GiftSent;
use App\Models\Commission;
use App\Models\Gift;
use App\Models\GiftTransaction;
use App\Models\Percent;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class GiftTransactionService implements GiftTransactionServiceInterface
{
    private User $user;

    public function __construct()
    {
        $this->user = Auth::user();
    }

    public function send($recipient_id, $gift_id): array
    {
        $recipient = User::find($recipient_id);
        $gift = Gift::find($gift_id);
        $commission = Commission::first();

        $percents = Percent::first();

        if (empty($percents->toArray())) {
            return ["error" => "Percent table is empty"];
        }

        $founderPercent = ($percents->founder_percent / 100);
        $donationPercent = ($percents->donation_percent / 100);
        $balanceDivider = $percents->balance_divider;

        $odeliaTax = $gift->cost * $founderPercent; // 7% to Odelia
        $toDonateTax = $gift->cost * $donationPercent; // 3% to Donate
        $afterTax = $gift->cost - $odeliaTax - $toDonateTax;

        if ($this->user->balance < $gift->cost) {
            return ["error" => "Insufficient balance"];
        }

        $this->user->balance -= $gift->cost;
        $this->user->save();

        $recipient->balance += $afterTax;
        $recipient->save();

        if ($odeliaTax > 0) {
            $commission->founder_funds += $odeliaTax / $balanceDivider;
        }

        if ($toDonateTax > 0) {
            $commission->donation_funds += $toDonateTax / $balanceDivider;
        }

        $commission->save();

        GiftTransaction::create([
            'sender_id' => $this->user->id,
            'recipient_id' => $recipient->id,
            'gift_id' => $gift->id,
        ]);

        $recipientSendData = [
            "sender_username" => $this->user->username,
            "sender_chatify_link" => url("chatify/{$this->user->id}"),
            "gift_name" => $gift->name,
            "recipient_email" => $recipient->email,
        ];

        try {
            Mail::to($recipient->email)->send(new GiftSent($recipientSendData));
        } catch (\Exception $e) {
        }

        return ['success' => 'The Gift has been sent'];
    }

    public function requires2FA($giftId): bool
    {
        $gift = Gift::find($giftId);
        return 60 < $gift->cost;
    }

    // TODO() - DELETE IT AFTER CREATING STRIPE PAYMENT
    public function refillBalance($amount): array
    {
        $coins = $amount;

        $this->user->balance += $coins;
        $this->user->save();

        return ['success' => 'Balance has been refilled.'];
    }
}
