import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Palette, Heart, Star, Play, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import ScrollReveal from '../components/ScrollReveal';
import { useDesigns, useCollections } from '../hooks/useData';

interface PremiumHomeProps {
  onBookClick: () => void;
}

export default function PremiumHome({ onBookClick }: PremiumHomeProps) {
  const { settings } = useSiteSettings();
  const { designs } = useDesigns();
  const { collections } = useCollections();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const featuredCollections = collections.filter((c: any) => c.featured).slice(0, 4);
  const featuredDesigns = designs.filter((d: any) => d.featured).slice(0, 6);

  return (
    <div className="bg-ivory">
      {/* Hero Section - Full Screen with Parallax */}
      <section className="relative h-screen overflow-hidden">
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-espresso/80 via-espresso/60 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=1920&q=90"
            alt="Luxury jewellery"
            className="w-full h-full object-cover scale-110"
          />
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-light-gold text-sm tracking-[0.3em] uppercase mb-6 font-sans">
              {settings.siteName}
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="heading-serif text-5xl md:text-7xl lg:text-8xl font-light text-ivory mb-6 leading-tight"
          >
            {settings.siteTagline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-ivory/80 text-lg md:text-xl max-w-2xl mb-10 font-sans font-light"
          >
            Discover handcrafted jewellery, traditional ornaments and artistic creations made for your most beautiful occasions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/collections"
              className="group inline-flex items-center gap-3 bg-light-gold text-espresso px-8 py-4 text-sm font-sans font-medium hover:bg-champagne transition-all rounded-full"
            >
              Explore Collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={onBookClick}
              className="inline-flex items-center gap-3 border-2 border-ivory text-ivory px-8 py-4 text-sm font-sans font-medium hover:bg-ivory hover:text-espresso transition-all rounded-full"
            >
              <Play size={16} />
              Book Consultation
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <ChevronDown size={32} className="text-ivory/60" />
        </motion.div>
      </section>

      {/* Introduction Section - Curved Design */}
      <section className="relative py-32 bg-cream/30 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-ivory to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-light-gold" />
                <Sparkles size={16} className="text-light-gold" />
                <div className="w-12 h-px bg-light-gold" />
              </div>
              
              <h2 className="heading-serif text-4xl md:text-5xl lg:text-6xl font-light text-espresso mb-8 leading-tight">
                Where Craftsmanship<br />
                <span className="italic text-muted-gold">Meets Celebration</span>
              </h2>
              
              <p className="text-taupe text-lg md:text-xl leading-relaxed mb-12 font-sans font-light">
                Every piece from Mimiko Studio is a celebration of Indian artistry — handcrafted with patience, designed with intention, and made to be treasured. From bridal jewellery to festive Navratri ornaments, we create pieces that become part of your story.
              </p>

              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full border-2 border-light-gold/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-light-gold/50 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-light-gold/20" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Collections - Organic Layout */}
      <section className="py-32 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-light-gold text-sm tracking-[0.3em] uppercase mb-4 font-sans">
                Curated Collections
              </p>
              <h2 className="heading-serif text-4xl md:text-5xl font-light text-espresso">
                Discover Our <span className="italic">World</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Large Featured Card */}
            <ScrollReveal className="lg:col-span-7 lg:row-span-2">
              <Link to="/collections/jewellery" className="group relative block h-full min-h-[600px] rounded-[3rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"
                  alt="Jewellery"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <p className="text-light-gold text-xs tracking-[0.3em] uppercase mb-3 font-sans">
                    Jewellery
                  </p>
                  <h3 className="heading-serif text-3xl md:text-4xl text-ivory font-light mb-4">
                    Timeless pieces for every occasion
                  </h3>
                  <span className="inline-flex items-center gap-2 text-ivory/80 text-sm group-hover:text-light-gold transition-colors">
                    Explore Collection <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </ScrollReveal>

            {/* Smaller Cards */}
            {featuredCollections.slice(1, 3).map((col: any, idx: number) => (
              <ScrollReveal key={col.id} delay={idx * 0.1} className="lg:col-span-5">
                <Link to={`/collections/${col.slug}`} className="group relative block h-72 rounded-[2.5rem] overflow-hidden">
                  <img
                    src={col.coverImage}
                    alt={col.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-light-gold text-xs tracking-[0.3em] uppercase mb-2 font-sans">
                      {col.name}
                    </p>
                    <h3 className="heading-serif text-2xl text-ivory font-light">
                      {col.description}
                    </h3>
                  </div>
                </Link>
              </ScrollReveal>
            ))}

            {featuredCollections.slice(3, 5).map((col: any, idx: number) => (
              <ScrollReveal key={col.id} delay={(idx + 2) * 0.1} className="lg:col-span-6">
                <Link to={`/collections/${col.slug}`} className="group relative block h-64 rounded-[2rem] overflow-hidden">
                  <img
                    src={col.coverImage}
                    alt={col.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-light-gold text-xs tracking-[0.3em] uppercase mb-2 font-sans">
                      {col.name}
                    </p>
                    <h3 className="heading-serif text-xl text-ivory font-light">
                      {col.description}
                    </h3>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Showcase - Immersive */}
      <section className="relative py-32 bg-espresso overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-light-gold" />
                <Sparkles size={16} className="text-light-gold" />
                <div className="w-12 h-px bg-light-gold" />
              </div>
              
              <h2 className="heading-serif text-4xl md:text-5xl lg:text-6xl font-light text-ivory mb-8 leading-tight">
                Every Piece Tells<br />
                <span className="italic text-light-gold">a Story</span>
              </h2>
              
              <p className="text-ivory/70 text-lg md:text-xl leading-relaxed mb-12 font-sans font-light">
                From bridal jewellery to festive Navratri ornaments, we create pieces that become part of your most cherished memories.
              </p>

              <Link
                to="/collections"
                className="group inline-flex items-center gap-3 bg-light-gold text-espresso px-8 py-4 text-sm font-sans font-medium hover:bg-champagne transition-all rounded-full"
              >
                View All Designs
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Signature Designs - Grid */}
      <section className="py-32 bg-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
              <div>
                <p className="text-light-gold text-sm tracking-[0.3em] uppercase mb-4 font-sans">
                  Featured Pieces
                </p>
                <h2 className="heading-serif text-4xl md:text-5xl font-light text-espresso">
                  Signature <span className="italic">Designs</span>
                </h2>
              </div>
              <Link
                to="/collections"
                className="mt-6 md:mt-0 inline-flex items-center gap-2 text-espresso hover:text-muted-gold transition-colors group"
              >
                View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDesigns.map((design: any, idx: number) => (
              <ScrollReveal key={design.id} delay={idx * 0.1}>
                <Link to={`/designs/${design.slug}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-cream mb-6">
                    <img
                      src={design.images?.[0]?.url}
                      alt={design.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {design.customizable && (
                      <div className="absolute top-4 left-4 bg-ivory/90 backdrop-blur-sm text-espresso text-xs uppercase tracking-wider px-3 py-1.5 rounded-full font-sans">
                        Customizable
                      </div>
                    )}
                  </div>
                  <p className="text-taupe text-xs uppercase tracking-wider font-sans mb-2">
                    {design.category}
                  </p>
                  <h3 className="heading-serif text-2xl font-light text-espresso group-hover:text-muted-gold transition-colors mb-2">
                    {design.name}
                  </h3>
                  <p className="text-sm text-taupe line-clamp-2 mb-3">{design.description}</p>
                  {design.price && (
                    <p className="text-muted-gold font-sans font-medium">
                      {design.priceType === 'starting' ? 'From ' : ''}{design.price}
                    </p>
                  )}
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Navratri Feature - Split Layout */}
      <section className="py-32 bg-espresso relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
                    alt="Navratri Collection"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full border-2 border-light-gold/30" />
                <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full border-2 border-light-gold/20" />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div>
                <p className="text-light-gold text-sm tracking-[0.3em] uppercase mb-6 font-sans">
                  Festive Collection
                </p>
                <h2 className="heading-serif text-4xl md:text-5xl font-light text-ivory mb-6 leading-tight">
                  The Navratri<br />
                  <span className="italic text-light-gold">Edit</span>
                </h2>
                <p className="heading-serif text-xl text-ivory/70 italic mb-6">
                  Handcrafted ornaments for every Garba night.
                </p>
                <p className="text-ivory/60 leading-relaxed mb-8 font-sans font-light">
                  Celebrate the nine nights with pieces that move with you — vibrant chandbalis, statement jhumkas, and hair accessories designed to complement your traditional Garba styling.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/navratri"
                    className="group inline-flex items-center gap-3 bg-light-gold text-espresso px-8 py-4 text-sm font-sans font-medium hover:bg-champagne transition-all rounded-full"
                  >
                    Explore Navratri
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    onClick={onBookClick}
                    className="inline-flex items-center gap-3 border-2 border-ivory/30 text-ivory px-8 py-4 text-sm font-sans font-medium hover:bg-ivory/10 transition-all rounded-full"
                  >
                    Book Festive Design
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Elegant */}
      <section className="py-24 bg-ivory border-y border-champagne/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Sparkles, label: 'Handcrafted', desc: 'Every piece made by hand' },
              { icon: Palette, label: 'Custom Designs', desc: 'Made to your vision' },
              { icon: Heart, label: 'Personal Consultation', desc: 'One-on-one attention' },
              { icon: Star, label: 'Quality Craftsmanship', desc: 'Attention to every detail' },
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-champagne flex items-center justify-center">
                    <item.icon size={24} className="text-muted-gold" />
                  </div>
                  <h4 className="heading-serif text-xl font-light text-espresso mb-2">{item.label}</h4>
                  <p className="text-sm text-taupe font-sans">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Elegant */}
      <section className="py-32 bg-cream/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="heading-serif text-4xl md:text-5xl font-light text-espresso mb-6 leading-tight">
              Find Something You <span className="italic">Love?</span>
            </h2>
            <p className="text-taupe text-lg mb-10 font-sans font-light">
              Browse our collections, discover designs you love, and book them for your special occasion.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/collections"
                className="group inline-flex items-center gap-3 bg-espresso text-ivory px-8 py-4 text-sm font-sans font-medium hover:bg-espresso/90 transition-all rounded-full"
              >
                Explore Collections
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={onBookClick}
                className="inline-flex items-center gap-3 border-2 border-espresso text-espresso px-8 py-4 text-sm font-sans font-medium hover:bg-espresso hover:text-ivory transition-all rounded-full"
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
