import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { siteSettingsApi } from '../services/cmsApi';

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  pinterestUrl: string;
  [key: string]: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'Mimiko Studio',
  siteTagline: 'Crafted to Adorn. Designed to Remember.',
  logoUrl: '',
  logoDarkUrl: '',
  faviconUrl: '',
  contactEmail: 'hello@mimikostudio.com',
  contactPhone: '',
  contactWhatsapp: '',
  instagramUrl: 'https://instagram.com/mimikostudio',
  facebookUrl: '',
  youtubeUrl: '',
  pinterestUrl: '',
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // Try localStorage first
    const saved = localStorage.getItem('mimiko_site_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
        setLoading(false);
        return;
      } catch (e) {
        // Invalid JSON
      }
    }

    // Try Supabase
    const res = await siteSettingsApi.getAll();
    if (res.success && res.data) {
      const merged = { ...defaultSettings, ...res.data };
      setSettings(merged);
      localStorage.setItem('mimiko_site_settings', JSON.stringify(merged));
    }
    setLoading(false);
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated: SiteSettings = { ...settings, ...newSettings } as SiteSettings;
    setSettings(updated);
    localStorage.setItem('mimiko_site_settings', JSON.stringify(updated));

    // Try to save to Supabase
    for (const [key, value] of Object.entries(newSettings)) {
      if (value !== undefined) {
        await siteSettingsApi.update(key, value);
      }
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return context;
}
