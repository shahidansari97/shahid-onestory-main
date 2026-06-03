<?php

namespace Database\Seeders;

use App\Models\Homepage;
use App\Models\Story;
use Illuminate\Database\Seeder;

class HomepageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /**
         * Hero field
         */
        Homepage::create([
            'key' => 'hero',
            'value' => [
                'title' => 'One story, uniting all people',
                'subtitle1' => 'Empower your story with our tools to share it and make a meaningful impact on the world.',
                'subtitle2' => 'Over 1000 stories has been shared!',
                'video' => '',
                'textUnderVideo' => 'Our vision is to connect people from all corners of the world, uniting them through shared stories that inspire goodness and promote meaningful causes. By providing the most advanced and user-friendly tools, we empower you to craft and share your narrative, sparking connections and encouraging donations that make a real difference. Together, we aim to build a global community where every story brings people closer and drives positive change.',
            ],
        ]);

        /**
         * storyBlock field
         */
        Homepage::create([
            'key' => 'storyBlock',
            'value' => [
                'title' => 'One Story, Infinite Connections',
                'description' => 'Watch as countless voices unite into a single, seamless narrative. This is where your story becomes part of something greater.',
                'advice' => 'Use our advanced editing platform and AI generative tools',
                'info' => [
                    'setting' => [
                        'title' => 'Upload your elements',
                        'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    ],
                    'play' => [
                        'title' => 'Upload your elements',
                        'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    ],
                    'like' => [
                        'title' => 'Upload your elements',
                        'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    ],
                ],
            ],
        ]);
    }
}
