'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MatrimonialProfile } from '../data/mockProfiles';
import { useLanguage } from '../context/LanguageContext';
import { useDemo } from '../context/DemoContext';
import { useAuth } from '../context/AuthContext';
import { Heart, Sparkles, MapPin, Briefcase, GraduationCap, Globe, Check, Eye } from 'lucide-react';

interface ProfileCardProps {
  profile: MatrimonialProfile;
  onOpenModal: (profile: MatrimonialProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onOpenModal }) => {
  const { language, t } = useLanguage();
  const { sendInterest } = useDemo();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const isPending = profile.interestStatus === 'pending';
  const isAccepted = profile.interestStatus === 'accepted';

  const handleInterest = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/browse&reason=interest');
      return;
    }
    sendInterest(profile.id);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F8E4EB] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#AD3B65]/30 transition duration-300 flex flex-col group">
      {/* Top Image & Badges */}
      <div className="relative h-64 w-full bg-stone-100 overflow-hidden">
        <img
          src={profile.photoUrl}
          alt={`Profile ${profile.code}`}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Top Badges Header Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 z-10">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="bg-[#AD3B65]/90 text-white font-mono text-xs px-2.5 py-1 rounded-md font-bold tracking-wide backdrop-blur border border-white/20 shadow-sm">
              {profile.code}
            </span>
            {profile.isOverseas && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1 shadow">
                <Globe className="w-3 h-3" />
                <span>{t.profiles.overseas}</span>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Details on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold">
              {profile.age} {language === 'si' ? 'වසර' : 'Yrs'}
            </span>
            <span className="text-stone-300 text-sm">
              • {profile.height}
            </span>
            <span className="text-xs bg-white/20 backdrop-blur px-2 py-0.5 rounded text-[#C6A56B] font-medium">
              {profile.gender === 'bride' ? t.hero.bride : t.hero.groom}
            </span>
          </div>
          <p className="text-xs text-stone-200 flex items-center mt-1">
            <MapPin className="w-3 h-3 mr-1 text-[#C6A56B] shrink-0" />
            <span className="truncate">{profile.location}</span>
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5 text-xs text-stone-600">
          {/* Profession */}
          <div className="flex items-start space-x-2">
            <Briefcase className="w-4 h-4 text-[#AD3B65] mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-[#352A30] block text-sm">
                {profile.occupation}
              </span>
              <span className="text-[#352A30]/70 text-[11px]">
                {profile.workplace}
              </span>
            </div>
          </div>

          {/* Education */}
          <div className="flex items-start space-x-2">
            <GraduationCap className="w-4 h-4 text-[#AD3B65] mt-0.5 shrink-0" />
            <div>
              <span className="text-[#352A30] font-medium block">
                {profile.education}
              </span>
            </div>
          </div>

          {/* Key tags: Religion, Horoscope, Managed By */}
          <div className="pt-2 flex flex-wrap gap-1.5">
            <span className="bg-[#FFF8FA] text-[#352A30] border border-[#F8E4EB] px-2 py-0.5 rounded text-[11px] font-medium">
              {profile.religion}
            </span>
            <span className="bg-[#FFF8FA] text-[#352A30] border border-[#F8E4EB] px-2 py-0.5 rounded text-[11px] font-medium">
              {language === 'si' ? `භාරකරු: ${profile.managedBy}` : `Managed by: ${profile.managedBy}`}
            </span>
            {profile.horoscopeAvailable && (
              <span className="bg-[#C6A56B]/15 text-[#815e37] border border-[#C6A56B]/30 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#C6A56B]" />
                <span>
                  {profile.porondamScore ? `Porondam: ${profile.porondamScore}/20` : t.profiles.horoscopeAvailable}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Card Actions - Equal 50/50 Dual Luxury Buttons */}
        <div className="pt-3 border-t border-[#F8E4EB] grid grid-cols-2 gap-2">
          {/* View Details Button */}
          <button
            type="button"
            onClick={() => onOpenModal(profile)}
            className="w-full h-10 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 bg-[#FFF8FA] hover:bg-[#F8E4EB] text-[#352A30] hover:text-[#AD3B65] border border-[#F8E4EB] hover:border-[#AD3B65]/30 shadow-xs active:scale-[0.98]"
            title={t.profiles.viewDetails}
          >
            <Eye className="w-3.5 h-3.5 text-[#AD3B65] shrink-0" />
            <span className="whitespace-nowrap truncate">{t.profiles.viewDetails}</span>
          </button>

          {/* Express Interest Button */}
          <button
            type="button"
            onClick={handleInterest}
            className={`w-full h-10 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs active:scale-[0.98] ${
              isAccepted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : isPending
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] hover:from-[#972F55] hover:to-[#AD3B65] text-white shadow-md shadow-[#AD3B65]/20 hover:shadow-lg'
            }`}
            title={t.profiles.expressInterest}
          >
            {isAccepted ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="whitespace-nowrap truncate">{t.profiles.contactApproved}</span>
              </>
            ) : isPending ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping mr-0.5 shrink-0" />
                <span className="whitespace-nowrap truncate">{t.profiles.interestSent}</span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5 fill-current shrink-0 text-white" />
                <span className="whitespace-nowrap truncate">{t.profiles.expressInterest}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
