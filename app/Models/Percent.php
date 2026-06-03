<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Percent extends Model
{
    protected $table = "percents";
    protected $fillable = [
        "founder_percent",
        "donation_percent",
        "balance_divider",
    ];
    public $timestamps = false;
}
