import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { designsApi, collectionsApi, uploadApi } from '../../services/api';
import { isSupabaseConfigured } from '../../lib/supabase';
import { PermissionGuard } from '../../components/PermissionGuard';
import { PERMISSIONS } from '../../lib/permissions';
import { useAuth } from '../../contexts/AuthContext';

interface DesignForm {
  name: string; slug: string; description: string; longDescription: string;
  collectionId: string; category: string; price: string;
  priceType: 'fixed' | 'starting' | 'on-request';
  availability: 'available' | 'made-to-order' | 'sold';
  customizable: boolean; featured: boolean;
  material: string; craft: string; occasion: string; care: string; tags: string;
  images: { url: string; alt: string; isPrimary?: boolean }[];
}

const emptyForm: DesignForm = {
  name: '', slug: '', description: '', longDescription: '',
  collectionId: '', category: '', price: '', priceType: 'starting',
  availability: 'made-to-order', customizable: true, featured: false,
  material: '', craft: '', occasion: '', care: '', tags: '', images: [],
};

export default function DesignsManager() {
  const { hasPermission } = useAuth();
  const [designs, setDesigns] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DesignForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [designsRes, collectionsRes] = await Promise.all([
      designsApi.getAll(),
      collectionsApi.getAll(),
    ]);
    setDesigns(designsRes.success && designsRes.data ? designsRes.data : []);
    setCollections(collectionsRes.success && collectionsRes.data ? collectionsRes.data : []);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);

    try {
      const result = await uploadApi.uploadMultiple(files);
      if (result.success) {
        const newImages = result.urls.map((url, idx) => ({
          url,
          alt: `Image ${form.images.length + idx + 1}`,
          isPrimary: form.images.length === 0 && idx === 0,
        }));
        setForm({ ...form, images: [...form.images, ...newImages] });
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (err) {
      alert('Image upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const setPrimaryImage = (index: number) => {
    setForm({
      ...form,
      images: form.images.map((img, i) => ({ ...img, isPrimary: i === index })),
    });
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      slug: form.slug || generateSlug(form.name),
      images: form.images.map((img, idx) => ({
        ...img,
        id: `img-${Date.now()}-${idx}`,
      })),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const res = await designsApi.update(editingId, payload);
        if (res.success) { await loadData(); closeForm(); }
        else alert(res.error || 'Failed to update');
      } else {
        const res = await designsApi.create(payload);
        if (res.success) { await loadData(); closeForm(); }
        else alert(res.error || 'Failed to create');
      }
    } catch (err) {
      alert('Error saving design');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (design: any) => {
    setForm({
      name: design.name || '',
      slug: design.slug || '',
      description: design.description || '',
      longDescription: design.longDescription || design.long_description || '',
      collectionId: design.collectionId || design.collection_id || '',
      category: design.category || '',
      price: design.price || '',
      priceType: design.priceType || design.price_type || 'starting',
      availability: design.availability || 'made-to-order',
      customizable: design.customizable ?? true,
      featured: design.featured ?? false,
      material: design.material || '',
      craft: design.craft || '',
      occasion: design.occasion || '',
      care: design.care || '',
      tags: Array.isArray(design.tags) ? design.tags.join(', ') : (design.tags || ''),
      images: design.images || [],
    });
    setEditingId(design.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return;
    const res = await designsApi.delete(id);
    if (res.success) await loadData();
    else alert(res.error || 'Failed to delete');
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  if (loading) return <div className="py-20 text-center text-taupe">Loading designs...</div>;

  return (
    <PermissionGuard permission={PERMISSIONS.DESIGNS_VIEW}>
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="heading-serif text-3xl font-semibold text-espresso">Designs</h1>
          <p className="text-taupe text-sm">{designs.length} designs in your catalog</p>
        </div>
        {hasPermission(PERMISSIONS.DESIGNS_CREATE) && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-espresso text-ivory px-4 py-2.5 text-sm font-sans font-medium hover:bg-espresso/90 transition-colors">
            <Plus size={16} /> Add Design
          </button>
        )}
      </div>

      {!isSupabaseConfigured() && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-sm text-amber-800">
          <p className="font-medium">⚠️ Supabase not configured</p>
          <p className="text-xs mt-1">Showing sample data. Configure Supabase to manage your own designs.</p>
        </div>
      )}

      <div className="bg-white border border-champagne/30">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-champagne/30 bg-cream/30">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-taupe font-sans">Image</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-taupe font-sans">Name</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-taupe font-sans hidden md:table-cell">Collection</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-taupe font-sans">Price</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-taupe font-sans hidden lg:table-cell">Status</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-taupe font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne/20">
              {designs.map((design) => {
                const col = collections.find((c) => c.id === (design.collectionId || design.collection_id));
                return (
                  <tr key={design.id} className="hover:bg-cream/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-cream overflow-hidden">
                        {design.images?.[0]?.url && (
                          <img src={design.images[0].url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-espresso">{design.name}</p>
                      <p className="text-xs text-taupe">{design.category}</p>
                    </td>
                    <td className="px-4 py-3 text-taupe hidden md:table-cell">{col?.name || '—'}</td>
                    <td className="px-4 py-3">
                      {design.price ? (
                        <span className="text-espresso">{design.price}</span>
                      ) : (
                        <span className="text-taupe text-xs">On request</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        design.availability === 'available' ? 'bg-green-100 text-green-700' :
                        design.availability === 'made-to-order' ? 'bg-light-gold/20 text-muted-gold' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {design.availability === 'available' ? 'In Stock' :
                         design.availability === 'made-to-order' ? 'Made to Order' : 'Sold'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {hasPermission(PERMISSIONS.DESIGNS_EDIT) && (
                        <button onClick={() => handleEdit(design)} className="p-2 text-taupe hover:text-espresso transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                      )}
                      {hasPermission(PERMISSIONS.DESIGNS_DELETE) && (
                        <button onClick={() => handleDelete(design.id)} className="p-2 text-taupe hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {designs.length === 0 && (
          <div className="p-8 text-center text-taupe">No designs yet. Click "Add Design" to create your first product.</div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
          <div className="absolute inset-0 bg-espresso/50" onClick={closeForm} />
          <div className="relative bg-ivory w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 mb-10">
            <button onClick={closeForm} className="absolute top-4 right-4 text-taupe hover:text-espresso">
              <X size={20} />
            </button>
            <h2 className="heading-serif text-2xl font-semibold text-espresso mb-6">
              {editingId ? 'Edit Design' : 'Add New Design'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Name *</label>
                  <input type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
                    className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Short Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none resize-none" required />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Long Description</label>
                <textarea value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} rows={3}
                  className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Collection *</label>
                  <select value={form.collectionId} onChange={(e) => setForm({ ...form, collectionId: e.target.value })}
                    className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none" required>
                    <option value="">Select collection</option>
                    {collections.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Category *</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Earrings, Necklace, Bag..."
                    className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none" required />
                </div>
              </div>

              <div className="border-t border-champagne/50 pt-5">
                <h3 className="text-xs uppercase tracking-widest text-light-gold font-sans font-medium mb-4">Pricing & Availability</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Price</label>
                    <input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="₹2,500"
                      className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Price Type</label>
                    <select value={form.priceType} onChange={(e) => setForm({ ...form, priceType: e.target.value as any })}
                      className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none">
                      <option value="fixed">Fixed Price</option>
                      <option value="starting">Starting From</option>
                      <option value="on-request">On Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Availability</label>
                    <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value as any })}
                      className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none">
                      <option value="available">In Stock</option>
                      <option value="made-to-order">Made to Order</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-6 mt-4">
                  <label className="flex items-center gap-2 text-sm text-espresso cursor-pointer">
                    <input type="checkbox" checked={form.customizable} onChange={(e) => setForm({ ...form, customizable: e.target.checked })} className="accent-muted-gold" />
                    Customizable
                  </label>
                  <label className="flex items-center gap-2 text-sm text-espresso cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-muted-gold" />
                    Featured on Homepage
                  </label>
                </div>
              </div>

              <div className="border-t border-champagne/50 pt-5">
                <h3 className="text-xs uppercase tracking-widest text-light-gold font-sans font-medium mb-4">Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Material</label>
                    <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}
                      className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none" /></div>
                  <div><label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Craft</label>
                    <input type="text" value={form.craft} onChange={(e) => setForm({ ...form, craft: e.target.value })}
                      className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none" /></div>
                  <div><label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Occasion</label>
                    <input type="text" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                      className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none" /></div>
                  <div><label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Care</label>
                    <input type="text" value={form.care} onChange={(e) => setForm({ ...form, care: e.target.value })}
                      className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none" /></div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Tags (comma-separated)</label>
                  <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="earrings, pearl, festive"
                    className="w-full border border-champagne bg-white px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none" />
                </div>
              </div>

              <div className="border-t border-champagne/50 pt-5">
                <h3 className="text-xs uppercase tracking-widest text-light-gold font-sans font-medium mb-4">Images ({form.images.length})</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square bg-cream overflow-hidden group">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      {img.isPrimary && (
                        <span className="absolute top-1 left-1 bg-light-gold text-espresso text-[10px] px-1.5 py-0.5">Primary</span>
                      )}
                      <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                        {!img.isPrimary && (
                          <button type="button" onClick={() => setPrimaryImage(idx)} className="bg-white p-1 rounded text-espresso text-[10px]" title="Set as primary">★</button>
                        )}
                        <button type="button" onClick={() => removeImage(idx)} className="bg-white p-1 rounded text-red-600" title="Remove"><X size={12} /></button>
                      </div>
                    </div>
                  ))}
                  <label className="aspect-square bg-cream border-2 border-dashed border-champagne flex flex-col items-center justify-center cursor-pointer hover:border-light-gold transition-colors">
                    {uploading ? (
                      <span className="text-xs text-taupe">Uploading...</span>
                    ) : (
                      <><Upload size={20} className="text-taupe mb-1" /><span className="text-xs text-taupe">Upload</span></>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-taupe">
                  {isSupabaseConfigured() ? '✓ Images will be uploaded to Supabase Storage' : '⚠️ Supabase not configured - images will be local previews only'}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-champagne/50">
                <button type="button" onClick={closeForm}
                  className="flex-1 border border-champagne text-espresso py-3 text-sm font-sans font-medium hover:bg-cream transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-espresso text-ivory py-3 text-sm font-sans font-medium hover:bg-espresso/90 transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : editingId ? 'Update Design' : 'Create Design'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </PermissionGuard>
  );
}
