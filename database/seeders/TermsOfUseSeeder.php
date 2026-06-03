<?php

namespace Database\Seeders;

use App\Models\TermsOfUse;
use Illuminate\Database\Seeder;

class TermsOfUseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TermsOfUse::updateOrCreate(
            ['key' => 'content'],
            [
                'value' => [
                    'title' => 'Terms of Use',
                    'content' => 'These Terms of Use govern your access to and use of our platform. By continuing to use our services, you agree to abide by the guidelines and regulations we have established to ensure a safe and respectful environment for all users.',
                ],
            ]
        );
    }
}
