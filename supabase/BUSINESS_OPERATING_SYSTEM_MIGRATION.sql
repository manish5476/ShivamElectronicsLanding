-- ============================================================
-- SHIVAM ELECTRONICS - BUSINESS OPERATING SYSTEM MIGRATION
-- ============================================================
-- Complete, production-grade business architecture for Shivam Electronics.
-- Safe, additive migration: DOES NOT DROP or ALTER existing tables.
-- Run this in your Supabase SQL Editor.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. SITE SETTINGS (Key-Value configuration & schema-cache fix)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. COMPANY PROFILE (Single Source of Truth)
-- ============================================================
CREATE TABLE IF NOT EXISTS company_profile (
  id VARCHAR(100) PRIMARY KEY DEFAULT 'shivam-electronics-primary',
  legal_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  short_name VARCHAR(100) DEFAULT 'Shivam',
  tagline TEXT,
  description TEXT,
  founded_year INTEGER DEFAULT 2010,
  logo_url TEXT,
  logo_light_url TEXT,
  logo_dark_url TEXT,
  favicon_url TEXT,
  cover_image_url TEXT,
  phone VARCHAR(50) NOT NULL,
  alternate_phone VARCHAR(50),
  whatsapp VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  alternate_email VARCHAR(255),
  website VARCHAR(255),
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  area VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(50) DEFAULT 'India',
  latitude NUMERIC,
  longitude NUMERIC,
  google_maps_url TEXT,
  opening_hours TEXT NOT NULL,
  holiday_info TEXT,
  gst_number VARCHAR(50),
  business_registration_number VARCHAR(100),
  support_contact VARCHAR(50),
  sales_contact VARCHAR(50),
  social_links JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. CONTACT CHANNELS (Multi-channel outreach)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- PHONE, WHATSAPP, EMAIL, MAP, SOCIAL
  value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. BUSINESS HIGHLIGHTS & TRUST PILLARS
-- ============================================================
CREATE TABLE IF NOT EXISTS business_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  icon_name VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. COMPANY DOCUMENTS (Public & Private Repository)
-- ============================================================
CREATE TABLE IF NOT EXISTS company_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  document_type VARCHAR(50) NOT NULL, -- REGISTRATION, CERTIFICATE, WARRANTY, CATALOGUE, MANUAL, BROCHURE, POLICY, OTHER
  file_url TEXT NOT NULL,
  storage_key TEXT,
  file_name VARCHAR(255),
  mime_type VARCHAR(100),
  file_size BIGINT DEFAULT 0,
  version VARCHAR(50) DEFAULT '1.0',
  visibility VARCHAR(50) DEFAULT 'PUBLIC', -- PUBLIC, PRIVATE, ADMIN_ONLY
  status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, ARCHIVED
  sort_order INTEGER DEFAULT 0,
  uploaded_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. COMPANY POLICIES & LEGAL CONTENT
-- ============================================================
CREATE TABLE IF NOT EXISTS company_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  version VARCHAR(50) DEFAULT '1.0',
  status VARCHAR(20) DEFAULT 'PUBLISHED', -- DRAFT, PUBLISHED, ARCHIVED
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. ABOUT SECTIONS (Showroom Story & Brand Narrative)
-- ============================================================
CREATE TABLE IF NOT EXISTS about_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  section_type VARCHAR(50) NOT NULL, -- STORY, MISSION, VISION, VALUES, SHOWROOM, HIGHLIGHTS
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. CUSTOMERS & CRM
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255),
  alternate_phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  notes TEXT,
  source VARCHAR(100) DEFAULT 'DIRECT_VISIT',
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. ENQUIRY EVENTS & CRM AUDIT TRAIL
-- ============================================================
CREATE TABLE IF NOT EXISTS enquiry_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- CREATED, ASSIGNED, CONTACTED, STATUS_CHANGE, NOTE_ADDED, FOLLOW_UP_SCHEDULED
  note TEXT NOT NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. BOOKINGS & SHOWROOM VISITS
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  product_id UUID,
  product_name VARCHAR(255),
  category_id UUID,
  booking_type VARCHAR(50) NOT NULL DEFAULT 'SHOWROOM_VISIT', -- SHOWROOM_VISIT, PRODUCT_CONSULTATION, FURNITURE_CONSULTATION, DEMONSTRATION, INSTALLATION_REQUEST
  requested_date DATE NOT NULL,
  requested_time VARCHAR(50) NOT NULL,
  alternate_date DATE,
  alternate_time VARCHAR(50),
  message TEXT,
  status VARCHAR(50) DEFAULT 'REQUESTED', -- REQUESTED, CONFIRMED, RESCHEDULED, COMPLETED, CANCELLED, REJECTED
  assigned_to VARCHAR(255),
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. INVENTORY LOCATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory_locations (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  address TEXT,
  location_type VARCHAR(50) DEFAULT 'SHOWROOM', -- SHOWROOM, WAREHOUSE, DISPLAY_FLOOR
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. INVENTORY ITEMS (Per Location Stock)
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  location_id VARCHAR(100) REFERENCES inventory_locations(id) ON DELETE RESTRICT,
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 3,
  reorder_level INTEGER NOT NULL DEFAULT 5,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_product_location UNIQUE (product_id, location_id)
);

