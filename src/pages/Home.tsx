import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Palette, Heart, Star } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import EmptyState from '../components/EmptyState';
import { useDesigns, useCollections } from '../hooks/useData';

interface HomePageProps {
  onBookClick: () => void;
}

export default function HomePage({ onBookClick }: HomePageProps) {
  const { designs, loading: designsLoading } = useDesigns();
  const { collections, loading: collectionsLoading } = useCollections();
  
  const featuredCollections = collections.filter((c) => c.featured).slice(0, 5);
  const featuredDesigns = designs.filter((d) => d.featured).slice(0, 6);
  const isLoading = designsLoading || collectionsLoading;

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=1600&q=80"
            alt="Mimiko Studio - Handcrafted jewellery and ornaments"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ivory/50 via-transparent to-transparent" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-10 w-px h-32 bg-gradient-to-b from-transparent via-light-gold/30 to-transparent hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-20 w-px h-24 bg-gradient-to-b from-transparent via-light-gold/20 to-transparent hidden lg:block"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
          <div className="max-w-3xl">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-px bg-light-gold"></div>
                <p className="section-label">
                  Mimiko Atelier
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <h1 className="display-serif text-5xl sm:text-6xl lg:text-[5.5rem] text-espresso leading-[1.05] mb-8">
                Crafted to Adorn.
                <br />
                <span className="italic text-muted-gold">Designed to Remember.</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <p className="text-taupe text-lg leading-relaxed mb-10 max-w-xl">
                Discover handcrafted jewellery, traditional ornaments and artistic creations made for your most beautiful occasions.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <div className="flex flex-wrap gap-5">
                <Link
                  to="/collections"
                  className="btn-primary inline-flex items-center gap-3 group"
                >
                  Explore Collection
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <button
                  onClick={onBookClick}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  Book Consultation
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
          <p className="text-[10px] tracking-[0.2em] text-taupe/60 uppercase">Scroll</p>
          <div className="w-px h-12 bg-gradient-to-b from-light-gold/50 to-transparent"></div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-light-gold/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <div className="ornament-divider mb-8">
                <div className="w-2 h-2 border border-light-gold rotate-45"></div>
              </div>
              
              <p className="section-label mb-6">
                The Art of Adornment
              </p>
              
              <h2 className="display-serif text-4xl sm:text-5xl lg:text-6xl text-espresso mb-8 leading-[1.1]">
                Where Craftsmanship<br />
                <span className="italic">Meets Celebration</span>
              </h2>
              
              <p className="text-taupe leading-relaxed text-lg max-w-2xl mx-auto">
                Every piece from Mimiko Studio is a celebration of Indian artistry — handcrafted with patience, designed with intention, and made to be treasured. From bridal jewellery to festive Navratri ornaments, we create pieces that become part of your story.
              </p>
              
              <div className="ornament-divider mt-10">
                <div className="w-2 h-2 border border-light-gold rotate-45"></div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <section className="py-24 lg:py-32 bg-cream/30 relative">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A96E 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center mb-16 lg:mb-20">
              <p className="section-label mb-4">
                Curated Collections
              </p>
              <h2 className="display-serif text-4xl sm:text-5xl lg:text-6xl text-espresso leading-[1.1]">
                Discover Our <span className="italic">World</span>
              </h2>
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="shimmer w-32 h-4 mx-auto mb-3 rounded"></div>
              <div className="shimmer w-48 h-4 mx-auto rounded"></div>
            </div>
          ) : featuredCollections.length === 0 ? (
            <EmptyState 
              title="Collections Coming Soon" 
              description="Our curated collections are being prepared. Check back soon to discover beautiful handcrafted pieces."
            />
          ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Large feature card */}
            <ScrollReveal className="lg:col-span-7 lg:row-span-2">
              <Link to="/collections/jewellery" className="group block relative overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-full">
                <img
                  src={featuredCollections[0]?.coverImage}
                  alt={featuredCollections[0]?.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 lg:p-8">
                  <p className="text-xs uppercase tracking-widest text-light-gold font-sans mb-2">
                    {featuredCollections[0]?.name}
                  </p>
                  <h3 className="heading-serif text-2xl lg:text-3xl text-ivory font-semibold mb-2">
                    {featuredCollections[0]?.description}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-ivory/80 text-sm group-hover:text-light-gold transition-colors">
                    Explore Collection <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </ScrollReveal>

            {/* Smaller cards */}
            {featuredCollections.slice(1, 3).map((col, idx) => (
              <ScrollReveal key={col.id} delay={idx * 0.1} className="lg:col-span-5">
                <Link to={`/collections/${col.slug}`} className="group block relative overflow-hidden aspect-[16/10]">
                  <img
                    src={col.coverImage}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 lg:p-6">
                    <p className="text-xs uppercase tracking-widest text-light-gold font-sans mb-1">
                      {col.name}
                    </p>
                    <p className="text-ivory/80 text-sm">{col.description}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}

            {featuredCollections.slice(3, 5).map((col, idx) => (
              <ScrollReveal key={col.id} delay={(idx + 2) * 0.1} className="lg:col-span-6">
                <Link to={`/collections/${col.slug}`} className="group block relative overflow-hidden aspect-[16/9]">
                  <img
                    src={col.coverImage}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 lg:p-6">
                    <p className="text-xs uppercase tracking-widest text-light-gold font-sans mb-1">
                      {col.name}
                    </p>
                    <p className="text-ivory/80 text-sm">{col.description}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* SIGNATURE DESIGNS */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16">
              <div>
                <p className="section-label mb-4">
                  Featured Pieces
                </p>
                <h2 className="display-serif text-4xl sm:text-5xl text-espresso leading-[1.1]">
                  Signature <span className="italic">Designs</span>
                </h2>
              </div>
              <Link
                to="/collections"
                className="mt-6 sm:mt-0 inline-flex items-center gap-3 text-[13px] text-espresso/70 hover:text-espresso transition-colors gold-underline tracking-wide group"
              >
                View All Designs 
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="shimmer aspect-[3/4] rounded mb-4"></div>
                  <div className="shimmer w-24 h-3 mb-2 rounded"></div>
                  <div className="shimmer w-40 h-4 rounded"></div>
                </div>
              ))}
            </div>
          ) : featuredDesigns.length === 0 ? (
            <EmptyState 
              title="Designs Coming Soon" 
              description="Our signature designs are being crafted with care. Soon you'll discover unique pieces made for your most beautiful occasions."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredDesigns.map((design, idx) => (
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

      {/* NAVRATRI FEATURE */}
      <section className="py-16 lg:py-24 bg-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
                    alt="Navratri Collection by Mimiko Studio"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-champagne/30 -z-10" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-light-gold font-sans font-medium mb-4">
                  Festive Special
                </p>
                <h2 className="heading-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso mb-4">
                  The Navratri Edit
                </h2>
                <p className="heading-serif text-xl text-taupe italic mb-6">
                  Handcrafted ornaments for every Garba night.
                </p>
                <p className="text-taupe leading-relaxed mb-8">
                  Celebrate the nine nights with pieces that move with you — vibrant chandbalis, statement jhumkas, and hair accessories designed to complement your traditional Garba styling.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/navratri"
                    className="inline-flex items-center gap-2 bg-espresso text-ivory px-6 py-3 text-sm font-sans font-medium hover:bg-espresso/90 transition-colors"
                  >
                    Explore Navratri Collection
                    <ArrowRight size={14} />
                  </Link>
                  <button
                    onClick={onBookClick}
                    className="inline-flex items-center gap-2 border border-espresso text-espresso px-6 py-3 text-sm font-sans font-medium hover:bg-espresso hover:text-ivory transition-colors"
                  >
                    Book Your Festive Design
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CRAFT / EMBROIDERY STORY */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <ScrollReveal direction="left" className="lg:order-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80"
                    alt="Embroidery detail"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="aspect-[3/4] overflow-hidden mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80"
                    alt="Handcrafted embroidery"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" className="lg:order-1">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-light-gold font-sans font-medium mb-4">
                  The Art of Embroidery
                </p>
                <h2 className="heading-serif text-3xl sm:text-4xl font-semibold text-espresso mb-6">
                  Art in Every Stitch
                </h2>
                <p className="text-taupe leading-relaxed mb-4">
                  Our embroidery work is a labor of love — each stitch placed with intention, each pattern drawn from tradition. From zari work on bridal pieces to mirror work on festive accessories, our artisans bring decades of skill to every creation.
                </p>
                <p className="text-taupe leading-relaxed mb-8">
                  Whether you need embroidery for a special outfit, a custom accessory, or a unique piece of art — we'd love to bring your vision to life.
                </p>
                <Link
                  to="/embroidery"
                  className="inline-flex items-center gap-2 text-sm text-espresso font-sans font-medium gold-underline"
                >
                  Discover Our Embroidery <ArrowRight size={14} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CUSTOM DESIGN CTA */}
      <section className="py-16 lg:py-24 bg-espresso text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-light-gold font-sans font-medium mb-4">
              Bespoke Creations
            </p>
            <h2 className="heading-serif text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6">
              Made Especially for You
            </h2>
            <p className="text-ivory/70 max-w-2xl mx-auto leading-relaxed mb-8">
              Have a specific colour, pattern, occasion or design in mind? Share your idea with Mimiko Studio and let us create something uniquely yours.
            </p>
            <Link
              to="/custom-design"
              className="inline-flex items-center gap-2 bg-light-gold text-espresso px-7 py-3.5 text-sm font-sans font-medium hover:bg-champagne transition-colors"
            >
              Request Custom Design
              <ArrowRight size={14} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className="py-16 lg:py-20 border-b border-champagne/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Sparkles, label: 'Handcrafted', desc: 'Every piece made by hand' },
              { icon: Palette, label: 'Custom Designs', desc: 'Made to your vision' },
              { icon: Heart, label: 'Personal Consultation', desc: 'One-on-one attention' },
              { icon: Star, label: 'Quality Craftsmanship', desc: 'Attention to every detail' },
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center border border-champagne rounded-full">
                    <item.icon size={20} className="text-muted-gold" />
                  </div>
                  <h4 className="heading-serif text-lg font-semibold text-espresso mb-1">{item.label}</h4>
                  <p className="text-xs text-taupe">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="heading-serif text-3xl sm:text-4xl font-semibold text-espresso mb-4">
              Ready to Find Your Perfect Piece?
            </h2>
            <p className="text-taupe mb-8 max-w-lg mx-auto">
              Browse our collections, discover designs you love, and book them for your special occasion.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 bg-espresso text-ivory px-7 py-3.5 text-sm font-sans font-medium hover:bg-espresso/90 transition-colors"
              >
                Explore Collections
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={onBookClick}
                className="inline-flex items-center gap-2 border border-espresso text-espresso px-7 py-3.5 text-sm font-sans font-medium hover:bg-espresso hover:text-ivory transition-colors"
              >
                Book a Design
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
