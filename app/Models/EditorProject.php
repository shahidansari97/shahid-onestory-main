<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EditorProject extends Model
{
    public $timestamps = false;
    protected $table = 'projects';
    protected $fillable = [
        'name',
        'lastModified',
        'createdAt',
        'userId',
        'description'
    ];

}
