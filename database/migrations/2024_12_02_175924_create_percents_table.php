<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('percents')) {
            Schema::create('percents', function (Blueprint $table) {
                $table->id();
                $table->integer("founder_percent");
                $table->integer("donation_percent");
                $table->float("balance_divider");
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('percents');
    }
};
