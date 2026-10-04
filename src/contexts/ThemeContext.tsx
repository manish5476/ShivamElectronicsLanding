import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { siteSettingsApi } from '../services/cmsApi';
import { getThemePreset, ThemePresetDefinition, ALLOWED_FONTS } from '../lib/themePresets';

export interface ThemeSettings {
  theme_preset: string;
  font_family: string;
}

const defaultTheme: ThemeSettings = {
  theme_preset: 'pearl-commerce',
  font_family: 'Inter',
};

interface ThemeContextType {
  theme: ThemeSettings;
  setTheme: (t: Partial<ThemeSettings>) => void;
  activePreset: ThemePresetDefinition;
  loading: boolean;
  isConfigured: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
  activePreset: getThemePreset('pearl-commerce'),
  loading: true,
  isConfigured: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeSettings>(defaultTheme);
  const [loading, setLoading] = useState(true);

  // Compute the active preset from the ID
  const activePreset = getThemePreset(theme.theme_preset);

  useEffect(() => {
    const loadTheme = async () => {
      // Try loading from localStorage first
      const saved = localStorage.getItem('mimiko_theme_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setThemeState({ ...defaultTheme, ...parsed });
          setLoading(false);
          return;
        } catch (e) {
          // Ignore
        }
      }

      // Load from Supabase site_settings
      try {
        const res = await siteSettingsApi.getAll();
        if (res.success && res.data) {
          const preset = res.data.theme_preset || defaultTheme.theme_preset;
          const font = res.data.font_family || defaultTheme.font_family;
          
          const newTheme = { theme_preset: preset, font_family: font };
          setThemeState(newTheme);
          localStorage.setItem('mimiko_theme_v2', JSON.stringify(newTheme));
        }
      } catch (e) {
        // Fallback to default
      }
      setLoading(false);
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const preset = getThemePreset(theme.theme_preset);
    
    // Validate font
    const validFont = ALLOWED_FONTS.find(f => f.id === theme.font_family)?.id || 'Inter';

    // Apply Colors
    root.style.setProperty('--color-primary', preset.colors.primary);
    root.style.setProperty('--color-secondary', preset.colors.secondary);
    root.style.setProperty('--color-accent', preset.colors.accent);
    root.style.setProperty('--color-accent-soft', preset.colors.accentSoft);
    root.style.setProperty('--color-bg', preset.colors.background);
    root.style.setProperty('--color-surface', preset.colors.surface);
    root.style.setProperty('--color-surface-soft', preset.colors.surfaceSoft);
    root.style.setProperty('--color-text', preset.colors.text);
    root.style.setProperty('--color-text-muted', preset.colors.muted);
    root.style.setProperty('--color-border', preset.colors.border);
    root.style.setProperty('--color-success', preset.colors.success);
    root.style.setProperty('--color-warning', preset.colors.warning);
    root.style.setProperty('--color-danger', preset.colors.danger);

    // Apply Gradients
    root.style.setProperty('--gradient-hero', preset.gradients.hero);
    root.style.setProperty('--gradient-accent', preset.gradients.accent);

    // Apply Typography
    root.style.setProperty('--font-heading', `"${validFont}", sans-serif`);
    root.style.setProperty('--font-body', `"${validFont}", sans-serif`);
    
    // Apply Geometry
    root.style.setProperty('--radius-sm', preset.radius.sm);
    root.style.setProperty('--radius-md', preset.radius.md);
    root.style.setProperty('--radius-btn', preset.radius.button);

    // Apply Shadows
    const shadow = preset.shadows.intensity === 'none' ? 'none' :
                   preset.shadows.intensity === 'subtle' ? '0 2px 10px rgba(0, 0, 0, 0.03)' :
                   preset.shadows.intensity === 'medium' ? '0 4px 20px rgba(0, 0, 0, 0.06)' :
                   '0 8px 30px rgba(0, 0, 0, 0.1)';
    root.style.setProperty('--shadow', shadow);

  }, [theme]);

  const setTheme = (updates: Partial<ThemeSettings>) => {
    setThemeState(prev => {
      const newTheme = { ...prev, ...updates };
      localStorage.setItem('mimiko_theme_v2', JSON.stringify(newTheme));
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, activePreset, loading, isConfigured: !loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
