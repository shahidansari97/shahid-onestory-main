<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('spoken_story_recordings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('path')->nullable();
            $table->string('publish_type')->nullable()->default('public'); // public|private
            $table->decimal('duration', 8, 2)->nullable();
            $table->text('message')->nullable();
            $table->integer('status')->default(1); // 1=published, 2=pending (match audio_recordings style)
            $table->timestamps();

            $table->index(['user_id', 'publish_type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spoken_story_recordings');
    }
};

