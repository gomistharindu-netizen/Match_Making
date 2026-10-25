'use client';

import React, { useState, useRef } from 'react';
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
  Search,
  Sparkles,
  AlertCircle,
  Clock,
  Copy,
  Check,
  ArrowRight,
  Mail
} from 'lucide-react';
import { PageHeaderBanner } from '../../components/PageHeaderBanner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface TrackedHoroscopeOrder {
  order_code: string;
  customer_name: string;
  status: string;
  first_party_name: string;
  second_party_name: string;
  has_report?: boolean;
  report_file_url?: string;
  [key: string]: unknown;
}

export default function HoroscopePage() {
  const { language } = useLanguage();
  const { horoscopeFee } = useDemo();

  // Main Page Tab: 'order' or 'track'
  const [currentTab, setCurrentTab] = useState<'order' | 'track'>('order');

  // Multi-step order state
  const [activeStep, setActiveStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'payhere' | 'bank_transfer'>('payhere');

  // Customer Contact Info
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Subject 1 (Bride)
  const [subject1, setSubject1] = useState({
    name: '',
    dob: '1998-05-14',
    time: '06:45 AM',
    place: 'Colombo',
  });

  // Subject 2 (Groom)
  const [subject2, setSubject2] = useState({
    name: '',
    dob: '1995-11-22',
    time: '02:15 PM',
    place: 'Kandy',
  });

  const [notes, setNotes] = useState('');

  // Horoscope chart files
  const [chart1File, setChart1File] = useState<File | null>(null);
  const [chart1Name, setChart1Name] = useState<string | null>(null);
  const [chart2File, setChart2File] = useState<File | null>(null);
  const [chart2Name, setChart2Name] = useState<string | null>(null);

  const chart1InputRef = useRef<HTMLInputElement>(null);
  const chart2InputRef = useRef<HTMLInputElement>(null);

  // Bank slip upload state
  const [bankSlipFile, setBankSlipFile] = useState<File | null>(null);
  const [bankSlipPreview, setBankSlipPreview] = useState<string | null>(null);
  const [bankRefNo, setBankRefNo] = useState('');
  const slipInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Tracking State
  const [trackCodeInput, setTrackCodeInput] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<TrackedHoroscopeOrder | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!customer.name.trim() || !customer.phone.trim() || !customer.email.trim()) {
      setSubmitError(
        language === 'si'
          ? 'කරුණාකර ඔබගේ නම, දුරකථන අංකය සහ ඊමේල් ලිපිනය ඇතුළත් කරන්න.'
          : 'Please enter your name, contact phone and email address.'
      );
      return;
    }

    if (!subject1.name.trim() || !subject2.name.trim()) {
      setSubmitError(
        language === 'si'
          ? 'කරුණාකර දෙපාර්ශවයේම නම් සම්පූර්ණ කරන්න.'
          : 'Please enter the names for both parties.'
      );
      return;
    }

    setActiveStep(2);
  };

  const handleOrderSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const birthDateTime1 = `${subject1.dob} 06:45:00`;
      const birthDateTime2 = `${subject2.dob} 02:15:00`;

      const orderFormData = new FormData();
      orderFormData.append('customer_name', customer.name);
      orderFormData.append('customer_email', customer.email);
      orderFormData.append('customer_phone', customer.phone);
      orderFormData.append('first_party_name', subject1.name);
      orderFormData.append('first_party_birth_datetime', birthDateTime1);
      orderFormData.append('first_party_birth_place', subject1.place);
      orderFormData.append('second_party_name', subject2.name);
      orderFormData.append('second_party_birth_datetime', birthDateTime2);
      orderFormData.append('second_party_birth_place', subject2.place);
      orderFormData.append('payment_method', paymentMethod);
      if (notes) orderFormData.append('notes', notes);
      if (chart1File) orderFormData.append('first_party_chart', chart1File);
      if (chart2File) orderFormData.append('second_party_chart', chart2File);

      const res = await fetch(`${API_BASE_URL}/public/horoscope-orders`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: orderFormData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit horoscope matching order');
      }

      const generatedCode = data.order_code;
      setCreatedOrderCode(generatedCode);

      // If bank slip was selected, upload it
      if (paymentMethod === 'bank_transfer' && bankSlipFile) {
        const slipData = new FormData();
        slipData.append('order_code', generatedCode);
        slipData.append('bank_name', 'Bank of Ceylon');
        slipData.append('deposit_date', new Date().toISOString().split('T')[0]);
        slipData.append('reference_no', bankRefNo || `REF-${Date.now().toString().slice(-6)}`);
        slipData.append('slip', bankSlipFile);

        await fetch(`${API_BASE_URL}/payments/bank-slip`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: slipData,
        });
      }

      setActiveStep(3);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error creating order. Please check your connection.';
      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackCodeInput.trim()) return;

    setTrackingLoading(true);
    setTrackError(null);
    setTrackedOrder(null);

    try {
      const res = await fetch(`${API_BASE_URL}/public/horoscope-orders/${trackCodeInput.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || (language === 'si' ? 'මෙම අංකයට අදාළ ඇණවුමක් සොයාගත නොහැකි විය.' : 'Order not found. Please verify the code.'));
      }

      setTrackedOrder(data);
    } catch (err: unknown) {
      setTrackError(err instanceof Error ? err.message : 'Error loading order');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (createdOrderCode) {
      navigator.clipboard.writeText(createdOrderCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  return (
    <div className="space-y-10 pb-20 bg-gradient-to-b from-[#FFF8FA] via-[#F8E4EB]/20 to-[#FFF8FA] min-h-screen">
      {/* Full-Screen Width Royal Banner */}
      <PageHeaderBanner
        badgeText={language === 'si' ? 'ස්වාධීන ජ්‍යොතිෂ සේවාව' : 'Independent Astrological Service'}
        titlePrefix={language === 'si' ? 'විද්‍යානුකූල' : 'Astrological'}
        titleHighlight={language === 'si' ? 'කේන්ද්‍ර සහ පොරොන්දම්' : 'Horoscope Matching'}
        titleSuffix={language === 'si' ? 'ගැලපීම' : ''}
        subtitle={
          language === 'si'
            ? 'ශ්‍රී ලාංකික සම්ප්‍රදායික දස සහ විසි පොරොන්දම්, කුජ දෝෂ සහ ග්‍රහ ගැළපීම් සහිත පූර්ණ ජ්‍යොතිෂ වාර්තාවක් ලබාගන්න.'
            : 'Detailed 10 & 20 Porondam, Kuja Dosha, and planetary compatibility reports prepared by certified Sri Lankan astrologers.'
        }
        breadcrumbCurrent={language === 'si' ? 'කේන්ද්‍ර ගැලපීම' : 'Horoscope'}
      >
        <div className="inline-flex items-center space-x-2 bg-emerald-950/70 backdrop-blur-md border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-xs text-emerald-200 font-serif shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {language === 'si'
              ? 'මංගල සේවාවේ ලියාපදිංචි නොමැති ඕනෑම අයෙකුටද ලබාගත හැක (සාමාජිකත්වය අනිවාර්ය නොවේ)'
              : 'Available to everyone — Matrimonial registration not required'}
          </span>
        </div>
      </PageHeaderBanner>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Tabs (New Order vs Track Status) */}
        <div className="flex justify-center">
          <div className="bg-white p-1.5 rounded-2xl border border-[#F8E4EB] shadow-xs inline-flex space-x-1.5">
            <button
              onClick={() => setCurrentTab('order')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                currentTab === 'order'
                  ? 'bg-[#AD3B65] text-white shadow-md shadow-[#AD3B65]/20'
                  : 'text-[#352A30]/75 hover:bg-[#FFF8FA] hover:text-[#AD3B65]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C6A56B]" />
              <span>{language === 'si' ? 'නව කේන්ද්‍ර පරීක්ෂණ ඇණවුම' : 'New Horoscope Order'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('track')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                currentTab === 'track'
                  ? 'bg-[#AD3B65] text-white shadow-md shadow-[#AD3B65]/20'
                  : 'text-[#352A30]/75 hover:bg-[#FFF8FA] hover:text-[#AD3B65]'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#C6A56B]" />
              <span>{language === 'si' ? 'ඇණවුමේ තත්ත්වය සොයන්න (Track Order)' : 'Track Order Status'}</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: NEW HOROSCOPE ORDER                                  */}
        {/* ============================================================ */}
        {currentTab === 'order' && (
          <div className="space-y-8">
            {/* Progress Steps Indicator */}
            <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto text-xs font-bold text-center">
              <div
                className={`p-3 rounded-2xl border transition ${
                  activeStep === 1
                    ? 'bg-[#AD3B65] text-white border-[#AD3B65] shadow-md shadow-[#AD3B65]/20'
                    : activeStep > 1
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-[#352A30]/40 border-[#F8E4EB]'
                }`}
              >
                <span>1. {language === 'si' ? 'කේන්ද්‍ර විස්තර' : 'Horoscope Data'}</span>
              </div>

              <div
                className={`p-3 rounded-2xl border transition ${
                  activeStep === 2
                    ? 'bg-[#AD3B65] text-white border-[#AD3B65] shadow-md shadow-[#AD3B65]/20'
                    : activeStep > 2
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-[#352A30]/40 border-[#F8E4EB]'
                }`}
              >
                <span>2. {language === 'si' ? 'ගෙවීම්' : 'Payment'}</span>
              </div>

              <div
                className={`p-3 rounded-2xl border transition ${
                  activeStep === 3
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white text-[#352A30]/40 border-[#F8E4EB]'
                }`}
              >
                <span>3. {language === 'si' ? 'ඇණවුම සහ වාර්තාව' : 'Report & Tracking'}</span>
              </div>
            </div>

            {submitError && (
              <div className="p-4 rounded-2xl bg-[#F8E4EB] border border-[#AD3B65]/30 text-[#AD3B65] text-sm flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* STEP 1: HOROSCOPE INPUTS */}
            {activeStep === 1 && (
              <form onSubmit={handleNextToPayment} className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#F8E4EB] shadow-md shadow-[#AD3B65]/5 space-y-8 animate-fadeIn">
                {/* Customer Contact Box */}
                <div className="bg-[#FFF8FA] p-5 sm:p-6 rounded-2xl border border-[#F8E4EB]">
                  <h3 className="text-xs font-bold text-[#AD3B65] uppercase tracking-wider mb-1 flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[#C6A56B]" />
                    <span>{language === 'si' ? 'ඇණවුම්කරුගේ තොරතුරු (වාර්තාව එවීම සඳහා)' : 'Customer Contact Details'}</span>
                  </h3>
                  <p className="text-xs text-[#352A30]/65 mb-4">
                    {language === 'si'
                      ? 'කේන්ද්‍ර වාර්තාව සූදානම් වූ වහාම මෙම ඊමේල් සහ WhatsApp අංකයට සබැඳිය එවනු ලැබේ.'
                      : 'The completed report will be delivered to this email and phone number.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#352A30] mb-1">
                        {language === 'si' ? 'ඔබගේ නම' : 'Your Name'} *
                      </label>
                      <input
                        type="text"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder={language === 'si' ? 'ඩබ්. එම්. බණ්ඩාර' : 'e.g. Sunil Shantha'}
                        className="w-full bg-white border border-[#F8E4EB] rounded-xl px-3.5 py-2 text-xs text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#352A30] mb-1">
                        {language === 'si' ? 'ඊමේල් ලිපිනය' : 'Email Address'} *
                      </label>
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="example@gmail.com"
                        className="w-full bg-white border border-[#F8E4EB] rounded-xl px-3.5 py-2 text-xs text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#352A30] mb-1">
                        {language === 'si' ? 'දුරකථන අංකය (WhatsApp)' : 'Phone (WhatsApp)'} *
                      </label>
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="+94 77 123 4567"
                        className="w-full bg-white border border-[#F8E4EB] rounded-xl px-3.5 py-2 text-xs text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Two Parties Horoscopes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Subject 1 (Bride) */}
                  <div className="space-y-4 bg-[#FFF8FA]/70 p-5 rounded-2xl border border-[#F8E4EB]">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#AD3B65] flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-[#C6A56B]" />
                      <span>{language === 'si' ? '1. මනාලියගේ කේන්ද්‍ර විස්තර' : "1. Bride's Details"}</span>
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[#352A30] font-bold mb-1">
                          {language === 'si' ? 'සම්පූර්ණ නම' : 'Full Name'} *
                        </label>
                        <input
                          type="text"
                          value={subject1.name}
                          onChange={(e) => setSubject1({ ...subject1, name: e.target.value })}
                          placeholder={language === 'si' ? 'කාවින්දි පෙරේරා' : 'e.g. Kavindi Perera'}
                          className="w-full bg-white border border-[#F8E4EB] rounded-xl px-3.5 py-2 text-xs text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#352A30] font-bold mb-1">
                          {language === 'si' ? 'උපන් දිනය' : 'Date of Birth'} *
                        </label>
                        <input
                          type="date"
                          value={subject1.dob}
                          onChange={(e) => setSubject1({ ...subject1, dob: e.target.value })}
                          className="w-full bg-white border border-[#F8E4EB] rounded-xl px-3.5 py-2 text-xs text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[#352A30] font-bold mb-1">
                            {language === 'si' ? 'උපන් වේලාව' : 'Birth Time'}
                          </label>
                          <input
                            type="text"
                            value={subject1.time}
                            onChange={(e) => setSubject1({ ...subject1, time: e.target.value })}
                            placeholder="06:45 AM"
                            className="w-full bg-white border border-[#F8E4EB] rounded-xl px-3.5 py-2 text-xs text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#352A30] font-bold mb-1">
                            {language === 'si' ? 'උපන් ස්ථානය' : 'Birth Place'}
                          </label>
                          <input
                            type="text"
                            value={subject1.place}
                            onChange={(e) => setSubject1({ ...subject1, place: e.target.value })}
                            placeholder="Colombo"
                            className="w-full bg-white border border-[#F8E4EB] rounded-xl px-3.5 py-2 text-xs text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                          />
                        </div>
                      </div>

                      {/* Bride Chart Upload */}
                      <div className="pt-2 border-t border-[#F8E4EB]">
                        <label className="block text-[#352A30] font-bold mb-1 flex items-center justify-between">
                          <span>{language === 'si' ? 'කේන්ද්‍ර පත්‍රය (Horoscope Chart)' : 'Horoscope Chart'}</span>
                          <span className="text-[10px] text-[#C6A56B] font-semibold">{language === 'si' ? 'විකල්ප (Optional)' : 'Optional'}</span>
                        </label>
                        <p className="text-[11px] text-[#352A30]/60 mb-2">
                          {language === 'si' ? 'කේන්ද්‍ර කොළයේ ඡායාරූපයක් හෝ PDF එකක් අමුණන්න (JPG/PNG/PDF, උපරිම 10MB)' : 'Attach chart scan or photo (JPG/PNG/PDF, Max 10MB)'}
                        </p>

                        <input
                          ref={chart1InputRef}
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setChart1File(f);
                              setChart1Name(f.name);
                            }
                          }}
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => chart1InputRef.current?.click()}
                          className={`w-full py-2.5 px-3 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer ${
                            chart1File
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                              : 'bg-white border-[#F8E4EB] text-[#AD3B65] hover:bg-[#F8E4EB]'
                          }`}
                        >
                          <Upload className="w-4 h-4 text-[#C6A56B]" />
                          <span className="truncate">
                            {chart1File ? `✓ ${chart1Name} (Attached)` : (language === 'si' ? 'කේන්ද්‍ර පත්‍රය තෝරන්න (Upload Chart)' : 'Choose Chart File')}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subject 2 (Groom) */}
                  <div className="space-y-4 bg-[#FFF8FA]/70 p-5 rounded-2xl border border-[#F8E4EB]">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#AD3B65] flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-[#C6A56B]" />
                      <span>{language === 'si' ? '2. මනාලයාගේ කේන්ද්‍ර විස්තර' : "2. Groom's Details"}</span>
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[#352A30] font-bold mb-1">
                          {language === 'si' ? 'සම්පූර්ණ නම' : 'Full Name'} *
                        </label>
                        <input
                          type="text"
                          value={subject2.name}
                          onChange={(e) => setSubject2({ ...subject2, name: e.target.value })}
                          placeholder={language === 'si' ? 'තරිඳු සේනානායක' : 'e.g. Tharindu Senanayake'}
                          className="w-full bg-white border border-[#F8E4EB] rounded-xl px-3.5 py-2 text-xs text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#352A30] font-bold mb-1">
                          {language === 'si' ? 'උපන් දිනය' : 'Date of Birth'} *
                        </label>
                        <input
                          type="date"
                          value={subject2.dob}
                          onChange={(e) => setSubject2({ ...subject2, dob: e.target.value })}
                          className="w-full bg-white border border-[#F8E4EB] rounded-xl px-3.5 py-2 text-xs text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[#352A30] font-bold mb-1">
                            {language === 'si' ? 'උපන් වේලාව' : 'Birth Time'}
                          </label>
                          <input
                            type="text"
                            value={subject2.time}
                            onChange={(e) => setSubject2({ ...subject2, time: e.target.value })}
                            placeholder="02:15 PM"
                            className="w-full bg-white border border-[#F8E4EB] rounded-xl px-3.5 py-2 text-xs text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#352A30] font-bold mb-1">
                            {language === 'si' ? 'උපන් ස්ථානය' : 'Birth Place'}
                          </label>
                          <input
                            type="text"
                            value={subject2.place}
                            onChange={(e) => setSubject2({ ...subject2, place: e.target.value })}
                            placeholder="Kandy"
                            className="w-full bg-white border border-[#F8E4EB] rounded-xl px-3.5 py-2 text-xs text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                          />
                        </div>
                      </div>

                      {/* Groom Chart Upload */}
                      <div className="pt-2 border-t border-[#F8E4EB]">
                        <label className="block text-[#352A30] font-bold mb-1 flex items-center justify-between">
                          <span>{language === 'si' ? 'කේන්ද්‍ර පත්‍රය (Horoscope Chart)' : 'Horoscope Chart'}</span>
                          <span className="text-[10px] text-[#C6A56B] font-semibold">{language === 'si' ? 'විකල්ප (Optional)' : 'Optional'}</span>
                        </label>
                        <p className="text-[11px] text-[#352A30]/60 mb-2">
                          {language === 'si' ? 'කේන්ද්‍ර කොළයේ ඡායාරූපයක් හෝ PDF එකක් අමුණන්න (JPG/PNG/PDF, උපරිම 10MB)' : 'Attach chart scan or photo (JPG/PNG/PDF, Max 10MB)'}
                        </p>

                        <input
                          ref={chart2InputRef}
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setChart2File(f);
                              setChart2Name(f.name);
                            }
                          }}
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => chart2InputRef.current?.click()}
                          className={`w-full py-2.5 px-3 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer ${
                            chart2File
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                              : 'bg-white border-[#F8E4EB] text-[#AD3B65] hover:bg-[#F8E4EB]'
                          }`}
                        >
                          <Upload className="w-4 h-4 text-[#C6A56B]" />
                          <span className="truncate">
                            {chart2File ? `✓ ${chart2Name} (Attached)` : (language === 'si' ? 'කේන්ද්‍ර පත්‍රය තෝරන්න (Upload Chart)' : 'Choose Chart File')}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                    {language === 'si' ? 'විශේෂ ජ්‍යොතිෂ කරුණු හෝ සටහන් (විකල්ප)' : 'Special Astrological Notes / Focus Areas (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      language === 'si'
                        ? 'උදා: කුජ දෝෂය පිළිබඳ විශේෂ අවධානයක් යොමු කරන්න...'
                        : 'e.g., Focus on Kuja Dosha or specific Dasa periods...'
                    }
                    className="w-full bg-[#FFF8FA] border border-[#F8E4EB] rounded-2xl p-3 text-xs text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] hover:from-[#972F55] hover:to-[#AD3B65] text-white font-bold px-8 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md shadow-[#AD3B65]/20 hover:shadow-lg transition flex items-center space-x-2 cursor-pointer"
                  >
                    <span>{language === 'si' ? 'මීළඟ පියවර: ගෙවීම් ක්‍රමය තෝරන්න' : 'Proceed to Payment'}</span>
                    <ArrowRight className="w-4 h-4 text-[#C6A56B]" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT & SUBMISSION */}
            {activeStep === 2 && (
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#F8E4EB] shadow-md shadow-[#AD3B65]/5 space-y-8 animate-fadeIn">
                <div className="border-b border-[#F8E4EB] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-[#352A30]">
                      {language === 'si' ? 'ගෙවීම් ක්‍රමය තෝරන්න' : 'Select Payment Method'}
                    </h2>
                    <p className="text-xs text-[#352A30]/65 mt-1">
                      {language === 'si'
                        ? `කේන්ද්‍ර පරීක්ෂණ ගාස්තුව: රු. ${horoscopeFee.toLocaleString()} (ආයතනික ගාස්තුව)`
                        : `Certified Astrological Matching Fee: LKR ${horoscopeFee.toLocaleString()}`}
                    </p>
                  </div>
                  <span className="text-xl font-extrabold text-[#AD3B65] bg-[#F8E4EB] px-5 py-2 rounded-2xl border border-[#AD3B65]/20 self-start sm:self-auto">
                    LKR {horoscopeFee.toLocaleString()}
                  </span>
                </div>

                {/* Payment Method Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('payhere')}
                    className={`p-5 rounded-2xl border-2 text-left transition flex items-start space-x-3 cursor-pointer ${
                      paymentMethod === 'payhere'
                        ? 'border-[#AD3B65] bg-[#FFF8FA]'
                        : 'border-[#F8E4EB] bg-white hover:border-[#AD3B65]/40'
                    }`}
                  >
                    <CreditCard
                      className={`w-5 h-5 mt-0.5 ${
                        paymentMethod === 'payhere' ? 'text-[#AD3B65]' : 'text-[#352A30]/40'
                      }`}
                    />
                    <div>
                      <span className="font-bold text-sm text-[#352A30] block">
                        {language === 'si' ? 'ඔන්ලයින් ගෙවීම් (PayHere)' : 'Online Payment (PayHere)'}
                      </span>
                      <span className="text-xs text-[#352A30]/65 mt-1 block">
                        {language === 'si'
                          ? 'Visa, Master Card, FriMi, Genie මඟින් ක්ෂණික සනාථ කිරීම.'
                          : 'Instant confirmation via credit/debit card or digital wallet.'}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-5 rounded-2xl border-2 text-left transition flex items-start space-x-3 cursor-pointer ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#AD3B65] bg-[#FFF8FA]'
                        : 'border-[#F8E4EB] bg-white hover:border-[#AD3B65]/40'
                    }`}
                  >
                    <Building
                      className={`w-5 h-5 mt-0.5 ${
                        paymentMethod === 'bank_transfer' ? 'text-[#AD3B65]' : 'text-[#352A30]/40'
                      }`}
                    />
                    <div>
                      <span className="font-bold text-sm text-[#352A30] block">
                        {language === 'si' ? 'බැංකු තැන්පතු (Bank Transfer / Slip)' : 'Direct Bank Deposit'}
                      </span>
                      <span className="text-xs text-[#352A30]/65 mt-1 block">
                        {language === 'si'
                          ? 'බැංකු රිසිට්පත Upload කර කාර්ය මණ්ඩල සනාථ කිරීම ලබාගන්න.'
                          : 'Deposit at any bank branch and upload the receipt slip.'}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Bank Transfer Details Box if selected */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="p-5 sm:p-6 bg-[#FFF8FA] border border-[#F8E4EB] rounded-2xl space-y-4 text-xs text-[#352A30]">
                    <h4 className="font-bold text-[#AD3B65] uppercase tracking-wider flex items-center space-x-2">
                      <Building className="w-4 h-4 text-[#C6A56B]" />
                      <span>{language === 'si' ? 'ආයතනික බැංකු ගිණුම් විස්තර' : 'Official Agency Bank Details'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-[#F8E4EB] text-xs">
                      <div>
                        <span className="text-[#352A30]/60 block text-[11px]">Bank:</span>
                        <span className="font-bold text-[#352A30]">Bank of Ceylon (BOC)</span>
                      </div>
                      <div>
                        <span className="text-[#352A30]/60 block text-[11px]">Branch:</span>
                        <span className="font-bold text-[#352A30]">Colombo Fort Branch</span>
                      </div>
                      <div>
                        <span className="text-[#352A30]/60 block text-[11px]">Account Name:</span>
                        <span className="font-bold text-[#352A30]">Jayathu Jaya Services</span>
                      </div>
                      <div>
                        <span className="text-[#352A30]/60 block text-[11px]">Account Number:</span>
                        <span className="font-mono font-bold text-[#AD3B65]">8765 4321</span>
                      </div>
                    </div>

                    {/* Slip Upload Box */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-[#352A30] mb-1.5">
                        {language === 'si' ? 'බැංකු රිසිට්පත (Bank Deposit Slip Upload)' : 'Attach Deposit Slip / Screenshot'}
                      </label>
                      <input
                        ref={slipInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setBankSlipFile(file);
                            setBankSlipPreview(file.name);
                          }
                        }}
                        className="hidden"
                      />

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => slipInputRef.current?.click()}
                          className={`flex-1 py-3 px-4 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer ${
                            bankSlipFile
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                              : 'bg-white border-[#F8E4EB] text-[#AD3B65] hover:bg-[#F8E4EB]'
                          }`}
                        >
                          <Upload className="w-4 h-4 text-[#C6A56B]" />
                          <span>
                            {bankSlipFile
                              ? `✓ ${bankSlipPreview} (Attached)`
                              : (language === 'si' ? 'රිසිට්පතේ ඡායාරූපය තෝරන්න' : 'Choose Deposit Slip Image')}
                          </span>
                        </button>

                        <input
                          type="text"
                          value={bankRefNo}
                          onChange={(e) => setBankRefNo(e.target.value)}
                          placeholder={language === 'si' ? 'බැංකු Reference අංකය (විකල්ප)' : 'Reference No (Optional)'}
                          className="bg-white border border-[#F8E4EB] rounded-xl px-3.5 py-2.5 text-xs text-[#352A30] sm:w-48"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-[#352A30]/75 hover:text-[#AD3B65] text-xs font-bold transition cursor-pointer"
                  >
                    ← {language === 'si' ? 'ආපසු කේන්ද්‍ර විස්තර වෙත' : 'Back to details'}
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleOrderSubmit}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold px-8 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-70"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>{language === 'si' ? 'ඇණවුම තහවුරු කරන්න' : 'Confirm & Place Order'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER CONFIRMED & TRACKING */}
            {activeStep === 3 && (
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#F8E4EB] shadow-md shadow-[#AD3B65]/5 space-y-8 animate-fadeIn">
                <div className="text-center max-w-lg mx-auto space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#352A30]">
                    {language === 'si' ? 'කේන්ද්‍ර ගැලපීමේ ඇණවුම සාර්ථකයි!' : 'Horoscope Order Placed Successfully!'}
                  </h2>
                  <p className="text-xs text-[#352A30]/75 leading-relaxed">
                    {language === 'si'
                      ? 'ඔබගේ ඇණවුම සාර්ථකව පද්ධතියට ලැබුණි. පහත ඇණවුම් අංකය භාවිතයෙන් ඔබට ඕනෑම වේලාවක මෙහි තත්ත්වය පරීක්ෂා කළ හැක.'
                      : 'Your order has been recorded. Use the order reference code below to track status at any time.'}
                  </p>

                  {/* Order Reference Box with Copy */}
                  <div className="bg-[#FFF8FA] border-2 border-dashed border-[#AD3B65]/30 p-4 rounded-2xl inline-flex items-center space-x-3 mt-2">
                    <span className="font-mono text-base font-bold text-[#AD3B65]">
                      {createdOrderCode || 'HO-2026-9812'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="p-1.5 rounded-lg bg-white hover:bg-[#F8E4EB] text-[#AD3B65] border border-[#F8E4EB] transition cursor-pointer"
                      title="Copy Code"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Workflow Steps Tracker */}
                <div className="bg-[#FFF8FA] rounded-2xl p-6 border border-[#F8E4EB]">
                  <h4 className="text-xs font-bold text-[#AD3B65] uppercase tracking-wider mb-4 text-center sm:text-left">
                    {language === 'si' ? 'ඇණවුමේ පියවර (Order Progress)' : 'Order Progress Tracking'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-300 shadow-xs">
                      <span className="text-[10px] text-emerald-700 font-bold block mb-1">✓ STEP 1</span>
                      <span className="font-bold text-[#352A30] block">{language === 'si' ? 'ඇණවුම ලැබිණි' : 'Order Received'}</span>
                      <span className="text-[11px] text-[#352A30]/60">{customer.name || 'Customer'}</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-emerald-300 shadow-xs">
                      <span className="text-[10px] text-emerald-700 font-bold block mb-1">✓ STEP 2</span>
                      <span className="font-bold text-[#352A30] block">{language === 'si' ? 'ගෙවීම් ලැබිණි' : 'Payment Queued'}</span>
                      <span className="text-[11px] text-[#352A30]/60">{paymentMethod === 'payhere' ? 'PayHere Instant' : 'Bank Slip Review'}</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-amber-300 shadow-xs">
                      <span className="text-[10px] text-amber-700 font-bold block mb-1">⏳ STEP 3</span>
                      <span className="font-bold text-[#352A30] block">{language === 'si' ? 'ජ්‍යොතිෂ පරීක්ෂාව' : 'Astrologer Review'}</span>
                      <span className="text-[11px] text-[#352A30]/60">{language === 'si' ? 'පොරොන්දම් පරීක්ෂාව' : 'Porondam Analysis'}</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-[#F8E4EB] opacity-60">
                      <span className="text-[10px] text-[#352A30]/50 font-bold block mb-1">⚪ STEP 4</span>
                      <span className="font-bold text-[#352A30] block">{language === 'si' ? 'වාර්තාව නිකුත් කිරීම' : 'PDF Report Ready'}</span>
                      <span className="text-[11px] text-[#352A30]/60">{language === 'si' ? 'පැය 24-48 තුළ' : 'Within 24-48 hrs'}</span>
                    </div>
                  </div>
                </div>

                {/* Sample Astrological Report Preview Card */}
                <div className="bg-[#FFF8FA] rounded-2xl border border-[#F8E4EB] p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#F8E4EB] pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#AD3B65] bg-[#F8E4EB] px-2.5 py-0.5 rounded-full border border-[#AD3B65]/20">
                        {language === 'si' ? 'ආදර්ශ ජ්‍යොතිෂ වාර්තාව' : 'Certified Sample Report Preview'}
                      </span>
                      <h3 className="text-base font-bold text-[#352A30] mt-1.5 font-serif">
                        {language === 'si' ? 'දස / විසි පොරොන්දම් සහ ග්‍රහ ගැළපීම් වාර්තාව' : '10 & 20 Porondam Matching Report'}
                      </h3>
                      <span className="text-xs text-[#352A30]/65">
                        {language === 'si'
                          ? 'ප්‍රවීණ ජ්‍යොතිෂවේදී මණ්ඩලය, ජයතු ජය මංගල සේවාව'
                          : 'Reviewed by: Senior Astrological Board, Jayathu Jaya'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(language === 'si' ? 'වාර්තාව Astrologer Review එකෙන් පසු Download කරගත හැක.' : 'Your official PDF will be ready after Astrologer review.')}
                      className="bg-[#AD3B65] hover:bg-[#972F55] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 transition cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#C6A56B]" />
                      <span>{language === 'si' ? 'වාර්තාව බාගත කරන්න' : 'Download Report'}</span>
                    </button>
                  </div>

                  {/* Quick Astrological Metrics Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-[#F8E4EB]">
                      <span className="text-[#352A30]/50 block text-[10px] font-bold">10 PORONDAM SCORE</span>
                      <span className="text-base font-bold text-emerald-700">8.5 / 10 (Very Good)</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#F8E4EB]">
                      <span className="text-[#352A30]/50 block text-[10px] font-bold">20 PORONDAM SCORE</span>
                      <span className="text-base font-bold text-emerald-700">18 / 20 Compatible</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#F8E4EB]">
                      <span className="text-[#352A30]/50 block text-[10px] font-bold">KUJA DOSHA</span>
                      <span className="text-base font-bold text-[#352A30]">Balanced / Neutralized</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#F8E4EB]">
                      <span className="text-[#352A30]/50 block text-[10px] font-bold">FINAL VERDICT</span>
                      <span className="text-base font-bold text-[#AD3B65]">Highly Recommended</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#352A30]/75 italic leading-relaxed">
                    &ldquo;{language === 'si'
                      ? 'දෙදෙනාගේ නැකැත් සහ ග්‍රහ පිහිටීම් අතිශය සාමකාමී යුග දිවියකට ආශිර්වාද ගෙනදෙයි. දස පොරොන්දම් අතුරින් ස්ත්‍රී දීර්ඝ, ගණ, යෝනි, රාශි සහ රජ්ජු පොරොන්දම් උසස් අන්දමින් ගැලපේ.'
                      : 'The birth charts display exceptional spiritual and practical harmony. Key porondams including Rashi, Gana, Yoni and Rajju match favorably.'}&rdquo;
                  </p>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveStep(1);
                      setCreatedOrderCode(null);
                    }}
                    className="text-xs font-bold text-[#AD3B65] hover:underline cursor-pointer"
                  >
                    {language === 'si' ? '+ තවත් කේන්ද්‍ර යුගලයක් පරීක්ෂා කිරීමට' : '+ Check Another Horoscope Pair'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: TRACK ORDER STATUS                                    */}
        {/* ============================================================ */}
        {currentTab === 'track' && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#F8E4EB] shadow-md shadow-[#AD3B65]/5 space-y-8 animate-fadeIn max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#F8E4EB] text-[#AD3B65] rounded-2xl flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-[#AD3B65]" />
              </div>
              <h2 className="text-xl font-bold text-[#352A30]">
                {language === 'si' ? 'ඇණවුමේ තත්ත්වය පරීක්ෂා කරන්න' : 'Track Horoscope Order'}
              </h2>
              <p className="text-xs text-[#352A30]/65">
                {language === 'si'
                  ? 'ඔබගේ ඇණවුම් අංකය (උදා: HO-2026-001) ඇතුළත් කර වත්මන් තත්ත්වය සහ වාර්තාව ලබාගන්න.'
                  : 'Enter your order reference code (e.g. HO-2026-001) to verify progress and download the report.'}
              </p>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input
                type="text"
                value={trackCodeInput}
                onChange={(e) => setTrackCodeInput(e.target.value)}
                placeholder="e.g. HO-2026-001"
                className="flex-1 bg-[#FFF8FA] border border-[#F8E4EB] rounded-2xl px-4 py-3 text-sm text-[#352A30] font-mono font-bold uppercase placeholder-[#352A30]/40 focus:outline-none focus:border-[#AD3B65]"
                required
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="bg-[#AD3B65] hover:bg-[#972F55] text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-70"
              >
                {trackingLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{language === 'si' ? 'සොයන්න' : 'Track'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Tracker Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setTrackCodeInput('HO-2026-001');
                }}
                className="text-[11px] font-bold text-[#AD3B65] hover:underline"
              >
                {language === 'si' ? '👉 පරීක්ෂා කිරීමට ක්ලික් කරන්න: HO-2026-001' : '👉 Quick Test Order: HO-2026-001'}
              </button>
            </div>

            {trackError && (
              <div className="p-4 rounded-2xl bg-[#F8E4EB] border border-[#AD3B65]/30 text-[#AD3B65] text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {/* Order Result Card */}
            {trackedOrder && (
              <div className="p-6 bg-[#FFF8FA] rounded-2xl border border-[#F8E4EB] space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#F8E4EB] pb-3">
                  <div>
                    <span className="font-mono text-sm font-bold text-[#AD3B65] block">
                      {trackedOrder.order_code}
                    </span>
                    <span className="text-xs text-[#352A30]/65">
                      {trackedOrder.customer_name}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      trackedOrder.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : trackedOrder.status === 'in_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-[#F8E4EB] text-[#AD3B65]'
                    }`}
                  >
                    {trackedOrder.status === 'completed'
                      ? (language === 'si' ? '✓ සම්පූර්ණයි' : 'Completed')
                      : trackedOrder.status === 'in_review'
                      ? (language === 'si' ? '🔍 ජ්‍යොතිෂවේදී පරීක්ෂාව යටතේ' : 'In Review')
                      : (language === 'si' ? '⏳ ගෙවීම් බලාපොරොත්තුවෙන්' : 'Pending Payment')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-[#F8E4EB]">
                    <span className="text-[#352A30]/60 block text-[10px]">Bride / First Party:</span>
                    <span className="font-bold text-[#352A30]">{trackedOrder.first_party_name}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#F8E4EB]">
                    <span className="text-[#352A30]/60 block text-[10px]">Groom / Second Party:</span>
                    <span className="font-bold text-[#352A30]">{trackedOrder.second_party_name}</span>
                  </div>
                </div>

                {/* Report Download or In Progress Notice */}
                {trackedOrder.has_report && trackedOrder.report_file_url ? (
                  <div className="pt-2">
                    <a
                      href={trackedOrder.report_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>{language === 'si' ? 'සහතික කළ PDF වාර්තාව බාගත කරන්න' : 'Download Certified PDF Report'}</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-[#F8E4EB] text-xs text-[#352A30]/75 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      {language === 'si'
                        ? 'අපගේ ප්‍රවීණ ජ්‍යොතිෂවේදී මණ්ඩලය විසින් කේන්ද්‍ර පරීක්ෂා කරමින් පවතී. පැය 24-48 තුළ නිල වාර්තාව නිකුත් කෙරේ.'
                        : 'Astrologer examination in progress. Certified report will be ready within 24-48 hours.'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
