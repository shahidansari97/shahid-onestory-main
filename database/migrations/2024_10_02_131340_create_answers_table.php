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
        if (!Schema::hasTable('answers')) {
            Schema::create('answers', function (Blueprint $table) {
                $table->id();

                $table->unsignedBigInteger('question_id');
                $table->unsignedBigInteger('variant_id');
                $table->unsignedBigInteger('user_id');

                $table->foreign('question_id')->references('id')->on('questions')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
                $table->foreign('variant_id')->references('id')->on('variants')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
                $table->foreign('user_id')->references('id')->on('users')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();

                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('answers');
    }
};
