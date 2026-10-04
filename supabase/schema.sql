-- ============================================
-- MIMIKO STUDIO - SUPABASE DATABASE SCHEMA
-- ============================================
-- Run this entire script in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste → Run)
-- ============================================

-- 1. COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  cover_image TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DESIGNS TABLE
CREATE TABLE IF NOT EXISTS designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  price TEXT,
  price_type TEXT DEFAULT 'starting',
  availability TEXT DEFAULT 'made-to-order',
  customizable BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  material TEXT,
  craft TEXT,
  occasion TEXT,
  care TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DESIGN IMAGES TABLE
CREATE TABLE IF NOT EXISTS design_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  design_id UUID,
  design_name TEXT,
  collection TEXT,
  occasion TEXT,
  requested_date DATE,
  quantity INTEGER DEFAULT 1,
  customization TEXT DEFAULT 'no',
  color_preference TEXT,
  size_details TEXT,
  notes TEXT,
  status TEXT DEFAULT 'NEW',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_designs_collection ON designs(collection_id);
CREATE INDEX IF NOT EXISTS idx_designs_slug ON designs(slug);
CREATE INDEX IF NOT EXISTS idx_designs_featured ON designs(featured);
CREATE INDEX IF NOT EXISTS idx_design_images_design ON design_images(design_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ: Anyone can view collections, designs, and images
CREATE POLICY "Public can view collections" ON collections
  FOR SELECT USING (true);

CREATE POLICY "Public can view designs" ON designs
  FOR SELECT USING (true);

CREATE POLICY "Public can view design images" ON design_images
  FOR SELECT USING (true);

-- PUBLIC WRITE: Anyone can create bookings and contact messages
CREATE POLICY "Public can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- ADMIN ONLY: Only authenticated users can modify designs, collections, images
-- (After setting up admin user in Supabase Auth)
CREATE POLICY "Admin can manage collections" ON collections
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage designs" ON designs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage design images" ON design_images
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can view all bookings" ON bookings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update bookings" ON bookings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete bookings" ON bookings
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can view all messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete messages" ON contact_messages
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- DEFAULT COLLECTIONS
-- ============================================
INSERT INTO collections (name, slug, description, featured, sort_order) VALUES
  ('Jewellery', 'jewellery', 'Timeless pieces designed to complement every occasion.', true, 1),
  ('Traditional Ornaments', 'traditional-ornaments', 'Celebrating Indian craftsmanship and tradition.', true, 2),
  ('Embroidery', 'embroidery', 'Detailed handcrafted embroidery created with patience and artistry.', true, 3),
  ('Navratri Collection', 'navratri', 'Celebrate every Garba night with handcrafted festive ornaments.', true, 4),
  ('Custom Designs', 'custom', 'Have something special in mind? Let us create it for you.', true, 5)
ON CONFLICT (slug) DO NOTHING;

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
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_designs_updated_at
  BEFORE UPDATE ON designs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Create a storage bucket for design images
-- Run this separately in Supabase Dashboard → Storage
-- Or use the SQL below:

INSERT INTO storage.buckets (id, name, public)
VALUES ('designs', 'designs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to storage
CREATE POLICY "Public can view design images" ON storage.objects
  FOR SELECT USING (bucket_id = 'designs');

-- Allow authenticated users to upload
CREATE POLICY "Admin can upload design images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'designs' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Admin can delete design images" ON storage.objects
  FOR DELETE USING (bucket_id = 'designs' AND auth.role() = 'authenticated');

-- ============================================
-- DONE! Your database is ready.
-- ============================================
-- Next steps:
-- 1. Go to Authentication → Users → Add User
-- 2. Create admin user with email and password
-- 3. Copy your project URL and anon key
-- 4. Add them to your .env file
-- ============================================
