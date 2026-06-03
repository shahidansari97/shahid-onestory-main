<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoryView extends Model
{
    protected $fillable = [
        'user_id',
        'story_id',
        'ip_address',
    ];
}
