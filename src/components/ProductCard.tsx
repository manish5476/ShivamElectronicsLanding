import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Eye, ArrowUpRight, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types/electronics';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart, items } = useCart();
  const isInCart = items.some(i => i.productId === product.id);

  const primaryImage =
    product.images?.find(img => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    null;

  const discountPct =
    product.mrp && product.sellingPrice && product.mrp > product.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0;

  const emiAmount =
    product.sellingPrice && product.sellingPrice >= 5000
      ? Math.round(product.sellingPrice / 12)
      : null;

  const isOutOfStock = product.availability === 'OUT_OF_STOCK' || product.stockQuantity === 0;
  const isLowStock = !isOutOfStock && product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="group relative flex flex-col p-3 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-medium border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface)]">
      {/* Curved Image Showcase */}
      <Link
        to={`/products/${product.slug}`}
        className="block relative overflow-hidden mb-4 rounded-[1.6rem] aspect-[4/5] bg-[var(--color-surface-soft)]"
        aria-label={`View ${product.name}`}
      >
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=700&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center" style={{ background: 'var(--gradient-hero)' }}>
            <span className="text-3xl font-extrabold opacity-25 tracking-tight font-display" style={{ color: 'var(--color-primary)' }}>
              SHIVAM
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-40 text-[var(--color-text-muted)]">
              Showroom Preview
            </span>
          </div>
        )}

        {/* Floating Glassmorphic Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPct > 0 && (
            <span className="glass-pill px-3 py-1 rounded-full text-[10px] font-extrabold text-rose-600 shadow-sm">
              {discountPct}% OFF
            </span>
          )}
          {product.newArrival && (
            <span className="glass-pill px-3 py-1 rounded-full text-[10px] font-extrabold text-emerald-700 shadow-sm">
              NEW ARRIVAL
            </span>
          )}
          {isLowStock && (
            <span className="glass-pill px-3 py-1 rounded-full text-[10px] font-extrabold text-amber-700 shadow-sm">
              ONLY {product.stockQuantity} LEFT
            </span>
          )}
          {isOutOfStock && (
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-black/70 text-white backdrop-blur-md">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Wishlist Glass Button */}
        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setWishlisted(w => !w);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full glass-pill opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-sm"
        >
          <Heart
            size={15}
            className={wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}
          />
        </button>

        {/* Glassmorphic Quick View & Add Button Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
          <div className="glass-pill flex-1 py-2 px-3 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold text-[var(--color-primary)] shadow-sm pointer-events-auto hover:bg-white transition-colors">
            <Eye size={13} />
            <span>View</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`glass-pill py-2 px-3.5 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold text-white shadow-sm pointer-events-auto transition-transform active:scale-95 ${
              isOutOfStock ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600/90 hover:bg-indigo-600'
            }`}
          >
            {justAdded ? <Check size={13} className="text-emerald-300" /> : <ShoppingBag size={13} />}
            <span>{justAdded ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="flex flex-col gap-1 px-1.5 pb-1">
        {/* Brand Tag */}
        {(product as any).brand?.name && (
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-accent)]">
            {(product as any).brand.name}
          </p>
        )}

        {/* Product Name */}
        <Link
          to={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-bold leading-snug hover:text-[var(--color-accent)] transition-colors"
          style={{ color: 'var(--color-text)', textDecoration: 'none' }}
        >
          {product.name}
        </Link>

        {/* Ratings */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  size={11}
                  className={s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
              {product.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Pricing Hierarchy */}
        <div className="flex flex-wrap items-baseline gap-2 mt-1.5">
          {product.sellingPrice ? (
            <span className="text-base font-extrabold text-[var(--color-primary)]">
              ₹{product.sellingPrice.toLocaleString('en-IN')}
            </span>
          ) : product.mrp ? (
            <span className="text-base font-extrabold text-[var(--color-primary)]">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          ) : null}

          {product.mrp && product.sellingPrice && product.mrp > product.sellingPrice && (
            <span className="text-xs line-through text-[var(--color-text-muted)]">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Zero-Cost EMI Tag */}
        {emiAmount && (
          <p className="text-[11px] font-medium text-[var(--color-text-muted)] mt-0.5">
            EMI from <span className="font-bold text-[var(--color-text)]">₹{emiAmount.toLocaleString('en-IN')}/mo</span>
          </p>
        )}

        {/* Quick Action: Add to Cart */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-border)]/40">
          <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Showroom Ready</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isInCart
                ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xs'
            }`}
          >
            {justAdded ? <Check size={12} /> : <ShoppingBag size={12} />}
            <span>{justAdded ? 'Added!' : isOutOfStock ? 'Out of Stock' : isInCart ? 'In Cart (+)' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
