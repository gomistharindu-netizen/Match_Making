<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recently_viewed', function (Blueprint $table) {
            $table->id();
            $table->foreignId('viewer_profile_id')->constrained('member_profiles')->cascadeOnDelete();
            $table->foreignId('viewed_profile_id')->constrained('member_profiles')->cascadeOnDelete();
            $table->dateTime('viewed_at');
            $table->timestamps();

            $table->unique(['viewer_profile_id', 'viewed_profile_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recently_viewed');
    }
};
