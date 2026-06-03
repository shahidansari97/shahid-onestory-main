<?php

namespace App\Models\Voting;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    protected $table = 'questions';

    protected $fillable = [
        'statement',
        'lifetime_ends_in',
    ];

    public function variants(): HasMany
    {
        return $this->hasMany(Variant::class);
    }
}
