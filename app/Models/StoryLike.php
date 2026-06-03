<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoryLike extends Model
{
    use HasFactory;
    protected $table = 'story_likes';
    protected $fillable = [
        'story_id',
        'liked_by'
    ];
}
