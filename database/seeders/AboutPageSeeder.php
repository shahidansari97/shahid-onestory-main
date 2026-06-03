<?php

namespace Database\Seeders;

use App\Models\AboutPage;
use Illuminate\Database\Seeder;

class AboutPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AboutPage::updateOrCreate(
            ['key' => 'content'],
            [
                'value' => [
                    'title' => "You are the celebrities of this Planet\n It is time to celebrate your life.",
                    'paragraphs' => [
                        [
                            'title' => "The Purpose",
                            'text' => "The stories of your life are powerful and inspiring and are the basis for every movie that you love. The celebrities that you admire play characters that are based on YOU!"
                        ],

                        [
                            'title' => "The vision",
                            'text' => "By connecting your life to that of other people you recognize your vital connection to all the people of this world: Unity"
                        ],

                        [
                            'title' => "Your story",
                            'text' => "When you tell your story, live it. Give us the details but also the dialogue: my husband and I were dancing on the beach as I looked at the sunset and said: “Thank you God for making me a mom.”"
                        ],

                        'final_paragraph' => 'Power to the People.'
                    ],
                ],
            ]
        );
    }
}
