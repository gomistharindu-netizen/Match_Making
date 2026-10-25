'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MatrimonialProfile, mockProfiles } from '../data/mockProfiles';

export type UserRole = 'visitor' | 'member';

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
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Transform Laravel Database Profile to MatrimonialProfile format
function mapDbProfileToUi(p: any): MatrimonialProfile {
  const isOverseas = p.district === 'Overseas' || (p.country && p.country !== 'Sri Lanka');
  const heightStr = p.height_feet ? `${p.height_feet}' ${p.height_inches || 0}"` : "5' 8\"";
  const managedByCapitalized = (p.managed_by_type ? p.managed_by_type.charAt(0).toUpperCase() + p.managed_by_type.slice(1) : 'Self') as any;

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
    managedBy: managedByCapitalized,
    photoUrl: p.primary_photo_url || (p.gender === 'groom'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80'),
    photoIsPrivate: false,
    horoscopeAvailable: p.horoscope_available ?? true,
    rashi: p.gender === 'groom' ? 'Kanya (කන්‍යා)' : 'Mesha (මේෂ)',
    nekatha: p.gender === 'groom' ? 'Hastha (හත)' : 'Rohini (රෙහෙණ)',
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
      contactPerson: managedByCapitalized,
      relationship: managedByCapitalized,
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
    } catch (e) {
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
    } catch (e) {}
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
