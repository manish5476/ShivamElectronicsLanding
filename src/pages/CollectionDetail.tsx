import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useDesigns, useCollections } from '../hooks/useData';

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { collections } = useCollections();
  const { designs, loading } = useDesigns();
  
  const collection = collections.find((c) => c.slug === slug);
  const [filter, setFilter] = useState('all');

  if (!collection) {
    return (
      <div className="py-24 text-center">
        <h1 className="heading-serif text-3xl text-espresso mb-4">Collection Not Found</h1>
        <p className="text-taupe mb-6">This collection doesn't exist or has been moved.</p>
        <Link to="/collections" className="text-muted-gold underline">Browse all collections</Link>
      </div>
    );
  }

  const collectionDesigns = designs.filter((d) => d.collectionId === collection.id);
  const categories = ['all', ...new Set(collectionDesigns.map((d) => d.category.toLowerCase()))];

  const filteredDesigns = filter === 'all'
    ? collectionDesigns
    : collectionDesigns.filter((d) => d.category.toLowerCase() === filter);

  return (
    <div>
      {/* Collection Header */}
      <section className="relative py-24 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-espresso/40 via-espresso/50 to-espresso/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="ornament-divider mb-8">
              <div className="w-2 h-2 border border-light-gold/60 rotate-45"></div>
            </div>
            
            <p className="section-label mb-6 text-light-gold/90">
              Collection
            </p>
            
            <h1 className="display-serif text-5xl sm:text-6xl lg:text-7xl text-ivory mb-6 leading-[1.05]">
              {collection.name}
            </h1>
            
            <p className="text-ivory/80 max-w-xl mx-auto text-lg leading-relaxed">{collection.description}</p>
            
            <div className="ornament-divider mt-10">
              <div className="w-2 h-2 border border-light-gold/60 rotate-45"></div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-champagne/30 sticky top-16 lg:top-20 bg-ivory/95 backdrop-blur-sm z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-sans whitespace-nowrap transition-colors border ${
                  filter === cat
                    ? 'border-light-gold bg-light-gold/10 text-espresso'
                    : 'border-champagne text-taupe hover:border-light-gold'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Designs Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-taupe">Loading designs...</p>
            </div>
          ) : filteredDesigns.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-taupe heading-serif text-xl">
                No designs are currently available in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredDesigns.map((design, idx) => (
                <ScrollReveal key={design.id} delay={idx * 0.05}>
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
                      {design.availability === 'sold' && (
                        <div className="absolute inset-0 bg-espresso/40 flex items-center justify-center">
                          <span className="bg-ivory text-espresso text-xs uppercase tracking-wider px-3 py-1.5 font-sans">
                            Sold
                          </span>
                        </div>
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
                    {design.priceType === 'on-request' && (
                      <p className="text-sm text-muted-gold mt-2 font-sans font-medium">
                        Price on request
                      </p>
                    )}
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
