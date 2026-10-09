import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronRight, Star, Phone, MessageCircle, Share2, Heart, ShieldCheck, Truck, Sparkles, CreditCard, Wrench, ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { useProducts } from '../hooks/useElectronicsData';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import EnquiryModal from '../components/EnquiryModal';
import ScrollReveal from '../components/ScrollReveal';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { products, loading } = useProducts();
  const { addToCart, openCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const product = products.find(p => p.slug === slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mb-4" />
        <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-widest font-bold">Loading Product Spotlight...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
        <div className="glass-panel p-12 rounded-[2.5rem] text-center max-w-md shadow-soft">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Product Not Found</h1>
          <p className="text-xs text-[var(--color-text-muted)] mb-6">The requested product could not be located in our active catalogue.</p>
          <Link to="/products" className="btn btn-primary py-2.5 px-6 text-xs font-bold">Return to Collection</Link>
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

  const emiAmount = product.sellingPrice && product.sellingPrice >= 5000
    ? Math.round(product.sellingPrice / 12)
    : null;

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  return (
    <div className="bg-[var(--color-background)] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Glass Pill */}
        <div className="mb-8">
          <nav className="glass-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] shadow-sm">
            <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[var(--color-primary)] transition-colors">Shop</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link to={`/categories/${product.category.slug}`} className="hover:text-[var(--color-primary)] transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[var(--color-text)] truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
          </nav>
        </div>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mb-20">
          
          {/* Left: Gallery (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 space-y-4">
              
              {/* Main Image Frame - Curved Architectural Container */}
              <div
                className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden aspect-[4/3] sm:aspect-[16/11] border border-[var(--color-border)] shadow-soft group"
                style={{ background: 'var(--color-surface)' }}
              >
                <img 
                  src={images[activeImage]?.imageUrl} 
                  alt={images[activeImage]?.altText || product.name} 
                  className="w-full h-full object-contain p-6 sm:p-10 transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1000&q=80';
                  }}
                />

                {/* Badges in Glass Pills */}
                <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                  {discount > 0 && (
                    <span className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-extrabold text-rose-600 shadow-sm">
                      {discount}% SHOWROOM DISCOUNT
                    </span>
                  )}
                  {product.newArrival && (
                    <span className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-extrabold text-emerald-700 shadow-sm">
                      NEW LAUNCH
                    </span>
                  )}
                </div>

                {/* Wishlist Glass Button */}
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className="absolute top-5 right-5 w-11 h-11 rounded-full glass-pill flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                  aria-label="Wishlist"
                >
                  <Heart size={18} className={wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'} />
                </button>
              </div>

              {/* Thumbnails Row in Glass Pills */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 px-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                        idx === activeImage 
                          ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 shadow-sm scale-105' 
                          : 'border-[var(--color-border)] hover:opacity-80'
                      }`}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.altText || ''}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Info, Price & Actions (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 sm:p-10 rounded-[2.5rem] border border-white/60 shadow-soft space-y-6">
              
              {/* Brand and SKU */}
              <div className="flex items-center justify-between">
                {product.brand?.name ? (
                  <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                    {product.brand.name}
                  </span>
                ) : <span />}
                {product.sku && (
                  <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                    Model: {product.sku}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[var(--color-text)]">
                    {product.rating.toFixed(1)} Showroom Score
                  </span>
                </div>
              )}

              {/* Pricing Glass Card */}
              <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  {product.sellingPrice ? (
                    <span className="text-3xl font-extrabold text-[var(--color-primary)]">
                      ₹{product.sellingPrice.toLocaleString('en-IN')}
                    </span>
                  ) : product.mrp ? (
                    <span className="text-3xl font-extrabold text-[var(--color-primary)]">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-[var(--color-primary)]">
                      Price on Enquiry
                    </span>
                  )}

                  {product.mrp && product.sellingPrice && product.mrp > product.sellingPrice && (
                    <span className="text-sm line-through text-[var(--color-text-muted)]">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {emiAmount && (
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1.5 pt-1 border-t border-[var(--color-border)]/60">
                    <CreditCard size={13} className="text-[var(--color-accent)]" />
                    Zero-cost EMI plans available from <strong className="text-[var(--color-text)]">₹{emiAmount.toLocaleString('en-IN')}/month</strong>
                  </p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {product.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    addToCart(product);
                    setJustAdded(true);
                    setTimeout(() => setJustAdded(false), 2000);
                    openCart();
                  }}
                  className="btn btn-primary w-full py-4 text-xs font-bold shadow-md hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
                >
                  {justAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
                  <span>{justAdded ? 'Added to Cart!' : 'Add to Cart & Lock Showroom Price'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setIsEnquiryOpen(true)}
                    className="btn btn-outline py-3 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle size={14} /> Enquire Price
                  </button>
                  <Link
                    to="/contact?tab=booking"
                    className="btn btn-outline py-3 text-xs font-bold flex items-center justify-center text-center"
                  >
                    Book Store Demo
                  </Link>
                </div>
              </div>

              {/* Showroom Trust Pillars */}
              <div className="pt-4 border-t border-[var(--color-border)]/80 space-y-2 text-xs font-semibold text-[var(--color-text-muted)]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-600 flex-shrink-0" />
                  <span>100% Genuine Authorized Brand Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-emerald-600 flex-shrink-0" />
                  <span>Free Express Doorstep Delivery & Unboxing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench size={15} className="text-emerald-600 flex-shrink-0" />
                  <span>Dedicated Showroom Assistance for Brand Installation</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Dynamic Specifications Section */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="mb-20">
            <div className="glass-panel p-8 sm:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/60 shadow-soft">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-accent)] block mb-2">
                Engineered Details
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
                Technical Specifications
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.specifications.map((spec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-[var(--color-text-muted)]">
                      {spec.attribute?.name || 'Specification'}
                    </span>
                    <span className="text-xs font-extrabold text-[var(--color-text)]">
                      {spec.value} {spec.attribute?.unit || ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-accent)] block mb-1">
                  Similar Discoveries
                </span>
                <h3 className="text-2xl font-extrabold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  You May Also Like
                </h3>
              </div>
              <Link to="/products" className="text-xs font-bold text-[var(--color-primary)] hover:underline">
                View All Collection →
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

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        prefillProduct={{ id: product.id, name: product.name, sku: product.sku }}
      />
    </div>
  );
}
