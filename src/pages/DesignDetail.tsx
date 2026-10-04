import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ImageGallery from '../components/ImageGallery';
import ScrollReveal from '../components/ScrollReveal';
import { useDesign, useDesigns, useCollections } from '../hooks/useData';

interface DesignDetailProps {
  onBookClick: (design?: { id: string; name: string; collection: string }) => void;
}

export default function DesignDetail({ onBookClick }: DesignDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const { design, loading, notFound } = useDesign(slug);
  const { designs } = useDesigns();
  const { collections } = useCollections();

  if (loading) {
    return (
      <div className="py-24 text-center max-w-7xl mx-auto px-4">
        <p className="text-taupe">Loading design...</p>
      </div>
    );
  }

  if (notFound || !design) {
    return (
      <div className="py-24 text-center max-w-7xl mx-auto px-4">
        <h1 className="heading-serif text-3xl text-espresso mb-4">Design Not Found</h1>
        <p className="text-taupe mb-6">Looks like this design has wandered away.</p>
        <Link to="/collections" className="text-muted-gold underline">Browse collections</Link>
      </div>
    );
  }

  const collection = collections.find((c) => c.id === design.collectionId);
  const relatedDesigns = designs
    .filter((d) => d.collectionId === design.collectionId && d.id !== design.id)
    .slice(0, 4);

  const handleBook = () => {
    onBookClick({
      id: design.id,
      name: design.name,
      collection: collection?.name || '',
    });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-taupe font-sans">
          <Link to="/" className="hover:text-espresso transition-colors">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-espresso transition-colors">Collections</Link>
          <span>/</span>
          {collection && (
            <>
              <Link to={`/collections/${collection.slug}`} className="hover:text-espresso transition-colors">
                {collection.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-espresso">{design.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <ScrollReveal direction="left">
            <ImageGallery images={design.images} designName={design.name} />
          </ScrollReveal>

          {/* Design Info */}
          <ScrollReveal direction="right">
            <div className="lg:sticky lg:top-28">
              <Link
                to={`/collections/${collection?.slug}`}
                className="section-label mb-3 inline-block hover:text-muted-gold transition-colors"
              >
                {collection?.name}
              </Link>

              <h1 className="display-serif text-4xl sm:text-5xl text-espresso mb-4 leading-[1.1]">
                {design.name}
              </h1>

              <p className="text-[11px] text-taupe uppercase tracking-[0.2em] font-sans font-medium mb-6">
                {design.category}
              </p>

              <p className="text-taupe leading-relaxed mb-6">
                {design.description}
              </p>

              {/* Price */}
              {design.price && (
                <div className="mb-6">
                  <p className="text-2xl heading-serif font-semibold text-espresso">
                    {design.priceType === 'starting' && (
                      <span className="text-sm text-taupe font-sans font-normal mr-1">Starting from</span>
                    )}
                    {design.price}
                  </p>
                </div>
              )}
              {design.priceType === 'on-request' && (
                <div className="mb-6">
                  <p className="text-lg heading-serif font-semibold text-espresso">Price on Request</p>
                </div>
              )}

              {/* Availability */}
              <div className="flex items-center gap-4 mb-6 text-sm">
                <span className={`inline-flex items-center gap-1.5 ${
                  design.availability === 'available' ? 'text-green-700' :
                  design.availability === 'made-to-order' ? 'text-muted-gold' : 'text-red-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    design.availability === 'available' ? 'bg-green-500' :
                    design.availability === 'made-to-order' ? 'bg-light-gold' : 'bg-red-500'
                  }`} />
                  {design.availability === 'available' ? 'In Stock' :
                   design.availability === 'made-to-order' ? 'Made to Order' : 'Sold'}
                </span>
                {design.customizable && (
                  <span className="text-taupe">• Customizable</span>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={handleBook}
                  className="btn-primary flex-1"
                >
                  Book This Design
                </button>
                <Link
                  to="/contact"
                  className="btn-secondary flex-1 text-center"
                >
                  Ask a Question
                </Link>
              </div>

              {/* Details */}
              <div className="border-t border-champagne/50 pt-6">
                <h3 className="heading-serif text-xl font-semibold text-espresso mb-4">
                  About This Design
                </h3>
                {design.longDescription && (
                  <p className="text-taupe text-sm leading-relaxed mb-6">
                    {design.longDescription}
                  </p>
                )}

                <h4 className="text-xs uppercase tracking-widest text-taupe font-sans font-medium mb-3">
                  Details
                </h4>
                <dl className="space-y-2 text-sm">
                  {design.material && (
                    <div className="flex gap-3">
                      <dt className="text-taupe w-28 flex-shrink-0">Material</dt>
                      <dd className="text-espresso">{design.material}</dd>
                    </div>
                  )}
                  {design.craft && (
                    <div className="flex gap-3">
                      <dt className="text-taupe w-28 flex-shrink-0">Craft</dt>
                      <dd className="text-espresso">{design.craft}</dd>
                    </div>
                  )}
                  {design.occasion && (
                    <div className="flex gap-3">
                      <dt className="text-taupe w-28 flex-shrink-0">Occasion</dt>
                      <dd className="text-espresso">{design.occasion}</dd>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <dt className="text-taupe w-28 flex-shrink-0">Customization</dt>
                    <dd className="text-espresso">{design.customizable ? 'Available' : 'Not available'}</dd>
                  </div>
                  {design.care && (
                    <div className="flex gap-3">
                      <dt className="text-taupe w-28 flex-shrink-0">Care</dt>
                      <dd className="text-espresso">{design.care}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Designs */}
      {relatedDesigns.length > 0 && (
        <section className="py-16 lg:py-24 bg-cream/30 border-t border-champagne/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="heading-serif text-2xl lg:text-3xl font-semibold text-espresso">
                More From This Collection
              </h2>
              <Link
                to={`/collections/${collection?.slug}`}
                className="hidden sm:inline-flex items-center gap-2 text-sm text-espresso/70 hover:text-espresso transition-colors gold-underline"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedDesigns.map((d) => (
                <Link key={d.id} to={`/designs/${d.slug}`} className="group block">
                  <div className="aspect-[3/4] overflow-hidden bg-cream mb-3">
                    <img
                      src={d.images[0]?.url}
                      alt={d.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="heading-serif text-lg font-semibold text-espresso group-hover:text-muted-gold transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-xs text-taupe uppercase tracking-wider font-sans">{d.category}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-ivory border-t border-champagne p-4 z-40">
        <div className="flex gap-3">
          <button
            onClick={handleBook}
            className="flex-1 bg-espresso text-ivory py-3 text-sm font-sans font-medium"
          >
            Book This Design
          </button>
          <Link
            to="/contact"
            className="flex-1 border border-espresso text-espresso py-3 text-sm font-sans font-medium text-center"
          >
            Ask Question
          </Link>
        </div>
      </div>
    </div>
  );
}
