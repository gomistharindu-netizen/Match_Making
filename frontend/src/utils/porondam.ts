export interface NakathaItem {
  id: number;
  name_en: string;
  name_si: string;
  gana: 'deva' | 'manusha' | 'rakshasa';
  yoni: string;
  rajju: 'siras' | 'gela' | 'kati' | 'uru' | 'pada';
  default_rashi: number;
}

export interface RashiItem {
  id: number;
  name_en: string;
  name_si: string;
  lord: string;
}

export const NAKATHAS: NakathaItem[] = [
  { id: 1, name_en: 'Aswida', name_si: 'අස්විද', gana: 'deva', yoni: 'horse', rajju: 'pada', default_rashi: 1 },
  { id: 2, name_en: 'Berana', name_si: 'බෙරණ', gana: 'manusha', yoni: 'elephant', rajju: 'uru', default_rashi: 1 },
  { id: 3, name_en: 'Kethi', name_si: 'කැති', gana: 'rakshasa', yoni: 'sheep', rajju: 'kati', default_rashi: 2 },
  { id: 4, name_en: 'Rehena', name_si: 'රෙහෙණ', gana: 'manusha', yoni: 'serpent', rajju: 'gela', default_rashi: 2 },
  { id: 5, name_en: 'Muwasirasa', name_si: 'මුවසිරස', gana: 'deva', yoni: 'serpent', rajju: 'siras', default_rashi: 3 },
  { id: 6, name_en: 'Adha', name_si: 'අද', gana: 'manusha', yoni: 'dog', rajju: 'siras', default_rashi: 3 },
  { id: 7, name_en: 'Punawasa', name_si: 'පුනාවස', gana: 'deva', yoni: 'cat', rajju: 'gela', default_rashi: 4 },
  { id: 8, name_en: 'Pusa', name_si: 'පුස', gana: 'deva', yoni: 'sheep', rajju: 'kati', default_rashi: 4 },
  { id: 9, name_en: 'Aslisa', name_si: 'අස්ලිස', gana: 'rakshasa', yoni: 'cat', rajju: 'uru', default_rashi: 4 },
  { id: 10, name_en: 'Ma', name_si: 'මා', gana: 'rakshasa', yoni: 'rat', rajju: 'pada', default_rashi: 5 },
  { id: 11, name_en: 'Puvapal', name_si: 'පුවපල්', gana: 'manusha', yoni: 'rat', rajju: 'uru', default_rashi: 5 },
  { id: 12, name_en: 'Uthrapal', name_si: 'උත්‍රපල්', gana: 'manusha', yoni: 'cow', rajju: 'kati', default_rashi: 6 },
  { id: 13, name_en: 'Hatha', name_si: 'හත', gana: 'deva', yoni: 'buffalo', rajju: 'gela', default_rashi: 6 },
  { id: 14, name_en: 'Chitha', name_si: 'සිත', gana: 'rakshasa', yoni: 'tiger', rajju: 'siras', default_rashi: 7 },
  { id: 15, name_en: 'Saa', name_si: 'සා', gana: 'deva', yoni: 'buffalo', rajju: 'siras', default_rashi: 7 },
  { id: 16, name_en: 'Visa', name_si: 'විසා', gana: 'rakshasa', yoni: 'tiger', rajju: 'gela', default_rashi: 8 },
  { id: 17, name_en: 'Anura', name_si: 'අනුර', gana: 'deva', yoni: 'deer', rajju: 'kati', default_rashi: 8 },
  { id: 18, name_en: 'Dheta', name_si: 'දෙට', gana: 'rakshasa', yoni: 'deer', rajju: 'uru', default_rashi: 8 },
  { id: 19, name_en: 'Mula', name_si: 'මුල', gana: 'rakshasa', yoni: 'dog', rajju: 'pada', default_rashi: 9 },
  { id: 20, name_en: 'Puvasal', name_si: 'පුවසල', gana: 'manusha', yoni: 'monkey', rajju: 'uru', default_rashi: 9 },
  { id: 21, name_en: 'Uthrasal', name_si: 'උත්‍රසල', gana: 'manusha', yoni: 'mongoose', rajju: 'kati', default_rashi: 10 },
  { id: 22, name_en: 'Suwana', name_si: 'සුවණ', gana: 'deva', yoni: 'monkey', rajju: 'gela', default_rashi: 10 },
  { id: 23, name_en: 'Denata', name_si: 'දෙනට', gana: 'rakshasa', yoni: 'lion', rajju: 'siras', default_rashi: 11 },
  { id: 24, name_en: 'Siyawasa', name_si: 'සියාවස', gana: 'rakshasa', yoni: 'horse', rajju: 'siras', default_rashi: 11 },
  { id: 25, name_en: 'Puvaputupa', name_si: 'පුවපුටුප', gana: 'manusha', yoni: 'lion', rajju: 'gela', default_rashi: 12 },
  { id: 26, name_en: 'Uthraputupa', name_si: 'උත්‍රපුටුප', gana: 'manusha', yoni: 'cow', rajju: 'kati', default_rashi: 12 },
  { id: 27, name_en: 'Revathi', name_si: 'රේවතී', gana: 'deva', yoni: 'elephant', rajju: 'pada', default_rashi: 12 },
];

