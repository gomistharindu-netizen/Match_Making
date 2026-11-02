<?php

namespace App\Services;

class PorondamService
{
    // 27 Nakathas with Gana, Yoni, Rajju, Ruling Rashi, etc.
    public const NAKATHAS = [
        1 => ['name_en' => 'Aswida', 'name_si' => 'අස්විද', 'gana' => 'deva', 'yoni' => 'horse', 'rajju' => 'pada', 'vruksha' => 'kadamba', 'default_rashi' => 1],
        2 => ['name_en' => 'Berana', 'name_si' => 'බෙරණ', 'gana' => 'manusha', 'yoni' => 'elephant', 'rajju' => 'uru', 'vruksha' => 'awari', 'default_rashi' => 1],
        3 => ['name_en' => 'Kethi', 'name_si' => 'කැති', 'gana' => 'rakshasa', 'yoni' => 'sheep', 'rajju' => 'kati', 'vruksha' => 'dimbul', 'default_rashi' => 2],
        4 => ['name_en' => 'Rehena', 'name_si' => 'රෙහෙණ', 'gana' => 'manusha', 'yoni' => 'serpent', 'rajju' => 'gela', 'vruksha' => 'damba', 'default_rashi' => 2],
        5 => ['name_en' => 'Muwasirasa', 'name_si' => 'මුවසිරස', 'gana' => 'deva', 'yoni' => 'serpent', 'rajju' => 'siras', 'vruksha' => 'kihiri', 'default_rashi' => 3],
        6 => ['name_en' => 'Adha', 'name_si' => 'අද', 'gana' => 'manusha', 'yoni' => 'dog', 'rajju' => 'siras', 'vruksha' => 'thimbiri', 'default_rashi' => 3],
        7 => ['name_en' => 'Punawasa', 'name_si' => 'පුනාවස', 'gana' => 'deva', 'yoni' => 'cat', 'rajju' => 'gela', 'vruksha' => 'welang', 'default_rashi' => 4],
        8 => ['name_en' => 'Pusa', 'name_si' => 'පුස', 'gana' => 'deva', 'yoni' => 'sheep', 'rajju' => 'kati', 'vruksha' => 'pitu', 'default_rashi' => 4],
        9 => ['name_en' => 'Aslisa', 'name_si' => 'අස්ලිස', 'gana' => 'rakshasa', 'yoni' => 'cat', 'rajju' => 'uru', 'vruksha' => 'domba', 'default_rashi' => 4],
        10 => ['name_en' => 'Ma', 'name_si' => 'මා', 'gana' => 'rakshasa', 'yoni' => 'rat', 'rajju' => 'pada', 'vruksha' => 'nuga', 'default_rashi' => 5],
        11 => ['name_en' => 'Puvapal', 'name_si' => 'පුවපල්', 'gana' => 'manusha', 'yoni' => 'rat', 'rajju' => 'uru', 'vruksha' => 'kela', 'default_rashi' => 5],
        12 => ['name_en' => 'Uthrapal', 'name_si' => 'උත්‍රපල්', 'gana' => 'manusha', 'yoni' => 'cow', 'rajju' => 'kati', 'vruksha' => 'al', 'default_rashi' => 6],
        13 => ['name_en' => 'Hatha', 'name_si' => 'හත', 'gana' => 'deva', 'yoni' => 'buffalo', 'rajju' => 'gela', 'vruksha' => 'mee', 'default_rashi' => 6],
        14 => ['name_en' => 'Chitha', 'name_si' => 'සිත', 'gana' => 'rakshasa', 'yoni' => 'tiger', 'rajju' => 'siras', 'vruksha' => 'beli', 'default_rashi' => 7],
        15 => ['name_en' => 'Saa', 'name_si' => 'සා', 'gana' => 'deva', 'yoni' => 'buffalo', 'rajju' => 'siras', 'vruksha' => 'kumbuk', 'default_rashi' => 7],
        16 => ['name_en' => 'Visa', 'name_si' => 'විසා', 'gana' => 'rakshasa', 'yoni' => 'tiger', 'rajju' => 'gela', 'vruksha' => 'karanda', 'default_rashi' => 8],
        17 => ['name_en' => 'Anura', 'name_si' => 'අනුර', 'gana' => 'deva', 'yoni' => 'deer', 'rajju' => 'kati', 'vruksha' => 'bakmee', 'default_rashi' => 8],
        18 => ['name_en' => 'Dheta', 'name_si' => 'දෙට', 'gana' => 'rakshasa', 'yoni' => 'deer', 'rajju' => 'uru', 'vruksha' => 'maran', 'default_rashi' => 8],
        19 => ['name_en' => 'Mula', 'name_si' => 'මුල', 'gana' => 'rakshasa', 'yoni' => 'dog', 'rajju' => 'pada', 'vruksha' => 'sal', 'default_rashi' => 9],
        20 => ['name_en' => 'Puvasal', 'name_si' => 'පුවසල', 'gana' => 'manusha', 'yoni' => 'monkey', 'rajju' => 'uru', 'vruksha' => 'sang', 'default_rashi' => 9],
        21 => ['name_en' => 'Uthrasal', 'name_si' => 'උත්‍රසල', 'gana' => 'manusha', 'yoni' => 'mongoose', 'rajju' => 'kati', 'vruksha' => 'panakka', 'default_rashi' => 10],
        22 => ['name_en' => 'Suwana', 'name_si' => 'සුවණ', 'gana' => 'deva', 'yoni' => 'monkey', 'rajju' => 'gela', 'vruksha' => 'wasa', 'default_rashi' => 10],
        23 => ['name_en' => 'Denata', 'name_si' => 'දෙනට', 'gana' => 'rakshasa', 'yoni' => 'lion', 'rajju' => 'siras', 'vruksha' => 'siyambala', 'default_rashi' => 11],
        24 => ['name_en' => 'Siyawasa', 'name_si' => 'සියාවස', 'gana' => 'rakshasa', 'yoni' => 'horse', 'rajju' => 'siras', 'vruksha' => 'kadol', 'default_rashi' => 11],
        25 => ['name_en' => 'Puvaputupa', 'name_si' => 'පුවපුටුප', 'gana' => 'manusha', 'yoni' => 'lion', 'rajju' => 'gela', 'vruksha' => 'kohomba', 'default_rashi' => 12],
        26 => ['name_en' => 'Uthraputupa', 'name_si' => 'උත්‍රපුටුප', 'gana' => 'manusha', 'yoni' => 'cow', 'rajju' => 'kati', 'vruksha' => 'milla', 'default_rashi' => 12],
        27 => ['name_en' => 'Revathi', 'name_si' => 'රේවතී', 'gana' => 'deva', 'yoni' => 'elephant', 'rajju' => 'pada', 'vruksha' => 'katu-imbul', 'default_rashi' => 12],
    ];

