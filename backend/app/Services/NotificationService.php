<?php

namespace App\Services;

use App\Models\AdminSetting;
use App\Models\HoroscopeOrder;
use App\Models\MemberProfile;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send SMS Alert to a Sri Lankan phone number
     */
    public function sendSms(string $phone, string $message): bool
    {
        $normalizedPhone = $this->normalizePhoneNumber($phone);
        $agencyName = AdminSetting::get('agency_name', 'ජයතු ජය මංගල සේවාව');

        // Log the SMS notification
        Log::info("[SMS NOTIFICATION] To: {$normalizedPhone} | Agency: {$agencyName} | Body: {$message}");

        // Notify.lk integration if API credentials exist
        $apiKey = config('services.notifylk.api_key');
        $userId = config('services.notifylk.user_id');
        $senderId = config('services.notifylk.sender_id', 'JayathuJaya');

        if ($apiKey && $userId) {
            try {
                $response = Http::post('https://app.notify.lk/api/v1/send', [
                    'user_id' => $userId,
                    'api_key' => $apiKey,
                    'sender_id' => $senderId,
                    'to' => $normalizedPhone,
                    'message' => $message,
                ]);
                return $response->successful();
            } catch (\Exception $e) {
                Log::error("Notify.lk SMS dispatch failed: " . $e->getMessage());
            }
        }

        return true;
    }

    /**
     * Alert member when someone expresses interest
     */
    public function notifyInterestReceived(User $receiver, MemberProfile $senderProfile): void
    {
        if ($receiver->phone) {
            $msg = "ජයතු ජය (Jayathu Jaya): {$senderProfile->profile_code} සාමාජිකයා ඔබට මංගල යෝජනා කැමැත්ත පළකර ඇත. වැඩිදුර විස්තර බැලීමට ගිණුමට ඇතුල් වන්න: " . url('/login?redirect=/messages');
            $this->sendSms($receiver->phone, $msg);
        }
    }

    /**
     * Alert member when bank payment is verified and membership is activated
     */
    public function notifyMembershipActivated(User $member): void
    {
        if ($member->phone) {
            $msg = "සුබ පැතුම්! ඔබගේ ජයතු ජය ජීවිත කාලීන සාමාජිකත්වය සක්‍රිය විය. දැන්ම සාමාජිකයින්ට පණිවිඩ යවන්න: " . url('/browse');
            $this->sendSms($member->phone, $msg);
        }
    }

    /**
     * Alert member when contact details are released
     */
    public function notifyContactReleased(User $grantee, MemberProfile $grantorProfile): void
    {
        if ($grantee->phone) {
            $msg = "ජයතු ජය: {$grantorProfile->profile_code} සාමාජිකයා සිය දුරකථන අංක හුවමාරුව අනුමත කරන ලදී. Chat එක වෙත පිවිසෙන්න: " . url('/messages');
            $this->sendSms($grantee->phone, $msg);
        }
    }

    /**
     * Alert horoscope customer when completed PDF report is ready for download
     */
    public function notifyHoroscopeReportReady(HoroscopeOrder $order): void
    {
        if ($order->customer_phone) {
            $trackUrl = url('/horoscope?track=' . $order->order_code);
            $msg = "ජයතු ජය: ඔබගේ {$order->order_code} කේන්ද්‍ර ගැලපීමේ වාර්තාව සූදානම් කර ඇත. මෙම සබැඳියෙන් වාර්තාව බාගත කරගන්න: {$trackUrl}";
            $this->sendSms($order->customer_phone, $msg);
        }
    }

    /**
     * Send Phone OTP verification SMS
     */
    public function notifyOtpCode(string $phone, string $otpCode): bool
    {
        $message = "ඔබගේ ජයතු ජය සත්‍යාපන කේතය (OTP): {$otpCode} වේ. මෙය විනාඩි 5ක් වලංගුය. Jayathu Jaya verification code: {$otpCode}";
        return $this->sendSms($phone, $message);
    }

    /**
     * Standardize SL Phone number format (+947XXXXXXXX)
     */
    private function normalizePhoneNumber(string $phone): string
    {
        $cleaned = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($cleaned, '0')) {
            return '94' . substr($cleaned, 1);
        }

        if (!str_starts_with($cleaned, '94') && strlen($cleaned) === 9) {
            return '94' . $cleaned;
        }

        return $cleaned;
    }
}
