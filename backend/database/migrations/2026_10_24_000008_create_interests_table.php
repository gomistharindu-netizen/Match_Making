<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_profile_id')->constrained('member_profiles')->cascadeOnDelete();
            $table->foreignId('receiver_profile_id')->constrained('member_profiles')->cascadeOnDelete();
            $table->string('status')->default('pending'); // 'pending', 'accepted', 'declined', 'blocked'
            $table->dateTime('sent_at');
            $table->dateTime('responded_at')->nullable();
            $table->timestamps();

            $table->unique(['sender_profile_id', 'receiver_profile_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interests');
    }
};
