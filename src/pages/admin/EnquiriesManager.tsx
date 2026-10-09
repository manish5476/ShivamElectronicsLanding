import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MessageCircle, AlertCircle, CheckCircle, Phone, Mail,
  Package, Clock, ChevronDown, Calendar, User, FileText, Activity,
  X, ShoppingBag, ExternalLink, Ticket
} from 'lucide-react';
import { enquiriesApi } from '../../services/electronicsApi';
import type { Enquiry } from '../../types/electronics';

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED'];

const statusStyles: Record<string, { bg: string, text: string, border: string }> = {
  NEW: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  CONTACTED: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  FOLLOW_UP: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  CONVERTED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  CLOSED: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getEnquiryProductsInfo(e: Enquiry) {
  if ((e as any).product?.name) {
    return {
      isToken: false,
      tokenCode: null,
      title: (e as any).product.name,
      items: [(e as any).product.name],
    };
  }

  if (e.message && e.message.includes('[PURCHASE TOKEN:')) {
    const tokenMatch = e.message.match(/\[PURCHASE TOKEN:\s*([^\]]+)\]/);
    const tokenCode = tokenMatch ? tokenMatch[1].trim() : null;

    const itemsMatch = e.message.match(/Items:\s*\n([\s\S]+)$/);
    const itemsList: string[] = [];
    if (itemsMatch) {
      const lines = itemsMatch[1].split('\n').map(l => l.trim()).filter(Boolean);
      itemsList.push(...lines);
    }

    return {
      isToken: true,
      tokenCode,
      title: itemsList.length > 0 ? itemsList[0] : `Showroom Cart Order (${tokenCode})`,
      items: itemsList,
    };
  }

  return {
    isToken: false,
    tokenCode: null,
    title: 'General Showroom Enquiry',
    items: [],
  };
}

