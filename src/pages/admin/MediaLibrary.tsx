import { useState, useEffect, useRef } from 'react';
import { Upload, Link as LinkIcon, Trash2, Copy, ExternalLink, Search, FileImage, Cloud, Settings, Check, AlertCircle, X } from 'lucide-react';
import { mediaApi } from '../../services/cmsApi';
import { cloudinaryService, type CloudinaryConfig } from '../../services/cloudinaryService';

export default function MediaLibrary() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [altInput, setAltInput] = useState('');
  const [search, setSearch] = useState('');
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [showCloudinaryModal, setShowCloudinaryModal] = useState(false);
  const [cConfig, setCConfig] = useState<CloudinaryConfig>(cloudinaryService.getConfig());
  const [cSaved, setCSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadAssets(); }, []);

  const loadAssets = async () => {
    const res = await mediaApi.getAll();
    if (res.success) setAssets(res.data || []);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const result = await mediaApi.uploadFile(file);
      if (result.success && result.url) {
        await mediaApi.create({
          source_type: 'UPLOAD',
          url: result.url,
          storage_key: result.storageKey || null,
          alt_text: file.name,
          name: file.name,
          mime_type: file.type,
          file_size: file.size,
        });
      }
    }
    await loadAssets();
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUrlAdd = async () => {
    if (!urlInput) return;
    try {
      new URL(urlInput);
    } catch {
      alert('Please enter a valid URL');
      return;
    }
    if (!urlInput.startsWith('https://')) {
      alert('Only HTTPS URLs are supported');
      return;
    }
    await mediaApi.create({
      source_type: 'URL',
      url: urlInput,
      alt_text: altInput || urlInput,
      name: altInput || urlInput.split('/').pop() || 'Image',
    });
    setUrlInput('');
    setAltInput('');
    setShowUrlForm(false);
    await loadAssets();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    await mediaApi.delete(id);
    await loadAssets();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const filtered = assets.filter(a => 
    !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.alt_text?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[var(--color-brand)]/20 border-t-[var(--color-brand)] rounded-full animate-spin"></div>
        <p className="text-sm text-[var(--color-text-muted)] font-medium">Loading media...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Media Library</h1>
            {cloudinaryService.isConfigured() ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Cloudinary CDN Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Supabase Storage (1GB)
              </span>
            )}
          </div>
          <p className="text-[var(--color-text-soft)] text-sm">{assets.length} images stored in your library</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowCloudinaryModal(true)}
            className="btn btn-outline btn-sm bg-white gap-1.5"
            title="Configure Cloudinary CDN for unlimited storage on GitHub Pages"
          >
            <Cloud size={15} className="text-indigo-600" />
            <span>Cloudinary Settings</span>
          </button>
          <button onClick={() => setShowUrlForm(!showUrlForm)} className="btn btn-outline btn-sm bg-white">
            <LinkIcon size={16} /> 
            <span>Add URL</span>
          </button>
          <label className="btn btn-primary btn-sm cursor-pointer">
            <Upload size={16} /> 
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Cloudinary Configuration Modal */}
      {showCloudinaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 text-slate-900">
            <button
              onClick={() => setShowCloudinaryModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Cloud size={22} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Cloudinary Integration</h3>
                <p className="text-xs text-slate-500">Works 100% on GitHub Pages without exposing API secrets</p>
              </div>
            </div>

            <div className="p-3.5 mb-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-1">
              <p className="font-bold">✦ Why Cloudinary for GitHub Pages?</p>
              <p className="text-slate-600">
                Supabase Free tier offers <strong>1 GB</strong> storage. Cloudinary offers <strong>25 GB</strong> free storage + auto-converts photos to WebP &amp; serves via fast worldwide CDN.
              </p>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                cloudinaryService.saveConfig(cConfig);
                setCSaved(true);
                setTimeout(() => setCSaved(false), 2000);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cloud Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={cConfig.cloudName}
                  onChange={e => setCConfig(c => ({ ...c, cloudName: e.target.value.trim() }))}
                  placeholder="e.g. dxyz1234"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">Found in your Cloudinary Dashboard under "Cloud Name".</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Upload Preset (Unsigned) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={cConfig.uploadPreset}
                  onChange={e => setCConfig(c => ({ ...c, uploadPreset: e.target.value.trim() }))}
                  placeholder="e.g. shivam_products_upload"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  In Cloudinary: <strong>Settings → Upload → Add upload preset</strong> → set Signing Mode to <strong>Unsigned</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Folder (Optional)
                </label>
                <input
                  type="text"
                  value={cConfig.folder || ''}
                  onChange={e => setCConfig(c => ({ ...c, folder: e.target.value.trim() }))}
                  placeholder="e.g. shivam_electronics"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    cloudinaryService.clearConfig();
                    setCConfig({ cloudName: '', uploadPreset: '', folder: '' });
                    setCSaved(true);
                    setTimeout(() => setCSaved(false), 2000);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors"
                >
                  Reset to Supabase Storage
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCloudinaryModal(false)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm flex items-center gap-1.5"
                  >
                    {cSaved ? <Check size={14} /> : null}
                    <span>{cSaved ? 'Saved Active!' : 'Save & Activate'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUrlForm && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 mb-8 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Add External Image</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Image URL (HTTPS only)</label>
              <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Alt Text / Name</label>
              <input type="text" value={altInput} onChange={e => setAltInput(e.target.value)} placeholder="Descriptive name" className="w-full bg-white border border-[var(--color-border)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--color-brand)]" />
            </div>
          </div>
          {urlInput && urlInput.startsWith('https://') && (
            <div className="mt-4 p-3 bg-[var(--color-bg-soft)] rounded-lg flex items-center gap-4 border border-[var(--color-border-soft)]">
              <img src={urlInput} alt="Preview" className="w-20 h-14 object-cover rounded shadow-sm border border-[var(--color-border)]" onError={e => (e.currentTarget.style.display = 'none')} />
              <p className="text-xs font-medium text-[var(--color-success)] flex items-center gap-1">
                ✓ Valid HTTPS URL ready to add
              </p>
            </div>
          )}
          <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--color-border-soft)]">
            <button onClick={handleUrlAdd} className="btn btn-primary btn-sm">Add to Library</button>
            <button onClick={() => setShowUrlForm(false)} className="btn btn-outline btn-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--color-border-soft)] bg-[var(--color-bg-soft)]/50">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search media by name or alt text..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]" 
            />
          </div>
        </div>

        <div className="p-6">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <FileImage size={40} className="mx-auto text-[var(--color-text-muted)] mb-3 opacity-50" />
              <p className="text-sm font-medium text-[var(--color-text)]">
                {search ? 'No images match your search.' : 'Your media library is empty.'}
              </p>
              <p className="text-xs text-[var(--color-text-soft)] mt-1">Upload images or add image URLs to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map(asset => (
                <div key={asset.id} className="group border border-[var(--color-border-soft)] rounded-lg overflow-hidden hover:border-[var(--color-brand)] hover:shadow-md transition-all bg-white">
                  <div className="aspect-square bg-[var(--color-bg-soft)] relative overflow-hidden flex items-center justify-center">
                    <img src={asset.url} alt={asset.alt_text || ''} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    
                    <div className="absolute inset-0 bg-[var(--color-brand)]/80 backdrop-blur-sm flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => copyUrl(asset.url)} className="p-2 bg-white rounded-md text-[var(--color-text)] hover:bg-[var(--color-bg-soft)] transition-colors shadow-sm" title="Copy URL">
                        <Copy size={16} />
                      </button>
                      <a href={asset.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-md text-[var(--color-text)] hover:bg-[var(--color-bg-soft)] transition-colors shadow-sm" title="Open in new tab">
                        <ExternalLink size={16} />
                      </a>
                      <button onClick={() => handleDelete(asset.id)} className="p-2 bg-white rounded-md text-[var(--color-danger)] hover:bg-red-50 transition-colors shadow-sm" title="Delete image">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <span className={`absolute top-2 left-2 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${asset.source_type === 'UPLOAD' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} shadow-sm`}>
                      {asset.source_type}
                    </span>
                  </div>
                  <div className="p-2 border-t border-[var(--color-border-soft)]">
                    <p className="text-[11px] font-medium text-[var(--color-text)] truncate">{asset.name || asset.alt_text || 'Untitled'}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] truncate">{new Date(asset.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
