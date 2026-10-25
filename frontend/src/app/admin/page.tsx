'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  ShieldCheck,
  Users,
  Sparkles,
  Receipt,
  CreditCard,
  LogOut,
  ExternalLink,
  Search,
  CheckCircle,
  AlertTriangle,
  FileText,
  Upload,
  Eye,
  RefreshCw,
  Mail,
  Lock,
  TrendingUp,
  Sliders,
  Check,
  X,
  Menu
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Types
interface AdminStats {
  metrics: {
    total_profiles: number;
    approved_profiles: number;
    pending_profiles: number;
    total_horoscopes: number;
    pending_horoscopes: number;
    completed_horoscopes: number;
    pending_slips: number;
    total_slips: number;
    is_free_mode: boolean;
    registration_fee: number;
    horoscope_fee: number;
    total_users: number;
    total_members: number;
  };
  recent_profiles?: MemberProfileItem[];
  recent_horoscopes?: HoroscopeOrderItem[];
}

interface MemberProfileItem {
  id: number;
  owner_user_id: number;
  profile_code: string;
  full_name_private: string;
  gender: string;
  birth_date: string;
  district: string;
  city?: string;
  country: string;
  religion: string;
  caste?: string;
  education_level: string;
  profession: string;
  employed_in?: string;
  monthly_income_lkr?: string;
  horoscope_available: boolean;
  primary_photo_url?: string;
  publication_status: 'approved' | 'pending_review' | 'rejected';
  family_background?: string;
  partner_preferences?: string;
  created_at: string;
  owner?: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface HoroscopeOrderItem {
  id: number;
  order_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  first_party_name: string;
  first_party_gender?: string;
  first_party_birth_datetime?: string;
  first_party_birth_place?: string;
  first_party_chart_file?: string;
  second_party_name: string;
  second_party_gender?: string;
  second_party_birth_datetime?: string;
  second_party_birth_place?: string;
  second_party_chart_file?: string;
  notes?: string;
  status: 'pending' | 'in_analysis' | 'completed' | 'cancelled';
  report_file_path?: string;
  created_at: string;
  payment_order?: {
    amount: number;
    payment_status: string;
    payment_method: string;
  };
}

interface BankSlipItem {
  id: number;
  payment_order_id: number;
  slip_file_path: string;
  bank_name: string;
  branch_name: string;
  deposit_date: string;
  reference_no?: string;
  verified_at?: string;
  verified_by_user_id?: number;
  created_at: string;
  payment_order?: {
    order_code: string;
    service_type: string;
    amount: number;
    payment_status: string;
    user?: {
      name: string;
      email: string;
      phone?: string;
    };
  };
}

interface UserItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'staff' | 'member';
  account_status: string;
  created_at: string;
  profile?: {
    profile_code: string;
    publication_status: string;
  };
}

