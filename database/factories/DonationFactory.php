<?php

namespace Database\Factories;

use App\Models\Donation;
use Illuminate\Database\Eloquent\Factories\Factory;

class DonationFactory extends Factory
{
    protected $model = Donation::class;

    public function definition()
    {
        return [
            'user_id' => null, // буде встановлено пізніше
            'funds' => $this->faker->numberBetween(10, 500),
            'variant_id' => null, // буде встановлено пізніше
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
