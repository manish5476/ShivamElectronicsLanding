import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, GripVertical, Monitor, Smartphone, ChevronLeft } from 'lucide-react';
import { homepageApi } from '../../services/cmsApi';

const SECTION_TYPES = [
  { type: 'hero', label: 'Hero', icon: '🖼️' },
  { type: 'featured_products', label: 'Featured Products', icon: '✨' },
  { type: 'categories', label: 'Categories', icon: '📦' },
  { type: 'brands', label: 'Brands', icon: '🏷️' },
  { type: 'promo_banner', label: 'Promotional Banner', icon: '🎉' },
  { type: 'furniture_showcase', label: 'Furniture Showcase', icon: '🛋️' },
  { type: 'electronics_showcase', label: 'Electronics Showcase', icon: '💻' },
  { type: 'testimonials', label: 'Testimonials', icon: '💬' },
  // Legacy support
  { type: 'collection_grid', label: 'Collection Grid', icon: '📦' },
  { type: 'featured_designs', label: 'Featured Designs', icon: '✨' },
  { type: 'split_content', label: 'Split Content', icon: '📐' },
  { type: 'dark_showcase', label: 'Dark Showcase', icon: '🌙' },
  { type: 'cta', label: 'Call to Action', icon: '🎯' },
  { type: 'gallery', label: 'Gallery', icon: '🖼️' },
  { type: 'booking_cta', label: 'Booking CTA', icon: '📅' },
];

