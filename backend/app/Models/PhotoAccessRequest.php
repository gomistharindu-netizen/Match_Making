<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhotoAccessRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'requester_user_id',
        'target_profile_id',
        'status',
        'responded_at',
    ];

    protected function casts(): array
    {
        return [
            'responded_at' => 'datetime',
        ];
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_user_id');
    }

    public function targetProfile(): BelongsTo
    {
        return $this->belongsTo(MemberProfile::class, 'target_profile_id');
    }
}
