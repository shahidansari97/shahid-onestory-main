<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE audio_recordings MODIFY path VARCHAR(255) NULL');
        } elseif ($driver === 'sqlite') {
            DB::statement('CREATE TABLE audio_recordings_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                user_id INTEGER NOT NULL,
                path VARCHAR(255) NULL,
                publish_type VARCHAR(255) NULL DEFAULT "public",
                duration VARCHAR(255) NULL,
                message TEXT NULL,
                status INTEGER NOT NULL DEFAULT 1,
                created_at DATETIME NULL,
                updated_at DATETIME NULL
            )');
            DB::statement('INSERT INTO audio_recordings_new (id, user_id, path, publish_type, duration, message, status, created_at, updated_at)
                SELECT id, user_id, path, publish_type, duration, NULL, status, created_at, updated_at FROM audio_recordings');
            Schema::drop('audio_recordings');
            Schema::rename('audio_recordings_new', 'audio_recordings');
        }

        if (!Schema::hasColumn('audio_recordings', 'message')) {
            Schema::table('audio_recordings', function (Blueprint $table) {
                $table->text('message')->nullable()->after('duration');
            });
        }
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if (Schema::hasColumn('audio_recordings', 'message')) {
            Schema::table('audio_recordings', function (Blueprint $table) {
                $table->dropColumn('message');
            });
        }

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE audio_recordings MODIFY path VARCHAR(255) NOT NULL');
        }
    }
};