export default function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const res = await enquiriesApi.getAll();
    if (res.success && res.data) setEnquiries(res.data);
    setLoading(false);
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const openDetail = (e: Enquiry) => {
    setSelected(e);
    setNotes(e.notes || '');
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelected(null), 300);
  };

  const updateEnquiry = async (id: string, updates: Partial<Enquiry>) => {
    setSavingStatus(true);
    const res = await enquiriesApi.update(id, updates);
    if (res.success) {
      showToast('success', 'Enquiry updated successfully');
      load();
      if (selected?.id === id) {
        setSelected(prev => prev ? { ...prev, ...updates } : null);
      }
    } else {
      showToast('error', res.error || 'Update failed');
    }
    setSavingStatus(false);
  };

  const filtered = enquiries.filter(e => {
    const matchSearch = !search || 
      e.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (e.customerPhone || '').includes(search) ||
      (e.customerEmail || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = enquiries.filter(e => e.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg, #f3f4f6)' }}>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all transform translate-y-0 ${toast.type === 'success' ? 'bg-white border-green-200 text-green-800' : 'bg-white border-red-200 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} className="text-green-500" /> : <AlertCircle size={18} className="text-red-500" />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-brand, #111827)' }}>CRM Pipeline</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your customer enquiries</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent transition-all outline-none"
                style={{ backgroundColor: 'var(--color-surface, #ffffff)', borderColor: 'var(--color-border, #e5e7eb)' }}
                placeholder="Search customers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div 
            onClick={() => setFilterStatus('')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${!filterStatus ? 'ring-2 ring-[var(--color-brand)] shadow-md' : 'hover:shadow-md'}`}
            style={{ backgroundColor: 'var(--color-surface, #ffffff)', borderColor: 'var(--color-border, #e5e7eb)' }}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</p>
            <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-brand, #111827)' }}>{enquiries.length}</p>
          </div>
          {STATUS_OPTIONS.map(s => {
            const style = statusStyles[s];
            return (
              <div
                key={s}
                onClick={() => setFilterStatus(s === filterStatus ? '' : s)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${filterStatus === s ? 'ring-2 ring-[var(--color-brand)] shadow-md' : 'hover:shadow-md'}`}
                style={{ backgroundColor: 'var(--color-surface, #ffffff)', borderColor: 'var(--color-border, #e5e7eb)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{s.replace('_', ' ')}</p>
                  <div className={`w-2 h-2 rounded-full ${style.bg.replace('bg-', 'bg-').replace('50', '400')}`}></div>
                </div>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-brand, #111827)' }}>{counts[s] || 0}</p>
              </div>
            );
          })}
        </div>

        {/* Data List */}
        <div className="rounded-xl border overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--color-surface, #ffffff)', borderColor: 'var(--color-border, #e5e7eb)' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Activity className="animate-spin mb-4" size={32} />
              <p className="text-sm font-medium">Loading enquiries...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <MessageCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No enquiries found</h3>
              <p className="text-sm text-gray-500 max-w-sm">We couldn't find any enquiries matching your current search and filter criteria.</p>
              {(search || filterStatus) && (
                <button 
                  onClick={() => { setSearch(''); setFilterStatus(''); }}
                  className="mt-4 text-sm font-medium"
                  style={{ color: 'var(--color-brand, #4f46e5)' }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wider text-gray-500 bg-gray-50/50" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Product / Message</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                  {filtered.map(e => {
                    const statusStyle = statusStyles[e.status || 'NEW'];
                    return (
                      <tr 
                        key={e.id} 
                        onClick={() => openDetail(e)}
                        className="group hover:bg-gray-50/50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: 'var(--color-brand, #4f46e5)', color: 'white' }}>
                              {e.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 group-hover:text-[var(--color-brand)] transition-colors">{e.customerName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={14} className="text-gray-400" />
                              <span>{e.customerPhone}</span>
                            </div>
                            {e.customerEmail && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail size={14} className="text-gray-400" />
                                <span>{e.customerEmail}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-sm">
                          {(() => {
                            const info = getEnquiryProductsInfo(e);
                            if (info.isToken) {
                              return (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-slate-900 text-amber-300">
                                      {info.tokenCode}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                      Cart Order ({info.items.length} items)
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-900 line-clamp-1">
                                    {info.title}
                                  </p>
                                  {info.items.length > 1 && (
                                    <p className="text-[11px] text-slate-500 font-medium">
                                      + {info.items.length - 1} more items in order
                                    </p>
                                  )}
                                </div>
                              );
                            }
                            if ((e as any).product?.name) {
                              return (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                    <Package size={14} className="text-indigo-600" />
                                    <span className="truncate">{(e as any).product.name}</span>
                                  </div>
                                  {e.message && (
                                    <p className="text-xs text-slate-500 truncate">{e.message}</p>
                                  )}
                                </div>
                              );
                            }
                            return (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                  <Package size={14} className="text-slate-400" />
                                  <span>General Showroom Enquiry</span>
                                </div>
                                {e.message && (
                                  <p className="text-xs text-slate-500 truncate">{e.message}</p>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                            {(e.status || 'NEW').replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm text-gray-900">{new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          <div className="text-xs text-gray-500 mt-1">{timeAgo(e.createdAt)}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Side Drawer Backdrop */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Side Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 max-w-md w-full shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: 'var(--color-surface, #ffffff)', borderLeft: '1px solid var(--color-border, #e5e7eb)' }}
      >
        {selected && (
          <>
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50/50" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm" style={{ backgroundColor: 'var(--color-brand, #4f46e5)', color: 'white' }}>
                  {selected.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selected.customerName}</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> Enquiry received {timeAgo(selected.createdAt)}
                  </p>
                </div>
              </div>
              <button 
                onClick={closeDrawer}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Status Manager */}
              <div className="bg-gray-50 rounded-xl p-5 border" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity size={14} /> Pipeline Status
                </h3>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-white border rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none transition-all shadow-sm"
                    style={{ borderColor: 'var(--color-border, #e5e7eb)', color: 'var(--color-brand, #111827)' }}
                    value={selected.status || 'NEW'}
                    onChange={e => updateEnquiry(selected.id, { status: e.target.value as Enquiry['status'] })}
                    disabled={savingStatus}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User size={14} /> Contact Details
                </h3>
                <div className="space-y-3">
                  <a href={`tel:${selected.customerPhone}`} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors group" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <Phone size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="text-sm font-medium text-gray-900">{selected.customerPhone}</p>
                    </div>
                  </a>
                  {selected.customerEmail && (
                    <a href={`mailto:${selected.customerEmail}`} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors group" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                        <Mail size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-sm font-medium text-gray-900">{selected.customerEmail}</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Enquiry Content */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileText size={14} /> Enquiry Details &amp; Ordered Products
                </h3>
                {(() => {
                  const info = getEnquiryProductsInfo(selected);
                  if (info.isToken) {
                    return (
                      <div className="space-y-4">
                        {/* Token Banner */}
                        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm border border-indigo-900/40">
                          <div className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                              <Ticket size={14} /> {info.tokenCode}
                            </span>
                            <Link
                              to="/admin/orders"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-200 hover:text-white underline underline-offset-2"
                            >
                              Open in Orders Manager <ExternalLink size={12} />
                            </Link>
                          </div>
                          <p className="text-xs text-indigo-200">
                            Showroom Price Lock &amp; Cart Reservation
                          </p>
                        </div>

                        {/* Ordered Products List */}
                        <div className="bg-white border rounded-2xl overflow-hidden p-4 space-y-3" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                              <ShoppingBag size={14} className="text-indigo-600" />
                              <span>Ordered Products ({info.items.length})</span>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                              Cart Order
                            </span>
                          </div>
                          <div className="divide-y divide-slate-100">
                            {info.items.map((itemText, idx) => (
                              <div key={idx} className="py-2.5 flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                  {idx + 1}
                                </div>
                                <div className="text-xs font-semibold text-slate-800 leading-relaxed">
                                  {itemText}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Full Customer Order Message */}
                        {selected.message && (
                          <div className="bg-slate-50 border rounded-2xl p-4 text-xs text-slate-700" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                              Raw Order Notes &amp; Fulfillment Info
                            </p>
                            <p className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-600">
                              {selected.message}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Non-token standard enquiry
                  return (
                    <div className="bg-white border rounded-xl overflow-hidden" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                      {/* Product */}
                      <div className="p-4 border-b bg-gray-50/50 flex gap-3" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                        <Package size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Interested Product</p>
                          <p className="text-sm font-bold text-gray-900">
                            {(selected as any).product?.name || 'General Showroom Enquiry'}
                          </p>
                        </div>
                      </div>
                      {/* Message */}
                      {selected.message && (
                        <div className="p-4 flex gap-3">
                          <MessageCircle size={18} className="text-gray-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Customer Message</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calendar size={14} /> Timeline
                </h3>
                <div className="relative pl-4 border-l-2 ml-2 space-y-4" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: 'var(--color-brand, #4f46e5)' }}></div>
                    <p className="text-sm font-medium text-gray-900">Enquiry Received</p>
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(selected.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                  {selected.updatedAt && selected.updatedAt !== selected.createdAt && (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 bg-white border-gray-300"></div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(selected.updatedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Footer (Notes) */}
            <div className="p-4 border-t bg-gray-50" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Internal Notes & Follow-up
              </label>
              <textarea
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none resize-none shadow-sm mb-3"
                style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
                placeholder="Add private notes or next steps here..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <button
                onClick={() => updateEnquiry(selected.id, { notes })}
                disabled={savingStatus || notes === selected.notes}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--color-brand, #4f46e5)' }}
              >
                {savingStatus ? (
                  <><Activity size={16} className="animate-spin" /> Saving...</>
                ) : (
                  'Save Notes'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
