<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoRewardTransaction extends Model
{
    use HasFactory;

    protected $table = 'video_reward_transactions';

    protected $fillable = [
        'user_id',
        'amount',
        'type',
        'status',
        'remark',
    ];

    /**
     * Relationship: Transaction belongs to a User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
