<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('member_profiles', function (Blueprint $table) {
            $table->string('profession_category')->nullable()->after('profession');
            $table->string('habits_smoking')->nullable()->default('non_smoker')->after('partner_preferences');
            $table->string('habits_drinking')->nullable()->default('teetotaler')->after('habits_smoking');
            $table->string('dietary_habits')->nullable()->default('non_vegetarian')->after('habits_drinking');
            $table->string('overseas_country')->nullable()->after('country');
            $table->string('rashi')->nullable()->after('horoscope_available');
            $table->string('nekatha')->nullable()->after('rashi');
        });
    }

    public function down(): void
    {
        Schema::table('member_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'profession_category',
                'habits_smoking',
                'habits_drinking',
                'dietary_habits',
                'overseas_country',
                'rashi',
                'nekatha',
            ]);
        });
    }
};
