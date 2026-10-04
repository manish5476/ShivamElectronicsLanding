-- ============================================
-- SHIVAM ELECTRONICS - DATABASE SCHEMA
-- ============================================
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- BRANDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  website TEXT,
  featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  sort_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CATEGORIES TABLE (Tree Structure)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CATEGORY ATTRIBUTES (For dynamic specifications)
-- ============================================
CREATE TABLE IF NOT EXISTS category_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL, -- text, number, boolean, select, multiselect
  options JSONB, -- For select/multiselect: ["Option1", "Option2"]
  unit VARCHAR(50), -- e.g., "inches", "GB", "Watts"
  is_required BOOLEAN DEFAULT false,
  is_filterable BOOLEAN DEFAULT true,
  is_searchable BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sku VARCHAR(100) UNIQUE,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  short_description TEXT,
  mrp DECIMAL(10, 2),
  selling_price DECIMAL(10, 2),
  offer_price DECIMAL(10, 2),
  price_display_mode VARCHAR(50) DEFAULT 'SHOW_PRICE', -- SHOW_PRICE, CONTACT_FOR_PRICE, CALL_US
  availability VARCHAR(50) DEFAULT 'IN_STOCK', -- IN_STOCK, OUT_OF_STOCK, COMING_SOON, ON_REQUEST
  stock_quantity INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  new_arrival BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  rating DECIMAL(2, 1) DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb,
  warranty TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status VARCHAR(20) DEFAULT 'ACTIVE', -- DRAFT, ACTIVE, ARCHIVED
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCT IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  source_type VARCHAR(20) DEFAULT 'UPLOAD', -- UPLOAD, URL
  image_url TEXT NOT NULL,
  storage_key TEXT,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCT SPECIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS product_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  attribute_id UUID REFERENCES category_attributes(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, attribute_id)
);

-- ============================================
-- BANNERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  desktop_image_url TEXT,
  mobile_image_url TEXT,
  desktop_storage_key TEXT,
  mobile_storage_key TEXT,
  cta_text VARCHAR(100),
  cta_link TEXT,
  cta_target_type VARCHAR(50), -- PRODUCT, CATEGORY, BRAND, OFFER, URL
  status VARCHAR(20) DEFAULT 'ACTIVE', -- DRAFT, ACTIVE, SCHEDULED, EXPIRED, PAUSED
  priority INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  background_type VARCHAR(50) DEFAULT 'IMAGE', -- IMAGE, COLOR, GRADIENT
  overlay_opacity DECIMAL(3, 2) DEFAULT 0.5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OFFERS/PROMOTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  offer_type VARCHAR(50) NOT NULL, -- PERCENTAGE, FIXED, BUNDLE, FREEBIE
  discount_value DECIMAL(10, 2),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'ACTIVE', -- DRAFT, ACTIVE, SCHEDULED, EXPIRED, PAUSED
  priority INTEGER DEFAULT 0,
  applicable_to VARCHAR(50) DEFAULT 'ALL', -- ALL, PRODUCTS, CATEGORIES, BRANDS
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OFFER PRODUCTS (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS offer_products (
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (offer_id, product_id)
);

-- ============================================
-- OFFER CATEGORIES (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS offer_categories (
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (offer_id, category_id)
);

-- ============================================
-- OFFER BRANDS (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS offer_brands (
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  PRIMARY KEY (offer_id, brand_id)
);

-- ============================================
-- ENQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  enquiry_type VARCHAR(50) DEFAULT 'PRODUCT', -- PRODUCT, GENERAL, CALLBACK
  message TEXT,
  quantity INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'NEW', -- NEW, CONTACTED, FOLLOW_UP, CONVERTED, CLOSED
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_popular ON products(popular);
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(new_arrival);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_specifications_product ON product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_category_attributes_category ON category_attributes(category_id);
CREATE INDEX IF NOT EXISTS idx_banners_status ON banners(status);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ: Anyone can view active products, categories, brands, banners, offers
CREATE POLICY "Public can view active brands" ON brands
  FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Public can view category attributes" ON category_attributes
  FOR SELECT USING (true);

CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Public can view product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Public can view product specifications" ON product_specifications
  FOR SELECT USING (true);

CREATE POLICY "Public can view active banners" ON banners
  FOR SELECT USING (status = 'ACTIVE' AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));

CREATE POLICY "Public can view active offers" ON offers
  FOR SELECT USING (status = 'ACTIVE' AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));

CREATE POLICY "Public can view offer products" ON offer_products
  FOR SELECT USING (true);

CREATE POLICY "Public can view offer categories" ON offer_categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view offer brands" ON offer_brands
  FOR SELECT USING (true);

-- PUBLIC WRITE: Anyone can create enquiries
CREATE POLICY "Public can create enquiries" ON enquiries
  FOR INSERT WITH CHECK (true);

-- ADMIN ONLY: Authenticated users can manage everything
CREATE POLICY "Admin can manage brands" ON brands
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage category attributes" ON category_attributes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage product images" ON product_images
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage product specifications" ON product_specifications
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage banners" ON banners
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage offers" ON offers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage offer products" ON offer_products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage offer categories" ON offer_categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage offer brands" ON offer_brands
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can view all enquiries" ON enquiries
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update enquiries" ON enquiries
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete enquiries" ON enquiries
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_enquiries_updated_at
  BEFORE UPDATE ON enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Create storage buckets for products, banners, and brands
-- Run this separately in Supabase Dashboard → Storage
-- Or use the SQL below:

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('products', 'products', true),
  ('banners', 'banners', true),
  ('brands', 'brands', true),
  ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to storage
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Public can view banner images" ON storage.objects
  FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Public can view brand logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'brands');

CREATE POLICY "Public can view category images" ON storage.objects
  FOR SELECT USING (bucket_id = 'categories');

-- Allow authenticated users to upload
CREATE POLICY "Admin can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('products', 'banners', 'brands', 'categories') AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Admin can delete images" ON storage.objects
  FOR DELETE USING (bucket_id IN ('products', 'banners', 'brands', 'categories') AND auth.role() = 'authenticated');

-- ============================================
-- SAMPLE DATA (Optional - Remove if not needed)
-- ============================================

-- Sample brands
INSERT INTO brands (name, slug, description, featured, sort_order) VALUES
  ('Samsung', 'samsung', 'Leading electronics manufacturer', true, 1),
  ('LG', 'lg', 'Life is Good', true, 2),
  ('Sony', 'sony', 'Premium electronics and entertainment', true, 3),
  ('Whirlpool', 'whirlpool', 'Home appliance experts', true, 4),
  ('Haier', 'haier', 'Smart home solutions', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Sample categories
INSERT INTO categories (name, slug, description, featured, sort_order) VALUES
  ('Televisions', 'televisions', 'Smart TVs, LED TVs, and more', true, 1),
  ('Smartphones', 'smartphones', 'Latest smartphones and mobile accessories', true, 2),
  ('Refrigerators', 'refrigerators', 'Single door, double door, side by side', true, 3),
  ('Washing Machines', 'washing-machines', 'Front load, top load, semi-automatic', true, 4),
  ('Air Conditioners', 'air-conditioners', 'Split AC, window AC, portable AC', true, 5),
  ('Home Appliances', 'home-appliances', 'Microwave, mixer grinder, and more', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- DONE! Your database is ready.
-- ============================================
-- Next steps:
-- 1. Create storage buckets in Supabase Dashboard
-- 2. Go to Authentication → Users → Add User
-- 3. Create admin user with email and password
-- 4. Copy your project URL and anon key
-- 5. Add them to your .env file
-- ============================================
