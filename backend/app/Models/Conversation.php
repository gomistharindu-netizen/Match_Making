<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'interest_id',
        'profile_one_id',
        'profile_two_id',
        'last_message_at',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
        ];
    }

    public function interest(): BelongsTo
    {
        return $this->belongsTo(Interest::class, 'interest_id');
    }

    public function profileOne(): BelongsTo
    {
        return $this->belongsTo(MemberProfile::class, 'profile_one_id');
    }

    public function profileTwo(): BelongsTo
    {
        return $this->belongsTo(MemberProfile::class, 'profile_two_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'conversation_id')->orderBy('created_at', 'asc');
    }
}
