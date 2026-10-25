'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MatrimonialProfile } from '../data/mockProfiles';
import { useLanguage } from '../context/LanguageContext';
import { useDemo } from '../context/DemoContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  ShieldCheck,
  Lock,
  Unlock,
  Phone,
  MessageCircle,
  Mail,
  User,
  Sparkles,
  Heart,
  CheckCircle,
} from 'lucide-react';

interface ProfileModalProps {
  profile: MatrimonialProfile | null;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose }) => {
  const { language, t } = useLanguage();
  const { sendInterest, unlockContact } = useDemo();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!profile) return null;

  const isPending = profile.interestStatus === 'pending';
  const isAccepted = profile.interestStatus === 'accepted';

  const handleInterest = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/browse&reason=interest');
      return;
    }
    sendInterest(profile.id);
  };
  const isUnlocked = profile.contactReleased;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header bar */}
        <div className="bg-[#AD3B65] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm font-bold bg-white/20 px-2.5 py-1 rounded-md text-[#C6A56B]">
              {profile.code}
            </span>
            <span className="text-sm font-semibold text-stone-200">
              {profile.gender === 'bride' ? t.hero.bride : t.hero.groom} • {profile.age} Yrs • {profile.location}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-stone-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Banner & Photo */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-full sm:w-48 h-56 rounded-2xl overflow-hidden bg-stone-100 shrink-0 relative shadow-md">
              <img
                src={profile.photoUrl}
                alt={profile.code}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-stone-900">
                  {profile.occupation}
                </h3>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                {profile.workplace}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">{t.profiles.age} & {t.profiles.height}</span>
                  <span className="font-semibold text-stone-800">{profile.age} Yrs • {profile.height}</span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">{t.profiles.maritalStatus}</span>
                  <span className="font-semibold text-stone-800">{profile.maritalStatus}</span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">{t.profiles.religion}</span>
                  <span className="font-semibold text-stone-800">{profile.religion}</span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">{t.profiles.managedBy}</span>
                  <span className="font-semibold text-stone-800">{profile.managedBy}</span>
                </div>
              </div>
            </div>
          </div>

          {/* About & Lifestyle */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-brand-900 uppercase tracking-wider flex items-center">
              <User className="w-4 h-4 mr-1.5 text-brand-600" />
              {language === 'si' ? 'අපේක්ෂකයා පිළිබඳ විස්තරය' : 'About Candidate & Lifestyle'}
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              {language === 'si' ? profile.aboutCandidate.si : profile.aboutCandidate.en}
            </p>
          </div>

          {/* Family Background */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-brand-900 uppercase tracking-wider flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-brand-600" />
              {language === 'si' ? 'පවුලේ පසුබිම' : 'Family Background'}
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              {language === 'si' ? profile.familyDetails.si : profile.familyDetails.en}
            </p>
          </div>

          {/* Partner Expectations */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-brand-900 uppercase tracking-wider flex items-center">
              <Heart className="w-4 h-4 mr-1.5 text-brand-600" />
              {language === 'si' ? 'සහකරු පිළිබඳ බලාපොරොත්තු' : 'Partner Expectations'}
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              {language === 'si' ? profile.partnerPreferences.si : profile.partnerPreferences.en}
            </p>
          </div>

          {/* Astrological / Horoscope Details */}
          {profile.horoscopeAvailable && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5 text-gold-600" />
                {language === 'si' ? 'කේන්ද්‍ර සහ පොරොන්දම් තොරතුරු' : 'Astrological & Horoscope Information'}
              </h4>
              <div className="bg-gold-50/80 border border-gold-200 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-stone-500 block text-[11px]">Rashi (රාශිය):</span>
                  <span className="font-bold text-stone-900">{profile.rashi || 'Recorded'}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Nekatha (නැකත):</span>
                  <span className="font-bold text-stone-900">{profile.nekatha || 'Recorded'}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Porondam Compatibility:</span>
                  <span className="font-bold text-emerald-700">{profile.porondamScore ? `${profile.porondamScore} / 20 Compatible` : 'Available on request'}</span>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT RELEASE SECTION (Key Feature) */}
          <div className="pt-2">
            <div className={`p-5 rounded-2xl border-2 transition ${
              isUnlocked
                ? 'bg-emerald-50/90 border-emerald-300'
                : 'bg-stone-100/90 border-stone-300'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {isUnlocked ? (
                    <Unlock className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-stone-600" />
                  )}
                  <h4 className="font-bold text-sm text-stone-900">
                    {isUnlocked ? t.contactPrivacy.revealedTitle : t.contactPrivacy.heading}
                  </h4>
                </div>

                {/* Simulation button for demo */}
                <button
                  onClick={() => unlockContact(profile.id)}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold transition border ${
                    isUnlocked
                      ? 'bg-stone-200 text-stone-700 hover:bg-stone-300 border-stone-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700 shadow-sm'
                  }`}
                  title="Demonstrate owner approval release"
                >
                  {isUnlocked ? 'Simulate Re-Lock' : '✨ Simulate Owner Release'}
                </button>
              </div>

              {isUnlocked ? (
                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-2.5 bg-emerald-100/60 rounded-xl text-emerald-900 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{t.contactPrivacy.grantAccess}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                      <span className="text-stone-500 text-[11px] block">{t.contactPrivacy.guardian}</span>
                      <span className="font-bold text-stone-900 text-sm">{profile.privateContacts.fullName}</span>
                      <span className="text-[11px] text-stone-600 block">({profile.privateContacts.relationship})</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                      <span className="text-stone-500 text-[11px] block">{t.contactPrivacy.phone}</span>
                      <a href={`tel:${profile.privateContacts.phone}`} className="font-bold text-brand-600 text-sm flex items-center hover:underline">
                        <Phone className="w-3.5 h-3.5 mr-1" />
                        {profile.privateContacts.phone}
                      </a>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                      <span className="text-stone-500 text-[11px] block">{t.contactPrivacy.whatsapp}</span>
                      <a href={`https://wa.me/${profile.privateContacts.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="font-bold text-emerald-600 text-sm flex items-center hover:underline">
                        <MessageCircle className="w-3.5 h-3.5 mr-1" />
                        {profile.privateContacts.whatsapp}
                      </a>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                      <span className="text-stone-500 text-[11px] block">{t.contactPrivacy.email}</span>
                      <span className="font-semibold text-stone-800 text-xs flex items-center truncate">
                        <Mail className="w-3.5 h-3.5 mr-1 text-stone-500" />
                        {profile.privateContacts.email}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-stone-600">
                  <p className="leading-relaxed">
                    {t.contactPrivacy.notice}
                  </p>
                  <div className="bg-white/80 p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span className="font-mono text-stone-400 blur-sm select-none">
                      +94 7X XXX XXXX • Mrs. XXXXXXX
                    </span>
                    <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {t.contactPrivacy.ownerApprovalRequired}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
          >
            {language === 'si' ? 'වසන්න (Close)' : 'Close'}
          </button>

          <button
            onClick={handleInterest}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              isAccepted
                ? 'bg-emerald-600 text-white shadow'
                : isPending
                ? 'bg-amber-500 text-white shadow'
                : 'bg-[#AD3B65] hover:bg-[#972F55] text-white shadow-md shadow-[#AD3B65]/20 hover:shadow-lg'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>
              {isAccepted
                ? t.profiles.contactApproved
                : isPending
                ? t.profiles.interestSent
                : t.profiles.expressInterest}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
