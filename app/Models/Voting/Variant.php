<?php

namespace App\Models\Voting;

use App\Models\Donation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Variant extends Model
{
    use HasFactory;

    protected $table = 'variants';

    protected $fillable = [
        'question_id',
        'statement',
        'funds',
        'target',
    ];

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class, 'variant_id', 'id');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($variant) {
            $variant->answers()->delete();
        });
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id', 'id');
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class, 'variant_id', 'id');
    }
}
