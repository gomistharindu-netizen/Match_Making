<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class HoroscopeOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'first_party_name',
        'first_party_birth_datetime',
        'first_party_birth_place',
        'first_party_chart_file',
        'second_party_name',
        'second_party_birth_datetime',
        'second_party_birth_place',
        'second_party_chart_file',
        'status',
        'assigned_astrologer_user_id',
        'report_file_path',
        'notes',
    ];

    protected $appends = ['secure_report_url'];

    public function getSecureReportUrlAttribute(): ?string
    {
        if (!$this->report_file_path) return null;
        return app(\App\Services\StorageService::class)->getExpiringUrl($this->report_file_path, 30);
    }

    protected function casts(): array
    {
        return [
            'first_party_birth_datetime' => 'datetime',
            'second_party_birth_datetime' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function astrologer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_astrologer_user_id');
    }

    public function paymentOrder(): HasOne
    {
        return $this->hasOne(PaymentOrder::class, 'horoscope_order_id');
    }
}
