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
        // Update orders table foreign key to preserve orders when user is deleted
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
         });

        // Update products table foreign key to preserve products when user is deleted
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert orders table foreign key to cascade delete
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Revert products table foreign key to cascade delete
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
