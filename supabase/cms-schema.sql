-- ============================================
-- MIMIKO STUDIO - VISUAL CMS EXTENSION
-- ============================================
-- Run this AFTER the original schema.sql
-- ============================================

-- 1. APPEARANCE SETTINGS (single row - site-wide theme)
CREATE TABLE IF NOT EXISTS appearance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT DEFAULT 'Default Theme',
  -- Colors
  primary_color TEXT DEFAULT '#C6A15B',
  secondary_color TEXT DEFAULT '#EFE6D6',
  accent_color TEXT DEFAULT '#C6A15B',
  background_color TEXT DEFAULT '#F8F4EC',
  surface_color TEXT DEFAULT '#FFFFFF',
  dark_background TEXT DEFAULT '#241C17',
  text_color TEXT DEFAULT '#302821',
  muted_text_color TEXT DEFAULT '#75695C',
  border_color TEXT DEFAULT '#E8D5B5',
  -- Typography
  heading_font TEXT DEFAULT 'Cormorant Garamond',
  body_font TEXT DEFAULT 'Inter',
  heading_weight INTEGER DEFAULT 600,
  body_weight INTEGER DEFAULT 400,
  heading_size_multiplier REAL DEFAULT 1.0,
  -- Shapes
  border_radius INTEGER DEFAULT 4,
  card_radius INTEGER DEFAULT 8,
  button_radius INTEGER DEFAULT 4,
  image_style TEXT DEFAULT 'rounded',
  -- Effects
  shadow_intensity TEXT DEFAULT 'subtle',
  animation_intensity TEXT DEFAULT 'elegant',
  section_spacing TEXT DEFAULT 'comfortable',
  -- Header/Footer
  header_style TEXT DEFAULT 'luxury',
  header_transparent BOOLEAN DEFAULT false,
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MEDIA ASSETS (central image library)
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT DEFAULT 'URL', -- 'UPLOAD' or 'URL'
  url TEXT NOT NULL,
  storage_key TEXT,
  alt_text TEXT DEFAULT '',
  name TEXT DEFAULT '',
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HOMEPAGE (the homepage configuration)
CREATE TABLE IF NOT EXISTS homepages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT DEFAULT 'Main Homepage',
  status TEXT DEFAULT 'published', -- 'draft' or 'published'
  version INTEGER DEFAULT 1,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HOMEPAGE SECTIONS (reusable content blocks)
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homepage_id UUID REFERENCES homepages(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- hero, collection_grid, featured_designs, split_content, dark_showcase, cta, gallery, announcement
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'light', -- 'light' or 'dark'
  -- Flexible config stored as JSON
  config JSONB DEFAULT '{}'::jsonb,
  -- Responsive overrides (optional)
  mobile_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HOMEPAGE VERSIONS (for restore)
CREATE TABLE IF NOT EXISTS homepage_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homepage_id UUID REFERENCES homepages(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  sections_snapshot JSONB NOT NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE SETTINGS (contact info, social links, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_homepage_sections_homepage ON homepage_sections(homepage_id);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_order ON homepage_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_media_assets_created ON media_assets(created_at DESC);

-- RLS Policies
ALTER TABLE appearance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepages ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read for appearance + homepage + sections + media + site_settings
CREATE POLICY "Public can view appearance" ON appearance_settings FOR SELECT USING (true);
CREATE POLICY "Public can view media" ON media_assets FOR SELECT USING (true);
CREATE POLICY "Public can view homepages" ON homepages FOR SELECT USING (true);
CREATE POLICY "Public can view sections" ON homepage_sections FOR SELECT USING (true);
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);

-- Admin can manage all
CREATE POLICY "Admin can manage appearance" ON appearance_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage media" ON media_assets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage homepages" ON homepages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage sections" ON homepage_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage versions" ON homepage_versions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view media files" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Admin can upload media files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Admin can delete media files" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- ============================================
-- SEED DATA
-- ============================================

-- Default appearance
INSERT INTO appearance_settings (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Theme')
ON CONFLICT (id) DO NOTHING;

-- Default homepage
INSERT INTO homepages (id, name, status, published_at)
VALUES ('00000000-0000-0000-0000-000000000002', 'Main Homepage', 'published', NOW())
ON CONFLICT (id) DO NOTHING;

-- Default sections
INSERT INTO homepage_sections (homepage_id, type, enabled, sort_order, theme, config) VALUES
  ('00000000-0000-0000-0000-000000000002', 'hero', true, 1, 'light', '{
    "label": "MIMIKO ATELIER",
    "heading": "Crafted to Adorn. Designed to Remember.",
    "description": "Discover handcrafted jewellery, traditional ornaments and artistic creations made for your most beautiful occasions.",
    "primaryButton": {"text": "Explore Collection", "link": "/collections"},
    "secondaryButton": {"text": "Book Consultation", "link": "/booking"},
    "image": {"sourceType": "URL", "url": "https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=1600&q=80", "alt": "Mimiko Studio"},
    "style": "editorial",
    "height": "full"
  }'),
  ('00000000-0000-0000-0000-000000000002', 'collection_grid', true, 2, 'light', '{
    "label": "Curated Collections",
    "heading": "Discover Our World",
    "layout": "editorial"
  }'),
  ('00000000-0000-0000-0000-000000000002', 'dark_showcase', true, 3, 'dark', '{
    "label": "The Art of Adornment",
    "heading": "The Art of Adornment",
    "description": "Every piece from Mimiko Studio is a celebration of Indian artistry — handcrafted with patience, designed with intention.",
    "backgroundImage": {"sourceType": "URL", "url": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&q=80"}
  }'),
  ('00000000-0000-0000-0000-000000000002', 'featured_designs', true, 4, 'light', '{
    "label": "Featured Pieces",
    "heading": "Signature Designs",
    "count": 6
  }'),
  ('00000000-0000-0000-0000-000000000002', 'split_content', true, 5, 'light', '{
    "label": "Festive Collection",
    "heading": "The Navratri Edit",
    "subheading": "Handcrafted ornaments for every Garba night.",
    "description": "Nine nights of dance, color, and celebration deserve ornaments that move with you.",
    "image": {"sourceType": "URL", "url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80", "alt": "Navratri"},
    "primaryButton": {"text": "Explore Navratri", "link": "/navratri"},
    "secondaryButton": {"text": "Book Festive Design", "link": "/booking"},
    "imagePosition": "left",
    "theme": "dark"
  }'),
  ('00000000-0000-0000-0000-000000000002', 'split_content', true, 6, 'light', '{
    "label": "The Art of Embroidery",
    "heading": "Art in Every Stitch",
    "description": "Our embroidery work is a labor of love — each stitch placed with intention, each pattern drawn from tradition.",
    "image": {"sourceType": "URL", "url": "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80", "alt": "Embroidery"},
    "primaryButton": {"text": "Discover Our Craft", "link": "/embroidery"},
    "imagePosition": "right"
  }'),
  ('00000000-0000-0000-0000-000000000002', 'cta', true, 7, 'dark', '{
    "heading": "Made Especially for You",
    "description": "Have a specific colour, pattern, occasion or design in mind? Share your idea with Mimiko Studio.",
    "button": {"text": "Request Custom Design", "link": "/custom-design"},
    "backgroundImage": {"sourceType": "URL", "url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1400&q=80"}
  }'),
  ('00000000-0000-0000-0000-000000000002', 'gallery', true, 8, 'light', '{
    "label": "Our Creations",
    "heading": "Visual Journey",
    "count": 8
  }'),
  ('00000000-0000-0000-0000-000000000002', 'booking_cta', true, 9, 'light', '{
    "heading": "Find Something You Love?",
    "description": "Browse our collections, discover designs you love, and book them for your special occasion.",
    "primaryButton": {"text": "Explore Collections", "link": "/collections"},
    "secondaryButton": {"text": "Book a Design", "link": "/booking"}
  }')
ON CONFLICT DO NOTHING;

-- Default site settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'Mimiko Studio'),
  ('site_tagline', 'Crafted to Adorn. Designed to Remember.'),
  ('contact_email', 'hello@mimikostudio.com'),
  ('contact_phone', ''),
  ('contact_whatsapp', ''),
  ('instagram_url', 'https://instagram.com/mimikostudio'),
  ('facebook_url', ''),
  ('youtube_url', ''),
  ('pinterest_url', '')
ON CONFLICT (key) DO NOTHING;

-- Trigger for updated_at
CREATE TRIGGER update_appearance_updated_at
  BEFORE UPDATE ON appearance_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_homepages_updated_at
  BEFORE UPDATE ON homepages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_homepage_sections_updated_at
  BEFORE UPDATE ON homepage_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
