<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MemberProfile;
use App\Models\RecentlyViewed;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    /**
     * Update member profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $validated = $request->validate([
            'district' => 'sometimes|string|max:100',
            'city' => 'nullable|string|max:100',
            'country' => 'sometimes|string|max:100',
            'residence_status' => 'sometimes|string|max:100',
            'height_feet' => 'nullable|integer|min:3|max:7',
            'height_inches' => 'nullable|integer|min:0|max:11',
            'education_level' => 'sometimes|string|max:255',
            'profession' => 'sometimes|string|max:255',
            'employed_in' => 'nullable|string|max:100',
            'monthly_income_lkr' => 'nullable|string|max:100',
            'family_background' => 'nullable|string|max:2000',
            'partner_preferences' => 'nullable|string|max:2000',
            'horoscope_available' => 'sometimes|boolean',
            'primary_photo_url' => 'nullable|url|max:500',
            'is_paused' => 'sometimes|boolean',
        ]);

        $profile->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile->fresh(),
        ]);
    }

    /**
     * Record a profile view
     */
    public function recordView(Request $request, string $profileCode): JsonResponse
    {
        $viewerProfile = $request->user()->profile;

        if (!$viewerProfile) {
            return response()->json(['message' => 'No viewer profile'], 400);
        }

        $targetProfile = MemberProfile::where('profile_code', $profileCode)->firstOrFail();

        if ($viewerProfile->id === $targetProfile->id) {
            return response()->json(['message' => 'Self view ignored']);
        }

        // Deduplicate or bump timestamp
        RecentlyViewed::updateOrCreate(
            [
                'viewer_profile_id' => $viewerProfile->id,
                'viewed_profile_id' => $targetProfile->id,
            ],
            [
                'viewed_at' => now(),
            ]
        );

        return response()->json(['message' => 'View recorded']);
    }

    /**
     * Get Recently Viewed profiles by current member
     */
    public function recentlyViewed(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;

        if (!$profile) {
            return response()->json([]);
        }

        $items = RecentlyViewed::where('viewer_profile_id', $profile->id)
            ->with('viewed')
            ->orderBy('viewed_at', 'desc')
            ->take(30)
            ->get()
            ->map(function ($item) {
                $p = $item->viewed;
                return [
                    'id' => $p->id,
                    'profile_code' => $p->profile_code,
                    'gender' => $p->gender,
                    'age' => $p->age,
                    'district' => $p->district,
                    'profession' => $p->profession,
                    'primary_photo_url' => $p->primary_photo_url,
                    'viewed_at' => $item->viewed_at->diffForHumans(),
                ];
            });

        return response()->json($items);
    }

    /**
     * Get Who Viewed Me (Subject to reciprocal privacy rule)
     */
    public function whoViewedMe(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json([]);
        }

        // Reciprocal privacy rule: if user disables their visibility in others' viewer lists, they can't see who viewed them
        if (!$user->show_in_viewer_lists) {
            return response()->json([
                'privacy_notice' => 'You have disabled visibility in viewer lists. Enable it in settings to see who viewed your profile.',
                'items' => [],
            ]);
        }

        $items = RecentlyViewed::where('viewed_profile_id', $profile->id)
            ->with(['viewer.owner'])
            ->orderBy('viewed_at', 'desc')
            ->take(30)
            ->get()
            ->filter(fn($item) => $item->viewer && $item->viewer->owner && $item->viewer->owner->show_in_viewer_lists)
            ->values()
            ->map(function ($item) {
                $p = $item->viewer;
                return [
                    'id' => $p->id,
                    'profile_code' => $p->profile_code,
                    'gender' => $p->gender,
                    'age' => $p->age,
                    'district' => $p->district,
                    'profession' => $p->profession,
                    'primary_photo_url' => $p->primary_photo_url,
                    'viewed_at' => $item->viewed_at->diffForHumans(),
                ];
            });

        return response()->json(['items' => $items]);
    }
}
