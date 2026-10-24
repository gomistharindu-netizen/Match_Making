<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminSetting;
use App\Models\MemberProfile;
use App\Models\Membership;
use App\Models\ProfilePhoto;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new member
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'required|string|max:50|unique:users,phone',
            'password' => 'required|string|min:6',
            'gender' => 'required|in:bride,groom',
            'birth_date' => 'required|date',
            'district' => 'required|string|max:100',
            'city' => 'nullable|string|max:100',
            'religion' => 'required|string|max:100',
            'caste' => 'nullable|string|max:100',
            'education_level' => 'required|string|max:255',
            'profession' => 'required|string|max:255',
            'managed_by_type' => 'nullable|in:self,father,mother,guardian',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => 'member',
            'account_status' => 'active',
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
        ]);

        // Generate sequential Profile Code e.g. JJ-2026-009
        $latestId = MemberProfile::max('id') ?? 0;
        $profileCode = 'JJ-' . date('Y') . '-' . str_pad($latestId + 1, 3, '0', STR_PAD_LEFT);

        $profile = MemberProfile::create([
            'owner_user_id' => $user->id,
            'profile_code' => $profileCode,
            'full_name_private' => $validated['name'],
            'gender' => $validated['gender'],
            'birth_date' => $validated['birth_date'],
            'district' => $validated['district'],
            'city' => $validated['city'] ?? null,
            'religion' => $validated['religion'],
            'caste' => $validated['caste'] ?? null,
            'education_level' => $validated['education_level'],
            'profession' => $validated['profession'],
            'publication_status' => 'approved', // Auto approved in initial test/free mode, or pending moderation
            'managed_by_type' => $validated['managed_by_type'] ?? 'self',
        ]);

        // Handle uploaded photo or photo URL if present
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('profile_photos', 'public');
            $photoUrl = url('storage/' . $path);
            $profile->update(['primary_photo_url' => $photoUrl]);

            ProfilePhoto::create([
                'profile_id' => $profile->id,
                'file_path' => $photoUrl,
                'visibility' => 'public',
                'moderation_status' => 'approved',
                'is_primary' => true,
                'sort_order' => 1,
            ]);
        } elseif ($request->filled('photo_url')) {
            $profile->update(['primary_photo_url' => $request->photo_url]);
            ProfilePhoto::create([
                'profile_id' => $profile->id,
                'file_path' => $request->photo_url,
                'visibility' => 'public',
                'moderation_status' => 'approved',
                'is_primary' => true,
                'sort_order' => 1,
            ]);
        }

        // Check Free Mode vs Paid Mode requirement
        $paymentRequired = filter_var(AdminSetting::get('registration_payment_required', 'false'), FILTER_VALIDATE_BOOLEAN);

        if (!$paymentRequired) {
            // Free Mode: Immediate Lifetime Activation with Full Feature Parity
            Membership::create([
                'user_id' => $user->id,
                'activation_source' => 'free_mode',
                'activated_at' => now(),
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_active_member' => !$paymentRequired,
            ],
            'profile' => [
                'id' => $profile->id,
                'profile_code' => $profile->profile_code,
            ],
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'login' => 'required|string', // Email or Phone
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->login)
            ->orWhere('phone', $request->login)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['These credentials do not match our records.'],
            ]);
        }

        if ($user->account_status === 'suspended') {
            return response()->json(['message' => 'Your account has been suspended. Please contact agency support.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $hasMembership = $user->membership()->exists();

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_active_member' => $hasMembership,
            ],
            'profile' => $user->profile ? [
                'id' => $user->profile->id,
                'profile_code' => $user->profile->profile_code,
                'gender' => $user->profile->gender,
                'primary_photo_url' => $user->profile->primary_photo_url,
            ] : null,
        ]);
    }

    /**
     * Get authenticated user profile & membership state
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profile;
        $membership = $user->membership;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'account_status' => $user->account_status,
                'is_active_member' => !is_null($membership),
                'membership_source' => $membership ? $membership->activation_source : null,
            ],
            'profile' => $profile ? [
                'id' => $profile->id,
                'profile_code' => $profile->profile_code,
                'full_name_private' => $profile->full_name_private,
                'gender' => $profile->gender,
                'age' => $profile->age,
                'birth_date' => $profile->birth_date->format('Y-m-d'),
                'district' => $profile->district,
                'city' => $profile->city,
                'country' => $profile->country,
                'residence_status' => $profile->residence_status,
                'religion' => $profile->religion,
                'caste' => $profile->caste,
                'height_feet' => $profile->height_feet,
                'height_inches' => $profile->height_inches,
                'education_level' => $profile->education_level,
                'profession' => $profile->profession,
                'employed_in' => $profile->employed_in,
                'monthly_income_lkr' => $profile->monthly_income_lkr,
                'family_background' => $profile->family_background,
                'partner_preferences' => $profile->partner_preferences,
                'horoscope_available' => $profile->horoscope_available,
                'primary_photo_url' => $profile->primary_photo_url,
                'photos' => $profile->photos->map(fn($p) => [
                    'id' => $p->id,
                    'url' => $p->file_path,
                    'is_primary' => $p->is_primary,
                    'visibility' => $p->visibility,
                ]),
                'publication_status' => $profile->publication_status,
                'managed_by_type' => $profile->managed_by_type,
                'is_paused' => $profile->is_paused,
            ] : null,
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
