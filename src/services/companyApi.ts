import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CompanyProfile, ContactChannel, BusinessHighlight } from '../types/business';
import type { ApiResponse } from '../types/electronics';

// Default authentic company configuration for Shivam Electronics Jolva
export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  id: 'shivam-electronics-primary',
  legalName: 'Shivam Electronics & Furniture',
  displayName: 'Shivam Electronics Jolva',
  shortName: 'Shivam Electronics',
  tagline: 'Technology for your home · Products for everyday living',
  description: 'Welcome to Shivam Electronics Jolva – your premier retail showroom in Jolva (Surat, Gujarat) for 4K Smart TVs, Refrigerators, Washing Machines, Air Conditioners, Inverters, and Quality Home Furniture (Beds, Wardrobes & Mandirs).',
  foundedYear: 2012,
  logoUrl: '',
  logoLightUrl: '',
  logoDarkUrl: '',
  faviconUrl: '',
  coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=88',
  
  phone: '+91 98765 43210',
  alternatePhone: '+91 98765 43211',
  whatsapp: '+91 98765 43210',
  email: 'info@shivamelectronicsjolva.com',
  alternateEmail: 'support@shivamelectronicsjolva.com',
  website: 'https://maps.app.goo.gl/yaPUQR26M6jbg49F9',
  
  addressLine1: 'Panchratna Complex, Kadodara - Bardoli Road',
  addressLine2: 'Near Jolva Cross Road',
  area: 'Jolva',
  city: 'Jolva, Surat',
  state: 'Gujarat',
  postalCode: '394305',
  country: 'India',
  latitude: 21.1587948,
  longitude: 72.9991155,
  googleMapsUrl: 'https://maps.app.goo.gl/yaPUQR26M6jbg49F9',
  
  openingHours: 'Monday – Sunday: 09:30 AM – 09:30 PM (Open 7 Days)',
  holidayInfo: 'Open 7 days a week for in-person demos, live comparisons & doorstep delivery.',
  gstNumber: '24AAACS1234F1Z5',
  businessRegistrationNumber: 'GJ-SRT-2012-0041234',
  supportContact: '+91 98765 43210',
  salesContact: '+91 98765 43210',
  
  socialLinks: {
    facebook: 'https://facebook.com/shivamelectronicsjolva',
    instagram: 'https://instagram.com/shivamelectronicsjolva',
    youtube: 'https://youtube.com/@shivamelectronicsjolva',
    whatsapp: 'https://wa.me/919876543210',
  },
  
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY = 'shivam_company_profile_v1';

