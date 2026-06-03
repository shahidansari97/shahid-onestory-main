<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('written_messages', function (Blueprint $table) {
            $table->unsignedInteger('total_share')->default(0)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('written_messages', function (Blueprint $table) {
            $table->dropColumn('total_share');
        });
    }
};