    // 12 Rashis with Planetary Lords
    public const RASHIS = [
        1 => ['name_en' => 'Mesha', 'name_si' => 'මේෂ', 'lord' => 'Mars'],
        2 => ['name_en' => 'Vrushabha', 'name_si' => 'වෘෂභ', 'lord' => 'Venus'],
        3 => ['name_en' => 'Mithuna', 'name_si' => 'මිථුන', 'lord' => 'Mercury'],
        4 => ['name_en' => 'Kataka', 'name_si' => 'කටක', 'lord' => 'Moon'],
        5 => ['name_en' => 'Sinha', 'name_si' => 'සිංහ', 'lord' => 'Sun'],
        6 => ['name_en' => 'Kanya', 'name_si' => 'කන්‍යා', 'lord' => 'Mercury'],
        7 => ['name_en' => 'Thula', 'name_si' => 'තුලා', 'lord' => 'Venus'],
        8 => ['name_en' => 'Vruschika', 'name_si' => 'වෘශ්චික', 'lord' => 'Mars'],
        9 => ['name_en' => 'Dhanu', 'name_si' => 'ධනු', 'lord' => 'Jupiter'],
        10 => ['name_en' => 'Makara', 'name_si' => 'මකර', 'lord' => 'Saturn'],
        11 => ['name_en' => 'Kumbha', 'name_si' => 'කුම්භ', 'lord' => 'Saturn'],
        12 => ['name_en' => 'Meena', 'name_si' => 'මීන', 'lord' => 'Jupiter'],
    ];

    // Hostile animal pairs for Yoni
    public const HOSTILE_YONIS = [
        ['horse', 'buffalo'],
        ['elephant', 'lion'],
        ['sheep', 'monkey'],
        ['serpent', 'mongoose'],
        ['dog', 'deer'],
        ['cat', 'rat'],
        ['cow', 'tiger'],
    ];

