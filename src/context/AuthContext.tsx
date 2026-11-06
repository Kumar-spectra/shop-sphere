'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ error?: string }>;
  register: (email: string, pass: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (fullName: string, phone: string) => Promise<{ error?: string }>;
  switchRole: (role: 'customer' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'shopsphere_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || 'Customer',
            phone: session.user.user_metadata?.phone || null,
            role: session.user.user_metadata?.role || 'customer',
          });
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || 'Customer',
            phone: session.user.user_metadata?.phone || null,
            role: session.user.user_metadata?.role || 'customer',
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local fallback session
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          // Default demo customer user
          const demoUser: UserProfile = {
            id: 'demo-user-123',
            email: 'demo@shopsphere.in',
            full_name: 'Rahul Kumar',
            phone: '+91 98765 43210',
            role: 'customer',
          };
          setUser(demoUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
        }
      } catch (e) {
        console.error('Failed reading auth storage', e);
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ error?: string }> => {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) return { error: error.message };
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || 'Customer',
          phone: data.user.user_metadata?.phone || null,
          role: data.user.user_metadata?.role || 'customer',
        });
      }
      return {};
    }

    // Local demo login
    const isMockAdmin = email.includes('admin');
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      phone: '+91 98765 43210',
      role: isMockAdmin ? 'admin' : 'customer',
    };
    setUser(newUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
    return {};
  };

  const register = async (email: string, pass: string, name: string): Promise<{ error?: string }> => {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name,
            role: 'customer',
          },
        },
      });
      if (error) return { error: error.message };
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          full_name: name,
          phone: null,
          role: 'customer',
        });
      }
      return {};
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: name,
      phone: null,
      role: 'customer',
    };
    setUser(newUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
    return {};
  };

  const logout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  };

  const updateProfile = async (fullName: string, phone: string): Promise<{ error?: string }> => {
    if (!user) return { error: 'Not authenticated' };

    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, phone },
      });
      if (error) return { error: error.message };
    }

    const updated = { ...user, full_name: fullName, phone };
    setUser(updated);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return {};
  };

  const switchRole = (role: 'customer' | 'admin') => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

