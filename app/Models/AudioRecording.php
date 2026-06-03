<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class AudioRecording extends Model
{
    protected $fillable = [
        'user_id',
        'path',
        'duration',
        'publish_type',
        'recording_type',
        'message',
        'status'
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // public function getUrlAttribute()
    // {
    //     if (!$this->path) {
    //         return null;
    //     }
    //     // Get the URL from storage - this returns relative path like /storage/audio-recordings/filename.webm
    //     $url = Storage::disk('public')->url($this->path);
    //     // Ensure it starts with /storage
    //     if (!str_starts_with($url, '/storage')) {
    //         $url = '/storage/' . ltrim($url, '/');
    //     }
    //     return $url;
    // }
    public function getUrlAttribute()
    {
        if (!$this->path) {
            return null;
        }

        // Path is already relative to public/
        // Example: audio-recordings/filename.wav
        return asset($this->path);
    }

    public function getFilenameAttribute()
    {
        return $this->path ? basename($this->path) : null;
    }
    

    protected function getShortFilenameAttribute()
    {
        if (!$this->filename) {
            return null;
        }

        $name = pathinfo($this->filename, PATHINFO_FILENAME);
        $extension = pathinfo($this->filename, PATHINFO_EXTENSION);

        return strlen($name) > 8
            ? substr($name, 0, 8) . '...' . ($extension ? '.' . $extension : '')
            : $this->filename;
           
    }
}
