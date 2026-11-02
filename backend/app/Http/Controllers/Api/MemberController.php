<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Interest;
use App\Models\MemberProfile;
use App\Models\Message;
use App\Models\PhotoAccessRequest;
use App\Models\ProfilePhoto;
use App\Models\RecentlyViewed;
use App\Models\Shortlist;
use App\Models\User;
use App\Models\UserBlock;
use App\Models\UserReport;
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
            'photo_visibility' => 'sometimes|string|in:public,members_only,on_request',
            'profession_category' => 'nullable|string|max:100',
            'habits_smoking' => 'nullable|string|max:50',
            'habits_drinking' => 'nullable|string|max:50',
            'dietary_habits' => 'nullable|string|max:50',
            'overseas_country' => 'nullable|string|max:100',
            'rashi' => 'nullable|string|max:100',
            'nekatha' => 'nullable|string|max:100',
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

    /**
     * Upload / Update Profile Photo
     */
    public function uploadPhoto(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240', // Max 10MB
            'is_primary' => 'nullable|boolean',
            'visibility' => 'nullable|in:public,members_only,hidden',
        ]);

        $profile = $request->user()->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $path = $request->file('photo')->store('profile_photos', 'public');
        $photoUrl = url('storage/' . $path);

        $isPrimary = $request->boolean('is_primary', true);

        if ($isPrimary) {
            ProfilePhoto::where('profile_id', $profile->id)->update(['is_primary' => false]);
            $profile->update(['primary_photo_url' => $photoUrl]);
        }

        $photo = ProfilePhoto::create([
            'profile_id' => $profile->id,
            'file_path' => $photoUrl,
            'visibility' => $request->get('visibility', 'public'),
            'moderation_status' => 'approved',
            'is_primary' => $isPrimary,
            'sort_order' => ProfilePhoto::where('profile_id', $profile->id)->count() + 1,
        ]);

        return response()->json([
            'message' => 'Photo uploaded successfully',
            'photo_url' => $photoUrl,
            'photo' => $photo,
            'profile' => $profile->fresh(),
        ], 201);
    }

    /**
     * Delete Profile Photo
     */
    public function deletePhoto(Request $request, int $photoId): JsonResponse
    {
        $profile = $request->user()->profile;
        $photo = ProfilePhoto::where('id', $photoId)->where('profile_id', $profile->id)->firstOrFail();
        $photo->delete();

        // If this was primary photo, set another one as primary if available
        if ($photo->is_primary) {
            $next = ProfilePhoto::where('profile_id', $profile->id)->first();
            $newUrl = $next ? $next->file_path : null;
            if ($next) {
                $next->update(['is_primary' => true]);
            }
            $profile->update(['primary_photo_url' => $newUrl]);
        }

        return response()->json(['message' => 'Photo deleted successfully']);
    }

    /**
     * Get member's shortlisted profiles
     */
    public function shortlist(Request $request): JsonResponse
    {
        $user = $request->user();
        $shortlisted = Shortlist::where('user_id', $user->id)
            ->with(['profile.photos'])
            ->latest()
            ->get()
            ->map(function ($item) {
                $p = $item->profile;
                if (!$p) return null;
                return [
                    'id' => $p->id,
                    'profile_code' => $p->profile_code,
                    'gender' => $p->gender,
                    'age' => $p->age,
                    'district' => $p->district,
                    'city' => $p->city,
                    'country' => $p->country,
                    'religion' => $p->religion,
                    'caste' => $p->caste,
                    'education_level' => $p->education_level,
                    'profession' => $p->profession,
                    'primary_photo_url' => $p->primary_photo_url,
                    'horoscope_available' => $p->horoscope_available,
                    'shortlisted_at' => $item->created_at->toIso8601String(),
                ];
            })
            ->filter()
            ->values();

        return response()->json($shortlisted);
    }

    /**
     * Add profile to shortlist
     */
    public function addToShortlist(Request $request, string $profileCode): JsonResponse
    {
        $user = $request->user();
        $targetProfile = MemberProfile::where('profile_code', $profileCode)->firstOrFail();

        // Cannot shortlist own profile
        if ($user->profile && $user->profile->id === $targetProfile->id) {
            return response()->json(['message' => 'Cannot shortlist your own profile'], 422);
        }

        Shortlist::firstOrCreate([
            'user_id' => $user->id,
            'member_profile_id' => $targetProfile->id,
        ]);

        return response()->json([
            'message' => 'Profile added to shortlist successfully',
            'is_shortlisted' => true,
            'profile_code' => $profileCode,
        ]);
    }

    /**
     * Remove profile from shortlist
     */
    public function removeFromShortlist(Request $request, string $profileCode): JsonResponse
    {
        $user = $request->user();
        $targetProfile = MemberProfile::where('profile_code', $profileCode)->firstOrFail();

        Shortlist::where('user_id', $user->id)
            ->where('member_profile_id', $targetProfile->id)
            ->delete();

        return response()->json([
            'message' => 'Profile removed from shortlist',
            'is_shortlisted' => false,
            'profile_code' => $profileCode,
        ]);
    }

    /**
     * Block a member profile
     */
    public function blockUser(Request $request, string $profileCode): JsonResponse
    {
        $user = $request->user();
        $targetProfile = MemberProfile::where('profile_code', $profileCode)->firstOrFail();

        if ($user->id === $targetProfile->owner_user_id) {
            return response()->json(['message' => 'Cannot block yourself'], 422);
        }

        UserBlock::firstOrCreate([
            'blocker_user_id' => $user->id,
            'blocked_user_id' => $targetProfile->owner_user_id,
        ]);

        return response()->json([
            'message' => 'User blocked successfully. They will no longer be able to message you or view your profile.',
            'blocked_profile_code' => $profileCode,
        ]);
    }

    /**
     * Unblock a member profile
     */
    public function unblockUser(Request $request, string $profileCode): JsonResponse
    {
        $user = $request->user();
        $targetProfile = MemberProfile::where('profile_code', $profileCode)->firstOrFail();

        UserBlock::where('blocker_user_id', $user->id)
            ->where('blocked_user_id', $targetProfile->owner_user_id)
            ->delete();

        return response()->json([
            'message' => 'User unblocked successfully',
            'unblocked_profile_code' => $profileCode,
        ]);
    }

    /**
     * Get list of blocked profiles
     */
    public function blockedUsers(Request $request): JsonResponse
    {
        $user = $request->user();
        $blocks = UserBlock::where('blocker_user_id', $user->id)
            ->with(['blocked.profile'])
            ->latest()
            ->get()
            ->map(function ($block) {
                $p = $block->blocked?->profile;
                if (!$p) return null;
                return [
                    'id' => $block->id,
                    'profile_code' => $p->profile_code,
                    'gender' => $p->gender,
                    'district' => $p->district,
                    'profession' => $p->profession,
                    'blocked_at' => $block->created_at->toIso8601String(),
                ];
            })
            ->filter()
            ->values();

        return response()->json($blocks);
    }

    /**
     * Submit user report for inappropriate conduct
     */
    public function reportUser(Request $request, string $profileCode): JsonResponse
    {
        $validated = $request->validate([
            'reason_category' => 'required|string|in:spam,harassment,fake_profile,inappropriate_messages,commercial,other',
            'description' => 'required|string|max:1000',
        ]);

        $user = $request->user();
        $targetProfile = MemberProfile::where('profile_code', $profileCode)->firstOrFail();

        if ($user->id === $targetProfile->owner_user_id) {
            return response()->json(['message' => 'Cannot report yourself'], 422);
        }

        $report = UserReport::create([
            'reporter_user_id' => $user->id,
            'reported_user_id' => $targetProfile->owner_user_id,
            'reason_category' => $validated['reason_category'],
            'description' => $validated['description'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Report submitted successfully. Agency staff will review and take appropriate action.',
            'report_id' => $report->id,
        ], 201);
    }

    /**
     * Request access to a member's private/on-request photo
     */
    public function requestPhotoAccess(Request $request, string $profileCode): JsonResponse
    {
        $user = $request->user();
        $targetProfile = MemberProfile::where('profile_code', $profileCode)->firstOrFail();

        if ($user->id === $targetProfile->owner_user_id) {
            return response()->json(['message' => 'This is your own profile'], 422);
        }

        $photoRequest = PhotoAccessRequest::firstOrCreate(
            [
                'requester_user_id' => $user->id,
                'target_profile_id' => $targetProfile->id,
            ],
            [
                'status' => 'pending',
            ]
        );

        return response()->json([
            'message' => 'Photo access requested. The profile owner will be notified.',
            'request_status' => $photoRequest->status,
        ]);
    }

    /**
     * Respond to a photo access request (approve / reject)
     */
    public function respondPhotoAccess(Request $request, int $requestId): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $user = $request->user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $photoRequest = PhotoAccessRequest::where('id', $requestId)
            ->where('target_profile_id', $profile->id)
            ->firstOrFail();

        $photoRequest->update([
            'status' => $validated['status'],
            'responded_at' => now(),
        ]);

        return response()->json([
            'message' => "Photo access request has been {$validated['status']}.",
            'request' => $photoRequest,
        ]);
    }

    /**
     * Get photo access requests (received and sent)
     */
    public function photoAccessRequests(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        $received = [];
        if ($profile) {
            $received = PhotoAccessRequest::where('target_profile_id', $profile->id)
                ->with(['requester.profile'])
                ->latest()
                ->get()
                ->map(fn($r) => [
                    'id' => $r->id,
                    'requester_name' => $r->requester?->name,
                    'requester_code' => $r->requester?->profile?->profile_code,
                    'status' => $r->status,
                    'created_at' => $r->created_at->toIso8601String(),
                ]);
        }

        $sent = PhotoAccessRequest::where('requester_user_id', $user->id)
            ->with('targetProfile')
            ->latest()
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'target_code' => $r->targetProfile?->profile_code,
                'status' => $r->status,
                'created_at' => $r->created_at->toIso8601String(),
            ]);

        return response()->json([
            'received' => $received,
            'sent' => $sent,
        ]);
    }

    /**
     * Get real-time badge counts (unread messages, pending interests, photo requests)
     */
    public function badgeCounts(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json([
                'unread_messages' => 0,
                'pending_interests' => 0,
                'pending_photo_requests' => 0,
                'total' => 0,
            ]);
        }

        $myConvIds = Conversation::where('profile_one_id', $profile->id)
            ->orWhere('profile_two_id', $profile->id)
            ->pluck('id');

        $unreadMessages = Message::whereIn('conversation_id', $myConvIds)
            ->where('sender_profile_id', '!=', $profile->id)
            ->where('is_read', false)
            ->count();

        $pendingInterests = Interest::where('receiver_profile_id', $profile->id)
            ->where('status', 'pending')
            ->count();

        $pendingPhotoRequests = PhotoAccessRequest::where('target_profile_id', $profile->id)
            ->where('status', 'pending')
            ->count();

        return response()->json([
            'unread_messages' => $unreadMessages,
            'pending_interests' => $pendingInterests,
            'pending_photo_requests' => $pendingPhotoRequests,
            'total' => $unreadMessages + $pendingInterests + $pendingPhotoRequests,
        ]);
    }
}
