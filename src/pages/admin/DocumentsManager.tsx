import { useState, useEffect } from 'react';
import { 
  FileText, Plus, ExternalLink, Trash2, 
  RefreshCw, Check, Search, Shield, Eye, Lock
} from 'lucide-react';
import { documentsApi } from '../../services/documentsApi';
import type { CompanyDocument, DocumentType, DocumentVisibility } from '../../types/business';

export default function DocumentsManager() {
  const [docs, setDocs] = useState<CompanyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<DocumentVisibility | 'ALL'>('ALL');
  
  // Create / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Partial<CompanyDocument>>({
    title: '',
    description: '',
    documentType: 'CERTIFICATE',
    fileUrl: '',
    fileName: 'document.pdf',
    version: '1.0',
    visibility: 'PUBLIC',
    status: 'ACTIVE',
  });

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    const res = await documentsApi.getDocuments();
    if (res.data) setDocs(res.data);
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setEditingDoc({
      title: '',
      description: '',
      documentType: 'CERTIFICATE',
      fileUrl: '',
      fileName: 'document.pdf',
      version: '1.0',
      visibility: 'PUBLIC',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: CompanyDocument) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    await documentsApi.deleteDocument(id);
    await loadDocs();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editingDoc.id) {
      await documentsApi.updateDocument(editingDoc.id, editingDoc);
    } else {
      await documentsApi.createDocument(editingDoc);
    }
    setSaving(false);
    setIsModalOpen(false);
    await loadDocs();
  };

  const filteredDocs = docs.filter(d => {
    const matchVis = visibilityFilter === 'ALL' || d.visibility === visibilityFilter;
    const matchSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchVis && matchSearch;
  });

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[var(--color-brand)] mb-3" />
        <p className="text-sm font-medium text-[var(--color-text-muted)]">Loading Documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-brand)] block mb-1">
            Compliance & Document Repository
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Company Documents & Catalogues
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Manage dealer certificates, GST registration, warranty charts, and public product catalogues.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--color-brand)] text-white hover:opacity-90 transition-all shadow-sm"
        >
          <Plus size={14} /> Add New Document
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-px">
        <div className="flex items-center gap-2">
          {(['ALL', 'PUBLIC', 'PRIVATE', 'ADMIN_ONLY'] as const).map(vis => (
            <button
              key={vis}
              onClick={() => setVisibilityFilter(vis)}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all ${
                visibilityFilter === vis
                  ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {vis === 'ALL' ? 'All Documents' : vis.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-brand)]"
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-text-muted)] text-xs">
            No documents found matching your filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-surface-soft)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4 text-center">Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] font-medium">
                {filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-[var(--color-surface-soft)]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[var(--color-text)]">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[var(--color-brand)] flex-shrink-0" />
                        <div>
                          <span>{doc.title}</span>
                          {doc.description && (
                            <span className="block text-[11px] text-[var(--color-text-muted)] font-normal truncate max-w-sm">
                              {doc.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[var(--color-text-muted)]">
                      {doc.documentType}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-muted)]">
                      v{doc.version}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {doc.visibility === 'PUBLIC' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Eye size={10} /> Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Lock size={10} /> {doc.visibility}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-soft)] transition-colors"
                            title="Open / Download"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenEdit(doc)}
                          className="px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[11px] font-bold hover:bg-[var(--color-surface-soft)]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="Delete Document"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] w-full max-w-lg rounded-2xl border border-[var(--color-border)] shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-base font-bold text-[var(--color-text)]">
                {editingDoc.id ? 'Edit Document' : 'Add New Document'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider mb-1.5 text-[var(--color-text-muted)]">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingDoc.title || ''}
                  onChange={e => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  placeholder="e.g. Sony India Authorized Dealership 2025"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1.5 text-[var(--color-text-muted)]">
                    Document Type *
                  </label>
                  <select
                    value={editingDoc.documentType}
                    onChange={e => setEditingDoc({ ...editingDoc, documentType: e.target.value as DocumentType })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                  >
                    <option value="REGISTRATION">Registration (GST/Govt)</option>
                    <option value="CERTIFICATE">Brand Dealer Certificate</option>
                    <option value="WARRANTY">Warranty Policy Chart</option>
                    <option value="CATALOGUE">Product Catalogue</option>
                    <option value="MANUAL">Operation Manual</option>
                    <option value="POLICY">Internal Policy</option>
                    <option value="OTHER">Other Document</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1.5 text-[var(--color-text-muted)]">
                    Visibility *
                  </label>
                  <select
                    value={editingDoc.visibility}
                    onChange={e => setEditingDoc({ ...editingDoc, visibility: e.target.value as DocumentVisibility })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-bold"
                  >
                    <option value="PUBLIC">Public (Website visitors)</option>
                    <option value="PRIVATE">Private (Staff only)</option>
                    <option value="ADMIN_ONLY">Admin Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-1.5 text-[var(--color-text-muted)]">
                  File URL *
                </label>
                <input
                  type="url"
                  required
                  value={editingDoc.fileUrl || ''}
                  onChange={e => setEditingDoc({ ...editingDoc, fileUrl: e.target.value })}
                  placeholder="https://... (PDF or image link)"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1.5 text-[var(--color-text-muted)]">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={editingDoc.fileName || ''}
                    onChange={e => setEditingDoc({ ...editingDoc, fileName: e.target.value })}
                    placeholder="Dealer_Cert.pdf"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1.5 text-[var(--color-text-muted)]">
                    Version Tag
                  </label>
                  <input
                    type="text"
                    value={editingDoc.version || ''}
                    onChange={e => setEditingDoc({ ...editingDoc, version: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-1.5 text-[var(--color-text-muted)]">
                  Description / Note
                </label>
                <textarea
                  rows={2}
                  value={editingDoc.description || ''}
                  onChange={e => setEditingDoc({ ...editingDoc, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold hover:bg-[var(--color-surface-soft)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[var(--color-brand)] text-white text-xs font-bold hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
