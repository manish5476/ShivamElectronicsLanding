import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCategories, useProducts } from '../hooks/useElectronicsData';
import ProductCard from '../components/ProductCard';
import { ArrowLeft, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { categories } = useCategories();
  const { products } = useProducts();

  const category = categories.find(c => c.slug === slug);
  const categoryProducts = products.filter(p => p.categoryId === category?.id);

  const filterableAttributes = useMemo(() => {
    const attributesMap = new Map();
    categoryProducts.forEach(product => {
      product.specifications?.forEach(spec => {
        if (spec.attribute?.isFilterable) {
          if (!attributesMap.has(spec.attribute.id)) {
            attributesMap.set(spec.attribute.id, {
              ...spec.attribute,
              values: new Set()
            });
          }
          attributesMap.get(spec.attribute.id).values.add(spec.value);
        }
      });
    });
    
    return Array.from(attributesMap.values()).map(attr => ({
      ...attr,
      values: Array.from(attr.values as Set<string>).sort()
    }));
  }, [categoryProducts]);

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (attributeId: string, value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[attributeId] === value || value === "") {
        delete newFilters[attributeId];
      } else {
        newFilters[attributeId] = value;
      }
      return newFilters;
    });
  };

  const filteredProducts = categoryProducts.filter(product => {
    return Object.entries(activeFilters).every(([attrId, value]) => {
      return product.specifications?.some(spec => spec.attribute?.id === attrId && spec.value === value);
    });
  });

  if (!category) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
        <div className="glass-panel p-12 rounded-[2.5rem] text-center max-w-md shadow-soft">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Category Not Found</h1>
          <Link to="/categories" className="btn btn-primary py-2.5 px-6 text-xs font-bold">Back to Collections</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-background)] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Showroom Hero Frame */}
        <section className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-8 sm:p-14 lg:p-20 mb-10 border border-[var(--color-border)] shadow-soft" style={{ background: 'var(--gradient-hero)' }}>
          {category.imageUrl && (
            <div className="absolute inset-0 z-0 pointer-events-none opacity-15">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&q=85';
                }}
              />
            </div>
          )}

          <div className="relative z-10 max-w-3xl">
            <Link
              to="/categories"
              className="glass-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-6 transition-colors shadow-sm"
            >
              <ArrowLeft size={13} /> All Collections
            </Link>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {category.name}
            </h1>

            {category.description && (
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-[var(--color-text-muted)] max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        </section>

        {/* Dynamic Filters Toolbar & Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mb-16">
          
          {/* Sidebar / Filter Pills */}
          {filterableAttributes.length > 0 && (
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="glass-panel p-6 rounded-[2rem] border border-white/60 shadow-soft sticky top-24 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-text)] flex items-center gap-2">
                    <SlidersHorizontal size={14} /> Filter Specs
                  </span>
                  {Object.keys(activeFilters).length > 0 && (
                    <button
                      onClick={() => setActiveFilters({})}
                      className="text-[11px] font-bold text-rose-600 hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {filterableAttributes.map(attr => (
                  <div key={attr.id} className="space-y-2">
                    <span className="text-xs font-bold text-[var(--color-text-muted)] block uppercase tracking-wider">
                      {attr.name}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {attr.values.map((val: string) => {
                        const isSelected = activeFilters[attr.id] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => handleFilterChange(attr.id, val)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                                : 'glass-pill text-[var(--color-text)] hover:border-[var(--color-primary)]'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          )}

          {/* Product Cards Grid */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-6 px-1">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Showing <strong className="text-[var(--color-text)]">{filteredProducts.length}</strong> items in this department
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="glass-panel p-16 rounded-[2.5rem] text-center max-w-xl mx-auto shadow-soft">
                <p className="text-sm text-[var(--color-text-muted)] mb-4">No products found matching these exact specifications.</p>
                <button
                  onClick={() => setActiveFilters({})}
                  className="btn btn-primary py-2 px-5 text-xs font-bold"
                >
                  Clear Specifications
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
