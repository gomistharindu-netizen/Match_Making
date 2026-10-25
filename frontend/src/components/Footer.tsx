'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { Heart, ShieldCheck, Lock, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#AD3B65] to-[#8E2E52] flex items-center justify-center shadow-md shadow-[#AD3B65]/30">
                <Heart className="w-5 h-5 text-[#C6A56B] fill-[#C6A56B]" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {t.brandName}
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {language === 'si'
                ? 'ශ්‍රී ලංකාවේ පාරම්පරික සාරධර්ම සහ නවීන තාක්ෂණය මුසු කරමින් ගොඩනැඟූ අතිශය විශ්වාසනීය සහ පෞද්ගලිකත්වය සුරැකි මංගල යෝජනා සහ ජ්‍යොතිෂ සේවාව.'
                : 'Sri Lanka’s trusted matrimonial service blending traditional cultural values with modern security, privacy-first contact releases, and verified horoscope matching.'}
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <span className="flex items-center text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4 mr-1 text-emerald-400" />
                Verified Agency
              </span>
              <span className="flex items-center text-xs text-[#C6A56B]">
                <Lock className="w-4 h-4 mr-1 text-[#C6A56B]" />
                Owner-Approved Privacy
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              {language === 'si' ? 'ප්‍රධාන සබැඳි' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-gold-400 transition">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-gold-400 transition">
                  {t.nav.proposals}
                </Link>
              </li>
              <li>
                <Link href="/horoscope" className="hover:text-gold-400 transition">
                  {t.nav.horoscope} (Standalone)
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-gold-400 transition">
                  {t.nav.pricing}
                </Link>
              </li>
              <li>
                <Link href="/activity" className="hover:text-gold-400 transition">
                  {t.nav.activity}
                </Link>
              </li>
            </ul>
          </div>

          {/* Astrological service */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              {language === 'si' ? 'ජ්‍යොතිෂ සේවාවන්' : 'Astrology Services'}
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>{language === 'si' ? 'දස පොරොන්දම් ගැලපීම' : '10 Porondam Matching'}</li>
              <li>{language === 'si' ? 'විසි පොරොන්දම් සහ ග්‍රහ පිහිටීම්' : '20 Porondam Detailed Analysis'}</li>
              <li>{language === 'si' ? 'පාප දෘෂ්ටි සහ කුජ දෝෂ පරීක්ෂාව' : 'Dosha & Planetary Compatibility'}</li>
              <li>{language === 'si' ? 'සහතික කළ මුද්‍රිත/PDF වාර්තාව' : 'Signed PDF Astrologer Report'}</li>
              <li>
                <Link href="/horoscope" className="inline-block mt-2 text-xs font-bold text-gold-400 hover:underline">
                  {language === 'si' ? 'දැන්ම කේන්ද්‍ර පරීක්ෂා කරගන්න →' : 'Order Horoscope Match →'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              {language === 'si' ? 'සම්බන්ධ වන්න' : 'Agency Contact'}
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <span>No. 128, Galle Road, Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+94 11 234 5678 / +94 77 123 4567</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>support@srikalyana.lk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>
            © {new Date().getFullYear()} {t.brandName}. All rights reserved. Registered Matrimonial Agency in Sri Lanka.
          </p>
          <div className="flex flex-wrap items-center space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Owner-Approved Contact Guidelines</span>
            <a
              href="http://127.0.0.1:8000/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gold-400 hover:text-gold-300 font-medium transition"
            >
              <Lock className="w-3.5 h-3.5 mr-1" />
              Staff / Admin Portal →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
