'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useDemo } from '../context/DemoContext';
import { Heart, ShieldCheck, Menu, X, User, Globe } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { role, freeModeActive } = useDemo();
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
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Floating Rounded Translucent Bar */}
        <div className="rounded-full bg-white/85 backdrop-blur-xl shadow-xl shadow-stone-900/10 border border-white/70 px-4 sm:px-6 py-2 flex items-center justify-between transition gap-2">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group shrink-0 whitespace-nowrap">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#7A2943] to-[#9e3859] flex items-center justify-center shadow-md group-hover:scale-105 transition shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#C6A56B] fill-[#C6A56B]" />
            </div>
            <div>
              <span className="block text-base sm:text-lg font-extrabold tracking-tight text-[#7A2943] leading-none whitespace-nowrap">
                {t.brandName}
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-[#C6A56B] tracking-wider mt-0.5 whitespace-nowrap">
                {language === 'si' ? 'විශ්වාසනීය මංගල සේවාව' : 'Matrimonial & Astrological'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 shrink-0">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 relative flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-[#7A2943] bg-[#7A2943]/10 shadow-sm'
                      : 'text-[#30262B] hover:text-[#7A2943] hover:bg-stone-100/70'
                  }`}
                >
                  <span className="whitespace-nowrap">{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] bg-[#C6A56B]/20 text-[#815e37] font-extrabold px-1.5 py-0.2 rounded-full border border-[#C6A56B]/40 whitespace-nowrap">
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
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-stone-100 hover:bg-stone-200 text-[#30262B] transition border border-stone-200/80 whitespace-nowrap shrink-0"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#C6A56B] shrink-0" />
              <span className="whitespace-nowrap">{language === 'si' ? 'English' : 'සිංහල'}</span>
            </button>

            {role === 'member' ? (
              <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold text-emerald-800 whitespace-nowrap">
                  {language === 'si' ? 'සක්‍රිය සාමාජික' : 'Active Member'}
                </span>
              </div>
            ) : (
              <Link
                href="/membership"
                className="bg-gradient-to-r from-[#7A2943] to-[#9e3859] hover:from-[#68243a] hover:to-[#7A2943] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition flex items-center space-x-1.5 whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5 text-[#C6A56B] shrink-0" />
                <span className="whitespace-nowrap">{freeModeActive ? t.nav.register : `${t.nav.register}`}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu & Language Toggle Button */}
          <div className="flex items-center space-x-1.5 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-bold rounded-full bg-stone-100 text-[#30262B] border border-stone-200"
            >
              {language === 'si' ? 'EN' : 'සිං'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-stone-700 hover:bg-stone-100 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-white/95 backdrop-blur-xl border border-stone-200 shadow-2xl rounded-3xl p-4 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                  isActive(link.href)
                    ? 'text-[#7A2943] bg-[#7A2943]/10'
                    : 'text-[#30262B] hover:bg-stone-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-stone-100">
              <Link
                href="/membership"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-[#7A2943] text-white font-bold py-2.5 rounded-full text-xs shadow"
              >
                {t.nav.register}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
