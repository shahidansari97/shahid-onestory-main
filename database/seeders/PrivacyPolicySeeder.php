<?php

namespace Database\Seeders;

use App\Models\PrivacyPolicy;
use Illuminate\Database\Seeder;

class PrivacyPolicySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PrivacyPolicy::updateOrCreate(
            ['key' => 'content'],
            [
                'value' => [
                    'title' => 'Privacy Policy',
                    'content' => 'We value your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data when you interact with our platform. By using our services, you agree to the terms outlined in this policy.',
                ],
            ]
        );
    }
}
