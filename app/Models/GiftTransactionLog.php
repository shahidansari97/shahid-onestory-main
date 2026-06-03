<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GiftTransactionLog extends Model
{
    protected $table = "gift_transaction_logs";
    protected $fillable = [
        "sender_id",
        "recipient_id",
        "gift_id",
        "ip_address",
        "status",
    ];
}
