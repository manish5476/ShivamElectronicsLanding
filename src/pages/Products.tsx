import { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Sparkles, RotateCcw } from 'lucide-react';
import { useProducts, useCategories, useBrands } from '../hooks/useElectronicsData';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';

export default function Products() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const { brands } = useBrands();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(q) ||
      p.brand?.name?.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q);
    const matchesCategory = !selectedCategory || p.categoryId === selectedCategory;
    const matchesBrand = !selectedBrand || p.brandId === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
  };

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedBrand);

  return (
    <div className="min-h-screen py-6 sm:py-10" style={{ background: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Showroom Header */}
        <section className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-8 sm:p-14 lg:p-20 mb-10 border border-[var(--color-border)] shadow-soft" style={{ background: 'var(--gradient-hero)' }}>
          {/* Subtle Glow Spheres */}
          <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-40 bg-[var(--color-primary)]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30 bg-[var(--color-accent)]" />

          <div className="relative z-10 max-w-3xl">
            <span className="glass-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] mb-5 shadow-sm">
              <Sparkles size={12} className="text-[var(--color-accent)]" />
              Verified Showroom Inventory
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
              Curated <span className="text-gradient">Collection</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-[var(--color-text-muted)]">
              Explore 4K OLED televisions, energy-efficient inverter refrigeration, smart washing machines, and artisanal teakwood furniture designed for lasting living.
            </p>
          </div>
        </section>

        {/* Glassmorphic Floating Filter Bar */}
        <div className="glass-panel p-4 sm:p-5 rounded-[2rem] border border-white/60 mb-10 shadow-soft">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="text"
                placeholder="Search TVs, ACs, Refrigerators, Beds..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-full glass-input text-xs font-semibold placeholder:text-[var(--color-text-muted)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="glass-input pl-4 pr-9 py-2.5 rounded-full text-xs font-bold appearance-none cursor-pointer text-[var(--color-text)]"
                >
                  <option value="">All Categories ({categories.length})</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              </div>

              {/* Brand Filter */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  className="glass-input pl-4 pr-9 py-2.5 rounded-full text-xs font-bold appearance-none cursor-pointer text-[var(--color-text)]"
                >
                  <option value="">All Brands ({brands.length})</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  <RotateCcw size={12} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-[var(--color-border)]/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mr-1">
                Active Filters:
              </span>
              {searchQuery && (
                <span className="glass-pill px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 text-[var(--color-primary)]">
                  Keyword: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><X size={11} /></button>
                </span>
              )}
              {selectedCategory && (
                <span className="glass-pill px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 text-[var(--color-primary)]">
                  Category: {categories.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('')}><X size={11} /></button>
                </span>
              )}
              {selectedBrand && (
                <span className="glass-pill px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 text-[var(--color-primary)]">
                  Brand: {brands.find(b => b.id === selectedBrand)?.name}
                  <button onClick={() => setSelectedBrand('')}><X size={11} /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Counter & Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Showing <span className="text-[var(--color-text)] font-extrabold">{filteredProducts.length}</span> curated products
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="p-3 rounded-[2rem] bg-[var(--color-surface)] border border-[var(--color-border)] animate-pulse">
                <div className="aspect-[4/5] rounded-[1.6rem] bg-[var(--color-surface-soft)] mb-4" />
                <div className="h-3 bg-[var(--color-surface-soft)] rounded-full w-1/3 mb-2" />
                <div className="h-4 bg-[var(--color-surface-soft)] rounded-full w-3/4 mb-3" />
                <div className="h-5 bg-[var(--color-surface-soft)] rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Glassmorphic Empty State */
          <div className="glass-panel p-12 sm:p-20 rounded-[3rem] text-center border border-white/60 max-w-2xl mx-auto shadow-soft my-10">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-soft)] flex items-center justify-center mx-auto mb-4 text-2xl">
              🔍
            </div>
            <h3 className="text-2xl font-bold mb-2 text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
              No Matching Products Found
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-6 leading-relaxed">
              We couldn't find any products matching your current search query or filter selection.
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary py-2.5 px-6 text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}