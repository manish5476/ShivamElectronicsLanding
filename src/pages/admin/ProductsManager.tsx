import { useState, useEffect } from 'react';
import { 
  Plus, Pencil, Trash2, Search, X, AlertCircle, CheckCircle, 
  Star, Zap, TrendingUp, Package, Grid, List, Table as TableIcon, 
  MoreVertical, Image as ImageIcon, Check, Calendar, Tag
} from 'lucide-react';
import { productsApi, brandsApi, categoriesApi } from '../../services/electronicsApi';
import { mediaApi } from '../../services/cmsApi';
import type { Product, Brand, Category } from '../../types/electronics';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const EMPTY_FORM: Partial<Product> = {
  name: '', slug: '', sku: '', brandId: '', categoryId: '',
  description: '', shortDescription: '', mrp: undefined, sellingPrice: undefined,
  offerPrice: undefined, priceDisplayMode: 'SHOW_PRICE', availability: 'IN_STOCK',
  stockQuantity: 0, featured: false, newArrival: false, popular: false,
  warranty: '', status: 'ACTIVE', tags: [],
};

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('list');
  
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>(EMPTY_FORM);
  const [imageUrl, setImageUrl] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const [pRes, bRes, cRes] = await Promise.all([
      productsApi.getAll(),
      brandsApi.getAll(),
      categoriesApi.getAll(),
    ]);
    if (pRes.success && pRes.data) setProducts(pRes.data);
    if (bRes.success && bRes.data) setBrands(bRes.data);
    if (cRes.success && cRes.data) setCategories(cRes.data);
    setLoading(false);
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageUrl('');
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
    setImageUrl(p.images?.[0]?.imageUrl || '');
    setShowModal(true);
  };

  const closeModal = () => { 
    setShowModal(false); 
    setEditing(null); 
    setForm(EMPTY_FORM); 
    setImageUrl(''); 
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    const result = await mediaApi.uploadFile(file);
    if (result.success && result.url) {
      setImageUrl(result.url);
      showToast('success', 'Image uploaded successfully!');
    } else {
      showToast('error', result.error || 'Failed to upload image');
    }
    setSaving(false);
  };

  const handleSave = async () => {
    if (!form.name?.trim()) return showToast('error', 'Product name is required');
    setSaving(true);
    
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name || ''),
      images: imageUrl ? [{ 
        imageUrl, 
        altText: form.name, 
        isPrimary: true,
        id: '', 
        productId: '', 
        sourceType: 'URL' as const, 
        sortOrder: 0, 
        createdAt: new Date().toISOString()
      }] : []
    };
    
    const res = editing
      ? await productsApi.update(editing.id, payload)
      : await productsApi.create(payload);
      
    if (res.success) {
      showToast('success', editing ? 'Product updated!' : 'Product created!');
      closeModal();
      load();
    } else {
      showToast('error', res.error || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    const res = await productsApi.delete(id);
    if (res.success) { 
      showToast('success', 'Product deleted'); 
      load(); 
    } else {
      showToast('error', res.error || 'Delete failed');
    }
    setDeleting(null);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(search.toLowerCase())
  );

  const set = (key: keyof Product, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const statusColor: Record<string, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    DRAFT: 'bg-amber-100 text-amber-700 border-amber-200',
    ARCHIVED: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  const renderGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filtered.map(p => (
        <div key={p.id} className="group flex flex-col bg-[var(--color-surface,#fff)] border border-[var(--color-border,#e2e8f0)] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="relative aspect-square bg-slate-50 flex items-center justify-center p-6 border-b border-[var(--color-border,#e2e8f0)]">
            {p.images?.[0]?.imageUrl ? (
              <img src={p.images[0].imageUrl} alt={p.name} className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105" />
            ) : (
              <Package size={48} className="text-slate-300" />
            )}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${statusColor[p.status || 'DRAFT']}`}>
                {p.status}
              </span>
            </div>
            <div className="absolute top-3 right-3 flex gap-1">
              {p.featured && <div className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-amber-500"><Star size={12} fill="currentColor" /></div>}
              {p.newArrival && <div className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-blue-500"><Zap size={12} fill="currentColor" /></div>}
            </div>
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="text-xs font-semibold text-[var(--color-brand,#0f172a)]/50 mb-1 tracking-wide uppercase">
              {(p as any).brand?.name || brands.find(b => b.id === p.brandId)?.name || 'Unknown Brand'}
            </div>
            <h3 className="font-semibold text-slate-800 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-[var(--color-brand,#0f172a)] transition-colors">{p.name}</h3>
            
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
              <div>
                {p.sellingPrice ? (
                  <div className="font-bold text-lg text-slate-900">₹{p.sellingPrice.toLocaleString()}</div>
                ) : <div className="text-slate-400 font-medium text-sm">Price unlisted</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="p-2 text-slate-400 hover:text-[var(--color-brand,#0f172a)] hover:bg-slate-100 rounded-full transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderList = () => (
    <div className="flex flex-col gap-4">
      {filtered.map(p => (
        <div key={p.id} className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-[var(--color-surface,#fff)] border border-[var(--color-border,#e2e8f0)] rounded-2xl hover:shadow-lg transition-all duration-300">
          <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl bg-slate-50 flex-shrink-0 flex items-center justify-center p-2 border border-slate-100 relative">
             {p.images?.[0]?.imageUrl ? (
              <img src={p.images[0].imageUrl} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />
            ) : (
              <Package size={24} className="text-slate-300" />
            )}
            <div className="absolute top-2 right-2 sm:hidden flex gap-1">
              {p.featured && <Star size={14} className="text-amber-500 drop-shadow-md" fill="currentColor" />}
            </div>
          </div>
          
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full border ${statusColor[p.status || 'DRAFT']}`}>
                {p.status}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Tag size={10} /> {(p as any).category?.name || categories.find(c => c.id === p.categoryId)?.name || 'Uncategorized'}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 text-lg truncate pr-4">{p.name}</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-sm text-slate-500">
              <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{p.sku || 'NO-SKU'}</span>
              <span>{(p as any).brand?.name || brands.find(b => b.id === p.brandId)?.name || 'Unknown Brand'}</span>
              
              <div className="hidden sm:flex items-center gap-1 ml-2">
                {p.featured && <Star size={14} className="text-amber-500" fill="currentColor" />}
                {p.newArrival && <Zap size={14} className="text-blue-500" fill="currentColor" />}
                {p.popular && <TrendingUp size={14} className="text-emerald-500" />}
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 px-2 sm:px-6 sm:border-l sm:border-r border-slate-100">
            <div className="text-xs text-slate-500 font-medium mb-0 sm:mb-1">Selling Price</div>
            {p.sellingPrice ? (
              <div className="font-bold text-xl text-slate-900">₹{p.sellingPrice.toLocaleString()}</div>
            ) : <div className="text-slate-400 font-medium">—</div>}
          </div>

          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 pl-2">
             <button onClick={() => openEdit(p)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-[var(--color-brand,#0f172a)] hover:text-white rounded-lg transition-colors">
               <Pencil size={14} /> Edit
             </button>
             <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors">
               <Trash2 size={14} /> Delete
             </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTable = () => (
    <div className="bg-[var(--color-surface,#fff)] border border-[var(--color-border,#e2e8f0)] rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/80 border-b border-[var(--color-border,#e2e8f0)] text-slate-500 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4 hidden md:table-cell">Brand & Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 hidden sm:table-cell">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border,#e2e8f0)]">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center p-1">
                      {p.images?.[0]?.imageUrl ? (
                        <img src={p.images[0].imageUrl} alt={p.name} className="w-full h-full object-contain" />
                      ) : <Package size={16} className="text-slate-300" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{p.name}</div>
                      <div className="font-mono text-xs text-slate-400 mt-0.5">{p.sku || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="text-slate-900 font-medium truncate">{(p as any).brand?.name || brands.find(b => b.id === p.brandId)?.name || '—'}</div>
                  <div className="text-slate-500 text-xs mt-0.5 truncate">{(p as any).category?.name || categories.find(c => c.id === p.categoryId)?.name || '—'}</div>
                </td>
                <td className="px-6 py-4">
                  {p.sellingPrice ? (
                    <span className="font-semibold text-slate-900 whitespace-nowrap">₹{p.sellingPrice.toLocaleString()}</span>
                  ) : <span className="text-slate-400">—</span>}
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className={`px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded-full border whitespace-nowrap ${statusColor[p.status || 'DRAFT']}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="p-2 text-slate-400 hover:text-[var(--color-brand,#0f172a)] hover:bg-slate-100 transition-colors rounded-lg">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg,#f8fafc)] text-slate-900 p-4 sm:p-6 lg:p-10">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[200] animate-in slide-in-from-top-4 fade-in flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-sm font-semibold bg-slate-900 text-white">
          {toast.type === 'success' ? <CheckCircle size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-red-400" />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-1 sm:mb-2">Product Catalog</h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium">Manage your products, pricing, and inventory across the platform.</p>
          </div>
          <button onClick={openCreate} className="group relative inline-flex items-center justify-center gap-2 bg-[var(--color-brand,#0f172a)] text-white px-5 sm:px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all overflow-hidden w-full sm:w-auto">
            <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--color-surface,#fff)] p-3 sm:p-4 rounded-2xl border border-[var(--color-border,#e2e8f0)] shadow-sm">
          <div className="relative w-full sm:max-w-md group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-brand,#0f172a)] transition-colors" />
            <input
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-brand,#0f172a)]/20 focus:border-[var(--color-brand,#0f172a)] transition-all placeholder:text-slate-400"
              placeholder="Search products by name or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-100 p-1 rounded-xl">
            {(['grid', 'list', 'table'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex-1 sm:flex-none p-2 sm:p-2.5 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === mode 
                    ? 'bg-white text-[var(--color-brand,#0f172a)] shadow-sm font-bold' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
                title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} View`}
              >
                {mode === 'grid' && <Grid size={18} />}
                {mode === 'list' && <List size={18} />}
                {mode === 'table' && <TableIcon size={18} />}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32 space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-slate-200 border-t-[var(--color-brand,#0f172a)] rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32 px-6 bg-[var(--color-surface,#fff)] border border-dashed border-[var(--color-border,#e2e8f0)] rounded-3xl text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Package size={28} className="text-slate-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">No products found</h3>
            <p className="text-sm sm:text-base text-slate-500 mb-8 max-w-md">We couldn't find any products matching your search criteria. Try adjusting your filters or add a new product.</p>
            <button onClick={openCreate} className="px-6 py-2.5 bg-[var(--color-brand,#0f172a)] text-white rounded-xl font-medium hover:bg-slate-800 transition-colors">
              Add your first product
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {viewMode === 'grid' && renderGrid()}
            {viewMode === 'list' && renderList()}
            {viewMode === 'table' && renderTable()}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 lg:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full h-full sm:h-[95vh] sm:max-w-7xl bg-[var(--color-surface,#fff)] sm:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden transform animate-in zoom-in-95 duration-200">
            
            {/* Editor Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-4 sm:py-5 border-b border-[var(--color-border,#e2e8f0)] bg-white z-10">
              <div className="flex items-center gap-4">
                <button onClick={closeModal} className="sm:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700">
                  <X size={24} />
                </button>
                <div className="hidden sm:flex w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
                  <Package size={20} className="text-slate-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">{editing ? 'Edit Product' : 'Create New Product'}</h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">{editing ? `Editing SKU: ${form.sku || 'N/A'}` : 'Add a new product to your catalog'}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
                <button onClick={closeModal} className="hidden sm:block px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Discard</button>
                <button onClick={handleSave} disabled={saving} className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold bg-[var(--color-brand,#0f172a)] text-white hover:bg-[var(--color-brand,#0f172a)]/90 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
              
              {/* Left Panel (Top on Mobile): Media */}
              <div className="w-full lg:w-[350px] xl:w-[450px] bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-[var(--color-border,#e2e8f0)] flex flex-col p-6 lg:p-8 overflow-y-auto shrink-0">
                <div className="mb-6 hidden lg:block">
                  <h3 className="text-lg font-bold text-slate-900">Product Media</h3>
                  <p className="text-sm text-slate-500 mt-1">Add primary images and thumbnails.</p>
                </div>
                
                <div className="w-full aspect-square bg-white border-2 border-dashed border-slate-300 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-6 relative group transition-colors hover:border-slate-400 max-h-48 lg:max-h-none">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                  <div className="text-center text-slate-400 flex flex-col items-center w-full">
                      <ImageIcon size={32} className="mb-2 lg:mb-4 lg:w-12 lg:h-12 text-slate-300 mx-auto" />
                      <p className="font-medium text-sm lg:text-base text-slate-600">No Image Provided</p>
                      <label className="mt-4 px-4 py-2 bg-[var(--color-brand,#0f172a)] text-white text-sm rounded-lg cursor-pointer hover:bg-[var(--color-brand,#0f172a)]/90 transition-colors shadow-sm inline-block">
                        Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={saving} />
                      </label>
                    </div>
                  )}
                </div>

                <div className="mt-6 lg:mt-8 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Image URL</label>
                      {imageUrl && (
                        <label className="text-xs font-semibold text-[var(--color-brand,#0f172a)] hover:underline cursor-pointer">
                          Change Image
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={saving} />
                        </label>
                      )}
                    </div>
                    <input 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 lg:py-3 text-sm focus:outline-none focus:border-[var(--color-brand,#0f172a)] focus:ring-1 focus:ring-[var(--color-brand,#0f172a)] transition-all shadow-sm"
                      placeholder="https://example.com/image.png" 
                      value={imageUrl} 
                      onChange={e => setImageUrl(e.target.value)} 
                    />
                  </div>
                  <div className="hidden lg:block bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100">
                    <p className="font-semibold mb-1 flex items-center gap-2"><AlertCircle size={16}/> Media Tip</p>
                    Use high-resolution images with a transparent or white background for best results on the storefront.
                  </div>
                </div>
              </div>

              {/* Right Panel: Details */}
              <div className="flex-1 overflow-y-auto bg-white p-6 lg:p-10">
                <div className="max-w-3xl mx-auto space-y-12 lg:space-y-16 pb-20 lg:pb-12">
                  
                  {/* Section: Basic Info */}
                  <section>
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-slate-100 text-slate-500 text-xs lg:text-sm">1</span>
                      Basic Information
                    </h3>
                    <div className="space-y-6 lg:space-y-8 pl-10 lg:pl-11">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Product Name *</label>
                        <input 
                          className="w-full bg-transparent border-b-2 border-slate-200 py-2 text-lg lg:text-xl font-semibold text-slate-900 focus:outline-none focus:border-[var(--color-brand,#0f172a)] transition-colors placeholder:text-slate-300"
                          placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                          value={form.name || ''} 
                          onChange={e => { set('name', e.target.value); if (!editing) set('slug', slugify(e.target.value)); }} 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">URL Slug</label>
                          <input 
                            className="w-full bg-transparent border-b-2 border-slate-200 py-2 text-sm font-mono text-slate-700 focus:outline-none focus:border-[var(--color-brand,#0f172a)] transition-colors"
                            value={form.slug || ''} 
                            onChange={e => set('slug', e.target.value)} 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">SKU / Barcode</label>
                          <input 
                            className="w-full bg-transparent border-b-2 border-slate-200 py-2 text-sm font-mono text-slate-700 focus:outline-none focus:border-[var(--color-brand,#0f172a)] transition-colors uppercase"
                            placeholder="e.g. SNY-WH1000XM5-BLK"
                            value={form.sku || ''} 
                            onChange={e => set('sku', e.target.value)} 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Category</label>
                          <select 
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[var(--color-brand,#0f172a)]/20 cursor-pointer"
                            value={form.categoryId || ''} onChange={e => set('categoryId', e.target.value)}>
                            <option value="">Select category...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Brand</label>
                          <select 
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[var(--color-brand,#0f172a)]/20 cursor-pointer"
                            value={form.brandId || ''} onChange={e => set('brandId', e.target.value)}>
                            <option value="">Select brand...</option>
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </section>

                  <hr className="border-slate-100" />

                  {/* Section: Pricing */}
                  <section>
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-slate-100 text-slate-500 text-xs lg:text-sm">2</span>
                      Pricing & Value
                    </h3>
                    <div className="pl-10 lg:pl-11 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">MRP (₹)</label>
                        <input 
                          type="number" 
                          className="w-full bg-transparent border-b-2 border-slate-200 py-2 text-lg text-slate-900 focus:outline-none focus:border-[var(--color-brand,#0f172a)] transition-colors"
                          placeholder="0.00"
                          value={form.mrp || ''} 
                          onChange={e => set('mrp', parseFloat(e.target.value) || undefined)} 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Selling Price (₹)</label>
                        <input 
                          type="number" 
                          className="w-full bg-transparent border-b-2 border-slate-200 py-2 text-lg font-bold text-[var(--color-brand,#0f172a)] focus:outline-none focus:border-[var(--color-brand,#0f172a)] transition-colors"
                          placeholder="0.00"
                          value={form.sellingPrice || ''} 
                          onChange={e => set('sellingPrice', parseFloat(e.target.value) || undefined)} 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Offer Price (₹)</label>
                        <input 
                          type="number" 
                          className="w-full bg-transparent border-b-2 border-slate-200 py-2 text-lg text-amber-600 focus:outline-none focus:border-amber-500 transition-colors"
                          placeholder="Optional"
                          value={form.offerPrice || ''} 
                          onChange={e => set('offerPrice', parseFloat(e.target.value) || undefined)} 
                        />
                      </div>
                    </div>
                  </section>

                  <hr className="border-slate-100" />

                  {/* Section: Inventory & Status */}
                  <section>
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-slate-100 text-slate-500 text-xs lg:text-sm">3</span>
                      Inventory & Display
                    </h3>
                    <div className="pl-10 lg:pl-11 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Status</label>
                        <select 
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[var(--color-brand,#0f172a)]/20 cursor-pointer"
                          value={form.status || 'DRAFT'} onChange={e => set('status', e.target.value)}>
                          <option value="ACTIVE">Active - Visible</option>
                          <option value="DRAFT">Draft - Hidden</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Availability</label>
                        <select 
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[var(--color-brand,#0f172a)]/20 cursor-pointer"
                          value={form.availability || 'IN_STOCK'} onChange={e => set('availability', e.target.value)}>
                          <option value="IN_STOCK">In Stock</option>
                          <option value="OUT_OF_STOCK">Out of Stock</option>
                          <option value="COMING_SOON">Coming Soon</option>
                          <option value="ON_REQUEST">On Request</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Price Display</label>
                        <select 
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[var(--color-brand,#0f172a)]/20 cursor-pointer"
                          value={form.priceDisplayMode || 'SHOW_PRICE'} onChange={e => set('priceDisplayMode', e.target.value)}>
                          <option value="SHOW_PRICE">Show Price</option>
                          <option value="CONTACT_FOR_PRICE">Contact for Price</option>
                          <option value="CALL_US">Call Us</option>
                        </select>
                      </div>
                    </div>

                    <div className="pl-10 lg:pl-11 mt-8">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 block">Product Highlights</label>
                       <div className="flex flex-wrap items-center gap-4">
                         {(['featured', 'newArrival', 'popular'] as const).map(flag => (
                           <label key={flag} className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${form[flag] ? 'border-[var(--color-brand,#0f172a)] bg-[var(--color-brand,#0f172a)]/5 text-[var(--color-brand,#0f172a)]' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}>
                             <input type="checkbox" className="hidden" checked={!!form[flag]} onChange={e => set(flag, e.target.checked)} />
                             <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${form[flag] ? 'bg-[var(--color-brand,#0f172a)] border-[var(--color-brand,#0f172a)] text-white' : 'border-slate-300'}`}>
                               {form[flag] && <Check size={12} strokeWidth={3} />}
                             </div>
                             <span className="text-sm font-semibold">
                               {flag === 'newArrival' ? 'New Arrival' : flag.charAt(0).toUpperCase() + flag.slice(1)}
                             </span>
                           </label>
                         ))}
                       </div>
                    </div>
                  </section>

                  <hr className="border-slate-100" />

                  {/* Section: Description & Extras */}
                  <section>
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-slate-100 text-slate-500 text-xs lg:text-sm">4</span>
                      Content & Specs
                    </h3>
                    <div className="space-y-6 lg:space-y-8 pl-10 lg:pl-11">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Warranty Information</label>
                        <input 
                          className="w-full bg-transparent border-b-2 border-slate-200 py-2 text-sm text-slate-900 focus:outline-none focus:border-[var(--color-brand,#0f172a)] transition-colors"
                          placeholder="e.g. 1 Year Manufacturer Warranty"
                          value={form.warranty || ''} 
                          onChange={e => set('warranty', e.target.value)} 
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Short Description</label>
                        <textarea 
                          rows={2} 
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm text-slate-700 focus:ring-2 focus:ring-[var(--color-brand,#0f172a)]/20 resize-none transition-shadow"
                          placeholder="A brief summary for listings and SEO..."
                          value={form.shortDescription || ''} 
                          onChange={e => set('shortDescription', e.target.value)} 
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Full Description</label>
                        <textarea 
                          rows={6} 
                          className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm text-slate-700 focus:ring-2 focus:ring-[var(--color-brand,#0f172a)]/20 resize-none transition-shadow leading-relaxed"
                          placeholder="Detailed product information, specifications, features, and marketing copy..."
                          value={form.description || ''} 
                          onChange={e => set('description', e.target.value)} 
                        />
                      </div>
                    </div>
                  </section>

                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
