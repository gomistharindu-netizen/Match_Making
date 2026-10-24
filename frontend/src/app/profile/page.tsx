'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth, ProfilePhotoItem } from '../../context/AuthContext';
import {
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  Shield,
  Eye,
  Lock,
  Globe,
  Sparkles,
  AlertCircle,
  Save,
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Heart,
  ChevronRight
} from 'lucide-react';

export default function ProfilePage() {
  const { language, t } = useLanguage();
  const { user, profile, isAuthenticated, isLoading, uploadPhoto, updateProfileDetails, refreshProfile } = useAuth();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    district: '',
    city: '',
    country: 'Sri Lanka',
    residence_status: 'Citizen',
    education_level: '',
    profession: '',
    employed_in: 'Private',
    monthly_income_lkr: '',
    height_feet: 5,
    height_inches: 8,
    family_background: '',
    partner_preferences: '',
    horoscope_available: true,
  });

  const [photoVisibility, setPhotoVisibility] = useState('public');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (profile) {
      setFormData({
        district: profile.district || 'Colombo',
        city: profile.city || '',
        country: profile.country || 'Sri Lanka',
        residence_status: profile.residence_status || 'Citizen',
        education_level: profile.education_level || '',
        profession: profile.profession || '',
        employed_in: profile.employed_in || 'Private',
        monthly_income_lkr: profile.monthly_income_lkr || '',
        height_feet: profile.height_feet || 5,
        height_inches: profile.height_inches || 8,
        family_background: profile.family_background || '',
        partner_preferences: profile.partner_preferences || '',
        horoscope_available: profile.horoscope_available ?? true,
      });
    }
  }, [profile]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await uploadPhoto(file, true, photoVisibility);
    setUploading(false);

    if (res.success) {
      setSuccessMessage(
        language === 'si'
          ? 'ඡායාරූපය සාර්ථකව උඩුගත කර Profile පින්තූරය ලෙස සකස් කරන ලදී!'
          : 'Profile photo uploaded and set as primary successfully!'
      );
    } else {
      setErrorMessage(res.message || (language === 'si' ? 'ඡායාරූපය උඩුගත කිරීම අසාර්ථක විය' : 'Failed to upload photo'));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await updateProfileDetails(formData);
    setSaving(false);

    if (res.success) {
      setSuccessMessage(language === 'si' ? 'Profile විස්තර සාර්ථකව යාවත්කාලීන විය!' : 'Profile details updated successfully!');
    } else {
      setErrorMessage(res.message || (language === 'si' ? 'යාවත්කාලීන කිරීම අසාර්ථක විය' : 'Failed to update details'));
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#AD3B65]/30 border-t-[#AD3B65] rounded-full animate-spin" />
      </div>
    );
  }

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Kurunegala', 'Puttalam', 'Anuradhapura',
    'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle', 'Overseas (විදේශගත)'
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF8FA] via-[#F8E4EB]/20 to-[#FFF8FA]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-[#F8E4EB] shadow-sm">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-[#F8E4EB] text-[#AD3B65] text-xs font-bold uppercase tracking-wider">
                {profile.profile_code}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                {language === 'si' ? 'සක්‍රිය සාමාජික' : 'Active Lifetime Member'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#352A30] font-serif">
              {language === 'si' ? 'මගේ Profile තොරතුරු සහ ඡායාරූප' : 'My Profile & Photos'}
            </h1>
          </div>
          <Link
            href="/browse"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-[#FFF8FA] hover:bg-[#F8E4EB] text-[#AD3B65] border border-[#F8E4EB] text-xs font-bold transition self-start sm:self-center"
          >
            <span>{language === 'si' ? 'යෝජනා බලන්න' : 'Browse Proposals'}</span>
            <ChevronRight className="w-4 h-4 text-[#C6A56B]" />
          </Link>
        </div>

        {/* Success / Error Alerts */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-[#F8E4EB] border border-[#AD3B65]/30 text-[#AD3B65] text-sm flex items-center space-x-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Photo Upload & Privacy Card */}
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-[#F8E4EB] shadow-md shadow-[#AD3B65]/5 text-center">
              <h2 className="text-sm font-bold text-[#352A30] uppercase tracking-wider mb-6 flex items-center justify-center space-x-2">
                <Camera className="w-4 h-4 text-[#C6A56B]" />
                <span>{language === 'si' ? 'ප්‍රධාන ඡායාරූපය (Profile Photo)' : 'Primary Profile Photo'}</span>
              </h2>

              {/* Avatar Picture with Upload Overlay */}
              <div className="relative w-44 h-44 mx-auto mb-6 rounded-3xl overflow-hidden border-4 border-white shadow-xl shadow-[#AD3B65]/15 group">
                {profile.primary_photo_url ? (
                  <img
                    src={profile.primary_photo_url}
                    alt={profile.profile_code}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#FFF8FA] flex flex-col items-center justify-center text-[#C6A56B]">
                    <User className="w-16 h-16 opacity-40" />
                    <span className="text-xs text-[#352A30]/60 mt-1">
                      {language === 'si' ? 'ඡායාරූපයක් නැත' : 'No photo yet'}
                    </span>
                  </div>
                )}

                {/* Upload Hover Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-[#352A30]/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <Upload className="w-6 h-6 mb-1 text-[#C6A56B]" />
                  <span className="text-xs font-bold">
                    {language === 'si' ? 'ඡායාරූපය මාරු කරන්න' : 'Change Photo'}
                  </span>
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Button */}
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] hover:from-[#972F55] hover:to-[#AD3B65] text-white font-bold text-xs shadow-md shadow-[#AD3B65]/20 hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-[#C6A56B]" />
                    <span>{language === 'si' ? 'නව ඡායාරූපයක් එක්කරන්න' : 'Upload New Photo'}</span>
                  </>
                )}
              </button>

              <p className="mt-2 text-[11px] text-[#352A30]/60">
                {language === 'si' ? 'JPG, PNG හෝ WebP (උපරිම 10MB)' : 'JPG, PNG or WebP (Max 10MB)'}
              </p>

              {/* Photo Privacy Options */}
              <div className="mt-6 pt-6 border-t border-[#F8E4EB] text-left">
                <label className="block text-xs font-bold text-[#352A30] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#C6A56B]" />
                  <span>{language === 'si' ? 'ඡායාරූපයේ පෞද්ගලිකත්වය' : 'Photo Privacy'}</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-[#FFF8FA] cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={photoVisibility === 'public'}
                      onChange={() => setPhotoVisibility('public')}
                      className="text-[#AD3B65] focus:ring-[#AD3B65]"
                    />
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    <span>{language === 'si' ? 'සියල්ලන්ටම පෙනේ (Public)' : 'Public (Visible to all)'}</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-[#FFF8FA] cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="visibility"
                      value="members_only"
                      checked={photoVisibility === 'members_only'}
                      onChange={() => setPhotoVisibility('members_only')}
                      className="text-[#AD3B65] focus:ring-[#AD3B65]"
                    />
                    <Eye className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{language === 'si' ? 'සාමාජිකයින්ට පමණි (Members Only)' : 'Members Only'}</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-[#FFF8FA] cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="visibility"
                      value="hidden"
                      checked={photoVisibility === 'hidden'}
                      onChange={() => setPhotoVisibility('hidden')}
                      className="text-[#AD3B65] focus:ring-[#AD3B65]"
                    />
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{language === 'si' ? 'යෝජනාව පිළිගත් පසු පමණි (Hidden)' : 'Hidden until Interest Accepted'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Quick Public Preview Card */}
            <div className="bg-[#FFF8FA] p-5 rounded-3xl border border-[#F8E4EB]">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#AD3B65] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A56B]" />
                <span>{language === 'si' ? 'අන් අයට පෙනෙන ආකාරය' : 'Public Card Preview'}</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#F8E4EB] shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F8E4EB] shrink-0">
                    {profile.primary_photo_url ? (
                      <img src={profile.primary_photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 m-3 text-[#AD3B65]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#352A30]">{profile.profile_code}</h4>
                    <p className="text-xs text-[#352A30]/70">{formData.profession || 'Profession'} • {formData.district}</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#352A30]/65 line-clamp-2">
                  {formData.partner_preferences || (language === 'si' ? 'සහකරු පිළිබඳ අපේක්ෂා සටහන් කර නැත' : 'No preferences set')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#F8E4EB] shadow-md shadow-[#AD3B65]/5">
              <h2 className="text-sm font-bold text-[#AD3B65] uppercase tracking-wider mb-6 flex items-center space-x-2">
                <User className="w-4 h-4 text-[#C6A56B]" />
                <span>{language === 'si' ? 'මංගල යෝජනා විස්තර සංස්කරණය (Edit Profile)' : 'Edit Profile Information'}</span>
              </h2>

              <form onSubmit={handleSaveDetails} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* District */}
                  <div>
                    <label className="block text-xs font-bold text-[#352A30] mb-1.5 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C6A56B]" />
                      <span>{language === 'si' ? 'දිස්ත්‍රික්කය / රට' : 'District / Country'}</span>
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                      {language === 'si' ? 'නගරය' : 'City / Town'}
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Nugegoda, Kandy"
                      className="w-full px-3.5 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                    />
                  </div>

                  {/* Profession */}
                  <div>
                    <label className="block text-xs font-bold text-[#352A30] mb-1.5 flex items-center space-x-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#C6A56B]" />
                      <span>{language === 'si' ? 'රැකියාව' : 'Profession'}</span>
                    </label>
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full px-3.5 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                    />
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-xs font-bold text-[#352A30] mb-1.5 flex items-center space-x-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#C6A56B]" />
                      <span>{language === 'si' ? 'අධ්‍යාපන මට්ටම' : 'Education Level'}</span>
                    </label>
                    <input
                      type="text"
                      value={formData.education_level}
                      onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                      placeholder="e.g. BSc, MSc, Professional"
                      className="w-full px-3.5 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                    />
                  </div>

                  {/* Monthly Income */}
                  <div>
                    <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                      {language === 'si' ? 'මාසික ආදායම (LKR)' : 'Monthly Income'}
                    </label>
                    <input
                      type="text"
                      value={formData.monthly_income_lkr}
                      onChange={(e) => setFormData({ ...formData, monthly_income_lkr: e.target.value })}
                      placeholder="e.g. 350,000+"
                      className="w-full px-3.5 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                    />
                  </div>

                  {/* Horoscope Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFF8FA] border border-[#F8E4EB] mt-auto">
                    <div>
                      <span className="block text-xs font-bold text-[#352A30]">
                        {language === 'si' ? 'හඳහන පරීක්ෂා කළ හැක' : 'Horoscope Available'}
                      </span>
                      <span className="text-[11px] text-[#352A30]/60">
                        {language === 'si' ? 'කේන්ද්‍ර ගැලපීම සඳහා ඉදිරිපත් කළ හැක' : 'Can provide for matching'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.horoscope_available}
                      onChange={(e) => setFormData({ ...formData, horoscope_available: e.target.checked })}
                      className="w-4 h-4 text-[#AD3B65] rounded focus:ring-[#AD3B65]"
                    />
                  </div>
                </div>

                {/* Family Background */}
                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'පවුලේ පසුබිම පිළිබඳ සටහනක්' : 'Family Background Note'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.family_background}
                    onChange={(e) => setFormData({ ...formData, family_background: e.target.value })}
                    placeholder={language === 'si' ? 'පවුලේ සාමාජිකයින් සහ ගෞරවනීය තොරතුරු...' : 'Information about family background...'}
                    className="w-full px-3.5 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                  />
                </div>

                {/* Partner Preferences */}
                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'බලාපොරොත්තු වන සහකරු / සහකාරියගේ ගුණාංග' : 'Partner Expectations & Preferences'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.partner_preferences}
                    onChange={(e) => setFormData({ ...formData, partner_preferences: e.target.value })}
                    placeholder={language === 'si' ? 'අධ්‍යාපනය, වයස, ගතිගුණ ආදී අපේක්ෂාවන්...' : 'Expectations regarding education, character, location...'}
                    className="w-full px-3.5 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] hover:from-[#972F55] hover:to-[#AD3B65] text-white font-bold text-sm shadow-lg shadow-[#AD3B65]/20 hover:shadow-xl transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-[#C6A56B]" />
                        <span>{language === 'si' ? 'වෙනස්කම් සුරකින්න' : 'Save Changes'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
