<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_releases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grantor_profile_id')->constrained('member_profiles')->cascadeOnDelete();
            $table->foreignId('grantee_profile_id')->constrained('member_profiles')->cascadeOnDelete();
            $table->string('status')->default('approved'); // pending, approved, declined
            $table->dateTime('released_at');
            $table->timestamps();

            $table->unique(['grantor_profile_id', 'grantee_profile_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_releases');
    }
};
