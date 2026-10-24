<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecentlyViewed extends Model
{
    use HasFactory;

    protected $table = 'recently_viewed';

    protected $fillable = [
        'viewer_profile_id',
        'viewed_profile_id',
        'viewed_at',
    ];

    protected function casts(): array
    {
        return [
            'viewed_at' => 'datetime',
        ];
    }

    public function viewer(): BelongsTo
    {
        return $this->belongsTo(MemberProfile::class, 'viewer_profile_id');
    }

    public function viewed(): BelongsTo
    {
        return $this->belongsTo(MemberProfile::class, 'viewed_profile_id');
    }
}
