'use client';

import React, { createContext, useContext, useState } from 'react';
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
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('member'); // Default to member so customer can immediately explore full features
  const [freeModeActive, setFreeModeActive] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<MatrimonialProfile[]>(mockProfiles);
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  const [showInViewerLists, setShowInViewerLists] = useState<boolean>(true);
  const [registrationFee, setRegistrationFee] = useState<number>(5000);
  const [horoscopeFee, setHoroscopeFee] = useState<number>(3500);

  const sendInterest = (profileId: string) => {
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
