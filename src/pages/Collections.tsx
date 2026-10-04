import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import EmptyState from '../components/EmptyState';
import { useCollections } from '../hooks/useData';

export default function Collections() {
  const { collections, loading } = useCollections();
  return (
    <div>
      {/* Header */}
      <section className="py-20 lg:py-32 bg-cream/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A96E 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <ScrollReveal>
            <div className="ornament-divider mb-8">
              <div className="w-2 h-2 border border-light-gold rotate-45"></div>
            </div>
            
            <p className="section-label mb-6">
              Curated With Care
            </p>
            
            <h1 className="display-serif text-5xl sm:text-6xl lg:text-7xl text-espresso mb-6 leading-[1.05]">
              Explore Our <span className="italic">World</span>
            </h1>
            
            <p className="text-taupe max-w-2xl mx-auto leading-relaxed text-lg">
              Each collection is a curated expression of Indian craftsmanship — from timeless jewellery to festive Navratri ornaments and intricate embroidery.
            </p>
            
            <div className="ornament-divider mt-10">
              <div className="w-2 h-2 border border-light-gold rotate-45"></div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="shimmer w-full sm:w-64 aspect-[16/10] rounded"></div>
                  <div className="flex-1 w-full">
                    <div className="shimmer w-20 h-3 mb-3 rounded"></div>
                    <div className="shimmer w-48 h-6 mb-3 rounded"></div>
                    <div className="shimmer w-full h-12 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : collections.length === 0 ? (
            <EmptyState 
              title="Collections Coming Soon" 
              description="Our curated collections are being prepared. Each collection tells a unique story of craftsmanship and tradition."
            />
          ) : (
            <div className="space-y-12 lg:space-y-20">
              {collections.map((col, idx) => (
              <ScrollReveal key={col.id} delay={idx * 0.05}>
                <Link
                  to={`/collections/${col.slug}`}
                  className={`group grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center ${
                    idx % 2 === 1 ? 'lg:direction-rtl' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden aspect-[16/10] ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <img
                      src={col.coverImage}
                      alt={col.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className={`${idx % 2 === 1 ? 'lg:order-1 lg:text-right' : ''}`}>
                    <p className="text-xs uppercase tracking-[0.3em] text-light-gold font-sans font-medium mb-3">
                      Collection
                    </p>
                    <h2 className="heading-serif text-3xl lg:text-4xl font-semibold text-espresso mb-4 group-hover:text-muted-gold transition-colors">
                      {col.name}
                    </h2>
                    <p className="text-taupe leading-relaxed mb-6">{col.description}</p>
                    <span className="inline-flex items-center gap-2 text-sm text-espresso font-sans font-medium gold-underline">
                      Explore Collection <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
