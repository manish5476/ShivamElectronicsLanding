import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { collectionsApi } from '../../services/api';

interface CollectionForm {
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  featured: boolean;
  sortOrder: number;
}

const emptyForm: CollectionForm = {
  name: '', slug: '', description: '', coverImage: '', featured: false, sortOrder: 0,
};

export default function CollectionsManager() {
  const [collections, setCollections] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CollectionForm>(emptyForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCollections(); }, []);

  const loadCollections = async () => {
    const res = await collectionsApi.getAll();
    setCollections(res.success && res.data ? res.data : []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    if (editingId) {
      await collectionsApi.update(editingId, payload);
    } else {
      await collectionsApi.create(payload);
    }
    await loadCollections();
    closeForm();
  };

  const handleEdit = (col: any) => {
    setForm({
      name: col.name || '',
      slug: col.slug || '',
      description: col.description || '',
      coverImage: col.coverImage || '',
      featured: col.featured ?? false,
      sortOrder: col.sortOrder || 0,
    });
    setEditingId(col.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this collection? Designs in it will become unassigned.')) return;
    await collectionsApi.delete(id);
    await loadCollections();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  if (loading) return <div className="py-20 text-center text-taupe">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="heading-serif text-3xl font-semibold text-espresso">Collections</h1>
          <p className="text-taupe text-sm">{collections.length} collections</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-espresso text-ivory px-4 py-2.5 text-sm font-sans font-medium hover:bg-espresso/90 transition-colors">
          <Plus size={16} /> Add Collection
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((col) => (
          <div key={col.id} className="bg-white border border-champagne/30 overflow-hidden group">
            <div className="aspect-[16/10] overflow-hidden bg-cream">
              {col.coverImage ? (
                <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-taupe text-sm">No image</div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="heading-serif text-lg font-semibold text-espresso">{col.name}</h3>
                {col.featured && (
                  <span className="text-[10px] uppercase tracking-wider bg-light-gold/20 text-muted-gold px-2 py-0.5">Featured</span>
                )}
              </div>
              <p className="text-xs text-taupe line-clamp-2 mb-3">{col.description}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(col)}
                  className="flex-1 flex items-center justify-center gap-1 border border-champagne py-1.5 text-xs text-espresso hover:bg-cream transition-colors">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(col.id)}
                  className="flex items-center justify-center gap-1 border border-champagne py-1.5 px-3 text-xs text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="bg-white border border-champagne/30 p-8 text-center text-taupe">
          No collections yet. Create your first collection to organize designs.
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-espresso/50" onClick={closeForm} />
          <div className="relative bg-ivory w-full max-w-md p-6 sm:p-8">
            <button onClick={closeForm} className="absolute top-4 right-4 text-taupe hover:text-espresso">
              <X size={20} />
            </button>
            <h2 className="heading-serif text-2xl font-semibold text-espresso mb-6">
              {editingId ? 'Edit Collection' : 'New Collection'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Name *</label>
                <input type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                  className="w-full border border-champagne bg-white px-4 py-2.5 text-sm rounded-sm focus:border-light-gold focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full border border-champagne bg-white px-4 py-2.5 text-sm rounded-sm focus:border-light-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full border border-champagne bg-white px-4 py-2.5 text-sm rounded-sm focus:border-light-gold focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Cover Image URL</label>
                <input type="url" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://..." className="w-full border border-champagne bg-white px-4 py-2.5 text-sm rounded-sm focus:border-light-gold focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full border border-champagne bg-white px-4 py-2.5 text-sm rounded-sm focus:border-light-gold focus:outline-none" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-espresso cursor-pointer pb-2.5">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-muted-gold" />
                    Featured
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeForm}
                  className="flex-1 border border-champagne text-espresso py-3 text-sm font-sans font-medium hover:bg-cream transition-colors">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-espresso text-ivory py-3 text-sm font-sans font-medium hover:bg-espresso/90 transition-colors">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
