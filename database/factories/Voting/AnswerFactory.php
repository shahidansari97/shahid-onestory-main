<?php

namespace Database\Factories\Voting;

use App\Models\Voting\Answer;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnswerFactory extends Factory
{
    protected $model = Answer::class;

    public function definition()
    {
        return [
            'question_id' => null, // буде встановлено пізніше
            'variant_id' => null, // буде встановлено пізніше
            'user_id' => null, // буде встановлено пізніше
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
