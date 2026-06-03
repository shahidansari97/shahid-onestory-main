<?php

namespace Database\Seeders;

use App\Models\StoryStatus;
use Illuminate\Database\Seeder;

class StoryStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        StoryStatus::create([
            'name' => 'pending',
        ]);

        StoryStatus::create([
            'name' => 'published',
        ]);

        StoryStatus::create([
            'name' => 'rejected',
        ]);
    }
}
