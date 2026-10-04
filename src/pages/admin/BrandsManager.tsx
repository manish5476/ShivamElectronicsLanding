import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X, AlertCircle, CheckCircle, Layers, Globe, Clock, Box } from 'lucide-react';
import { brandsApi } from '../../services/electronicsApi';
import type { Brand } from '../../types/electronics';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const EMPTY_FORM: Partial<Brand> = {
  name: '', slug: '', description: '', logoUrl: '', website: '',
  featured: false, status: 'ACTIVE', sortOrder: 0, seoTitle: '', seoDescription: '',
};

export default function BrandsManager() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form, setForm] = useState<Partial<Brand>>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const res = await brandsApi.getAll();
    if (res.success && res.data) setBrands(res.data);
    setLoading(false);
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (b: Brand) => { setEditing(b); setForm({ ...b }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    if (!form.name?.trim()) return showToast('error', 'Brand name is required');
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.name || '') };
    const res = editing
      ? await brandsApi.update(editing.id, payload)
      : await brandsApi.create(payload);
    if (res.success) {
      showToast('success', editing ? 'Brand updated!' : 'Brand created!');
      closeModal();
      load();
    } else {
      showToast('error', res.error || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this brand?')) return;
    setDeleting(id);
    const res = await brandsApi.delete(id);
    if (res.success) { showToast('success', 'Brand deleted'); load(); }
    else showToast('error', res.error || 'Delete failed');
    setDeleting(null);
  };

  const filtered = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const set = (key: keyof Brand, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  // Helper to parse dates
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-8" style={{ backgroundColor: 'var(--color-bg, #f8fafc)' }}>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold transition-all animate-in slide-in-from-top-4 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--color-brand, #0f172a)' }}>Partner Brands</h1>
          <p className="text-sm md:text-base mt-2 opacity-70 font-medium max-w-xl" style={{ color: 'var(--color-brand, #334155)' }}>
            Manage manufacturers, partnerships, and brand identities visually.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" style={{ color: 'var(--color-brand, #0f172a)' }} />
            <input
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium shadow-sm border focus:outline-none focus:ring-4 transition-all"
              style={{ 
                backgroundColor: 'var(--color-surface, #ffffff)', 
                borderColor: 'var(--color-border, #e2e8f0)', 
                color: 'var(--color-brand, #0f172a)' 
              }}
              placeholder="Search brands..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap" style={{ backgroundColor: 'var(--color-brand, #4f46e5)' }}>
            <Plus size={20} strokeWidth={2.5} /> New Brand
          </button>
        </div>
      </div>

      {/* Elegant Brand Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50 space-y-4">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-brand, #4f46e5)' }}></div>
          <p className="font-medium" style={{ color: 'var(--color-brand, #0f172a)' }}>Loading partner brands...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-[2rem] shadow-sm" style={{ backgroundColor: 'var(--color-surface, #ffffff)', border: '2px dashed var(--color-border, #e2e8f0)' }}>
          <Layers size={56} strokeWidth={1} className="opacity-20 mb-5" style={{ color: 'var(--color-brand, #0f172a)' }} />
          <p className="text-xl font-bold mb-2" style={{ color: 'var(--color-brand, #0f172a)' }}>No brands found</p>
          <p className="text-sm opacity-60 mb-6 text-center max-w-sm" style={{ color: 'var(--color-brand, #334155)' }}>Add a brand to associate products with their manufacturers.</p>
          <button onClick={openCreate} className="px-6 py-2.5 rounded-full text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: 'var(--color-brand, #4f46e5)' }}>Create Brand</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(brand => (
            <div key={brand.id} className="group relative rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col border border-transparent hover:border-slate-200" 
                 style={{ backgroundColor: 'var(--color-surface, #ffffff)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)' }}>
              
              {/* Header: Logo & Actions */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center p-2 shadow-sm border border-slate-100 overflow-hidden bg-white">
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
                  ) : (
                    <Layers size={28} strokeWidth={1.5} className="text-slate-300" />
                  )}
                </div>
                
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(brand)} className="p-2 rounded-full bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    <Pencil size={15} strokeWidth={2.5} />
                  </button>
                  <button onClick={() => handleDelete(brand.id)} disabled={deleting === brand.id} className="p-2 rounded-full bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50">
                    <Trash2 size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Body: Brand Name & Meta */}
              <div className="mb-4">
                <h3 className="text-lg font-bold truncate" style={{ color: 'var(--color-brand, #0f172a)' }}>{brand.name}</h3>
                {brand.website && (
                  <a href={brand.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-500 hover:text-indigo-600 mt-1 transition-colors">
                    <Globe size={12} strokeWidth={2.5} /> {brand.website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                )}
              </div>

              <div className="mt-auto space-y-3">
                {/* Stats row */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Box size={14} className="opacity-70" />
                    <span>-- Products</span> {/* Mocked as not in interface directly */}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Clock size={14} className="opacity-70" />
                    <span>{formatDate(brand.updatedAt)}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  {brand.status === 'ACTIVE' ? (
                     <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">Active</span>
                  ) : (
                     <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">Inactive</span>
                  )}
                  {brand.featured && (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700">Featured</span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" style={{ backgroundColor: 'var(--color-surface, #ffffff)' }}>
            
            <div className="flex items-center justify-between px-8 py-6" style={{ borderBottom: '1px solid var(--color-border, #e2e8f0)' }}>
              <div>
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-brand, #0f172a)' }}>
                  {editing ? 'Edit Brand' : 'Add Brand'}
                </h2>
                <p className="text-sm opacity-60 mt-1 font-medium" style={{ color: 'var(--color-brand, #0f172a)' }}>Configure manufacturer or partner details.</p>
              </div>
              <button onClick={closeModal} className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-40" style={{ color: 'var(--color-brand, #0f172a)' }}>Brand Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-80" style={{ color: 'var(--color-brand, #0f172a)' }}>Brand Name <span className="text-rose-500">*</span></label>
                    <input className="w-full px-5 py-3.5 rounded-xl text-sm font-medium border-2 transition-all focus:outline-none"
                      style={{ backgroundColor: 'var(--color-bg, #f8fafc)', borderColor: 'var(--color-border, #e2e8f0)' }}
                      value={form.name || ''} 
                      onChange={e => { set('name', e.target.value); if (!editing) set('slug', slugify(e.target.value)); }} 
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-brand, #4f46e5)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-80" style={{ color: 'var(--color-brand, #0f172a)' }}>URL Slug</label>
                    <input className="w-full px-5 py-3.5 rounded-xl font-mono text-sm border-2 transition-all focus:outline-none"
                      style={{ backgroundColor: 'var(--color-bg, #f8fafc)', borderColor: 'var(--color-border, #e2e8f0)' }}
                      value={form.slug || ''} onChange={e => set('slug', e.target.value)} 
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-brand, #4f46e5)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-80" style={{ color: 'var(--color-brand, #0f172a)' }}>Description</label>
                  <textarea rows={3} className="w-full px-5 py-3.5 rounded-xl text-sm font-medium border-2 transition-all focus:outline-none resize-y"
                    style={{ backgroundColor: 'var(--color-bg, #f8fafc)', borderColor: 'var(--color-border, #e2e8f0)' }}
                    value={form.description || ''} onChange={e => set('description', e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-brand, #4f46e5)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-40" style={{ color: 'var(--color-brand, #0f172a)' }}>Identity & Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-80" style={{ color: 'var(--color-brand, #0f172a)' }}>Logo URL</label>
                    <input className="w-full px-5 py-3.5 rounded-xl text-sm font-medium border-2 transition-all focus:outline-none"
                      style={{ backgroundColor: 'var(--color-bg, #f8fafc)', borderColor: 'var(--color-border, #e2e8f0)' }}
                      placeholder="https://..." value={form.logoUrl || ''} onChange={e => set('logoUrl', e.target.value)} 
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-brand, #4f46e5)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
                    />
                    {form.logoUrl && (
                      <div className="mt-4 p-4 rounded-xl border-2 flex items-center justify-center bg-white h-24 w-32" style={{ borderColor: 'var(--color-border, #e2e8f0)' }}>
                        <img src={form.logoUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-80" style={{ color: 'var(--color-brand, #0f172a)' }}>Official Website</label>
                    <input className="w-full px-5 py-3.5 rounded-xl text-sm font-medium border-2 transition-all focus:outline-none"
                      style={{ backgroundColor: 'var(--color-bg, #f8fafc)', borderColor: 'var(--color-border, #e2e8f0)' }}
                      placeholder="https://brand.com" value={form.website || ''} onChange={e => set('website', e.target.value)} 
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-brand, #4f46e5)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-40" style={{ color: 'var(--color-brand, #0f172a)' }}>Display Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl" style={{ backgroundColor: 'var(--color-bg, #f8fafc)', border: '2px dashed var(--color-border, #e2e8f0)' }}>
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-80" style={{ color: 'var(--color-brand, #0f172a)' }}>Status</label>
                    <select className="w-full px-5 py-3 rounded-xl text-sm font-bold border-2 transition-all appearance-none"
                      style={{ borderColor: 'var(--color-border, #e2e8f0)', backgroundColor: 'var(--color-surface, #ffffff)' }}
                      value={form.status || 'ACTIVE'} onChange={e => set('status', e.target.value)}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-brand, #4f46e5)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-80" style={{ color: 'var(--color-brand, #0f172a)' }}>Sort Order</label>
                    <input type="number" className="w-full px-5 py-3 rounded-xl text-sm font-bold border-2 transition-all"
                      style={{ borderColor: 'var(--color-border, #e2e8f0)', backgroundColor: 'var(--color-surface, #ffffff)' }}
                      value={form.sortOrder ?? 0} onChange={e => set('sortOrder', parseInt(e.target.value) || 0)} 
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-brand, #4f46e5)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-0.5"
                      style={{ borderColor: form.featured ? 'var(--color-brand, #4f46e5)' : 'var(--color-border, #e2e8f0)', backgroundColor: 'var(--color-surface, #ffffff)' }}>
                      <input type="checkbox" className="w-6 h-6 rounded-md transition-colors"
                        style={{ accentColor: 'var(--color-brand, #4f46e5)' }}
                        checked={!!form.featured} onChange={e => set('featured', e.target.checked)} />
                      <div>
                        <div className="font-bold text-base" style={{ color: 'var(--color-brand, #0f172a)' }}>Featured Brand</div>
                        <div className="text-sm opacity-60 font-medium" style={{ color: 'var(--color-brand, #0f172a)' }}>Showcase this brand prominently on the storefront.</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-40" style={{ color: 'var(--color-brand, #0f172a)' }}>SEO</h3>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-80" style={{ color: 'var(--color-brand, #0f172a)' }}>SEO Title</label>
                  <input className="w-full px-5 py-3.5 rounded-xl text-sm font-medium border-2 transition-all focus:outline-none"
                    style={{ backgroundColor: 'var(--color-bg, #f8fafc)', borderColor: 'var(--color-border, #e2e8f0)' }}
                    value={form.seoTitle || ''} onChange={e => set('seoTitle', e.target.value)} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-brand, #4f46e5)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-80" style={{ color: 'var(--color-brand, #0f172a)' }}>SEO Description</label>
                  <textarea rows={2} className="w-full px-5 py-3.5 rounded-xl text-sm font-medium border-2 transition-all focus:outline-none resize-none"
                    style={{ backgroundColor: 'var(--color-bg, #f8fafc)', borderColor: 'var(--color-border, #e2e8f0)' }}
                    value={form.seoDescription || ''} onChange={e => set('seoDescription', e.target.value)} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-brand, #4f46e5)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 px-8 py-6" style={{ borderTop: '1px solid var(--color-border, #e2e8f0)', backgroundColor: 'var(--color-bg, #f8fafc)' }}>
              <button onClick={closeModal} className="px-6 py-3 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors text-slate-700">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="px-8 py-3 rounded-full text-sm font-bold text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-brand, #4f46e5)' }}>
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Brand'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