export default function AdminPortalPage() {
  const { user, token, isAuthenticated, login, logout, isLoading } = useAuth();

  // Active Admin Tab & Mobile Sidebar
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profiles' | 'horoscope' | 'slips' | 'settings' | 'users'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login Gate State (for unauthenticated or non-admin users)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Profiles State
  const [profiles, setProfiles] = useState<MemberProfileItem[]>([]);
  const [profileSearch, setProfileSearch] = useState('');
  const [profileStatusFilter, setProfileStatusFilter] = useState('all');
  const [profileGenderFilter, setProfileGenderFilter] = useState('all');
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [selectedProfileModal, setSelectedProfileModal] = useState<MemberProfileItem | null>(null);

  // Horoscope Orders State
  const [horoscopes, setHoroscopes] = useState<HoroscopeOrderItem[]>([]);
  const [horoscopeSearch, setHoroscopeSearch] = useState('');
  const [horoscopeStatusFilter, setHoroscopeStatusFilter] = useState('all');
  const [loadingHoroscopes, setLoadingHoroscopes] = useState(false);
  const [selectedHoroscopeModal, setSelectedHoroscopeModal] = useState<HoroscopeOrderItem | null>(null);
  const [uploadReportFile, setUploadReportFile] = useState<File | null>(null);
  const [uploadingReport, setUploadingReport] = useState(false);

  // Bank Slips State
  const [slips, setSlips] = useState<BankSlipItem[]>([]);
  const [slipFilter, setSlipFilter] = useState<'all' | 'pending' | 'verified'>('pending');
  const [loadingSlips, setLoadingSlips] = useState(false);
  const [selectedSlipImage, setSelectedSlipImage] = useState<string | null>(null);

  // Settings State
  const [settingsDict, setSettingsDict] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);

  // Users State
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Action message toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isAdminOrStaff = useMemo(() => {
    return isAuthenticated && user && (user.role === 'admin' || user.role === 'staff');
  }, [isAuthenticated, user]);

  // Auth Gate submission
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const res = await login(loginEmail, loginPassword);
    setLoginLoading(false);

    if (!res.success) {
      setLoginError(res.message || 'Login failed. Please verify credentials.');
    }
  };

  // Helper headers
  const getAuthHeaders = useCallback(() => {
    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };
  }, [token]);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    if (!token || !isAdminOrStaff) return;
    setLoadingStats(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      console.log('Error fetching stats');
    } finally {
      setLoadingStats(false);
    }
  }, [token, isAdminOrStaff, getAuthHeaders]);

  // Fetch Profiles
  const fetchProfiles = useCallback(async () => {
    if (!token || !isAdminOrStaff) return;
    setLoadingProfiles(true);
    try {
      const params = new URLSearchParams();
      if (profileStatusFilter !== 'all') params.append('status', profileStatusFilter);
      if (profileGenderFilter !== 'all') params.append('gender', profileGenderFilter);
      if (profileSearch.trim()) params.append('search', profileSearch.trim());

      const res = await fetch(`${API_BASE_URL}/admin/profiles?${params.toString()}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.data || data);
      }
    } catch {
      console.log('Error loading profiles');
    } finally {
      setLoadingProfiles(false);
    }
  }, [token, isAdminOrStaff, profileStatusFilter, profileGenderFilter, profileSearch, getAuthHeaders]);

  // Update Profile Status (Approve / Reject)
  const handleUpdateProfileStatus = async (profileId: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/profiles/${profileId}/status`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        showToast(`Profile status updated to ${status.toUpperCase()}!`);
        fetchProfiles();
        fetchStats();
        if (selectedProfileModal?.id === profileId) {
          setSelectedProfileModal((prev) => prev ? { ...prev, publication_status: status } : null);
        }
      }
    } catch {
      alert('Error updating profile status');
    }
  };

  // Fetch Horoscope Orders
  const fetchHoroscopes = useCallback(async () => {
    if (!token || !isAdminOrStaff) return;
    setLoadingHoroscopes(true);
    try {
      const params = new URLSearchParams();
      if (horoscopeStatusFilter !== 'all') params.append('status', horoscopeStatusFilter);
      if (horoscopeSearch.trim()) params.append('search', horoscopeSearch.trim());

      const res = await fetch(`${API_BASE_URL}/admin/horoscope-orders?${params.toString()}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setHoroscopes(data.data || data);
      }
    } catch {
      console.log('Error loading horoscope orders');
    } finally {
      setLoadingHoroscopes(false);
    }
  }, [token, isAdminOrStaff, horoscopeStatusFilter, horoscopeSearch, getAuthHeaders]);

  // Update Horoscope Order Status / Upload Report
  const handleUpdateHoroscopeOrder = async (orderId: number, status: string, file?: File | null) => {
    setUploadingReport(true);
    try {
      const formData = new FormData();
      formData.append('status', status);
      if (file) {
        formData.append('report_file', file);
      }

      const res = await fetch(`${API_BASE_URL}/admin/horoscope-orders/${orderId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      if (res.ok) {
        showToast('Horoscope order updated successfully!');
        setUploadReportFile(null);
        setSelectedHoroscopeModal(null);
        fetchHoroscopes();
        fetchStats();
      }
    } catch {
      alert('Error updating horoscope order');
    } finally {
      setUploadingReport(false);
    }
  };

  // Fetch Bank Slips
  const fetchSlips = useCallback(async () => {
    if (!token || !isAdminOrStaff) return;
    setLoadingSlips(true);
    try {
      const params = new URLSearchParams();
      if (slipFilter !== 'all') params.append('filter', slipFilter);

      const res = await fetch(`${API_BASE_URL}/admin/bank-slips?${params.toString()}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSlips(data.data || data);
      }
    } catch {
      console.log('Error loading bank slips');
    } finally {
      setLoadingSlips(false);
    }
  }, [token, isAdminOrStaff, slipFilter, getAuthHeaders]);

  // Verify Bank Slip
  const handleVerifySlip = async (slipId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/bank-slips/${slipId}/verify`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        showToast('Bank slip verified and payment marked as PAID!');
        fetchSlips();
        fetchStats();
      }
    } catch {
      alert('Error verifying slip');
    }
  };

  // Fetch Settings
  const fetchSettings = useCallback(async () => {
    if (!token || !isAdminOrStaff) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSettingsDict(data.dictionary || {});
      }
    } catch {
      console.log('Error loading settings');
    }
  }, [token, isAdminOrStaff, getAuthHeaders]);

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(null);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsDict),
      });

      if (res.ok) {
        setSettingsSuccess('System settings saved successfully!');
        showToast('Settings updated!');
        fetchStats();
        setTimeout(() => setSettingsSuccess(null), 4000);
      }
    } catch {
      alert('Error saving settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    if (!token || !isAdminOrStaff) return;
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      if (userRoleFilter !== 'all') params.append('role', userRoleFilter);
      if (userSearch.trim()) params.append('search', userSearch.trim());

      const res = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.data || data);
      }
    } catch {
      console.log('Error loading users');
    } finally {
      setLoadingUsers(false);
    }
  }, [token, isAdminOrStaff, userRoleFilter, userSearch, getAuthHeaders]);

  // Trigger data load on tab change or auth status
  useEffect(() => {
    if (!isAdminOrStaff) return;

    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'profiles') {
      fetchProfiles();
    } else if (activeTab === 'horoscope') {
      fetchHoroscopes();
    } else if (activeTab === 'slips') {
      fetchSlips();
    } else if (activeTab === 'settings') {
      fetchSettings();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, isAdminOrStaff, fetchStats, fetchProfiles, fetchHoroscopes, fetchSlips, fetchSettings, fetchUsers]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8FA] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#AD3B65] border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-[#8E2E52]">Verifying Administrator Session...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATION GATE (NON-ADMIN / LOGGED OUT)
  // ==========================================
  if (!isAdminOrStaff) {
    return (
      <div className="min-h-[85vh] bg-gradient-to-b from-[#FFF8FA] via-[#FDF0F4] to-[#FAF5F0] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#C6A56B]/30 shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#AD3B65] via-[#942A50] to-[#731E3C] border-2 border-[#C6A56B] flex items-center justify-center mx-auto shadow-lg shadow-[#AD3B65]/25">
              <Heart className="w-8 h-8 text-[#C6A56B] fill-[#C6A56B]" />
            </div>
            <h1 className="text-2xl font-bold text-[#352A30] font-serif tracking-tight">
              ජයතු ජය • Admin Portal
            </h1>
            <p className="text-xs text-[#C6A56B] font-semibold uppercase tracking-widest">
              Authorized Agency Personnel Only
            </p>
          </div>

          {/* Unauthorized alert if member is logged in */}
          {isAuthenticated && user && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                You are currently signed in as <strong>{user.email}</strong> (Role: {user.role}). Administrator or Staff privileges are required.
              </div>
            </div>
          )}

          {/* Quick Demo Credentials */}
          <div className="p-3.5 rounded-2xl bg-[#FFF8FA] border border-[#F3DCE4] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#AD3B65] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#AD3B65]" />
                Demo Credentials:
              </span>
              <span className="text-[10px] text-stone-400 font-normal">Click to fill</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('admin@jayathujaya.lk');
                  setLoginPassword('admin123');
                }}
                className="p-2.5 rounded-xl bg-white border border-[#C6A56B]/30 hover:border-[#AD3B65] hover:shadow-sm text-left transition group"
              >
                <div className="font-bold text-[#352A30] group-hover:text-[#AD3B65]">Administrator</div>
                <div className="text-[11px] text-stone-500 font-mono truncate">admin@jayathujaya.lk</div>
                <div className="text-[10px] text-[#C6A56B] font-mono mt-0.5">PW: admin123</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginEmail('staff@jayathujaya.lk');
                  setLoginPassword('staff123');
                }}
                className="p-2.5 rounded-xl bg-white border border-[#C6A56B]/30 hover:border-[#AD3B65] hover:shadow-sm text-left transition group"
              >
                <div className="font-bold text-[#352A30] group-hover:text-[#AD3B65]">Staff / Astrologer</div>
                <div className="text-[11px] text-stone-500 font-mono truncate">staff@jayathujaya.lk</div>
                <div className="text-[10px] text-[#C6A56B] font-mono mt-0.5">PW: staff123</div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#352A30] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C6A56B]" /> Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@jayathujaya.lk"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:border-[#AD3B65] focus:ring-2 focus:ring-[#AD3B65]/20 outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#352A30] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C6A56B]" /> Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:border-[#AD3B65] focus:ring-2 focus:ring-[#AD3B65]/20 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] hover:from-[#BE3F6F] hover:to-[#AD3B65] shadow-lg shadow-[#AD3B65]/25 border border-[#C6A56B]/40 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#C6A56B]" /> Sign In to Admin Portal
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-stone-500 hover:text-[#AD3B65] transition inline-flex items-center gap-1">
              ← Return to Jayathu Jaya Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // FULL REACT + SHADCN ADMIN PORTAL UI
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FFF8FA] text-[#352A30] flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#352A30] text-white text-xs font-semibold shadow-2xl border border-[#C6A56B] flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white/95 backdrop-blur-md border-r border-[#F8E4EB] flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#F8E4EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#AD3B65] via-[#942A50] to-[#731E3C] border-2 border-[#C6A56B] flex items-center justify-center shadow-md shadow-[#AD3B65]/20 shrink-0">
              <Heart className="w-5 h-5 text-[#C6A56B] fill-[#C6A56B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-[#352A30] tracking-tight">
                  ජයතු ජය
                </span>
                <span className="text-[9px] font-bold text-white bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] px-2 py-0.5 rounded-full border border-[#C6A56B]/40 uppercase tracking-widest">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-[#C6A56B] font-semibold tracking-wider uppercase">
                මංගල සේවාව
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Free Mode Strip */}
        <div className="px-5 py-3 border-b border-[#F8E4EB]/60 bg-[#FFF8FA]/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">පද්ධති තත්ත්වය</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                stats?.metrics.is_free_mode
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-rose-50 text-rose-700 border-rose-300'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  stats?.metrics.is_free_mode ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
              {stats?.metrics.is_free_mode ? 'FREE REGISTRATION' : 'PAID MODE'}
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            ප්‍රධාන මෙනුව (Navigation)
          </div>
          {[
            { id: 'dashboard', label: 'දළ විශ්ලේෂණය (Dashboard)', icon: TrendingUp },
            { id: 'profiles', label: 'සාමාජික යෝජනා (Profiles)', icon: Users, badge: stats?.metrics.pending_profiles },
            { id: 'horoscope', label: 'කේන්ද්‍ර පරීක්ෂා (Horoscopes)', icon: Sparkles, badge: stats?.metrics.pending_horoscopes },
            { id: 'slips', label: 'බැංකු රිසිට්පත් (Bank Slips)', icon: Receipt, badge: stats?.metrics.pending_slips },
            { id: 'settings', label: 'පද්ධති සැකසුම් (Settings)', icon: Sliders },
            { id: 'users', label: 'පරිශීලකයන් (Users & Staff)', icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as typeof activeTab);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] text-white shadow-md shadow-[#AD3B65]/20 border border-[#C6A56B]/40'
                    : 'text-stone-600 hover:bg-rose-50/70 hover:text-[#AD3B65]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-[#C6A56B]' : 'text-stone-400 group-hover:text-[#AD3B65]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-[#C6A56B] text-stone-900' : 'bg-[#AD3B65] text-white shadow-xs'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#F8E4EB] bg-[#FFF8FA]/60 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-[#C6A56B]/40 bg-white hover:bg-[#FFF8FA] hover:border-[#AD3B65] text-xs font-bold text-[#AD3B65] transition shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>වෙබ් අඩවියට (Website)</span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#AD3B65] to-[#8E2E52] text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0 leading-tight">
                <div className="text-xs font-bold text-[#352A30] truncate">{user?.name}</div>
                <div className="text-[10px] text-stone-400 capitalize">{user?.role}</div>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-[#F8E4EB] px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-[#AD3B65] hover:bg-rose-50 transition border border-stone-200"
              aria-label="Open Sidebar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-[#352A30] font-serif">
                {activeTab === 'dashboard' && 'දළ විශ්ලේෂණය (Dashboard Overview)'}
                {activeTab === 'profiles' && 'සාමාජික යෝජනා කළමනාකරණය (Member Profiles)'}
                {activeTab === 'horoscope' && 'කේන්ද්‍ර පරීක්ෂා කළමනාකරණය (Horoscope Orders)'}
                {activeTab === 'slips' && 'බැංකු තැන්පතු පත්‍රිකා (Bank Slips Verification)'}
                {activeTab === 'settings' && 'පද්ධති සැකසුම් (System Settings & Free Mode)'}
                {activeTab === 'users' && 'පරිශීලක කළමනාකරණය (User Accounts & Staff)'}
              </h1>
              <p className="text-[10px] text-stone-400 font-sans hidden sm:block">
                Jayathu Jaya Matrimonial & Astrology • Management Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Refresh Button */}
            <button
              onClick={() => {
                fetchStats();
                if (activeTab === 'profiles') fetchProfiles();
                if (activeTab === 'horoscope') fetchHoroscopes();
                if (activeTab === 'slips') fetchSlips();
                if (activeTab === 'settings') fetchSettings();
                if (activeTab === 'users') fetchUsers();
              }}
              disabled={loadingStats}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-[#C6A56B] bg-white text-xs font-semibold text-stone-600 hover:text-[#AD3B65] transition flex items-center gap-1.5 shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin text-[#AD3B65]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {/* ==================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ==================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Metric Cards (shadcn Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Profiles */}
              <div 
                onClick={() => setActiveTab('profiles')}
                className="cursor-pointer bg-white rounded-2xl p-5 border border-[#C6A56B]/30 hover:border-[#AD3B65] shadow-sm hover:shadow-lg transition space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#AD3B65]">
                    මංගල යෝජනා (Profiles)
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#AD3B65] flex items-center justify-center group-hover:scale-110 transition">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#352A30] font-serif">
                    {stats?.metrics.total_profiles ?? 0}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">ලියාපදිංචි</span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>අනුමත: <strong className="text-emerald-600">{stats?.metrics.approved_profiles ?? 0}</strong></span>
                  <span>අනුමැතියට: <strong className="text-amber-600">{stats?.metrics.pending_profiles ?? 0}</strong></span>
                </div>
              </div>

              {/* Card 2: Horoscopes */}
              <div 
                onClick={() => setActiveTab('horoscope')}
                className="cursor-pointer bg-white rounded-2xl p-5 border border-[#C6A56B]/30 hover:border-[#AD3B65] shadow-sm hover:shadow-lg transition space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C6A56B]">
                    කේන්ද්‍ර පරීක්ෂා (Orders)
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#C6A56B] flex items-center justify-center group-hover:scale-110 transition">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#352A30] font-serif">
                    {stats?.metrics.total_horoscopes ?? 0}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">ඇණවුම්</span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>සමාලෝචනයට: <strong className="text-amber-600">{stats?.metrics.pending_horoscopes ?? 0}</strong></span>
                  <span>සම්පූර්ණ: <strong className="text-emerald-600">{stats?.metrics.completed_horoscopes ?? 0}</strong></span>
                </div>
              </div>

              {/* Card 3: Bank Slips */}
              <div 
                onClick={() => setActiveTab('slips')}
                className="cursor-pointer bg-white rounded-2xl p-5 border border-[#C6A56B]/30 hover:border-[#AD3B65] shadow-sm hover:shadow-lg transition space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    බැංකු රිසිට්පත් (Bank Slips)
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
                    <Receipt className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#352A30] font-serif">
                    {stats?.metrics.pending_slips ?? 0}
                  </span>
                  <span className="text-xs text-rose-600 font-medium">තහවුරු කිරීමට ඇත</span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>මුළු රිසිට්පත්: <strong>{stats?.metrics.total_slips ?? 0}</strong></span>
                  <span className="text-[#AD3B65] font-semibold group-hover:underline">පරීක්ෂා කරන්න →</span>
                </div>
              </div>

              {/* Card 4: System Pricing / Free Mode */}
              <div 
                onClick={() => setActiveTab('settings')}
                className="cursor-pointer bg-white rounded-2xl p-5 border border-[#C6A56B]/30 hover:border-[#AD3B65] shadow-sm hover:shadow-lg transition space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    ගාස්තු / මාදිලිය (Mode)
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-stone-100 text-[#352A30] flex items-center justify-center group-hover:scale-110 transition">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-xl font-extrabold ${stats?.metrics.is_free_mode ? 'text-emerald-600' : 'text-[#AD3B65]'}`}>
                    {stats?.metrics.is_free_mode ? 'FREE MODE' : `LKR ${stats?.metrics.registration_fee?.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>කේන්ද්‍ර ගාස්තුව: <strong>LKR {stats?.metrics.horoscope_fee?.toLocaleString()}</strong></span>
                  <span className="text-[#C6A56B] font-semibold">වෙනස් කරන්න ⚙</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Profiles */}
              <div className="bg-white rounded-3xl p-6 border border-[#C6A56B]/30 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#352A30]">අලුතින් ලියාපදිංචි වූ මංගල යෝජනා</h3>
                    <p className="text-xs text-stone-400">Recent Member Submissions</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('profiles')}
                    className="text-xs font-bold text-[#AD3B65] hover:underline"
                  >
                    සියල්ල බලන්න →
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {stats?.recent_profiles && stats.recent_profiles.length > 0 ? (
                    stats.recent_profiles.map((p) => (
                      <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.primary_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={p.profile_code}
                            className="w-10 h-10 rounded-full object-cover border border-[#C6A56B]/40"
                          />
                          <div>
                            <div className="font-bold text-[#352A30]">{p.profile_code} • {p.full_name_private}</div>
                            <div className="text-[11px] text-stone-400 capitalize">{p.gender} • {p.district} • {p.profession}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.publication_status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.publication_status === 'pending_review'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {p.publication_status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-stone-400">මංගල යෝජනා නොමැත</div>
                  )}
                </div>
              </div>

              {/* Recent Horoscope Orders */}
              <div className="bg-white rounded-3xl p-6 border border-[#C6A56B]/30 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#352A30]">මෑත කේන්ද්‍ර පරීක්ෂා ඇණවුම්</h3>
                    <p className="text-xs text-stone-400">Recent Horoscope Match Requests</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('horoscope')}
                    className="text-xs font-bold text-[#C6A56B] hover:underline"
                  >
                    සියල්ල බලන්න →
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {stats?.recent_horoscopes && stats.recent_horoscopes.length > 0 ? (
                    stats.recent_horoscopes.map((h) => (
                      <div key={h.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-[#352A30]">{h.order_code}</div>
                          <div className="text-[11px] text-stone-500">
                            {h.first_party_name} &amp; {h.second_party_name}
                          </div>
                          <div className="text-[10px] text-stone-400">පාරිභෝගික: {h.customer_name} ({h.customer_phone})</div>
                        </div>

                        <div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            h.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : h.status === 'in_analysis'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {h.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-stone-400">ඇණවුම් නොමැත</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: MEMBER PROFILES MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'profiles' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Controls */}
            <div className="bg-white rounded-3xl p-6 border border-[#C6A56B]/30 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#352A30]">සාමාජික මංගල යෝජනා කළමනාකරණය</h2>
                  <p className="text-xs text-stone-400">Review, verify, approve or reject member proposal cards</p>
                </div>

                <button
                  onClick={fetchProfiles}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 hover:border-[#AD3B65] text-xs font-semibold text-stone-600 hover:text-[#AD3B65] flex items-center gap-1.5 self-start transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> නැවත පූරණය කරන්න
                </button>
              </div>

              {/* Filters Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={profileSearch}
                    onChange={(e) => setProfileSearch(e.target.value)}
                    placeholder="Search Code, Name, District..."
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#AD3B65] outline-none"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={profileStatusFilter}
                  onChange={(e) => setProfileStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#AD3B65] outline-none"
                >
                  <option value="all">සියලුම තත්ත්ව (All Statuses)</option>
                  <option value="pending_review">සමාලෝචනයට බලාපොරොත්තු (Pending Review)</option>
                  <option value="approved">අනුමත වූ (Approved)</option>
                  <option value="rejected">ප්‍රතික්ෂේපිත (Rejected)</option>
                </select>

                {/* Gender Filter */}
                <select
                  value={profileGenderFilter}
                  onChange={(e) => setProfileGenderFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#AD3B65] outline-none"
                >
                  <option value="all">ස්ත්‍රී / පුරුෂ සියල්ල (All Genders)</option>
                  <option value="bride">මනමාලියන් (Brides)</option>
                  <option value="groom">මනමාලයන් (Grooms)</option>
                </select>
              </div>
            </div>

            {/* Profiles Data Table */}
            <div className="bg-white rounded-3xl border border-[#C6A56B]/30 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FFF8FA] border-b border-[#F3DCE4] text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">ඡායාරූපය</th>
                      <th className="py-3.5 px-4">අංකය / නම</th>
                      <th className="py-3.5 px-4">ස්ත්‍රී/පුරුෂ</th>
                      <th className="py-3.5 px-4">ප්‍රදේශය</th>
                      <th className="py-3.5 px-4">රැකියාව / අධ්‍යාපනය</th>
                      <th className="py-3.5 px-4">තත්ත්වය</th>
                      <th className="py-3.5 px-4 text-right">ක්‍රියාමාර්ග (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loadingProfiles ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#AD3B65]" />
                          යෝජනා පූරණය වෙමින් පවතී...
                        </td>
                      </tr>
                    ) : profiles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          ගැළපෙන මංගල යෝජනා කිසිවක් හමු නොවීය.
                        </td>
                      </tr>
                    ) : (
                      profiles.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FFF8FA]/60 transition">
                          <td className="py-3 px-4">
                            <img
                              src={p.primary_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                              alt={p.profile_code}
                              className="w-10 h-10 rounded-full object-cover border-2 border-[#C6A56B]/40 shadow-sm"
                            />
                          </td>
                          <td className="py-3 px-4 font-medium">
                            <span className="font-bold text-[#AD3B65] text-xs font-mono">{p.profile_code}</span>
                            <div className="text-stone-800 font-bold">{p.full_name_private}</div>
                            <div className="text-[10px] text-stone-400">Owner: {p.owner?.name || p.owner?.email}</div>
                          </td>
                          <td className="py-3 px-4 capitalize">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.gender === 'groom' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                            }`}>
                              {p.gender}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold">{p.district}</div>
                            <div className="text-[10px] text-stone-400">{p.city ? `${p.city}, ` : ''}{p.country}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold">{p.profession}</div>
                            <div className="text-[10px] text-stone-400">{p.education_level}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              p.publication_status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : p.publication_status === 'pending_review'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              {p.publication_status === 'approved' ? 'Approved (අනුමතයි)' : p.publication_status === 'pending_review' ? 'Pending (සමාලෝචනයට)' : 'Rejected (ප්‍රතික්ෂේපිත)'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                            {/* View Dialog Button */}
                            <button
                              onClick={() => setSelectedProfileModal(p)}
                              className="px-2.5 py-1 rounded-lg border border-stone-200 hover:border-[#AD3B65] text-stone-600 hover:text-[#AD3B65] transition"
                            >
                              විස්තර (View)
                            </button>

                            {/* Approve */}
                            {p.publication_status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateProfileStatus(p.id, 'approved')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition"
                              >
                                Approve ✓
                              </button>
                            )}

                            {/* Reject */}
                            {p.publication_status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateProfileStatus(p.id, 'rejected')}
                                className="px-2 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium transition"
                              >
                                Reject ✕
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Profile Full View Modal (shadcn Dialog style) */}
            {selectedProfileModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-[#C6A56B] my-8 animate-fadeIn">
                  <div className="flex items-start justify-between pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={selectedProfileModal.primary_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={selectedProfileModal.profile_code}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C6A56B]"
                      />
                      <div>
                        <div className="text-xs font-mono font-bold text-[#AD3B65]">{selectedProfileModal.profile_code}</div>
                        <h3 className="font-serif font-bold text-xl text-[#352A30]">{selectedProfileModal.full_name_private}</h3>
                        <p className="text-xs text-stone-400 capitalize">{selectedProfileModal.gender} • {selectedProfileModal.district}, {selectedProfileModal.country}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProfileModal(null)}
                      className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block">ආගම සහ කුලය:</span>
                      <strong className="text-[#352A30]">{selectedProfileModal.religion} {selectedProfileModal.caste ? `(${selectedProfileModal.caste})` : ''}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">උපන් දිනය:</span>
                      <strong className="text-[#352A30]">{selectedProfileModal.birth_date}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">අධ්‍යාපනය:</span>
                      <strong className="text-[#352A30]">{selectedProfileModal.education_level}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">රැකියාව සහ අංශය:</span>
                      <strong className="text-[#352A30]">{selectedProfileModal.profession} ({selectedProfileModal.employed_in || 'Private'})</strong>
                    </div>
                  </div>

                  {/* Family background */}
                  {selectedProfileModal.family_background && (
                    <div className="p-3.5 rounded-2xl bg-[#FFF8FA] border border-[#F3DCE4] text-xs space-y-1">
                      <span className="font-bold text-[#AD3B65] block uppercase text-[10px] tracking-wider">පවුලේ තොරතුරු (Family Background):</span>
                      <p className="text-stone-700 leading-relaxed">{selectedProfileModal.family_background}</p>
                    </div>
                  )}

                  {/* Partner Preferences */}
                  {selectedProfileModal.partner_preferences && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                      <span className="font-bold text-[#C6A56B] block uppercase text-[10px] tracking-wider">අපේක්ෂිත සහකරු/සහකාරිය (Preferences):</span>
                      <p className="text-stone-700 leading-relaxed">{selectedProfileModal.partner_preferences}</p>
                    </div>
                  )}

                  {/* Modal Actions */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setSelectedProfileModal(null)}
                      className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                    >
                      Close
                    </button>
                    {selectedProfileModal.publication_status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateProfileStatus(selectedProfileModal.id, 'rejected')}
                        className="px-4 py-2 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50"
                      >
                        Reject Profile
                      </button>
                    )}
                    {selectedProfileModal.publication_status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateProfileStatus(selectedProfileModal.id, 'approved')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-600/20"
                      >
                        Approve Profile ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: HOROSCOPE MATCHING ORDERS */}
        {/* ==================================================== */}
        {activeTab === 'horoscope' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 border border-[#C6A56B]/30 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#352A30]">කේන්ද්‍ර පරීක්ෂා ඇණවුම් කළමනාකරණය</h2>
                  <p className="text-xs text-stone-400">View chart scan uploads, process orders, and upload signed PDF reports</p>
                </div>
                <button
                  onClick={fetchHoroscopes}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 hover:border-[#AD3B65] text-xs font-semibold text-stone-600 hover:text-[#AD3B65] flex items-center gap-1.5 self-start transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> නැවත පූරණය
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={horoscopeSearch}
                    onChange={(e) => setHoroscopeSearch(e.target.value)}
                    placeholder="Search Order Code, Customer Name, Phone..."
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#AD3B65] outline-none"
                  />
                </div>
                <select
                  value={horoscopeStatusFilter}
                  onChange={(e) => setHoroscopeStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#AD3B65] outline-none"
                >
                  <option value="all">සියලුම ඇණවුම් (All Orders)</option>
                  <option value="pending">පොරොත්තුවේ ඇති (Pending)</option>
                  <option value="in_analysis">පරීක්ෂා කෙරෙමින් පවතින (In Analysis)</option>
                  <option value="completed">සම්පූර්ණ කළ (Completed)</option>
                  <option value="cancelled">අවලංගු කළ (Cancelled)</option>
                </select>
              </div>
            </div>

            {/* Horoscope Orders Table */}
            <div className="bg-white rounded-3xl border border-[#C6A56B]/30 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FFF8FA] border-b border-[#F3DCE4] text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">ඇණවුම් අංකය</th>
                      <th className="py-3.5 px-4">පාරිභෝගිකයා</th>
                      <th className="py-3.5 px-4">මනමාලිය / මනමාලයා</th>
                      <th className="py-3.5 px-4">කේන්ද්‍ර කොළ (Charts)</th>
                      <th className="py-3.5 px-4">තත්ත්වය (Status)</th>
                      <th className="py-3.5 px-4 text-right">වාර්තාව (Report) / ක්‍රියාමාර්ග</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loadingHoroscopes ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#C6A56B]" />
                          ඇණවුම් පූරණය වෙමින් පවතී...
                        </td>
                      </tr>
                    ) : horoscopes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400">
                          කේන්ද්‍ර පරීක්ෂා ඇණවුම් කිසිවක් හමු නොවීය.
                        </td>
                      </tr>
                    ) : (
                      horoscopes.map((h) => (
                        <tr key={h.id} className="hover:bg-[#FFF8FA]/60 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#AD3B65]">
                            {h.order_code}
                            <div className="text-[10px] text-stone-400 font-sans font-normal">
                              {new Date(h.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#352A30]">{h.customer_name}</div>
                            <div className="text-[10px] text-stone-500">{h.customer_phone}</div>
                            <div className="text-[10px] text-stone-400">{h.customer_email}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-stone-800 font-medium">1. {h.first_party_name}</div>
                            <div className="text-stone-800 font-medium">2. {h.second_party_name}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1">
                              {h.first_party_chart_file ? (
                                <a
                                  href={`http://127.0.0.1:8000/storage/${h.first_party_chart_file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-[#AD3B65] font-semibold hover:underline flex items-center gap-1"
                                >
                                  <FileText className="w-3 h-3" /> Party 1 Chart ↗
                                </a>
                              ) : (
                                <span className="text-stone-400 text-[10px]">No Chart 1</span>
                              )}
                              {h.second_party_chart_file ? (
                                <a
                                  href={`http://127.0.0.1:8000/storage/${h.second_party_chart_file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-[#C6A56B] font-semibold hover:underline flex items-center gap-1"
                                >
                                  <FileText className="w-3 h-3" /> Party 2 Chart ↗
                                </a>
                              ) : (
                                <span className="text-stone-400 text-[10px]">No Chart 2</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              h.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : h.status === 'in_analysis'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {h.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            {/* Manage & Upload Report */}
                            <button
                              onClick={() => setSelectedHoroscopeModal(h)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] text-white font-bold hover:shadow-md transition inline-flex items-center gap-1.5"
                            >
                              <Upload className="w-3 h-3 text-[#C6A56B]" /> වාර්තාව / Status
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Horoscope Order Process Modal */}
            {selectedHoroscopeModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-[#C6A56B] animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#AD3B65]">{selectedHoroscopeModal.order_code}</span>
                      <h3 className="font-serif font-bold text-lg text-[#352A30]">ජ්‍යොතිෂ වාර්තාව හා තත්ත්වය</h3>
                    </div>
                    <button onClick={() => setSelectedHoroscopeModal(null)}>
                      <X className="w-5 h-5 text-stone-400" />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="text-stone-400 block mb-1">Status වෙනස් කිරීම:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['pending', 'in_analysis', 'completed'].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleUpdateHoroscopeOrder(selectedHoroscopeModal.id, st)}
                            className={`py-2 px-3 rounded-xl border text-center font-bold capitalize transition ${
                              selectedHoroscopeModal.status === st
                                ? 'bg-[#AD3B65] text-white border-[#AD3B65]'
                                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            {st.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      <span className="text-stone-400 block font-semibold">ජ්‍යොතිෂ වාර්තාව (Astrologer Report PDF/Image) Upload කිරීම:</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setUploadReportFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FFF8FA] file:text-[#AD3B65] hover:file:bg-[#F8E4EB]"
                      />
                      <p className="text-[10px] text-stone-400">PDF හෝ ඡායාරූපයක් තෝරා පහත බොත්තම ඔබන්න. එය ස්වයංක්‍රීයව පාරිභෝගිකයාගේ Tracking පිටුවට ලැබෙනු ඇත.</p>

                      <button
                        type="button"
                        disabled={!uploadReportFile || uploadingReport}
                        onClick={() => handleUpdateHoroscopeOrder(selectedHoroscopeModal.id, 'completed', uploadReportFile)}
                        className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-40 transition flex items-center justify-center gap-1.5"
                      >
                        {uploadingReport ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        වාර්තාව Upload කර Completed කරන්න
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: BANK SLIPS & FINANCIAL VERIFICATION */}
        {/* ==================================================== */}
        {activeTab === 'slips' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 border border-[#C6A56B]/30 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#352A30]">බැංකු රිසිට්පත් සහ ගෙවීම් තහවුරු කිරීම</h2>
                  <p className="text-xs text-stone-400">Review deposited slips, verify references, and activate accounts/orders</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-xl border border-stone-200 p-0.5 bg-stone-50 text-xs">
                    {(['pending', 'verified', 'all'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setSlipFilter(f)}
                        className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${
                          slipFilter === f ? 'bg-white text-[#AD3B65] shadow-sm' : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        {f === 'pending' ? 'තහවුරු කිරීමට (Pending)' : f === 'verified' ? 'තහවුරු කළ (Verified)' : 'සියල්ල (All)'}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={fetchSlips}
                    className="p-2 rounded-xl border border-stone-200 hover:border-[#AD3B65] text-stone-600"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Slips Cards Grid */}
            {loadingSlips ? (
              <div className="py-16 text-center text-stone-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#AD3B65]" />
                බැංකු රිසිට්පත් පූරණය වෙමින් පවතී...
              </div>
            ) : slips.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-stone-400 border border-[#C6A56B]/30">
                <Receipt className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                තහවුරු කිරීමට බැංකු රිසිට්පත් නොමැත.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slips.map((slip) => {
                  const isVerified = Boolean(slip.verified_at);
                  const slipUrl = `http://127.0.0.1:8000/storage/${slip.slip_file_path}`;

                  return (
                    <div
                      key={slip.id}
                      className="bg-white rounded-3xl p-5 border border-[#C6A56B]/30 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Slip Image thumbnail */}
                        <div
                          onClick={() => setSelectedSlipImage(slipUrl)}
                          className="cursor-pointer h-44 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative group"
                        >
                          <img
                            src={slipUrl}
                            alt="Bank Slip"
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5">
                            <Eye className="w-4 h-4" /> Click to Zoom
                          </div>
                        </div>

                        {/* Order info */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-[#AD3B65]">
                            {slip.payment_order?.order_code || `Slip #${slip.id}`}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isVerified ? 'Verified ✓' : 'Awaiting Approval'}
                          </span>
                        </div>

                        {/* Bank Details */}
                        <div className="space-y-1 text-xs">
                          <div className="text-stone-800 font-bold">{slip.bank_name} • {slip.branch_name}</div>
                          <div className="text-stone-500">Ref / Slip No: <span className="font-mono">{slip.reference_no || 'N/A'}</span></div>
                          <div className="text-stone-500">Deposit Date: {slip.deposit_date}</div>
                          <div className="text-stone-500">User: {slip.payment_order?.user?.name || slip.payment_order?.user?.email}</div>
                          <div className="text-base font-extrabold text-[#352A30] font-serif pt-1">
                            LKR {slip.payment_order?.amount?.toLocaleString() || '0'}
                          </div>
                        </div>
                      </div>

                      {/* Verify Action Button */}
                      <div className="pt-3 border-t border-stone-100">
                        {isVerified ? (
                          <div className="text-center text-[11px] font-bold text-emerald-700 py-1.5">
                            ✓ Verified on {new Date(slip.verified_at!).toLocaleDateString()}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleVerifySlip(slip.id)}
                            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle className="w-4 h-4 text-[#C6A56B]" /> Approve &amp; Verify Payment
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Slip Zoom Modal */}
            {selectedSlipImage && (
              <div 
                onClick={() => setSelectedSlipImage(null)}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
              >
                <div className="max-w-4xl max-h-[90vh] overflow-auto rounded-2xl bg-white p-2">
                  <img src={selectedSlipImage} alt="Bank Slip Full" className="max-w-full max-h-[85vh] object-contain mx-auto" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: SYSTEM SETTINGS & PRICING */}
        {/* ==================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 border border-[#C6A56B]/30 shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-xl font-bold font-serif text-[#352A30]">පද්ධති සැකසුම් සහ ගාස්තු පාලනය</h2>
                <p className="text-xs text-stone-400">Configure Free Mode, pricing, contact details, and bank deposit instructions</p>
              </div>

              {settingsSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  {settingsSuccess}
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
                {/* Free Mode Toggle */}
                <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F3DCE4] flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <span className="font-bold text-sm text-[#AD3B65] block">නොමිලේ ලියාපදිංචිය (Free Mode)</span>
                    <p className="text-stone-500">
                      මෙය සක්‍රීය කළ විට සාමාජිකයින්ට මුදල් ගෙවීමකින් තොරව ලියාපදිංචි විය හැක. අක්‍රීය කළ විට Registration Fee අය කෙරේ.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settingsDict['registration_payment_required'] === 'false'}
                      onChange={(e) => {
                        setSettingsDict((prev) => ({
                          ...prev,
                          registration_payment_required: e.target.checked ? 'false' : 'true',
                        }));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>

                {/* Registration Fee */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">ලියාපදිංචි ගාස්තුව (Registration Fee in LKR):</label>
                  <input
                    type="number"
                    value={settingsDict['registration_fee_lkr'] || '3500'}
                    onChange={(e) => setSettingsDict((prev) => ({ ...prev, registration_fee_lkr: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#AD3B65] outline-none text-sm font-bold font-mono"
                  />
                </div>

                {/* Horoscope Matching Fee */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">කේන්ද්‍ර පරීක්ෂා ගාස්තුව (Horoscope Match Fee in LKR):</label>
                  <input
                    type="number"
                    value={settingsDict['horoscope_fee_lkr'] || '2500'}
                    onChange={(e) => setSettingsDict((prev) => ({ ...prev, horoscope_fee_lkr: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#AD3B65] outline-none text-sm font-bold font-mono"
                  />
                </div>

                {/* Agency Hotline Phone */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">ආයතනික ක්ෂණික දුරකථන අංකය (Agency Hotline):</label>
                  <input
                    type="text"
                    value={settingsDict['agency_phone'] || '+94 77 123 4567'}
                    onChange={(e) => setSettingsDict((prev) => ({ ...prev, agency_phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#AD3B65] outline-none text-sm font-mono"
                  />
                </div>

                {/* Agency Email */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">ආයතනික ඊමේල් ලිපිනය (Agency Email):</label>
                  <input
                    type="email"
                    value={settingsDict['agency_email'] || 'info@jayathujaya.lk'}
                    onChange={(e) => setSettingsDict((prev) => ({ ...prev, agency_email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#AD3B65] outline-none text-sm"
                  />
                </div>

                {/* Bank Deposit Details */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">බැංකු ගිණුම් විස්තර (Bank Deposit Instructions for Slips):</label>
                  <textarea
                    rows={4}
                    value={settingsDict['agency_bank_details'] || ''}
                    onChange={(e) => setSettingsDict((prev) => ({ ...prev, agency_bank_details: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#AD3B65] outline-none font-mono text-xs leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] text-white font-bold text-sm shadow-lg shadow-[#AD3B65]/25 border border-[#C6A56B]/40 hover:from-[#BE3F6F] hover:to-[#AD3B65] transition flex items-center justify-center gap-2"
                >
                  {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 text-[#C6A56B]" />}
                  සැකසුම් සුරකින්න (Save Settings)
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 6: USERS & STAFF MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 border border-[#C6A56B]/30 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#352A30]">පරිශීලක සහ කාර්ය මණ්ඩල ගිණුම්</h2>
                  <p className="text-xs text-stone-400">Manage administrator, astrologer staff, and member profiles</p>
                </div>
                <button
                  onClick={fetchUsers}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 hover:border-[#AD3B65] text-xs font-semibold text-stone-600 hover:text-[#AD3B65] flex items-center gap-1.5 self-start transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> නැවත පූරණය
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search Name, Email, Phone..."
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#AD3B65] outline-none"
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#AD3B65] outline-none"
                >
                  <option value="all">සියලුම භූමිකාවන් (All Roles)</option>
                  <option value="admin">Administrator</option>
                  <option value="staff">Staff / Astrologer</option>
                  <option value="member">Member (සාමාජික)</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-[#C6A56B]/30 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FFF8FA] border-b border-[#F3DCE4] text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">නම</th>
                      <th className="py-3.5 px-4">ඊමේල් ලිපිනය</th>
                      <th className="py-3.5 px-4">දුරකථන අංකය</th>
                      <th className="py-3.5 px-4">භූමිකාව (Role)</th>
                      <th className="py-3.5 px-4">තත්ත්වය (Status)</th>
                      <th className="py-3.5 px-4">ලියාපදිංචි දිනය</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#AD3B65]" />
                          පරිශීලකයන් පූරණය වෙමින් පවතී...
                        </td>
                      </tr>
                    ) : usersList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400">
                          පරිශීලකයන් කිසිවක් හමු නොවීය.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-[#FFF8FA]/60 transition">
                          <td className="py-3.5 px-4 font-bold text-[#352A30] flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-700 font-bold text-[11px] flex items-center justify-center">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                            {u.name}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-stone-600">{u.email}</td>
                          <td className="py-3.5 px-4 font-mono text-stone-500">{u.phone || '-'}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : u.role === 'staff'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.account_status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'
                            }`}>
                              {u.account_status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-400">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
