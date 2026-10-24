<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('member_profiles')->cascadeOnDelete();
            $table->string('file_path');
            $table->string('visibility')->default('public'); // public, members_only, hidden
            $table->string('moderation_status')->default('approved'); // pending, approved, rejected
            $table->boolean('is_primary')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_photos');
    }
};
