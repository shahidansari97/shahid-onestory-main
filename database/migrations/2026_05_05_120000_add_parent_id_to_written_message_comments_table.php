<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('written_message_comments', function (Blueprint $table) {
            $table->unsignedBigInteger('parent_id')->nullable()->after('written_message_id');
            $table->index('parent_id');
            $table->foreign('parent_id')
                ->references('id')
                ->on('written_message_comments')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('written_message_comments', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropIndex(['parent_id']);
            $table->dropColumn('parent_id');
        });
    }
};

