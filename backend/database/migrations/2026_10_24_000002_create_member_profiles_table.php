<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('profile_code')->unique();
            $table->string('full_name_private');
            $table->string('gender'); // 'bride', 'groom'
            $table->date('birth_date');
            $table->string('district');
            $table->string('city')->nullable();
            $table->string('country')->default('Sri Lanka');
            $table->string('residence_status')->default('Citizen');
            $table->string('religion');
            $table->string('caste')->nullable();
            $table->unsignedTinyInteger('height_feet')->nullable();
            $table->unsignedTinyInteger('height_inches')->nullable();
            $table->string('education_level');
            $table->string('profession');
            $table->string('employed_in')->nullable(); // Government, Private, Self Employed, Overseas
            $table->string('monthly_income_lkr')->nullable();
            $table->text('family_background')->nullable();
            $table->text('partner_preferences')->nullable();
            $table->boolean('horoscope_available')->default(false);
            $table->string('primary_photo_url')->nullable();
            $table->string('publication_status')->default('pending'); // pending, approved, rejected
            $table->string('managed_by_type')->default('self'); // self, father, mother, guardian
            $table->boolean('is_paused')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_profiles');
    }
};
