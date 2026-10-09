import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  ChevronRight, Star, Phone, MessageCircle, Share2, Heart,
  ShieldCheck, Truck, Sparkles, CreditCard, Wrench, ArrowLeft,
  ShoppingBag, Check, Zap, MapPin, Award, Clock, BadgePercent,
  CheckCircle2, ExternalLink, Ticket, Eye
} from 'lucide-react';
import { useProducts } from '../hooks/useElectronicsData';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import EnquiryModal from '../components/EnquiryModal';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { products, loading } = useProducts();
  const { addToCart, openCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const product = products.find(p => p.slug === slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-xs uppercase tracking-widest font-extrabold">
          Loading Showroom Spotlight...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
        <div className="bg-white p-10 sm:p-14 rounded-[3rem] text-center max-w-md shadow-soft border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Eye size={28} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Product Spotlight Not Found
          </h1>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            This item may have been reserved or moved in our Jolva showroom collection.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Explore Active Showroom Collection
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : [{ imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&q=80', altText: product.name }];

  const discount = product.mrp && product.sellingPrice 
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0;

  const savingsAmount = product.mrp && product.sellingPrice && product.mrp > product.sellingPrice
    ? product.mrp - product.sellingPrice
    : 0;

  const emiAmount = product.sellingPrice && product.sellingPrice >= 5000
    ? Math.round(product.sellingPrice / 12)
    : null;

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.categoryId === product.categoryId || p.brandId === product.brandId))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    openCart();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Shivam Electronics Flagship Showroom Jolva!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const waRaw = '9510082747';
  const waProductMessage = encodeURIComponent(
    `Hello Shivam Electronics Jolva,\n\nI am interested in:\n*${product.name}*\nPrice: ₹${(product.sellingPrice || product.mrp || 0).toLocaleString('en-IN')}\n\nPlease share stock status and best showroom festive deal.`
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-slate-900 pb-20 overflow-x-hidden">
      
      {/* ── Cinematic Marquee Advertising Ribbon ───────────────────── */}
      <div className="bg-slate-950 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] py-2.5 px-4 overflow-hidden border-b border-white/10 flex items-center justify-center">
        <div className="flex items-center gap-6 animate-pulse text-center">
          <span className="flex items-center gap-1.5 text-amber-300">
            <Sparkles size={12} className="text-amber-400" />
            SHOWROOM EXCLUSIVE CAMPAIGN
          </span>
          <span className="hidden md:inline text-white/30">✦</span>
          <span className="hidden md:inline text-slate-300">
            JOLVA FLAGSHIP SHOWROOM · 7-DAY PRICE LOCK RESERVATION
          </span>
          <span className="hidden sm:inline text-white/30">✦</span>
          <span className="text-emerald-400">
            0% ZERO-COST EMI AVAILABLE ON AADHAAR &amp; PAN
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* ── Curved Navigation & Share Bar ────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
          <nav className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200/80 shadow-xs">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-indigo-600 transition-colors">Catalog</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link to={`/categories/${product.category.slug}`} className="hover:text-indigo-600 transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-slate-900 truncate max-w-[140px] sm:max-w-xs">{product.name}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-xs font-bold text-slate-700 hover:text-indigo-600 border border-slate-200 shadow-xs transition-colors"
              title="Share Product"
            >
              <Share2 size={13} />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-rose-500 border border-slate-200 shadow-xs transition-all hover:scale-105"
              aria-label="Add to Wishlist"
            >
              <Heart size={15} className={wishlisted ? 'fill-rose-500 text-rose-500' : ''} />
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            ULTRA-CURVED BENTO GRID PRODUCT ADVERTISEMENT STAGE
           ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-stretch mb-12">
          
          {/* ── BENTO TILE 1: The Visual Billboard Showcase (7 Cols) ────── */}
          <div className="lg:col-span-7 bg-white rounded-[2.8rem] sm:rounded-[3.6rem] border border-slate-200/90 shadow-soft p-5 sm:p-9 flex flex-col justify-between relative overflow-hidden group">
            
            {/* Ambient Spotlight Gradients */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-indigo-500/8 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-400/8 blur-3xl pointer-events-none" />

            {/* Top Badges Row */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                {product.brand?.name && (
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-slate-950 text-white">
                    {product.brand.name}
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs">
                    {discount}% OFF FESTIVE SPECIAL
                  </span>
                )}
                {product.newArrival && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                    NEW 2026 LAUNCH
                  </span>
                )}
              </div>

              {product.sku && (
                <span className="text-[10px] font-mono font-bold text-slate-400 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                  REF: {product.sku}
                </span>
              )}
            </div>

            {/* High-Impact Centered Photo Billboard Stage */}
            <div className="relative z-10 my-4 sm:my-8 aspect-[4/3] sm:aspect-[16/11] rounded-[2.2rem] sm:rounded-[3rem] bg-gradient-to-b from-slate-50/90 to-[#F4F6FB]/80 border border-slate-100/90 flex items-center justify-center p-6 sm:p-12 overflow-hidden shadow-inner">
              <img
                src={images[activeImage]?.imageUrl}
                alt={images[activeImage]?.altText || product.name}
                className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1000&q=80';
                }}
              />

              {/* Watermark Tag */}
              <div className="absolute bottom-4 left-6 pointer-events-none opacity-40 text-[9px] font-extrabold uppercase tracking-widest text-slate-500">
                Official Showroom Display · Jolva
              </div>
            </div>

            {/* Bottom Gallery Thumbnail Dock (Curved Pill Bar) */}
            {images.length > 1 && (
              <div className="relative z-10 pt-2 flex items-center gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-[1.6rem] overflow-hidden border-2 transition-all flex-shrink-0 bg-white p-1.5 shadow-xs ${
                      idx === activeImage
                        ? 'border-indigo-600 ring-4 ring-indigo-500/20 scale-105'
                        : 'border-slate-200/90 hover:border-slate-400 opacity-80'
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.altText || ''}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&q=80';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── BENTO TILE 2: Command & Price Lock Hub (5 Cols) ─────────── */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5 sm:gap-6 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-white rounded-[2.8rem] sm:rounded-[3.6rem] p-6 sm:p-9 shadow-strong border border-slate-800 relative overflow-hidden">
            
            {/* Subtle Metallic Backlight */}
            <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

            <div>
              {/* Monogram Brand Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/10 text-amber-300 border border-amber-300/30 flex items-center gap-1.5">
                  <Sparkles size={11} className="text-amber-400" />
                  FLAGSHIP PRICE LOCK
                </span>
                
                {product.rating > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-bold text-white">{product.rating.toFixed(1)} / 5</span>
                  </div>
                )}
              </div>

              {/* Product Headline */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                {product.name}
              </h1>

              {/* Short Teaser Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-6">
                {product.description || product.shortDescription || 'Experience unmatched brand reliability, superior build quality, and exclusive authorized showroom pricing backed by our 7-day price lock guarantee.'}
              </p>

              {/* ── The Pricing Bento Pod (Curved Pill Box) ────────────── */}
              <div className="p-5 sm:p-6 rounded-[2.2rem] bg-white/10 backdrop-blur-xl border border-white/15 space-y-3 mb-6 shadow-soft">
                <div className="flex items-baseline gap-3 flex-wrap">
                  {product.sellingPrice ? (
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      ₹{product.sellingPrice.toLocaleString('en-IN')}
                    </span>
                  ) : product.mrp ? (
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-xl font-bold text-amber-300">
                      Showroom Quote on Request
                    </span>
                  )}

                  {product.mrp && product.sellingPrice && product.mrp > product.sellingPrice && (
                    <span className="text-sm line-through text-slate-400 font-semibold">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  )}

                  {savingsAmount > 0 && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Save ₹{savingsAmount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* 0% EMI Banner */}
                {emiAmount && (
                  <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CreditCard size={14} className="text-indigo-400" />
                      Zero-Cost EMI from
                    </span>
                    <span className="font-extrabold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                      ₹{emiAmount.toLocaleString('en-IN')} / month
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ── High-Converting CTA Actions ────────────────────────── */}
            <div className="space-y-3">
              
              {/* PRIMARY ACTION: Add to Cart & Generate Token */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 px-6 rounded-full text-xs font-black tracking-wide uppercase bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-500 text-white shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 border border-indigo-400/40"
              >
                {justAdded ? <Check size={16} className="text-emerald-300" /> : <ShoppingBag size={16} />}
                <span>{justAdded ? 'Reserved in Cart!' : 'Lock Showroom Price & Add to Cart'}</span>
              </button>

              {/* SECONDARY ROW: WhatsApp + Demo */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/91${waRaw}?text=${waProductMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-full text-[11px] font-bold bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-1.5 text-center shadow-sm"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Quote</span>
                </a>

                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="py-3 px-4 rounded-full text-[11px] font-bold bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all text-center"
                >
                  Book In-Store Demo
                </button>
              </div>

              {/* Showroom Live Readiness Status */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-semibold text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Stock at Jolva Flagship Showroom</span>
              </div>
            </div>

          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            MIDDLE 3-TIER BENTO VALUE STRIP (ALL ORGANIC SQUIRCLES)
           ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12">
          
          {/* Tile 3: 4-Hour Express Showroom Delivery */}
          <div className="bg-white rounded-[2.5rem] p-7 border border-slate-200/90 shadow-soft flex flex-col justify-between hover:shadow-medium transition-shadow">
            <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <Zap size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 block mb-1">
                Same-Day Fulfillment
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                4-Hour Local Express Delivery
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Order before 2 PM for doorstep unboxing and installation tonight anywhere in Jolva, Palsana, or Kadodara.
              </p>
            </div>
          </div>

          {/* Tile 4: Spot 0% Zero Down Payment Finance */}
          <div className="bg-white rounded-[2.5rem] p-7 border border-slate-200/90 shadow-soft flex flex-col justify-between hover:shadow-medium transition-shadow">
            <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <BadgePercent size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block mb-1">
                Paperless Spot Financing
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                ₹0 Down Payment · 10-Min EMI
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant digital approvals with Bajaj Finserv, TVS Credit, IDFC First Bank, and HDFC using Aadhaar &amp; PAN card.
              </p>
            </div>
          </div>

          {/* Tile 5: 100% Genuine Authorized Brand Warranty */}
          <div className="bg-white rounded-[2.5rem] p-7 border border-slate-200/90 shadow-soft flex flex-col justify-between hover:shadow-medium transition-shadow">
            <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <Award size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 block mb-1">
                Authenticity Seal
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Official Brand Warranty
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.warranty ? `${product.warranty} coverage` : '100% Genuine Brand Warranty'} with official GST invoice and doorstep authorized company service.
              </p>
            </div>
          </div>

        </div>

        {/* ════════════════════════════════════════════════════════════════
            BENTO TILE 6: TECHNICAL ATTRIBUTES & ARCHITECTURE POD
           ════════════════════════════════════════════════════════════════ */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="bg-white rounded-[2.8rem] sm:rounded-[3.6rem] border border-slate-200/90 shadow-soft p-7 sm:p-12 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
              <div>
                <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100 inline-block mb-2">
                  Engineered Blueprint
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  Technical Specifications
                </h2>
              </div>
              <p className="text-xs text-slate-500 max-w-sm">
                Certified manufacturer parameters verified by Shivam Electronics inspection desk.
              </p>
            </div>

            {/* Asymmetric Curved Specification Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {product.specifications.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-[1.8rem] bg-[#F8FAFC] border border-slate-200/70 flex items-center justify-between hover:bg-white hover:shadow-xs transition-all"
                >
                  <span className="text-xs font-bold text-slate-500">
                    {spec.attribute?.name || 'Specification'}
                  </span>
                  <span className="text-xs font-black text-slate-900 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                    {spec.value} {spec.attribute?.unit || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            BENTO TILE 7: THE JOLVA SHOWROOM ADVERTISEMENT BILLBOARD
           ════════════════════════════════════════════════════════════════ */}
        <div className="relative rounded-[2.8rem] sm:rounded-[3.6rem] bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-8 sm:p-14 shadow-strong overflow-hidden mb-16 border border-slate-800">
          
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/10 text-amber-300 border border-amber-300/30 inline-block mb-3">
              Live Showroom Invitation
            </span>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              See It. Hear It. Test It in Person at Jolva.
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
              Why guess on a phone screen? Visit Shivam Electronics on the Jolva Main Road. Compare screen panels side-by-side, test refrigerator cooling, feel the teakwood finish, and get instant festive cash discounts with a warm cup of Gujarati chai.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors shadow-md"
              >
                <MapPin size={15} className="text-indigo-600" />
                <span>Showroom Location &amp; Map</span>
              </Link>

              <a
                href="tel:9574219663"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 text-white text-xs font-bold hover:bg-white/20 border border-white/20 transition-colors"
              >
                <Phone size={14} />
                <span>Call Showroom (+91 95742 19663)</span>
              </a>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RELATED SHOWROOM PICKS (CURVED PRODUCT TILES)
           ════════════════════════════════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100 inline-block mb-1.5">
                  Handpicked Alternatives
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  You May Also Love
                </h3>
              </div>
              <Link
                to="/products"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View Full Catalog</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* VIP In-Store Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        prefillProduct={{ id: product.id, name: product.name, sku: product.sku }}
      />

    </div>
  );
}
