<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('written_messages', function (Blueprint $table) {
        $table->id();
        $table->integer('user_id');
        $table->text('message')->nullable();
        $table->string('publish_type')->default('public')->nullable();
        $table->integer('status')->default(1);
        $table->timestamps();

        // Optional: Foreign key
        // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('written_messages');
    }
};
