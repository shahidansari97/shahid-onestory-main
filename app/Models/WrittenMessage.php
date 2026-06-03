<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WrittenMessage extends Model
{
    protected $table = 'written_messages';

    protected $fillable = [
        'user_id',
        'message',
        'publish_type',
        'status',
        'total_share',
    ];

    protected $casts = [
        'total_share' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(WrittenMessageComment::class, 'written_message_id');
    }
}
