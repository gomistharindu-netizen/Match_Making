<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminSetting;
use App\Models\BankSlip;
use App\Models\HoroscopeOrder;
use App\Models\MemberProfile;
use App\Models\PaymentOrder;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminPortalController extends Controller
{
    private function checkAccess(Request $request): ?JsonResponse
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, ['admin', 'staff'])) {
            return response()->json(['message' => 'Unauthorized. Admin or Staff access required.'], 403);
        }
        return null;
    }

    public function stats(Request $request): JsonResponse
    {
        if ($deny = $this->checkAccess($request)) return $deny;

        $totalProfiles = MemberProfile::count();
        $approvedProfiles = MemberProfile::where('publication_status', 'approved')->count();
        $pendingProfiles = MemberProfile::where('publication_status', 'pending_review')->count();

        $totalHoroscopes = HoroscopeOrder::count();
        $pendingHoroscopes = HoroscopeOrder::where('status', 'pending')->count();
        $completedHoroscopes = HoroscopeOrder::where('status', 'completed')->count();

        $pendingSlips = BankSlip::whereNull('verified_at')->count();
        $totalSlips = BankSlip::count();

        $isFreeMode = AdminSetting::get('registration_payment_required', 'false') === 'false';
        $registrationFee = AdminSetting::get('registration_fee_lkr', '3500');
        $horoscopeFee = AdminSetting::get('horoscope_fee_lkr', '2500');

        $totalUsers = User::count();
        $totalMembers = User::where('role', 'member')->count();

        return response()->json([
            'metrics' => [
                'total_profiles' => $totalProfiles,
                'approved_profiles' => $approvedProfiles,
                'pending_profiles' => $pendingProfiles,
                'total_horoscopes' => $totalHoroscopes,
                'pending_horoscopes' => $pendingHoroscopes,
                'completed_horoscopes' => $completedHoroscopes,
                'pending_slips' => $pendingSlips,
                'total_slips' => $totalSlips,
                'is_free_mode' => $isFreeMode,
                'registration_fee' => (int) $registrationFee,
                'horoscope_fee' => (int) $horoscopeFee,
                'total_users' => $totalUsers,
                'total_members' => $totalMembers,
            ],
            'recent_profiles' => MemberProfile::with('owner')->latest()->take(5)->get(),
            'recent_horoscopes' => HoroscopeOrder::latest()->take(5)->get(),
        ]);
    }

    public function profiles(Request $request): JsonResponse
    {
        if ($deny = $this->checkAccess($request)) return $deny;

        $query = MemberProfile::with(['owner', 'photos'])->latest();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('publication_status', $request->status);
        }

        if ($request->filled('gender') && $request->gender !== 'all') {
            $query->where('gender', strtolower($request->gender));
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('profile_code', 'like', "%{$s}%")
                    ->orWhere('full_name_private', 'like', "%{$s}%")
                    ->orWhere('district', 'like', "%{$s}%")
                    ->orWhere('profession', 'like', "%{$s}%");
            });
        }

        return response()->json($query->paginate($request->input('per_page', 25)));
    }

    public function updateProfileStatus(Request $request, $id): JsonResponse
    {
        if ($deny = $this->checkAccess($request)) return $deny;

        $request->validate([
            'status' => 'required|in:approved,pending_review,rejected',
        ]);

        $profile = MemberProfile::findOrFail($id);
        $profile->publication_status = $request->status;
        $profile->save();

        return response()->json([
            'success' => true,
            'message' => "Profile {$profile->profile_code} status updated to {$request->status}.",
            'profile' => $profile,
        ]);
    }

    public function horoscopeOrders(Request $request): JsonResponse
    {
        if ($deny = $this->checkAccess($request)) return $deny;

        $query = HoroscopeOrder::with(['user', 'paymentOrder'])->latest();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('order_code', 'like', "%{$s}%")
                    ->orWhere('customer_name', 'like', "%{$s}%")
                    ->orWhere('customer_phone', 'like', "%{$s}%")
                    ->orWhere('first_party_name', 'like', "%{$s}%")
                    ->orWhere('second_party_name', 'like', "%{$s}%");
            });
        }

        return response()->json($query->paginate($request->input('per_page', 25)));
    }

    public function updateHoroscopeOrder(Request $request, $id): JsonResponse
    {
        if ($deny = $this->checkAccess($request)) return $deny;

        $order = HoroscopeOrder::findOrFail($id);

        if ($request->filled('status')) {
            $request->validate([
                'status' => 'in:pending,in_analysis,completed,cancelled',
            ]);
            $order->status = $request->status;
        }

        if ($request->hasFile('report_file')) {
            $request->validate([
                'report_file' => 'file|mimes:pdf,jpg,jpeg,png|max:10240',
            ]);
            $path = $request->file('report_file')->store('horoscope_reports', 'public');
            $order->report_file_path = $path;
            $order->status = 'completed';
        }

        $order->save();

        return response()->json([
            'success' => true,
            'message' => "Horoscope Order {$order->order_code} updated successfully.",
            'order' => $order,
        ]);
    }

    public function bankSlips(Request $request): JsonResponse
    {
        if ($deny = $this->checkAccess($request)) return $deny;

        $query = BankSlip::with(['paymentOrder.user', 'verifiedBy'])->latest();

        if ($request->input('filter') === 'pending') {
            $query->whereNull('verified_at');
        } elseif ($request->input('filter') === 'verified') {
            $query->whereNotNull('verified_at');
        }

        return response()->json($query->paginate($request->input('per_page', 25)));
    }

    public function verifyBankSlip(Request $request, $id): JsonResponse
    {
        if ($deny = $this->checkAccess($request)) return $deny;

        $slip = BankSlip::with('paymentOrder')->findOrFail($id);
        $slip->verified_at = now();
        $slip->verified_by_user_id = $request->user()->id;
        $slip->save();

        if ($slip->paymentOrder) {
            $slip->paymentOrder->payment_status = 'paid';
            $slip->paymentOrder->save();
        }

        return response()->json([
            'success' => true,
            'message' => "Bank slip #{$slip->id} verified and payment marked as PAID.",
            'slip' => $slip,
        ]);
    }

    public function settings(Request $request): JsonResponse
    {
        if ($deny = $this->checkAccess($request)) return $deny;

        $all = AdminSetting::all();
        $kv = [];
        foreach ($all as $item) {
            $kv[$item->key] = $item->value;
        }

        return response()->json([
            'list' => $all,
            'dictionary' => $kv,
        ]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        if ($deny = $this->checkAccess($request)) return $deny;

        $allowedKeys = [
            'registration_payment_required',
            'registration_fee_lkr',
            'horoscope_fee_lkr',
            'agency_name',
            'agency_phone',
            'agency_email',
            'agency_bank_details',
        ];

        $data = $request->only($allowedKeys);
        foreach ($data as $key => $val) {
            AdminSetting::set($key, is_bool($val) ? ($val ? 'true' : 'false') : (string) $val);
        }

        return response()->json([
            'success' => true,
            'message' => 'System settings updated successfully.',
            'settings' => AdminSetting::all(),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        if ($deny = $this->checkAccess($request)) return $deny;

        $query = User::with('profile')->latest();

        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%")
                    ->orWhere('phone', 'like', "%{$s}%");
            });
        }

        return response()->json($query->paginate($request->input('per_page', 25)));
    }
}
