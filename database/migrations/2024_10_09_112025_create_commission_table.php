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
        if (!Schema::hasTable('commission')) {
            Schema::create('commission', function (Blueprint $table) {
                $table->id();

                $table->decimal('founder_funds' , 10, 3)->default(0);
                $table->decimal('charity_funds' , 10, 3)->default(0);
                $table->decimal('donation_funds' , 10, 3)->default(0);

                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commission');
    }
};
