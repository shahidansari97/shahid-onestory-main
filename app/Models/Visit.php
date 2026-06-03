<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable = ['visitor_id', 'user_id', 'ip_address', 'url', 'duration_second', 'duration_seconds', 'visited_at', 'ended_at'];

    public function visitor()
    {
        return $this->belongsTo(Visitor::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
