import { useState, useEffect } from 'react';
import { 
  Plus, Pencil, Trash2, Search, X, AlertCircle, CheckCircle, 
  FolderOpen, ImageIcon, Check, SlidersHorizontal, Table, LayoutGrid, Eye, EyeOff
} from 'lucide-react';
import { categoriesApi } from '../../services/electronicsApi';
import type { Category } from '../../types/electronics';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const EMPTY_FORM: Partial<Category> = {
  name: '', slug: '', description: '', imageUrl: '', parentId: undefined,
  status: 'ACTIVE', featured: false, sortOrder: 0, seoTitle: '', seoDescription: '',
};

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal create/edit
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Partial<Category>>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // In-line row editing (quick edit right in table)
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineForm, setInlineForm] = useState<{ name: string; slug: string; featured: boolean; status: 'ACTIVE' | 'INACTIVE'; imageUrl: string }>({
    name: '', slug: '', featured: false, status: 'ACTIVE', imageUrl: ''
  });
  const [inlineSaving, setInlineSaving] = useState(false);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const res = await categoriesApi.getAll();
    if (res.success && res.data) setCategories(res.data);
    setLoading(false);
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ ...c });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.name?.trim()) return showToast('error', 'Category name is required');
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.name || '') };
    const res = editing
      ? await categoriesApi.update(editing.id, payload)
      : await categoriesApi.create(payload);
    if (res.success) {
      showToast('success', editing ? 'Category updated!' : 'Category created!');
      closeModal();
      load();
    } else {
      showToast('error', res.error || 'Failed to save');
    }
    setSaving(false);
  };

  // Quick In-line Edit in Table
  const startInlineEdit = (c: Category) => {
    setInlineEditId(c.id);
    setInlineForm({
      name: c.name,
      slug: c.slug,
      featured: c.featured,
      status: c.status,
      imageUrl: c.imageUrl || ''
    });
  };

  const cancelInlineEdit = () => {
    setInlineEditId(null);
  };

  const saveInlineEdit = async (id: string) => {
    if (!inlineForm.name.trim()) return showToast('error', 'Category name cannot be empty');
    setInlineSaving(true);
    const res = await categoriesApi.update(id, {
      name: inlineForm.name,
      slug: inlineForm.slug || slugify(inlineForm.name),
      featured: inlineForm.featured,
      status: inlineForm.status,
      imageUrl: inlineForm.imageUrl
    });
    if (res.success) {
      showToast('success', 'Category updated directly!');
      setInlineEditId(null);
      load();
    } else {
      showToast('error', res.error || 'Failed to save changes');
    }
    setInlineSaving(false);
  };

  // Quick toggle featured
  const toggleFeatured = async (c: Category) => {
    const res = await categoriesApi.update(c.id, { featured: !c.featured });
    if (res.success) {
      showToast('success', `${c.name} ${!c.featured ? 'marked featured' : 'unfeatured'}`);
      setCategories(prev => prev.map(item => item.id === c.id ? { ...item, featured: !c.featured } : item));
    }
  };

  // Quick toggle status
  const toggleStatus = async (c: Category) => {
    const nextStatus = c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const res = await categoriesApi.update(c.id, { status: nextStatus });
    if (res.success) {
      showToast('success', `${c.name} is now ${nextStatus}`);
      setCategories(prev => prev.map(item => item.id === c.id ? { ...item, status: nextStatus } : item));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products in this category will become uncategorized.')) return;
    setDeleting(id);
    const res = await categoriesApi.delete(id);
    if (res.success) { showToast('success', 'Category deleted'); load(); }
    else showToast('error', res.error || 'Delete failed');
    setDeleting(null);
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const parentCategories = categories.filter(c => !c.parentId);
  const set = (key: keyof Category, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen p-6 sm:p-8" style={{ backgroundColor: 'var(--color-bg, #f8fafc)' }}>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold transition-all animate-in slide-in-from-top-4 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--color-brand, #0f172a)' }}>Product Categories</h1>
          <p className="text-sm md:text-base mt-2 opacity-70 font-medium max-w-xl" style={{ color: 'var(--color-brand, #334155)' }}>
            Direct table grid with instant inline edit &amp; toggle for fast management.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Table size={15} /> Table (Direct Edit)
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <LayoutGrid size={15} /> Card View
            </button>
          </div>

          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" style={{ color: 'var(--color-brand, #0f172a)' }} />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium shadow-sm border focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: 'var(--color-surface, #ffffff)', 
                borderColor: 'var(--color-border, #e2e8f0)', 
                color: 'var(--color-brand, #0f172a)' 
              }}
              placeholder="Search categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap" style={{ backgroundColor: 'var(--color-brand, #4f46e5)' }}>
            <Plus size={18} strokeWidth={2.5} /> Add Category
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50 space-y-4">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-brand, #4f46e5)' }}></div>
          <p className="font-medium" style={{ color: 'var(--color-brand, #0f172a)' }}>Loading categories...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--color-surface, #ffffff)', border: '2px dashed var(--color-border, #e2e8f0)' }}>
          <FolderOpen size={48} strokeWidth={1} className="opacity-20 mb-4" style={{ color: 'var(--color-brand, #0f172a)' }} />
          <p className="text-lg font-bold mb-1" style={{ color: 'var(--color-brand, #0f172a)' }}>No categories found</p>
          <p className="text-sm opacity-60 mb-5 text-center max-w-sm" style={{ color: 'var(--color-brand, #334155)' }}>Create your first category or change search term.</p>
          <button onClick={openCreate} className="px-5 py-2 rounded-xl text-white font-semibold text-sm shadow-md" style={{ backgroundColor: 'var(--color-brand, #4f46e5)' }}>Create Category</button>
        </div>
      ) : viewMode === 'table' ? (
        /* ══════════ DIRECT FAST EDIT TABLE ══════════ */
        <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--color-surface, #ffffff)', borderColor: 'var(--color-border, #e2e8f0)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500" style={{ borderColor: 'var(--color-border, #e2e8f0)' }}>
                  <th className="py-3.5 px-4 w-16">Image</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4 text-center w-28">Featured</th>
                  <th className="py-3.5 px-4 text-center w-28">Status</th>
                  <th className="py-3.5 px-4 text-right w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm font-medium" style={{ borderColor: 'var(--color-border, #e2e8f0)' }}>
                {filtered.map(cat => {
                  const isInline = inlineEditId === cat.id;

                  if (isInline) {
                    return (
                      <tr key={cat.id} className="bg-indigo-50/40">
                        {/* Image Preview & URL input */}
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded-lg border overflow-hidden bg-slate-100 flex items-center justify-center">
                            {inlineForm.imageUrl ? (
                              <img src={inlineForm.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={18} className="text-slate-400" />
                            )}
                          </div>
                        </td>
                        {/* Name Input */}
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={inlineForm.name}
                            onChange={e => setInlineForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                            className="w-full px-3 py-1.5 text-sm rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            placeholder="Category name"
                            autoFocus
                          />
                        </td>
                        {/* Slug Input */}
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={inlineForm.slug}
                            onChange={e => setInlineForm(f => ({ ...f, slug: e.target.value }))}
                            className="w-full px-3 py-1.5 text-xs text-slate-600 rounded-lg border border-slate-200 focus:outline-none bg-white font-mono"
                            placeholder="slug"
                          />
                        </td>
                        {/* Featured Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setInlineForm(f => ({ ...f, featured: !f.featured }))}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${inlineForm.featured ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}
                          >
                            {inlineForm.featured ? '★ YES' : 'NO'}
                          </button>
                        </td>
                        {/* Status Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setInlineForm(f => ({ ...f, status: f.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }))}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${inlineForm.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}
                          >
                            {inlineForm.status}
                          </button>
                        </td>
                        {/* Save / Cancel buttons */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => saveInlineEdit(cat.id)}
                              disabled={inlineSaving}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <Check size={14} /> Save
                            </button>
                            <button
                              onClick={cancelInlineEdit}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200/80 bg-slate-100 flex items-center justify-center shrink-0">
                          {cat.imageUrl ? (
                            <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={18} className="text-slate-400" />
                          )}
                        </div>
                      </td>
                      {/* Name */}
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{cat.name}</span>
                          {cat.description && (
                            <span className="text-xs text-slate-400 font-normal truncate max-w-xs block">
                              — {cat.description}
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Slug */}
                      <td className="py-3 px-4 text-xs font-mono text-slate-500">
                        /{cat.slug}
                      </td>
                      {/* Quick Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleFeatured(cat)}
                          title="Click to toggle featured"
                          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 ${cat.featured ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                          {cat.featured ? '★ Featured' : 'Standard'}
                        </button>
                      </td>
                      {/* Quick Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(cat)}
                          title="Click to toggle active/inactive"
                          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 ${cat.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-500'}`}
                        >
                          {cat.status}
                        </button>
                      </td>
                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startInlineEdit(cat)}
                            title="Direct In-line Edit"
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            <SlidersHorizontal size={16} />
                          </button>
                          <button
                            onClick={() => openEdit(cat)}
                            title="Full Edit Modal"
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            disabled={deleting === cat.id}
                            title="Delete Category"
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ══════════ COMPACT ELEGANT CARD VIEW ══════════ */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(cat => (
            <div key={cat.id} className="group relative rounded-2xl overflow-hidden border bg-white shadow-sm flex flex-col hover:shadow-md transition-all">
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon size={36} />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cat.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-white'}`}>
                    {cat.status}
                  </span>
                  {cat.featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                      FEATURED
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white shadow">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg bg-white/90 text-rose-600 hover:bg-white shadow">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm text-slate-900 leading-tight truncate">{cat.name}</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">/{cat.slug}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Modal Design */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] bg-white animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-slate-900">
                {editing ? 'Edit Category' : 'Create Category'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={e => {
                    set('name', e.target.value);
                    if (!editing) set('slug', slugify(e.target.value));
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Smart TVs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug || ''}
                  onChange={e => set('slug', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={form.imageUrl || ''}
                  onChange={e => set('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description || ''}
                  onChange={e => set('description', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brief description..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={!!form.featured}
                    onChange={e => set('featured', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  Feature on Homepage
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={form.status === 'ACTIVE'}
                    onChange={e => set('status', e.target.checked ? 'ACTIVE' : 'INACTIVE')}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  Active Status
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 text-sm font-bold text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
