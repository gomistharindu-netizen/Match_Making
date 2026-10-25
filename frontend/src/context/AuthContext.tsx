'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  is_active_member: boolean;
}

export interface ProfilePhotoItem {
  id: number;
  url: string;
  is_primary: boolean;
  visibility: string;
}

export interface AuthProfile {
  id: number;
  profile_code: string;
  full_name_private?: string;
  gender?: string;
  age?: number;
  birth_date?: string;
  district?: string;
  city?: string;
  country?: string;
  residence_status?: string;
  religion?: string;
  caste?: string;
  height_feet?: number;
  height_inches?: number;
  education_level?: string;
  profession?: string;
  employed_in?: string;
  monthly_income_lkr?: string;
  family_background?: string;
  partner_preferences?: string;
  horoscope_available?: boolean;
  primary_photo_url?: string;
  photos?: ProfilePhotoItem[];
  publication_status?: string;
  managed_by_type?: string;
  is_paused?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: AuthProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: Record<string, unknown> | FormData) => Promise<{ success: boolean; message?: string }>;
  uploadPhoto: (file: File, isPrimary?: boolean, visibility?: string) => Promise<{ success: boolean; photo_url?: string; message?: string }>;
  updateProfileDetails: (details: Record<string, unknown>) => Promise<{ success: boolean; message?: string }>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem('jj_auth_token') : null);
    if (!currentToken) return;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('jj_auth_user', JSON.stringify(data.user));
        }
        if (data.profile) {
          setProfile(data.profile);
          localStorage.setItem('jj_auth_profile', JSON.stringify(data.profile));
        }
      }
    } catch {
      // Error fetching me
    }
  };

  // Load auth state from localStorage on initial client render
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('jj_auth_token');
      const storedUser = localStorage.getItem('jj_auth_user');
      const storedProfile = localStorage.getItem('jj_auth_profile');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }

        // Verify/refresh user state from backend
        fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            Accept: 'application/json',
          },
        })
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error('Token expired');
          })
          .then((data) => {
            if (data.user) {
              setUser(data.user);
              localStorage.setItem('jj_auth_user', JSON.stringify(data.user));
            }
            if (data.profile) {
              setProfile(data.profile);
              localStorage.setItem('jj_auth_profile', JSON.stringify(data.profile));
            }
          })
          .catch(() => {
            logout();
          })
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  }, []);

  const login = async (loginInput: string, passwordInput: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          login: loginInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Login failed'),
        };
      }

      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile || null);

      localStorage.setItem('jj_auth_token', data.token);
      localStorage.setItem('jj_auth_user', JSON.stringify(data.user));
      if (data.profile) {
        localStorage.setItem('jj_auth_profile', JSON.stringify(data.profile));
      }

      return { success: true };
    } catch {
      return {
        success: false,
        message: 'Could not connect to server. Please check your connection.',
      };
    }
  };

  const register = async (formData: Record<string, unknown> | FormData): Promise<{ success: boolean; message?: string }> => {
    try {
      const isFormData = typeof FormData !== 'undefined' && formData instanceof FormData;

      const headers: Record<string, string> = {
        Accept: 'application/json',
      };

      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers,
        body: isFormData ? formData : JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Registration failed'),
        };
      }

      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile || null);

      localStorage.setItem('jj_auth_token', data.token);
      localStorage.setItem('jj_auth_user', JSON.stringify(data.user));
      if (data.profile) {
        localStorage.setItem('jj_auth_profile', JSON.stringify(data.profile));
      }

      return { success: true };
    } catch {
      return {
        success: false,
        message: 'Could not connect to server. Please check your connection.',
      };
    }
  };

  const uploadPhoto = async (
    file: File,
    isPrimary: boolean = true,
    visibility: string = 'public'
  ): Promise<{ success: boolean; photo_url?: string; message?: string }> => {
    const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem('jj_auth_token') : null);
    if (!currentToken) return { success: false, message: 'Please login first' };

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('is_primary', isPrimary ? '1' : '0');
      formData.append('visibility', visibility);

      const res = await fetch(`${API_BASE_URL}/member/photo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentToken}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Photo upload failed' };
      }

      if (data.photo_url) {
        setProfile((prev) => (prev ? { ...prev, primary_photo_url: data.photo_url } : null));
        await refreshProfile();
      }

      return { success: true, photo_url: data.photo_url };
    } catch {
      return { success: false, message: 'Photo upload error. Check your file format and size.' };
    }
  };

  const updateProfileDetails = async (details: Record<string, unknown>): Promise<{ success: boolean; message?: string }> => {
    const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem('jj_auth_token') : null);
    if (!currentToken) return { success: false, message: 'Please login first' };

    try {
      const res = await fetch(`${API_BASE_URL}/member/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(details),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Update failed' };
      }

      await refreshProfile();
      return { success: true };
    } catch {
      return { success: false, message: 'Network error updating profile' };
    }
  };

  const logout = () => {
    if (token) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }).catch(() => {});
    }

    setToken(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('jj_auth_token');
    localStorage.removeItem('jj_auth_user');
    localStorage.removeItem('jj_auth_profile');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        uploadPhoto,
        updateProfileDetails,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