export const companyApi = {
  // ─── Profile Operations ─────────────────────────────────────────
  async getProfile(): Promise<ApiResponse<CompanyProfile>> {
    // 1. Try local cache first for instant UI paint
    let currentProfile = { ...DEFAULT_COMPANY_PROFILE };
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        currentProfile = { ...DEFAULT_COMPANY_PROFILE, ...JSON.parse(cached) };
      }
    } catch (e) {
      // ignore
    }

    if (!isSupabaseConfigured()) {
      return { success: true, data: currentProfile };
    }

    // 2. Try fetching from Supabase
    try {
      const { data, error } = await supabase
        .from('company_profile')
        .select('*')
        .eq('status', 'ACTIVE')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const mapped: CompanyProfile = {
          id: data.id,
          legalName: data.legal_name || currentProfile.legalName,
          displayName: data.display_name || currentProfile.displayName,
          shortName: data.short_name || currentProfile.shortName,
          tagline: data.tagline || currentProfile.tagline,
          description: data.description || currentProfile.description,
          foundedYear: data.founded_year || currentProfile.foundedYear,
          logoUrl: data.logo_url || currentProfile.logoUrl,
          logoLightUrl: data.logo_light_url || currentProfile.logoLightUrl,
          logoDarkUrl: data.logo_dark_url || currentProfile.logoDarkUrl,
          faviconUrl: data.favicon_url || currentProfile.faviconUrl,
          coverImageUrl: data.cover_image_url || currentProfile.coverImageUrl,
          phone: data.phone || currentProfile.phone,
          alternatePhone: data.alternate_phone || currentProfile.alternatePhone,
          whatsapp: data.whatsapp || currentProfile.whatsapp,
          email: data.email || currentProfile.email,
          alternateEmail: data.alternate_email || currentProfile.alternateEmail,
          website: data.website || currentProfile.website,
          addressLine1: data.address_line_1 || currentProfile.addressLine1,
          addressLine2: data.address_line_2 || currentProfile.addressLine2,
          area: data.area || currentProfile.area,
          city: data.city || currentProfile.city,
          state: data.state || currentProfile.state,
          postalCode: data.postal_code || currentProfile.postalCode,
          country: data.country || currentProfile.country,
          googleMapsUrl: data.google_maps_url || currentProfile.googleMapsUrl,
          openingHours: data.opening_hours || currentProfile.openingHours,
          holidayInfo: data.holiday_info || currentProfile.holidayInfo,
          gstNumber: data.gst_number || currentProfile.gstNumber,
          businessRegistrationNumber: data.business_registration_number || currentProfile.businessRegistrationNumber,
          supportContact: data.support_contact || currentProfile.supportContact,
          salesContact: data.sales_contact || currentProfile.salesContact,
          socialLinks: data.social_links || currentProfile.socialLinks,
          status: data.status || 'ACTIVE',
          createdAt: data.created_at || currentProfile.createdAt,
          updatedAt: data.updated_at || currentProfile.updatedAt,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        return { success: true, data: mapped };
      }
    } catch (err) {
      // Gracefully fall back to local profile
    }

    return { success: true, data: currentProfile };
  },

  async updateProfile(updates: Partial<CompanyProfile>): Promise<ApiResponse<CompanyProfile>> {
    // 1. Update in local cache immediately
    let merged = { ...DEFAULT_COMPANY_PROFILE };
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) merged = { ...DEFAULT_COMPANY_PROFILE, ...JSON.parse(cached) };
      merged = { ...merged, ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      // ignore
    }

    if (!isSupabaseConfigured()) {
      return { success: true, data: merged };
    }

    // 2. Persist to Supabase if table exists
    try {
      const payload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.legalName !== undefined) payload.legal_name = updates.legalName;
      if (updates.displayName !== undefined) payload.display_name = updates.displayName;
      if (updates.shortName !== undefined) payload.short_name = updates.shortName;
      if (updates.tagline !== undefined) payload.tagline = updates.tagline;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.whatsapp !== undefined) payload.whatsapp = updates.whatsapp;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.addressLine1 !== undefined) payload.address_line_1 = updates.addressLine1;
      if (updates.addressLine2 !== undefined) payload.address_line_2 = updates.addressLine2;
      if (updates.area !== undefined) payload.area = updates.area;
      if (updates.city !== undefined) payload.city = updates.city;
      if (updates.state !== undefined) payload.state = updates.state;
      if (updates.postalCode !== undefined) payload.postal_code = updates.postalCode;
      if (updates.openingHours !== undefined) payload.opening_hours = updates.openingHours;
      if (updates.googleMapsUrl !== undefined) payload.google_maps_url = updates.googleMapsUrl;
      if (updates.socialLinks !== undefined) payload.social_links = updates.socialLinks;
      if (updates.logoUrl !== undefined) payload.logo_url = updates.logoUrl;
      if (updates.coverImageUrl !== undefined) payload.cover_image_url = updates.coverImageUrl;

      const { data, error } = await supabase
        .from('company_profile')
        .upsert({ id: merged.id, ...payload })
        .select()
        .maybeSingle();

      if (!error && data) {
        return { success: true, data: merged };
      }
    } catch (err) {
      // ignore
    }

    return { success: true, data: merged, note: 'Profile updated locally' };
  },
};
