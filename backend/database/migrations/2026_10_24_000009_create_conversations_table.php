<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('interest_id')->unique()->constrained('interests')->cascadeOnDelete();
            $table->foreignId('profile_one_id')->constrained('member_profiles')->cascadeOnDelete();
            $table->foreignId('profile_two_id')->constrained('member_profiles')->cascadeOnDelete();
            $table->dateTime('last_message_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
