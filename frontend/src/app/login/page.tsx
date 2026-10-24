'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, Lock, Mail, Phone, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { language, t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginInput.trim() || !password) {
      setError(language === 'si' ? 'කරුණාකර ඔබගේ ඊමේල් ලිපිනය/දුරකථන අංකය සහ මුරපදය ඇතුළත් කරන්න.' : 'Please enter your email/phone and password.');
      return;
    }

    setLoading(true);
    const result = await login(loginInput.trim(), password);
    setLoading(false);

    if (result.success) {
      router.push('/messages');
    } else {
      setError(result.message || (language === 'si' ? 'ඇතුළත් කළ තොරතුරු වැරදියි. කරුණාකර නැවත උත්සාහ කරන්න.' : 'Invalid credentials. Please try again.'));
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setLoginInput(email);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF8FA] via-[#F8E4EB]/30 to-[#FFF8FA]">
      <div className="max-w-md w-full space-y-8">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#AD3B65] to-[#8E2E52] shadow-lg shadow-[#AD3B65]/30 mb-4">
            <Heart className="w-7 h-7 text-white fill-current" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#352A30]">
            {language === 'si' ? 'ගිණුමට ඇතුල් වන්න' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-sm text-[#352A30]/75">
            {language === 'si'
              ? 'ජයතු ජය මංගල සේවාවේ පණිවිඩ සහ යෝජනා පරීක්ෂා කිරීමට ඔබගේ ගිණුමට ඇතුල් වන්න'
              : 'Access your proposals, interests, and verified messages'}
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

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email or Phone */}
            <div>
              <label className="block text-xs font-bold text-[#352A30] uppercase tracking-wider mb-2">
                {language === 'si' ? 'ඊමේල් හෝ දුරකථන අංකය' : 'Email or Phone Number'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C6A56B]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder={language === 'si' ? 'kasun@gmail.com හෝ +9471...' : 'name@example.com or +9471...'}
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8FA] border border-[#F8E4EB] rounded-2xl text-sm text-[#352A30] placeholder-[#352A30]/40 focus:outline-none focus:border-[#AD3B65] focus:ring-2 focus:ring-[#AD3B65]/20 transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#352A30] uppercase tracking-wider">
                  {language === 'si' ? 'මුරපදය' : 'Password'}
                </label>
                <span className="text-xs text-[#AD3B65] hover:underline cursor-pointer">
                  {language === 'si' ? 'මුරපදය අමතකද?' : 'Forgot password?'}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C6A56B]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-[#FFF8FA] border border-[#F8E4EB] rounded-2xl text-sm text-[#352A30] placeholder-[#352A30]/40 focus:outline-none focus:border-[#AD3B65] focus:ring-2 focus:ring-[#AD3B65]/20 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#352A30]/50 hover:text-[#AD3B65] transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] hover:from-[#972F55] hover:to-[#AD3B65] text-white font-bold text-sm shadow-lg shadow-[#AD3B65]/30 hover:shadow-xl transition flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{language === 'si' ? 'ගිණුමට ඇතුල් වන්න' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 text-[#C6A56B]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="mt-6 pt-6 border-t border-[#F8E4EB]">
            <p className="text-[11px] font-bold text-[#352A30]/60 uppercase tracking-wider mb-2.5 text-center">
              {language === 'si' ? 'ක්ෂණිකව පරීක්ෂා කිරීමට (Demo Logins)' : 'Quick Test Accounts'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('kasun@gmail.com', 'secret123')}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#FFF8FA] hover:bg-[#F8E4EB] text-[#AD3B65] border border-[#F8E4EB] transition text-left flex items-center justify-between"
              >
                <span>Kasun (Member)</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C6A56B]" />
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('tharushi@gmail.com', 'secret123')}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#FFF8FA] hover:bg-[#F8E4EB] text-[#AD3B65] border border-[#F8E4EB] transition text-left flex items-center justify-between"
              >
                <span>Tharushi (Member)</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C6A56B]" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link to Register */}
        <div className="text-center">
          <p className="text-sm text-[#352A30]/75">
            {language === 'si' ? 'තවමත් ගිණුමක් නැද්ද?' : "Don't have an account yet?"}{' '}
            <Link
              href="/register"
              className="font-bold text-[#AD3B65] hover:text-[#8E2E52] transition underline underline-offset-4"
            >
              {language === 'si' ? 'නොමිලේ ලියාපදිංචි වන්න' : 'Register Free'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
