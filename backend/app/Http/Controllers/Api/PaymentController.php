<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BankSlip;
use App\Models\HoroscopeOrder;
use App\Models\Membership;
use App\Models\PaymentOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Upload Bank Deposit Slip for verification
     */
    public function submitBankSlip(Request $request): JsonResponse
    {
        $request->validate([
            'order_code' => 'required|string',
            'bank_name' => 'required|string|max:100',
            'branch_name' => 'nullable|string|max:100',
            'deposit_date' => 'required|date',
            'reference_no' => 'nullable|string|max:100',
            'slip' => 'required|image|max:10240', // Max 10MB
            'notes' => 'nullable|string|max:500',
        ]);

        $paymentOrder = PaymentOrder::where('order_code', $request->order_code)->first();

        if (!$paymentOrder) {
            // Check if user submitted Horoscope Order code
            $horoscope = HoroscopeOrder::where('order_code', $request->order_code)->first();
            if ($horoscope) {
                $paymentOrder = $horoscope->paymentOrder;
            }
        }

        if (!$paymentOrder) {
            return response()->json(['message' => 'Payment order not found for this code'], 404);
        }

        $slipPath = $request->file('slip')->store('bank_slips', 'public');

        $slip = BankSlip::create([
            'payment_order_id' => $paymentOrder->id,
            'slip_file_path' => $slipPath,
            'bank_name' => $request->bank_name,
            'branch_name' => $request->branch_name,
            'deposit_date' => $request->deposit_date,
            'reference_no' => $request->reference_no,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Bank slip uploaded successfully. Agency staff will verify and activate your service shortly.',
            'slip_id' => $slip->id,
        ], 201);
    }

    /**
     * PayHere IPN Webhook Notification Handler
     */
    public function payhereNotify(Request $request): JsonResponse
    {
        $merchantId = $request->merchant_id;
        $orderId = $request->order_id;
        $payhereAmount = $request->payhere_amount;
        $payhereCurrency = $request->payhere_currency;
        $statusCode = $request->status_code; // 2 = success
        $md5sig = $request->md5sig;

        // Find payment order
        $paymentOrder = PaymentOrder::where('order_code', $orderId)->first();

        if (!$paymentOrder) {
            return response()->json(['status' => 'order_not_found'], 404);
        }

        if ((int) $statusCode === 2) {
            // Payment Success
            $paymentOrder->update([
                'payment_status' => 'verified',
                'gateway_transaction_id' => $request->payment_id,
            ]);

            // Handle service fulfillment
            if ($paymentOrder->service_type === 'membership' && $paymentOrder->user_id) {
                Membership::firstOrCreate(
                    ['user_id' => $paymentOrder->user_id],
                    [
                        'payment_order_id' => $paymentOrder->id,
                        'activation_source' => 'payhere',
                        'activated_at' => now(),
                    ]
                );
            } elseif ($paymentOrder->service_type === 'horoscope' && $paymentOrder->horoscope_order_id) {
                $paymentOrder->horoscopeOrder()->update([
                    'status' => 'in_review',
                ]);
            }
        }

        return response()->json(['status' => 'acknowledged']);
    }
}
