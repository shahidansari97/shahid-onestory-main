<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayPalWithdrawal extends Model
{
    protected $fillable = [
        'user_id',
        'payout_batch_id',
        'batch_status',
        'amount',
        'wallet_amount',
    ];
}
