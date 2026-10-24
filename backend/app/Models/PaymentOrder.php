<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PaymentOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'user_id',
        'horoscope_order_id',
        'service_type',
        'amount',
        'currency',
        'payment_method',
        'payment_status',
        'gateway_transaction_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function horoscopeOrder(): BelongsTo
    {
        return $this->belongsTo(HoroscopeOrder::class, 'horoscope_order_id');
    }

    public function bankSlip(): HasOne
    {
        return $this->hasOne(BankSlip::class, 'payment_order_id');
    }

    public function membership(): HasOne
    {
        return $this->hasOne(Membership::class, 'payment_order_id');
    }
}
