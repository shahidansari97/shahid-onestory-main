<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoryVoting extends Model
{
    use HasFactory;
    protected $table = 'stories_voting';
    protected $fillable = [
        'story_id',
        'voter_id',
        'best_edit', 
        'best_content',
        'status'
    ];
}
