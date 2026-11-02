'use client';

import React from 'react';
import { MatrimonialProfile } from '../data/mockProfiles';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Printer,
  Download,
  Heart,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface BioDataModalProps {
  profile: MatrimonialProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BioDataModal: React.FC<BioDataModalProps> = ({ profile, isOpen, onClose }) => {
  const { language } = useLanguage();

  if (!isOpen || !profile) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4 max-h-[95vh] flex flex-col">
        {/* Actions Bar (Hidden during print) */}
        <div className="bg-[#AD3B65] text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-4 h-4 text-[#C6A56B]" />
            <span className="font-bold text-xs sm:text-sm font-serif">
              {language === 'si' ? 'මංගල යෝජනා විස්තර පත්‍රිකාව (Printable Bio-Data Sheet)' : 'Printable Proposal Bio-Data'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-[#C6A56B] hover:bg-[#b59458] text-[#352A30] px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'මුද්‍රණය කරන්න (Print / PDF)' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet (Standard A4 layout) */}
        <div id="printable-biodata" className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white space-y-6 text-[#352A30] print:p-0 print:m-0 print:overflow-visible">
          {/* Header Crest & Letterhead */}
          <div className="border-b-2 border-[#AD3B65] pb-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-xl sm:text-2xl text-[#AD3B65] tracking-wide">
                  ජයතු ජය මංගල සේවාව
                </span>
                <span className="text-[10px] uppercase font-bold bg-[#FFF8FA] text-[#AD3B65] border border-[#F8E4EB] px-2 py-0.5 rounded-md font-mono">
                  Verified Bio-Data
                </span>
              </div>
              <p className="text-[11px] font-medium text-stone-500 uppercase tracking-widest font-serif">
                Jayathu Jaya Matrimonial & Horoscope Services • Official Proposal Sheet
              </p>
            </div>

            <div className="text-right">
              <span className="font-mono text-base font-black text-[#AD3B65] block">
                {profile.code}
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                Issued: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Main 2-Column Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Left 1/3: Photo & Vital Summary */}
            <div className="space-y-4 md:border-r md:border-stone-200 md:pr-6">
              <div className="w-full aspect-[3/4] max-h-64 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs relative">
                <img
                  src={profile.photoUrl}
                  alt={profile.code}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quick Tags */}
              <div className="space-y-2 text-xs">
                <div className="bg-[#FFF8FA] p-3 rounded-xl border border-[#F8E4EB] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">{language === 'si' ? 'ස්ත්‍රී/පුරුෂ භාවය' : 'Gender'}:</span>
                    <span className="font-bold capitalize">{profile.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{language === 'si' ? 'වයස' : 'Age'}:</span>
                    <span className="font-bold">{profile.age} Yrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{language === 'si' ? 'උස' : 'Height'}:</span>
                    <span className="font-bold">{profile.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{language === 'si' ? 'ආගම' : 'Religion'}:</span>
                    <span className="font-bold">{profile.religion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{language === 'si' ? 'කුලය' : 'Caste'}:</span>
                    <span className="font-bold">{profile.casteSubcaste}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{language === 'si' ? 'පදිංචිය' : 'District'}:</span>
                    <span className="font-bold">{profile.location}</span>
                  </div>
                </div>

                {/* Dietary & Habits */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-stone-500">ආහාර රටාව (Diet):</span>
                    <span className="font-semibold">සාමාන්‍ය (Non-Veg)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">මත්පැන්/දුම්වැටි:</span>
                    <span className="font-semibold text-emerald-700">භාවිතයෙන් තොරයි (Teetotaler)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 2/3: Education, Profession, Family & Astrological Summary */}
            <div className="md:col-span-2 space-y-5 text-xs">
              {/* Education & Employment */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#AD3B65] border-b border-[#F8E4EB] pb-1 flex items-center space-x-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>අධ්‍යාපනය සහ රැකියාව (Education & Career)</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 bg-stone-50/70 p-3.5 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-stone-500 block text-[11px]">ඉහළම සුදුසුකම:</span>
                    <span className="font-bold text-stone-900">{profile.education}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">රැකියාව / වෘත්තිය:</span>
                    <span className="font-bold text-stone-900">{profile.occupation}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">සේවා ක්ෂේත්‍රය:</span>
                    <span className="font-semibold text-stone-800">{profile.workplace}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">මාසික ආදායම:</span>
                    <span className="font-semibold text-stone-800">{profile.monthlyIncome || 'LKR 200,000+'}</span>
                  </div>
                </div>
              </div>

              {/* Family Background */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#AD3B65] border-b border-[#F8E4EB] pb-1 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>පවුලේ තොරතුරු (Family Heritage)</span>
                </h4>
                <div className="bg-stone-50/70 p-3.5 rounded-xl border border-stone-200 text-stone-700 leading-relaxed font-serif">
                  {profile.aboutCandidate.si}
                </div>
              </div>

              {/* Partner Expectations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#AD3B65] border-b border-[#F8E4EB] pb-1 flex items-center space-x-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  <span>අපේක්ෂිත සහකරු/සහකාරිය (Partner Preferences)</span>
                </h4>
                <div className="bg-stone-50/70 p-3.5 rounded-xl border border-stone-200 text-stone-700 leading-relaxed font-serif">
                  {profile.partnerPreferences.si}
                </div>
              </div>

              {/* Astrology Summary & Planetary Chart Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#AD3B65] border-b border-[#F8E4EB] pb-1 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ජ්‍යෝතිෂ තොරතුරු (Astrological Details)</span>
                </h4>
                <div className="grid grid-cols-3 gap-2 bg-[#FFF8FA] p-3 rounded-xl border border-[#F8E4EB] text-center">
                  <div>
                    <span className="text-[11px] text-stone-500 block">චන්ද්‍ර රාශිය</span>
                    <span className="font-bold text-stone-900">{profile.rashi || 'කන්‍යා (Kanya)'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">උපන් නැකත</span>
                    <span className="font-bold text-stone-900">{profile.nekatha || 'හත (Hastha)'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">කේන්ද්‍ර පිටපත</span>
                    <span className="font-bold text-emerald-700">පරීක්ෂා කර ඇත (Available)</span>
                  </div>
                </div>

                {/* 12-House Astrological Chart Outline (Traditional Square Style) */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-around text-center text-[10px]">
                  <div className="space-y-1">
                    <span className="font-bold text-stone-600 block">රාශි චක්‍රය (Rashi Chart)</span>
                    <div className="w-24 h-24 border border-stone-400 grid grid-cols-3 grid-rows-3 bg-white text-[9px] font-mono mx-auto">
                      <div className="border border-stone-200 p-0.5">කු</div>
                      <div className="border border-stone-200 p-0.5 font-bold text-[#AD3B65]">ල</div>
                      <div className="border border-stone-200 p-0.5">මී</div>
                      <div className="border border-stone-200 p-0.5">ම</div>
                      <div className="border border-stone-200 p-0.5 text-stone-300">•</div>
                      <div className="border border-stone-200 p-0.5">මේ</div>
                      <div className="border border-stone-200 p-0.5">ධ</div>
                      <div className="border border-stone-200 p-0.5">වෘ</div>
                      <div className="border border-stone-200 p-0.5">තු</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-stone-600 block">නවාංශක චක්‍රය (Navamsha)</span>
                    <div className="w-24 h-24 border border-stone-400 grid grid-cols-3 grid-rows-3 bg-white text-[9px] font-mono mx-auto">
                      <div className="border border-stone-200 p-0.5">සි</div>
                      <div className="border border-stone-200 p-0.5">ක</div>
                      <div className="border border-stone-200 p-0.5">මි</div>
                      <div className="border border-stone-200 p-0.5">කන්</div>
                      <div className="border border-stone-200 p-0.5 text-stone-300">•</div>
                      <div className="border border-stone-200 p-0.5">වෘ</div>
                      <div className="border border-stone-200 p-0.5 font-bold text-[#AD3B65]">ල</div>
                      <div className="border border-stone-200 p-0.5">ධ</div>
                      <div className="border border-stone-200 p-0.5">මේ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agency Seal & Confidentiality Notice Footer */}
          <div className="pt-4 border-t border-stone-200 text-center space-y-1 text-[10px] text-stone-500">
            <p className="font-semibold text-stone-700">
              ජයතු ජය මංගල සේවාව — Jayathu Jaya Matrimonial Services LK
            </p>
            <p>
              මෙම විස්තර පත්‍රිකාව පෞද්ගලික පරිශීලනය සඳහා පමණි. අනවසරයෙන් පිටපත් කිරීම හෝ ප්‍රසිද්ධ කිරීම නීතිවිරෝධී වේ.
            </p>
            <p className="font-mono text-stone-400">
              Hotline: +94 77 123 4567 • Website: www.jayathujaya.lk
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
