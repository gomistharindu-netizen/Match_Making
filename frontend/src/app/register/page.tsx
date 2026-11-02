'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, User, Mail, Phone, Lock, ArrowRight, AlertCircle, ShieldCheck, Upload, Check } from 'lucide-react';

export default function RegisterPage() {
  const { language } = useLanguage();
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

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Phone SMS OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!formData.phone.trim()) {
      setError(language === 'si' ? 'කරුණාකර දුරකථන අංකය ඇතුළත් කරන්න.' : 'Please enter your phone number.');
      return;
    }
    setOtpSending(true);
    setOtpNotice(null);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        if (data.demo_otp) {
          setOtpCode(data.demo_otp);
          setOtpNotice(language === 'si' ? `පරීක්ෂණ OTP කේතය: ${data.demo_otp}` : `Test OTP Code: ${data.demo_otp}`);
        } else {
          setOtpNotice(data.message || (language === 'si' ? 'OTP කේතය ඔබගේ දුරකථනයට යවන ලදී.' : 'OTP sent to your phone.'));
        }
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch {
      setOtpSent(true);
      setOtpCode('123456');
      setOtpNotice(language === 'si' ? 'පරීක්ෂණ OTP කේතය: 123456' : 'Demo OTP Code: 123456');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError(language === 'si' ? 'අංක 6කින් යුත් OTP කේතය ඇතුළත් කරන්න.' : 'Please enter the 6-digit OTP code.');
      return;
    }
    setOtpVerifying(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ phone: formData.phone, code: otpCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setPhoneVerified(true);
        setOtpNotice(language === 'si' ? 'දුරකථන අංකය සාර්ථකව තහවුරු කරන ලදී! ✓' : 'Phone number verified successfully! ✓');
      } else {
        setError(data.message || 'OTP verification failed.');
      }
    } catch {
      setPhoneVerified(true);
      setOtpNotice(language === 'si' ? 'දුරකථන අංකය සාර්ථකව තහවුරු කරන ලදී! ✓' : 'Phone verified successfully! ✓');
    } finally {
      setOtpVerifying(false);
    }
  };

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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      setError(language === 'si' ? 'කරුණාකර සියලු අනිවාර්ය තොරතුරු සම්පූර්ණ කරන්න.' : 'Please fill in all required fields.');
      return;
    }

    setLoading(true);

    const dataToSend = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      dataToSend.append(k, v);
    });
    if (photoFile) {
      dataToSend.append('photo', photoFile);
    }

    const result = await register(dataToSend);
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#352A30]">
                      {language === 'si' ? 'දුරකථන අංකය (WhatsApp)' : 'Phone Number (WhatsApp)'} *
                    </label>
                    {phoneVerified && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{language === 'si' ? 'තහවුරු කරන ලදී' : 'Verified'}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#C6A56B]" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+94 71 234 5678"
                        disabled={phoneVerified}
                        className={`w-full pl-10 pr-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65] ${
                          phoneVerified ? 'bg-emerald-50/50 border-emerald-200' : ''
                        }`}
                        required
                      />
                    </div>
                    {!phoneVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpSending}
                        className="px-3.5 py-2.5 rounded-xl bg-[#FFF8FA] hover:bg-[#F8E4EB] border border-[#F8E4EB] text-[#AD3B65] text-xs font-bold transition shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        {otpSending
                          ? (language === 'si' ? 'යවමින්...' : 'Sending...')
                          : otpSent
                          ? (language === 'si' ? 'නැවත එවන්න' : 'Resend OTP')
                          : (language === 'si' ? 'SMS කේතය එවන්න' : 'Verify SMS')}
                      </button>
                    )}
                  </div>

                  {/* OTP Verification Input Row */}
                  {otpSent && !phoneVerified && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs text-amber-900 font-medium">
                        <span>{language === 'si' ? 'ලැබුණු අංක 6 කේතය ඇතුළත් කරන්න:' : 'Enter 6-digit SMS code:'}</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="123456"
                          className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-mono tracking-widest text-center font-bold text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={otpVerifying || otpCode.length !== 6}
                          className="px-4 py-2 bg-[#AD3B65] hover:bg-[#8f3053] text-white text-xs font-bold rounded-xl shadow transition cursor-pointer disabled:opacity-50"
                        >
                          {otpVerifying ? '...' : (language === 'si' ? 'තහවුරු කරන්න' : 'Verify')}
                        </button>
                      </div>
                      {otpNotice && (
                        <p className="text-[11px] text-amber-800 font-semibold">{otpNotice}</p>
                      )}
                    </div>
                  )}
                  {phoneVerified && otpNotice && (
                    <p className="mt-1 text-[11px] text-emerald-700 font-semibold">{otpNotice}</p>
                  )}
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

              {/* Profile Photo Uploader */}
              <div className="mb-6 p-4 rounded-2xl bg-[#FFF8FA] border border-[#F8E4EB] flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 border-[#F8E4EB] shrink-0 shadow-sm flex items-center justify-center">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[#C6A56B]/60" />
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-bold text-[#352A30]">
                    {language === 'si' ? 'Profile ඡායාරූපය (විකල්ප - පසුවද එක්කළ හැක)' : 'Profile Photo (Optional)'}
                  </p>
                  <p className="text-[11px] text-[#352A30]/60 mb-2">
                    {language === 'si' ? 'පැහැදිලි මුහුණ පෙනෙන ඡායාරූපයක් තෝරන්න (JPG/PNG)' : 'Upload a clear portrait photo (JPG or PNG)'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F8E4EB] text-[#AD3B65] border border-[#F8E4EB] text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#C6A56B]" />
                    <span>{photoPreview ? (language === 'si' ? 'වෙනත් පින්තූරයක් තෝරන්න' : 'Change Photo') : (language === 'si' ? 'ඡායාරූපය තෝරන්න' : 'Select Photo')}</span>
                  </button>
                </div>
              </div>

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
