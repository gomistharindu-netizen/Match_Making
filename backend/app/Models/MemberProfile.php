<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MemberProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_user_id',
        'profile_code',
        'full_name_private',
        'gender',
        'birth_date',
        'district',
        'city',
        'country',
        'residence_status',
        'religion',
        'caste',
        'height_feet',
        'height_inches',
        'education_level',
        'profession',
        'profession_category',
        'employed_in',
        'monthly_income_lkr',
        'family_background',
        'partner_preferences',
        'habits_smoking',
        'habits_drinking',
        'dietary_habits',
        'overseas_country',
        'horoscope_available',
        'rashi',
        'nekatha',
        'primary_photo_url',
        'photo_visibility',
        'publication_status',
        'managed_by_type',
        'is_paused',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'horoscope_available' => 'boolean',
            'is_paused' => 'boolean',
            'height_feet' => 'integer',
            'height_inches' => 'integer',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(ProfilePhoto::class, 'profile_id')->orderBy('sort_order');
    }

    public function sentInterests(): HasMany
    {
        return $this->hasMany(Interest::class, 'sender_profile_id');
    }

    public function receivedInterests(): HasMany
    {
        return $this->hasMany(Interest::class, 'receiver_profile_id');
    }

    public function releasedContacts(): HasMany
    {
        return $this->hasMany(ContactRelease::class, 'grantor_profile_id');
    }

    public function contactsGrantedToMe(): HasMany
    {
        return $this->hasMany(ContactRelease::class, 'grantee_profile_id');
    }

    public function recentlyViewed(): HasMany
    {
        return $this->hasMany(RecentlyViewed::class, 'viewer_profile_id');
    }

    public function viewers(): HasMany
    {
        return $this->hasMany(RecentlyViewed::class, 'viewed_profile_id');
    }

    public function shortlistedBy(): HasMany
    {
        return $this->hasMany(Shortlist::class, 'member_profile_id');
    }

    public function photoAccessRequests(): HasMany
    {
        return $this->hasMany(PhotoAccessRequest::class, 'target_profile_id');
    }

    public function getAgeAttribute(): ?int
    {
        return $this->birth_date ? $this->birth_date->age : null;
    }
}
