import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, ExternalLink, Star, Navigation, Phone, Calendar,
  ChevronLeft, ChevronRight, X, ZoomIn, Camera, CheckCircle2,
  Sparkles, Clock, ShieldCheck, Heart, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryApi, type GalleryItem, type GooglePlaceInfo, GOOGLE_MAPS_STORE_INFO } from '../services/galleryApi';
import { companyApi } from '../services/companyApi';
import type { CompanyProfile } from '../types/business';
import EnquiryModal from '../components/EnquiryModal';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Photos' },
  { id: 'showroom', label: 'Showroom Floor' },
  { id: 'televisions', label: '4K TV & Sound' },
  { id: 'appliances', label: 'Refrigerators & AC' },
  { id: 'furniture', label: 'Beds & Wardrobes' },
  { id: 'deliveries', label: 'Delivery & Setup' },
] as const;

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [storeInfo, setStoreInfo] = useState<GooglePlaceInfo>(GOOGLE_MAPS_STORE_INFO);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [likedPhotoIds, setLikedPhotoIds] = useState<Record<string, boolean>>({});

  // Enquiry modal state
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState<{ id: string; name: string; sku?: string } | undefined>();

  useEffect(() => {
    loadGallery(activeCategory);
    setStoreInfo(galleryApi.getStorePlaceInfo());
    companyApi.getProfile().then(res => {
      if (res.data) setProfile(res.data);
    });
  }, [activeCategory]);

  const loadGallery = async (category: string) => {
    setLoading(true);
    const res = await galleryApi.getItems(category);
    if (res.data) {
      setItems(res.data);
    }
    setLoading(false);
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedPhotoIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Lightbox Navigation
  const currentIndex = selectedPhoto ? items.findIndex(i => i.id === selectedPhoto.id) : -1;
  const showPrev = () => {
    if (currentIndex > 0) {
      setSelectedPhoto(items[currentIndex - 1]);
    } else {
      setSelectedPhoto(items[items.length - 1]);
    }
  };
  const showNext = () => {
    if (currentIndex < items.length - 1) {
      setSelectedPhoto(items[currentIndex + 1]);
    } else {
      setSelectedPhoto(items[0]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === 'Escape') setSelectedPhoto(null);
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, items]);

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">

        {/* ─── Hero Header & Google Business Banner ─────────────────── */}
        <section className="mb-12 sm:mb-16">
          <div
            className="rounded-[2.5rem] md:rounded-[3.5rem] p-6 sm:p-10 md:p-14 relative overflow-hidden shadow-soft border"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            {/* Subtle architectural ambient light */}
            <div
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
              style={{ background: 'var(--gradient-accent)' }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Store Identity & Rating */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="glass-pill text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50/80 border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    Verified Google Business Location
                  </span>
                  <span className="glass-pill text-[11px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50/80 border border-amber-200 flex items-center gap-1.5">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    {storeInfo.rating} · {storeInfo.reviewsCount}+ Local Reviews
                  </span>
                </div>

                <h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
                  style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
                >
                  Inside Our <span className="text-gradient">Jolva Showroom</span>
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Take a visual walkthrough of our flagship electronics, home appliance &amp; furniture showroom at Panchratna Complex, Jolva (Gujarat). Live demo zones, brand guarantee, and immediate pickup.
                </p>

                {/* Quick Info Chips */}
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} style={{ color: 'var(--color-accent)' }} />
                    <span>Panchratna Complex, Kadodara-Bardoli Rd, Jolva</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} style={{ color: 'var(--color-accent)' }} />
                    <span>Open Today: 09:30 AM – 09:30 PM</span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="https://www.google.com/maps/place/SHIVAM+ELECTRONICS+JOLVA/@21.1587231,72.9990783,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDtp_msbw!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FANWiy9RMh-IsqZ2nDU6W94_-_QES_yEIZJEsJzRga6Tr2wYM8Z1UfRJJfj0HSYdWp9OQvLlm3iVVJzJ2bQprW4_7wIYt1gX8_fF-p0v0Z0RW_4KUbKVFrlWvCmAAYs8j0tmrlmfP0vaZ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary py-3 px-6 text-xs sm:text-sm font-bold gap-2 shadow-md hover:scale-[1.02] transition-transform"
                  >
                    <Camera size={15} />
                    See all photos on Google Maps
                  </a>

                  <a
                    href={storeInfo.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline py-3 px-6 text-xs sm:text-sm font-bold gap-2 hover:bg-[var(--color-surface-soft)] transition-colors"
                  >
                    <Navigation size={15} />
                    Get directions
                  </a>

                  <Link
                    to="/contact?tab=booking"
                    className="btn btn-ghost py-3 px-5 text-xs sm:text-sm font-bold gap-2"
                  >
                    <Calendar size={15} />
                    Book VIP Visit
                  </Link>
                </div>
              </div>

              {/* Right Column: Google Maps Live Card with Real Uploaded Photo */}
              <div className="lg:col-span-5">
                <div
                  className="rounded-[2.5rem] p-6 border shadow-soft relative overflow-hidden"
                  style={{
                    backgroundColor: 'var(--color-surface-soft)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  {/* Real Google Maps Photo Preview */}
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-slate-200/80 group">
                    <img
                      src="https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RMh-IsqZ2nDU6W94_-_QES_yEIZJEsJzRga6Tr2wYM8Z1UfRJJfj0HSYdWp9OQvLlm3iVVJzJ2bQprW4_7wIYt1gX8_fF-p0v0Z0RW_4KUbKVFrlWvCmAAYs8j0tmrlmfP0vaZ=w1200"
                      alt="Shivam Electronics Jolva Store Photo from Google Maps"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&q=85';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end justify-between p-3.5 text-white">
                      <span className="glass-pill text-[10px] font-extrabold uppercase tracking-wider text-slate-900 bg-white/95">
                        ✦ Verified Google Maps Photo
                      </span>
                      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                        <Star size={11} className="fill-amber-400" /> 4.9 ★
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Official Store Listing</p>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{storeInfo.name}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">{storeInfo.address}</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center flex-shrink-0 text-indigo-600">
                      <MapPin size={20} />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 mb-5 bg-white/70 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">State / Region:</span>
                      <span className="font-bold text-slate-800">Surat District, Gujarat</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Coordinates:</span>
                      <span className="font-mono text-[11px] text-slate-800">21.1588° N, 72.9991° E</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Showroom Hours:</span>
                      <span className="font-semibold text-emerald-700">Open 7 Days (09:30 AM - 09:30 PM)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={storeInfo.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline flex-1 py-2.5 text-xs font-bold gap-1.5"
                    >
                      <ExternalLink size={13} /> View Place Listing
                    </a>
                    <a
                      href={`tel:${storeInfo.phone.replace(/[^0-9+]/g, '')}`}
                      className="btn btn-ghost flex-1 py-2.5 text-xs font-bold gap-1.5 text-slate-700 bg-white hover:bg-slate-50 border border-slate-200"
                    >
                      <Phone size={13} /> Call Store
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── Category Filter Pills ─────────────────────────────────── */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 max-w-full">
            {CATEGORY_TABS.map(tab => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`glass-pill px-5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white shadow-md scale-105'
                      : 'text-slate-700 hover:bg-[var(--color-surface-soft)]'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--color-primary)' : undefined,
                    color: isActive ? 'var(--color-surface)' : undefined,
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <p className="text-xs font-semibold text-slate-500 hidden sm:block">
            Showing {items.length} showroom photographs
          </p>
        </div>

        {/* ─── Gallery Grid ─────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div
                key={n}
                className="h-72 rounded-[2rem] skeleton"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div
            className="p-16 rounded-[2.5rem] border text-center shadow-soft"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <Camera size={40} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No photos in this category yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Select another category or explore all photos.</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="btn btn-primary py-2 px-6 text-xs font-bold"
            >
              View All Photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((item, idx) => {
              const isLiked = !!likedPhotoIds[item.id];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  onClick={() => setSelectedPhoto(item)}
                  className="group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-soft border transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1000&q=80';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                      <span className="glass-pill text-[10px] font-extrabold uppercase tracking-wider text-slate-900 bg-white/90">
                        {item.locationTag}
                      </span>

                      <button
                        onClick={(e) => handleLike(e, item.id)}
                        className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:scale-110 transition-transform shadow-sm"
                        aria-label="Save photo"
                      >
                        <Heart
                          size={14}
                          className={isLiked ? 'fill-red-500 text-red-500' : 'text-slate-600'}
                        />
                      </button>
                    </div>

                    {/* Center Zoom Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                        <ZoomIn size={20} />
                      </div>
                    </div>

                    {/* Bottom Caption on Card */}
                    <div className="absolute bottom-4 left-4 right-4 text-white z-10 pointer-events-none">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 block mb-1">
                        {item.category.toUpperCase()}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold leading-snug line-clamp-2 drop-shadow-sm">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Bottom Strip */}
                  <div className="p-4 sm:p-5 flex items-center justify-between text-xs">
                    <span className="text-slate-600 line-clamp-1 pr-2">
                      {item.description}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 shrink-0 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      View <ArrowRight size={12} />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ─── Interactive Google Map Embed Section ──────────────────── */}
        <section className="mt-16 sm:mt-24">
          <div
            className="rounded-[2.5rem] md:rounded-[3.5rem] p-6 sm:p-10 md:p-14 border shadow-soft"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Map Info Box */}
              <div className="lg:col-span-5 space-y-5">
                <span className="glass-pill text-[11px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200">
                  Live Showroom Location
                </span>

                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
                  style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
                >
                  Visit Our Showroom in Jolva
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Located conveniently on the Kadodara-Bardoli arterial highway in Panchratna Complex. Ample customer parking, live electronics testing terminals, and immediate home delivery across Surat district.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <MapPin size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">{storeInfo.name}</p>
                      <p className="text-slate-600">{storeInfo.address}, {storeInfo.city}, {storeInfo.state} {storeInfo.pincode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-700">
                    <Clock size={16} className="text-indigo-600 shrink-0" />
                    <span>{storeInfo.timings}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-700">
                    <Phone size={16} className="text-indigo-600 shrink-0" />
                    <a href={`tel:${storeInfo.phone.replace(/[^0-9+]/g, '')}`} className="font-bold text-indigo-600 hover:underline">
                      {storeInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a
                    href="https://www.google.com/maps/place/SHIVAM+ELECTRONICS+JOLVA/@21.1587231,72.9990783,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDtp_msbw!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FANWiy9RMh-IsqZ2nDU6W94_-_QES_yEIZJEsJzRga6Tr2wYM8Z1UfRJJfj0HSYdWp9OQvLlm3iVVJzJ2bQprW4_7wIYt1gX8_fF-p0v0Z0RW_4KUbKVFrlWvCmAAYs8j0tmrlmfP0vaZ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary py-3 px-6 text-xs font-bold gap-2"
                  >
                    <Camera size={14} /> See all photos on Google Maps
                  </a>

                  <a
                    href={storeInfo.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline py-3 px-6 text-xs font-bold gap-2"
                  >
                    <Navigation size={14} /> Get directions
                  </a>
                </div>
              </div>

              {/* Map Iframe in Curved Container */}
              <div className="lg:col-span-7">
                <div className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-soft h-[360px] sm:h-[420px] relative bg-slate-100">
                  <iframe
                    title="Shivam Electronics Jolva Map"
                    src={storeInfo.embedMapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                  <div className="absolute bottom-4 left-4 glass-panel px-4 py-2.5 rounded-full text-[11px] font-bold text-slate-900 flex items-center gap-2 shadow-md">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>4.9 Google Rating · Jolva, Gujarat</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── Share Your Photo / Review Callout ──────────────────────── */}
        <section className="mt-12 sm:mt-16 text-center">
          <div
            className="rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden text-white"
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)',
            }}
          >
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <span className="glass-pill text-[10px] font-extrabold uppercase tracking-widest text-indigo-200 bg-white/10 border-white/20">
                Community &amp; Customer Stories
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Have You Visited Shivam Electronics Jolva?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We love seeing our customers enjoying their new 4K TVs, refrigerators, and handcrafted furniture. Add your delivery setup photos or share a review on our Google Maps profile!
              </p>
              <div className="pt-2 flex flex-wrap justify-center items-center gap-3">
                <a
                  href={storeInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Camera size={14} /> Add Photo on Google Maps
                </a>
                <button
                  onClick={() => {
                    setEnquiryProduct(undefined);
                    setIsEnquiryOpen(true);
                  }}
                  className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  Send Showroom Enquiry
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ─── Lightbox Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 md:p-8"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close photo"
            >
              <X size={22} />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all hover:scale-110"
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all hover:scale-110"
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </button>

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl text-white"
            >
              {/* Image Area */}
              <div className="relative flex-1 min-h-[300px] max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&q=85';
                  }}
                />
              </div>

              {/* Info Bottom Bar */}
              <div className="p-6 sm:p-8 bg-slate-900/95 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="glass-pill text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 border border-indigo-400/30">
                      {selectedPhoto.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">
                      ✦ {selectedPhoto.locationTag}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {selectedPhoto.title}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    {selectedPhoto.description}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setEnquiryProduct({
                        id: selectedPhoto.id,
                        name: selectedPhoto.title,
                      });
                      setIsEnquiryOpen(true);
                      setSelectedPhoto(null);
                    }}
                    className="btn btn-primary py-2.5 px-5 text-xs font-bold flex-1 sm:flex-none"
                  >
                    Enquire This Setup
                  </button>
                  <a
                    href={storeInfo.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline py-2.5 px-4 text-xs font-bold text-white border-white/30 hover:bg-white/10 flex-1 sm:flex-none"
                  >
                    <ExternalLink size={13} /> Maps
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Interactive Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        prefillProduct={enquiryProduct}
      />

    </div>
  );
}
