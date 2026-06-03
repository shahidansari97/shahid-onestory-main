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
        Schema::create('camera_events', function (Blueprint $table) {
            $table->id();
            $table->string('userId');
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->decimal('duration', 10, 2)->nullable();
            $table->enum('eventType', [
                'camera_opened',
                'recording_saved',
                'camera_permission_denied',
            ]);
            $table->unsignedBigInteger('themeId')->nullable();
            $table->string('themeTitle')->nullable();
            $table->timestamp('createdAt')->useCurrent();
            $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();

            // $table->index(['userId', 'eventType']);
            // $table->index('themeId');
            // $table->index('createdAt');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('camera_events');
    }
};
