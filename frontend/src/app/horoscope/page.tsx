'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDemo } from '../../context/DemoContext';
import {
  Upload,
  User,
  CreditCard,
  Building,
  CheckCircle,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { PageHeaderBanner } from '../../components/PageHeaderBanner';

export default function HoroscopePage() {
  const { language, t } = useLanguage();
  const { horoscopeFee } = useDemo();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'payhere' | 'bank_transfer'>('payhere');
  const [slipUploaded, setSlipUploaded] = useState<boolean>(false);

  // Form state
  const [subject1, setSubject1] = useState({
    name: 'Kavindi Perera',
    dob: '1998-05-14',
    time: '06:45 AM',
    place: 'Colombo',
    chartUploaded: false,
  });

  const [subject2, setSubject2] = useState({
    name: 'Tharindu Senanayake',
    dob: '1995-11-22',
    time: '02:15 PM',
    place: 'Kandy',
    chartUploaded: false,
  });

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveStep(3);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Full-Screen Width Royal Banner */}
      <PageHeaderBanner
        badgeText={language === 'si' ? 'ස්වාධීන ජ්‍යොතිෂ සේවාව' : 'Independent Astrological Service'}
        titlePrefix={language === 'si' ? 'විද්‍යානුකූල' : 'Astrological'}
        titleHighlight={language === 'si' ? 'කේන්ද්‍ර සහ පොරොන්දම්' : 'Horoscope Matching'}
        titleSuffix={language === 'si' ? 'ගැලපීම' : ''}
        subtitle={t.horoscopePage.subtitle}
        breadcrumbCurrent={language === 'si' ? 'කේන්ද්‍ර ගැලපීම' : 'Horoscope'}
      >
        <div className="inline-flex items-center space-x-2 bg-emerald-950/70 backdrop-blur-md border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-xs text-emerald-200 font-serif shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.horoscopePage.guestNotice}</span>
        </div>
      </PageHeaderBanner>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Progress Steps Indicator */}
      <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto text-xs font-bold text-center">
        <div className={`p-2.5 rounded-xl border transition ${
          activeStep === 1
            ? 'bg-[#AD3B65] text-white border-[#AD3B65] shadow-md shadow-[#AD3B65]/20'
            : activeStep > 1
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : 'bg-white text-stone-400 border-stone-200'
        }`}>
          <span>1. {language === 'si' ? 'කේන්ද්‍ර විස්තර' : 'Horoscope Data'}</span>
        </div>

        <div className={`p-2.5 rounded-xl border transition ${
          activeStep === 2
            ? 'bg-[#AD3B65] text-white border-[#AD3B65] shadow-md shadow-[#AD3B65]/20'
            : activeStep > 2
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : 'bg-white text-stone-400 border-stone-200'
        }`}>
          <span>2. {language === 'si' ? 'ගෙවීම්' : 'Payment'}</span>
        </div>

        <div className={`p-2.5 rounded-xl border transition ${
          activeStep === 3
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
            : 'bg-white text-stone-400 border-stone-200'
        }`}>
          <span>3. {language === 'si' ? 'වාර්තාව ලබාගැනීම' : 'Report & Download'}</span>
        </div>
      </div>

      {/* STEP 1: HOROSCOPE INPUTS */}
      {activeStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8 animate-fadeIn">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-xl font-bold text-stone-900">
              {t.horoscopePage.step1}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {language === 'si'
                ? 'කේන්ද්‍ර පත්‍රයේ ඡායාරූපයක් (Image/PDF) upload කරන්න, නැතහොත් උපන් දිනය හා වේලාව ඇතුළත් කරන්න.'
                : 'Upload the chart scan or enter accurate birth details for both parties.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Subject 1 (Bride) */}
            <div className="space-y-4 bg-stone-50/80 p-5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-sm text-brand-900 flex items-center">
                <User className="w-4 h-4 mr-1.5 text-brand-600" />
                {t.horoscopePage.subject1Title}
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    {t.horoscopePage.fullName}
                  </label>
                  <input
                    type="text"
                    value={subject1.name}
                    onChange={(e) => setSubject1({ ...subject1, name: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    {t.horoscopePage.birthDate}
                  </label>
                  <input
                    type="date"
                    value={subject1.dob}
                    onChange={(e) => setSubject1({ ...subject1, dob: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">
                      {t.horoscopePage.birthTime}
                    </label>
                    <input
                      type="text"
                      value={subject1.time}
                      onChange={(e) => setSubject1({ ...subject1, time: e.target.value })}
                      placeholder="e.g. 06:45 AM"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">
                      {t.horoscopePage.birthPlace}
                    </label>
                    <input
                      type="text"
                      value={subject1.place}
                      onChange={(e) => setSubject1({ ...subject1, place: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium"
                    />
                  </div>
                </div>

                {/* Upload chart scan */}
                <div className="pt-2">
                  <label className="block text-stone-600 font-semibold mb-1">
                    {t.horoscopePage.chartUpload} (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setSubject1({ ...subject1, chartUploaded: !subject1.chartUploaded })}
                    className={`w-full py-3 px-4 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                      subject1.chartUploaded
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : 'bg-white border-stone-300 text-stone-600 hover:border-brand-500'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>{subject1.chartUploaded ? '✓ Chart Attached (bride_chart.jpg)' : t.horoscopePage.chooseChart}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Subject 2 (Groom) */}
            <div className="space-y-4 bg-stone-50/80 p-5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-sm text-brand-900 flex items-center">
                <User className="w-4 h-4 mr-1.5 text-brand-600" />
                {t.horoscopePage.subject2Title}
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    {t.horoscopePage.fullName}
                  </label>
                  <input
                    type="text"
                    value={subject2.name}
                    onChange={(e) => setSubject2({ ...subject2, name: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    {t.horoscopePage.birthDate}
                  </label>
                  <input
                    type="date"
                    value={subject2.dob}
                    onChange={(e) => setSubject2({ ...subject2, dob: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">
                      {t.horoscopePage.birthTime}
                    </label>
                    <input
                      type="text"
                      value={subject2.time}
                      onChange={(e) => setSubject2({ ...subject2, time: e.target.value })}
                      placeholder="e.g. 02:15 PM"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">
                      {t.horoscopePage.birthPlace}
                    </label>
                    <input
                      type="text"
                      value={subject2.place}
                      onChange={(e) => setSubject2({ ...subject2, place: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium"
                    />
                  </div>
                </div>

                {/* Upload chart scan */}
                <div className="pt-2">
                  <label className="block text-stone-600 font-semibold mb-1">
                    {t.horoscopePage.chartUpload} (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setSubject2({ ...subject2, chartUploaded: !subject2.chartUploaded })}
                    className={`w-full py-3 px-4 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                      subject2.chartUploaded
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : 'bg-white border-stone-300 text-stone-600 hover:border-brand-500'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>{subject2.chartUploaded ? '✓ Chart Attached (groom_chart.pdf)' : t.horoscopePage.chooseChart}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setActiveStep(2)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3 rounded-2xl text-xs sm:text-sm shadow transition"
            >
              {language === 'si' ? 'මීළඟ පියවර: ගෙවීම් වෙත →' : 'Proceed to Payment →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PAYMENT & SUBMISSION */}
      {activeStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8 animate-fadeIn">
          <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                {t.horoscopePage.step2}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {language === 'si'
                  ? `ස්වාධීන කේන්ද්‍ර පරීක්ෂණ ගාස්තුව: රු. ${horoscopeFee.toLocaleString()} (පරිපාලක විසින් තීරණය කරන ගාස්තුව)`
                  : `Service Fee: LKR ${horoscopeFee.toLocaleString()} (Admin-configurable)`}
              </p>
            </div>
            <span className="text-xl font-extrabold text-brand-900 bg-brand-50 px-4 py-1.5 rounded-xl border border-brand-200">
              LKR {horoscopeFee.toLocaleString()}
            </span>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('payhere')}
              className={`p-5 rounded-2xl border-2 text-left transition flex items-start space-x-3 ${
                paymentMethod === 'payhere'
                  ? 'border-brand-600 bg-brand-50/50'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <CreditCard className={`w-5 h-5 mt-0.5 ${paymentMethod === 'payhere' ? 'text-brand-600' : 'text-stone-400'}`} />
              <div>
                <span className="font-bold text-sm text-stone-900 block">
                  {t.horoscopePage.payOnline}
                </span>
                <span className="text-xs text-stone-500 mt-1 block">
                  {language === 'si'
                    ? 'Credit / Debit Card, FriMi, Genie, eZ Cash මගින් ක්ෂණික සනාථ කිරීම.'
                    : 'Instant automated webhook confirmation via PayHere.'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('bank_transfer')}
              className={`p-5 rounded-2xl border-2 text-left transition flex items-start space-x-3 ${
                paymentMethod === 'bank_transfer'
                  ? 'border-brand-600 bg-brand-50/50'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <Building className={`w-5 h-5 mt-0.5 ${paymentMethod === 'bank_transfer' ? 'text-brand-600' : 'text-stone-400'}`} />
              <div>
                <span className="font-bold text-sm text-stone-900 block">
                  {t.horoscopePage.bankTransfer}
                </span>
                <span className="text-xs text-stone-500 mt-1 block">
                  {language === 'si'
                    ? 'බැංකු තැන්පතු රිසිට්පත Upload කර කාර්ය මණ්ඩල සනාථ කිරීම ලබාගන්න.'
                    : 'Upload deposit receipt for staff verification.'}
                </span>
              </div>
            </button>
          </div>

          {/* Bank Transfer Details Box if selected */}
          {paymentMethod === 'bank_transfer' && (
            <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3 text-xs text-stone-700">
              <h4 className="font-bold text-amber-900">
                {language === 'si' ? 'ආයතනික බැංකු ගිණුම් විස්තර:' : 'Agency Bank Account Details:'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-800 font-medium">
                <div>
                  <span className="text-stone-500 block text-[11px]">Bank:</span>
                  <span>Commercial Bank of Ceylon (Kollupitiya Branch)</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Account Name:</span>
                  <span>Sri Kalyana Matrimonial Agency (Pvt) Ltd</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Account Number:</span>
                  <span className="font-mono font-bold">1000 2345 6789</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Reference:</span>
                  <span className="font-mono">HORO-{Date.now().toString().slice(-6)}</span>
                </div>
              </div>

              {/* Upload slip button simulation */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSlipUploaded(!slipUploaded)}
                  className={`w-full py-3 rounded-xl border border-dashed font-semibold flex items-center justify-center space-x-2 transition ${
                    slipUploaded
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                      : 'bg-white border-amber-300 text-amber-900 hover:border-amber-500'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{slipUploaded ? '✓ Bank Slip Attached (deposit_slip.jpg)' : t.horoscopePage.uploadSlip}</span>
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveStep(1)}
              className="text-stone-500 hover:text-stone-800 text-xs font-semibold"
            >
              ← {language === 'si' ? 'ආපසු කේන්ද්‍ර විස්තර වෙත' : 'Back to details'}
            </button>

            <button
              onClick={handleOrderSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-2xl text-xs sm:text-sm shadow transition flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t.horoscopePage.submitOrder}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ORDER CONFIRMED & REPORT PREVIEW */}
      {activeStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8 animate-fadeIn">
          <div className="text-center max-w-lg mx-auto space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900">
              {language === 'si' ? 'කේන්ද්‍ර ගැලපීමේ ඇණවුම සාර්ථකයි!' : 'Horoscope Order Placed Successfully!'}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'si'
                ? 'ඔබගේ ඇණවුම් අංකය #HM-2026-9812 වේ. අපගේ ජ්‍යොතිෂවේදී පරීක්ෂාවෙන් අනතුරුව සහතික කළ වාර්තාව මෙතැනින් හෝ ඔබගේ විද්‍යුත් ලිපිනයෙන් ලබාගත හැක.'
                : 'Order Reference #HM-2026-9812. The certified astrological report is ready for download below.'}
            </p>
          </div>

          {/* Sample Astrological Report Preview Card */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {t.horoscopePage.sampleReportTitle}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  10 & 20 Porondam Matching Report (දස/විසි පොරොන්දම් පරීක්ෂාව)
                </h3>
                <span className="text-xs text-stone-500">
                  Reviewed by: Pandit W. M. Jayasinghe (Senior Astrologer, Colombo)
                </span>
              </div>

              <button
                onClick={() => alert('Demo PDF download simulated! In production, this delivers an S3 signed short-lived URL.')}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center space-x-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>{t.horoscopePage.downloadSamplePdf}</span>
              </button>
            </div>

            {/* Quick Astrological Metrics Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] font-bold">10 PORONDAM SCORE</span>
                <span className="text-base font-bold text-emerald-700">8.5 / 10 (Very Good)</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] font-bold">20 PORONDAM SCORE</span>
                <span className="text-base font-bold text-emerald-700">18 / 20 Compatible</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] font-bold">KUJA DOSHA</span>
                <span className="text-base font-bold text-stone-800">Balanced / Neutralized</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] font-bold">FINAL VERDICT</span>
                <span className="text-base font-bold text-brand-700">Highly Recommended</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 italic leading-relaxed">
              &ldquo;දෙදෙනාගේ නැකැත් සහ ග්‍රහ පිහිටීම් අතිශය සාමකාමී යුග දිවියකට ආශිර්වාද ගෙනදෙයි. දස පොරොන්දම් අතුරින් ස්ත්‍රී දීර්ඝ, ගණ, යෝනි, රාශි සහ රජ්ජු පොරොන්දම් උසස් අන්දමින් ගැලපේ.&rdquo;
            </p>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => {
                setActiveStep(1);
              }}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              {language === 'si' ? '+ තවත් කේන්ද්‍ර යුගලයක් පරීක්ෂා කිරීමට' : '+ Check Another Horoscope Pair'}
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
