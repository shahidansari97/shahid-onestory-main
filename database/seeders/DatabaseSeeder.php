<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
//            UserSeeder::class,
            GiftSeeder::class,
            PercentSeeder::class,
            PermissionSeeder::class,
//            HomepageSeeder::class,
            SiteSettingsSeeder::class,
//            WalletSeeder::class,
            CommissionSeeder::class,
//            VotingSeeder::class,
            SupportSeeder::class,
            AboutPageSeeder::class,
            DonatePageSeeder::class,
            StoryStatusSeeder::class,
//            // StorySeeder::class,
            PrivacyPolicySeeder::class,
//            TermsOfUseSeeder::class,
            PollPopupSeeder::class,
            DonationPopupSeeder::class,
        ]);
    }
}
