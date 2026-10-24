<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('horoscope_order_id')->nullable()->constrained('horoscope_orders')->nullOnDelete();
            $table->string('service_type'); // 'membership', 'horoscope'
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('LKR');
            $table->string('payment_method'); // 'payhere', 'bank_transfer'
            $table->string('payment_status')->default('pending'); // 'pending', 'verified', 'failed', 'refunded'
            $table->string('gateway_transaction_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_orders');
    }
};
