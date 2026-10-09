-- ============================================================
-- SHIVAM ELECTRONICS - SECURITY HARDENING & RLS POLICIES
-- ============================================================
-- Purpose:
--   Protects your Supabase database against unauthorized writes,
--   tampering, or data deletion when your public anon key is
--   exposed on client-side hosting (such as GitHub Pages).
--
-- Instructions:
--   1. Go to your Supabase Project Dashboard
--   2. Navigate to: SQL Editor → New query
--   3. Paste this ENTIRE file and click "Run" (Ctrl+Enter)
-- ============================================================

-- ─── 1. PRODUCTS TABLE ──────────────────────────────────────
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;

CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (status = 'ACTIVE' OR status IS NULL);

CREATE POLICY "Admin can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── 2. CATEGORIES TABLE ────────────────────────────────────
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;

CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── 3. BRANDS TABLE ────────────────────────────────────────
ALTER TABLE IF EXISTS brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view brands" ON brands;
DROP POLICY IF EXISTS "Admin can manage brands" ON brands;

CREATE POLICY "Public can view brands" ON brands
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage brands" ON brands
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── 4. PRODUCT IMAGES & SPECS ──────────────────────────────
ALTER TABLE IF EXISTS product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS product_specifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view product images" ON product_images;
DROP POLICY IF EXISTS "Admin manage product images" ON product_images;
DROP POLICY IF EXISTS "Public view product specs" ON product_specifications;
DROP POLICY IF EXISTS "Admin manage product specs" ON product_specifications;

CREATE POLICY "Public view product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Admin manage product images" ON product_images
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public view product specs" ON product_specifications
  FOR SELECT USING (true);

CREATE POLICY "Admin manage product specs" ON product_specifications
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── 5. COMPANY PROFILE (CRITICAL VULNERABILITY FIX) ─────────
-- Previously open to unauthorized updates via anon key.
ALTER TABLE IF EXISTS company_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view company profile" ON company_profile;
DROP POLICY IF EXISTS "Admin can manage company profile" ON company_profile;

CREATE POLICY "Public can view company profile" ON company_profile
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage company profile" ON company_profile
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── 6. SITE SETTINGS ───────────────────────────────────────
ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Admin can manage site settings" ON site_settings;

CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage site settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── 7. BANNERS & OFFERS ────────────────────────────────────
ALTER TABLE IF EXISTS banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view banners" ON banners;
DROP POLICY IF EXISTS "Admin manage banners" ON banners;
DROP POLICY IF EXISTS "Public view offers" ON offers;
DROP POLICY IF EXISTS "Admin manage offers" ON offers;

CREATE POLICY "Public view banners" ON banners
  FOR SELECT USING (true);

CREATE POLICY "Admin manage banners" ON banners
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public view offers" ON offers
  FOR SELECT USING (true);

CREATE POLICY "Admin manage offers" ON offers
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── 8. ENQUIRIES & PURCHASE TOKENS (LEAD PROTECTION) ───────
-- Public/anon can ONLY INSERT (submit leads & tokens).
-- Anonymous users CANNOT read, update, or delete enquiries.
ALTER TABLE IF EXISTS enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can create enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admin can view all enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admin can update enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admin can delete enquiries" ON enquiries;

CREATE POLICY "Public can create enquiries" ON enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all enquiries" ON enquiries
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update enquiries" ON enquiries
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete enquiries" ON enquiries
  FOR DELETE USING (auth.role() = 'authenticated');

-- ─── 9. STORAGE BUCKETS SECURITY ────────────────────────────
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete images" ON storage.objects;

CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id IN ('products', 'banners', 'brands', 'categories'));

CREATE POLICY "Admin can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('products', 'banners', 'brands', 'categories') AND auth.role() = 'authenticated');

CREATE POLICY "Admin can delete images" ON storage.objects
  FOR DELETE USING (bucket_id IN ('products', 'banners', 'brands', 'categories') AND auth.role() = 'authenticated');

-- ============================================================
-- VERIFICATION QUERY
-- Run this to confirm RLS is active across all tables:
-- ============================================================
SELECT 
  tablename, 
  rowsecurity AS rls_enabled 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