const DEFAULT_CONFIGS: Record<string, any> = {
  hero: { label: 'WELCOME', heading: 'Your Heading Here', description: 'Your description here.', primaryButton: { text: 'Explore', link: '/' }, secondaryButton: { text: 'Learn More', link: '/' }, image: { url: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=1600&q=80' } },
  featured_products: { label: 'Trending Now', heading: 'Featured Products', count: 4 },
  categories: { label: 'Shop by Category', heading: 'Categories', count: 4 },
  brands: { heading: 'Our Trusted Brands' },
  promo_banner: { heading: 'Special Offer!', description: 'Get 20% off your first order.', button: { text: 'Shop Now', link: '/' }, backgroundImage: { url: '' } },
  furniture_showcase: { label: 'New Arrivals', heading: 'Modern Furniture', description: 'Upgrade your living space with our premium collection.', primaryButton: { text: 'Shop Furniture', link: '/' }, imagePosition: 'left', image: { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80' } },
  electronics_showcase: { label: 'Latest Tech', heading: 'Next Gen Electronics', description: 'Experience the future with our new electronic gadgets.', primaryButton: { text: 'Shop Electronics', link: '/' }, imagePosition: 'right', image: { url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80' } },
  testimonials: { heading: 'What Our Customers Say' },
  collection_grid: { label: 'Curated Collections', heading: 'Discover Our World', layout: 'editorial' },
  featured_designs: { label: 'Featured Pieces', heading: 'Signature Designs', count: 6 },
  split_content: { label: 'Section Label', heading: 'Your Heading', description: 'Your description here.', image: { url: '' }, primaryButton: { text: 'Learn More', link: '/' }, imagePosition: 'left' },
  dark_showcase: { label: 'Showcase', heading: 'The Art of Adornment', description: 'Your description.', backgroundImage: { url: '' } },
  cta: { heading: 'Made Especially for You', description: 'Your description.', button: { text: 'Request Design', link: '/custom-design' }, backgroundImage: { url: '' } },
  gallery: { label: 'Our Creations', heading: 'Visual Journey', count: 8 },
  booking_cta: { heading: 'Find Something You Love?', description: 'Browse our collections and book your favourite design.', primaryButton: { text: 'Explore', link: '/collections' }, secondaryButton: { text: 'Book', link: '/booking' } },
};

const PreviewRenderer = ({ section }: { section: any }) => {
  const { type, config, theme } = section;
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const bgImg = config.backgroundImage?.url || config.image?.url;

  switch (type) {
    case 'hero':
      return (
        <div className={`relative flex items-center justify-center text-center p-12 min-h-[500px] ${bgClass} bg-cover bg-center`} style={bgImg ? { backgroundImage: `url(${bgImg})` } : {}}>
          {bgImg && <div className="absolute inset-0 bg-black/40" />}
          <div className="relative z-10 max-w-3xl flex flex-col items-center">
            {config.label && <span className="uppercase tracking-[0.2em] text-sm mb-4 block font-semibold text-white/90">{config.label}</span>}
            <h1 className="text-5xl md:text-6xl font-serif mb-6 text-white leading-tight">{config.heading}</h1>
            <p className="text-lg mb-8 text-white/90 font-light max-w-xl">{config.description}</p>
            <div className="flex justify-center gap-4">
              {config.primaryButton?.text && <button className="bg-[var(--color-brand,#000)] text-white px-8 py-3 rounded-sm text-sm font-medium tracking-wide hover:bg-black/80 transition-colors">{config.primaryButton.text}</button>}
              {config.secondaryButton?.text && <button className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-sm text-sm font-medium tracking-wide hover:bg-white/20 transition-colors">{config.secondaryButton.text}</button>}
            </div>
          </div>
        </div>
      );
    case 'promo_banner':
    case 'cta':
    case 'booking_cta':
      return (
        <div className={`py-20 px-8 text-center ${bgClass} bg-cover bg-center relative`} style={bgImg ? { backgroundImage: `url(${bgImg})` } : {}}>
          {bgImg && <div className="absolute inset-0 bg-black/60" />}
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-white">{config.heading}</h2>
            <p className="mb-8 text-white/80 text-lg">{config.description}</p>
            {(config.button?.text || config.primaryButton?.text) && (
              <button className="bg-[var(--color-brand,#000)] text-white px-8 py-3 rounded-sm font-medium tracking-wider text-sm hover:opacity-90 transition-opacity">{config.button?.text || config.primaryButton?.text}</button>
            )}
          </div>
        </div>
      );
    case 'split_content':
    case 'furniture_showcase':
    case 'electronics_showcase':
      return (
        <div className={`flex flex-col md:flex-row ${config.imagePosition === 'right' ? 'md:flex-row-reverse' : ''} ${bgClass}`}>
          <div className="w-full md:w-1/2 min-h-[400px] bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${bgImg})` }} />
          <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
            {config.label && <span className="text-sm font-medium uppercase tracking-[0.2em] mb-4 opacity-70 text-[var(--color-brand,#000)]">{config.label}</span>}
            <h2 className="text-4xl font-serif mb-6">{config.heading}</h2>
            <p className="opacity-80 mb-8 text-lg leading-relaxed">{config.description}</p>
            {config.primaryButton?.text && (
              <button className="self-start text-[var(--color-brand,#000)] font-semibold border-b-2 border-[var(--color-brand,#000)] pb-1 hover:opacity-70 transition-opacity uppercase tracking-wider text-sm">
                {config.primaryButton.text}
              </button>
            )}
          </div>
        </div>
      );
    case 'featured_products':
    case 'featured_designs':
    case 'collection_grid':
    case 'categories':
      return (
        <div className={`py-20 px-8 ${bgClass}`}>
          <div className="text-center mb-16">
            {config.label && <span className="text-sm font-medium uppercase tracking-[0.2em] mb-3 block opacity-70 text-[var(--color-brand,#000)]">{config.label}</span>}
            <h2 className="text-4xl font-serif">{config.heading}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {Array.from({ length: config.count || 4 }).map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-100 mb-4 rounded-sm overflow-hidden relative">
                   <div className="absolute inset-0 bg-black/5 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 w-3/4 mb-3 rounded-sm"></div>
                <div className="h-3 bg-gray-100 w-1/2 rounded-sm"></div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'brands':
    case 'testimonials':
      return (
        <div className={`py-20 px-8 ${bgClass} text-center`}>
          <h2 className="text-3xl font-serif mb-12">{config.heading}</h2>
          <div className="flex justify-center gap-12 flex-wrap opacity-40 max-w-5xl mx-auto">
             {Array.from({ length: 5 }).map((_, i) => (
               <div key={i} className="w-32 h-12 bg-gray-300 rounded-sm"></div>
             ))}
          </div>
        </div>
      );
    default:
      return (
        <div className={`py-16 px-8 text-center ${bgClass} border-b border-gray-100`}>
          <h2 className="text-2xl font-serif">{config.heading || type}</h2>
          <p className="opacity-70 mt-3">{config.description || 'Live preview not fully supported for this component yet.'}</p>
        </div>
      );
  }
};

export default function HomepageBuilder() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editConfig, setEditConfig] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => { loadSections(); }, []);

  const loadSections = async () => {
    const saved = localStorage.getItem('mimiko_homepage_sections');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSections(parsed);
        setLoading(false);
        return;
      } catch (e) {
        // Invalid JSON, continue to Supabase
      }
    }

    const res = await homepageApi.getAllSections();
    if (res.success && res.data) {
      setSections(res.data);
      localStorage.setItem('mimiko_homepage_sections', JSON.stringify(res.data));
    }
    setLoading(false);
  };

  const saveToLocalStorage = (newSections: any[]) => {
    localStorage.setItem('mimiko_homepage_sections', JSON.stringify(newSections));
  };

  const addSection = async (type: string) => {
    const newSection = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      homepage_id: '00000000-0000-0000-0000-000000000002',
      type,
      enabled: true,
      sort_order: sections.length + 1,
      theme: type === 'dark_showcase' || type === 'cta' ? 'dark' : 'light',
      config: DEFAULT_CONFIGS[type] || {},
    };
    
    const updatedSections = [...sections, newSection];
    saveToLocalStorage(updatedSections);
    setSections(updatedSections);
    
    const res = await homepageApi.createSection(newSection);
    if (res.success && res.data) {
      const finalSections = updatedSections.map(s => s.id === newSection.id ? res.data : s);
      saveToLocalStorage(finalSections);
      setSections(finalSections);
    }
    
    setShowAddMenu(false);
    setEditingId(newSection.id);
    setEditConfig(newSection.config);
  };

  const deleteSection = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this section?')) return;
    const updatedSections = sections.filter(s => s.id !== id);
    saveToLocalStorage(updatedSections);
    setSections(updatedSections);
    if (editingId === id) setEditingId(null);
    await homepageApi.deleteSection(id);
  };

  const toggleEnabled = async (section: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSection = { ...section, enabled: !section.enabled };
    const updatedSections = sections.map(s => s.id === section.id ? updatedSection : s);
    saveToLocalStorage(updatedSections);
    setSections(updatedSections);
    await homepageApi.updateSection(section.id, { enabled: updatedSection.enabled });
  };

  const startEdit = (section: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingId(section.id);
    setEditConfig(JSON.parse(JSON.stringify(section.config || {})));
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    
    const updatedSections = sections.map(s => 
      s.id === editingId ? { ...s, config: editConfig } : s
    );
    saveToLocalStorage(updatedSections);
    setSections(updatedSections);
    
    await homepageApi.updateSection(editingId, { config: editConfig });
    
    setSaving(false);
  };

  const updateConfigField = (path: string, value: any) => {
    const newConfig = { ...editConfig };
    const keys = path.split('.');
    let obj: any = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setEditConfig(newConfig);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newSections = [...sections];
    const draggedSection = newSections[draggedIndex];
    newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, draggedSection);
    
    const updated = newSections.map((s, i) => ({ ...s, sort_order: i + 1 }));
    setSections(updated);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    saveToLocalStorage(sections);
    const ids = sections.map(s => s.id);
    await homepageApi.reorderSections(ids);
  };

  if (loading) return <div className="py-20 text-center text-gray-500 font-medium">Loading Visual CMS...</div>;

  const editingSection = sections.find(s => s.id === editingId);

  return (
    <div className="max-w-7xl mx-auto h-[88vh] flex flex-col">
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-brand, #111827)' }}>Visual Homepage Builder</h1>
          <p className="text-sm opacity-70">Design your storefront with drag-and-drop sections.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row rounded-xl overflow-hidden shadow-lg border" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-surface, #ffffff)' }}>
        
        {/* Sidebar */}
        <div className="w-full md:w-80 flex flex-col z-10 border-r" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-surface, #ffffff)' }}>
          {editingId && editingSection ? (
            <div className="flex flex-col h-full">
              <div className="p-4 flex items-center justify-between border-b sticky top-0 z-10" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-surface, #ffffff)' }}>
                <button onClick={() => setEditingId(null)} className="text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity">
                  <ChevronLeft size={16} /> Back
                </button>
                <button onClick={saveEdit} disabled={saving} className="text-white px-4 py-1.5 rounded text-sm flex items-center gap-1 font-medium transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: 'var(--color-brand, #000000)' }}>
                  {saving ? 'Saving...' : <><Save size={14}/> Save</>}
                </button>
              </div>
              <div className="p-5 overflow-y-auto flex-1 space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-semibold opacity-50 mb-1">Editing Section</h3>
                  <p className="font-medium text-lg">{SECTION_TYPES.find(s => s.type === editingSection.type)?.label || editingSection.type}</p>
                </div>

                <div className="space-y-4">
                  {editConfig.label !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold mb-1 opacity-70">Label</label>
                      <input type="text" value={editConfig.label || ''} onChange={e => updateConfigField('label', e.target.value)} className="w-full border p-2 text-sm rounded focus:ring-1 focus:ring-[var(--color-brand)] outline-none" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-bg, #f9fafb)' }} />
                    </div>
                  )}
                  {editConfig.heading !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold mb-1 opacity-70">Heading</label>
                      <input type="text" value={editConfig.heading || ''} onChange={e => updateConfigField('heading', e.target.value)} className="w-full border p-2 text-sm rounded focus:ring-1 focus:ring-[var(--color-brand)] outline-none" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-bg, #f9fafb)' }} />
                    </div>
                  )}
                  {editConfig.description !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold mb-1 opacity-70">Description</label>
                      <textarea value={editConfig.description || ''} onChange={e => updateConfigField('description', e.target.value)} rows={3} className="w-full border p-2 text-sm rounded resize-none focus:ring-1 focus:ring-[var(--color-brand)] outline-none" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-bg, #f9fafb)' }} />
                    </div>
                  )}
                  
                  {editConfig.image !== undefined && (
                    <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                      <label className="block text-xs font-semibold mb-1 opacity-70">Image URL</label>
                      <input type="url" value={editConfig.image?.url || ''} onChange={e => updateConfigField('image.url', e.target.value)} className="w-full border p-2 text-sm rounded focus:ring-1 focus:ring-[var(--color-brand)] outline-none" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-bg, #f9fafb)' }} />
                      {editConfig.image?.url && (
                        <div className="mt-2 aspect-video bg-cover bg-center rounded border" style={{ backgroundImage: `url(${editConfig.image.url})`, borderColor: 'var(--color-border, #e5e7eb)' }}></div>
                      )}
                    </div>
                  )}
                  {editConfig.backgroundImage !== undefined && (
                    <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                      <label className="block text-xs font-semibold mb-1 opacity-70">Background Image URL</label>
                      <input type="url" value={editConfig.backgroundImage?.url || ''} onChange={e => updateConfigField('backgroundImage.url', e.target.value)} className="w-full border p-2 text-sm rounded focus:ring-1 focus:ring-[var(--color-brand)] outline-none" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-bg, #f9fafb)' }} />
                    </div>
                  )}

                  {editConfig.primaryButton !== undefined && (
                    <div className="pt-2 border-t space-y-3" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                      <h4 className="text-xs font-semibold opacity-70">Primary Button</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Text" value={editConfig.primaryButton?.text || ''} onChange={e => updateConfigField('primaryButton.text', e.target.value)} className="w-full border p-2 text-sm rounded focus:ring-1 focus:ring-[var(--color-brand)] outline-none" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-bg, #f9fafb)' }} />
                        <input type="text" placeholder="Link" value={editConfig.primaryButton?.link || ''} onChange={e => updateConfigField('primaryButton.link', e.target.value)} className="w-full border p-2 text-sm rounded focus:ring-1 focus:ring-[var(--color-brand)] outline-none" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-bg, #f9fafb)' }} />
                      </div>
                    </div>
                  )}
                  
                  {editConfig.secondaryButton !== undefined && (
                    <div className="pt-2 border-t space-y-3" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                      <h4 className="text-xs font-semibold opacity-70">Secondary Button</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Text" value={editConfig.secondaryButton?.text || ''} onChange={e => updateConfigField('secondaryButton.text', e.target.value)} className="w-full border p-2 text-sm rounded focus:ring-1 focus:ring-[var(--color-brand)] outline-none" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-bg, #f9fafb)' }} />
                        <input type="text" placeholder="Link" value={editConfig.secondaryButton?.link || ''} onChange={e => updateConfigField('secondaryButton.link', e.target.value)} className="w-full border p-2 text-sm rounded focus:ring-1 focus:ring-[var(--color-brand)] outline-none" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-bg, #f9fafb)' }} />
                      </div>
                    </div>
                  )}

                  {editConfig.imagePosition !== undefined && (
                    <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                      <label className="block text-xs font-semibold mb-1 opacity-70">Image Position</label>
                      <select value={editConfig.imagePosition || 'left'} onChange={e => updateConfigField('imagePosition', e.target.value)} className="w-full border p-2 text-sm rounded focus:ring-1 focus:ring-[var(--color-brand)] outline-none" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-bg, #f9fafb)' }}>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  )}

                  <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                    <label className="block text-xs font-semibold mb-1 opacity-70">Section Theme</label>
                    <select value={editingSection.theme} onChange={async e => { await homepageApi.updateSection(editingSection.id, { theme: e.target.value }); await loadSections(); }} className="w-full border p-2 text-sm rounded focus:ring-1 focus:ring-[var(--color-brand)] outline-none" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-bg, #f9fafb)' }}>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                <h2 className="font-bold text-lg">Page Sections</h2>
                <div className="relative">
                  <button onClick={() => setShowAddMenu(!showAddMenu)} className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--color-brand, #000000)' }}>
                    <Plus size={16} />
                  </button>
                  {showAddMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-md shadow-xl border py-1 z-50 overflow-hidden" style={{ borderColor: 'var(--color-border, #e5e7eb)', backgroundColor: 'var(--color-surface, #ffffff)' }}>
                      <div className="max-h-80 overflow-y-auto">
                        {SECTION_TYPES.map(st => (
                          <button key={st.type} onClick={() => addSection(st.type)} className="w-full text-left px-4 py-2 hover:bg-black/5 transition-colors flex items-center gap-3">
                            <span>{st.icon}</span>
                            <span className="text-sm font-medium">{st.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-3 overflow-y-auto flex-1 space-y-2">
                {sections.length === 0 ? (
                  <div className="text-center p-8 opacity-60">
                    <p className="text-sm">No sections added yet.</p>
                  </div>
                ) : (
                  sections.map((sec, i) => (
                    <div 
                      key={sec.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, i)}
                      onDragOver={(e) => handleDragOver(e, i)}
                      onDragEnd={handleDragEnd}
                      onClick={() => startEdit(sec)}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${!sec.enabled ? 'opacity-60' : ''} hover:shadow-md`}
                      style={{ 
                        borderColor: draggedIndex === i ? 'var(--color-brand, #000)' : 'var(--color-border, #e5e7eb)', 
                        backgroundColor: 'var(--color-surface, #ffffff)'
                      }}
                    >
                      <div className="flex items-center gap-3 overflow-hidden flex-1">
                        <GripVertical size={16} className="opacity-40 cursor-grab hover:opacity-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{SECTION_TYPES.find(t => t.type === sec.type)?.label || sec.type}</p>
                          <p className="text-xs opacity-60 truncate">{sec.config?.heading || 'No heading set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button onClick={(e) => toggleEnabled(sec, e)} className="p-1.5 opacity-40 hover:opacity-100 rounded hover:bg-black/5 transition-all">
                          {sec.enabled ? <Eye size={14}/> : <EyeOff size={14}/>}
                        </button>
                        <button onClick={(e) => deleteSection(sec.id, e)} className="p-1.5 opacity-40 hover:opacity-100 hover:text-red-500 rounded hover:bg-red-50 transition-all">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Main Preview Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg, #f3f4f6)' }}>
          {/* Device Toolbar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-lg border shadow-sm z-20 backdrop-blur-sm" style={{ backgroundColor: 'var(--color-surface, rgba(255,255,255,0.9))', borderColor: 'var(--color-border, #e5e7eb)' }}>
            <button onClick={() => setDevice('desktop')} className={`p-2 rounded-md transition-colors ${device === 'desktop' ? 'bg-black/5 text-[var(--color-brand,#000)]' : 'opacity-50 hover:opacity-100'}`}><Monitor size={18}/></button>
            <button onClick={() => setDevice('mobile')} className={`p-2 rounded-md transition-colors ${device === 'mobile' ? 'bg-black/5 text-[var(--color-brand,#000)]' : 'opacity-50 hover:opacity-100'}`}><Smartphone size={18}/></button>
          </div>
          
          {/* Live Preview Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center pt-20">
            <div className={`shadow-2xl transition-all duration-500 ease-out flex flex-col overflow-x-hidden ${device === 'mobile' ? 'w-[375px] rounded-3xl border-8 border-gray-900' : 'w-full max-w-[1400px] border border-[var(--color-border,#e5e7eb)]'}`} style={{ backgroundColor: 'var(--color-surface, #ffffff)', minHeight: '100%' }}>
              {sections.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-12">
                  <div>
                    <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-4">
                      <Plus size={24} className="opacity-40" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Content</h3>
                    <p className="opacity-60 max-w-sm">Add sections from the left panel to start building your homepage visually.</p>
                  </div>
                </div>
              ) : (
                sections.filter(s => s.enabled).map(sec => (
                  <PreviewRenderer key={sec.id} section={sec} />
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
