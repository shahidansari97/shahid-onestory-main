<?php

namespace Database\Seeders;

use App\Models\DonatePage;
use Illuminate\Database\Seeder;

class DonatePageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DonatePage::updateOrCreate(
            ['key' => 'content'],
            [
                'value' => [
                    'title' => 'Your Donation for Ukrainian',
                    'paragraph' => "The war in Ukraine has caused many challenges, and one of the biggest ones is access to critical medical supplies among Ukraine's defenders. The mission of Ukraine Aid Operations is to provide the defenders of Ukraine with protective, life-saving gear. Critical medical supplies for emergency care for those that have been injured is an integral part of that mission.",
                    'image' => 'non-existent_picture.jpg',
                ]
            ],
        );
    }
}
