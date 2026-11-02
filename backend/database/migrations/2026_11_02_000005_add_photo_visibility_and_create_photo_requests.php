<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add photo_visibility to member_profiles
        Schema::table('member_profiles', function (Blueprint $table) {
            $table->string('photo_visibility')->default('public')->after('primary_photo_url');
        });

        // 2. Create photo_access_requests table
        Schema::create('photo_access_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requester_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('target_profile_id')->constrained('member_profiles')->cascadeOnDelete();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();

            $table->unique(['requester_user_id', 'target_profile_id'], 'req_user_profile_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photo_access_requests');

        Schema::table('member_profiles', function (Blueprint $table) {
            $table->dropColumn('photo_visibility');
        });
    }
};