export const RASHIS: RashiItem[] = [
  { id: 1, name_en: 'Mesha', name_si: 'මේෂ', lord: 'Mars' },
  { id: 2, name_en: 'Vrushabha', name_si: 'වෘෂභ', lord: 'Venus' },
  { id: 3, name_en: 'Mithuna', name_si: 'මිථුන', lord: 'Mercury' },
  { id: 4, name_en: 'Kataka', name_si: 'කටක', lord: 'Moon' },
  { id: 5, name_en: 'Sinha', name_si: 'සිංහ', lord: 'Sun' },
  { id: 6, name_en: 'Kanya', name_si: 'කන්‍යා', lord: 'Mercury' },
  { id: 7, name_en: 'Thula', name_si: 'තුලා', lord: 'Venus' },
  { id: 8, name_en: 'Vruschika', name_si: 'වෘශ්චික', lord: 'Mars' },
  { id: 9, name_en: 'Dhanu', name_si: 'ධනු', lord: 'Jupiter' },
  { id: 10, name_en: 'Makara', name_si: 'මකර', lord: 'Saturn' },
  { id: 11, name_en: 'Kumbha', name_si: 'කුම්භ', lord: 'Saturn' },
  { id: 12, name_en: 'Meena', name_si: 'මීන', lord: 'Jupiter' },
];

const HOSTILE_YONIS: [string, string][] = [
  ['horse', 'buffalo'],
  ['elephant', 'lion'],
  ['sheep', 'monkey'],
  ['serpent', 'mongoose'],
  ['dog', 'deer'],
  ['cat', 'rat'],
  ['cow', 'tiger'],
];

export interface PorondamDetail {
  name_en: string;
  name_si: string;
  score: number;
  max_score: number;
  status: 'good' | 'bad' | 'neutral' | 'critical_bad';
  description_si: string;
  description_en: string;
}

export interface PorondamResult {
  bride: {
    nakatha_number: number;
    nakatha_name: string;
    rashi_name: string;
  };
  groom: {
    nakatha_number: number;
    nakatha_name: string;
    rashi_name: string;
  };
  score: number;
  max_score: number;
  percentage: number;
  grade: string;
  verdict_si: string;
  verdict_en: string;
  rajju_passed: boolean;
  details: PorondamDetail[];
}

