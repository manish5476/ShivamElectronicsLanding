import { useState, useEffect } from 'react';
import { 
  Building2, Phone, MapPin, Clock, Globe, Shield, 
  Save, Check, ExternalLink, RefreshCw, AlertCircle
} from 'lucide-react';
import { companyApi, DEFAULT_COMPANY_PROFILE } from '../../services/companyApi';
import type { CompanyProfile } from '../../types/business';

export default function CompanyManager() {
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_COMPANY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'identity' | 'contact' | 'location' | 'legal'>('identity');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const res = await companyApi.getProfile();
    if (res.data) {
      setProfile(res.data);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await companyApi.updateProfile(profile);
    setSaving(false);
    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const updateField = (field: keyof CompanyProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateSocial = (network: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[var(--color-brand)] mb-3" />
        <p className="text-sm font-medium text-[var(--color-text-muted)]">Loading Company Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-brand)] block mb-1">
            Single Source of Truth
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Company Identity & Operations
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Centrally manages showroom brand details, contacts, address, timings and legal registration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <Check size={14} /> Profile Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--color-brand)] text-white hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] overflow-x-auto pb-px">
        {[
          { id: 'identity', label: 'Identity & Branding', icon: Building2 },
          { id: 'contact', label: 'Contact & Socials', icon: Phone },
          { id: 'location', label: 'Showroom & Hours', icon: MapPin },
          { id: 'legal', label: 'Registration & Legal', icon: Shield },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* TAB 1: Identity & Branding */}
        {activeTab === 'identity' && (
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                Store Identity
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Display Name (Customer-facing) *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.displayName}
                    onChange={e => updateField('displayName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Appears in header, footer, page titles and copyright.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Legal Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.legalName}
                    onChange={e => updateField('legalName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Used on invoices, terms, tax forms and legal notices.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Short Name / Monogram Tag
                  </label>
                  <input
                    type="text"
                    value={profile.shortName}
                    onChange={e => updateField('shortName', e.target.value)}
                    placeholder="e.g. Shivam"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    value={profile.foundedYear || 2010}
                    onChange={e => updateField('foundedYear', parseInt(e.target.value) || 2010)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={profile.tagline}
                  onChange={e => updateField('tagline', e.target.value)}
                  placeholder="e.g. Technology for your home · Products for everyday living"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                  Short About Description
                </label>
                <textarea
                  rows={3}
                  value={profile.description}
                  onChange={e => updateField('description', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                />
              </div>
            </div>

            {/* Visual Media URLs */}
            <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                Logos & Visual Assets
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Primary Logo URL
                  </label>
                  <input
                    type="url"
                    value={profile.logoUrl || ''}
                    onChange={e => updateField('logoUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1">If blank, the store uses the monogram badge.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Showroom Hero / Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={profile.coverImageUrl || ''}
                    onChange={e => updateField('coverImageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Contact & Socials */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                Phone & Direct Messaging
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Primary Telephone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={profile.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    WhatsApp Enquiry Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={profile.whatsapp}
                    onChange={e => updateField('whatsapp', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Alternate / Landline Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.alternatePhone || ''}
                    onChange={e => updateField('alternatePhone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                Email & Online Channels
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={e => updateField('email', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={e => updateField('website', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
                  Social Media Links
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] mb-1">Facebook URL</label>
                    <input
                      type="url"
                      value={profile.socialLinks?.facebook || ''}
                      onChange={e => updateSocial('facebook', e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] mb-1">Instagram URL</label>
                    <input
                      type="url"
                      value={profile.socialLinks?.instagram || ''}
                      onChange={e => updateSocial('instagram', e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] mb-1">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={profile.socialLinks?.youtube || ''}
                      onChange={e => updateSocial('youtube', e.target.value)}
                      placeholder="https://youtube.com/@..."
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Showroom & Hours */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                Physical Showroom Location
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Street Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.addressLine1}
                    onChange={e => updateField('addressLine1', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Address Line 2 / Landmark
                  </label>
                  <input
                    type="text"
                    value={profile.addressLine2 || ''}
                    onChange={e => updateField('addressLine2', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.city}
                    onChange={e => updateField('city', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.state}
                    onChange={e => updateField('state', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.postalCode}
                    onChange={e => updateField('postalCode', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    value={profile.googleMapsUrl || ''}
                    onChange={e => updateField('googleMapsUrl', e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                Store Operations & Hours
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                  Weekly Timings Text *
                </label>
                <input
                  type="text"
                  required
                  value={profile.openingHours}
                  onChange={e => updateField('openingHours', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                  Holiday / Sunday Operating Note
                </label>
                <input
                  type="text"
                  value={profile.holidayInfo || ''}
                  onChange={e => updateField('holidayInfo', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Legal & Registration */}
        {activeTab === 'legal' && (
          <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
              Tax & Business Compliance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                  GST Identification Number (GSTIN)
                </label>
                <input
                  type="text"
                  value={profile.gstNumber || ''}
                  onChange={e => updateField('gstNumber', e.target.value)}
                  placeholder="09AAACS1234F1Z5"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)] uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--color-text-muted)]">
                  Corporate Registration / CIN Number
                </label>
                <input
                  type="text"
                  value={profile.businessRegistrationNumber || ''}
                  onChange={e => updateField('businessRegistrationNumber', e.target.value)}
                  placeholder="U52334UP2010PTC..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand)] uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-[var(--color-brand)] text-white hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
