<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminSetting;
use App\Models\HoroscopeOrder;
use App\Models\MemberProfile;
use App\Models\PaymentOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PublicController extends Controller
{
    /**
     * Get system settings (Pricing, Free Mode status, Agency info)
     */
    public function settings(): JsonResponse
    {
        return response()->json([
            'registration_payment_required' => filter_var(AdminSetting::get('registration_payment_required', 'false'), FILTER_VALIDATE_BOOLEAN),
            'registration_fee_lkr' => (float) AdminSetting::get('registration_fee_lkr', '3500'),
            'horoscope_fee_lkr' => (float) AdminSetting::get('horoscope_fee_lkr', '2500'),
            'agency_name' => AdminSetting::get('agency_name', 'ජයතු ජය මංගල සේවාව (Jayathu Jaya)'),
            'agency_phone' => AdminSetting::get('agency_phone', '+94 77 123 4567'),
            'agency_email' => AdminSetting::get('agency_email', 'info@jayathujaya.lk'),
            'agency_bank_details' => AdminSetting::get('agency_bank_details', ''),
        ]);
    }

    /**
     * Browse approved profiles with search & filters (Public-safe data only)
     */
    public function profiles(Request $request): JsonResponse
    {
        $query = MemberProfile::query()
            ->where('publication_status', 'approved')
            ->where('is_paused', false);

        if ($request->filled('gender')) {
            $query->where('gender', strtolower($request->gender));
        }

        if ($request->filled('district')) {
            $query->where('district', $request->district);
        }

        if ($request->filled('religion')) {
            $query->where('religion', $request->religion);
        }

        if ($request->filled('caste')) {
            $query->where('caste', $request->caste);
        }

        if ($request->filled('profession')) {
            $query->where('profession', 'like', '%' . $request->profession . '%');
        }

        if ($request->filled('horoscope')) {
            $query->where('horoscope_available', filter_var($request->horoscope, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('age_min')) {
            $maxBirthDate = now()->subYears((int) $request->age_min)->endOfDay();
            $query->where('birth_date', '<=', $maxBirthDate);
        }

        if ($request->filled('age_max')) {
            $minBirthDate = now()->subYears((int) $request->age_max + 1)->startOfDay();
            $query->where('birth_date', '>=', $minBirthDate);
        }

        $perPage = min((int) $request->get('per_page', 12), 50);
        $paginated = $query->latest()->paginate($perPage);

        // Transform records to strip any private identifying attributes
        $data = $paginated->getCollection()->map(function ($profile) {
            return [
                'id' => $profile->id,
                'profile_code' => $profile->profile_code,
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
                'managed_by_type' => $profile->managed_by_type,
            ];
        });

        return response()->json([
            'data' => $data,
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
            'total' => $paginated->total(),
            'per_page' => $paginated->perPage(),
        ]);
    }

    /**
     * Get single profile public view
     */
    public function profileDetails(string $code): JsonResponse
    {
        $profile = MemberProfile::where('profile_code', $code)
            ->where('publication_status', 'approved')
            ->where('is_paused', false)
            ->with(['photos' => function ($q) {
                $q->where('visibility', 'public')->where('moderation_status', 'approved');
            }])
            ->first();

        if (!$profile) {
            return response()->json(['message' => 'Profile not found or is currently private'], 404);
        }

        return response()->json([
            'id' => $profile->id,
            'profile_code' => $profile->profile_code,
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
            ]),
            'managed_by_type' => $profile->managed_by_type,
        ]);
    }

    /**
     * Submit Horoscope Matching Order (Public / Non-member accessible)
     */
    public function createHoroscopeOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'first_party_name' => 'required|string|max:255',
            'first_party_birth_datetime' => 'required|date',
            'first_party_birth_place' => 'required|string|max:255',
            'second_party_name' => 'required|string|max:255',
            'second_party_birth_datetime' => 'required|date',
            'second_party_birth_place' => 'required|string|max:255',
            'payment_method' => 'required|in:payhere,bank_transfer',
            'notes' => 'nullable|string',
        ]);

        $orderCode = 'HO-' . date('Y') . '-' . strtoupper(Str::random(6));
        $horoscopeFee = (float) AdminSetting::get('horoscope_fee_lkr', '2500');

        $horoscopeOrder = HoroscopeOrder::create([
            'order_code' => $orderCode,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'first_party_name' => $validated['first_party_name'],
            'first_party_birth_datetime' => $validated['first_party_birth_datetime'],
            'first_party_birth_place' => $validated['first_party_birth_place'],
            'second_party_name' => $validated['second_party_name'],
            'second_party_birth_datetime' => $validated['second_party_birth_datetime'],
            'second_party_birth_place' => $validated['second_party_birth_place'],
            'status' => 'pending_payment',
            'notes' => $validated['notes'] ?? null,
        ]);

        $paymentOrder = PaymentOrder::create([
            'order_code' => 'PAY-' . strtoupper(Str::random(8)),
            'horoscope_order_id' => $horoscopeOrder->id,
            'service_type' => 'horoscope',
            'amount' => $horoscopeFee,
            'currency' => 'LKR',
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Horoscope matching order created successfully',
            'order_code' => $orderCode,
            'payment_order_code' => $paymentOrder->order_code,
            'amount' => $horoscopeFee,
            'payment_method' => $validated['payment_method'],
        ], 201);
    }

    /**
     * Track Horoscope Order Status
     */
    public function trackHoroscopeOrder(string $code): JsonResponse
    {
        $order = HoroscopeOrder::where('order_code', $code)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json([
            'order_code' => $order->order_code,
            'customer_name' => $order->customer_name,
            'status' => $order->status,
            'first_party_name' => $order->first_party_name,
            'second_party_name' => $order->second_party_name,
            'has_report' => !empty($order->report_file_path),
            'report_file_url' => $order->report_file_path ? url('storage/' . $order->report_file_path) : null,
            'created_at' => $order->created_at->toIso8601String(),
        ]);
    }
}
