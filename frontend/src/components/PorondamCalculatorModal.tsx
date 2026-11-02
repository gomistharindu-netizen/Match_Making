'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { NAKATHAS, RASHIS, calculatePorondam, PorondamResult } from '../utils/porondam';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Heart,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

interface PorondamCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBrideNakatha?: number;
  initialGroomNakatha?: number;
  initialTargetGender?: 'bride' | 'groom';
  candidateCode?: string;
}

export const PorondamCalculatorModal: React.FC<PorondamCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialBrideNakatha = 4, // Default Rohini
  initialGroomNakatha = 13, // Default Hastha
  candidateCode,
}) => {
  const { language } = useLanguage();

  const [brideNakatha, setBrideNakatha] = useState<number>(initialBrideNakatha);
  const [brideRashi, setBrideRashi] = useState<number>(2); // Vrushabha
  const [groomNakatha, setGroomNakatha] = useState<number>(initialGroomNakatha);
  const [groomRashi, setGroomRashi] = useState<number>(6); // Kanya

  const [result, setResult] = useState<PorondamResult | null>(() => {
    return calculatePorondam(initialBrideNakatha, initialGroomNakatha, 2, 6);
  });

  if (!isOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculatePorondam(brideNakatha, groomNakatha, brideRashi, groomRashi);
    setResult(res);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#F8E4EB] overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-[#C6A56B]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-serif">
                {language === 'si' ? 'ක්ෂණික පොරොන්දම් ගැලපීමේ කැල්කියුලේටරය' : 'Instant Porondam Compatibility Check'}
              </h2>
              {candidateCode && (
                <p className="text-[11px] text-[#F3DEB3] font-mono">
                  {language === 'si' ? `${candidateCode} සමඟ ගැලපීම` : `Comparing with profile ${candidateCode}`}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[#352A30]">
          {/* Form Controls */}
          <form onSubmit={handleCalculate} className="bg-[#FFF8FA] p-4 sm:p-5 rounded-2xl border border-[#F8E4EB] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bride Column */}
              <div className="space-y-3 bg-white p-3.5 rounded-xl border border-rose-100 shadow-xs">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#AD3B65]">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'si' ? 'මනාලියගේ කේන්ද්‍රය (Bride)' : "Bride's Horoscope"}</span>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    {language === 'si' ? 'උපන් නැකත (Birth Nakatha)' : 'Birth Nakatha'}
                  </label>
                  <select
                    value={brideNakatha}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setBrideNakatha(id);
                      const nak = NAKATHAS.find((n) => n.id === id);
                      if (nak) setBrideRashi(nak.default_rashi);
                    }}
                    className="w-full text-xs p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#AD3B65] bg-white font-medium"
                  >
                    {NAKATHAS.map((n) => (
                      <option key={`b-${n.id}`} value={n.id}>
                        {n.id}. {n.name_si} ({n.name_en})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    {language === 'si' ? 'චන්ද්‍ර රාශිය (Moon Sign)' : 'Moon Sign (Rashi)'}
                  </label>
                  <select
                    value={brideRashi}
                    onChange={(e) => setBrideRashi(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#AD3B65] bg-white font-medium"
                  >
                    {RASHIS.map((r) => (
                      <option key={`br-${r.id}`} value={r.id}>
                        {r.id}. {r.name_si} ({r.name_en})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Groom Column */}
              <div className="space-y-3 bg-white p-3.5 rounded-xl border border-blue-100 shadow-xs">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'si' ? 'මනාලයාගේ කේන්ද්‍රය (Groom)' : "Groom's Horoscope"}</span>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    {language === 'si' ? 'උපන් නැකත (Birth Nakatha)' : 'Birth Nakatha'}
                  </label>
                  <select
                    value={groomNakatha}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setGroomNakatha(id);
                      const nak = NAKATHAS.find((n) => n.id === id);
                      if (nak) setGroomRashi(nak.default_rashi);
                    }}
                    className="w-full text-xs p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#AD3B65] bg-white font-medium"
                  >
                    {NAKATHAS.map((n) => (
                      <option key={`g-${n.id}`} value={n.id}>
                        {n.id}. {n.name_si} ({n.name_en})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    {language === 'si' ? 'චන්ද්‍ර රාශිය (Moon Sign)' : 'Moon Sign (Rashi)'}
                  </label>
                  <select
                    value={groomRashi}
                    onChange={(e) => setGroomRashi(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#AD3B65] bg-white font-medium"
                  >
                    {RASHIS.map((r) => (
                      <option key={`gr-${r.id}`} value={r.id}>
                        {r.id}. {r.name_si} ({r.name_en})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#AD3B65] hover:bg-[#8E2E52] text-white text-xs font-bold transition shadow-md shadow-[#AD3B65]/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'si' ? 'පොරොන්දම් ගලපන්න (Calculate)' : 'Match Porondam'}</span>
              </button>
            </div>
          </form>

          {/* Results Summary Card */}
          {result && (
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border text-center space-y-2.5 ${
                result.percentage >= 75 && result.rajju_passed
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
                  : result.rajju_passed
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
                  : 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-200'
              }`}>
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-4xl sm:text-5xl font-black font-serif text-[#352A30]">
                    {result.percentage}%
                  </div>
                  <div className="text-left">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                      result.percentage >= 75 && result.rajju_passed
                        ? 'bg-emerald-600 text-white'
                        : result.rajju_passed
                        ? 'bg-amber-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}>
                      {result.grade}
                    </span>
                    <p className="text-xs font-bold text-stone-700 mt-0.5">
                      {result.score} / {result.max_score} {language === 'si' ? 'ලකුණු' : 'Points'}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-stone-800 max-w-lg mx-auto">
                  {language === 'si' ? result.verdict_si : result.verdict_en}
                </p>

                {/* Rajju Status Alert */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  result.rajju_passed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {result.rajju_passed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'si' ? 'රජ්ජු දෝෂ රහිතයි (Rajju Dosha Passed)' : 'No Rajju Dosha (Safe)'}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{language === 'si' ? 'රජ්ජු දෝෂයක් සහිතයි (Same Rajju Dosha)' : 'Rajju Dosha Warning'}</span>
                    </>
                  )}
                </div>
              </div>

              {/* 10 Porondam Breakdown Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {language === 'si' ? 'පොරොන්දම් 10 සවිස්තරාත්මක ලකුණු (10 Porondam Breakdown)' : '10 Porondam Breakdown'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {result.details.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-xl border border-stone-200 flex items-start justify-between space-x-2 text-xs hover:border-[#AD3B65]/40 transition"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-stone-900 truncate">
                            {language === 'si' ? item.name_si : `${item.name_en} Porondam`}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-1">
                          {language === 'si' ? item.description_si : item.description_en}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                          item.score === item.max_score
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.score > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.score}/{item.max_score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to action for complete astrologer analysis */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-950">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="font-bold block">
                    {language === 'si' ? 'ගැඹුරු කේන්ද්‍ර පරීක්ෂාවක් අවශ්‍යද?' : 'Want an In-depth Astrologer Report?'}
                  </span>
                  <span className="text-[11px] text-amber-800 block">
                    {language === 'si'
                      ? 'ප්‍රවීණ ජ්‍යෝතිෂවේදීන් විසින් විසි පොරොන්දම, භාව කේන්ද්‍රය සහ දශා පරීක්ෂා කර සකසන නිල වාර්තාවක් ලබාගන්න.'
                      : 'Get our official reviewed PDF report covering all 20 Porondams and planetary charts.'}
                  </span>
                </div>
                <Link
                  href="/horoscope"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-[11px] shrink-0 transition flex items-center space-x-1"
                >
                  <span>{language === 'si' ? 'කේන්ද්‍ර වාර්තාවක් ඇනවුම් කරන්න' : 'Order Horoscope Report'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
          >
            {language === 'si' ? 'වසන්න (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
