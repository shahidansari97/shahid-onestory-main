<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Avoids requiring doctrine/dbal for column changes.
        if (Schema::hasTable('visits')) {
            DB::statement('ALTER TABLE `visits` MODIFY `url` TEXT NULL');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('visits')) {
            DB::statement('ALTER TABLE `visits` MODIFY `url` VARCHAR(255) NULL');
        }
    }
};