-- ============================================================
-- 13. STOCK MOVEMENTS (Auditable inventory ledger)
-- ============================================================
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  location_id VARCHAR(100) REFERENCES inventory_locations(id) ON DELETE RESTRICT,
  movement_type VARCHAR(50) NOT NULL, -- STOCK_IN, STOCK_OUT, SALE, RETURN, DAMAGE, ADJUSTMENT, TRANSFER, RESERVATION, RELEASE
  quantity INTEGER NOT NULL,
  reference_type VARCHAR(50), -- PURCHASE, ORDER, ENQUIRY, MANUAL_AUDIT
  reference_id VARCHAR(100),
  reason TEXT,
  performed_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(requested_date);
CREATE INDEX IF NOT EXISTS idx_inventory_items_product ON inventory_items(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_documents_visibility ON company_documents(visibility);
CREATE INDEX IF NOT EXISTS idx_policies_slug ON company_policies(slug);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Public READ policies for public-facing data
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read company_profile" ON company_profile FOR SELECT USING (true);
CREATE POLICY "Public read contact_channels" ON contact_channels FOR SELECT USING (is_public = true AND status = 'ACTIVE');
CREATE POLICY "Public read business_highlights" ON business_highlights FOR SELECT USING (is_active = true);
CREATE POLICY "Public read public documents" ON company_documents FOR SELECT USING (visibility = 'PUBLIC' AND status = 'ACTIVE');
CREATE POLICY "Public read published policies" ON company_policies FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public read visible about sections" ON about_sections FOR SELECT USING (is_visible = true);
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read inventory_locations" ON inventory_locations FOR SELECT USING (status = 'ACTIVE');

-- Authenticated full access
CREATE POLICY "Full access site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access company_profile" ON company_profile FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access contact_channels" ON contact_channels FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access business_highlights" ON business_highlights FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access company_documents" ON company_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access company_policies" ON company_policies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access about_sections" ON about_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access customers" ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access enquiry_events" ON enquiry_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access bookings" ON bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access inventory_locations" ON inventory_locations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access inventory_items" ON inventory_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access stock_movements" ON stock_movements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- SEED DATA (Authentic baseline for Shivam Electronics)
-- ============================================================

-- 1. Company Profile
INSERT INTO company_profile (
  id, legal_name, display_name, short_name, tagline, description,
  founded_year, phone, alternate_phone, whatsapp, email, website,
  address_line_1, address_line_2, area, city, state, postal_code, country,
  opening_hours, holiday_info, gst_number, business_registration_number,
  support_contact, sales_contact, social_links
) VALUES (
  'shivam-electronics-primary',
  'Shivam Electronics & Home Furnishings Pvt. Ltd.',
  'Shivam Electronics',
  'Shivam',
  'Technology for your home · Products for everyday living',
  'Shivam Electronics is your premier destination for 4K Smart TVs, energy-efficient refrigeration, washing machines, mobile technology and handcrafted home furniture.',
  2010,
  '+91 98765 43210',
  '+91 98765 43211',
  '+91 98765 43210',
  'info@shivamelectronics.com',
  'https://shivamelectronics.com',
  'Station Road, Main Market',
  'Opposite City Central Bank',
  'Commercial Hub',
  'Shahganj',
  'Uttar Pradesh',
  '223101',
  'India',
  'Monday – Saturday: 10:00 AM – 9:00 PM · Sunday: 11:00 AM – 7:00 PM',
  'Open 7 days a week. Closed only on national holidays.',
  '09AAACS1234F1Z5',
  'U52334UP2010PTC041234',
  '+91 98765 43210',
  '+91 98765 43210',
  '{"facebook": "https://facebook.com/shivamelectronics", "instagram": "https://instagram.com/shivamelectronics", "youtube": "https://youtube.com/@shivamelectronics", "whatsapp": "https://wa.me/919876543210"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 2. Inventory Locations
INSERT INTO inventory_locations (id, name, code, address, location_type) VALUES
('loc-showroom-main', 'Main Showroom', 'SHW-01', 'Station Road, Main Market, Shahganj', 'SHOWROOM'),
('loc-warehouse-central', 'Central Warehouse', 'WH-01', 'Plot 4, Industrial Area, Shahganj', 'WAREHOUSE')
ON CONFLICT (id) DO NOTHING;

-- 3. Business Highlights
INSERT INTO business_highlights (title, subtitle, icon_name, sort_order) VALUES
('100% Genuine Brand Warranty', 'Authorized retailer for Sony, Samsung, LG, Haier, Godrej and leading brands', 'ShieldCheck', 1),
('Free Express Home Delivery', 'Doorstep delivery and professional setup across the region within 24–48 hours', 'Truck', 2),
('Easy Zero-Cost EMI Plans', 'Instant financing with Bajai Finserv, HDB Financial, and all major credit cards', 'CreditCard', 3),
('Dedicated After-Sales Care', 'Direct showroom assistance for brand service, warranty claims, and repairs', 'Wrench', 4)
ON CONFLICT DO NOTHING;

-- 4. Company Policies
INSERT INTO company_policies (title, slug, content, version) VALUES
(
  'Privacy Policy',
  'privacy',
  '# Privacy Policy\n\n**Shivam Electronics** values your privacy. We collect customer name, phone number, and address strictly for order processing, warranty registration, and delivery coordination.\n\n### Information We Collect\n- Contact details provided during product enquiries or showroom bookings\n- Purchase details for warranty tracking and after-sales support\n\n### How We Use Your Data\n- To process product delivery and professional installation\n- To assist with brand warranty registration\n- To notify you of festive showroom offers (you can opt out anytime)\n\nWe do not sell, rent, or trade your personal information to third parties.',
  '1.0'
),
(
  'Terms & Conditions',
  'terms',
  '# Terms & Conditions\n\nWelcome to **Shivam Electronics**. By browsing our catalogue or submitting enquiries, you agree to these terms.\n\n### Product Pricing & Availability\n- Prices displayed are MRP or indicative showroom selling prices subject to prevailing in-store offers.\n- Products are subject to local showroom stock availability.\n\n### Warranty & Service\n- All electronics and appliances are covered under official manufacturer brand warranty.\n- Shivam Electronics assists in manufacturer service coordination.',
  '1.0'
),
(
  'Warranty & Support Policy',
  'warranty',
  '# Warranty & After-Sales Support\n\nEvery product sold at Shivam Electronics comes with authentic manufacturer brand warranty.\n\n### Manufacturer Warranty Coverage\n- Televisions: 1 to 3 Years Brand Warranty (Panel warranty as per brand terms)\n- Refrigerators & ACs: 10 Years Inverter Compressor Warranty\n- Washing Machines: Up to 10 Years Motor Warranty\n\n### Service Request Assistance\nIf you ever need brand service, call or WhatsApp our showroom team with your invoice number, and we will book the brand technician visit on your behalf.',
  '1.0'
)
ON CONFLICT (slug) DO NOTHING;

-- 5. About Sections
INSERT INTO about_sections (title, subtitle, content, section_type, image_url, sort_order) VALUES
(
  'Serving Families with Technology & Comfort Since 2010',
  'About Shivam Electronics',
  'Shivam Electronics was founded with a singular purpose: to bring world-class home technology, kitchen appliances, and durable home furniture to families in our region at transparent, honest prices. What started as a modest retail outlet has grown into the area’s most trusted multi-brand showroom, backed by over 15,000 satisfied households.',
  'STORY',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80',
  1
),
(
  'Our Showroom Experience',
  'Touch, Test, and Experience Before You Buy',
  'We believe buying home electronics and furniture should be a tactile, comforting experience. Our spacious showroom lets you compare OLED and 4K displays side-by-side, listen to Dolby sound systems, test inverter refrigerators, and feel the solid build quality of our handcrafted teak and engineered wood furniture.',
  'SHOWROOM',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  2
)
ON CONFLICT DO NOTHING;

-- 6. Default Site Settings entry (Prevents PGRST205)
INSERT INTO site_settings (key, value, description) VALUES
('general', '{"storeName": "Shivam Electronics", "currency": "INR", "currencySymbol": "₹"}'::jsonb, 'General store settings')
ON CONFLICT (key) DO NOTHING;
