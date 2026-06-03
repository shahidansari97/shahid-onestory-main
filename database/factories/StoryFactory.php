<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Story>
 */
class StoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'name' => $this->faker->sentence(3),
            'thumbnail' => 'https://i.pravatar.cc/500?img=' . $this->faker->numberBetween(1, 70),
            'src' => $this->faker->uuid() . '.mp4',
            'categories' => ['News'],
        ];
    }
}
