<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('horoscope_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->string('first_party_name');
            $table->dateTime('first_party_birth_datetime');
            $table->string('first_party_birth_place');
            $table->string('first_party_chart_file')->nullable();
            $table->string('second_party_name');
            $table->dateTime('second_party_birth_datetime');
            $table->string('second_party_birth_place');
            $table->string('second_party_chart_file')->nullable();
            $table->string('status')->default('pending_payment'); // pending_payment, in_review, completed, cancelled
            $table->foreignId('assigned_astrologer_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('report_file_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('horoscope_orders');
    }
};
