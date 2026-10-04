import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Copy, ExternalLink, Database, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { supabase } from '../../lib/supabase';

// The full SQL to create all tables — embedded so users can copy with one click
const SETUP_SQL = `-- ============================================================
-- SHIVAM ELECTRONICS - COMPLETE SUPABASE DATABASE SETUP
-- ============================================================
-- HOW TO RUN:
--   1. Click the button below to copy this SQL
--   2. The Supabase SQL Editor will open automatically
--   3. Paste (Ctrl+V) → Click "Run"
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- BRANDS
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT, description TEXT, website TEXT,
  featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  sort_order INTEGER DEFAULT 0,
  seo_title TEXT, seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT, image_url TEXT, icon_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  seo_title TEXT, seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORY ATTRIBUTES
CREATE TABLE IF NOT EXISTS category_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL,
  options JSONB, unit VARCHAR(50),
  is_required BOOLEAN DEFAULT false,
  is_filterable BOOLEAN DEFAULT true,
  is_searchable BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sku VARCHAR(100) UNIQUE,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT, short_description TEXT,
  mrp DECIMAL(10,2), selling_price DECIMAL(10,2), offer_price DECIMAL(10,2),
  price_display_mode VARCHAR(50) DEFAULT 'SHOW_PRICE',
  availability VARCHAR(50) DEFAULT 'IN_STOCK',
  stock_quantity INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  new_arrival BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb,
  warranty TEXT, seo_title TEXT, seo_description TEXT,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  source_type VARCHAR(20) DEFAULT 'UPLOAD',
  image_url TEXT NOT NULL, storage_key TEXT, alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT SPECIFICATIONS
CREATE TABLE IF NOT EXISTS product_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  attribute_id UUID REFERENCES category_attributes(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, attribute_id)
);

-- BANNERS
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL, subtitle TEXT, description TEXT,
  desktop_image_url TEXT, mobile_image_url TEXT,
  desktop_storage_key TEXT, mobile_storage_key TEXT,
  cta_text VARCHAR(100), cta_link TEXT, cta_target_type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  priority INTEGER DEFAULT 0, start_date TIMESTAMPTZ, end_date TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  background_type VARCHAR(50) DEFAULT 'IMAGE',
  overlay_opacity DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OFFERS
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL, slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT, offer_type VARCHAR(50) NOT NULL,
  discount_value DECIMAL(10,2),
  start_date TIMESTAMPTZ, end_date TIMESTAMPTZ,
  image_url TEXT, status VARCHAR(20) DEFAULT 'ACTIVE',
  priority INTEGER DEFAULT 0,
  applicable_to VARCHAR(50) DEFAULT 'ALL',
  seo_title TEXT, seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- ENQUIRIES
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  enquiry_type VARCHAR(50) DEFAULT 'PRODUCT',
  message TEXT, quantity INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'NEW', notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_banners_status ON banners(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);

-- AUTO-TIMESTAMP FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_brands_updated_at') THEN
    CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at') THEN
    CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_products_updated_at') THEN
    CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_banners_updated_at') THEN
    CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_enquiries_updated_at') THEN
    CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- ROW LEVEL SECURITY
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

-- Drop old policies (safe re-run)
DROP POLICY IF EXISTS "Public read active brands" ON brands;
DROP POLICY IF EXISTS "Public read active categories" ON categories;
DROP POLICY IF EXISTS "Public read category attributes" ON category_attributes;
DROP POLICY IF EXISTS "Public read active products" ON products;
DROP POLICY IF EXISTS "Public read product images" ON product_images;
DROP POLICY IF EXISTS "Public read product specs" ON product_specifications;
DROP POLICY IF EXISTS "Public read active banners" ON banners;
DROP POLICY IF EXISTS "Public read active offers" ON offers;
DROP POLICY IF EXISTS "Public read offer products" ON offer_products;
DROP POLICY IF EXISTS "Public read offer categories" ON offer_categories;
DROP POLICY IF EXISTS "Public read offer brands" ON offer_brands;
DROP POLICY IF EXISTS "Public create enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admin manage brands" ON brands;
DROP POLICY IF EXISTS "Admin manage categories" ON categories;
DROP POLICY IF EXISTS "Admin manage attributes" ON category_attributes;
DROP POLICY IF EXISTS "Admin manage products" ON products;
DROP POLICY IF EXISTS "Admin manage images" ON product_images;
DROP POLICY IF EXISTS "Admin manage specs" ON product_specifications;
DROP POLICY IF EXISTS "Admin manage banners" ON banners;
DROP POLICY IF EXISTS "Admin manage offers" ON offers;
DROP POLICY IF EXISTS "Admin manage offer_prod" ON offer_products;
DROP POLICY IF EXISTS "Admin manage offer_cat" ON offer_categories;
DROP POLICY IF EXISTS "Admin manage offer_brand" ON offer_brands;
DROP POLICY IF EXISTS "Admin view enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admin update enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admin delete enquiries" ON enquiries;

-- Public read policies
CREATE POLICY "Public read active brands" ON brands FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Public read category attributes" ON category_attributes FOR SELECT USING (true);
CREATE POLICY "Public read active products" ON products FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Public read product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read product specs" ON product_specifications FOR SELECT USING (true);
CREATE POLICY "Public read active banners" ON banners FOR SELECT USING (status = 'ACTIVE' AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));
CREATE POLICY "Public read active offers" ON offers FOR SELECT USING (status = 'ACTIVE' AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));
CREATE POLICY "Public read offer products" ON offer_products FOR SELECT USING (true);
CREATE POLICY "Public read offer categories" ON offer_categories FOR SELECT USING (true);
CREATE POLICY "Public read offer brands" ON offer_brands FOR SELECT USING (true);
CREATE POLICY "Public create enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admin manage brands" ON brands FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage attributes" ON category_attributes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage images" ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage specs" ON product_specifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage banners" ON banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage offers" ON offers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage offer_prod" ON offer_products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage offer_cat" ON offer_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage offer_brand" ON offer_brands FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin view enquiries" ON enquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update enquiries" ON enquiries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete enquiries" ON enquiries FOR DELETE USING (auth.role() = 'authenticated');

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES
  ('products', 'products', true), ('banners', 'banners', true),
  ('brands', 'brands', true), ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public read banners bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public read brands bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public read categories bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload to buckets" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete from buckets" ON storage.objects;

CREATE POLICY "Public read products bucket" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public read banners bucket" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Public read brands bucket" ON storage.objects FOR SELECT USING (bucket_id = 'brands');
CREATE POLICY "Public read categories bucket" ON storage.objects FOR SELECT USING (bucket_id = 'categories');
CREATE POLICY "Admin upload to buckets" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('products','banners','brands','categories') AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete from buckets" ON storage.objects FOR DELETE USING (bucket_id IN ('products','banners','brands','categories') AND auth.role() = 'authenticated');

-- SAMPLE DATA
INSERT INTO brands (name, slug, description, featured, sort_order) VALUES
  ('Samsung', 'samsung', 'Leading electronics manufacturer', true, 1),
  ('LG', 'lg', 'Life is Good', true, 2),
  ('Sony', 'sony', 'Premium electronics and entertainment', true, 3),
  ('Whirlpool', 'whirlpool', 'Home appliance experts', true, 4),
  ('Haier', 'haier', 'Smart home solutions', true, 5),
  ('Voltas', 'voltas', 'Cooling solutions for every home', true, 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, featured, sort_order) VALUES
  ('Televisions', 'televisions', 'Smart TVs, LED TVs, and more', true, 1),
  ('Smartphones', 'smartphones', 'Latest smartphones and accessories', true, 2),
  ('Refrigerators', 'refrigerators', 'Single door, double door, side by side', true, 3),
  ('Washing Machines', 'washing-machines', 'Front load, top load, semi-automatic', true, 4),
  ('Air Conditioners', 'air-conditioners', 'Split AC, window AC, portable AC', true, 5),
  ('Home Appliances', 'home-appliances', 'Microwave, mixer grinder, and more', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- DONE! All tables created successfully.`;

