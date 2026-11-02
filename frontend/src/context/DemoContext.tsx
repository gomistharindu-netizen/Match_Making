'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MatrimonialProfile, mockProfiles } from '../data/mockProfiles';

export type UserRole = 'visitor' | 'member';

export interface PhotoRequestItem {
  id: number;
  requester_name?: string;
  requester_code?: string;
  target_code?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface BadgeCounts {
  unread_messages: number;
  pending_interests: number;
  pending_photo_requests: number;
  total: number;
}

interface DemoContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  freeModeActive: boolean;
  setFreeModeActive: (active: boolean) => void;
  profiles: MatrimonialProfile[];
  selectedProfile: MatrimonialProfile | null;
  setSelectedProfile: (profile: MatrimonialProfile | null) => void;
  sendInterest: (profileId: string) => void;
  unlockContact: (profileId: string) => void;
  showInViewerLists: boolean;
  setShowInViewerLists: (val: boolean) => void;
  registrationFee: number;
  setRegistrationFee: (fee: number) => void;
  horoscopeFee: number;
  setHoroscopeFee: (fee: number) => void;
  isLiveDb: boolean;
  refetchProfiles: () => Promise<void>;
  shortlistedCodes: string[];
  isShortlisted: (code: string) => boolean;
  toggleShortlist: (code: string) => Promise<boolean>;
  blockedCodes: string[];
  blockUser: (code: string) => Promise<{ success: boolean; message: string }>;
  unblockUser: (code: string) => Promise<{ success: boolean; message: string }>;
  reportUser: (code: string, reason: string, description: string) => Promise<{ success: boolean; message: string }>;
  requestedPhotoCodes: string[];
  isPhotoRequested: (code: string) => boolean;
  requestPhotoAccess: (code: string) => Promise<{ success: boolean; message: string }>;
  photoRequests: { received: PhotoRequestItem[]; sent: PhotoRequestItem[] };
  fetchPhotoRequests: () => Promise<void>;
  respondPhotoRequest: (requestId: number, action: 'approved' | 'rejected') => Promise<{ success: boolean; message: string }>;
  badgeCounts: BadgeCounts;
  refreshBadgeCounts: () => Promise<void>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const DemoContext = createContext<DemoContextType | undefined>(undefined);

function mapManagedBy(type?: string): 'Mother' | 'Father' | 'Self' | 'Guardian' {
  if (!type) return 'Self';
  const lower = type.toLowerCase();
  if (lower.includes('mother')) return 'Mother';
  if (lower.includes('father')) return 'Father';
  if (lower.includes('guardian') || lower.includes('parent') || lower.includes('relative') || lower.includes('sibling')) return 'Guardian';
  return 'Self';
}

// Transform Laravel Database Profile to MatrimonialProfile format
function mapDbProfileToUi(p: Record<string, any>): MatrimonialProfile {
  const isOverseas = p.district === 'Overseas' || (p.country && p.country !== 'Sri Lanka');
  const heightStr = p.height_feet ? `${p.height_feet}' ${p.height_inches || 0}"` : "5' 8\"";
  const managedBy = mapManagedBy(p.managed_by_type);

  return {
    id: `db-${p.id}`,
    code: p.profile_code,
    gender: p.gender === 'groom' ? 'groom' : 'bride',
    age: p.age || 28,
    height: heightStr,
    location: p.city ? `${p.city}, ${p.district}` : p.district,
    country: p.country || 'Sri Lanka',
    isOverseas: isOverseas,
    religion: p.religion || 'Buddhist',
    casteSubcaste: p.caste || 'Govigama',
    education: p.education_level || 'Graduate',
    educationDetails: p.education_level || 'University Degree',
    occupation: p.profession || 'Professional',
    workplace: p.employed_in ? `${p.employed_in} Sector` : 'Private Sector',
    monthlyIncome: p.monthly_income_lkr || undefined,
    maritalStatus: 'Never Married',
    managedBy: managedBy,
    photoUrl: p.primary_photo_url || (p.gender === 'groom'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80'),
    photoIsPrivate: Boolean(p.photo_is_private),
    photoVisibility: p.photo_visibility || 'public',
    professionCategory: p.profession_category,
    habitsSmoking: p.habits_smoking,
    habitsDrinking: p.habits_drinking,
    dietaryHabits: p.dietary_habits,
    horoscopeAvailable: p.horoscope_available ?? true,
    rashi: p.rashi || (p.gender === 'groom' ? 'Kanya (කන්‍යා)' : 'Mesha (මේෂ)'),
    nekatha: p.nekatha || (p.gender === 'groom' ? 'Hastha (හත)' : 'Rohini (රෙහෙණ)'),
    porondamScore: 19,
    aboutCandidate: {
      en: p.family_background || `${p.profession} residing in ${p.district}. Well-mannered and family-oriented.`,
      si: p.family_background || `${p.district} පදිංචි ${p.profession}. චරිතවත්, ගුණගරුක පවුල් පසුබිමක් සහිතයි.`,
    },
    familyDetails: {
      en: p.family_background || 'Respectable Buddhist family from Sri Lanka.',
      si: p.family_background || 'ශ්‍රී ලංකාවේ ගෞරවනීය බෞද්ධ පවුල් පසුබිමක් සහිතයි.',
    },
    partnerPreferences: {
      en: p.partner_preferences || 'Seeking an educated, compatible partner with traditional values.',
      si: p.partner_preferences || 'උගත්, ගුණගරුක සහ යහපත් පවුල් පසුබිමක් සහිත සහකරුවෙකු අපේක්ෂා කරයි.',
    },
    privateContacts: {
      fullName: p.profile_code,
      phone: 'Protected (Owner approval required)',
      whatsapp: 'Protected',
      email: 'Protected',
      contactPerson: managedBy,
      relationship: managedBy,
      address: p.district,
    },
    interestStatus: 'none',
    contactReleased: false,
  };
}

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('member');
  const [freeModeActive, setFreeModeActive] = useState<boolean>(true);
  const [profiles, setProfiles] = useState<MatrimonialProfile[]>(mockProfiles);
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  const [showInViewerLists, setShowInViewerLists] = useState<boolean>(true);
  const [registrationFee, setRegistrationFee] = useState<number>(3500);
  const [horoscopeFee, setHoroscopeFee] = useState<number>(2500);
  const [isLiveDb, setIsLiveDb] = useState<boolean>(false);
  const [shortlistedCodes, setShortlistedCodes] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('jj_shortlisted_codes');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [blockedCodes, setBlockedCodes] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('jj_blocked_codes');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [requestedPhotoCodes, setRequestedPhotoCodes] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('jj_requested_photo_codes');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [photoRequests, setPhotoRequests] = useState<{ received: PhotoRequestItem[]; sent: PhotoRequestItem[] }>({
    received: [],
    sent: [],
  });
  const [badgeCounts, setBadgeCounts] = useState<BadgeCounts>({
    unread_messages: 0,
    pending_interests: 0,
    pending_photo_requests: 0,
    total: 0,
  });

  // Fetch Settings & Profiles from live Backend API
  const fetchLiveContent = async () => {
    try {
      // 1. Fetch System Settings
      const settingsRes = await fetch(`${API_BASE_URL}/public/settings`);
      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        setFreeModeActive(!settings.registration_payment_required);
        if (settings.registration_fee_lkr) setRegistrationFee(settings.registration_fee_lkr);
        if (settings.horoscope_fee_lkr) setHoroscopeFee(settings.horoscope_fee_lkr);
      }

      // 2. Fetch Live Profiles
      const profilesRes = await fetch(`${API_BASE_URL}/public/profiles?per_page=50`);
      if (profilesRes.ok) {
        const resData = await profilesRes.json();
        const dbItems = resData.data || [];
        if (Array.isArray(dbItems) && dbItems.length > 0) {
          const mapped = dbItems.map(mapDbProfileToUi);
          setProfiles(mapped);
          setIsLiveDb(true);
        }
      }
    } catch {
      // Backend temporarily offline, fallback to mockProfiles
      console.log('Backend API offline or unreachable, using default mock data');
    }
  };

