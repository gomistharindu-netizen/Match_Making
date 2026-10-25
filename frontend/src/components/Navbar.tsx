'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Heart, Menu, X, User, Globe, LogIn, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/browse', label: t.nav.proposals },
    { href: '/horoscope', label: t.nav.horoscope, badge: 'Paid' },
    { href: '/membership', label: t.nav.pricing },
    { href: '/activity', label: t.nav.activity },
    { href: '/messages', label: t.nav.messages },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#F8E4EB] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Sinhala/English Brand Title */}
          <Link href="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#AD3B65] to-[#8E2E52] flex items-center justify-center shadow-md shadow-[#AD3B65]/20 group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-5 h-5 text-white fill-current animate-pulse" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#AD3B65] via-[#8E2E52] to-[#352A30] bg-clip-text text-transparent font-serif tracking-tight">
                {t.brandName}
              </span>
              <p className="text-[10px] text-[#C6A56B] uppercase tracking-wider font-semibold">
                {language === 'si' ? 'මංගල සේවාව' : 'Matrimonial'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all relative ${
                    active
                      ? 'text-[#AD3B65] bg-[#F8E4EB]/70'
                      : 'text-[#352A30] hover:text-[#AD3B65] hover:bg-[#FFF8FA]'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-[#C6A56B]/20 text-[#8E2E52] font-extrabold uppercase">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center space-x-2 shrink-0 whitespace-nowrap">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-[#FFF8FA] hover:bg-[#F8E4EB] text-[#352A30] transition border border-[#F8E4EB] whitespace-nowrap shrink-0"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#C6A56B] shrink-0" />
              <span className="whitespace-nowrap">{language === 'si' ? 'English' : 'සිංහල'}</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 bg-[#FFF8FA] hover:bg-[#F8E4EB] border border-[#F8E4EB] pl-1.5 pr-3 py-1 rounded-full shadow-xs transition group"
                  title={language === 'si' ? 'මගේ Profile තොරතුරු සහ ඡායාරූප' : 'My Profile & Photos'}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-[#AD3B65] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {profile?.primary_photo_url ? (
                      <img src={profile.primary_photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#352A30] group-hover:text-[#AD3B65] whitespace-nowrap">
                    {profile?.profile_code || user?.name}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title={language === 'si' ? 'ඉවත් වන්න' : 'Sign Out'}
                  className="p-1.5 rounded-full text-[#352A30]/70 hover:text-[#AD3B65] hover:bg-[#F8E4EB] transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold rounded-full text-[#AD3B65] hover:bg-[#F8E4EB] transition flex items-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#C6A56B]" />
                  <span>{t.nav.login}</span>
                </Link>

                <Link
                  href="/register"
                  className="bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] hover:from-[#972F55] hover:to-[#AD3B65] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-[#AD3B65]/25 hover:shadow-lg transition flex items-center space-x-1.5 whitespace-nowrap shrink-0"
                >
                  <User className="w-3.5 h-3.5 text-[#C6A56B] shrink-0" />
                  <span className="whitespace-nowrap">{t.nav.register}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Language Toggle Button */}
          <div className="flex items-center space-x-1.5 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#FFF8FA] text-[#352A30] border border-[#F8E4EB]"
            >
              {language === 'si' ? 'EN' : 'සිං'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-[#352A30] hover:bg-[#F8E4EB] transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-white/95 backdrop-blur-xl border border-[#F8E4EB] shadow-2xl rounded-3xl p-4 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                  isActive(link.href)
                    ? 'text-[#AD3B65] bg-[#F8E4EB]'
                    : 'text-[#352A30] hover:bg-[#FFF8FA]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-[#F8E4EB] flex flex-col space-y-2">
              {isAuthenticated ? (
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF8FA] border border-[#F8E4EB]">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-xs font-bold text-[#352A30] hover:text-[#AD3B65]"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[#AD3B65] text-white flex items-center justify-center text-[10px] shrink-0">
                      {profile?.primary_photo_url ? (
                        <img src={profile.primary_photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <span>{profile?.profile_code || user?.name} ({language === 'si' ? 'මගේ ගිණුම' : 'My Profile'})</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-[#AD3B65] hover:underline"
                  >
                    {language === 'si' ? 'ඉවත් වන්න' : 'Logout'}
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 rounded-full text-xs font-bold text-[#AD3B65] border border-[#F8E4EB] bg-[#FFF8FA]"
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-[#AD3B65] text-white font-bold py-2.5 rounded-full text-xs shadow-md shadow-[#AD3B65]/25"
                  >
                    {t.nav.register}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
