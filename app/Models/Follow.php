<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Follow extends Model
{
    use HasFactory;

    protected $fillable = [
        'follower_id',
        'following_id',
    ];


    // Define the follower relationship
    public function follower()
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    // Define the following relationship
    public function following()
    {
        return $this->belongsTo(User::class, 'following_id');
    }

}
