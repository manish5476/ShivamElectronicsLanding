import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useElectronicsData';
import {
  ArrowRight, ShieldCheck,
  CheckCircle2, Search, SlidersHorizontal, MapPin, Truck, Sparkles
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

// ─── Verified High-Resolution Photography Fallbacks (Clean Showroom Assets) ─
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'televisions': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&q=85',
  'refrigerators': 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1200&q=85',
  'washing-machines': 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=1200&q=85',
  'air-conditioners': 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=1200&q=85',
  'smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=85',
  'home-appliances': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=85',
  'furniture': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85',
  'beds': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=85',
  'almirahs': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=85',
  'home-mandir': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85',
  'water-purifiers': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85',
  'fans-coolers': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=85',
  'audio-speakers': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=85',
};

const CATEGORY_EYEBROWS: Record<string, string> = {
  'televisions': 'Cinema & 4K Display',
  'refrigerators': 'Inverter Cooling & Freshness',
  'washing-machines': 'Fabric Care & AI Laundry',
  'air-conditioners': 'Climate & Inverter Cooling',
  'smartphones': '5G Devices & Mobile Tech',
  'home-appliances': 'Kitchen & Culinary Living',
  'furniture': 'Living Room & Solid Timber',
  'beds': 'Master Bedroom & Storage',
  'almirahs': 'CRCA Steel Wardrobes',
  'home-mandir': 'Handcrafted Sacred Temple',
  'water-purifiers': 'Health & Mineral RO Care',
  'fans-coolers': 'BLDC Energy-Saving Airflow',
  'audio-speakers': 'Party Sound & High Fidelity',
};

const CATEGORY_TAGS_MAP: Record<string, string[]> = {
  'televisions': ['Sony Bravia', 'Samsung Neo', 'LG OLED', '4K UHD', 'Dolby Atmos'],
  'refrigerators': ['Double Door', 'Side-by-Side', 'Convertible 10-in-1', 'Haier', 'LG'],
  'washing-machines': ['Front Load', 'AI Wash', 'Inverter Motor', 'Bosch', 'IFB'],
  'air-conditioners': ['1.5 Ton Split', '100% Copper Coil', 'Dual Inverter', 'Voltas', 'Daikin'],
  'smartphones': ['5G Ready', '120Hz AMOLED', 'Samsung Galaxy', 'Vivo', 'Official Bill'],
  'home-appliances': ['Mixer Grinders', 'Digital OTG', 'Microwaves', 'Philips', 'Sujata'],
  'furniture': ['Solid Sheesham', 'Teak Wood Finish', '3+2 Luxury Sofas', 'Dining Sets'],
  'beds': ['King & Queen Size', 'Hydraulic Lift Storage', 'Teak Wood Craft'],
  'almirahs': ['Heavy CRCA Steel', 'Internal Locker', 'Mirror Finish', 'Powder Coated'],
  'home-mandir': ['Handcrafted Wood', 'Brass Dome Bells', 'Warm Inbuilt LED', 'Puja Ghar'],
  'water-purifiers': ['Kent RO', 'Aquaguard Copper', 'TDS Controller', 'UV+UF Mineral'],
  'fans-coolers': ['Atomberg BLDC', '28W Power Saver', 'Remote Control', 'Crompton'],
  'audio-speakers': ['Sony PartyBox', 'JBL Wireless', 'Karaoke Mic Support', 'Deep Bass'],
};

const FILTER_TABS = [
  { id: 'all', label: 'All Collections' },
  { id: 'electronics', label: 'TV & Sound' },
  { id: 'appliances', label: 'Home Appliances' },
  { id: 'cooling', label: 'AC & Cooling' },
  { id: 'furniture', label: 'Furniture & Living' },
  { id: 'mandir', label: 'Mandir & Devotional' },
];

