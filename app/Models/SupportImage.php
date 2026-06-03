<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportImage extends Model
{
    use HasFactory;

    protected $table = 'support_images';
    protected $fillable = [
        'src',
    ];
}
