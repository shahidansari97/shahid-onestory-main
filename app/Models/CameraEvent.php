<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CameraEvent extends Model
{
    use HasFactory;

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    public const EVENT_TYPE_CAMERA_OPENED = 'camera_opened';
    public const EVENT_TYPE_RECORDING_SAVED = 'recording_saved';
    public const EVENT_TYPE_CAMERA_PERMISSION_DENIED = 'camera_permission_denied';
    public const EVENT_TYPE_CAMERA_RECORDING_DELETED = 'recording_deleted';

    protected $fillable = [
        'userId',
        'name',
        'email',
        'duration',
        'eventType',
        'themeId',
        'themeTitle',
        'createdAt',
        'updatedAt',
    ];

    protected $casts = [
        'userId' => 'string',
        'duration' => 'float',
        'themeId' => 'integer',
        'createdAt' => 'datetime',
        'updatedAt' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