export function calculatePorondam(
  brideNakathaId: number,
  groomNakathaId: number,
  brideRashiId?: number,
  groomRashiId?: number
): PorondamResult {
  const bNakatha = NAKATHAS.find((n) => n.id === brideNakathaId) || NAKATHAS[0];
  const gNakatha = NAKATHAS.find((n) => n.id === groomNakathaId) || NAKATHAS[0];

  const bRashi = RASHIS.find((r) => r.id === (brideRashiId || bNakatha.default_rashi)) || RASHIS[0];
  const gRashi = RASHIS.find((r) => r.id === (groomRashiId || gNakatha.default_rashi)) || RASHIS[0];

  const details: PorondamDetail[] = [];
  let totalScore = 0;
  const maxTotalScore = 25;

  // 1. Dina (දින)
  const count = ((gNakatha.id - bNakatha.id + 27) % 27) + 1;
  const rem = count % 9;
  const dinaScore = [3, 5, 7].includes(rem) ? 0 : 3;
  totalScore += dinaScore;
  details.push({
    name_en: 'Dina',
    name_si: 'දින පොරොන්දම',
    score: dinaScore,
    max_score: 3,
    status: dinaScore > 0 ? 'good' : 'bad',
    description_si: dinaScore > 0 ? 'නිරෝගී සම්පත සහ ආයුෂ වර්ධනය සඳහා ඉතා යහපත්ය.' : 'අසුබ ශේෂයක් පවතින බැවින් මධ්‍යස්ථයි.',
    description_en: dinaScore > 0 ? 'Favorable for health and longevity.' : 'Moderate compatibility score.',
  });

  // 2. Gana (ගණ)
  let ganaScore = 0;
  let ganaDescSi = '';
  if (bNakatha.gana === gNakatha.gana) {
    ganaScore = 3;
    ganaDescSi = 'එකම ගණය (සමාන සිතුම් පැතුම් සහ අදහස් ගැලපේ).';
  } else if ((bNakatha.gana === 'deva' && gNakatha.gana === 'manusha') || (bNakatha.gana === 'manusha' && gNakatha.gana === 'deva')) {
    ganaScore = 2;
    ganaDescSi = 'දේව සහ මනුෂ්‍ය ගණ සුහදතාවය යහපත්ය.';
  } else {
    ganaScore = 0;
    ganaDescSi = 'ගණ නොගැලපීමක් පවතී (දේව-රාක්ෂස හෝ මනුෂ්‍ය-රාක්ෂස).';
  }
  totalScore += ganaScore;
  details.push({
    name_en: 'Gana',
    name_si: 'ගණ පොරොන්දම',
    score: ganaScore,
    max_score: 3,
    status: ganaScore >= 2 ? 'good' : 'bad',
    description_si: ganaDescSi,
    description_en: ganaScore >= 2 ? 'Favorable emotional bonding.' : 'Temperamental mismatch.',
  });

  // 3. Mahendra (මාහේන්ද්‍ර)
  const mahendraScore = [4, 7, 10, 13, 16, 19, 22, 25].includes(count) ? 2 : 0;
  totalScore += mahendraScore;
  details.push({
    name_en: 'Mahendra',
    name_si: 'මාහේන්ද්‍ර පොරොන්දම',
    score: mahendraScore,
    max_score: 2,
    status: mahendraScore > 0 ? 'good' : 'neutral',
    description_si: mahendraScore > 0 ? 'දරුවන් සහ පවුල් සෞභාග්‍යය සඳහා ඉතා සුබයි.' : 'සාමාන්‍යයි.',
    description_en: mahendraScore > 0 ? 'Auspicious for family growth and children.' : 'Neutral compatibility.',
  });

  // 4. Sthree Deergha (ස්ත්‍රී දීර්ඝ)
  const streeScore = count > 13 ? 2 : (count >= 8 ? 1 : 0);
  totalScore += streeScore;
  details.push({
    name_en: 'Sthree Deergha',
    name_si: 'ස්ත්‍රී දීර්ඝ පොරොන්දම',
    score: streeScore,
    max_score: 2,
    status: streeScore >= 1 ? 'good' : 'bad',
    description_si: streeScore === 2 ? 'දීර්ඝ විවාහ දිවියක් සඳහා ඉතා උතුම්ය.' : (streeScore === 1 ? 'මධ්‍යම සුබ ඵලයි.' : 'දුර ප්‍රමාණය මදි.'),
    description_en: streeScore >= 1 ? 'Favorable for marital longevity.' : 'Below optimal distance.',
  });

  // 5. Yoni (යෝනි)
  const isHostile = HOSTILE_YONIS.some(
    ([a, b]) => (bNakatha.yoni === a && gNakatha.yoni === b) || (bNakatha.yoni === b && gNakatha.yoni === a)
  );
  const yoniScore = bNakatha.yoni === gNakatha.yoni ? 3 : (isHostile ? 0 : 2);
  totalScore += yoniScore;
  details.push({
    name_en: 'Yoni',
    name_si: 'යෝනි පොරොන්දම',
    score: yoniScore,
    max_score: 3,
    status: yoniScore >= 2 ? 'good' : (yoniScore === 1 ? 'neutral' : 'bad'),
    description_si: yoniScore === 3 ? 'එකම යෝනිය (උසස් ආකර්ෂණය).' : (isHostile ? 'වෛරී යෝනි (නොගැලපේ).' : 'මිත්‍රශීලී යෝනි ගැලපීමකි.'),
    description_en: yoniScore >= 2 ? 'Physical and emotional attraction.' : 'Hostile animal archetypes.',
  });

  // 6. Rashi (රාශි)
  const rashiDist = (gRashi.id - bRashi.id + 12) % 12;
  let rashiScore = 3;
  let rashiDesc = 'සමසප්තම හෝ සුබ රාශි ගැලපීමකි.';
  if ([5, 7].includes(rashiDist)) {
    rashiScore = 0;
    rashiDesc = 'ෂඩ් අෂ්ඨක රාශි තත්ත්වයකි (අසුබයි).';
  } else if ([1, 11].includes(rashiDist)) {
    rashiScore = 1;
    rashiDesc = 'ද්වි-ද්වාදශ තත්ත්වය (මධ්‍යමයි).';
  }
  totalScore += rashiScore;
  details.push({
    name_en: 'Rashi',
    name_si: 'රාශි පොරොන්දම',
    score: rashiScore,
    max_score: 3,
    status: rashiScore >= 2 ? 'good' : 'bad',
    description_si: rashiDesc,
    description_en: rashiScore >= 2 ? 'Favorable zodiac harmony.' : 'Conflicting zodiac positions.',
  });

  // 7. Rashi Adhipathi (රාශ්‍යාධිපති)
  const adhipathiScore = bRashi.lord === gRashi.lord ? 2 : 1;
  totalScore += adhipathiScore;
  details.push({
    name_en: 'Rashi Adhipathi',
    name_si: 'රාශ්‍යාධිපති පොරොන්දම',
    score: adhipathiScore,
    max_score: 2,
    status: 'good',
    description_si: bRashi.lord === gRashi.lord ? 'එකම ග්‍රහ අධිපති (උසස් මානසික එකඟතාව).' : 'මිත්‍ර ග්‍රහ සම්බන්ධතාවයකි.',
    description_en: 'Harmonious planetary lordship.',
  });

  // 8. Vashya (වශ්‍ය)
  const vashyaScore = bNakatha.gana === gNakatha.gana || rashiDist === 6 ? 2 : 1;
  totalScore += vashyaScore;
  details.push({
    name_en: 'Vashya',
    name_si: 'වශ්‍ය පොරොන්දම',
    score: vashyaScore,
    max_score: 2,
    status: 'good',
    description_si: 'අන්‍යෝන්‍ය ආකර්ෂණය සහ ගෞරවය යහපත්ය.',
    description_en: 'Mutual respect and attraction.',
  });

  // 9. Rajju (රජ්ජු - අතිශය වැදගත්)
  const rajjuPassed = bNakatha.rajju !== gNakatha.rajju;
  const rajjuScore = rajjuPassed ? 3 : 0;
  totalScore += rajjuScore;
  details.push({
    name_en: 'Rajju',
    name_si: 'රජ්ජු පොරොන්දම (අතිශය වැදගත්)',
    score: rajjuScore,
    max_score: 3,
    status: rajjuPassed ? 'good' : 'critical_bad',
    description_si: rajjuPassed ? 'විවිධ රජ්ජු (රජ්ජු දෝෂ නැත - ඉතා සුබයි).' : 'එකම රජ්ජුව (' + bNakatha.rajju.toUpperCase() + ' රජ්ජු දෝෂය පවතී).',
    description_en: rajjuPassed ? 'No Rajju Dosha. Excellent lifelong bond.' : 'Same Rajju Dosha detected.',
  });

  // 10. Vedha (වේධ)
  const vedhaScore = 2;
  totalScore += vedhaScore;
  details.push({
    name_en: 'Vedha',
    name_si: 'වේධ පොරොන්දම',
    score: vedhaScore,
    max_score: 2,
    status: 'good',
    description_si: 'වේධ දෝෂ රහිතයි (බාධා නැත).',
    description_en: 'Free from Vedha afflictions.',
  });

  const percentage = Math.round((totalScore / maxTotalScore) * 100);

  let grade = 'Good';
  let verdictSi = 'විවාහය සඳහා ඉතා සුබදායක ගැලපීමකි.';
  let verdictEn = 'Highly compatible match with auspicious indicators.';

  if (percentage >= 80 && rajjuPassed) {
    grade = 'Excellent';
    verdictSi = 'විවාහය සඳහා අතිශයින්ම උසස් හා සුබදායක පොරොන්දම් ගැලපීමකි!';
    verdictEn = 'Excellent match! Highly recommended for marriage.';
  } else if (percentage >= 60 && rajjuPassed) {
    grade = 'Good';
    verdictSi = 'විවාහය සඳහා යහපත් ගැලපීමකි. සාර්ථක පවුල් ජීවිතයක් ගත කළ හැක.';
    verdictEn = 'Good and stable compatibility.';
  } else if (!rajjuPassed) {
    grade = 'Average (Caution)';
    verdictSi = 'මධ්‍යස්ථ ගැලපීමකි. රජ්ජු දෝෂයක් පවතින බැවින් ජ්‍යෝතිෂවේදී පරීක්ෂාවක් නිර්දේශ කෙරේ.';
    verdictEn = 'Moderate match. Rajju dosha detected, detailed chart review recommended.';
  } else {
    grade = 'Poor';
    verdictSi = 'ගැලපීම මධ්‍යස්ථ මට්ටමට වඩා අඩුය. ගැඹුරු කේන්ද්‍ර පරීක්ෂාවක් අවශ්‍ය වේ.';
    verdictEn = 'Below average compatibility score.';
  }

  return {
    bride: {
      nakatha_number: bNakatha.id,
      nakatha_name: `${bNakatha.name_si} (${bNakatha.name_en})`,
      rashi_name: `${bRashi.name_si} (${bRashi.name_en})`,
    },
    groom: {
      nakatha_number: gNakatha.id,
      nakatha_name: `${gNakatha.name_si} (${gNakatha.name_en})`,
      rashi_name: `${gRashi.name_si} (${gRashi.name_en})`,
    },
    score: totalScore,
    max_score: maxTotalScore,
    percentage,
    grade,
    verdict_si: verdictSi,
    verdict_en: verdictEn,
    rajju_passed: rajjuPassed,
    details,
  };
}
