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
    <section className="relative w-full overflow-hidden bg-stone-950 pt-28 sm:pt-36 pb-12 sm:pb-16 shadow-lg border-b border-[#C6A56B]/20">
      {/* Full-width background image with royal darkening gradients */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[position:73%_top] sm:bg-[position:center_right] opacity-60 scale-105 transform transition-transform duration-1000"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      
      {/* Luxury Royal Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#4A1222]/95 via-[#300C16]/90 to-stone-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/40" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-serif text-[#C6A56B]/90">
          <Link href="/" className="hover:text-white transition flex items-center space-x-1">
            <Home className="w-3.5 h-3.5" />
            <span>{language === 'si' ? 'මුල් පිටුව' : 'Home'}</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-[#C6A56B]/60" />
          <span className="text-stone-300 font-bold">{breadcrumbCurrent}</span>
        </div>

        {/* Badge & Headings */}
        <div className="max-w-3xl space-y-2.5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#7A2943]/80 backdrop-blur-md text-[#FBF8F5] text-xs font-bold tracking-widest uppercase shadow-md border border-[#C6A56B]/40 ring-1 ring-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A56B]" />
            <span className="font-serif">{badgeText}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-wide leading-tight drop-shadow-md">
            {titlePrefix}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7CE] via-[#E8C88B] to-[#C6A56B] drop-shadow-sm font-extrabold">
              {titleHighlight}
            </span>
            {titleSuffix ? ` ${titleSuffix}` : ''}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-stone-200/90 font-serif leading-relaxed max-w-2xl drop-shadow">
            {subtitle}
          </p>

          {children && <div className="pt-2">{children}</div>}
        </div>
      </div>
    </section>
  );
};
