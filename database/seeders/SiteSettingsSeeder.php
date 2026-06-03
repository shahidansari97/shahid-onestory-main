<?php

namespace Database\Seeders;

use App\Models\SiteSettings;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /**
         * Common field
         */
        SiteSettings::create([
            'key' => 'common',
            'value' => [
                'mainLogo' => [
                    'logo' => '',
                    'url' => url(),
                ],
            ],
        ]);

        /**
         * Header fields
         */
        SiteSettings::create([
            'key' => 'header',
            'value' => [
                'buttons' => [
                    'about' => [
                        'title' => 'About',
                        'url' => url('/about'),
                    ],
                    'stories' => [
                        'title' => 'Stories',
                        'url' => url('/stories'),
                    ],
                    'share' => [
                        'title' => 'Share Your Story',
                        'url' => url('/#'),
                    ],
                ],
            ],
        ]);

        /**
         * Footer field
         */
        SiteSettings::create([
            'key' => 'footer',
            'value' => [
                'buttons' => [
                    'about' => [
                        'title' => 'About',
                        'url' => url('/about'),
                    ],
                    'policy' => [
                        'title' => 'Privacy Policy',
                        'url' => url('/privacy-policy'),
                    ],
                    'terms' => [
                        'title' => 'Terms of Use',
                        'url' => url('/terms-of-use'),
                    ],
                    'connect' => [
                        'title' => 'Connect',
                        'url' => url('/connect'),
                    ],
                ],
                'rights' => '© 2024 OneStoryPlanet',
            ],
        ]);
    }
}
