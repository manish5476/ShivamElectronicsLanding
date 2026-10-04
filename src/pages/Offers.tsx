import { useState, useEffect } from 'react';
import { Tag, Calendar, ShoppingBag, ArrowRight, Sparkles, Gift, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { offersApi } from '../services/electronicsApi';

export default function Offers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      const res = await offersApi.getActive();
      if (res.success && res.data) {
        setOffers(res.data);
      }
      setLoading(false);
    }
    loadOffers();
  }, []);

  if (loading) {
    return (
      <div className="bg-[var(--color-bg)] min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mb-4" />
        <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-widest font-bold">Loading Festive Offers...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg)] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Showroom Hero */}
        <section className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-8 sm:p-14 lg:p-20 mb-12 border border-[var(--color-border)] shadow-soft" style={{ background: 'var(--gradient-hero)' }}>
          <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-40 bg-[var(--color-primary)]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30 bg-rose-500" />

          <div className="relative z-10 max-w-3xl">
            <span className="glass-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] mb-5 shadow-sm">
              <Gift size={13} className="text-rose-500" />
              Festive Season & Special Savings
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Showroom <span className="text-gradient">Promotions</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-[var(--color-text-muted)]">
              Exclusive seasonal deals, instant exchange bonuses, and festive bank financing offers available across our electronics and home furniture collections.
            </p>
          </div>
        </section>

        {/* Offers Grid */}
        {offers.length === 0 ? (
          <div className="glass-panel p-12 sm:p-20 rounded-[3rem] text-center max-w-2xl mx-auto shadow-soft my-10 border border-white/60">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-soft)] flex items-center justify-center mx-auto mb-4 text-2xl">
              🎁
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Stay Tuned for Upcoming Festive Sales
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-8 leading-relaxed max-w-md mx-auto">
              Our showroom team is preparing exciting seasonal campaigns. Visit our showroom or browse active products with verified everyday low prices.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/products" className="btn btn-primary py-3 px-6 text-xs font-bold">
                Explore Collection
              </Link>
              <Link to="/contact?tab=booking" className="btn btn-outline py-3 px-6 text-xs font-bold">
                Book Showroom Visit
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {offers.map((offer, idx) => (
              <ScrollReveal key={offer.id || idx} delay={idx * 0.1}>
                <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border border-white/70 shadow-soft hover:shadow-medium transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[var(--color-primary)]">
                        {offer.applicable_to === 'ALL' ? 'STOREWIDE OFFER' : offer.applicable_to}
                      </span>
                      {offer.discount_value && (
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-600 border border-rose-200">
                          {offer.offer_type === 'PERCENTAGE' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                      {offer.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed mb-6">
                      {offer.description || 'Special limited-period showroom festival incentive. Visit or enquire online for instant verification.'}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[var(--color-border)]/60 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1.5">
                      <Calendar size={13} /> Valid while stocks last
                    </span>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline"
                    >
                      Browse Eligible Items <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
