<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactRelease extends Model
{
    use HasFactory;

    protected $fillable = [
        'grantor_profile_id',
        'grantee_profile_id',
        'status',
        'released_at',
    ];

    protected function casts(): array
    {
        return [
            'released_at' => 'datetime',
        ];
    }

    public function grantor(): BelongsTo
    {
        return $this->belongsTo(MemberProfile::class, 'grantor_profile_id');
    }

    public function grantee(): BelongsTo
    {
        return $this->belongsTo(MemberProfile::class, 'grantee_profile_id');
    }
}
