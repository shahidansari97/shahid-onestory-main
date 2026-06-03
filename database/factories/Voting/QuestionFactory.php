<?php

namespace Database\Factories\Voting;

use App\Models\Voting\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition()
    {
        return [
            'statement' => $this->faker->sentence(),
            'is_active' => false,
            'lifetime_ends_in' => $this->faker->dateTimeBetween('+1 week', '+1 month')->format('Y-m-d'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
