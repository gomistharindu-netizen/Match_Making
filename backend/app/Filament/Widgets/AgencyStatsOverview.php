<?php

namespace App\Filament\Widgets;

use App\Models\AdminSetting;
use App\Models\BankSlip;
use App\Models\HoroscopeOrder;
use App\Models\MemberProfile;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AgencyStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $totalProfiles = MemberProfile::count();
        $approvedProfiles = MemberProfile::where('publication_status', 'approved')->count();
        $pendingProfiles = MemberProfile::where('publication_status', 'pending_review')->count();

        $totalHoroscopes = HoroscopeOrder::count();
        $pendingHoroscopes = HoroscopeOrder::where('status', 'pending')->count();

        $pendingSlips = BankSlip::whereNull('verified_at')->count();

        $isFreeMode = AdminSetting::get('registration_payment_required', 'false') === 'false';
        $registrationFee = AdminSetting::get('registration_fee_lkr', '3500');

        return [
            Stat::make('මංගල යෝජනා (Member Profiles)', (string) $totalProfiles)
                ->description("අනුමත: {$approvedProfiles} | අනුමැතිය බලාපොරොත්තු: {$pendingProfiles}")
                ->descriptionIcon(Heroicon::OutlinedUsers)
                ->color($pendingProfiles > 0 ? 'warning' : 'primary')
                ->chart([3, 5, 7, 6, 8, $totalProfiles]),

            Stat::make('කේන්ද්‍ර පරීක්ෂා (Horoscope Orders)', (string) $totalHoroscopes)
                ->description($pendingHoroscopes > 0 ? "ජ්‍යොතිෂ සමාලෝචනයට: {$pendingHoroscopes}" : "සියලු වාර්තා සම්පූර්ණයි")
                ->descriptionIcon(Heroicon::OutlinedSparkles)
                ->color($pendingHoroscopes > 0 ? 'warning' : 'success')
                ->chart([1, 2, 2, 3, 4, $totalHoroscopes]),

            Stat::make('බැංකු රිසිට්පත් (Bank Slips)', (string) $pendingSlips)
                ->description($pendingSlips > 0 ? 'තහවුරු කිරීමට ඉතිරිව ඇත' : 'සියලු ගෙවීම් පරීක්ෂා කර ඇත')
                ->descriptionIcon(Heroicon::OutlinedBanknotes)
                ->color($pendingSlips > 0 ? 'danger' : 'success'),

            Stat::make('ලියාපදිංචි මාදිලිය (System Mode)', $isFreeMode ? 'FREE MODE (නොමිලේ)' : 'PAID MODE (ගෙවීම් සහිතයි)')
                ->description($isFreeMode ? 'සියලු දෙනාට නොමිලේ ලියාපදිංචිය' : "ගාස්තුව: LKR {$registrationFee}")
                ->descriptionIcon(Heroicon::OutlinedHeart)
                ->color($isFreeMode ? 'success' : 'primary'),
        ];
    }
}
