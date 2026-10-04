import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Phone, MapPin, Clock, MessageSquare,
  Sparkles, Star, ShieldCheck, Camera,
  Tv, Bed, Eye, Truck, CheckCircle2
} from 'lucide-react';
import { useProducts, useBanners } from '../hooks/useElectronicsData';
import type { Product } from '../types/electronics';
import EnquiryModal from '../components/EnquiryModal';

// ─── Verified High-Definition Showroom Photography (Clean Showroom Assets) ──
const HERO_SHOWROOM_IMAGE =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=88'; // Warm architectural luxury living suite
const ELECTRONICS_FEATURE_IMAGE =
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1400&q=85'; // Pristine 4K UHD OLED Display in designer interior (No setup menus)
const FURNITURE_FEATURE_IMAGE =
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85'; // Architectural living suite with solid timber & seating
const PROMO_CAMPAIGN_IMAGE =
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1400&q=85'; // Modern luxury kitchen & home
const STORE_INTERIOR_IMAGE =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85'; // Premium retail showroom
const GOOGLE_MAPS_REAL_PHOTO =
  'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RMh-IsqZ2nDU6W94_-_QES_yEIZJEsJzRga6Tr2wYM8Z1UfRJJfj0HSYdWp9OQvLlm3iVVJzJ2bQprW4_7wIYt1gX8_fF-p0v0Z0RW_4KUbKVFrlWvCmAAYs8j0tmrlmfP0vaZ=w1200'; // Authentic shop photo from Google Maps listing

