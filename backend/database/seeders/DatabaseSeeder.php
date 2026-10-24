<?php

namespace Database\Seeders;

use App\Models\AdminSetting;
use App\Models\BankSlip;
use App\Models\ContactRelease;
use App\Models\Conversation;
use App\Models\HoroscopeOrder;
use App\Models\Interest;
use App\Models\MemberProfile;
use App\Models\Membership;
use App\Models\Message;
use App\Models\PaymentOrder;
use App\Models\ProfilePhoto;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin Settings
        AdminSetting::set('registration_payment_required', 'false', 'Enable/disable mandatory registration fee (Free Mode)');
        AdminSetting::set('registration_fee_lkr', '3500', 'One-time registration fee in LKR');
        AdminSetting::set('horoscope_fee_lkr', '2500', 'Horoscope matching fee in LKR');
        AdminSetting::set('agency_name', 'ජයතු ජය මංගල සේවාව (Jayathu Jaya)', 'Official agency brand name');
        AdminSetting::set('agency_phone', '+94 77 123 4567', 'Agency hotline number');
        AdminSetting::set('agency_email', 'info@jayathujaya.lk', 'Agency email address');
        AdminSetting::set('agency_bank_details', "Bank of Ceylon\nAccount Name: Jayathu Jaya Services\nAccount Number: 87654321\nBranch: Colombo Fort", 'Bank deposit instructions');

        // 2. Admin & Staff Users
        $admin = User::create([
            'name' => 'Agency Administrator',
            'email' => 'admin@jayathujaya.lk',
            'phone' => '+94770000001',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'account_status' => 'active',
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
        ]);

        $staff = User::create([
            'name' => 'Agency Reviewer',
            'email' => 'staff@jayathujaya.lk',
            'phone' => '+94770000002',
            'password' => Hash::make('staff123'),
            'role' => 'staff',
            'account_status' => 'active',
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
        ]);

        // 3. Realistic Member Profiles
        $candidates = [
            [
                'name' => 'Kasun Perera',
                'email' => 'kasun@gmail.com',
                'phone' => '+94711111111',
                'code' => 'JJ-2026-001',
                'gender' => 'groom',
                'birth_date' => Carbon::now()->subYears(28)->format('Y-m-d'),
                'district' => 'Colombo',
                'city' => 'Nugegoda',
                'country' => 'Sri Lanka',
                'residence_status' => 'Citizen',
                'religion' => 'Buddhist',
                'caste' => 'Govigama',
                'height_feet' => 5,
                'height_inches' => 9,
                'education_level' => 'BSc in Computer Science (Moratuwa)',
                'profession' => 'Senior Software Engineer',
                'employed_in' => 'Private',
                'monthly_income_lkr' => '450,000+',
                'family_background' => 'Respectable family from Colombo. Father is a retired school principal, Mother is a teacher.',
                'partner_preferences' => 'Looking for an educated, kind-hearted Buddhist partner from Colombo or Western Province.',
                'horoscope_available' => true,
                'primary_photo_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
                'managed_by_type' => 'self',
            ],
            [
                'name' => 'Tharushi Fernando',
                'email' => 'tharushi@gmail.com',
                'phone' => '+94722222222',
                'code' => 'JJ-2026-002',
                'gender' => 'bride',
                'birth_date' => Carbon::now()->subYears(26)->format('Y-m-d'),
                'district' => 'Kandy',
                'city' => 'Peradeniya',
                'country' => 'Sri Lanka',
                'residence_status' => 'Citizen',
                'religion' => 'Buddhist',
                'caste' => 'Govigama',
                'height_feet' => 5,
                'height_inches' => 4,
                'education_level' => 'MBBS (Peradeniya)',
                'profession' => 'Medical Doctor',
                'employed_in' => 'Government',
                'monthly_income_lkr' => '250,000+',
                'family_background' => 'Traditional Buddhist family from Kandy. Father is an Attorney-at-Law, Mother is a homemaker.',
                'partner_preferences' => 'Seeking a professionally qualified, well-mannered gentleman with sober habits.',
                'horoscope_available' => true,
                'primary_photo_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
                'managed_by_type' => 'mother',
            ],
            [
                'name' => 'Dinuka Jayasuriya',
                'email' => 'dinuka@gmail.com',
                'phone' => '+94733333333',
                'code' => 'JJ-2026-003',
                'gender' => 'groom',
                'birth_date' => Carbon::now()->subYears(30)->format('Y-m-d'),
                'district' => 'Gampaha',
                'city' => 'Kelaniya',
                'country' => 'Sri Lanka',
                'residence_status' => 'Citizen',
                'religion' => 'Buddhist',
                'caste' => 'Govigama',
                'height_feet' => 5,
                'height_inches' => 10,
                'education_level' => 'BSc Civil Engineering (Peradeniya)',
                'profession' => 'Chartered Civil Engineer',
                'employed_in' => 'Private',
                'monthly_income_lkr' => '500,000+',
                'family_background' => 'Family owns a successful construction business in Western Province.',
                'partner_preferences' => 'Seeking an educated Buddhist partner who appreciates family values.',
                'horoscope_available' => true,
                'primary_photo_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
                'managed_by_type' => 'self',
            ],
            [
                'name' => 'Sachini Alwis',
                'email' => 'sachini@gmail.com',
                'phone' => '+94744444444',
                'code' => 'JJ-2026-004',
                'gender' => 'bride',
                'birth_date' => Carbon::now()->subYears(27)->format('Y-m-d'),
                'district' => 'Kurunegala',
                'city' => 'Kurunegala Town',
                'country' => 'Sri Lanka',
                'residence_status' => 'Citizen',
                'religion' => 'Buddhist',
                'caste' => 'Govigama',
                'height_feet' => 5,
                'height_inches' => 3,
                'education_level' => 'BCom (Sri Jayewardenepura), ACCA Passed Finalist',
                'profession' => 'Senior Financial Accountant',
                'employed_in' => 'Private',
                'monthly_income_lkr' => '300,000+',
                'family_background' => 'Well-connected family from Kurunegala. Both parents are retired civil servants.',
                'partner_preferences' => 'Seeking an educated groom from a respectable family background.',
                'horoscope_available' => true,
                'primary_photo_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
                'managed_by_type' => 'father',
            ],
            [
                'name' => 'Roshan Silva',
                'email' => 'roshan@gmail.com',
                'phone' => '+61412345678',
                'code' => 'JJ-2026-005',
                'gender' => 'groom',
                'birth_date' => Carbon::now()->subYears(31)->format('Y-m-d'),
                'district' => 'Overseas',
                'city' => 'Melbourne',
                'country' => 'Australia',
                'residence_status' => 'Permanent Resident',
                'religion' => 'Buddhist',
                'caste' => 'Govigama',
                'height_feet' => 5,
                'height_inches' => 11,
                'education_level' => 'Masters in Information Systems (Melbourne Uni)',
                'profession' => 'Cloud Solutions Architect',
                'employed_in' => 'Overseas',
                'monthly_income_lkr' => '1,800,000 (AUD Equivalent)',
                'family_background' => 'Family originally from Galle. Parents now reside in Colombo.',
                'partner_preferences' => 'Seeking a bride willing to relocate to Australia. Professional background preferred.',
                'horoscope_available' => true,
                'primary_photo_url' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
                'managed_by_type' => 'self',
            ],
            [
                'name' => 'Dilini Wickramasinghe',
                'email' => 'dilini@gmail.com',
                'phone' => '+94755555555',
                'code' => 'JJ-2026-006',
                'gender' => 'bride',
                'birth_date' => Carbon::now()->subYears(29)->format('Y-m-d'),
                'district' => 'Matara',
                'city' => 'Matara Town',
                'country' => 'Sri Lanka',
                'residence_status' => 'Citizen',
                'religion' => 'Buddhist',
                'caste' => 'Govigama',
                'height_feet' => 5,
                'height_inches' => 5,
                'education_level' => 'MSc in Molecular Biology (Colombo)',
                'profession' => 'University Senior Lecturer',
                'employed_in' => 'Government',
                'monthly_income_lkr' => '280,000+',
                'family_background' => 'Eminent family from Southern province.',
                'partner_preferences' => 'Looking for an intellectually compatible and caring partner.',
                'horoscope_available' => true,
                'primary_photo_url' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
                'managed_by_type' => 'self',
            ],
        ];

        $createdProfiles = [];

        foreach ($candidates as $cand) {
            $user = User::create([
                'name' => $cand['name'],
                'email' => $cand['email'],
                'phone' => $cand['phone'],
                'password' => Hash::make('secret123'),
                'role' => 'member',
                'account_status' => 'active',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
            ]);

            // Membership (Lifetime)
            Membership::create([
                'user_id' => $user->id,
                'activation_source' => 'free_mode',
                'activated_at' => now(),
            ]);

            // MemberProfile
            $profile = MemberProfile::create([
                'owner_user_id' => $user->id,
                'profile_code' => $cand['code'],
                'full_name_private' => $cand['name'],
                'gender' => $cand['gender'],
                'birth_date' => $cand['birth_date'],
                'district' => $cand['district'],
                'city' => $cand['city'],
                'country' => $cand['country'],
                'residence_status' => $cand['residence_status'],
                'religion' => $cand['religion'],
                'caste' => $cand['caste'],
                'height_feet' => $cand['height_feet'],
                'height_inches' => $cand['height_inches'],
                'education_level' => $cand['education_level'],
                'profession' => $cand['profession'],
                'employed_in' => $cand['employed_in'],
                'monthly_income_lkr' => $cand['monthly_income_lkr'],
                'family_background' => $cand['family_background'],
                'partner_preferences' => $cand['partner_preferences'],
                'horoscope_available' => $cand['horoscope_available'],
                'primary_photo_url' => $cand['primary_photo_url'],
                'publication_status' => 'approved',
                'managed_by_type' => $cand['managed_by_type'],
                'is_paused' => false,
            ]);

            ProfilePhoto::create([
                'profile_id' => $profile->id,
                'file_path' => $cand['primary_photo_url'],
                'visibility' => 'public',
                'moderation_status' => 'approved',
                'is_primary' => true,
                'sort_order' => 1,
            ]);

            $createdProfiles[$cand['code']] = $profile;
        }

        // 4. Sample Interest & Conversation (Between JJ-001 and JJ-002)
        $profile1 = $createdProfiles['JJ-2026-001'];
        $profile2 = $createdProfiles['JJ-2026-002'];

        $interest = Interest::create([
            'sender_profile_id' => $profile1->id,
            'receiver_profile_id' => $profile2->id,
            'status' => 'accepted',
            'sent_at' => now()->subDays(2),
            'responded_at' => now()->subDay(),
        ]);

        $conversation = Conversation::create([
            'interest_id' => $interest->id,
            'profile_one_id' => $profile1->id,
            'profile_two_id' => $profile2->id,
            'last_message_at' => now()->subMinutes(15),
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_profile_id' => $profile1->id,
            'message_body' => 'ආයුබෝවන්, මගේ නම කසුන්. ඔබගේ Profile එක දුටු පසු මා දැඩි කැමැත්තක් දැක්වූවා. කතාබහ කිරීමට අවස්ථාවක් ලැබේද?',
            'is_read' => true,
            'read_at' => now()->subHours(5),
            'created_at' => now()->subHours(6),
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_profile_id' => $profile2->id,
            'message_body' => 'ආයුබෝවන් කසුන්! ස්තුතියි. මගේ දෙමාපියන් සමඟද ඔබගේ තොරතුරු සාකච්ඡා කළා. අපට මෙහි කතාබහ කර හඳුනාගත හැක.',
            'is_read' => true,
            'read_at' => now()->subHours(3),
            'created_at' => now()->subHours(4),
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_profile_id' => $profile1->id,
            'message_body' => 'ස්තුතියි තරුෂි! මගේ හඳහන පිටපතද Agency එකට ලබා දී තිබෙනවා. අපට අවශ්‍ය නම් Horoscope Match එකක්ද පරීක්ෂා කර බැලිය හැක.',
            'is_read' => false,
            'created_at' => now()->subMinutes(15),
        ]);

        // Contact Release
        ContactRelease::create([
            'grantor_profile_id' => $profile2->id,
            'grantee_profile_id' => $profile1->id,
            'status' => 'approved',
            'released_at' => now()->subHour(),
        ]);

        // 5. Sample Paid Horoscope Order
        $horoscopeOrder = HoroscopeOrder::create([
            'order_code' => 'HO-2026-001',
            'customer_name' => 'W. M. Bandara',
            'customer_email' => 'bandara@gmail.com',
            'customer_phone' => '+94779876543',
            'first_party_name' => 'Kamal Bandara',
            'first_party_birth_datetime' => Carbon::create(1995, 5, 12, 14, 30),
            'first_party_birth_place' => 'Galle',
            'second_party_name' => 'Nadeeka Perera',
            'second_party_birth_datetime' => Carbon::create(1997, 8, 24, 6, 45),
            'second_party_birth_place' => 'Matara',
            'status' => 'in_review',
            'assigned_astrologer_user_id' => $staff->id,
            'notes' => 'Urgent matching required before weekend auspicious time decision.',
        ]);

        $paymentOrder = PaymentOrder::create([
            'order_code' => 'PAY-2026-001',
            'horoscope_order_id' => $horoscopeOrder->id,
            'service_type' => 'horoscope',
            'amount' => 2500.00,
            'currency' => 'LKR',
            'payment_method' => 'bank_transfer',
            'payment_status' => 'verified',
            'notes' => 'Slip verified by staff.',
        ]);

        BankSlip::create([
            'payment_order_id' => $paymentOrder->id,
            'slip_file_path' => 'slips/sample_slip_001.jpg',
            'bank_name' => 'Bank of Ceylon',
            'branch_name' => 'Galle Fort',
            'deposit_date' => Carbon::now()->subDay(),
            'reference_no' => 'BOC-998822',
            'verified_by_user_id' => $staff->id,
            'verified_at' => Carbon::now()->subHours(10),
            'notes' => 'Direct deposit verified in BOC account statement.',
        ]);
    }
}
