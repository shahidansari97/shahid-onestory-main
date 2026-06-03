<?php

namespace Database\Seeders;

use App\Models\Support;
use Illuminate\Database\Seeder;

class SupportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Support::updateOrCreate(
            ['key' => 'content'],
            [
                'value' => [
                    'title' => "It's Time To Make A Change",
                    'subtitle' => "Vote for This Month's Cause!",
                    'description' => "Your voice matters! Join us in making a difference by voting for the cause you want to support this month. From helping communities affected by recent events to supporting environmental and humanitarian efforts, your vote can help shape a better world. Let's work together for a brighter future—one cause at a time.",
                    'prescription' => "What happened in the world this month",
                    'amount' => "$ 10 000",
                ],
            ]
        );
    }
}
