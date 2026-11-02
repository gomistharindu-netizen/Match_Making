'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useDemo } from '../../context/DemoContext';
import { ProfileCard } from '../../components/ProfileCard';
import { ProfileModal } from '../../components/ProfileModal';
import { SearchFilterBar, FilterState } from '../../components/SearchFilterBar';
import { PageHeaderBanner } from '../../components/PageHeaderBanner';
import { MatrimonialProfile } from '../../data/mockProfiles';
import { Search } from 'lucide-react';

function BrowseContent() {
  const { language, t } = useLanguage();
  const { profiles } = useDemo();
  const searchParams = useSearchParams();

  // Read initial query params if present
  const paramGender = searchParams.get('gender');
  const initialGender: 'all' | 'groom' | 'bride' =
    paramGender === 'groom' || paramGender === 'bride' ? paramGender : 'all';
  const initialLocation = searchParams.get('location') || 'all';

  const [filters, setFilters] = useState<FilterState>({
    gender: initialGender,
    minAge: 20,
    maxAge: 45,
    religion: 'all',
    location: initialLocation,
    professionCategory: 'all',
    dietaryHabits: 'all',
    habitsDrinking: 'all',
    horoscopeOnly: false,
    overseasOnly: false,
  });

  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);

  const handleReset = () => {
    setFilters({
      gender: 'all',
      minAge: 20,
      maxAge: 45,
      religion: 'all',
      location: 'all',
      professionCategory: 'all',
      dietaryHabits: 'all',
      habitsDrinking: 'all',
      horoscopeOnly: false,
      overseasOnly: false,
    });
  };

  // Filter logic
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Gender filter
      if (filters.gender !== 'all' && p.gender !== filters.gender) {
        return false;
      }
      // Age filter
      if (p.age < filters.minAge || p.age > filters.maxAge) {
        return false;
      }
      // Religion filter
      if (filters.religion !== 'all' && !p.religion.toLowerCase().includes(filters.religion.toLowerCase())) {
        return false;
      }
      // Location filter
      if (filters.location !== 'all' && !p.location.toLowerCase().includes(filters.location.toLowerCase()) && !p.country.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      // Horoscope filter
      if (filters.horoscopeOnly && !p.horoscopeAvailable) {
        return false;
      }
      // Overseas filter
      if (filters.overseasOnly && !p.isOverseas) {
        return false;
      }
      // Profession Category filter
      if (filters.professionCategory && filters.professionCategory !== 'all') {
        const occ = (p.occupation || '').toLowerCase();
        const cat = filters.professionCategory.toLowerCase();
        if (cat === 'medical' && !occ.match(/doctor|medical|surgeon|dental|physician|nurse/)) return false;
        if (cat === 'engineering' && !occ.match(/engineer|architect|civil|mechanical|electrical/)) return false;
        if (cat === 'software_it' && !occ.match(/software|it|developer|programmer|tech|data|lead/)) return false;
        if (cat === 'government' && !occ.match(/executive|government|officer|assistant|state|public/)) return false;
        if (cat === 'legal_banking' && !occ.match(/bank|finance|account|lawyer|attorney|audit/)) return false;
        if (cat === 'business' && !occ.match(/business|entrepreneur|director|owner|manager/)) return false;
        if (cat === 'academic' && !occ.match(/teacher|lecturer|professor|academic|instructor/)) return false;
      }
      return true;
    });
  }, [profiles, filters]);

  return (
    <div className="space-y-8 pb-16">
      {/* Full-Screen Width Royal Banner */}
      <PageHeaderBanner
        badgeText={language === 'si' ? 'විශ්වාසනීය සහතික කළ යෝජනා' : 'Verified Proposal Directory'}
        titlePrefix={language === 'si' ? 'ගෞරවනීය' : 'Verified'}
        titleHighlight={language === 'si' ? 'මංගල යෝජනා' : 'Matrimonial Proposals'}
        titleSuffix={language === 'si' ? 'නාමාවලිය' : ''}
        subtitle={
          language === 'si'
            ? 'ශ්‍රී ලාංකික සම්ප්‍රදායට ගරු කරමින්, දෙපාර්ශවයේ සෘජු අනුමැතියෙන් පමණක් දුරකථන අංක හුවමාරු වන පෞද්ගලිකත්ව ආරක්ෂාව සහිත මංගල යෝජනා.'
            : 'Browse verified public-safe candidate profiles with owner-approved contact privacy.'
        }
        breadcrumbCurrent={language === 'si' ? 'මංගල යෝජනා' : 'Proposals'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Bar */}
        <SearchFilterBar
          filters={filters}
          setFilters={setFilters}
        onReset={handleReset}
      />

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs font-semibold text-[#352A30] bg-[#F8E4EB]/60 px-4 py-2.5 rounded-xl border border-[#F8E4EB]">
        <span>
          {language === 'si'
            ? `ගැලපෙන යෝජනා ${filteredProfiles.length} ක් හමුවිය`
            : `Showing ${filteredProfiles.length} matching proposals`}
        </span>
        <span className="text-[#352A30]/60">
          {language === 'si' ? 'නිරන්තරයෙන් යාවත්කාලීන වේ' : 'Updated regularly'}
        </span>
      </div>

      {/* Profile Grid */}
      {filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onOpenModal={(p) => setSelectedProfile(p)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#F8E4EB] space-y-3">
          <Search className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-[#352A30] font-bold text-base">
            {t.profiles.noResults}
          </h3>
          <p className="text-xs text-[#352A30]/70 max-w-sm mx-auto">
            {language === 'si'
              ? 'කරුණාකර පෙරහන් (Filters) ලිහිල් කර නැවත සොයන්න.'
              : 'Try clearing or relaxing some of your filters to see more profiles.'}
          </p>
          <button
            onClick={handleReset}
            className="mt-2 bg-[#AD3B65] hover:bg-[#972F55] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
          >
            {t.profiles.clearFilters}
          </button>
        </div>
      )}

      {/* Profile Detail Modal */}
      <ProfileModal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-stone-500">Loading proposals...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
