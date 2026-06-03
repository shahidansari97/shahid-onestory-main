<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
class Story extends Model
{
    use HasFactory;

    protected $table = 'stories';
    protected $fillable = [
        'user_id',
        'story_status_id',
        'name',
        'src',
	    'preview',
	    'master_url',
        'thumbnail',
        'total_share',
        'categories',
        'publish_type'
    ];
    protected $appends = ['isLiked'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected function categories(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value),
        );
    }
    public function likes()
    {
        return $this->hasMany(StoryLike::class, 'story_id');
    }

    // Accessor for the "isLiked" attribute
    public function getIsLikedAttribute(): bool
    {
        if(Auth::user() == null) {
            return false;
        }
        return $this->likes()->where('liked_by', Auth::user()->id)->exists();
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)
            ->whereNull('parent_id')
            ->with('replies', 'user')
            ->orderBy('id','DESC');
    }
    public function best_edit_voting()
    {
        return $this->hasMany(StoryVoting::class, 'story_id')->where('best_edit',1);
    }
    public function best_content_voting()
    {
        return $this->hasMany(StoryVoting::class, 'story_id')->where('best_content',1);
    }

    public function best_edit_vote_by_user()
    {
        return $this->hasOne(StoryVoting::class)->where(['voter_id'=>Auth::id(),'best_edit'=>1]);
    }

    public function best_content_vote_by_user()
    {
        return $this->hasOne(StoryVoting::class)->where(['voter_id'=>Auth::id(),'best_content'=>1]);
    }
}
