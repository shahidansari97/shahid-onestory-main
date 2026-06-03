<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('variants')) {
            Schema::create('variants', function (Blueprint $table) {
                $table->id();

                $table->unsignedBigInteger('question_id')->nullable();

                $table->string('statement');
                $table->decimal('target', 15, 2)->default(0);
                $table->decimal('funds', 15, 2)->default(0);

                $table->foreign('question_id')->references('id')->on('questions')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();

                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
//        if (Schema::hasTable('variants')) {
//            Schema::table('answers', function (Blueprint $table) {
//                $table->dropForeign('answers_variant_id_foreign');
//            });
//            Schema::drop('variants');
//        }

        Schema::dropIfExists('variants');
    }
};
