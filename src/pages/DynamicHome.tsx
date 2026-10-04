import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Palette, Heart, Star } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { SectionRenderer } from '../components/sections/HomepageSections';
import { useDesigns, useCollections } from '../hooks/useData';

interface DynamicHomeProps {
  onBookClick: () => void;
}

export default function DynamicHome({ onBookClick }: DynamicHomeProps) {
  const { designs, loading: designsLoading } = useDesigns();
  const { collections, loading: collectionsLoading } = useCollections();
  const [sections, setSections] = useState<any[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);

  const featuredCollections = collections.filter((c: any) => c.featured).slice(0, 5);
  const featuredDesigns = designs.filter((d: any) => d.featured).slice(0, 6);
  const allImages = designs.flatMap((d: any) =>
    (d.images || []).map((img: any) => ({ ...img, designName: d.name, designSlug: d.slug }))
  ).slice(0, 12);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    // Try loading from localStorage first (works without database)
    const saved = localStorage.getItem('mimiko_homepage_sections');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSections(parsed.filter((s: any) => s.enabled));
        setSectionsLoading(false);
        return;
      } catch (e) {
        // Invalid JSON, continue to Supabase
      }
    }

    // Try loading from Supabase
    const { homepageApi } = await import('../services/cmsApi');
    const res = await homepageApi.getAllSections();
    if (res.success && res.data) {
      const enabledSections = res.data.filter((s: any) => s.enabled);
      setSections(enabledSections);
      // Cache to localStorage
      localStorage.setItem('mimiko_homepage_sections', JSON.stringify(res.data));
    }
    setSectionsLoading(false);
  };

  // If sections exist in database/localStorage, render them dynamically
  if (sections.length > 0) {
    return (
      <div>
        {sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
    );
  }

  // Otherwise, render the beautiful hardcoded homepage
  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=1600&q=80"
            alt="Mimiko Studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/40 via-transparent to-transparent" />
        </div>

        <div className="absolute top-1/4 right-10 w-px h-32 bg-gradient-to-b from-transparent via-[var(--color-primary)]/30 to-transparent hidden lg:block" />
        <div className="absolute bottom-1/4 right-20 w-px h-24 bg-gradient-to-b from-transparent via-[var(--color-primary)]/20 to-transparent hidden lg:block" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
          <div className="max-w-3xl">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-px bg-[var(--color-primary)]" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium">
                  Mimiko Atelier
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] text-[var(--color-text)] leading-[1.05] mb-8" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>
                Crafted to Adorn.
                <br />
                <span className="italic text-[var(--color-primary)]">Designed to Remember.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-[var(--color-muted)] text-lg leading-relaxed mb-10 max-w-xl">
                Discover handcrafted jewellery, traditional ornaments and artistic creations made for your most beautiful occasions.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-wrap gap-5">
                <Link to="/collections" className="inline-flex items-center gap-3 bg-[var(--color-dark-bg)] text-[var(--color-bg)] px-7 py-3.5 text-[13px] font-medium tracking-wide hover:opacity-90 transition-all group" style={{ borderRadius: 'var(--radius-btn)' }}>
                  Explore Collection
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <button onClick={onBookClick} className="inline-flex items-center gap-2 border border-[var(--color-dark-bg)] text-[var(--color-dark-bg)] px-7 py-3.5 text-[13px] font-medium tracking-wide hover:bg-[var(--color-dark-bg)] hover:text-[var(--color-bg)] transition-all" style={{ borderRadius: 'var(--radius-btn)' }}>
                  Book Consultation
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
          <p className="text-[10px] tracking-[0.2em] text-[var(--color-muted)]/60 uppercase">Scroll</p>
          <div className="w-px h-12 bg-gradient-to-b from-[var(--color-primary)]/50 to-transparent" />
        </div>
      </section>

      {/* ============ INTRODUCTION ============ */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-[var(--color-primary)]/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--color-primary)]/50" />
                <div className="w-2 h-2 border border-[var(--color-primary)] rotate-45" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--color-primary)]/50" />
              </div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium mb-6">The Art of Adornment</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl text-[var(--color-text)] mb-8 leading-[1.1]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>
                Where Craftsmanship<br /><span className="italic">Meets Celebration</span>
              </h2>
              <p className="text-[var(--color-muted)] leading-relaxed text-lg max-w-2xl mx-auto">
                Every piece from Mimiko Studio is a celebration of Indian artistry — handcrafted with patience, designed with intention, and made to be treasured.
              </p>
              <div className="flex items-center justify-center gap-3 mt-10">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--color-primary)]/50" />
                <div className="w-2 h-2 border border-[var(--color-primary)] rotate-45" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--color-primary)]/50" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ COLLECTIONS ============ */}
      <section className="py-24 lg:py-32 bg-[var(--color-secondary)]/30 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium mb-4">Curated Collections</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl text-[var(--color-text)] leading-[1.1]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>
                Discover Our <span className="italic">World</span>
              </h2>
            </div>
          </ScrollReveal>

          {collections.length === 0 ? (
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">
                {/* Default editorial layout */}
                <Link to="/collections/jewellery" className="lg:col-span-7 lg:row-span-2 group block relative overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-full" style={{ borderRadius: 'var(--radius-md)' }}>
                  <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80" alt="Jewellery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 lg:p-8">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-medium mb-2">Jewellery</p>
                    <h3 className="text-2xl lg:text-3xl text-white font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Timeless pieces for every occasion</h3>
                    <span className="inline-flex items-center gap-2 text-white/80 text-sm group-hover:text-[var(--color-primary)] transition-colors">Explore <ArrowRight size={14} /></span>
                  </div>
                </Link>
                <Link to="/collections/traditional-ornaments" className="lg:col-span-5 group block relative overflow-hidden aspect-[16/10]" style={{ borderRadius: 'var(--radius-md)' }}>
                  <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80" alt="Traditional" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-medium mb-1">Traditional</p>
                    <h3 className="text-xl text-white font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Indian Craftsmanship</h3>
                  </div>
                </Link>
                <Link to="/collections/embroidery" className="lg:col-span-5 group block relative overflow-hidden aspect-[16/10]" style={{ borderRadius: 'var(--radius-md)' }}>
                  <img src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80" alt="Embroidery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-medium mb-1">Embroidery</p>
                    <h3 className="text-xl text-white font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Art in Every Stitch</h3>
                  </div>
                </Link>
                <Link to="/collections/navratri" className="lg:col-span-6 group block relative overflow-hidden aspect-[16/9]" style={{ borderRadius: 'var(--radius-md)' }}>
                  <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80" alt="Navratri" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-medium mb-1">Navratri</p>
                    <h3 className="text-xl text-white font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Festive Ornaments</h3>
                  </div>
                </Link>
                <Link to="/collections/custom" className="lg:col-span-6 group block relative overflow-hidden aspect-[16/9]" style={{ borderRadius: 'var(--radius-md)' }}>
                  <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80" alt="Custom" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-medium mb-1">Custom</p>
                    <h3 className="text-xl text-white font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Made for You</h3>
                  </div>
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">
                {featuredCollections.slice(0, 1).map((col: any) => (
                  <Link key={col.id} to={`/collections/${col.slug}`} className="lg:col-span-7 lg:row-span-2 group block relative overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-full" style={{ borderRadius: 'var(--radius-md)' }}>
                    {col.coverImage && <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 lg:p-8">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-medium mb-2">{col.name}</p>
                      <h3 className="text-2xl lg:text-3xl text-white font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{col.description}</h3>
                      <span className="inline-flex items-center gap-2 text-white/80 text-sm group-hover:text-[var(--color-primary)] transition-colors">Explore <ArrowRight size={14} /></span>
                    </div>
                  </Link>
                ))}
                {featuredCollections.slice(1, 3).map((col: any) => (
                  <Link key={col.id} to={`/collections/${col.slug}`} className="lg:col-span-5 group block relative overflow-hidden aspect-[16/10]" style={{ borderRadius: 'var(--radius-md)' }}>
                    {col.coverImage && <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-medium mb-1">{col.name}</p>
                      <p className="text-white/80 text-sm">{col.description}</p>
                    </div>
                  </Link>
                ))}
                {featuredCollections.slice(3, 5).map((col: any) => (
                  <Link key={col.id} to={`/collections/${col.slug}`} className="lg:col-span-6 group block relative overflow-hidden aspect-[16/9]" style={{ borderRadius: 'var(--radius-md)' }}>
                    {col.coverImage && <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-medium mb-1">{col.name}</p>
                      <p className="text-white/80 text-sm">{col.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ============ DARK SHOWCASE ============ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[var(--color-dark-bg)]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--color-primary)]/50" />
              <div className="w-2 h-2 border border-[var(--color-primary)] rotate-45" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--color-primary)]/50" />
            </div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium mb-6">The Art of Adornment</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-[1.1]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>
              Every Piece Tells<br /><span className="italic">a Story</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
              From bridal jewellery to festive Navratri ornaments, we create pieces that become part of your most cherished memories.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ SIGNATURE DESIGNS ============ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16">
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium mb-4">Featured Pieces</p>
                <h2 className="text-4xl sm:text-5xl text-[var(--color-text)] leading-[1.1]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>
                  Signature <span className="italic">Designs</span>
                </h2>
              </div>
              <Link to="/collections" className="mt-6 sm:mt-0 inline-flex items-center gap-3 text-[13px] text-[var(--color-text)]/70 hover:text-[var(--color-text)] transition-colors group">
                View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>

          {designs.length === 0 ? (
            <ScrollReveal>
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[var(--color-border)] rounded-full">
                  <Sparkles size={24} className="text-[var(--color-primary)]/60" />
                </div>
                <h3 className="text-2xl text-[var(--color-text)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Designs Coming Soon</h3>
                <p className="text-[var(--color-muted)] text-sm max-w-md mx-auto">Our signature designs are being crafted with care. Soon you'll discover unique pieces made for your most beautiful occasions.</p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredDesigns.map((design: any, idx: number) => (
                <ScrollReveal key={design.id} delay={idx * 0.1}>
                  <Link to={`/designs/${design.slug}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-secondary)] mb-4" style={{ borderRadius: 'var(--radius-md)' }}>
                      {design.images?.[0]?.url && (
                        <img src={design.images[0].url} alt={design.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      )}
                      {design.customizable && (
                        <span className="absolute top-3 left-3 bg-white/90 text-[var(--color-text)] text-[10px] uppercase tracking-wider px-2 py-1 font-medium">Customizable</span>
                      )}
                    </div>
                    <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-1">{design.category}</p>
                    <h3 className="text-xl font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{design.name}</h3>
                    <p className="text-sm text-[var(--color-muted)] line-clamp-2">{design.description}</p>
                    {design.price && (
                      <p className="text-sm text-[var(--color-primary)] mt-2 font-medium">
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

      {/* ============ NAVRATRI FEATURE ============ */}
      <section className="py-16 lg:py-24 bg-[var(--color-dark-bg)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden" style={{ borderRadius: 'var(--radius-md)' }}>
                  <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80" alt="Navratri Collection" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[var(--color-primary)]/20 -z-10" style={{ borderRadius: 'var(--radius-md)' }} />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-[var(--color-primary)]/70" />
                  <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium">Festive Collection</p>
                </div>
                <h2 className="text-4xl sm:text-5xl text-white leading-[1.05] mb-4" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>
                  The Navratri<br /><span className="italic">Edit</span>
                </h2>
                <p className="text-xl text-white/70 italic mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Handcrafted ornaments for every Garba night.</p>
                <p className="text-white/60 leading-relaxed mb-8">
                  Celebrate the nine nights with pieces that move with you — vibrant chandbalis, statement jhumkas, and hair accessories designed to complement your traditional Garba styling.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/navratri" className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-dark-bg)] px-6 py-3 text-[13px] font-medium tracking-wide hover:opacity-90 transition-all group" style={{ borderRadius: 'var(--radius-btn)' }}>
                    Explore Navratri <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <button onClick={onBookClick} className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 text-[13px] font-medium tracking-wide hover:bg-white/10 transition-all" style={{ borderRadius: 'var(--radius-btn)' }}>
                    Book Festive Design
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============ EMBROIDERY STORY ============ */}
      <section className="py-16 lg:py-24 bg-[var(--color-secondary)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <ScrollReveal direction="left" className="lg:order-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] overflow-hidden" style={{ borderRadius: 'var(--radius-md)' }}>
                  <img src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80" alt="Embroidery detail" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/4] overflow-hidden mt-8" style={{ borderRadius: 'var(--radius-md)' }}>
                  <img src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80" alt="Handcrafted embroidery" className="w-full h-full object-cover" />
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" className="lg:order-1">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-[var(--color-primary)]" />
                  <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium">The Art of Embroidery</p>
                </div>
                <h2 className="text-4xl sm:text-5xl text-[var(--color-text)] leading-[1.1] mb-6" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>
                  Art in Every <span className="italic">Stitch</span>
                </h2>
                <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                  Our embroidery work is a labor of love — each stitch placed with intention, each pattern drawn from tradition. From zari work on bridal pieces to mirror work on festive accessories.
                </p>
                <p className="text-[var(--color-muted)] leading-relaxed mb-8">
                  Whether you need embroidery for a special outfit, a custom accessory, or a unique piece of art — we'd love to bring your vision to life.
                </p>
                <Link to="/embroidery" className="inline-flex items-center gap-3 text-[13px] text-[var(--color-text)] font-medium group" style={{ borderRadius: 'var(--radius-btn)' }}>
                  <span className="border-b border-[var(--color-primary)] pb-0.5">Discover Our Craft</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============ CUSTOM DESIGN CTA ============ */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1400&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[var(--color-dark-bg)]/75" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium mb-4">Bespoke Creations</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-[1.1]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>
              Made Especially <span className="italic">for You</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">
              Have a specific colour, pattern, occasion or design in mind? Share your idea with Mimiko Studio and let us create something uniquely yours.
            </p>
            <Link to="/custom-design" className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-dark-bg)] px-7 py-3.5 text-[13px] font-medium tracking-wide hover:opacity-90 transition-all group" style={{ borderRadius: 'var(--radius-btn)' }}>
              Request Custom Design <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      {allImages.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium mb-4">Visual Journey</p>
                <h2 className="text-4xl sm:text-5xl text-[var(--color-text)] leading-[1.1]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>
                  Our <span className="italic">Creations</span>
                </h2>
              </div>
            </ScrollReveal>
            <div className="columns-2 lg:columns-3 gap-4">
              {allImages.map((img: any, idx: number) => (
                <ScrollReveal key={img.id + idx} delay={idx * 0.03}>
                  <Link to={`/designs/${img.designSlug}`} className="group block mb-4 overflow-hidden" style={{ borderRadius: 'var(--radius-md)' }}>
                    <img src={img.url} alt={img.alt || img.designName} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ borderRadius: 'var(--radius-md)', aspectRatio: idx % 3 === 0 ? '3/4' : idx % 3 === 1 ? '4/3' : '1/1' }} />
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ TRUST INDICATORS ============ */}
      <section className="py-16 lg:py-20 border-y border-[var(--color-border)]/30">
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
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center border border-[var(--color-border)] rounded-full">
                    <item.icon size={20} className="text-[var(--color-primary)]" />
                  </div>
                  <h4 className="text-lg font-semibold text-[var(--color-text)] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{item.label}</h4>
                  <p className="text-xs text-[var(--color-muted)]">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BOOKING CTA ============ */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--color-text)] mb-4" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>
              Find Something You <span className="italic">Love?</span>
            </h2>
            <p className="text-[var(--color-muted)] mb-8 max-w-lg mx-auto">
              Browse our collections, discover designs you love, and book them for your special occasion.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/collections" className="inline-flex items-center gap-2 bg-[var(--color-dark-bg)] text-[var(--color-bg)] px-7 py-3.5 text-[13px] font-medium tracking-wide hover:opacity-90 transition-colors" style={{ borderRadius: 'var(--radius-btn)' }}>
                Explore Collections <ArrowRight size={14} />
              </Link>
              <button onClick={onBookClick} className="inline-flex items-center gap-2 border border-[var(--color-dark-bg)] text-[var(--color-dark-bg)] px-7 py-3.5 text-[13px] font-medium tracking-wide hover:bg-[var(--color-dark-bg)] hover:text-[var(--color-bg)] transition-colors" style={{ borderRadius: 'var(--radius-btn)' }}>
                Book a Design
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
