<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('spoken_story_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('spoken_story_recording_id');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->text('comment');
            $table->timestamps();

            $table->index(['spoken_story_recording_id', 'created_at']);
            $table->index(['parent_id', 'created_at']);

            $table->foreign('spoken_story_recording_id')
                ->references('id')->on('spoken_story_recordings')
                ->onDelete('cascade');

            $table->foreign('parent_id')
                ->references('id')->on('spoken_story_comments')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spoken_story_comments');
    }
};

