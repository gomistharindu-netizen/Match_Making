'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import {
  Heart,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function ForgotPasswordPage() {
  const { language } = useLanguage();
  const router = useRouter();

  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to request reset code');
      }

      if (data.demo_code) {
        setDemoCode(data.demo_code);
        setCode(data.demo_code);
      }

      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError(language === 'si' ? 'නව මුරපදයන් නොගැලපේ.' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Verification code is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Branding header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#AD3B65] to-[#8E2E52] shadow-lg shadow-[#AD3B65]/30 mb-4">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#352A30]">
            {language === 'si' ? 'මුරපදය නැවත සකසන්න' : 'Reset Your Password'}
          </h2>
          <p className="mt-2 text-sm text-[#352A30]/75">
            {language === 'si'
              ? 'ඔබගේ ගිණුමට ඇතුල් වීමට නව මුරපදයක් සකසා ගන්න'
              : 'Recover access to your matrimonial profile'}
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-[#AD3B65]/5 border border-[#F8E4EB]">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-[#F8E4EB] border border-[#AD3B65]/30 flex items-start space-x-3 text-sm text-[#AD3B65]">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={handleRequestCode} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#352A30] uppercase tracking-wider mb-2">
                  {language === 'si' ? 'ලියාපදිංචි ඊමේල් ලිපිනය' : 'Registered Email Address'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C6A56B]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#FFF8FA] border border-[#F8E4EB] rounded-2xl text-sm text-[#352A30] placeholder-[#352A30]/40 focus:outline-none focus:border-[#AD3B65] focus:ring-2 focus:ring-[#AD3B65]/20 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] hover:from-[#972F55] hover:to-[#AD3B65] text-white font-bold text-sm shadow-lg shadow-[#AD3B65]/30 hover:shadow-xl transition flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{language === 'si' ? 'තහවුරු කිරීමේ කේතය එවන්න' : 'Send Reset Code'}</span>
                    <ArrowRight className="w-4 h-4 text-[#C6A56B]" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#AD3B65] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'si' ? 'නැවත Login පිටුවට' : 'Back to Login'}</span>
                </Link>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {demoCode && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
                  <span className="font-bold">{language === 'si' ? 'පරීක්ෂණ කේතය (Demo Code): ' : 'Dev Code: '}</span>
                  <span className="font-mono font-extrabold text-sm text-emerald-950">{demoCode}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#352A30] uppercase tracking-wider mb-1.5">
                  {language === 'si' ? 'ඉලක්කම් 6 කේතය (6-Digit Code)' : '6-Digit Verification Code'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                  placeholder="123456"
                  className="w-full py-2.5 px-3 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-center text-lg font-mono font-bold tracking-widest text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#352A30] uppercase tracking-wider mb-1.5">
                  {language === 'si' ? 'නව මුරපදය (New Password)' : 'New Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C6A56B]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm focus:outline-none focus:border-[#AD3B65]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#352A30] uppercase tracking-wider mb-1.5">
                  {language === 'si' ? 'මුරපදය තහවුරු කරන්න' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C6A56B]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8FA] border border-[#F8E4EB] rounded-xl text-sm focus:outline-none focus:border-[#AD3B65]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] hover:from-[#972F55] hover:to-[#AD3B65] text-white font-bold text-sm shadow-lg shadow-[#AD3B65]/30 hover:shadow-xl transition flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{language === 'si' ? 'මුරපදය යාවත්කාලීන කරන්න' : 'Update Password'}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#C6A56B]" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800"
                >
                  {language === 'si' ? 'නැවත ඊමේල් ලිපිනය වෙනස් කරන්න' : 'Change email address'}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">
                {language === 'si' ? 'මුරපදය සාර්ථකව වෙනස් විය!' : 'Password Reset Successful!'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'si'
                  ? 'ඔබගේ නව මුරපදය සාර්ථකව යාවත්කාලීන විය. දැන් ඔබට ඔබගේ ගිණුමට ඇතුල් විය හැක.'
                  : 'Your account has been updated with your new password. You can now proceed to log in.'}
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <span>{language === 'si' ? 'දැන්ම Login වන්න' : 'Proceed to Login'}</span>
                  <ArrowRight className="w-4 h-4 text-[#C6A56B]" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
