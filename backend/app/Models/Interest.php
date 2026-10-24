<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Interest extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_profile_id',
        'receiver_profile_id',
        'status',
        'sent_at',
        'responded_at',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
            'responded_at' => 'datetime',
        ];
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(MemberProfile::class, 'sender_profile_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(MemberProfile::class, 'receiver_profile_id');
    }

    public function conversation(): HasOne
    {
        return $this->hasOne(Conversation::class, 'interest_id');
    }
}
