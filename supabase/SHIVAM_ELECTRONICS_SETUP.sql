-- ============================================================
-- SHIVAM ELECTRONICS - COMPLETE SUPABASE DATABASE SETUP
-- ============================================================
-- Instructions:
--   1. Go to your Supabase project dashboard
--   2. Click SQL Editor → New Query
--   3. Paste this ENTIRE file and click Run
--   4. Then go to Authentication → Users → Invite User
--      to create your admin account
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- STEP 1: CORE TABLES
-- ============================================================

-- BRANDS TABLE
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

-- CATEGORIES TABLE (supports parent-child tree)
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

-- CATEGORY ATTRIBUTES (for dynamic product specs)
CREATE TABLE IF NOT EXISTS category_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL, -- text, number, boolean, select, multiselect
  options JSONB,                   -- For select/multiselect: ["Option1", "Option2"]
  unit VARCHAR(50),                -- e.g., "inches", "GB", "Watts"
  is_required BOOLEAN DEFAULT false,
  is_filterable BOOLEAN DEFAULT true,
  is_searchable BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS TABLE
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
  price_display_mode VARCHAR(50) DEFAULT 'SHOW_PRICE',
  availability VARCHAR(50) DEFAULT 'IN_STOCK',
  stock_quantity INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  new_arrival BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  rating DECIMAL(2, 1) DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb,
  warranty TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  source_type VARCHAR(20) DEFAULT 'UPLOAD',
  image_url TEXT NOT NULL,
  storage_key TEXT,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT SPECIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS product_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  attribute_id UUID REFERENCES category_attributes(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, attribute_id)
);

-- BANNERS TABLE
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
  cta_target_type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  priority INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  background_type VARCHAR(50) DEFAULT 'IMAGE',
  overlay_opacity DECIMAL(3, 2) DEFAULT 0.5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OFFERS/PROMOTIONS TABLE
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  offer_type VARCHAR(50) NOT NULL,
  discount_value DECIMAL(10, 2),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  priority INTEGER DEFAULT 0,
  applicable_to VARCHAR(50) DEFAULT 'ALL',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OFFER RELATIONS (Many-to-Many)
CREATE TABLE IF NOT EXISTS offer_products (
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (offer_id, product_id)
);

CREATE TABLE IF NOT EXISTS offer_categories (
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (offer_id, category_id)
);

CREATE TABLE IF NOT EXISTS offer_brands (
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  PRIMARY KEY (offer_id, brand_id)
);

-- ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  enquiry_type VARCHAR(50) DEFAULT 'PRODUCT',
  message TEXT,
  quantity INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'NEW',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STEP 2: INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand       ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_status      ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured    ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_popular     ON products(popular);
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(new_arrival);
CREATE INDEX IF NOT EXISTS idx_product_images_product      ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_specifications_prod ON product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent           ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_category_attributes_cat     ON category_attributes(category_id);
CREATE INDEX IF NOT EXISTS idx_banners_status              ON banners(status);
CREATE INDEX IF NOT EXISTS idx_offers_status               ON offers(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status            ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created           ON enquiries(created_at DESC);

-- ============================================================
-- STEP 3: AUTO-UPDATED TIMESTAMPS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to each table that has updated_at
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_brands_updated_at') THEN
    CREATE TRIGGER update_brands_updated_at
      BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at') THEN
    CREATE TRIGGER update_categories_updated_at
      BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_products_updated_at') THEN
    CREATE TRIGGER update_products_updated_at
      BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_banners_updated_at') THEN
    CREATE TRIGGER update_banners_updated_at
      BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_offers_updated_at') THEN
    CREATE TRIGGER update_offers_updated_at
      BEFORE UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_enquiries_updated_at') THEN
    CREATE TRIGGER update_enquiries_updated_at
      BEFORE UPDATE ON enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- ============================================================
-- STEP 4: ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE brands                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories             ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_attributes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products               ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners                ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_brands           ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries              ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
DROP POLICY IF EXISTS "Public read active brands"      ON brands;
DROP POLICY IF EXISTS "Public read active categories"  ON categories;
DROP POLICY IF EXISTS "Public read category attributes" ON category_attributes;
DROP POLICY IF EXISTS "Public read active products"    ON products;
DROP POLICY IF EXISTS "Public read product images"     ON product_images;
DROP POLICY IF EXISTS "Public read product specs"      ON product_specifications;
DROP POLICY IF EXISTS "Public read active banners"     ON banners;
DROP POLICY IF EXISTS "Public read active offers"      ON offers;
DROP POLICY IF EXISTS "Public read offer products"     ON offer_products;
DROP POLICY IF EXISTS "Public read offer categories"   ON offer_categories;
DROP POLICY IF EXISTS "Public read offer brands"       ON offer_brands;
DROP POLICY IF EXISTS "Public create enquiries"        ON enquiries;

CREATE POLICY "Public read active brands"
  ON brands FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Public read active categories"
  ON categories FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Public read category attributes"
  ON category_attributes FOR SELECT USING (true);

CREATE POLICY "Public read active products"
  ON products FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Public read product images"
  ON product_images FOR SELECT USING (true);

CREATE POLICY "Public read product specs"
  ON product_specifications FOR SELECT USING (true);

CREATE POLICY "Public read active banners"
  ON banners FOR SELECT USING (
    status = 'ACTIVE'
    AND (start_date IS NULL OR start_date <= NOW())
    AND (end_date   IS NULL OR end_date   >= NOW())
  );

CREATE POLICY "Public read active offers"
  ON offers FOR SELECT USING (
    status = 'ACTIVE'
    AND (start_date IS NULL OR start_date <= NOW())
    AND (end_date   IS NULL OR end_date   >= NOW())
  );

CREATE POLICY "Public read offer products"    ON offer_products    FOR SELECT USING (true);
CREATE POLICY "Public read offer categories"  ON offer_categories  FOR SELECT USING (true);
CREATE POLICY "Public read offer brands"      ON offer_brands      FOR SELECT USING (true);

-- Anyone can submit an enquiry
CREATE POLICY "Public create enquiries"
  ON enquiries FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS (authenticated users manage everything)
DROP POLICY IF EXISTS "Admin manage brands"      ON brands;
DROP POLICY IF EXISTS "Admin manage categories"  ON categories;
DROP POLICY IF EXISTS "Admin manage attributes"  ON category_attributes;
DROP POLICY IF EXISTS "Admin manage products"    ON products;
DROP POLICY IF EXISTS "Admin manage images"      ON product_images;
DROP POLICY IF EXISTS "Admin manage specs"       ON product_specifications;
DROP POLICY IF EXISTS "Admin manage banners"     ON banners;
DROP POLICY IF EXISTS "Admin manage offers"      ON offers;
DROP POLICY IF EXISTS "Admin manage offer_prod"  ON offer_products;
DROP POLICY IF EXISTS "Admin manage offer_cat"   ON offer_categories;
DROP POLICY IF EXISTS "Admin manage offer_brand" ON offer_brands;
DROP POLICY IF EXISTS "Admin view enquiries"     ON enquiries;
DROP POLICY IF EXISTS "Admin update enquiries"   ON enquiries;
DROP POLICY IF EXISTS "Admin delete enquiries"   ON enquiries;

CREATE POLICY "Admin manage brands"      ON brands              FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage categories"  ON categories          FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage attributes"  ON category_attributes FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage products"    ON products            FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage images"      ON product_images      FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage specs"       ON product_specifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage banners"     ON banners             FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage offers"      ON offers              FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage offer_prod"  ON offer_products      FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage offer_cat"   ON offer_categories    FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage offer_brand" ON offer_brands        FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin view enquiries"     ON enquiries           FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update enquiries"   ON enquiries           FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete enquiries"   ON enquiries           FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- STEP 5: STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('products',   'products',   true),
  ('banners',    'banners',    true),
  ('brands',     'brands',     true),
  ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- Drop old policies first (safe re-run)
DROP POLICY IF EXISTS "Public read products bucket"    ON storage.objects;
DROP POLICY IF EXISTS "Public read banners bucket"     ON storage.objects;
DROP POLICY IF EXISTS "Public read brands bucket"      ON storage.objects;
DROP POLICY IF EXISTS "Public read categories bucket"  ON storage.objects;
DROP POLICY IF EXISTS "Admin upload to buckets"        ON storage.objects;
DROP POLICY IF EXISTS "Admin delete from buckets"      ON storage.objects;

CREATE POLICY "Public read products bucket"
  ON storage.objects FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Public read banners bucket"
  ON storage.objects FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Public read brands bucket"
  ON storage.objects FOR SELECT USING (bucket_id = 'brands');

CREATE POLICY "Public read categories bucket"
  ON storage.objects FOR SELECT USING (bucket_id = 'categories');

CREATE POLICY "Admin upload to buckets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('products', 'banners', 'brands', 'categories')
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin delete from buckets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('products', 'banners', 'brands', 'categories')
    AND auth.role() = 'authenticated'
  );

-- ============================================================
-- STEP 6: SAMPLE DATA (remove if not needed)
-- ============================================================

INSERT INTO brands (name, slug, description, featured, sort_order) VALUES
  ('Samsung',   'samsung',   'Leading electronics manufacturer',      true, 1),
  ('LG',        'lg',        'Life is Good',                          true, 2),
  ('Sony',      'sony',      'Premium electronics and entertainment', true, 3),
  ('Whirlpool', 'whirlpool', 'Home appliance experts',                true, 4),
  ('Haier',     'haier',     'Smart home solutions',                  true, 5),
  ('Voltas',    'voltas',    'Cooling solutions for every home',      true, 6),
  ('Bosch',     'bosch',     'Technology that is Life',               true, 7),
  ('Panasonic', 'panasonic', 'A Better Life, A Better World',         false, 8)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, featured, sort_order) VALUES
  ('Televisions',      'televisions',      'Smart TVs, LED TVs, and more',                       true,  1),
  ('Smartphones',      'smartphones',      'Latest smartphones and mobile accessories',           true,  2),
  ('Refrigerators',    'refrigerators',    'Single door, double door, side by side',              true,  3),
  ('Washing Machines', 'washing-machines', 'Front load, top load, semi-automatic',                true,  4),
  ('Air Conditioners', 'air-conditioners', 'Split AC, window AC, portable AC',                   true,  5),
  ('Home Appliances',  'home-appliances',  'Microwave, mixer grinder, and more',                  true,  6),
  ('Laptops',          'laptops',          'Notebooks, ultrabooks, and gaming laptops',           false, 7),
  ('Audio',            'audio',            'Headphones, speakers, soundbars',                    false, 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- DONE! Your Shivam Electronics database is ready.
-- ============================================================
-- Next steps:
--   1. Authentication → Users → Invite User (create your admin)
--   2. Copy your Project URL and anon key from:
--      Settings → API → Project URL / anon public key
--   3. Add to your .env file:
--        VITE_SUPABASE_URL=https://xxxxx.supabase.co
--        VITE_SUPABASE_ANON_KEY=eyJhbGci...
--   4. Run: npm run dev
--   5. Open: http://localhost:5173/#/admin/login
-- ============================================================
