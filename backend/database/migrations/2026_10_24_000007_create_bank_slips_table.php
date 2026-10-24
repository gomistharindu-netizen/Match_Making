<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_slips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_order_id')->constrained('payment_orders')->cascadeOnDelete();
            $table->string('slip_file_path');
            $table->string('bank_name');
            $table->string('branch_name')->nullable();
            $table->date('deposit_date');
            $table->string('reference_no')->nullable();
            $table->foreignId('verified_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('verified_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_slips');
    }
};
