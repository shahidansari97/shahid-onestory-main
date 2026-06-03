<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{

    protected $fillable = ['user_id', 'story_id', 'parent_id', 'content'];
    protected $appends = ['level'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function story()
    {
        return $this->belongsTo(Story::class);
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->with('user', 'replies')->orderBy('id','DESC');
    }

    public function getLevelAttribute()
    {
        $level = 0;
        $parent = $this->parent_id;
        while ($parent) {
            $parentComment = self::find($parent);
            if ($parentComment) {
                $level++;
                $parent = $parentComment->parent_id;
            } else {
                break;
            }
        }
        return $level;
    }
}
