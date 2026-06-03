<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('stories')) {
            Schema::create('stories', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('story_status_id')->default(1);

                $table->string('name')->nullable();
                $table->string('src')->unique();
                $table->string('thumbnail')->nullable();
                $table->json('categories');

                $table->foreign('user_id')->references('id')->on('users')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();

                $table->foreign('story_status_id')->references('id')->on('story_statuses')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();

                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('stories')) {
            Schema::dropIfExists('stories');
        }
    }
};
