<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('site_settings')) {
            Schema::create('site_settings', function (Blueprint $table) {
                $table->id();

                $table->string('key')->unique();
                $table->json('value')->nullable();

                $table->timestamps();
            });

            DB::table('site_settings')->insert([
                ['key' => 'voting_page_enabled', 'value' => json_encode(false)],
                ['key' => 'voting_popup_enabled', 'value' => json_encode(false)],
                ['key' => 'donation_page_enabled', 'value' => json_encode(false)],
                ['key' => 'donation_popup_enabled', 'value' => json_encode(false)],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('site_settings')) {
            Schema::dropIfExists('site_settings');
        }
    }
};
