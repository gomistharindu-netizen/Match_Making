'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDemo } from '../../context/DemoContext';
import {
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building,
  Upload,
  ShieldCheck,
  Zap,
  Clock,
} from 'lucide-react';
import { PageHeaderBanner } from '../../components/PageHeaderBanner';

export default function MembershipPage() {
  const { language, t } = useLanguage();
  const { freeModeActive, setRole, registrationFee } = useDemo();

  const [paymentType, setPaymentType] = useState<'payhere' | 'bank_transfer'>('payhere');
  const [bankSlipUploaded, setBankSlipUploaded] = useState<boolean>(false);
  const [activatedSuccess, setActivatedSuccess] = useState<boolean>(false);

  const handleActivate = () => {
    setRole('member');
    setActivatedSuccess(true);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Full-Screen Width Royal Banner */}
      <PageHeaderBanner
        badgeText={language === 'si' ? 'පාරදෘශ්‍ය ගාස්තු සහ සාමාජිකත්වය' : 'Transparent Royal Membership'}
        titlePrefix={language === 'si' ? 'ජීවිත කාලයටම වලංගු' : 'Lifetime'}
        titleHighlight={language === 'si' ? 'රාජකීය සාමාජිකත්වය' : 'Royal Membership'}
        subtitle={t.pricingPage.subtitle}
        breadcrumbCurrent={language === 'si' ? 'සාමාජිකත්වය' : 'Membership'}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Free Mode Promotion Banner if active */}
      {freeModeActive ? (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-8 shadow-xl space-y-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.pricingPage.freeModeTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            {language === 'si'
              ? 'දැන්ම නොමිලේ ලියාපදිංචි වී සියලුම පහසුකම් ලබාගන්න'
              : 'Register Today for Free with 100% Full Feature Parity'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
            {t.pricingPage.freeModeDesc}
          </p>
          <div className="pt-2">
            <button
              onClick={handleActivate}
              className="bg-white text-emerald-900 font-extrabold px-8 py-3 rounded-2xl text-sm shadow hover:bg-emerald-50 transition"
            >
              {language === 'si' ? 'නොමිලේ ගිණුම සක්‍රිය කරගන්න (Instant Free Activation)' : 'Activate Free Account Now'}
            </button>
          </div>
        </div>
      ) : (
        /* Paid Mode Pricing Card */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Features & Lifetime benefits */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block bg-brand-100 text-brand-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {t.pricingPage.lifetimeTitle}
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-stone-900">
                  LKR {registrationFee.toLocaleString()}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  / {language === 'si' ? 'එක් වරක් පමණක් (Lifetime)' : 'One-time registration'}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t.pricingPage.lifetimeDesc}
              </p>

              <div className="pt-4 border-t border-stone-100 space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  {t.pricingPage.featuresIncluded}
                </h4>
                <ul className="space-y-2.5 text-xs text-stone-700">
                  {t.pricingPage.featureList.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 font-medium flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{t.pricingPage.adminConfigNotice}</span>
            </div>
          </div>

          {/* Card 2: Payment & Activation Methods */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-stone-900">
                {language === 'si' ? 'ගෙවීම් ක්‍රමය තෝරන්න' : 'Select Payment Method'}
              </h3>

              <div className="space-y-3">
                {/* PayHere Gateway */}
                <button
                  type="button"
                  onClick={() => setPaymentType('payhere')}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition flex items-start space-x-3 ${
                    paymentType === 'payhere'
                      ? 'border-brand-600 bg-brand-50/50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <CreditCard className={`w-5 h-5 mt-0.5 ${paymentType === 'payhere' ? 'text-brand-600' : 'text-stone-400'}`} />
                  <div>
                    <span className="font-bold text-sm text-stone-900 block">
                      {t.pricingPage.choosePayHere}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center mt-0.5">
                      <Zap className="w-3 h-3 mr-1" />
                      {t.pricingPage.instantActivation}
                    </span>
                  </div>
                </button>

                {/* Bank Deposit */}
                <button
                  type="button"
                  onClick={() => setPaymentType('bank_transfer')}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition flex items-start space-x-3 ${
                    paymentType === 'bank_transfer'
                      ? 'border-brand-600 bg-brand-50/50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Building className={`w-5 h-5 mt-0.5 ${paymentType === 'bank_transfer' ? 'text-brand-600' : 'text-stone-400'}`} />
                  <div>
                    <span className="font-bold text-sm text-stone-900 block">
                      {t.pricingPage.chooseBankSlip}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium flex items-center mt-0.5">
                      <Clock className="w-3 h-3 mr-1" />
                      {t.pricingPage.manualActivation}
                    </span>
                  </div>
                </button>
              </div>

              {/* Bank Transfer Details preview */}
              {paymentType === 'bank_transfer' && (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs space-y-2">
                  <span className="font-bold text-stone-800 block">Bank Account: Commercial Bank</span>
                  <span className="text-stone-600 block">Account: 1000 2345 6789 (Sri Kalyana Matrimonial)</span>
                  <button
                    type="button"
                    onClick={() => setBankSlipUploaded(!bankSlipUploaded)}
                    className="w-full mt-2 py-2 px-3 bg-white border border-dashed border-stone-300 rounded-xl text-stone-600 hover:border-brand-500 flex items-center justify-center space-x-1 font-semibold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{bankSlipUploaded ? '✓ Bank Slip Attached' : 'Upload Bank Deposit Slip'}</span>
                  </button>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={handleActivate}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow hover:shadow-md transition flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {paymentType === 'payhere'
                    ? (language === 'si' ? 'PayHere හරහා ගෙවා ගිණුම සක්‍රිය කරන්න' : 'Pay via PayHere & Activate')
                    : (language === 'si' ? 'රිසිට්පත යවා සනාථ කිරීමට යොමු කරන්න' : 'Submit Bank Slip for Approval')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activation success message */}
      {activatedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-6 rounded-3xl text-center space-y-2 animate-fadeIn">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-base">
            {language === 'si' ? 'සාර්ථකව සාමාජිකත්වය සක්‍රිය විය!' : 'Membership Activated Successfully!'}
          </h3>
          <p className="text-xs text-emerald-800">
            {language === 'si'
              ? 'දැන් ඔබට සියලුම යෝජනා සඳහා Interests යැවීමට සහ පණිවිඩ හුවමාරු කරගැනීමට පූර්ණ අවසරය ඇත.'
              : 'You now have lifetime full access to send interests and message matched proposals.'}
          </p>
        </div>
      )}

      {/* Frequently Asked Questions */}
      <div className="border-t border-stone-200 pt-10 space-y-6">
        <h3 className="text-xl font-bold text-stone-900 text-center">
          {language === 'si' ? 'නිතර අසන ප්‍රශ්න (FAQ)' : 'Frequently Asked Questions'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1.5">
            <h5 className="font-bold text-stone-900">
              {language === 'si' ? 'මාසිකව හෝ වාර්ෂිකව නැවත ගාස්තු අය වේද?' : 'Are there recurring monthly or annual fees?'}
            </h5>
            <p className="text-stone-600 leading-relaxed">
              {language === 'si'
                ? 'නැත. අපගේ ලියාපදිංචි ගාස්තුව ජීවිත කාලයටම එක් වරක් පමණක් අය කෙරේ. විවාහය තීන්දු වන තුරුම කිසිදු අමතර ගාස්තුවක් අය නොවේ.'
                : 'No. Our registration fee is strictly one-time for lifetime access. There are no monthly deductions or renewal fees.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1.5">
            <h5 className="font-bold text-stone-900">
              {language === 'si' ? 'කේන්ද්‍ර පරීක්ෂාව සඳහා වෙනම ගාස්තුවක් අය වේද?' : 'Is horoscope matching charged separately?'}
            </h5>
            <p className="text-stone-600 leading-relaxed">
              {language === 'si'
                ? 'ඔව්. කේන්ද්‍ර ගැලපීම අපගේ ප්‍රවීණ ජ්‍යොතිෂවේදීන් විසින් සිදුකරන ස්වාධීන සේවාවක් බැවින් ඒ සඳහා වෙනම සුළු ගාස්තුවක් අය කෙරේ.'
                : 'Yes. Horoscope matching is an independent specialized service conducted by in-house astrologers, ordered per couple.'}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
