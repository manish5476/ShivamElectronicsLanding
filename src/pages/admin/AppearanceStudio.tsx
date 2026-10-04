import { useState, useEffect, useRef } from 'react';
import { Save, Check, RotateCcw, Monitor, Tablet, Smartphone, Palette, Type } from 'lucide-react';
import { siteSettingsApi } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
import { THEME_PRESETS, ALLOWED_FONTS, getThemePreset } from '../../lib/themePresets';
import type { ThemeSettings } from '../../contexts/ThemeContext';
import ElectronicsLayout from '../../components/ElectronicsLayout';
import ElectronicsHome from '../ElectronicsHome';

export default function AppearanceStudio() {
  const { theme: activeTheme, setTheme: setActiveTheme, activePreset: savedPreset } = useTheme();
  
  const [localTheme, setLocalTheme] = useState<ThemeSettings>(activeTheme);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'themes' | 'typography'>('themes');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    setLocalTheme(activeTheme); 
  }, [activeTheme]);

  const handleSave = async () => {
    setSaving(true);
    // Save to site_settings table as requested by the architectural change
    const p1 = siteSettingsApi.update('theme_preset', localTheme.theme_preset);
    const p2 = siteSettingsApi.update('font_family', localTheme.font_family);
    
    await Promise.all([p1, p2]);
    
    setActiveTheme(localTheme);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const currentPreset = getThemePreset(localTheme.theme_preset);

  // Generate CSS variables for the preview container only
  const previewStyles = {
    '--color-primary': currentPreset.colors.primary,
    '--color-secondary': currentPreset.colors.secondary,
    '--color-accent': currentPreset.colors.accent,
    '--color-accent-soft': currentPreset.colors.accentSoft,
    '--color-bg': currentPreset.colors.background,
    '--color-surface': currentPreset.colors.surface,
    '--color-surface-soft': currentPreset.colors.surfaceSoft,
    '--color-text': currentPreset.colors.text,
    '--color-text-muted': currentPreset.colors.muted,
    '--color-border': currentPreset.colors.border,
    '--gradient-hero': currentPreset.gradients.hero,
    '--gradient-accent': currentPreset.gradients.accent,
    '--font-heading': `"${localTheme.font_family}", sans-serif`,
    '--font-body': `"${localTheme.font_family}", sans-serif`,
    '--radius-sm': currentPreset.radius.sm,
    '--radius-md': currentPreset.radius.md,
    '--radius-btn': currentPreset.radius.button,
    '--shadow': currentPreset.shadows.intensity === 'none' ? 'none' : '0 4px 20px rgba(0,0,0,0.06)'
  } as React.CSSProperties;

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 flex-shrink-0 px-2">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text)] tracking-tight mb-1">Appearance Studio</h1>
          <p className="text-[var(--color-text-muted)] text-sm">Choose the visual identity for your storefront.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLocalTheme({ theme_preset: 'pearl-commerce', font_family: 'Inter' })} 
            className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-sm font-semibold rounded hover:bg-[var(--color-surface)]"
          >
            <RotateCcw size={16} /> Default
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving || localTheme === activeTheme} 
            className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded hover:opacity-90 min-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}</>}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 bg-[var(--color-bg-soft)] -mx-4 sm:mx-0 p-4 sm:p-0 sm:bg-transparent rounded-lg">
        
        {/* Left Panel: Theme Controls */}
        <div className="w-full lg:w-[420px] flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm flex-shrink-0 h-[500px] lg:h-full">
          
          {/* Tabs */}
          <div className="flex border-b border-[var(--color-border)] bg-[var(--color-surface-soft)] flex-shrink-0">
            <button
              onClick={() => setActiveTab('themes')}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'themes' ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              <Palette size={16} /> Theme
            </button>
            <button
              onClick={() => setActiveTab('typography')}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'typography' ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              <Type size={16} /> Typography
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
            {activeTab === 'themes' && (
              <div className="space-y-4">
                <p className="text-sm text-[var(--color-text-muted)] mb-2">Select a professionally art-directed visual identity for your store.</p>
                
                {THEME_PRESETS.map(preset => {
                  const isActive = localTheme.theme_preset === preset.id;
                  return (
                    <button 
                      key={preset.id} 
                      onClick={() => setLocalTheme(prev => ({ ...prev, theme_preset: preset.id }))}
                      className={`w-full text-left rounded-xl overflow-hidden border-2 transition-all group ${isActive ? 'border-[var(--color-primary)] shadow-md' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'}`}
                    >
                      {/* Miniature Visual Preview Header */}
                      <div className="h-24 p-4 relative overflow-hidden" style={{ background: preset.colors.background }}>
                        {/* Fake Hero Gradient */}
                        <div className="absolute inset-0 opacity-50" style={{ background: preset.gradients.hero }}></div>
                        
                        {/* Mini UI Elements */}
                        <div className="relative z-10 space-y-3">
                          <div className="flex justify-between items-center opacity-80">
                            <div className="w-16 h-3 rounded-full" style={{ background: preset.colors.primary }}></div>
                            <div className="flex gap-1.5">
                              <div className="w-4 h-4 rounded-full" style={{ background: preset.colors.text }}></div>
                              <div className="w-4 h-4 rounded-full" style={{ background: preset.colors.text }}></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-1/2">
                              <div className="w-full h-4 rounded mb-1" style={{ background: preset.colors.text }}></div>
                              <div className="w-3/4 h-2 rounded mb-2" style={{ background: preset.colors.muted }}></div>
                              <div className="w-12 h-4 rounded-sm" style={{ background: preset.colors.accent, borderRadius: preset.radius.button }}></div>
                            </div>
                            <div className="w-1/2 h-10 rounded shadow-sm" style={{ background: preset.colors.surface, borderRadius: preset.radius.md, border: `1px solid ${preset.colors.border}` }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center justify-between">
                        <div>
                          <span className="block font-bold text-[var(--color-text)]">{preset.name}</span>
                          <span className="block text-xs text-[var(--color-text-muted)] mt-0.5">{preset.description}</span>
                        </div>
                        {isActive && (
                          <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-4">
                <p className="text-sm text-[var(--color-text-muted)] mb-2">Select a font family to apply across your entire store.</p>
                
                {ALLOWED_FONTS.map(font => {
                  const isActive = localTheme.font_family === font.id;
                  return (
                    <button
                      key={font.id}
                      onClick={() => setLocalTheme(prev => ({ ...prev, font_family: font.id }))}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isActive ? 'border-[var(--color-primary)] shadow-sm bg-[var(--color-primary)]/5' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 bg-[var(--color-surface)]'}`}
                    >
                      <div className="text-left">
                        <span className="block font-bold text-lg mb-0.5 text-[var(--color-text)]" style={{ fontFamily: `"${font.id}", sans-serif` }}>{font.name}</span>
                        <span className="block text-xs text-[var(--color-text-muted)]">{font.desc}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-medium text-[var(--color-text)]" style={{ fontFamily: `"${font.id}", sans-serif` }}>Aa</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Live Website Preview */}
        <div className="flex-1 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] flex flex-col overflow-hidden h-[600px] lg:h-full relative shadow-inner">
          
          {/* Device Toggle Header */}
          <div className="h-12 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-4 z-10">
            <div className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Preview
            </div>
            <div className="flex items-center gap-1 bg-[var(--color-bg)] p-1 rounded-md border border-[var(--color-border)]">
              <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}>
                <Monitor size={16} />
              </button>
              <button onClick={() => setPreviewMode('tablet')} className={`p-1.5 rounded ${previewMode === 'tablet' ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}>
                <Tablet size={16} />
              </button>
              <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}>
                <Smartphone size={16} />
              </button>
            </div>
          </div>

          {/* Scaled Preview Canvas */}
          <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4">
            <div 
              ref={previewRef}
              className="bg-white shadow-2xl overflow-y-auto origin-top transition-all duration-300 hide-scrollbar ring-1 ring-black/5"
              style={{
                width: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '768px' : '375px',
                height: '100%',
                maxWidth: '1200px',
                ...previewStyles 
              }}
            >
              <div className="pointer-events-none">
                <ElectronicsLayout>
                  <ElectronicsHome />
                </ElectronicsLayout>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
