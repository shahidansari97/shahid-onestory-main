<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate([
            'email' => 'admin1@one-story.com'
        ], [
            'name' => 'John',
            'username' => 'john',
            'avatar' => '/img/avatar.png',
            'email' => 'admin1@one-story.com',
            'password' => 'qwe12rfed43grf545t2',
            'world_message' => 'My universal message to the world:
Love wins over the death (50 charecters max)'
        ]);

        User::firstOrCreate([
            'email' => 'admin2@one-story.com'
        ], [
            'name' => 'Jack',
            'username' => 'jack',
            'avatar' => '/img/avatar.png',
            'email' => 'admin2@one-story.com',
            'password' => 'Per681hFK5FScn',
            'world_message' => 'My universal message to the world:
Love wins over the death (50 charecters max)'
        ]);

        User::firstOrCreate([
            'email' => 'admin3@one-story.com'
        ], [
            'name' => 'Monica',
            'username' => 'monica',
            'avatar' => '/img/ava-2.png',
            'email' => 'admin3@one-story.com',
            'password' => '8MNusjeJC50jkI',
            'world_message' => 'My universal message to the world: Love wins over the death (50 charecters max)'
        ]);

        User::firstOrCreate([
            'email' => 'admin4@one-story.com'
        ], [
            'name' => 'Lucy',
            'username' => 'lucy',
            'avatar' => '/img/avatar.png',
            'email' => 'admin4@one-story.com',
            'password' => 'I5tx1unA8SrxFU',
            'world_message' => 'My universal message to the world:
Love wins over the death (50 charecters max)'
        ]);

        User::firstOrCreate([
            'email' => 'not-admin@one-story.com'
        ], [
            'name' => 'Admiral',
            'username' => 'admiral',
            'avatar' => '/img/avatar.png',
            'email' => 'not-admin@one-story.com',
            'password' => '1d2awd2dDAWd',
            'world_message' => 'My universal message to the world:
Love wins over the death (50 charecters max)'
        ]);
    }
}
