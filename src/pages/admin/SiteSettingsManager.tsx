import { useState } from 'react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { Save, Upload, Info, Image as ImageIcon } from 'lucide-react';

export default function SiteSettingsManager() {
  const { settings, updateSettings } = useSiteSettings();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSettings(formData);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'logoDarkUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, convert to base64 and store in localStorage
    // In production, you'd upload to Supabase Storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      handleChange(field, base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight mb-1">Site Settings</h1>
          <p className="text-[var(--color-text-soft)] text-sm">Manage your website's branding, contact information, and social links.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary btn-sm min-w-[120px]"
          >
            <Save size={16} />
            <span>{saved ? 'Saved!' : saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Branding Section */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[var(--color-border-soft)] bg-[var(--color-bg-soft)]/50">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Branding Identity</h2>
          </div>
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Site Name</label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Site Tagline</label>
                <input
                  type="text"
                  value={formData.siteTagline}
                  onChange={(e) => handleChange('siteTagline', e.target.value)}
                  className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                />
              </div>
            </div>

            <hr className="border-[var(--color-border-soft)]" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Light Logo */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Primary Logo (Light Background)</label>
                <div className="flex flex-col gap-3">
                  {formData.logoUrl ? (
                    <div className="w-full h-32 border border-[var(--color-border)] rounded-lg overflow-hidden bg-white flex items-center justify-center p-4 relative group">
                      <img src={formData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                      <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="btn btn-outline btn-sm bg-white cursor-pointer">
                          <span>Change</span>
                          <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'logoUrl')} className="hidden" />
                        </label>
                        <button onClick={() => handleChange('logoUrl', '')} className="btn btn-outline btn-sm bg-white text-red-600 border-red-200">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full h-32 border-2 border-dashed border-[var(--color-border)] rounded-lg flex flex-col items-center justify-center gap-2 bg-[var(--color-bg-soft)] cursor-pointer hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)]/5 transition-colors">
                      <ImageIcon size={24} className="text-[var(--color-text-muted)]" />
                      <span className="text-sm font-medium text-[var(--color-text-soft)]">Upload Primary Logo</span>
                      <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'logoUrl')} className="hidden" />
                    </label>
                  )}
                  <input
                    type="text"
                    value={formData.logoUrl.startsWith('data:') ? '' : formData.logoUrl}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    placeholder="Or paste image URL"
                    className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>
              </div>

              {/* Dark Logo */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Alternative Logo (Dark Background)</label>
                <div className="flex flex-col gap-3">
                  {formData.logoDarkUrl ? (
                    <div className="w-full h-32 border border-[var(--color-border)] rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center p-4 relative group">
                      <img src={formData.logoDarkUrl} alt="Dark Logo" className="max-w-full max-h-full object-contain" />
                      <div className="absolute inset-0 bg-gray-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="btn btn-outline btn-sm bg-gray-800 text-white border-gray-600 cursor-pointer">
                          <span>Change</span>
                          <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'logoDarkUrl')} className="hidden" />
                        </label>
                        <button onClick={() => handleChange('logoDarkUrl', '')} className="btn btn-outline btn-sm bg-gray-800 text-red-400 border-red-900/50">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full h-32 border-2 border-dashed border-[var(--color-border)] rounded-lg flex flex-col items-center justify-center gap-2 bg-[var(--color-bg-soft)] cursor-pointer hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)]/5 transition-colors">
                      <ImageIcon size={24} className="text-[var(--color-text-muted)]" />
                      <span className="text-sm font-medium text-[var(--color-text-soft)]">Upload Dark Logo</span>
                      <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'logoDarkUrl')} className="hidden" />
                    </label>
                  )}
                  <input
                    type="text"
                    value={formData.logoDarkUrl.startsWith('data:') ? '' : formData.logoDarkUrl}
                    onChange={(e) => handleChange('logoDarkUrl', e.target.value)}
                    placeholder="Or paste image URL"
                    className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[var(--color-border-soft)] bg-[var(--color-bg-soft)]/50">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Contact Information</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="contact@shivamelectronics.com"
                  className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  value={formData.contactWhatsapp}
                  onChange={(e) => handleChange('contactWhatsapp', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[var(--color-border-soft)] bg-[var(--color-bg-soft)]/50">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Social Media Links</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Instagram Profile</label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/shivamelectronics"
                  className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Facebook Page</label>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/shivamelectronics"
                  className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">YouTube Channel</label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                  placeholder="https://youtube.com/c/shivamelectronics"
                  className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Pinterest Profile</label>
                <input
                  type="url"
                  value={formData.pinterestUrl}
                  onChange={(e) => handleChange('pinterestUrl', e.target.value)}
                  placeholder="https://pinterest.com/shivamelectronics"
                  className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-[var(--color-bg-soft)] rounded-lg flex items-start gap-3 border border-[var(--color-border-soft)]">
              <Info size={16} className="text-[var(--color-text-muted)] mt-0.5" />
              <p className="text-sm text-[var(--color-text-soft)] leading-relaxed">
                Links provided here will be automatically displayed in your website's header and footer menus. Leave a field blank to hide that social icon from your storefront.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
