<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Withdrawal extends Model
{
    protected $table = 'withdrawals';
    protected $fillable = [
        'user_id',
        'amount',
        'external_account_type',
        'status',
        'stripe_transaction_id',
        'stripe_account_id',
        'arrival_date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