  useEffect(() => {
    fetchLiveContent();
  }, []);

  const refetchProfiles = async () => {
    await fetchLiveContent();
  };

  const sendInterest = async (profileId: string) => {
    // Optimistic UI update
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          return {
            ...p,
            interestStatus: p.interestStatus === 'pending' ? 'none' : 'pending',
          };
        }
        return p;
      })
    );

    // Call backend API if user is authenticated
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jj_auth_token') : null;
      const target = profiles.find((p) => p.id === profileId);
      if (token && target?.code) {
        await fetch(`${API_BASE_URL}/member/interests`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ target_profile_code: target.code }),
        });
      }
    } catch {}
  };

  const unlockContact = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          return {
            ...p,
            contactReleased: !p.contactReleased,
          };
        }
        return p;
      })
    );
  };

  const isShortlisted = (code: string) => shortlistedCodes.includes(code);

  const toggleShortlist = async (code: string): Promise<boolean> => {
    const willBeShortlisted = !shortlistedCodes.includes(code);
    const updated = willBeShortlisted
      ? [...shortlistedCodes, code]
      : shortlistedCodes.filter((c) => c !== code);

    setShortlistedCodes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jj_shortlisted_codes', JSON.stringify(updated));
    }

    // Call API if token exists
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jj_auth_token') : null;
      if (token) {
        await fetch(`${API_BASE_URL}/member/shortlist/${code}`, {
          method: willBeShortlisted ? 'POST' : 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
      }
    } catch {
      // Local state is preserved
    }

    return willBeShortlisted;
  };

  const blockUser = async (code: string): Promise<{ success: boolean; message: string }> => {
    const updated = [...new Set([...blockedCodes, code])];
    setBlockedCodes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jj_blocked_codes', JSON.stringify(updated));
    }

    // Remove from active profiles list in UI
    setProfiles((prev) => prev.filter((p) => p.code !== code));

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jj_auth_token') : null;
      if (token) {
        const res = await fetch(`${API_BASE_URL}/member/block/${code}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const data = await res.json();
        return { success: res.ok, message: data.message || 'User blocked' };
      }
    } catch {
      // Fallback
    }
    return { success: true, message: 'User blocked successfully' };
  };

  const unblockUser = async (code: string): Promise<{ success: boolean; message: string }> => {
    const updated = blockedCodes.filter((c) => c !== code);
    setBlockedCodes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jj_blocked_codes', JSON.stringify(updated));
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jj_auth_token') : null;
      if (token) {
        const res = await fetch(`${API_BASE_URL}/member/unblock/${code}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const data = await res.json();
        return { success: res.ok, message: data.message || 'User unblocked' };
      }
    } catch {}
    return { success: true, message: 'User unblocked successfully' };
  };

  const reportUser = async (code: string, reason: string, description: string): Promise<{ success: boolean; message: string }> => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jj_auth_token') : null;
      if (token) {
        const res = await fetch(`${API_BASE_URL}/member/report/${code}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ reason_category: reason, description }),
        });
        const data = await res.json();
        return { success: res.ok, message: data.message || 'Report submitted' };
      }
    } catch {}
    return { success: true, message: 'Report submitted for review by agency moderators' };
  };

  const isPhotoRequested = (code: string) => requestedPhotoCodes.includes(code);

  const requestPhotoAccess = async (code: string): Promise<{ success: boolean; message: string }> => {
    const next = [...requestedPhotoCodes, code];
    setRequestedPhotoCodes(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jj_requested_photo_codes', JSON.stringify(next));
    }
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jj_auth_token') : null;
      if (token) {
        const res = await fetch(`${API_BASE_URL}/member/photo-access/${code}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const data = await res.json();
        await fetchPhotoRequests();
        return { success: res.ok, message: data.message || 'Photo access requested' };
      }
    } catch {}
    return { success: true, message: 'Photo access request sent to candidate successfully' };
  };

  const fetchPhotoRequests = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jj_auth_token') : null;
      if (token) {
        const res = await fetch(`${API_BASE_URL}/member/photo-access-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setPhotoRequests({
            received: data.received || [],
            sent: data.sent || [],
          });
        }
      }
    } catch {}
  };

  const respondPhotoRequest = async (requestId: number, action: 'approved' | 'rejected'): Promise<{ success: boolean; message: string }> => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jj_auth_token') : null;
      if (token) {
        const res = await fetch(`${API_BASE_URL}/member/photo-access/${requestId}/respond`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ status: action }),
        });
        const data = await res.json();
        await fetchPhotoRequests();
        await refreshBadgeCounts();
        return { success: res.ok, message: data.message || `Request ${action}` };
      }
    } catch {}
    setPhotoRequests(prev => ({
      ...prev,
      received: prev.received.map(r => r.id === requestId ? { ...r, status: action } : r),
    }));
    return { success: true, message: `Photo request ${action} successfully` };
  };

  const refreshBadgeCounts = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jj_auth_token') : null;
      if (token) {
        const res = await fetch(`${API_BASE_URL}/member/badge-counts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBadgeCounts(data);
        }
      }
    } catch {}
  };

  useEffect(() => {
    refreshBadgeCounts();
    fetchPhotoRequests();
    const interval = setInterval(() => {
      refreshBadgeCounts();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DemoContext.Provider
      value={{
        role,
        setRole,
        freeModeActive,
        setFreeModeActive,
        profiles,
        selectedProfile,
        setSelectedProfile,
        sendInterest,
        unlockContact,
        showInViewerLists,
        setShowInViewerLists,
        registrationFee,
        setRegistrationFee,
        horoscopeFee,
        setHoroscopeFee,
        isLiveDb,
        refetchProfiles,
        shortlistedCodes,
        isShortlisted,
        toggleShortlist,
        blockedCodes,
        blockUser,
        unblockUser,
        reportUser,
        requestedPhotoCodes,
        isPhotoRequested,
        requestPhotoAccess,
        photoRequests,
        fetchPhotoRequests,
        respondPhotoRequest,
        badgeCounts,
        refreshBadgeCounts,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
