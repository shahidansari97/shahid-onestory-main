<?php

namespace Database\Factories\Voting;

use App\Models\Voting\Variant;
use Illuminate\Database\Eloquent\Factories\Factory;

class VariantFactory extends Factory
{
    protected $model = Variant::class;

    public function definition()
    {
        return [
            'question_id' => null, // буде встановлено пізніше
            'statement' => $this->faker->sentence(),
            'funds' => $this->faker->numberBetween(0, 1000),
            'target' => $this->faker->numberBetween(1000, 5000),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