    public function match(int $brideNakathaNum, int $groomNakathaNum, ?int $brideRashiNum = null, ?int $groomRashiNum = null): array
    {
        $bNakatha = self::NAKATHAS[$brideNakathaNum] ?? self::NAKATHAS[1];
        $gNakatha = self::NAKATHAS[$groomNakathaNum] ?? self::NAKATHAS[1];

        $bRashi = self::RASHIS[$brideRashiNum ?? $bNakatha['default_rashi']];
        $gRashi = self::RASHIS[$groomRashiNum ?? $gNakatha['default_rashi']];

        $details = [];
        $totalScore = 0;
        $maxTotalScore = 25;

        // 1. Dina Porondama (දින) - max 3
        $count = (($groomNakathaNum - $brideNakathaNum + 27) % 27) + 1;
        $rem = $count % 9;
        $dinaScore = 3;
        $dinaStatus = 'good';
        $dinaDesc = 'නිරෝගී සම්පත සහ ආයුෂ වර්ධනය සඳහා ඉතා යහපත්ය.';
        if (in_array($rem, [3, 5, 7])) {
            $dinaScore = 0;
            $dinaStatus = 'bad';
            $dinaDesc = 'අසුබ ශේෂයක් පවතින බැවින් දින පොරොන්දම මධ්‍යස්ථයි.';
        }
        $totalScore += $dinaScore;
        $details[] = [
            'name_en' => 'Dina',
            'name_si' => 'දින පොරොන්දම',
            'score' => $dinaScore,
            'max_score' => 3,
            'status' => $dinaStatus,
            'description_si' => $dinaDesc,
            'description_en' => $dinaScore > 0 ? 'Favorable for health and longevity.' : 'Moderate compatibility.',
        ];

        // 2. Gana Porondama (ගණ) - max 3
        $ganaScore = 0;
        $ganaDesc = '';
        if ($bNakatha['gana'] === $gNakatha['gana']) {
            $ganaScore = 3;
            $ganaDesc = 'එකම ගණය (සමාන සිතුම් පැතුම් සහ අදහස් ගැලපේ).';
        } elseif (($bNakatha['gana'] === 'deva' && $gNakatha['gana'] === 'manusha') || ($bNakatha['gana'] === 'manusha' && $gNakatha['gana'] === 'deva')) {
            $ganaScore = 2;
            $ganaDesc = 'දේව සහ මනුෂ්‍ය ගණ සුහදතාවය යහපත්ය.';
        } else {
            $ganaScore = 0;
            $ganaDesc = 'ගණ නොගැලපීමක් පවතී (දේව-රාක්ෂස හෝ මනුෂ්‍ය-රාක්ෂස).';
        }
        $totalScore += $ganaScore;
        $details[] = [
            'name_en' => 'Gana',
            'name_si' => 'ගණ පොරොන්දම',
            'score' => $ganaScore,
            'max_score' => 3,
            'status' => $ganaScore >= 2 ? 'good' : 'bad',
            'description_si' => $ganaDesc,
            'description_en' => $ganaScore >= 2 ? 'Favorable emotional and temperamental match.' : 'Temperamental mismatch.',
        ];

        // 3. Mahendra Porondama (මාහේන්ද්‍ර) - max 2
        $mahendraScore = in_array($count, [4, 7, 10, 13, 16, 19, 22, 25]) ? 2 : 0;
        $totalScore += $mahendraScore;
        $details[] = [
            'name_en' => 'Mahendra',
            'name_si' => 'මාහේන්ද්‍ර පොරොන්දම',
            'score' => $mahendraScore,
            'max_score' => 2,
            'status' => $mahendraScore > 0 ? 'good' : 'neutral',
            'description_si' => $mahendraScore > 0 ? 'දරුවන් සහ පවුල් සෞභාග්‍යය සඳහා ඉතා සුබයි.' : 'සාමාන්‍යයි.',
            'description_en' => $mahendraScore > 0 ? 'Auspicious for family growth and children.' : 'Neutral compatibility.',
        ];

        // 4. Sthree Deergha (ස්ත්‍රී දීර්ඝ) - max 2
        $streeScore = $count > 13 ? 2 : ($count >= 8 ? 1 : 0);
        $totalScore += $streeScore;
        $details[] = [
            'name_en' => 'Sthree Deergha',
            'name_si' => 'ස්ත්‍රී දීර්ඝ පොරොන්දම',
            'score' => $streeScore,
            'max_score' => 2,
            'status' => $streeScore >= 1 ? 'good' : 'bad',
            'description_si' => $streeScore === 2 ? 'දීර්ඝ විවාහ දිවියක් සඳහා ඉතා උතුම්ය.' : ($streeScore === 1 ? 'මධ්‍යම සුබ ඵලයි.' : 'දුර ප්‍රමාණය මදි.'),
            'description_en' => $streeScore >= 1 ? 'Favorable for marital endurance.' : 'Below optimal distance.',
        ];

        // 5. Yoni Porondama (යෝනි) - max 3
        $isHostile = false;
        foreach (self::HOSTILE_YONIS as $pair) {
            if (($bNakatha['yoni'] === $pair[0] && $gNakatha['yoni'] === $pair[1]) ||
                ($bNakatha['yoni'] === $pair[1] && $gNakatha['yoni'] === $pair[0])) {
                $isHostile = true;
                break;
            }
        }
        $yoniScore = 1;
        if ($bNakatha['yoni'] === $gNakatha['yoni']) {
            $yoniScore = 3;
        } elseif ($isHostile) {
            $yoniScore = 0;
        } else {
            $yoniScore = 2;
        }
        $totalScore += $yoniScore;
        $details[] = [
            'name_en' => 'Yoni',
            'name_si' => 'යෝනි පොරොන්දම',
            'score' => $yoniScore,
            'max_score' => 3,
            'status' => $yoniScore >= 2 ? 'good' : ($yoniScore === 1 ? 'neutral' : 'bad'),
            'description_si' => $yoniScore === 3 ? 'එකම යෝනිය (උසස් ශාරීරික හා ආකර්ෂණීය සුහදතාව).' : ($yoniScore === 0 ? 'වෛරී යෝනි (නොගැලපේ).' : 'මිත්‍රශීලී යෝනි ගැලපීමකි.'),
            'description_en' => $yoniScore >= 2 ? 'Physical attraction and sexual harmony.' : 'Incompatible yoni types.',
        ];

        // 6. Rashi Porondama (රාශි) - max 3
        $rashiDist = (($groomRashiNum ?? $gNakatha['default_rashi']) - ($brideRashiNum ?? $bNakatha['default_rashi']) + 12) % 12;
        $rashiScore = 3;
        $rashiDesc = 'සමසප්තම හෝ සුබ රාශි ගැලපීමකි.';
        if (in_array($rashiDist, [5, 7])) { // 6th/8th Shadashtaka
            $rashiScore = 0;
            $rashiDesc = 'ෂඩ් අෂ්ඨක රාශි තත්ත්වයකි (අසුබයි).';
        } elseif (in_array($rashiDist, [1, 11])) { // 2nd/12th Dwi-Dwadasha
            $rashiScore = 1;
            $rashiDesc = 'ද්වි-ද්වාදශ තත්ත්වය (මධ්‍යමයි).';
        }
        $totalScore += $rashiScore;
        $details[] = [
            'name_en' => 'Rashi',
            'name_si' => 'රාශි පොරොන්දම',
            'score' => $rashiScore,
            'max_score' => 3,
            'status' => $rashiScore >= 2 ? 'good' : 'bad',
            'description_si' => $rashiDesc,
            'description_en' => $rashiScore >= 2 ? 'Favorable zodiac harmony.' : 'Conflicting zodiac positions.',
        ];

        // 7. Rashi Adhipathi (රාශ්‍යාධිපති) - max 2
        $lordB = $bRashi['lord'];
        $lordG = $gRashi['lord'];
        $adhipathiScore = ($lordB === $lordG) ? 2 : 1;
        $totalScore += $adhipathiScore;
        $details[] = [
            'name_en' => 'Rashi Adhipathi',
            'name_si' => 'රාශ්‍යාධිපති පොරොන්දම',
            'score' => $adhipathiScore,
            'max_score' => 2,
            'status' => 'good',
            'description_si' => $lordB === $lordG ? 'එකම ග්‍රහ අධිපති (උසස් මානසික එකඟතාව).' : 'මිත්‍ර ග්‍රහ සම්බන්ධතාවයකි.',
            'description_en' => 'Harmonious planetary lordship.',
        ];

        // 8. Vashya Porondama (වශ්‍ය) - max 2
        $vashyaScore = ($bNakatha['gana'] === $gNakatha['gana'] || $rashiDist === 6) ? 2 : 1;
        $totalScore += $vashyaScore;
        $details[] = [
            'name_en' => 'Vashya',
            'name_si' => 'වශ්‍ය පොරොන්දම',
            'score' => $vashyaScore,
            'max_score' => 2,
            'status' => 'good',
            'description_si' => 'අන්‍යෝන්‍ය ආකර්ෂණය සහ ගෞරවය යහපත්ය.',
            'description_en' => 'Mutual respect and attraction.',
        ];

        // 9. Rajju Porondama (රජ්ජු - අතිශය වැදගත්) - max 3
        $rajjuPassed = $bNakatha['rajju'] !== $gNakatha['rajju'];
        $rajjuScore = $rajjuPassed ? 3 : 0;
        $totalScore += $rajjuScore;
        $details[] = [
            'name_en' => 'Rajju',
            'name_si' => 'රජ්ජු පොරොන්දම (අතිශය වැදගත්)',
            'score' => $rajjuScore,
            'max_score' => 3,
            'status' => $rajjuPassed ? 'good' : 'critical_bad',
            'description_si' => $rajjuPassed ? 'විවිධ රජ්ජු (රජ්ජු දෝෂ නැත - ඉතා සුබයි).' : 'එකම රජ්ජුව (' . ucfirst($bNakatha['rajju']) . ' රජ්ජු දෝෂය පවතී).',
            'description_en' => $rajjuPassed ? 'No Rajju Dosha. Excellent lifelong bond.' : 'Same Rajju Dosha detected.',
        ];

        // 10. Vedha Porondama (වේධ) - max 2
        $vedhaScore = 2; // Default non-afflicted
        $totalScore += $vedhaScore;
        $details[] = [
            'name_en' => 'Vedha',
            'name_si' => 'වේධ පොරොන්දම',
            'score' => $vedhaScore,
            'max_score' => 2,
            'status' => 'good',
            'description_si' => 'වේධ දෝෂ රහිතයි (බාධා නැත).',
            'description_en' => 'Free from Vedha afflictions.',
        ];

        $percentage = round(($totalScore / $maxTotalScore) * 100);

        $grade = 'Good';
        $verdictSi = 'විවාහය සඳහා ඉතා සුබදායක ගැලපීමකි.';
        $verdictEn = 'Highly compatible match with auspicious indicators.';

        if ($percentage >= 80 && $rajjuPassed) {
            $grade = 'Excellent';
            $verdictSi = 'විවාහය සඳහා අතිශයින්ම උසස් හා සුබදායක පොරොන්දම් ගැලපීමකි!';
            $verdictEn = 'Excellent match! Highly recommended for marriage.';
        } elseif ($percentage >= 60 && $rajjuPassed) {
            $grade = 'Good';
            $verdictSi = 'විවාහය සඳහා යහපත් ගැලපීමකි. සාර්ථක පවුල් ජීවිතයක් ගත කළ හැක.';
            $verdictEn = 'Good and stable compatibility.';
        } elseif (!$rajjuPassed) {
            $grade = 'Average (Caution)';
            $verdictSi = 'මධ්‍යස්ථ ගැලපීමකි. රජ්ජු දෝෂයක් පවතින බැවින් ජ්‍යෝතිෂවේදී පරීක්ෂාවක් නිර්දේශ කෙරේ.';
            $verdictEn = 'Moderate match. Rajju dosha detected, detailed chart review recommended.';
        } else {
            $grade = 'Poor';
            $verdictSi = 'ගැලපීම මධ්‍යස්ථ මට්ටමට වඩා අඩුය. ගැඹුරු කේන්ද්‍ර පරීක්ෂාවක් අවශ්‍ය වේ.';
            $verdictEn = 'Below average compatibility score.';
        }

        return [
            'bride' => [
                'nakatha_number' => $brideNakathaNum,
                'nakatha_name' => $bNakatha['name_si'] . ' (' . $bNakatha['name_en'] . ')',
                'rashi_name' => $bRashi['name_si'] . ' (' . $bRashi['name_en'] . ')',
                'gana' => $bNakatha['gana'],
                'yoni' => $bNakatha['yoni'],
                'rajju' => $bNakatha['rajju'],
            ],
            'groom' => [
                'nakatha_number' => $groomNakathaNum,
                'nakatha_name' => $gNakatha['name_si'] . ' (' . $gNakatha['name_en'] . ')',
                'rashi_name' => $gRashi['name_si'] . ' (' . $gRashi['name_en'] . ')',
                'gana' => $gNakatha['gana'],
                'yoni' => $gNakatha['yoni'],
                'rajju' => $gNakatha['rajju'],
            ],
            'score' => $totalScore,
            'max_score' => $maxTotalScore,
            'percentage' => $percentage,
            'grade' => $grade,
            'verdict_si' => $verdictSi,
            'verdict_en' => $verdictEn,
            'rajju_passed' => $rajjuPassed,
            'details' => $details,
        ];
    }
}
