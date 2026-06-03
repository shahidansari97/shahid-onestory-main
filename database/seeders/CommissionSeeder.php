<?php

namespace Database\Seeders;

use App\Models\Commission;
use Illuminate\Database\Seeder;

class CommissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Commission::create([
            'founder_funds' => 0.00,
            'charity_funds' => 0.00,
        ]);
    }
}
