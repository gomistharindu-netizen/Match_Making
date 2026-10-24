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

export interface AuthProfile {
  id: number;
  profile_code: string;
  gender?: string;
  primary_photo_url?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: AuthProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: Record<string, any>) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
            // Token invalidated on server
            logout();
          })
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    } catch (e) {
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
    } catch (err: any) {
      return {
        success: false,
        message: 'Could not connect to server. Please check your connection.',
      };
    }
  };

  const register = async (formData: Record<string, any>): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
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
    } catch (err: any) {
      return {
        success: false,
        message: 'Could not connect to server. Please check your connection.',
      };
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
