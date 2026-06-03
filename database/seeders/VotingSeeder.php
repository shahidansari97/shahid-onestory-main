<?php

namespace Database\Seeders;

use App\Models\Voting\Question;
use App\Models\Voting\Variant;
use Illuminate\Database\Seeder;


class VotingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a question (poll)
        $question = Question::create([
            'statement' => 'Vote for This Month\'s Cause!',
            'is_active' => true,
            'lifetime_ends_in' => now()->addMonth(),
        ]);

        // Create variants for the question
        $variants = [
            ['statement' => 'War in Gaza', 'question_id' => $question->id],
            ['statement' => 'Orphans in Chicago', 'question_id' => $question->id],
            ['statement' => 'Women in Sudan', 'question_id' => $question->id],
            ['statement' => 'Olympics', 'question_id' => $question->id],
        ];

        foreach ($variants as $variant) {
            Variant::create($variant);
        }
    }
}
