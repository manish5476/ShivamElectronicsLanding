import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useDesigns } from '../hooks/useData';

export default function Embroidery() {
  const { designs, loading } = useDesigns();
  const embroideryDesigns = designs.filter((d) => (d.collectionId === 'embroidery') || (d as any).collection_id === 'embroidery');

  return (
    <div>
      {/* Hero */}
      <section className="relative py-28 lg:py-44 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=1400&q=80"
            alt="Embroidery craftsmanship"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-espresso/30 via-espresso/50 to-espresso/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="ornament-divider mb-8">
              <div className="w-2 h-2 border border-light-gold/60 rotate-45"></div>
            </div>
            
            <p className="section-label mb-6 text-light-gold/90">
              The Art of Hand Embroidery
            </p>
            
            <h1 className="display-serif text-5xl sm:text-6xl lg:text-7xl text-ivory leading-[1.05] mb-6">
              Art in Every <span className="italic">Stitch</span>
            </h1>
            
            <p className="text-ivory/70 max-w-xl mx-auto text-lg leading-relaxed">
              Detailed handcrafted embroidery created with patience, tradition, and artistry.
            </p>
            
            <div className="ornament-divider mt-10">
              <div className="w-2 h-2 border border-light-gold/60 rotate-45"></div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* The Craft */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="left">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-light-gold font-sans font-medium mb-4">
                  The Craft
                </p>
                <h2 className="heading-serif text-3xl lg:text-4xl font-semibold text-espresso mb-6">
                  A Tradition of Thread and Time
                </h2>
                <div className="space-y-4 text-taupe leading-relaxed">
                  <p>
                    Embroidery at Mimiko Studio is more than decoration — it's a conversation between artisan and material. Each stitch is placed with intention, each pattern carries meaning drawn from centuries of Indian textile tradition.
                  </p>
                  <p>
                    Our embroidery work encompasses zari (gold and silver thread), silk thread work, mirror work (abhala), sequin appliqué, and traditional Indian motifs rendered in thread.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80"
                  alt="Embroidery in progress"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* The Detail */}
      <section className="py-16 lg:py-24 bg-cream/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="left" className="lg:order-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-light-gold font-sans font-medium mb-4">
                  The Detail
                </p>
                <h2 className="heading-serif text-3xl lg:text-4xl font-semibold text-espresso mb-6">
                  Beauty in the Close-Up
                </h2>
                <div className="space-y-4 text-taupe leading-relaxed">
                  <p>
                    The true magic of hand embroidery reveals itself up close. The texture of silk thread catching light, the precision of each mirror placement, the subtle depth created by layers of stitching — these are the details that machine work cannot replicate.
                  </p>
                  <p>
                    We encourage our clients to see and feel the difference. Every piece we create rewards close inspection.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" className="lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&q=80"
                    alt="Embroidery detail close-up"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="aspect-square overflow-hidden mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80"
                    alt="Texture detail"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* The Finish */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-light-gold font-sans font-medium mb-4">
                The Finish
              </p>
              <h2 className="heading-serif text-3xl lg:text-4xl font-semibold text-espresso mb-4">
                Completed Pieces
              </h2>
              <p className="text-taupe max-w-xl mx-auto">
                From clutch bags to bridal dupatta borders, our embroidery work adorns pieces that become part of your most cherished moments.
              </p>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-taupe">Loading designs...</p>
            </div>
          ) : embroideryDesigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-taupe mb-2">No embroidery designs available yet.</p>
              <p className="text-sm text-taupe/70">Embroidery designs will appear here once added by the admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {embroideryDesigns.map((design, idx) => (
              <ScrollReveal key={design.id} delay={idx * 0.1}>
                <Link to={`/designs/${design.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-cream mb-4">
                    <img
                      src={design.images[0]?.url}
                      alt={design.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="heading-serif text-xl font-semibold text-espresso group-hover:text-muted-gold transition-colors mb-1">
                    {design.name}
                  </h3>
                  <p className="text-sm text-taupe">{design.description}</p>
                </Link>
              </ScrollReveal>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom Work */}
      <section className="py-16 lg:py-24 bg-espresso text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-light-gold font-sans font-medium mb-4">
                  Custom Work
                </p>
                <h2 className="heading-serif text-3xl lg:text-4xl font-semibold mb-6">
                  Your Vision, Our Hands
                </h2>
                <div className="space-y-4 text-ivory/70 leading-relaxed">
                  <p>
                    Need custom embroidery for a special outfit, accessory, or decor piece? We work closely with clients to bring their embroidery visions to life — from traditional patterns to contemporary designs.
                  </p>
                  <p>
                    Share your idea, reference images, or color preferences, and we'll create a piece that's uniquely yours.
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    to="/custom-design"
                    className="inline-flex items-center gap-2 bg-light-gold text-espresso px-6 py-3 text-sm font-sans font-medium hover:bg-champagne transition-colors"
                  >
                    Discuss a Custom Design
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80"
                  alt="Custom embroidery work"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
