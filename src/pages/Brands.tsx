import { Link } from 'react-router-dom';
import { useBrands } from '../hooks/useElectronicsData';
import { Award, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Brands() {
  const { brands, loading } = useBrands();

  if (loading) {
    return (
      <div className="bg-[var(--color-bg)] min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mb-4" />
        <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-widest font-bold">Loading Brand Partners...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg)] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Brand Hero */}
        <section className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-8 sm:p-14 lg:p-20 mb-12 border border-[var(--color-border)] shadow-soft" style={{ background: 'var(--gradient-hero)' }}>
          <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-40 bg-[var(--color-primary)]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30 bg-[var(--color-accent)]" />

          <div className="relative z-10 max-w-3xl">
            <span className="glass-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] mb-5 shadow-sm">
              <ShieldCheck size={13} className="text-emerald-600" />
              100% Authorized Retailer
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
              World-Class <span className="text-gradient">Brand Partners</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-[var(--color-text-muted)]">
              Direct Tier-1 relationships with leading global innovators: Sony, LG, Samsung, Haier, Godrej, and handcrafted home furnishings with authentic manufacturer warranties.
            </p>
          </div>
        </section>

        {/* Curved Glassmorphic Brand Pedestals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {brands.map((brand, idx) => (
            <ScrollReveal key={brand.id} delay={idx * 0.08}>
              <Link 
                to={`/products?brand=${brand.id}`} 
                className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-[2.5rem] glass-card hover:-translate-y-2 hover:shadow-medium transition-all duration-500 border border-white/70"
              >
                <div>
                  {/* Brand Monogram / Logo Frame */}
                  <div className="w-20 h-20 rounded-2xl glass-pill flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-108 transition-transform duration-300">
                    {brand.logoUrl ? (
                      <img 
                        src={brand.logoUrl} 
                        alt={brand.name} 
                        className="max-w-[70%] max-h-[70%] object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-black text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {brand.name[0]}
                      </span>
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 mb-3 border border-emerald-200">
                      <ShieldCheck size={11} /> Authorized Partner
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3 group-hover:text-[var(--color-primary)] transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                      {brand.name}
                    </h3>
                    {brand.description && (
                      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3 mb-6">
                        {brand.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Pill */}
                <div className="pt-4 border-t border-[var(--color-border)]/60 flex items-center justify-center">
                  <span className="glass-pill px-4 py-2 rounded-full text-xs font-bold text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all inline-flex items-center gap-1.5 shadow-sm">
                    Explore Brand Collection <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </div>
  );
}
