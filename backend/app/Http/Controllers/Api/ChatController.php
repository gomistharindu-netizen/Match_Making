<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactRelease;
use App\Models\Conversation;
use App\Models\Interest;
use App\Models\MemberProfile;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Get all conversations for current logged-in member
     */
    public function conversations(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $conversations = Conversation::where('profile_one_id', $profile->id)
            ->orWhere('profile_two_id', $profile->id)
            ->with(['profileOne.owner', 'profileTwo.owner', 'interest'])
            ->orderBy('last_message_at', 'desc')
            ->get();

        $data = $conversations->map(function ($conv) use ($profile) {
            $isProfileOne = $conv->profile_one_id === $profile->id;
            $partnerProfile = $isProfileOne ? $conv->profileTwo : $conv->profileOne;

            $lastMsg = Message::where('conversation_id', $conv->id)->latest()->first();
            $unreadCount = Message::where('conversation_id', $conv->id)
                ->where('sender_profile_id', '!=', $profile->id)
                ->where('is_read', false)
                ->count();

            // Check if partner has released contact to me
            $contactReleasedToMe = ContactRelease::where('grantor_profile_id', $partnerProfile->id)
                ->where('grantee_profile_id', $profile->id)
                ->where('status', 'approved')
                ->exists();

            // Check if I released contact to partner
            $contactReleasedByMe = ContactRelease::where('grantor_profile_id', $profile->id)
                ->where('grantee_profile_id', $partnerProfile->id)
                ->where('status', 'approved')
                ->exists();

            return [
                'id' => $conv->id,
                'interest_id' => $conv->interest_id,
                'partner' => [
                    'id' => $partnerProfile->id,
                    'profile_code' => $partnerProfile->profile_code,
                    'display_name' => $partnerProfile->profile_code . ' (' . ucfirst($partnerProfile->gender) . ')',
                    'profession' => $partnerProfile->profession,
                    'district' => $partnerProfile->district,
                    'primary_photo_url' => $partnerProfile->primary_photo_url,
                    'contact_phone' => $contactReleasedToMe ? $partnerProfile->owner?->phone : null,
                ],
                'last_message' => $lastMsg ? $lastMsg->message_body : null,
                'last_message_at' => $lastMsg ? $lastMsg->created_at->toIso8601String() : null,
                'unread_count' => $unreadCount,
                'contact_released_to_me' => $contactReleasedToMe,
                'contact_released_by_me' => $contactReleasedByMe,
            ];
        });

        return response()->json($data);
    }

    /**
     * Get messages for a conversation
     */
    public function messages(Request $request, int $id): JsonResponse
    {
        $profile = $request->user()->profile;

        if (!$profile) {
            return response()->json(['message' => 'Member profile required to access messages'], 400);
        }

        $conv = Conversation::where('id', $id)
            ->where(function ($q) use ($profile) {
                $q->where('profile_one_id', $profile->id)
                  ->orWhere('profile_two_id', $profile->id);
            })
            ->firstOrFail();

        // Mark unread messages as read
        Message::where('conversation_id', $conv->id)
            ->where('sender_profile_id', '!=', $profile->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        $messages = Message::where('conversation_id', $conv->id)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($msg) use ($profile) {
                return [
                    'id' => $msg->id,
                    'sender_id' => $msg->sender_profile_id,
                    'is_me' => $msg->sender_profile_id === $profile->id,
                    'message' => $msg->message_body,
                    'time' => $msg->created_at->format('g:i A'),
                    'created_at' => $msg->created_at->toIso8601String(),
                    'is_read' => $msg->is_read,
                ];
            });

        return response()->json($messages);
    }

    /**
     * Send message in a conversation
     */
    public function sendMessage(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $profile = $request->user()->profile;

        if (!$profile) {
            return response()->json(['message' => 'Member profile required to send messages'], 400);
        }

        $conv = Conversation::where('id', $id)
            ->where(function ($q) use ($profile) {
                $q->where('profile_one_id', $profile->id)
                  ->orWhere('profile_two_id', $profile->id);
            })
            ->firstOrFail();

        $msg = Message::create([
            'conversation_id' => $conv->id,
            'sender_profile_id' => $profile->id,
            'message_body' => $request->message,
            'is_read' => false,
        ]);

        $conv->update(['last_message_at' => now()]);

        return response()->json([
            'id' => $msg->id,
            'sender_id' => $msg->sender_profile_id,
            'is_me' => true,
            'message' => $msg->message_body,
            'time' => $msg->created_at->format('g:i A'),
            'created_at' => $msg->created_at->toIso8601String(),
        ], 201);
    }

    /**
     * Express Interest to a profile
     */
    public function sendInterest(Request $request): JsonResponse
    {
        $request->validate([
            'target_profile_code' => 'required|string',
        ]);

        $myProfile = $request->user()->profile;

        if (!$myProfile) {
            return response()->json(['message' => 'Please complete your profile first'], 400);
        }

        $targetProfile = MemberProfile::where('profile_code', $request->target_profile_code)
            ->where('publication_status', 'approved')
            ->firstOrFail();

        if ($targetProfile->id === $myProfile->id) {
            return response()->json(['message' => 'You cannot send interest to your own profile'], 400);
        }

        $existing = Interest::where('sender_profile_id', $myProfile->id)
            ->where('receiver_profile_id', $targetProfile->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already sent an interest to this profile', 'status' => $existing->status], 409);
        }

        $interest = Interest::create([
            'sender_profile_id' => $myProfile->id,
            'receiver_profile_id' => $targetProfile->id,
            'status' => 'pending',
            'sent_at' => now(),
        ]);

        return response()->json([
            'message' => 'Interest expressed successfully',
            'interest_id' => $interest->id,
            'status' => $interest->status,
        ], 201);
    }

    /**
     * Respond to an interest (Accept, Decline, Block)
     */
    public function respondInterest(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'response' => 'required|in:accepted,declined,blocked',
        ]);

        $myProfile = $request->user()->profile;

        if (!$myProfile) {
            return response()->json(['message' => 'Member profile required to respond to interest'], 400);
        }

        $interest = Interest::where('id', $id)
            ->where('receiver_profile_id', $myProfile->id)
            ->firstOrFail();

        $interest->update([
            'status' => $request->response,
            'responded_at' => now(),
        ]);

        // If accepted, automatically open conversation
        if ($request->response === 'accepted') {
            $conversation = Conversation::firstOrCreate(
                ['interest_id' => $interest->id],
                [
                    'profile_one_id' => $interest->sender_profile_id,
                    'profile_two_id' => $interest->receiver_profile_id,
                    'last_message_at' => now(),
                ]
            );

            return response()->json([
                'message' => 'Interest accepted! Conversation channel opened.',
                'status' => 'accepted',
                'conversation_id' => $conversation->id,
            ]);
        }

        return response()->json([
            'message' => 'Interest updated',
            'status' => $request->response,
        ]);
    }

    /**
     * Owner-approved Contact Release
     */
    public function grantContact(Request $request, int $conversationId): JsonResponse
    {
        $myProfile = $request->user()->profile;

        if (!$myProfile) {
            return response()->json(['message' => 'Member profile required to grant contact access'], 400);
        }

        $conv = Conversation::where('id', $conversationId)
            ->where(function ($q) use ($myProfile) {
                $q->where('profile_one_id', $myProfile->id)
                  ->orWhere('profile_two_id', $myProfile->id);
            })
            ->firstOrFail();

        $partnerProfileId = $conv->profile_one_id === $myProfile->id
            ? $conv->profile_two_id
            : $conv->profile_one_id;

        $release = ContactRelease::updateOrCreate(
            [
                'grantor_profile_id' => $myProfile->id,
                'grantee_profile_id' => $partnerProfileId,
            ],
            [
                'status' => 'approved',
                'released_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Contact details released to partner',
            'released_at' => $release->released_at->toIso8601String(),
        ]);
    }
}
