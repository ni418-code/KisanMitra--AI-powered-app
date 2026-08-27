import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';
import { api } from '../services/api.ts';
import { LanguageCode, TRANSLATIONS, Translations } from '../services/translations.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  language: LanguageCode;
  t: Translations;
  setLanguage: (lang: LanguageCode) => void;
  loginWithOTP: (phone: string, otp: string, role?: UserRole, name?: string, location?: any, preferredCrops?: string[]) => Promise<{ success: boolean; message?: string }>;
  requestOTP: (phone: string, role?: UserRole) => Promise<{ success: boolean; demoCode?: string; message?: string }>;
  switchDemoUser: (role: 'farmer' | 'buyer' | 'admin') => Promise<void>;
  updateLocation: (location: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('km_auth_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('km_language') as LanguageCode;
    return saved && TRANSLATIONS[saved] ? saved : 'en';
  });

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('km_language', lang);
    if (user) {
      api.updateProfile({ preferredLanguage: lang }).catch(() => {});
    }
  };

  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const res = await api.getMe();
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      if (res.data.user.preferredLanguage && TRANSLATIONS[res.data.user.preferredLanguage as LanguageCode]) {
        setLanguageState(res.data.user.preferredLanguage as LanguageCode);
      }
    } else {
      localStorage.removeItem('km_auth_token');
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const requestOTP = async (phone: string, role?: UserRole) => {
    const res = await api.sendOTP(phone, role);
    if (res.success) {
      return { success: true, demoCode: res.data?.demoCode, message: res.message };
    }
    return { success: false, message: res.message };
  };

  const loginWithOTP = async (
    phone: string,
    otp: string,
    role?: UserRole,
    name?: string,
    location?: any,
    preferredCrops?: string[]
  ) => {
    const res = await api.verifyOTP({
      phone,
      otp,
      role,
      name,
      location,
      preferredCrops,
      preferredLanguage: language,
    });
    if (res.success && res.data) {
      localStorage.setItem('km_auth_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'Login failed.' };
  };

  const switchDemoUser = async (role: 'farmer' | 'buyer' | 'admin') => {
    setLoading(true);
    const res = await api.demoLogin(role);
    if (res.success && res.data) {
      localStorage.setItem('km_auth_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    setLoading(false);
  };

  const updateLocation = async (location: any) => {
    if (!user) return;
    const res = await api.updateProfile({ location });
    if (res.success && res.data) {
      setUser(res.data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('km_auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        language,
        t,
        setLanguage,
        loginWithOTP,
        requestOTP,
        switchDemoUser,
        updateLocation,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