// Extract project ID from the Supabase URL
const getProjectId = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] || '';
};

function StatusIcon({ ok }: { ok: boolean }) {
  return ok
    ? <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
    : <XCircle size={20} className="text-red-400 flex-shrink-0" />;
}

export default function SetupGuide() {
  const [checks, setChecks] = useState({
    envConfigured: false,
    tablesExist: false,
    storageBucket: false,
    adminUser: false,
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const projectId = getProjectId();
  const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectId}/sql/new`;
  const authUrl = `https://supabase.com/dashboard/project/${projectId}/auth/users`;
  const storageUrl = `https://supabase.com/dashboard/project/${projectId}/storage/buckets`;

  useEffect(() => { checkSetup(); }, []);

  const checkSetup = async () => {
    const envOk = isSupabaseConfigured();
    let tablesOk = false;
    let storageOk = false;
    let userOk = false;

    if (envOk) {
      try {
        const { error } = await supabase.from('products').select('id').limit(1);
        tablesOk = !error;
      } catch { tablesOk = false; }

      try {
        const { data, error } = await supabase.storage.getBucket('products');
        storageOk = !error && data !== null;
      } catch { storageOk = false; }

      const { data: { user } } = await supabase.auth.getUser();
      userOk = user !== null;
    }

    setChecks({ envConfigured: envOk, tablesExist: tablesOk, storageBucket: storageOk, adminUser: userOk });
    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    checkSetup();
  };

  const copyAndOpen = async () => {
    await navigator.clipboard.writeText(SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
    window.open(sqlEditorUrl, '_blank');
  };

  const copyOnly = async () => {
    await navigator.clipboard.writeText(SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const allComplete = Object.values(checks).every(v => v);
  const completedCount = Object.values(checks).filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-taupe animate-pulse">Checking setup status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="heading-serif text-3xl font-semibold text-espresso">Setup Guide</h1>
          <p className="text-taupe text-sm mt-1">{completedCount}/4 steps complete</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm text-taupe hover:text-espresso transition-colors"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-cream rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-espresso rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / 4) * 100}%` }}
        />
      </div>

      {/* Overall Status */}
      <div className={`p-5 mb-8 border-2 rounded-lg ${allComplete ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center gap-3">
          {allComplete
            ? <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
            : <AlertCircle size={24} className="text-amber-600 flex-shrink-0" />
          }
          <div>
            <p className="font-semibold text-espresso">
              {allComplete ? '✅ Everything is set up!' : '⚠️ Setup in progress'}
            </p>
            <p className="text-sm text-taupe mt-0.5">
              {allComplete
                ? 'Your Shivam Electronics admin panel is fully configured.'
                : 'Complete the steps below to unlock full functionality.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">

        {/* ── STEP 1: ENV ── */}
        <div className="bg-white border border-champagne/30 p-5">
          <div className="flex items-center gap-3 mb-3">
            <StatusIcon ok={checks.envConfigured} />
            <h3 className="font-semibold text-espresso">Step 1 — Environment Variables</h3>
          </div>
          {checks.envConfigured ? (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
              ✅ Supabase URL and anon key are configured in <code className="font-mono text-xs">.env</code>
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
                ❌ Missing Supabase credentials in <code className="font-mono text-xs">.env</code>
              </p>
              <div className="bg-cream/60 rounded p-3 text-sm text-taupe space-y-1">
                <p className="font-medium text-espresso">Add to your <code className="font-mono text-xs">.env</code> file:</p>
                <div className="bg-espresso text-ivory font-mono text-xs p-3 rounded mt-2 leading-relaxed">
                  <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
                  <p>VITE_SUPABASE_ANON_KEY=eyJhbGci...</p>
                </div>
                <p className="text-xs mt-2">
                  Find these at:{' '}
                  <a href={`https://supabase.com/dashboard/project/${projectId}/settings/api`} target="_blank" rel="noreferrer" className="text-muted-gold underline inline-flex items-center gap-1">
                    Supabase → Settings → API <ExternalLink size={10} />
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── STEP 2: DATABASE TABLES ── */}
        <div className="bg-white border border-champagne/30 p-5">
          <div className="flex items-center gap-3 mb-3">
            <StatusIcon ok={checks.tablesExist} />
            <h3 className="font-semibold text-espresso">Step 2 — Create Database Tables</h3>
          </div>

          {checks.tablesExist ? (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
              ✅ All tables exist: products, categories, brands, banners, enquiries, offers…
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
                ❌ Tables not found — run the SQL setup below
              </p>

              {/* ★ THE MAIN ACTION BUTTON ★ */}
              <div className="bg-espresso rounded-lg p-5 text-center">
                <Database size={28} className="mx-auto text-ivory/80 mb-3" />
                <p className="text-ivory font-semibold mb-1">One-Click Setup</p>
                <p className="text-ivory/60 text-xs mb-4">Copies the full SQL to your clipboard and opens the Supabase SQL Editor</p>
                <button
                  onClick={copyAndOpen}
                  className="bg-light-gold text-espresso font-semibold px-6 py-2.5 rounded hover:bg-muted-gold transition-colors text-sm flex items-center gap-2 mx-auto"
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copied ? '✅ Copied! Paste in Supabase →' : '📋 Copy SQL & Open Supabase Editor'}
                </button>
                <p className="text-ivory/40 text-xs mt-3">Then paste (Ctrl+V) in the editor and click Run</p>
              </div>

              {/* Steps */}
              <div className="bg-cream/40 rounded p-4 text-sm">
                <p className="font-medium text-espresso mb-2">Steps after clicking above:</p>
                <ol className="text-taupe space-y-1.5 list-decimal list-inside text-xs">
                  <li>The SQL Editor will open in a new tab</li>
                  <li>Click inside the editor and press <kbd className="bg-white border border-champagne/50 px-1.5 py-0.5 rounded text-[10px] font-mono">Ctrl+V</kbd> to paste</li>
                  <li>Click the <strong>"Run"</strong> button (or press <kbd className="bg-white border border-champagne/50 px-1.5 py-0.5 rounded text-[10px] font-mono">Ctrl+Enter</kbd>)</li>
                  <li>Wait ~10 seconds for all tables to be created</li>
                  <li>Come back here and click <strong>Refresh</strong></li>
                </ol>
              </div>

              {/* SQL Preview toggle */}
              <button
                onClick={() => setShowSql(v => !v)}
                className="flex items-center gap-2 text-xs text-taupe hover:text-espresso transition-colors"
              >
                {showSql ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showSql ? 'Hide SQL' : 'Preview SQL'}
              </button>

              {showSql && (
                <div className="relative">
                  <pre className="bg-espresso text-ivory/80 text-xs font-mono p-4 rounded overflow-auto max-h-64 leading-relaxed whitespace-pre-wrap">
                    {SETUP_SQL}
                  </pre>
                  <button
                    onClick={copyOnly}
                    className="absolute top-2 right-2 flex items-center gap-1 bg-ivory/10 hover:bg-ivory/20 text-ivory/80 text-xs px-2 py-1 rounded transition-colors"
                  >
                    <Copy size={12} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── STEP 3: STORAGE ── */}
        <div className="bg-white border border-champagne/30 p-5">
          <div className="flex items-center gap-3 mb-3">
            <StatusIcon ok={checks.storageBucket} />
            <h3 className="font-semibold text-espresso">Step 3 — Storage Buckets</h3>
          </div>
          {checks.storageBucket ? (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
              ✅ Storage buckets exist (products, banners, brands, categories)
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded">
                ⚠️ Storage buckets not found — the SQL in Step 2 creates them automatically. If they're still missing after running the SQL:
              </p>
              <div className="bg-cream/40 rounded p-4 text-xs text-taupe space-y-1.5">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to <a href={storageUrl} target="_blank" rel="noreferrer" className="text-muted-gold underline inline-flex items-center gap-0.5">Supabase Storage <ExternalLink size={10} /></a></li>
                  <li>Click <strong>"New bucket"</strong></li>
                  <li>Name: <code className="bg-white border border-champagne/30 px-1 rounded">products</code> → Enable <strong>Public</strong> → Create</li>
                  <li>Repeat for: <code className="bg-white border border-champagne/30 px-1 rounded">banners</code>, <code className="bg-white border border-champagne/30 px-1 rounded">brands</code>, <code className="bg-white border border-champagne/30 px-1 rounded">categories</code></li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* ── STEP 4: ADMIN USER ── */}
        <div className="bg-white border border-champagne/30 p-5">
          <div className="flex items-center gap-3 mb-3">
            <StatusIcon ok={checks.adminUser} />
            <h3 className="font-semibold text-espresso">Step 4 — Create Admin User</h3>
          </div>
          {checks.adminUser ? (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
              ✅ You are logged in as admin
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
                ❌ No admin account — create one in Supabase Authentication
              </p>
              <div className="flex gap-3">
                <a
                  href={authUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-espresso text-ivory text-sm px-4 py-2 rounded hover:bg-espresso/90 transition-colors"
                >
                  <ExternalLink size={14} />
                  Open Supabase Auth
                </a>
              </div>
              <div className="bg-cream/40 rounded p-4 text-xs text-taupe">
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Click <strong>"Add user"</strong> → <strong>"Create new user"</strong></li>
                  <li>Enter your email and a strong password</li>
                  <li>✅ Check <strong>"Auto Confirm User"</strong></li>
                  <li>Click <strong>"Create user"</strong></li>
                  <li>Then <a href="#/admin/login" className="text-muted-gold underline">login here →</a></li>
                </ol>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Quick links when done */}
      {allComplete && (
        <div className="mt-8 bg-white border border-champagne/30 p-5">
          <h3 className="heading-serif text-lg font-semibold text-espresso mb-4">🎉 You're all set! Quick Links</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: '#/admin/products', icon: '📦', label: 'Products' },
              { to: '#/admin/categories', icon: '📁', label: 'Categories' },
              { to: '#/admin/brands', icon: '🏷️', label: 'Brands' },
              { to: '#/admin/enquiries', icon: '💬', label: 'Enquiries' },
            ].map(link => (
              <a key={link.to} href={link.to}
                className="flex flex-col items-center p-4 border border-champagne/50 hover:border-light-gold hover:bg-cream/30 transition-colors rounded text-center"
              >
                <span className="text-2xl mb-1">{link.icon}</span>
                <span className="text-xs text-taupe">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm text-muted-gold hover:underline mx-auto"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Re-check all steps
        </button>
      </div>
    </div>
  );
}
