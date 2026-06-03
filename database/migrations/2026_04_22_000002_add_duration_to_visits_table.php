<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->unsignedInteger('duration_seconds')->default(0)->after('url');
            $table->timestamp('ended_at')->nullable()->after('visited_at');
            $table->index(['visitor_id', 'visited_at']);
        });
    }

    public function down(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->dropIndex(['visitor_id', 'visited_at']);
            $table->dropColumn(['duration_seconds', 'ended_at']);
        });
    }
};
