<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WrittenMessageComment extends Model
{
    protected $table = 'written_message_comments';

    protected $fillable = [
        'written_message_id',
        'parent_id',
        'user_id',
        'comment',
    ];

    public function writtenMessage(): BelongsTo
    {
        return $this->belongsTo(WrittenMessage::class, 'written_message_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }
}

