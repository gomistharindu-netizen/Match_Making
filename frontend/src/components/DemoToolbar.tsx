'use client';

import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { useLanguage } from '../context/LanguageContext';
import { Sliders, Globe, Shield, DollarSign, ChevronUp, ChevronDown } from 'lucide-react';

export const DemoToolbar: React.FC = () => {
  const {
    role,
    setRole,
    freeModeActive,
    setFreeModeActive,
    registrationFee,
    setRegistrationFee,
    horoscopeFee,
    setHoroscopeFee,
  } = useDemo();
  const { language, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <aside aria-label="Demo controls" className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-white text-xs border-b border-brand-700/50 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold-500 text-slate-900 uppercase tracking-wider">
            Client Interactive Demo
          </span>
          <span className="hidden sm:inline text-slate-300">
            {t.demoBar.note}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded border border-white/20 transition"
            title="Toggle Language"
          >
            <Globe className="w-3 h-3 text-gold-500" />
            <span className="font-bold text-[11px] text-gold-200">
              {language === 'si' ? 'English ට මාරු වන්න' : 'සිංහල භාෂාවට'}
            </span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 text-slate-300 hover:text-white"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isOpen ? 'Hide Controls' : 'Show Demo Controls'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="bg-slate-950/90 border-t border-slate-800 px-4 py-2 text-slate-200 backdrop-blur">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* Role Switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium flex items-center">
                <Shield className="w-3.5 h-3.5 mr-1 text-brand-200" />
                {t.demoBar.currentRole}
              </span>
              <div className="inline-flex rounded-md p-0.5 bg-slate-800 border border-slate-700">
                <button
                  onClick={() => setRole('visitor')}
                  className={`px-2.5 py-1 rounded text-xs transition ${
                    role === 'visitor'
                      ? 'bg-brand-500 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.demoBar.roleVisitor}
                </button>
                <button
                  onClick={() => setRole('member')}
                  className={`px-2.5 py-1 rounded text-xs transition ${
                    role === 'member'
                      ? 'bg-emerald-600 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.demoBar.roleMember}
                </button>
              </div>
            </div>

            {/* Admin Free Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">
                Admin Free Mode:
              </span>
              <button
                onClick={() => setFreeModeActive(!freeModeActive)}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition ${
                  freeModeActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${freeModeActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span>{freeModeActive ? t.demoBar.freeModeOn : t.demoBar.freeModeOff}</span>
              </button>
            </div>

            {/* Admin Dynamic Pricing Inputs */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                <DollarSign className="w-3 h-3 text-gold-500" />
                <span className="text-slate-400">Reg Fee:</span>
                <input
                  type="number"
                  value={registrationFee}
                  onChange={(e) => setRegistrationFee(Number(e.target.value))}
                  className="w-16 bg-slate-800 text-gold-200 text-center font-bold px-1 rounded border border-slate-600"
                />
                <span className="text-[10px] text-slate-400">LKR</span>
              </div>

              <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                <DollarSign className="w-3 h-3 text-gold-500" />
                <span className="text-slate-400">Horoscope:</span>
                <input
                  type="number"
                  value={horoscopeFee}
                  onChange={(e) => setHoroscopeFee(Number(e.target.value))}
                  className="w-16 bg-slate-800 text-gold-200 text-center font-bold px-1 rounded border border-slate-600"
                />
                <span className="text-[10px] text-slate-400">LKR</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
