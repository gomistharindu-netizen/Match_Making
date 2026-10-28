'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useDemo } from '../../context/DemoContext';
import { useAuth } from '../../context/AuthContext';
import { mockRecentlyViewed, mockWhoViewedMe } from '../../data/mockMessages';
import {
  Eye,
  Clock,
  Lock,
  ArrowRight,
  EyeOff,
} from 'lucide-react';
import { PageHeaderBanner } from '../../components/PageHeaderBanner';

export default function ActivityPage() {
  const { language, t } = useLanguage();
  const { showInViewerLists, setShowInViewerLists } = useDemo();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'recent' | 'viewed_me'>('recent');

  // Route Guard: Auto redirect unauthenticated visitors to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/activity');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#AD3B65] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#352A30]/60 font-medium">
            {language === 'si' ? 'සාමාජික තොරතුරු තහවුරු කරමින්...' : 'Checking member access...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F8E4EB] shadow-xl text-center space-y-4 max-w-md w-full">
          <div className="w-16 h-16 bg-[#FFF8FA] text-[#AD3B65] border border-[#F8E4EB] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8 text-[#AD3B65]" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#352A30]">
            {language === 'si' ? 'සාමාජිකයින්ට පමණි' : 'Registered Members Only'}
          </h2>
          <p className="text-xs sm:text-sm text-[#352A30]/75 leading-relaxed font-serif">
            {language === 'si'
              ? 'පැතිකඩ නැරඹුම් ඉතිහාසය (Activity History) බැලිය හැක්කේ ලියාපදිංචි වී ගිණුමට ඇතුල් වූ සාමාජිකයින්ට පමණි. කරුණාකර ඔබගේ ගිණුමට ඇතුල් වන්න.'
              : 'Profile viewer activity history is strictly reserved for registered logged-in members. Please sign in to your account to continue.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?redirect=/activity"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <span>{language === 'si' ? 'ඇතුල් වන්න (Sign In)' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C6A56B]" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#FFF8FA] text-[#AD3B65] border border-[#F8E4EB] px-6 py-2.5 rounded-2xl text-xs font-bold hover:bg-[#F8E4EB] transition cursor-pointer"
            >
              <span>{language === 'si' ? 'ලියාපදිංචි වන්න' : 'Register Free'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Full-Screen Width Royal Banner */}
      <PageHeaderBanner
        badgeText={language === 'si' ? 'රහස්‍යතා සුරක්ෂිත වාර්තා' : 'Privacy-Protected Activity'}
        titlePrefix={language === 'si' ? 'පැතිකඩ' : 'Profile'}
        titleHighlight={language === 'si' ? 'නැරඹුම් ඉතිහාසය' : 'Visitor Activity'}
        subtitle={t.activityPage.subtitle}
        breadcrumbCurrent={language === 'si' ? 'නැරඹුම් ඉතිහාසය' : 'Activity'}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* Reciprocal Visibility Privacy Setting Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-stone-900">
              {t.activityPage.privacyToggle}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              showInViewerLists ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
            }`}>
              {showInViewerLists ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
            {t.activityPage.reciprocalNotice}
          </p>
        </div>

        <button
          onClick={() => setShowInViewerLists(!showInViewerLists)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 ${
            showInViewerLists
              ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
          }`}
        >
          {showInViewerLists ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'මාව සඟවන්න (Make Private)' : 'Make Private'}</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'නැවත සක්‍රිය කරන්න (Enable)' : 'Enable Visibility'}</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 border-b border-stone-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('recent')}
          className={`pb-2 px-1 transition relative ${
            activeTab === 'recent'
              ? 'text-brand-600 border-b-2 border-brand-600 font-extrabold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {t.activityPage.recentlyViewedTab} ({mockRecentlyViewed.length})
        </button>

        <button
          onClick={() => setActiveTab('viewed_me')}
          className={`pb-2 px-1 transition relative ${
            activeTab === 'viewed_me'
              ? 'text-brand-600 border-b-2 border-brand-600 font-extrabold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {t.activityPage.whoViewedMeTab} ({mockWhoViewedMe.length})
        </button>
      </div>

      {/* Tab 1: Recently Viewed */}
      {activeTab === 'recent' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRecentlyViewed.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between space-x-4 hover:shadow-md transition"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={item.photoUrl}
                    alt={item.profileCode}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] font-bold text-brand-700 block">
                      {item.profileCode}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                      {item.candidateTitle}
                    </h4>
                    <span className="text-xs text-stone-500 block truncate">
                      {item.profession} • {item.location}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-stone-400 block flex items-center justify-end">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.viewedAt}
                  </span>
                  <Link
                    href={`/browse`}
                    className="mt-1 inline-flex items-center text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Who Viewed Me */}
      {activeTab === 'viewed_me' && (
        <div className="space-y-4">
          {!showInViewerLists ? (
            /* Reciprocal Privacy Notice when user has hidden their views */
            <div className="bg-amber-50 rounded-3xl p-8 border border-amber-200 text-center space-y-3">
              <EyeOff className="w-10 h-10 text-amber-700 mx-auto" />
              <h3 className="text-base font-bold text-amber-950">
                {language === 'si'
                  ? 'අන්‍යෝන්‍ය පෞද්ගලිකත්ව නීතිය (Reciprocal Privacy Rule) ක්‍රියාත්මකයි'
                  : 'Reciprocal Visibility Rule Active'}
              </h3>
              <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                {language === 'si'
                  ? 'ඔබගේ නැරඹීම් අන් අයගේ ලැයිස්තු වලින් සඟවා ඇති බැවින්, ඔබගේ Profile එක බැලූ සාමාජිකයින්ගේ නම්ද ඔබට නොපෙනේ. මෙම තොරතුරු බැලීමට ඉහත "Enable Visibility" බොත්තම ඔබන්න.'
                  : 'Because your visibility is currently disabled in others\' viewer history, named viewers are hidden from you. Re-enable visibility to inspect who viewed your profile.'}
              </p>
              <button
                onClick={() => setShowInViewerLists(true)}
                className="mt-2 bg-brand-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow"
              >
                {language === 'si' ? 'නැවත සක්‍රිය කර බලන්න' : 'Enable & View Visitors'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockWhoViewedMe.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between space-x-4 hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={item.photoUrl}
                      alt={item.profileCode}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm"
                    />
                    <div className="min-w-0">
                      <span className="font-mono text-[11px] font-bold text-brand-700 block">
                        {item.profileCode}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                        {item.candidateTitle}
                      </h4>
                      <span className="text-xs text-stone-500 block truncate">
                        {item.profession} • {item.location}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-stone-400 block flex items-center justify-end">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.viewedAt}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      {item.viewCount} {t.activityPage.viewsCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
