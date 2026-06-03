<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EditorDraft extends Model
{
    protected $table = 'editor_drafts';
    protected $fillable = [
        'user_id',
        'filename',
        'path',
        'draft_data'
    ];

    protected $casts = [
        'draft_data' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
