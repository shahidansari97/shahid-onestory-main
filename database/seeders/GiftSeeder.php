<?php

namespace Database\Seeders;

use App\Models\Gift;
use Illuminate\Database\Seeder;

class GiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Gift::create([
            'name' => 'Flower',
            'picture' => 'flower.png',
            'cost' => 25.00
        ]);

        Gift::create([
            'name' => 'Thank You',
            'picture' => 'thank-you.png',
            'cost' => 50.00
        ]);

        Gift::create([
            'name' => 'Grateful',
            'picture' => 'grateful.png',
            'cost' => 75.00
        ]);

        Gift::create([
            'name' => 'Together',
            'picture' => 'together.png',
            'cost' => 100.00
        ]);

        Gift::create([
            'name' => 'Appreciate you',
            'picture' => 'appreciate.png',
            'cost' => 125.00
        ]);
    }
}
