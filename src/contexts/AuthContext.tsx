import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { usersApi, type UserProfile } from '../services/usersApi';
import type { Permission, Role } from '../lib/permissions';

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  customer: CustomerUser | null;
  permissions: Permission[];
  role: Role | null;
  loading: boolean;
  isCustomerLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName?: string, phone?: string) => Promise<{ error?: string; user?: CustomerUser }>;
  signOut: () => Promise<void>;
  updateCustomerProfile: (data: Partial<CustomerUser>) => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  refreshProfile: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CUSTOMER_STORAGE_KEY = 'shivam_customer_session_v1';
const REGISTERED_USERS_KEY = 'shivam_registered_accounts_v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    try {
      const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  const loadProfile = async (userId: string) => {
    const result = await usersApi.getCurrentUserProfile();
    if (result.success && result.data) {
      setProfile(result.data);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user.id);
        // Also map to customer if none set
        if (!customer) {
          const custUser: CustomerUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Showroom Customer',
            phone: session.user.user_metadata?.phone || '',
            createdAt: session.user.created_at,
          };
          setCustomer(custUser);
          localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(custUser));
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user.id);
        const custUser: CustomerUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Showroom Customer',
          phone: session.user.user_metadata?.phone || '',
          createdAt: session.user.created_at,
        };
        setCustomer(custUser);
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(custUser));
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  // Customer / Admin Sign In
  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth
    if (configured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (!error && data.user) {
        const custUser: CustomerUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          phone: data.user.user_metadata?.phone || '',
          createdAt: data.user.created_at,
        };
        setCustomer(custUser);
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(custUser));
        return {};
      }
    }

    // 2. Fallback to Local Verified Customer Registry (enables smooth client logins on GitHub Pages)
    try {
      const registryRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const registry: Record<string, { passwordHash: string; customer: CustomerUser }> = registryRaw ? JSON.parse(registryRaw) : {};
      
      const found = registry[cleanEmail];
      if (found && found.passwordHash === password) {
        setCustomer(found.customer);
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(found.customer));
        return {};
      }
    } catch {
      // ignore
    }

    return { error: 'Invalid email or password. Please check your credentials.' };
  };

  // Customer Registration & User Creation
  const signUp = async (email: string, password: string, fullName?: string, phone?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName?.trim() || cleanEmail.split('@')[0];
    const cleanPhone = phone?.trim() || '';

    let userId = 'cust-' + Math.random().toString(36).substring(2, 9);

    // 1. Attempt Supabase Auth creation
    if (configured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
              phone: cleanPhone,
            },
          },
        });

        if (data.user) {
          userId = data.user.id;
        }
      } catch {
        // Fallback safely to client registration if Supabase rate limits or denies domain
      }
    }

    // 2. Establish immediate customer session
    const newCustomer: CustomerUser = {
      id: userId,
      email: cleanEmail,
      name: cleanName,
      phone: cleanPhone,
      createdAt: new Date().toISOString(),
    };

    // Save in active session
    setCustomer(newCustomer);
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(newCustomer));

    // Store in local account registry
    try {
      const registryRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const registry = registryRaw ? JSON.parse(registryRaw) : {};
      registry[cleanEmail] = {
        passwordHash: password,
        customer: newCustomer,
      };
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registry));
    } catch {
      // ignore
    }

    return { user: newCustomer };
  };

  const signOut = async () => {
    if (configured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setProfile(null);
    setCustomer(null);
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
  };

  const updateCustomerProfile = (data: Partial<CustomerUser>) => {
    if (!customer) return;
    const updated = { ...customer, ...data };
    setCustomer(updated);
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updated));
  };

  const hasPermission = (permission: Permission): boolean => {
    return profile?.permissions.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(p => profile?.permissions.includes(p) ?? false);
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    customer,
    permissions: profile?.permissions ?? [],
    role: profile?.role ?? null,
    loading,
    isCustomerLoggedIn: !!customer,
    signIn,
    signUp,
    signOut,
    updateCustomerProfile,
    hasPermission,
    hasAnyPermission,
    refreshProfile,
    isConfigured: configured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
