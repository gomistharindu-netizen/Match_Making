'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, User, Mail, Phone, Lock, Calendar, MapPin, Briefcase, GraduationCap, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const { language, t } = useLanguage();
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    gender: 'bride',
    birth_date: '1998-05-15',
    district: 'Colombo',
    city: '',
    religion: 'Buddhist',
    caste: 'Govigama',
    education_level: 'Bachelor Degree',
    profession: '',
    managed_by_type: 'self',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Kurunegala', 'Puttalam', 'Anuradhapura',
    'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle', 'Overseas (විදේශගත)'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      setError(language === 'si' ? 'කරුණාකර සියලු අනිවාර්ය තොරතුරු සම්පූර්ණ කරන්න.' : 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      router.push('/browse');
    } else {
      setError(result.message || (language === 'si' ? 'ලියාපදිංචි වීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.' : 'Registration failed. Please try again.'));
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF8FA] via-[#F8E4EB]/30 to-[#FFF8FA]">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#AD3B65] to-[#8E2E52] shadow-lg shadow-[#AD3B65]/30 mb-4">
            <Heart className="w-7 h-7 text-white fill-current" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#352A30]">
            {language === 'si' ? 'නොමිලේ සාමාජිකත්වය ලබාගන්න' : 'Create Your Member Profile'}
          </h2>
          <p className="mt-2 text-sm text-[#352A30]/75">
            {language === 'si'
              ? 'ජයතු ජය මංගල සේවාව හා එක්වී ගෞරවනීය සහකරුවෙකු / සහකාරියක සොයාගන්න'
              : 'Join Jayathu Jaya Matrimonial to connect with verified Sri Lankan families'}
          </p>

          {/* Free Mode Active Banner */}
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {language === 'si'
                ? 'නොමිලේ ලියාපදිංචිය සක්‍රියයි — ජීවිත කාලයටම සම්පූර්ණ පහසුකම් නොමිලේ!'
                : 'Free Mode Active — Enjoy full lifetime membership privileges for free!'}
            </span>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#AD3B65]/5 border border-[#F8E4EB]">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-[#F8E4EB] border border-[#AD3B65]/30 flex items-start space-x-3 text-sm text-[#AD3B65]">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Account Login Details */}
            <div>
              <h3 className="text-sm font-bold text-[#AD3B65] uppercase tracking-wider mb-4 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#F8E4EB] text-[#AD3B65] flex items-center justify-center text-xs">1</span>
                <span>{language === 'si' ? 'ගිණුම් තොරතුරු (Account Credentials)' : 'Account Credentials'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'සම්පූර්ණ නම' : 'Full Name'} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#C6A56B]" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={language === 'si' ? 'කසුන් පෙරේරා' : 'Kasun Perera'}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'ඊමේල් ලිපිනය' : 'Email Address'} *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#C6A56B]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="kasun@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'දුරකථන අංකය (WhatsApp)' : 'Phone Number (WhatsApp)'} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#C6A56B]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 71 234 5678"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'මුරපදය (Password)' : 'Password'} *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#C6A56B]" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Candidate Matrimonial Profile */}
            <div className="pt-4 border-t border-[#F8E4EB]">
              <h3 className="text-sm font-bold text-[#AD3B65] uppercase tracking-wider mb-4 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#F8E4EB] text-[#AD3B65] flex items-center justify-center text-xs">2</span>
                <span>{language === 'si' ? 'මංගල යෝජනා තොරතුරු (Matrimonial Profile)' : 'Matrimonial Profile Details'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'මනාලයා / මනාලිය' : 'Looking For'}
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                  >
                    <option value="bride">{language === 'si' ? 'මනාලියක් (Bride)' : 'Bride'}</option>
                    <option value="groom">{language === 'si' ? 'මනාලයෙක් (Groom)' : 'Groom'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'උපන් දිනය' : 'Date of Birth'}
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'දිස්ත්‍රික්කය / රට' : 'District / Country'}
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'නගරය' : 'City / Suburb'}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={language === 'si' ? 'නුගේගොඩ, මහරගම...' : 'e.g. Nugegoda, Kandy'}
                    className="w-full px-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'ආගම' : 'Religion'}
                  </label>
                  <select
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                  >
                    <option value="Buddhist">බෞද්ධ (Buddhist)</option>
                    <option value="Christian">ක්‍රිස්තියානි (Christian/Catholic)</option>
                    <option value="Hindu">හින්දු (Hindu)</option>
                    <option value="Islam">ඉස්ලාම් (Islam)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'කුලය (විකල්ප)' : 'Caste (Optional)'}
                  </label>
                  <input
                    type="text"
                    name="caste"
                    value={formData.caste}
                    onChange={handleChange}
                    placeholder={language === 'si' ? 'ගොවිගම, කරාව...' : 'Govigama, Karava, etc.'}
                    className="w-full px-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'අධ්‍යාපන මට්ටම' : 'Education Level'}
                  </label>
                  <input
                    type="text"
                    name="education_level"
                    value={formData.education_level}
                    onChange={handleChange}
                    placeholder={language === 'si' ? 'උපාධිය / පශ්චාත් උපාධිය...' : 'e.g. BSc, MSc, Professional'}
                    className="w-full px-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'රැකියාව' : 'Profession'} *
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder={language === 'si' ? 'මෘදුකාංග ඉංජිනේරු, වෛද්‍ය...' : 'e.g. Software Engineer, Doctor'}
                    className="w-full px-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Privacy notice */}
            <p className="text-xs text-[#352A30]/65 leading-relaxed bg-[#FFF8FA] p-3 rounded-xl border border-[#F8E4EB]">
              🔒 {language === 'si'
                ? 'ඔබගේ දුරකථන අංකය සහ පුද්ගලික තොරතුරු පොදු සෙවීම් වලදී කිසිවිටෙකත් ප්‍රසිද්ධ නොවේ. ඒවා හෙළිදරව් වන්නේ ඔබ කැමැත්ත ලබාදුන් විට පමණි.'
                : 'Your phone number and private contact details are never shown publicly. They are only released when you explicitly grant permission.'}
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] hover:from-[#972F55] hover:to-[#AD3B65] text-white font-bold text-sm shadow-lg shadow-[#AD3B65]/30 hover:shadow-xl transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{language === 'si' ? 'සාමාජිකත්වය සක්‍රිය කරන්න (ලියාපදිංචි වන්න)' : 'Complete Registration & Activate'}</span>
                  <ArrowRight className="w-4 h-4 text-[#C6A56B]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Link to Login */}
        <div className="text-center">
          <p className="text-sm text-[#352A30]/75">
            {language === 'si' ? 'දැනටමත් ගිණුමක් තිබේද?' : 'Already have an account?'}{' '}
            <Link
              href="/login"
              className="font-bold text-[#AD3B65] hover:text-[#8E2E52] transition underline underline-offset-4"
            >
              {language === 'si' ? 'ඇතුල් වන්න (Sign In)' : 'Sign In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
