<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AutoSave extends Model
{
    public $timestamps = false;
    protected $table = 'autosave';
    protected $fillable = [
        'editorState',
        'timestamp',
        'projectId',
        'userId'
    ];

}