export default function Categories() {
  const { categories, loading } = useCategories();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter and search logic
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const slug = cat.slug.toLowerCase();
      const name = cat.name.toLowerCase();
      const desc = (cat.description || '').toLowerCase();
      const q = searchQuery.trim().toLowerCase();

      // Search match
      if (q && !name.includes(q) && !desc.includes(q) && !slug.includes(q)) {
        return false;
      }

      // Tab match
      if (activeTab === 'all') return true;
      if (activeTab === 'electronics') {
        return slug.includes('tv') || slug.includes('televis') || slug.includes('audio') || slug.includes('speaker') || slug.includes('smart');
      }
      if (activeTab === 'appliances') {
        return slug.includes('refrig') || slug.includes('wash') || slug.includes('purif') || slug.includes('appliance');
      }
      if (activeTab === 'cooling') {
        return slug.includes('air-cond') || slug.includes('fan') || slug.includes('cooler');
      }
      if (activeTab === 'furniture') {
        return slug.includes('furn') || slug.includes('bed') || slug.includes('almirah');
      }
      if (activeTab === 'mandir') {
        return slug.includes('mandir');
      }
      return true;
    });
  }, [categories, activeTab, searchQuery]);

  if (loading) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">
          Loading Curated Showroom Collections...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* ─── Architectural Editorial Showroom Header ─────────────────── */}
        <section className="mb-10 sm:mb-14">
          <div
            className="rounded-[2.4rem] lg:rounded-[3.2rem] p-7 sm:p-12 lg:p-14 relative overflow-hidden border border-slate-200/80 shadow-soft"
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #1E1B4B 100%)',
            }}
          >
            {/* Ambient Lighting Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="glass-pill text-[11px] font-extrabold uppercase tracking-widest text-emerald-300 bg-white/10 border-white/20 inline-flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  Jolva Flagship Showroom
                </span>
                <span className="glass-pill text-[11px] font-extrabold uppercase tracking-widest text-amber-200 bg-white/10 border-white/20">
                  {categories.length} Curated Departments
                </span>
                <span className="glass-pill text-[11px] font-semibold text-slate-300 bg-white/5 border-white/10 hidden sm:inline-flex items-center gap-1">
                  <MapPin size={11} className="text-indigo-400" /> Near Jolva Bridge
                </span>
              </div>

              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Curated Collections &amp; <span className="text-indigo-300">Living Suites</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                Explore our purpose-built showroom zones in Jolva. Experience side-by-side 4K OLED home entertainment, inverter cooling, and handcrafted solid teakwood living furniture under one roof.
              </p>

              {/* Trust Badges Strip */}
              <div className="pt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-indigo-400" /> 100% Authorized Brand Partner
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-emerald-400" /> Immediate Jolva Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" /> Zero-Cost EMI Available
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Search & Category Filter Navigation Strip ───────────────── */}
        <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 max-w-full">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md scale-102'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white rounded-full text-xs border border-slate-200/80 focus:outline-none focus:border-indigo-500 shadow-xs text-slate-800 placeholder-slate-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ×
                </button>
              )}
            </div>

            <p className="text-xs font-bold text-slate-500 hidden sm:block whitespace-nowrap">
              {filteredCategories.length} {filteredCategories.length === 1 ? 'collection' : 'collections'}
            </p>
          </div>
        </div>

        {/* ─── Curated Architectural Showroom Cards Grid ───────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {filteredCategories.map((category, idx) => {
            const fallbackImage =
              CATEGORY_IMAGE_MAP[category.slug] ||
              'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&q=85';
            const categoryImage = category.imageUrl || fallbackImage;
            const tags = CATEGORY_TAGS_MAP[category.slug] || ['Showroom Models', 'Live Demos', 'Warranty'];
            const eyebrow = CATEGORY_EYEBROWS[category.slug] || 'Showroom Collection';

            return (
              <ScrollReveal key={category.id} delay={idx * 0.04}>
                <Link
                  to={`/categories/${category.slug}`}
                  className="group relative bg-white rounded-[2rem] sm:rounded-[2.4rem] p-4 sm:p-5 border border-slate-200/80 hover:border-indigo-200 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between block h-full"
                >
                  <div>
                    {/* Architectural Image Viewport (Clean & 100% Uncluttered) */}
                    <div className="relative rounded-[1.4rem] sm:rounded-[1.7rem] overflow-hidden aspect-[16/11] bg-slate-100 mb-5">
                      <img
                        src={categoryImage}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="glass-pill px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-slate-900 bg-white/95 backdrop-blur-md shadow-xs flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                          DEPT {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="glass-pill px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-md">
                          Live Jolva Display
                        </span>
                      </div>

                      {/* Bottom Image Micro-Badge */}
                      <div className="absolute bottom-3 left-3 pointer-events-none">
                        <span className="text-[10px] font-semibold text-white/95 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                          Official Brand Warranty
                        </span>
                      </div>
                    </div>

                    {/* Editorial Content Panel (High-Contrast White Foundation) */}
                    <div className="px-1.5">
                      <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.16em] text-indigo-600 mb-1.5 block">
                        {eyebrow}
                      </span>

                      <h2
                        className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {category.name}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 mt-2 mb-4 font-normal">
                        {category.description ||
                          'Verified manufacturer showroom displays with on-the-spot demonstration and immediate delivery.'}
                      </p>

                      {/* Brand & Spec Highlights */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-5">
                        {tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-4 px-1.5 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">
                      <span>Explore Collection</span>
                      <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                        <ArrowRight size={13} />
                      </span>
                    </span>

                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Zero-Cost EMI
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        {/* ─── Empty State ───────────────────────────────────────────── */}
        {filteredCategories.length === 0 && (
          <div className="p-16 rounded-[2.5rem] text-center max-w-lg mx-auto shadow-soft bg-white border border-slate-200/80 my-10">
            <SlidersHorizontal size={40} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No collections match your criteria</h3>
            <p className="text-xs text-slate-500 mb-6">Try clearing your search query or switching to another filter tab.</p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
              }}
              className="btn btn-primary py-2.5 px-6 text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
