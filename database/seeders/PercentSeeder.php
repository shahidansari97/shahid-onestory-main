<?php

namespace Database\Seeders;

use App\Models\Percent;
use Illuminate\Database\Seeder;

class PercentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (is_null(Percent::first())) {
            Percent::create([
                "founder_percent" => 7,
                "donation_percent" => 3,
                "balance_divider" => 10,
            ]);
        }
    }
}
