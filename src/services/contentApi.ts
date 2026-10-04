import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CompanyPolicy, AboutSection } from '../types/business';
import type { ApiResponse } from '../types/electronics';

const STORAGE_KEY_POLICIES = 'shivam_policies_v1';
const STORAGE_KEY_ABOUT = 'shivam_about_sections_v1';

const DEFAULT_POLICIES: CompanyPolicy[] = [
  {
    id: 'pol-1',
    title: 'Privacy Policy',
    slug: 'privacy',
    content: `## Privacy Policy

At **Shivam Electronics**, your privacy and trust are our top priorities. This Privacy Policy details how we handle information collected through our website, showroom visits, and customer service channels.

### 1. Information We Collect
- **Customer Contact Details:** Name, telephone number, email address, and delivery location provided when inquiring or booking.
- **Transaction & Warranty Records:** Invoiced items, serial numbers, and delivery dates needed for official brand warranty registration and service claim coordination.

### 2. How We Use Your Information
- To deliver and install your electronics and furniture directly to your doorstep.
- To facilitate official brand warranties with partners like Sony, LG, Samsung, Haier, and Godrej.
- To notify you regarding upcoming seasonal festival offers (with instant opt-out available).

### 3. Protection & Sharing
We do not sell, rent, or trade your personal information to third parties. Data is shared exclusively with certified manufacturer service centers when you authorize a service call.`,
    version: '1.0',
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pol-2',
    title: 'Terms & Conditions',
    slug: 'terms',
    content: `## Terms & Conditions

Welcome to **Shivam Electronics**. By exploring our online catalogue or visiting our physical showroom, you agree to comply with these terms.

### 1. Product Pricing & Availability
- Displayed prices are either Maximum Retail Price (MRP) or estimated showroom selling prices. In-store festival promotions, bank cashbacks, and exchange bonuses may offer further savings.
- All items in our online showcase are subject to physical showroom availability.

### 2. Delivery & Installation
- Express delivery is offered within our service zone across Jolva, Kadodara, Bardoli, Surat, and adjacent Gujarat regions.
- Standard installation for televisions, air conditioners, and washing machines is executed by authorized brand engineers.

### 3. Cancellations & Returns
- Pre-delivery orders may be modified or cancelled with full refund prior to showroom dispatch.
- Defective units are covered by immediate brand inspection and on-site replacement under manufacturer warranty terms.`,
    version: '1.0',
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pol-3',
    title: 'Warranty & After-Sales Support',
    slug: 'warranty',
    content: `## Warranty & After-Sales Support

Every product purchased from Shivam Electronics is guaranteed 100% genuine and covered by full manufacturer warranty.

### Standard Manufacturer Warranty Guidelines
- **Smart Televisions:** 1 to 3 Years comprehensive warranty (Panels covered as per brand terms).
- **Refrigerators & ACs:** Up to 10 Years Inverter Compressor Warranty.
- **Washing Machines:** Up to 10 Years Motor Warranty.
- **Home Furniture:** 5 to 10 Years termite-resistance and craftsmanship warranty on solid teakwood models.

### Direct Showroom Service Assistance
Have a service request? You never have to deal with automated call centers alone. Contact our showroom team with your invoice number, and our team will coordinate the brand technician dispatch directly to your home.`,
    version: '1.0',
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_ABOUT_SECTIONS: AboutSection[] = [
  {
    id: 'abt-1',
    title: 'Serving Families with Technology & Comfort Since 2010',
    subtitle: 'Our Showroom Story',
    content: 'Shivam Electronics was established with a singular vision: to bring world-class home technology, kitchen appliances, and durable handcrafted furniture to our community at honest, transparent prices. Over the last 15+ years, we have grown into the region’s premier multi-brand showroom, having equipped over 15,000 households with genuine appliances and lasting home furnishings.',
    sectionType: 'STORY',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80',
    sortOrder: 1,
    isVisible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'abt-2',
    title: 'Touch, Test, and Experience Before You Buy',
    subtitle: 'The Showroom Experience',
    content: 'Buying home appliances and furniture is an important decision for your family. Our expansive showroom floor lets you experience 4K and OLED screens side-by-side, test inverter refrigeration, hear party audio systems in person, and feel the solid joinery of solid teakwood beds and almirahs before making an informed choice.',
    sectionType: 'SHOWROOM',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    sortOrder: 2,
    isVisible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'abt-3',
    title: 'Honest Guidance, Genuine Warranty, Local Commitment',
    subtitle: 'Our Core Values',
    content: 'We take pride in our strict zero-counterfeit policy, direct manufacturer partnerships, zero-cost EMI plans, and dedicated showroom support for after-sales brand service. Our relationship with you does not end when you leave the store — it begins there.',
    sectionType: 'VALUES',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
    sortOrder: 3,
    isVisible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const contentApi = {
  // ─── Policies ─────────────────────────────────────────────────────────────
  async getPolicies(): Promise<ApiResponse<CompanyPolicy[]>> {
    let list: CompanyPolicy[] = [...DEFAULT_POLICIES];
    try {
      const cached = localStorage.getItem(STORAGE_KEY_POLICIES);
      if (cached) list = JSON.parse(cached);
      else localStorage.setItem(STORAGE_KEY_POLICIES, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    if (!isSupabaseConfigured()) return { success: true, data: list };

    try {
      const { data, error } = await supabase.from('company_policies').select('*').eq('status', 'PUBLISHED');
      if (!error && data && data.length > 0) {
        const mapped: CompanyPolicy[] = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          slug: d.slug,
          content: d.content,
          version: d.version || '1.0',
          status: d.status || 'PUBLISHED',
          publishedAt: d.published_at,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
        localStorage.setItem(STORAGE_KEY_POLICIES, JSON.stringify(mapped));
        return { success: true, data: mapped };
      }
    } catch (e) {
      // fallback
    }

    return { success: true, data: list };
  },

  async getPolicyBySlug(slug: string): Promise<ApiResponse<CompanyPolicy | null>> {
    const policiesRes = await this.getPolicies();
    const found = policiesRes.data?.find(p => p.slug === slug) || null;
    return { success: true, data: found };
  },

  async updatePolicy(id: string, updates: Partial<CompanyPolicy>): Promise<ApiResponse<CompanyPolicy>> {
    let updated: CompanyPolicy | null = null;
    try {
      const cached = localStorage.getItem(STORAGE_KEY_POLICIES);
      let list: CompanyPolicy[] = cached ? JSON.parse(cached) : DEFAULT_POLICIES;
      list = list.map(p => {
        if (p.id === id) {
          updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
          return updated;
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEY_POLICIES, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    if (isSupabaseConfigured()) {
      try {
        const payload: Record<string, any> = { updated_at: new Date().toISOString() };
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.content !== undefined) payload.content = updates.content;
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.version !== undefined) payload.version = updates.version;

        await supabase.from('company_policies').update(payload).eq('id', id);
      } catch (e) {
        // ignore
      }
    }

    if (updated) return { success: true, data: updated };
    return { success: false, error: 'Policy not found' };
  },

  // ─── About Sections ────────────────────────────────────────────────────────
  async getAboutSections(): Promise<ApiResponse<AboutSection[]>> {
    let list: AboutSection[] = [...DEFAULT_ABOUT_SECTIONS];
    try {
      const cached = localStorage.getItem(STORAGE_KEY_ABOUT);
      if (cached) list = JSON.parse(cached);
      else localStorage.setItem(STORAGE_KEY_ABOUT, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    if (!isSupabaseConfigured()) return { success: true, data: list };

    try {
      const { data, error } = await supabase
        .from('about_sections')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: AboutSection[] = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          subtitle: d.subtitle,
          content: d.content,
          sectionType: d.section_type || 'STORY',
          imageUrl: d.image_url,
          sortOrder: d.sort_order || 0,
          isVisible: d.is_visible !== false,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
        localStorage.setItem(STORAGE_KEY_ABOUT, JSON.stringify(mapped));
        return { success: true, data: mapped };
      }
    } catch (e) {
      // fallback
    }

    return { success: true, data: list };
  },

  async updateAboutSection(id: string, updates: Partial<AboutSection>): Promise<ApiResponse<AboutSection>> {
    let updated: AboutSection | null = null;
    try {
      const cached = localStorage.getItem(STORAGE_KEY_ABOUT);
      let list: AboutSection[] = cached ? JSON.parse(cached) : DEFAULT_ABOUT_SECTIONS;
      list = list.map(s => {
        if (s.id === id) {
          updated = { ...s, ...updates, updatedAt: new Date().toISOString() };
          return updated;
        }
        return s;
      });
      localStorage.setItem(STORAGE_KEY_ABOUT, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    if (isSupabaseConfigured()) {
      try {
        const payload: Record<string, any> = { updated_at: new Date().toISOString() };
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.subtitle !== undefined) payload.subtitle = updates.subtitle;
        if (updates.content !== undefined) payload.content = updates.content;
        if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
        if (updates.sortOrder !== undefined) payload.sort_order = updates.sortOrder;
        if (updates.isVisible !== undefined) payload.is_visible = updates.isVisible;

        await supabase.from('about_sections').update(payload).eq('id', id);
      } catch (e) {
        // ignore
      }
    }

    if (updated) return { success: true, data: updated };
    return { success: false, error: 'Section not found' };
  },
};
