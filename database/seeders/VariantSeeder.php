<?php

namespace Database\Seeders;

use App\Models\Donation;
use App\Models\Voting\Answer;
use App\Models\Voting\Question;
use App\Models\Voting\Variant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Створення питань
        Question::factory(3)->create()->each(function ($question) {
            // Для кожного питання створюємо варіанти відповідей
            Variant::factory(4)->create([
                'question_id' => $question->id,
            ])->each(function ($variant) use ($question) {
                // Для кожного варіанту створюємо голоси (answers)
                // Випадкова кількість голосів від 0 до 5
                $answersCount = rand(0, 5);
                if ($answersCount > 0) {
                    Answer::factory($answersCount)->create([
                        'question_id' => $question->id,
                        'variant_id' => $variant->id,
                        'user_id' => 2,
                    ]);
                }

                // Випадкова кількість донатів від 0 до 3
                $donationsCount = rand(0, 3);
                if ($donationsCount > 0) {
                    Donation::factory($donationsCount)->create([
                        'variant_id' => $variant->id,
                        'user_id' =>2,
                    ]);
                }
            });
        });
    }
}
