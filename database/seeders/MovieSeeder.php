<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\User;
use Illuminate\Database\Seeder;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Movie::create([
            'user_id' => User::first()->id,
            'name' => 'test movie name',
            'uuid' => 'awdawdawdawd.mp4',
            'storage_name' => 'test',
        ]);
    }
}
