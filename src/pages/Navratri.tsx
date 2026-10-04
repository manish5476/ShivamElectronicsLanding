import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useDesigns } from '../hooks/useData';

interface NavratriPageProps {
  onBookClick: () => void;
}

export default function NavratriPage({ onBookClick }: NavratriPageProps) {
  const { designs, loading } = useDesigns();
  const navratriDesigns = designs.filter((d) => (d.collectionId === 'navratri') || (d as any).collection_id === 'navratri');

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=80"
            alt="Navratri Collection"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-px bg-light-gold/70"></div>
                <p className="section-label text-light-gold/90">
                  Festive Collection
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <h1 className="display-serif text-5xl sm:text-6xl lg:text-7xl text-ivory leading-[1.05] mb-6">
                The Navratri<br />
                <span className="italic">Edit</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <p className="display-serif text-2xl sm:text-3xl text-ivory/80 italic mb-8">
                Handcrafted ornaments for every Garba night.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <p className="text-ivory/70 leading-relaxed mb-10 text-lg max-w-xl">
                Nine nights of dance, color, and celebration deserve ornaments that move with you. Discover our handcrafted Navratri collection — vibrant chandbalis, statement jhumkas, and accessories designed for festive styling.
              </p>
              <div className="flex flex-wrap gap-5">
                <button
                  onClick={onBookClick}
                  className="inline-flex items-center gap-3 bg-light-gold text-espresso px-7 py-3.5 text-[13px] font-sans font-medium tracking-wide hover:bg-champagne transition-all group"
                >
                  Book Festive Design
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-champagne" />
          <div className="w-2 h-2 rounded-full bg-light-gold" />
          <div className="w-12 h-px bg-champagne" />
        </div>
      </div>

      {/* Collection Intro */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="heading-serif text-3xl lg:text-4xl font-semibold text-espresso mb-6">
                Celebrate Every Night
              </h2>
              <p className="text-taupe leading-relaxed">
                From the first Garba to the final Raas, our Navratri collection is designed to complement your traditional styling across all nine nights. Each piece is handcrafted with vibrant colors, traditional motifs, and the movement-friendly design that festive celebrations demand.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Designs Grid */}
      <section className="py-12 lg:py-16 bg-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="heading-serif text-2xl lg:text-3xl font-semibold text-espresso mb-10 text-center">
              Navratri Designs
            </h2>
          </ScrollReveal>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-taupe">Loading designs...</p>
            </div>
          ) : navratriDesigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-taupe mb-2">No Navratri designs available yet.</p>
              <p className="text-sm text-taupe/70">Navratri designs will appear here once added by the admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {navratriDesigns.map((design, idx) => (
              <ScrollReveal key={design.id} delay={idx * 0.1}>
                <Link to={`/designs/${design.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-cream mb-4">
                    <img
                      src={design.images[0]?.url}
                      alt={design.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {design.customizable && (
                      <span className="absolute top-3 left-3 bg-ivory/90 text-espresso text-[10px] uppercase tracking-wider px-2 py-1 font-sans">
                        Customizable
                      </span>
                    )}
                  </div>
                  <p className="text-xs uppercase tracking-wider text-taupe font-sans mb-1">
                    {design.category}
                  </p>
                  <h3 className="heading-serif text-xl font-semibold text-espresso group-hover:text-muted-gold transition-colors mb-1">
                    {design.name}
                  </h3>
                  <p className="text-sm text-taupe line-clamp-2">{design.description}</p>
                  {design.price && (
                    <p className="text-sm text-muted-gold mt-2 font-sans font-medium">
                      {design.priceType === 'starting' ? 'Starting from ' : ''}{design.price}
                    </p>
                  )}
                </Link>
              </ScrollReveal>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="heading-serif text-2xl lg:text-3xl font-semibold text-espresso mb-10 text-center">
              What You'll Find
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Chandbalis', desc: 'Crescent-shaped statement earrings' },
              { title: 'Jhumkas', desc: 'Traditional bell-shaped earrings' },
              { title: 'Hair Accessories', desc: 'Decorative pins and chains' },
              { title: 'Neckpieces', desc: 'Festive collars and chokers' },
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="text-center p-6 border border-champagne/50 hover:border-light-gold transition-colors">
                  <h3 className="heading-serif text-lg font-semibold text-espresso mb-2">{item.title}</h3>
                  <p className="text-sm text-taupe">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-espresso text-ivory text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="heading-serif text-3xl lg:text-4xl font-semibold mb-4">
              Ready for Navratri?
            </h2>
            <p className="text-ivory/70 max-w-lg mx-auto mb-8">
              Book your festive pieces early to ensure availability. Custom designs for Navratri take 2-3 weeks.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={onBookClick}
                className="inline-flex items-center gap-2 bg-light-gold text-espresso px-7 py-3.5 text-sm font-sans font-medium hover:bg-champagne transition-colors"
              >
                Book Your Festive Design
                <ArrowRight size={14} />
              </button>
              <Link
                to="/custom-design"
                className="inline-flex items-center gap-2 border border-ivory/30 text-ivory px-7 py-3.5 text-sm font-sans font-medium hover:bg-ivory/10 transition-colors"
              >
                Request Custom Design
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
