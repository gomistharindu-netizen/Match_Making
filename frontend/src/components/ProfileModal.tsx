'use client';

import React, { useState } from 'react';
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
  Flag,
  Ban,
  AlertTriangle,
  Printer,
} from 'lucide-react';
import { BioDataModal } from './BioDataModal';
import { PorondamCalculatorModal } from './PorondamCalculatorModal';

interface ProfileModalProps {
  profile: MatrimonialProfile | null;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose }) => {
  const { language, t } = useLanguage();
  const { sendInterest, isShortlisted, toggleShortlist, blockUser, reportUser, requestPhotoAccess, isPhotoRequested } = useDemo();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [photoRequested, setPhotoRequested] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('spam');
  const [reportDescription, setReportDescription] = useState<string>('');
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [blockMessage, setBlockMessage] = useState<string>('');

  const [showBioDataModal, setShowBioDataModal] = useState<boolean>(false);
  const [showPorondamModal, setShowPorondamModal] = useState<boolean>(false);

  if (!profile) return null;

  const isFav = isShortlisted(profile.code);
  const isPending = profile.interestStatus === 'pending';
  const isAccepted = profile.interestStatus === 'accepted';

  const handleInterest = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/browse&reason=interest');
      return;
    }
    sendInterest(profile.id);
  };

  const handleBlock = async () => {
    const res = await blockUser(profile.code);
    setBlockMessage(res.message);
    setTimeout(() => {
      setShowBlockModal(false);
      onClose();
    }, 1500);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await reportUser(profile.code, reportReason, reportDescription);
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
      setReportDescription('');
    }, 2000);
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
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => toggleShortlist(profile.code)}
              title={isFav ? 'Remove from Shortlist' : 'Add to Shortlist'}
              className={`p-2 rounded-full transition cursor-pointer flex items-center space-x-1 text-xs font-semibold ${
                isFav
                  ? 'bg-white text-[#AD3B65] shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-[#AD3B65]' : ''}`} />
              <span className="hidden sm:inline">
                {isFav
                  ? (language === 'si' ? 'කැමති ලැයිස්තුවේ' : 'Shortlisted')
                  : (language === 'si' ? 'කැමති කරගන්න' : 'Shortlist')}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-stone-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Banner & Photo */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-full sm:w-48 h-56 rounded-2xl overflow-hidden bg-stone-100 shrink-0 relative shadow-md">
              <img
                src={profile.photoUrl}
                alt={profile.code}
                className={`w-full h-full object-cover ${
                  profile.photoIsPrivate ? 'filter blur-md scale-110' : ''
                }`}
              />
              {profile.photoIsPrivate && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center text-white">
                  <div className="w-9 h-9 rounded-full bg-black/60 flex items-center justify-center mb-1.5 border border-white/20 shadow">
                    <Lock className="w-4 h-4 text-amber-300" />
                  </div>
                  <p className="text-xs font-semibold mb-2">
                    {language === 'si' ? 'ඡායාරූපය රහස්‍යයි' : 'Photo Protected'}
                  </p>
                  {isPhotoRequested(profile.code) || photoRequested ? (
                    <span className="text-[11px] font-medium bg-emerald-600/90 text-white px-2.5 py-1 rounded-full shadow">
                      {language === 'si' ? 'ඉල්ලීම යවා ඇත ✓' : 'Requested ✓'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        if (!isAuthenticated) {
                          router.push('/login?redirect=/browse&reason=photo_access');
                          return;
                        }
                        await requestPhotoAccess(profile.code);
                        setPhotoRequested(true);
                      }}
                      className="text-[11px] font-semibold bg-[#AD3B65] hover:bg-[#8f3053] text-white px-3 py-1.5 rounded-lg shadow transition cursor-pointer"
                    >
                      {language === 'si' ? 'බැලීමට ඉල්ලුම් කරන්න' : 'Request Access'}
                    </button>
                  )}
                </div>
              )}
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
                <div>
                  <button
                    type="button"
                    onClick={() => setShowPorondamModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] transition shadow-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F3DEB3]" />
                    <span>{language === 'si' ? 'පොරොන්දම් පරීක්ෂාව' : 'Check Porondam'}</span>
                  </button>
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
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
            >
              {language === 'si' ? 'වසන්න (Close)' : 'Close'}
            </button>
            <button
              type="button"
              onClick={() => setShowBlockModal(true)}
              className="px-2.5 py-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium transition flex items-center space-x-1 cursor-pointer"
              title={language === 'si' ? 'මෙම සාමාජිකයා Block කරන්න' : 'Block this member'}
            >
              <Ban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'si' ? 'Block කරන්න' : 'Block'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="px-2.5 py-1.5 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-medium transition flex items-center space-x-1 cursor-pointer"
              title={language === 'si' ? 'අනිසි හැසිරීමක් වාර්තා කරන්න' : 'Report profile'}
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'si' ? 'වාර්තා කරන්න' : 'Report'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowBioDataModal(true)}
              className="px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
              title="Printable Bio-Data"
            >
              <Printer className="w-3.5 h-3.5 text-[#AD3B65]" />
              <span className="hidden sm:inline">{language === 'si' ? 'විස්තර පත්‍රිකාව (PDF)' : 'Bio-Data PDF'}</span>
            </button>

            <button
              onClick={handleInterest}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
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

      {/* Block Confirmation Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-rose-100">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Ban className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-stone-900">
                {language === 'si' ? `${profile.code} Block කරනවාද?` : `Block ${profile.code}?`}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'si'
                  ? 'මෙම සාමාජිකයා Block කළ පසු ඔහුට ඔබගේ පැතිකඩ නොපෙනෙන අතර පණිවිඩ එවීමටද නොහැකි වේ.'
                  : 'Once blocked, this member cannot see your profile or send you messages.'}
              </p>
            </div>
            {blockMessage ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs text-center font-medium">
                {blockMessage}
              </div>
            ) : (
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition"
                >
                  {language === 'si' ? 'අවලංගුයි' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleBlock}
                  className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow transition cursor-pointer"
                >
                  {language === 'si' ? 'ඔව්, Block කරන්න' : 'Yes, Block'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Inappropriate Behavior Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-amber-100">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-stone-900">
                  {language === 'si' ? `${profile.code} පිළිබඳ වාර්තා කරන්න` : `Report Profile: ${profile.code}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs text-center font-medium space-y-1">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                <p>{language === 'si' ? 'ඔබගේ වාර්තාව සාර්ථකව භාරගන්නා ලදී.' : 'Your report has been submitted.'}</p>
                <p className="text-[11px] text-emerald-600">{language === 'si' ? 'ආයතනයේ කාර්ය මණ්ඩලය විමර්ශනය කරනු ඇත.' : 'Agency staff will review and take action.'}</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    {language === 'si' ? 'වාර්තා කිරීමට හේතුව' : 'Reason for report'}
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#AD3B65]"
                  >
                    <option value="spam">{language === 'si' ? 'අනවශ්‍ය පණිවිඩ / Spam' : 'Spam messages'}</option>
                    <option value="harassment">{language === 'si' ? 'නුසුදුසු / හිරිහැරකාරී හැසිරීම' : 'Harassment / Abusive'}</option>
                    <option value="fake_profile">{language === 'si' ? 'ව්‍යාජ තොරතුරු සහිත පැතිකඩක්' : 'Fake profile / Misleading info'}</option>
                    <option value="commercial">{language === 'si' ? 'ව්‍යාපාරික කටයුතු ප්‍රවර්ධනය' : 'Commercial solicitation'}</option>
                    <option value="other">{language === 'si' ? 'වෙනත් හේතුවක්' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    {language === 'si' ? 'විස්තරය (Description)' : 'Details'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder={language === 'si' ? 'සිදුවූ දෙය පැහැදිලි කරන්න...' : 'Please provide details...'}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#AD3B65]"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
                  >
                    {language === 'si' ? 'අවලංගුයි' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-[#AD3B65] hover:bg-[#972F55] text-white rounded-xl shadow transition cursor-pointer"
                  >
                    {language === 'si' ? 'වාර්තාව යවන්න' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Printable Bio-Data Sheet Modal */}
      <BioDataModal
        profile={profile}
        isOpen={showBioDataModal}
        onClose={() => setShowBioDataModal(false)}
      />

      {/* Porondam Calculator Modal */}
      <PorondamCalculatorModal
        isOpen={showPorondamModal}
        onClose={() => setShowPorondamModal(false)}
        candidateCode={profile.code}
      />
    </div>
  );
};
