<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EditorMedia extends Model
{
    protected $table = 'user_media';
    
    // Disable Laravel's default timestamps since we use custom column names
    public $timestamps = false;
    
    protected $fillable = [
        'userId',
        'projectId',
        'name',
        'type',
        'serverPath',
        'size',
        'lastModified',
        'thumbnail',
        'duration',
        'createdAt',
        'publish_type'
    ];
    
    // If you need timestamp functionality with custom names, uncomment below:
    // const CREATED_AT = 'createdAt';
    // const UPDATED_AT = 'lastModified';
    // public $timestamps = true;

}