export default function ElectronicsHome() {
  const { banners } = useBanners();
  const { products, loading: productsLoading } = useProducts();

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState<{ id: string; name: string; sku?: string } | undefined>(undefined);

  const openEnquiry = (prod?: { id: string; name: string; sku?: string }) => {
    setEnquiryProduct(prod);
    setIsEnquiryOpen(true);
  };

  const mainBanner = banners?.[0];

  // Dynamic products derived from the real 32+ catalogue in Supabase
  const featuredPieces = products.filter(p => p.featured || p.popular).slice(0, 6).length > 0
    ? products.filter(p => p.featured || p.popular).slice(0, 6)
    : products.slice(0, 6);

  const electronicsList = products.filter(p => {
    const slug = (p.category?.slug || p.categoryId || '').toLowerCase();
    return slug.includes('tv') || slug.includes('televis') || slug.includes('refrig') ||
           slug.includes('wash') || slug.includes('air-cond') || slug.includes('phone') ||
           slug.includes('purif') || slug.includes('fan') || slug.includes('appliance');
  }).slice(0, 6);

  const furnitureList = products.filter(p => {
    const slug = (p.category?.slug || p.categoryId || '').toLowerCase();
    return slug.includes('furn') || slug.includes('bed') || slug.includes('almirah') ||
           slug.includes('mandir') || slug.includes('sofa') || slug.includes('dining');
  }).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg,#FAF9F6)] text-[var(--color-text,#0F172A)] font-sans">

      {/* ══════════════════════════════════════════════════════════════════════
          1. FULL-WIDTH RECTANGULAR ARCHITECTURAL HERO (NO WASTED SIDE SPACE)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-slate-950 border-b border-slate-800">
        {/* Full-Bleed Authentic Luxury Living Suite Image */}
        <img
          src={mainBanner?.desktopImageUrl || HERO_SHOWROOM_IMAGE}
          alt="Shivam Electronics Flagship Showroom Living Suite"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-[1.01]"
          onError={(e) => { e.currentTarget.src = HERO_SHOWROOM_IMAGE; }}
          loading="eager"
        />

        {/* Cinematic Environmental Gradient Overlay (Edge-to-Edge) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(11,15,25,0.96) 0%, rgba(11,15,25,0.85) 45%, rgba(11,15,25,0.35) 75%, rgba(11,15,25,0.6) 100%)',
          }}
        />

        {/* Expansive Inner Content Container */}
        <div className="relative z-10 max-w-[1440px] mx-auto w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex flex-col justify-between py-10 sm:py-14 lg:py-16 px-6 sm:px-10 lg:px-16">
          {/* Top Meta Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-md text-xs font-bold text-white shadow-sm border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FLAGSHIP SHOWROOM · JOLVA, SURAT</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-slate-200 border border-white/10">
                100% Authorized Brand Partner
              </span>
              <span className="px-4 py-1.5 rounded-full bg-emerald-950/70 backdrop-blur-md text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                Zero-Cost EMI Available
              </span>
            </div>
          </div>

          {/* Center Left Editorial Panel */}
          <div className="max-w-2xl py-6 sm:py-10 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-[0.2em] bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
              <Sparkles size={13} className="text-amber-400" />
              <span>Electronics · Appliances · Furniture</span>
            </div>

            <h1
              className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Curated for Your <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-white via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                Modern Living.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-normal">
              Experience side-by-side 4K OLED home entertainment, inverter cooling, smart fabric care, and handcrafted solid teakwood furniture under one prestigious roof in Jolva.
            </p>

            {/* Quick Department Jump Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
              {[
                { label: '4K Smart TVs', path: '/categories/televisions' },
                { label: 'Refrigerators', path: '/categories/refrigerators' },
                { label: 'Inverter ACs', path: '/categories/air-conditioners' },
                { label: 'Solid Teak Beds', path: '/categories/beds' },
                { label: 'Steel Almirahs', path: '/categories/almirahs' },
              ].map((pill, pIdx) => (
                <Link
                  key={pIdx}
                  to={pill.path}
                  className="text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1 rounded-full backdrop-blur-md transition-all border border-white/10"
                >
                  {pill.label}
                </Link>
              ))}
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/products"
                className="px-8 py-4 rounded-full bg-white text-slate-950 font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2.5"
              >
                <span>Explore Catalogue</span>
                <ArrowRight size={15} />
              </Link>

              <button
                onClick={() => openEnquiry()}
                className="px-7 py-4 rounded-full bg-slate-900/80 hover:bg-slate-800 text-xs sm:text-sm font-bold text-white transition-all inline-flex items-center gap-2 border border-white/20 backdrop-blur-md hover:scale-102"
              >
                <MessageSquare size={15} />
                <span>Enquire Showroom Price</span>
              </button>
            </div>
          </div>

          {/* Bottom Showroom Guarantee Bar */}
          <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-white flex items-center gap-1.5 text-sm">
                <Star size={14} className="fill-amber-400 text-amber-400" /> 4.9 ★ Google Rated
              </span>
              <span className="text-white/40">·</span>
              <span className="text-xs">128+ Verified Reviews in Jolva</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><Truck size={14} className="text-emerald-400" /> Free Doorstep Delivery</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-indigo-400" /> 100% Brand Warranty</span>
              <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-amber-400" /> Free On-Site Assembly</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. CURATED DEPARTMENTS (Architectural Showroom Pavilions)
          (Replaces the flawed full-bleed text overlays with clean 100% contrast)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-indigo-600">
                Curated Showroom Pavilions
              </p>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-slate-900">
              Living &amp; Technology Departments
            </h2>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group"
          >
            <span>Explore All 13 Departments</span>
            <span className="w-7 h-7 rounded-full bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all">
              <ArrowRight size={13} />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* ─── Department 1: LIVING WITH TECHNOLOGY ─────────────────── */}
          <div className="bg-white rounded-[2.2rem] sm:rounded-[2.8rem] p-5 sm:p-7 border border-slate-200/80 hover:border-indigo-200 shadow-soft hover:shadow-strong transition-all duration-500 flex flex-col justify-between group">
            <div>
              {/* Unoccluded 16:10 Photo Viewport */}
              <div className="relative rounded-[1.6rem] sm:rounded-[2rem] overflow-hidden aspect-[16/10] bg-slate-100 mb-6">
                <img
                  src={ELECTRONICS_FEATURE_IMAGE}
                  alt="Living with Technology Electronics Department"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => { e.currentTarget.src = HERO_SHOWROOM_IMAGE; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* Floating Top Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="glass-pill px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-slate-900 bg-white/95 backdrop-blur-md shadow-xs flex items-center gap-1.5">
                    <Tv size={12} className="text-indigo-600" />
                    DEPT 01 · SMART LIVING
                  </span>
                  <span className="glass-pill px-3 py-1 rounded-full text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-md">
                    Live Jolva Display
                  </span>
                </div>

                {/* Bottom Corner Tag */}
                <div className="absolute bottom-3.5 left-3.5 pointer-events-none">
                  <span className="text-[10px] font-semibold text-white/95 bg-black/45 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    Samsung · LG · Sony · Bosch
                  </span>
                </div>
              </div>

              {/* Editorial Typography on White Foundation */}
              <div className="px-1.5">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] text-indigo-600 mb-2 block">
                  FLAGSHIP CINEMA &amp; APPLIANCES
                </span>

                <h3
                  className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors mb-2.5"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Living with Technology
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-normal">
                  Experience crystal 4K OLED displays, inverter frost-free refrigeration, AI smart laundry, and dual-inverter cooling live in our Jolva showroom.
                </p>

                {/* Sub-Department Direct Navigation Chips */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {[
                    { label: 'Smart 4K TVs', path: '/categories/televisions' },
                    { label: 'Refrigerators', path: '/categories/refrigerators' },
                    { label: 'Washing Machines', path: '/categories/washing-machines' },
                    { label: 'Air Conditioners', path: '/categories/air-conditioners' },
                  ].map((chip, i) => (
                    <Link
                      key={i}
                      to={chip.path}
                      className="text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 px-3.5 py-1.5 rounded-full transition-all"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-5 px-1.5 border-t border-slate-100 flex items-center justify-between mt-auto">
              <Link
                to="/categories/televisions"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-wider"
              >
                <span>Explore Electronics Suite</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                  <ArrowRight size={14} />
                </span>
              </Link>

              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Zero-Cost EMI Available
              </span>
            </div>
          </div>

          {/* ─── Department 2: BRING MORE COMFORT HOME ─────────────────── */}
          <div className="bg-white rounded-[2.2rem] sm:rounded-[2.8rem] p-5 sm:p-7 border border-slate-200/80 hover:border-amber-200 shadow-soft hover:shadow-strong transition-all duration-500 flex flex-col justify-between group">
            <div>
              {/* Unoccluded 16:10 Photo Viewport */}
              <div className="relative rounded-[1.6rem] sm:rounded-[2rem] overflow-hidden aspect-[16/10] bg-slate-100 mb-6">
                <img
                  src={FURNITURE_FEATURE_IMAGE}
                  alt="Home & Furniture Showroom Department"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => { e.currentTarget.src = HERO_SHOWROOM_IMAGE; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* Floating Top Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="glass-pill px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-slate-900 bg-white/95 backdrop-blur-md shadow-xs flex items-center gap-1.5">
                    <Bed size={12} className="text-amber-700" />
                    DEPT 02 · TIMBER &amp; SACRED SPACES
                  </span>
                  <span className="glass-pill px-3 py-1 rounded-full text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-md">
                    Handcrafted in Gujarat
                  </span>
                </div>

                {/* Bottom Corner Tag */}
                <div className="absolute bottom-3.5 left-3.5 pointer-events-none">
                  <span className="text-[10px] font-semibold text-white/95 bg-black/45 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    Solid Teakwood · Heavy Steel · Mandirs
                  </span>
                </div>
              </div>

              {/* Editorial Typography on White Foundation */}
              <div className="px-1.5">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-700 mb-2 block">
                  HANDCRAFTED TIMBER &amp; STEEL STORAGE
                </span>

                <h3
                  className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition-colors mb-2.5"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Bring More Comfort Home
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-normal">
                  Handcrafted solid teakwood hydraulic storage beds, heavy-gauge steel almirahs with safety lockers, carved puja mandirs, and premium living suites.
                </p>

                {/* Sub-Department Direct Navigation Chips */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {[
                    { label: 'Storage Beds', path: '/categories/beds' },
                    { label: 'Steel Almirahs', path: '/categories/almirahs' },
                    { label: 'Home Mandir', path: '/categories/home-mandir' },
                    { label: 'Living Furniture', path: '/categories/furniture' },
                  ].map((chip, i) => (
                    <Link
                      key={i}
                      to={chip.path}
                      className="text-xs font-semibold text-slate-700 hover:text-amber-800 bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-200 px-3.5 py-1.5 rounded-full transition-all"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-5 px-1.5 border-t border-slate-100 flex items-center justify-between mt-auto">
              <Link
                to="/categories/furniture"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors uppercase tracking-wider"
              >
                <span>Explore Furniture Suite</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-amber-700 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                  <ArrowRight size={14} />
                </span>
              </Link>

              <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Free On-Site Assembly
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. FEATURED SHOWROOM PIECES (Dynamic Real Products with Pricing & EMI)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-indigo-600 mb-2">
              Curated Showcase
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-slate-900">
              Featured Showroom Pieces
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:underline"
          >
            Browse Full Collection ({products.length} models) <ArrowRight size={15} />
          </Link>
        </div>

        {/* Dynamic Real Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featuredPieces.slice(0, 3).map((item) => {
            const discountPct =
              item.mrp && item.sellingPrice && item.mrp > item.sellingPrice
                ? Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)
                : 0;

            const emiAmount =
              item.sellingPrice && item.sellingPrice >= 5000
                ? Math.round(item.sellingPrice / 12)
                : null;

            return (
              <div
                key={item.id}
                className="bg-white rounded-[2.2rem] p-5 sm:p-6 border border-slate-200/80 shadow-soft hover:shadow-strong transition-all flex flex-col justify-between group"
              >
                <div>
                  <Link
                    to={`/products/${item.slug}`}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 block"
                  >
                    <img
                      src={item.images?.[0]?.imageUrl || HERO_SHOWROOM_IMAGE}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = HERO_SHOWROOM_IMAGE; }}
                    />
                    {item.brand?.name && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-sm">
                        {item.brand.name}
                      </span>
                    )}
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified Stock
                    </span>
                  </Link>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {item.category?.name || 'Showroom Spec'}
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900 leading-snug mb-2 line-clamp-2">
                    <Link to={`/products/${item.slug}`} className="hover:text-indigo-600 transition-colors">
                      {item.name}
                    </Link>
                  </h3>

                  {/* Real Pricing Display */}
                  <div className="my-2.5">
                    {item.sellingPrice ? (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-extrabold text-slate-900">
                            ₹{item.sellingPrice.toLocaleString('en-IN')}
                          </span>
                          {item.mrp && item.mrp > item.sellingPrice && (
                            <span className="text-xs line-through text-slate-400 font-medium">
                              ₹{item.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                          {discountPct > 0 && (
                            <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                              {discountPct}% OFF
                            </span>
                          )}
                        </div>
                        {emiAmount && (
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                            EMI from ₹{emiAmount.toLocaleString('en-IN')}/mo · 0% Interest
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                        ✦ Showroom Price on Request
                      </span>
                    )}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.tags.slice(0, 3).map((spec, i) => (
                        <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEnquiry({ id: item.id, name: item.name, sku: item.sku })}
                      className="flex-1 py-3 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare size={14} /> Enquire Best Price
                    </button>
                    <Link
                      to={`/products/${item.slug}`}
                      className="py-3 px-4 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center justify-center"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. PROMOTIONAL FESTIVAL BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div
          className="relative min-h-[420px] rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-strong p-8 sm:p-12 lg:p-16 flex items-center"
        >
          {/* Background Image */}
          <img
            src={PROMO_CAMPAIGN_IMAGE}
            alt="Festival Promotional Campaign"
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={(e) => { e.currentTarget.src = HERO_SHOWROOM_IMAGE; }}
          />

          {/* Atmospheric gradient wash */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.65) 50%, rgba(15,23,42,0.3) 100%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-xl text-white">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400 text-slate-950 mb-4 shadow-sm">
              🎉 SEASONAL FESTIVAL UPGRADE
            </span>

            <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl font-medium leading-tight mb-3 text-white">
              Upgrade your home with special festive savings &amp; instant exchange.
            </h3>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
              Exchange any old television, refrigerator or washing machine for instant store credit. Zero-cost financing available across all major bank credit cards.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-center">
                <span className="block text-2xl font-black text-amber-300">₹5,000</span>
                <span className="text-[10px] text-slate-300 uppercase font-semibold">Max Exchange Bonus</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-center">
                <span className="block text-2xl font-black text-emerald-300">0%</span>
                <span className="text-[10px] text-slate-300 uppercase font-semibold">No-Cost EMI Available</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/offers"
                className="px-7 py-3.5 rounded-full bg-white text-slate-900 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all shadow-md"
              >
                Explore Offers <ArrowRight size={14} className="inline ml-1" />
              </Link>
              <button
                onClick={() => openEnquiry({ id: 'festival-campaign', name: 'Seasonal Festival Upgrade Campaign' })}
                className="px-6 py-3.5 rounded-full glass-pill text-xs font-semibold text-white hover:bg-white/20 transition-all"
              >
                Inquire Showroom Offer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. ELECTRONICS SHOWROOM (Real Dynamic Products - 6 Models)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-indigo-600 mb-2">
              Showroom Department
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-slate-900">
              Electronics Showroom
            </h2>
          </div>
          <Link
            to="/categories/televisions"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:underline"
          >
            All Electronics Models <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {electronicsList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-200/80 shadow-soft hover:shadow-medium transition-all flex flex-col justify-between group"
            >
              <div>
                <Link
                  to={`/products/${item.slug}`}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 block"
                >
                  <img
                    src={item.images?.[0]?.imageUrl || HERO_SHOWROOM_IMAGE}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = HERO_SHOWROOM_IMAGE; }}
                  />
                  {item.brand?.name && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-sm">
                      {item.brand.name}
                    </span>
                  )}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 shadow-xs">
                    Live Demo
                  </span>
                </Link>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {item.category?.name || 'Electronics'}
                </span>
                <h4 className="font-display text-base sm:text-lg font-bold text-slate-900 line-clamp-2 leading-snug mb-2">
                  <Link to={`/products/${item.slug}`} className="hover:text-indigo-600 transition-colors">
                    {item.name}
                  </Link>
                </h4>

                {/* Real Price info */}
                <div className="my-2">
                  {item.sellingPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-slate-900">
                        ₹{item.sellingPrice.toLocaleString('en-IN')}
                      </span>
                      {item.mrp && item.mrp > item.sellingPrice && (
                        <span className="text-xs line-through text-slate-400 font-medium">
                          ₹{item.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block">
                      ✦ Best Deal on Enquiry
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-500" /> Official Brand Warranty
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => openEnquiry({ id: item.id, name: item.name, sku: item.sku })}
                  className="flex-1 py-3 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={13} /> Enquire Best Price
                </button>
                <Link
                  to={`/products/${item.slug}`}
                  className="py-3 px-4 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center justify-center"
                  title="View Specs"
                >
                  <Eye size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. HOME & FURNITURE SHOWROOM (Real Dynamic Products - 6 Models)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-amber-700 mb-2">
              Living &amp; Bedroom Suites
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-slate-900">
              Furniture for Everyday Living
            </h2>
          </div>
          <Link
            to="/categories/furniture"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-800 hover:underline"
          >
            All Furniture Models <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {furnitureList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[2rem] p-5 sm:p-6 border border-stone-200/80 shadow-soft hover:shadow-medium transition-all flex flex-col justify-between group"
            >
              <div>
                <Link
                  to={`/products/${item.slug}`}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 flex items-center justify-center mb-4 block"
                >
                  <img
                    src={item.images?.[0]?.imageUrl || HERO_SHOWROOM_IMAGE}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = HERO_SHOWROOM_IMAGE; }}
                  />
                  {item.brand?.name && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-700 text-white shadow-sm">
                      {item.brand.name}
                    </span>
                  )}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-stone-800 shadow-xs">
                    Custom Polish
                  </span>
                </Link>

                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800/80 block mb-1">
                  {item.category?.name || 'Solid Wood'}
                </span>
                <h4 className="font-display text-base sm:text-lg font-bold text-slate-900 line-clamp-2 leading-snug mb-2">
                  <Link to={`/products/${item.slug}`} className="hover:text-amber-700 transition-colors">
                    {item.name}
                  </Link>
                </h4>

                {/* Price or custom quote */}
                <div className="my-2">
                  {item.sellingPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-slate-900">
                        ₹{item.sellingPrice.toLocaleString('en-IN')}
                      </span>
                      {item.mrp && item.mrp > item.sellingPrice && (
                        <span className="text-xs line-through text-slate-400 font-medium">
                          ₹{item.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60 inline-block">
                      ✦ Showroom Size &amp; Price on Request
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                    <Truck size={12} className="text-amber-600" /> Free Delivery in Jolva &amp; Surat
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                <button
                  onClick={() => openEnquiry({ id: item.id, name: item.name, sku: item.sku })}
                  className="flex-1 py-3 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={13} /> Enquire Best Price
                </button>
                <Link
                  to={`/products/${item.slug}`}
                  className="py-3 px-4 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors flex items-center justify-center"
                  title="View Details"
                >
                  <Eye size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          7. TRUSTED BRANDS PARTNER WALL
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 border-t border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-slate-400 mb-2">
            Showroom Partners
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-slate-900 mb-10">
            Authorized Brand Partnerships
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 lg:gap-16">
            {[
              { name: 'Samsung', note: 'Authorised Plaza' },
              { name: 'LG', note: 'Official Partner' },
              { name: 'Sony', note: 'Bravia Showcase' },
              { name: 'Whirlpool', note: 'Appliances' },
              { name: 'Voltas', note: 'A Tata Enterprise' },
              { name: 'Godrej', note: 'Appliances & Steel' },
              { name: 'Havells', note: 'Lighting & Fans' },
              { name: 'Bosch', note: 'German Engineering' },
            ].map((brand, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default">
                <span className="font-display text-xl sm:text-2xl font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  {brand.name}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                  {brand.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          8. REAL SHOWROOM SHOWCASE (REAL GOOGLE MAPS PHOTO & EMBED)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div
          className="bg-white rounded-[2.5rem] lg:rounded-[3.5rem] p-6 sm:p-10 lg:p-14 border border-slate-200/80 shadow-soft overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left 6 Cols: Information & Actions */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="glass-pill text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 inline-flex items-center gap-1.5">
                  <Star size={13} className="fill-amber-400 text-amber-400" /> 4.9 ★ Google Maps Verified
                </span>
                <span className="glass-pill text-[11px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200">
                  Jolva, Surat District, Gujarat
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-slate-900 leading-[1.15]">
                Inside Our <span className="text-indigo-600">Jolva Showroom</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Step inside Shivam Electronics Jolva at Panchratna Complex on Kadodara-Bardoli Road. Compare live 4K TVs, touch premium cooling appliances, and inspect handcrafted wooden furniture.
              </p>

              {/* Quick Details */}
              <div className="space-y-2.5 text-xs text-slate-700 py-1">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                  <span>Panchratna Complex, Kadodara - Bardoli Road, Jolva, Gujarat 394305</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={16} className="text-indigo-600 shrink-0" />
                  <span>Monday – Sunday: 09:30 AM – 09:30 PM (Open All 7 Days)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="text-indigo-600 shrink-0" />
                  <a href="tel:+919876543210" className="font-bold text-indigo-600 hover:underline">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://www.google.com/maps/place/SHIVAM+ELECTRONICS+JOLVA/@21.1587231,72.9990783,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDtp_msbw!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FANWiy9RMh-IsqZ2nDU6W94_-_QES_yEIZJEsJzRga6Tr2wYM8Z1UfRJJfj0HSYdWp9OQvLlm3iVVJzJ2bQprW4_7wIYt1gX8_fF-p0v0Z0RW_4KUbKVFrlWvCmAAYs8j0tmrlmfP0vaZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary py-3.5 px-6 text-xs sm:text-sm font-bold gap-2 shadow-md hover:scale-[1.02] transition-transform"
                >
                  <Camera size={15} /> See all photos on Google Maps
                </a>

                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=21.1587948,72.9991155"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline py-3.5 px-6 text-xs sm:text-sm font-bold gap-2 hover:bg-slate-50 transition-colors"
                >
                  <MapPin size={15} /> Get directions
                </a>

                <Link
                  to="/gallery"
                  className="btn btn-ghost py-3.5 px-5 text-xs sm:text-sm font-bold gap-1.5"
                >
                  Store Gallery <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right 6 Cols: Real Photo from Google Maps Profile */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-slate-200/80 shadow-md group bg-slate-100">
                <img
                  src={GOOGLE_MAPS_REAL_PHOTO}
                  alt="Shivam Electronics Jolva Official Storefront Photo from Google Maps"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.currentTarget.src = STORE_INTERIOR_IMAGE; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-5 text-white">
                  <div>
                    <span className="glass-pill text-[10px] font-extrabold uppercase tracking-wider text-slate-900 bg-white/95 block mb-1">
                      ✦ Official Google Maps Photo
                    </span>
                    <p className="text-xs font-bold drop-shadow">Panchratna Complex, Kadodara-Bardoli Rd, Jolva</p>
                  </div>
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1 glass-pill bg-slate-900/80">
                    <Star size={12} className="fill-amber-400" /> 4.9 ★ (128+ Reviews)
                  </span>
                </div>
              </div>

              {/* Embedded Google Map Strip */}
              <div className="rounded-[1.5rem] overflow-hidden border border-slate-200 h-44 shadow-xs relative bg-slate-100">
                <iframe
                  title="Shivam Electronics Jolva Map Mini"
                  src="https://maps.google.com/maps?q=21.1587948,72.9991155&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          9. ENQUIRY CALL TO ACTION (NEED SOMETHING SPECIFIC?)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="pb-16 sm:pb-24 px-4 sm:px-6 md:px-10 max-w-5xl mx-auto w-full text-center">
        <div
          className="rounded-[2.5rem] p-10 sm:p-14 text-white shadow-strong relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #1E3A8A 100%)',
          }}
        >
          <div className="relative z-10 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-indigo-200 mb-4 border border-white/10">
              <MessageSquare size={13} /> Instant Showroom Response
            </span>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-4">
              Need Something Specific?
            </h2>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-8 font-normal">
              Looking for a specific screen size, inverter capacity, or custom almirah dimensions? Send an enquiry and our showroom manager will share availability and special pricing directly.
            </p>

            <button
              onClick={() => openEnquiry()}
              className="px-9 py-4 rounded-full bg-white text-slate-950 font-extrabold text-sm uppercase tracking-wider shadow-2xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              Send Enquiry Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Global Interactive Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        prefillProduct={enquiryProduct}
      />

    </div>
  );
}