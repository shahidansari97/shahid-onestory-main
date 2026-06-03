<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SpokenStoryRecording extends Model
{
    protected $table = 'spoken_story_recordings';

    protected $fillable = [
        'user_id',
        'path',
        'duration',
        'publish_type',
        'message',
        'status',
        'total_share',
    ];

    protected $casts = [
        'duration' => 'float',
        'status' => 'integer',
        'total_share' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(SpokenStoryComment::class, 'spoken_story_recording_id');
    }

    public function getUrlAttribute()
    {
        if (!$this->path) {
            return null;
        }

        return asset($this->path);
    }
}

