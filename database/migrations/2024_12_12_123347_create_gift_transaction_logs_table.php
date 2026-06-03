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
        if (!Schema::hasTable('gift_transaction_logs')) {
            Schema::create('gift_transaction_logs', function (Blueprint $table) {
                $table->id();

                $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('recipient_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('gift_id')->constrained('gifts');

                $table->string('ip_address');
                $table->string('status')->nullable();

                $table->timestamps();

                $table->index(['sender_id', 'recipient_id', 'gift_id', 'ip_address'], 'gift_transaction_logs_index');
            });

        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gift_transaction_logs');
    }
};
