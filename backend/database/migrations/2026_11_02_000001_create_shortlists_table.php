<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shortlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('member_profile_id')->constrained('member_profiles')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'member_profile_id'], 'user_profile_shortlist_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shortlists');
    }
};
