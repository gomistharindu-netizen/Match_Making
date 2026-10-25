'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PageHeaderBannerProps {
  badgeText: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix?: string;
  subtitle: string;
  breadcrumbCurrent: string;
  bgImage?: string;
  children?: React.ReactNode;
}

export const PageHeaderBanner: React.FC<PageHeaderBannerProps> = ({
  badgeText,
  titlePrefix,
  titleHighlight,
  titleSuffix,
  subtitle,
  breadcrumbCurrent,
  bgImage = '/images/hero-banner.jpg',
  children,
}) => {
  const { language } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden bg-stone-950 pt-12 sm:pt-14 pb-10 sm:pb-12 shadow-lg border-b border-[#C6A56B]/30">
      {/* Full-width background image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[position:73%_top] sm:bg-[position:center_right] opacity-90 scale-105 transform transition-transform duration-1000"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      
      {/* Luxury Directional Gradient Overlays: Dark on the left for crisp text readability, clear on the right so the wedding couple shines through */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 sm:hidden" />
      <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/90 via-[#352A30]/75 to-transparent sm:from-black/85 sm:via-[#352A30]/55 sm:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-3.5">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-serif text-[#C6A56B]">
          <Link href="/" className="hover:text-white transition flex items-center space-x-1">
            <Home className="w-3.5 h-3.5 text-[#C6A56B]" />
            <span>{language === 'si' ? 'මුල් පිටුව' : 'Home'}</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-[#C6A56B]/60" />
          <span className="text-white font-bold">{breadcrumbCurrent}</span>
        </div>

        {/* Badge & Headings */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#AD3B65]/90 backdrop-blur-md text-[#FFF8FA] text-xs font-bold tracking-widest uppercase shadow-md shadow-[#AD3B65]/25 border border-[#C6A56B]/50 ring-1 ring-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A56B]" />
            <span className="font-serif">{badgeText}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-wide leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            {titlePrefix}{' '}
            <span className="text-[#F3DEB3] font-extrabold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {titleHighlight}
            </span>
            {titleSuffix ? ` ${titleSuffix}` : ''}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-stone-100 font-serif leading-relaxed max-w-2xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
            {subtitle}
          </p>

          {children && <div className="pt-2">{children}</div>}
        </div>
      </div>
    </section>
  );
};
