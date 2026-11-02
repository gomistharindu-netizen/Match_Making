'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RotateCcw, Filter, Sparkles, Globe, SlidersHorizontal, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';

export interface FilterState {
  gender: 'all' | 'groom' | 'bride';
  minAge: number;
  maxAge: number;
  religion: string;
  location: string;
  professionCategory: string;
  dietaryHabits: string;
  habitsDrinking: string;
  horoscopeOnly: boolean;
  overseasOnly: boolean;
}

interface SearchFilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filters,
  setFilters,
  onReset,
}) => {
  const { language, t } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F8E4EB] space-y-4">
      <div className="flex items-center justify-between border-b border-[#F8E4EB] pb-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-[#AD3B65]" />
          <h3 className="font-bold text-sm text-[#352A30]">
            {t.profiles.filters}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-[#AD3B65] hover:underline flex items-center space-x-1 font-bold cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvanced ? (language === 'si' ? 'අඩු පෙරහන්' : 'Fewer Filters') : (language === 'si' ? 'වැඩිදුර පෙරහන් (Advanced)' : 'Advanced Filters')}</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onReset}
            className="text-xs text-[#352A30]/60 hover:text-[#AD3B65] flex items-center space-x-1 transition font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.profiles.clearFilters}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {/* Gender */}
        <div>
          <label className="block text-stone-500 font-semibold mb-1">
            {t.hero.lookingFor}
          </label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters((prev) => ({ ...prev, gender: e.target.value as 'all' | 'groom' | 'bride' }))}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-brand-500"
          >
            <option value="all">{language === 'si' ? 'සියල්ල (Groom & Bride)' : 'All Proposals'}</option>
            <option value="bride">{t.hero.bride}</option>
            <option value="groom">{t.hero.groom}</option>
          </select>
        </div>

        {/* Min Age */}
        <div>
          <label className="block text-stone-500 font-semibold mb-1">
            {language === 'si' ? 'අවම වයස' : 'Min Age'}
          </label>
          <select
            value={filters.minAge}
            onChange={(e) => setFilters((prev) => ({ ...prev, minAge: Number(e.target.value) }))}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-brand-500"
          >
            {[20, 22, 24, 26, 28, 30, 35].map((age) => (
              <option key={age} value={age}>
                {age} {language === 'si' ? 'වසර' : 'Yrs'}
              </option>
            ))}
          </select>
        </div>

        {/* Max Age */}
        <div>
          <label className="block text-stone-500 font-semibold mb-1">
            {language === 'si' ? 'උපරිම වයස' : 'Max Age'}
          </label>
          <select
            value={filters.maxAge}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxAge: Number(e.target.value) }))}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-brand-500"
          >
            {[26, 28, 30, 32, 35, 40, 50].map((age) => (
              <option key={age} value={age}>
                {age} {language === 'si' ? 'වසර' : 'Yrs'}
              </option>
            ))}
          </select>
        </div>

        {/* Religion */}
        <div>
          <label className="block text-stone-500 font-semibold mb-1">
            {t.hero.religion}
          </label>
          <select
            value={filters.religion}
            onChange={(e) => setFilters((prev) => ({ ...prev, religion: e.target.value }))}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-brand-500"
          >
            <option value="all">{t.hero.allReligions}</option>
            <option value="Buddhist">Buddhist (බෞද්ධ)</option>
            <option value="Christian">Christian / Catholic (ක්‍රිස්තියානි)</option>
            <option value="Hindu">Hindu (හින්දු)</option>
            <option value="Islam">Islam (මුස්ලිම්)</option>
          </select>
        </div>

        {/* Location / Country */}
        <div>
          <label className="block text-stone-500 font-semibold mb-1">
            {t.hero.location}
          </label>
          <select
            value={filters.location}
            onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-brand-500"
          >
            <option value="all">{t.hero.allLocations}</option>
            <option value="Colombo">Colombo (කොළඹ)</option>
            <option value="Kandy">Kandy (මහනුවර)</option>
            <option value="Gampaha">Gampaha (ගම්පහ)</option>
            <option value="Galle">Galle (ගාල්ල)</option>
            <option value="Australia">Australia (ඕස්ට්‍රේලියාව)</option>
            <option value="United Kingdom">United Kingdom (එංගලන්තය)</option>
          </select>
        </div>

        {/* Horoscope Only Toggle */}
        <div className="flex flex-col justify-end space-y-2 pt-1">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.horoscopeOnly}
              onChange={(e) => setFilters((prev) => ({ ...prev, horoscopeOnly: e.target.checked }))}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span className="text-stone-700 font-semibold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>{t.profiles.horoscopeAvailable}</span>
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.overseasOnly}
              onChange={(e) => setFilters((prev) => ({ ...prev, overseasOnly: e.target.checked }))}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-stone-700 font-semibold flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>{t.profiles.overseas}</span>
            </span>
          </label>
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {showAdvanced && (
        <div className="pt-3 border-t border-[#F8E4EB] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-fadeIn">
          {/* Profession Category */}
          <div>
            <label className="block text-stone-500 font-semibold mb-1">
              {language === 'si' ? 'රැකියා ක්ෂේත්‍රය (Profession Field)' : 'Profession Category'}
            </label>
            <select
              value={filters.professionCategory}
              onChange={(e) => setFilters((prev) => ({ ...prev, professionCategory: e.target.value }))}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-[#AD3B65]"
            >
              <option value="all">{language === 'si' ? 'සියලුම ක්ෂේත්‍ර (All Professions)' : 'All Fields'}</option>
              <option value="medical">Medical / Doctors / Healthcare (වෛද්‍ය/සෞඛ්‍ය)</option>
              <option value="engineering">Engineering / Architects (ඉංජිනේරු)</option>
              <option value="software_it">Software / IT / Tech (මෘදුකාංග/තොරතුරු තාක්ෂණ)</option>
              <option value="government">Government & Executive (රාජ්‍ය/විධායක)</option>
              <option value="legal_banking">Banking, Finance & Legal (බැංකු/නීති)</option>
              <option value="business">Business & Entrepreneurs (ව්‍යාපාරික)</option>
              <option value="academic">Teachers & Academics (අධ්‍යාපන/ආචාර්ය)</option>
            </select>
          </div>

          {/* Dietary Habits */}
          <div>
            <label className="block text-stone-500 font-semibold mb-1">
              {language === 'si' ? 'ආහාර රටාව (Dietary Habits)' : 'Dietary Habits'}
            </label>
            <select
              value={filters.dietaryHabits}
              onChange={(e) => setFilters((prev) => ({ ...prev, dietaryHabits: e.target.value }))}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-[#AD3B65]"
            >
              <option value="all">{language === 'si' ? 'ඕනෑම (Any Diet)' : 'Any Diet'}</option>
              <option value="vegetarian">Vegetarian only (නිර්මාංශ පමණක්)</option>
              <option value="non_vegetarian">Non-Vegetarian (සාමාන්‍ය ආහාර)</option>
            </select>
          </div>

          {/* Alcohol & Habits */}
          <div>
            <label className="block text-stone-500 font-semibold mb-1">
              {language === 'si' ? 'මත්පැන් භාවිතය (Drinking Habits)' : 'Drinking Habits'}
            </label>
            <select
              value={filters.habitsDrinking}
              onChange={(e) => setFilters((prev) => ({ ...prev, habitsDrinking: e.target.value }))}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-[#AD3B65]"
            >
              <option value="all">{language === 'si' ? 'ඕනෑම (Any)' : 'Any'}</option>
              <option value="teetotaler">Teetotaler / Non-drinker (භාවිතයෙන් තොරයි)</option>
              <option value="social">Social Drinker (ඉඳහිට)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
