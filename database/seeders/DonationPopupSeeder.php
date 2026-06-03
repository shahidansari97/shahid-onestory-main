<?php

namespace Database\Seeders;

use App\Models\DonationPopup;
use Illuminate\Database\Seeder;

class DonationPopupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DonationPopup::create([
            'key' => 'content',
            'value' => [
                'title' => 'Help to Ukraine',
                'content' => "Your donation provides Ukraine's defenders with protective gear and life-saving medical supplies.",
                'image' => 'testname.png',
            ],
        ]);
    }
}
