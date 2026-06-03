<?php

namespace Database\Seeders;

use App\Models\PollPopup;
use Illuminate\Database\Seeder;

class PollPopupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PollPopup::create([
            'key' => 'content',
            'value' => [
                'title' => 'Vote for the cause',
                'content' => "Your voice matters! Vote for the cause you want to support this month to help make the world a better place together.",
                'image' => 'testname.png'
            ],
        ]);
    }
}
