<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TopUp extends Model
{
    use HasFactory;

    protected $table = 'top_ups';
    protected $fillable = [
        'user_id',
        'funds',
        'coins',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
