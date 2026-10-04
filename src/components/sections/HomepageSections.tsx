import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDesigns, useCollections } from '../../hooks/useData';

interface SectionProps {
  config: any;
  theme?: 'light' | 'dark';
}

// Hero Section
export function HeroSection({ config }: SectionProps) {
  const { label, heading, description, primaryButton, secondaryButton, image, style, height } = config;
  
  const heightClass = height === 'full' ? 'min-h-screen' : height === 'medium' ? 'min-h-[70vh]' : 'min-h-[50vh]';
  
  return (
    <section className={"relative " + heightClass + " flex items-center overflow-hidden"}>
      <div className="absolute inset-0">
        {image?.url && (
          <img src={image.url} alt={image.alt || ''} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          {label && (
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-px bg-[var(--color-primary)]"></div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium">
                {label}
              </p>
            </div>
          )}
          
          {heading && (
            <h1 className="text-5xl sm:text-6xl lg:text-7xl text-[var(--color-text)] leading-[1.05] mb-8" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>
              {heading}
            </h1>
          )}
          
          {description && (
            <p className="text-[var(--color-muted)] text-lg leading-relaxed mb-10 max-w-xl">
              {description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-5">
            {primaryButton?.text && (
              <Link to={primaryButton.link || '/'} className="inline-flex items-center gap-3 bg-[var(--color-dark-bg)] text-[var(--color-bg)] px-7 py-3.5 text-[13px] font-medium tracking-wide hover:opacity-90 transition-all group">
                {primaryButton.text}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            {secondaryButton?.text && (
              <Link to={secondaryButton.link || '/'} className="inline-flex items-center gap-2 border border-[var(--color-dark-bg)] text-[var(--color-dark-bg)] px-7 py-3.5 text-[13px] font-medium tracking-wide hover:bg-[var(--color-dark-bg)] hover:text-[var(--color-bg)] transition-all">
                {secondaryButton.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Collection Grid Section
export function CollectionGridSection({ config }: SectionProps) {
  const { label, heading, layout } = config;
  const { collections } = useCollections();
  const featuredCollections = collections.filter((c: any) => c.featured).slice(0, 5);

  if (featuredCollections.length === 0) {
    return (
      <section className="py-24 lg:py-32 bg-[var(--color-secondary)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[var(--color-muted)]">No collections available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 lg:py-32 bg-[var(--color-secondary)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {label && (
          <p className="text-center text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium mb-4">
            {label}
          </p>
        )}
        {heading && (
          <h2 className="text-center text-4xl sm:text-5xl lg:text-6xl text-[var(--color-text)] mb-16" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>
            {heading}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">
          {featuredCollections.slice(0, 1).map((col) => (
            <Link key={col.id} to={"/collections/" + col.slug} className="lg:col-span-7 lg:row-span-2 group block relative overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-full" style={{ borderRadius: 'var(--radius-md)' }}>
              {col.coverImage && <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 lg:p-8">
                <h3 className="text-2xl lg:text-3xl text-white font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{col.name}</h3>
                <p className="text-white/80 text-sm">{col.description}</p>
              </div>
            </Link>
          ))}
          {featuredCollections.slice(1, 3).map((col: any) => (
            <Link key={col.id} to={"/collections/" + col.slug} className="lg:col-span-5 group block relative overflow-hidden aspect-[16/10]" style={{ borderRadius: 'var(--radius-md)' }}>
              {col.coverImage && <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="text-xl text-white font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{col.name}</h3>
              </div>
            </Link>
          ))}
          {featuredCollections.slice(3, 5).map((col: any) => (
            <Link key={col.id} to={"/collections/" + col.slug} className="lg:col-span-6 group block relative overflow-hidden aspect-[16/9]" style={{ borderRadius: 'var(--radius-md)' }}>
              {col.coverImage && <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="text-xl text-white font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{col.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Designs Section
export function FeaturedDesignsSection({ config }: SectionProps) {
  const { label, heading, count = 6 } = config;
  const { designs } = useDesigns();
  const featuredDesigns = designs.filter((d: any) => d.featured).slice(0, count);

  if (featuredDesigns.length === 0) {
    return (
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[var(--color-muted)]">No featured designs available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16">
          <div>
            {label && <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium mb-4">{label}</p>}
            {heading && <h2 className="text-4xl sm:text-5xl text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>{heading}</h2>}
          </div>
          <Link to="/collections" className="mt-6 sm:mt-0 inline-flex items-center gap-3 text-[13px] text-[var(--color-text)]/70 hover:text-[var(--color-text)] transition-colors group">
            View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredDesigns.map((design: any) => (
            <Link key={design.id} to={"/designs/" + design.slug} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-secondary)] mb-4" style={{ borderRadius: 'var(--radius-md)' }}>
                {design.images?.[0]?.url && (
                  <img src={design.images[0].url} alt={design.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
              </div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-1">{design.category}</p>
              <h3 className="text-xl font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{design.name}</h3>
              {design.price && (
                <p className="text-sm text-[var(--color-primary)] mt-2 font-medium">
                  {design.priceType === 'starting' ? 'Starting from ' : ''}{design.price}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Split Content Section
export function SplitContentSection({ config }: SectionProps) {
  const { label, heading, subheading, description, image, primaryButton, secondaryButton, imagePosition = 'left', theme = 'light' } = config;
  
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[var(--color-dark-bg)]' : 'bg-[var(--color-secondary)]/30';
  const textColor = isDark ? 'text-white' : 'text-[var(--color-text)]';
  const mutedColor = isDark ? 'text-white/70' : 'text-[var(--color-muted)]';
  
  const imageEl = image?.url && (
    <div className="relative" style={{ borderRadius: 'var(--radius-md)' }}>
      <img src={image.url} alt={image.alt || ''} className="w-full h-full object-cover" style={{ borderRadius: 'var(--radius-md)' }} />
    </div>
  );
  
  const contentEl = (
    <div>
      {label && <p className={"text-[11px] tracking-[0.3em] uppercase font-medium mb-4 " + (isDark ? 'text-[var(--color-primary)]' : 'text-[var(--color-primary)]')}>{label}</p>}
      {heading && <h2 className={"text-3xl sm:text-4xl lg:text-5xl mb-4 " + textColor} style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>{heading}</h2>}
      {subheading && <p className={"text-xl mb-6 italic " + mutedColor} style={{ fontFamily: 'var(--font-heading)' }}>{subheading}</p>}
      {description && <p className={"leading-relaxed mb-8 " + mutedColor}>{description}</p>}
      <div className="flex flex-wrap gap-4">
        {primaryButton?.text && (
          <Link to={primaryButton.link || '/'} className={"inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium tracking-wide transition-all " + (isDark ? 'bg-[var(--color-primary)] text-[var(--color-dark-bg)] hover:opacity-90' : 'bg-[var(--color-dark-bg)] text-[var(--color-bg)] hover:opacity-90')}>
            {primaryButton.text}
          </Link>
        )}
        {secondaryButton?.text && (
          <Link to={secondaryButton.link || '/'} className={"inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium tracking-wide transition-all border " + (isDark ? 'border-white/30 text-white hover:bg-white/10' : 'border-[var(--color-dark-bg)] text-[var(--color-dark-bg)] hover:bg-[var(--color-dark-bg)] hover:text-[var(--color-bg)]')}>
            {secondaryButton.text}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <section className={"py-16 lg:py-24 " + bgColor}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={"grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center " + (imagePosition === 'right' ? 'lg:[&>*:first-child]:order-2' : '')}>
          <div>{imageEl}</div>
          <div>{contentEl}</div>
        </div>
      </div>
    </section>
  );
}

// Dark Showcase Section
export function DarkShowcaseSection({ config }: SectionProps) {
  const { label, heading, description, backgroundImage } = config;
  
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {backgroundImage?.url && (
        <div className="absolute inset-0">
          <img src={backgroundImage.url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[var(--color-dark-bg)]/80" />
        </div>
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {label && <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium mb-6">{label}</p>}
        {heading && <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>{heading}</h2>}
        {description && <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">{description}</p>}
      </div>
    </section>
  );
}

// CTA Section
export function CTASection({ config }: SectionProps) {
  const { heading, description, button, backgroundImage } = config;
  
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {backgroundImage?.url && (
        <div className="absolute inset-0">
          <img src={backgroundImage.url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[var(--color-dark-bg)]/70" />
        </div>
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {heading && <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-6" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>{heading}</h2>}
        {description && <p className="text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">{description}</p>}
        {button?.text && (
          <Link to={button.link || '/'} className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-dark-bg)] px-7 py-3.5 text-[13px] font-medium tracking-wide hover:opacity-90 transition-all">
            {button.text}
          </Link>
        )}
      </div>
    </section>
  );
}

// Gallery Section
export function GallerySection({ config }: SectionProps) {
  const { label, heading, count = 8 } = config;
  const { designs } = useDesigns();
  const allImages = designs.flatMap((d: any) => d.images?.map((img: any) => ({ ...img, designName: d.name, designSlug: d.slug })) || []).slice(0, count);

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {label && <p className="text-center text-[11px] tracking-[0.3em] uppercase text-[var(--color-primary)] font-medium mb-4">{label}</p>}
        {heading && <h2 className="text-center text-4xl sm:text-5xl text-[var(--color-text)] mb-12" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>{heading}</h2>}
        
        {allImages.length === 0 ? (
          <p className="text-center text-[var(--color-muted)]">No gallery images available yet.</p>
        ) : (
          <div className="columns-2 lg:columns-3 gap-4">
            {allImages.map((img: any, idx: number) => (
              <Link key={img.id + idx} to={"/designs/" + img.designSlug} className="group block mb-4 overflow-hidden" style={{ borderRadius: 'var(--radius-md)' }}>
                <img src={img.url} alt={img.alt || img.designName} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ borderRadius: 'var(--radius-md)', aspectRatio: idx % 3 === 0 ? '3/4' : idx % 3 === 1 ? '4/3' : '1/1' }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Booking CTA Section
export function BookingCTASection({ config }: SectionProps) {
  const { heading, description, primaryButton, secondaryButton } = config;
  
  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {heading && <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--color-text)] mb-4" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--heading-weight)' }}>{heading}</h2>}
        {description && <p className="text-[var(--color-muted)] mb-8 max-w-lg mx-auto">{description}</p>}
        <div className="flex flex-wrap justify-center gap-4">
          {primaryButton?.text && (
            <Link to={primaryButton.link || '/'} className="inline-flex items-center gap-2 bg-[var(--color-dark-bg)] text-[var(--color-bg)] px-7 py-3.5 text-[13px] font-medium tracking-wide hover:opacity-90 transition-colors">
              {primaryButton.text}
            </Link>
          )}
          {secondaryButton?.text && (
            <Link to={secondaryButton.link || '/'} className="inline-flex items-center gap-2 border border-[var(--color-dark-bg)] text-[var(--color-dark-bg)] px-7 py-3.5 text-[13px] font-medium tracking-wide hover:bg-[var(--color-dark-bg)] hover:text-[var(--color-bg)] transition-colors">
              {secondaryButton.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// Section Renderer
export function SectionRenderer({ section }: { section: any }) {
  const config = section.config || {};
  const theme = section.theme || 'light';
  
  switch (section.type) {
    case 'hero':
      return <HeroSection config={config} theme={theme} />;
    case 'collection_grid':
      return <CollectionGridSection config={config} theme={theme} />;
    case 'featured_designs':
      return <FeaturedDesignsSection config={config} theme={theme} />;
    case 'split_content':
      return <SplitContentSection config={config} theme={theme} />;
    case 'dark_showcase':
      return <DarkShowcaseSection config={config} theme={theme} />;
    case 'cta':
      return <CTASection config={config} theme={theme} />;
    case 'gallery':
      return <GallerySection config={config} theme={theme} />;
    case 'booking_cta':
      return <BookingCTASection config={config} theme={theme} />;
    default:
      return <div className="py-12 text-center text-[var(--color-muted)]">Unknown section type: {section.type}</div>;
  }
}
