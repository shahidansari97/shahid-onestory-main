<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('written_message_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('written_message_id');
            $table->unsignedBigInteger('user_id');
            $table->text('comment');
            $table->timestamps();

            $table->index('written_message_id');
            $table->index('user_id');
            $table->foreign('written_message_id')
                ->references('id')
                ->on('written_messages')
                ->onDelete('cascade');
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('written_message_comments');
    }
};

