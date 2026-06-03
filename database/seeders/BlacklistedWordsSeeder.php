<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlacklistedWord;
use Illuminate\Support\Facades\Http;

class BlacklistedWordsSeeder extends Seeder
{
    public function run()
    {
        $url = 'https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/en';

        $response = Http::get($url);

        if ($response->ok()) {
            $words = explode("\n", $response->body());

            foreach ($words as $word) {
                $cleanedWord = trim($word);
                if (!empty($cleanedWord)) {
                    BlacklistedWord::updateOrCreate(['word' => $cleanedWord]);
                }
            }

            $this->command->info('Blacklisted words seeded successfully!');
        } else {
            $this->command->error('Failed to fetch blacklisted words from the online resource.');
        }
    }
}
