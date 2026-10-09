import { useState, useEffect } from 'react';
import {
  ShoppingBag, Search, Ticket, CheckCircle2, Clock,
  Calendar, Phone, Mail, MapPin, ExternalLink, Printer,
  User, Check, Copy, MessageSquare, AlertCircle, RefreshCw,
  Package, ChevronRight, X, ArrowUpRight, ShieldCheck, Tag
} from 'lucide-react';
import { purchaseTokenService, type PurchaseToken } from '../../services/purchaseTokenService';
import PurchaseTokenModal from '../../components/PurchaseTokenModal';

type FilterStatus = 'ALL' | 'ACTIVE' | 'REDEEMED' | 'EXPIRED';

export default function OrdersManager() {
  const [tokens, setTokens] = useState<PurchaseToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [selectedToken, setSelectedToken] = useState<PurchaseToken | null>(null);
  const [previewToken, setPreviewToken] = useState<PurchaseToken | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = () => {
    setLoading(true);
    const list = purchaseTokenService.getAllTokens();
    setTokens(list);
    setLoading(false);
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    showToast('success', `Copied token ${code} to clipboard`);
  };

  const handleStatusChange = (idOrCode: string, newStatus: 'ACTIVE' | 'REDEEMED' | 'EXPIRED') => {
    const updated = purchaseTokenService.updateTokenStatus(idOrCode, newStatus);
    if (updated) {
      loadTokens();
      if (selectedToken && selectedToken.id === updated.id) {
        setSelectedToken(updated);
      }
      showToast('success', `Token ${updated.tokenCode} marked as ${newStatus}`);
    }
  };

  const filteredTokens = tokens.filter(t => {
    const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const s = searchTerm.toLowerCase().trim();
    const matchSearch =
      !s ||
      t.tokenCode.toLowerCase().includes(s) ||
      t.customer.name.toLowerCase().includes(s) ||
      (t.customer.phone || '').includes(s) ||
      t.customer.email.toLowerCase().includes(s) ||
      t.items.some(i => i.name.toLowerCase().includes(s));
    return matchStatus && matchSearch;
  });

  // Calculate high-level KPIs
  const totalOrders = tokens.length;
  const activeOrders = tokens.filter(t => t.status === 'ACTIVE').length;
  const redeemedOrders = tokens.filter(t => t.status === 'REDEEMED').length;
  const totalReservedGmv = tokens.reduce((sum, t) => sum + (t.status === 'ACTIVE' ? t.totalAmount : 0), 0);
  const totalItemsCount = tokens.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-strong border text-xs font-bold transition-all ${
          toast.type === 'success' ? 'bg-slate-900 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-rose-500/40 text-rose-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertCircle size={16} className="text-rose-400" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live Commerce Ledger
            </span>
            <span className="text-xs text-slate-400">· {totalItemsCount} Products Reserved</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)] mt-1.5" style={{ fontFamily: 'var(--font-heading)' }}>
            Customer Orders &amp; Showroom Reservations
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Instantly view which specific products customers added to cart and locked prices for at the Jolva showroom.
          </p>
        </div>

        <button
          onClick={loadTokens}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
            Active Reserved GMV
          </span>
          <p className="text-2xl font-black text-slate-900">
            ₹{totalReservedGmv.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] font-medium text-emerald-600 mt-1 block">
            Locked for Jolva Showroom collection
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
            Active Token Passes
          </span>
          <p className="text-2xl font-black text-indigo-600">
            {activeOrders}
          </p>
          <span className="text-[11px] font-medium text-slate-500 mt-1 block">
            Awaiting store pickup / delivery
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
            Completed / Redeemed
          </span>
          <p className="text-2xl font-black text-emerald-600">
            {redeemedOrders}
          </p>
          <span className="text-[11px] font-medium text-slate-500 mt-1 block">
            Converted to showroom purchases
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
            Total Orders Created
          </span>
          <p className="text-2xl font-black text-slate-900">
            {totalOrders}
          </p>
          <span className="text-[11px] font-medium text-slate-500 mt-1 block">
            From web cart token generation
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-full border border-slate-200 overflow-x-auto">
          {[
            { label: 'All Orders', value: 'ALL' as FilterStatus, count: tokens.length },
            { label: 'Active', value: 'ACTIVE' as FilterStatus, count: activeOrders },
            { label: 'Redeemed', value: 'REDEEMED' as FilterStatus, count: redeemedOrders },
            { label: 'Expired', value: 'EXPIRED' as FilterStatus, count: tokens.filter(t => t.status === 'EXPIRED').length },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterStatus === tab.value
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterStatus === tab.value ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[280px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Token (SE-ZXYR...), Product, or Customer..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-full bg-white border border-slate-200 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Orders List / Cards */}
      {filteredTokens.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft">
          <Ticket size={36} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Orders Matching Filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or status filter to see customer showroom purchase tokens.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTokens.map(token => {
            const isCopied = copiedCode === token.tokenCode;
            const waUrl = purchaseTokenService.getWhatsAppShareUrl(token);
            const formattedDate = new Date(token.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            const formattedExpiry = new Date(token.expiresAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            });

            return (
              <div
                key={token.id}
                className="bg-white rounded-[2rem] border border-slate-200 shadow-soft hover:shadow-medium transition-all overflow-hidden p-5 sm:p-6"
              >
                {/* Top Strip: Token Code, Status, and Timing */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Token Code Pill */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 text-white font-mono font-black text-xs tracking-wider shadow-xs">
                      <Ticket size={13} className="text-amber-400" />
                      <span className="text-amber-300">{token.tokenCode}</span>
                      <button
                        onClick={() => handleCopyCode(token.tokenCode)}
                        className="hover:text-amber-300 transition-colors pl-1"
                        title="Copy token code"
                      >
                        {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>

                    {/* Status Badge */}
                    {token.status === 'ACTIVE' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active · Price Protected
                      </span>
                    )}
                    {token.status === 'REDEEMED' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        Redeemed / Purchased
                      </span>
                    )}
                    {token.status === 'EXPIRED' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        Expired
                      </span>
                    )}

                    {/* Fulfillment Method */}
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
                      {token.fulfillmentType === 'SHOWROOM_PICKUP' ? 'Store Pickup (Jolva)' : 'Doorstep Delivery'}
                    </span>
                  </div>

                  <div className="text-right text-xs text-slate-500 flex items-center gap-2">
                    <Clock size={13} className="text-slate-400" />
                    <span>Ordered: {formattedDate}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-amber-700 font-semibold">Valid till {formattedExpiry}</span>
                  </div>
                </div>

                {/* Middle Content: Customer Info & The EXACT Products Ordered */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-5 items-start">
                  
                  {/* Left (4 Cols): Customer Details */}
                  <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2 text-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                      Customer Profile
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        {token.customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 truncate">{token.customer.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{token.customer.email}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-slate-600">
                      {token.customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="text-emerald-600" />
                          <a href={`tel:${token.customer.phone}`} className="hover:underline font-bold text-slate-800">
                            {token.customer.phone}
                          </a>
                        </div>
                      )}
                      {token.customer.address && (
                        <div className="flex items-start gap-2 pt-0.5">
                          <MapPin size={13} className="text-indigo-600 mt-0.5 shrink-0" />
                          <span className="text-[11px] leading-snug">{token.customer.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right (8 Cols): EXACT PRODUCTS ORDERED (PROMINENT DISPLAY) */}
                  <div className="lg:col-span-8 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        Ordered Products ({token.items.length} items)
                      </span>
                      <span className="text-xs font-extrabold text-indigo-600">
                        Total: ₹{token.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Product Cards List */}
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                      {token.items.map((item, idx) => (
                        <div key={idx} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Product Image */}
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                              onError={e => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80';
                              }}
                            />
                            {/* Product Title and Quantity */}
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 line-clamp-1 text-sm hover:text-indigo-600">
                                {item.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-extrabold text-[10px]">
                                  Quantity: {item.quantity}
                                </span>
                                {item.sellingPrice && (
                                  <span className="text-slate-500 text-[11px]">
                                    Unit Price: ₹{item.sellingPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Line Total */}
                          <div className="text-right shrink-0">
                            <span className="font-extrabold text-slate-900 text-sm">
                              ₹{(item.sellingPrice * item.quantity).toLocaleString('en-IN')}
                            </span>
                            {item.mrp && item.mrp > item.sellingPrice && (
                              <span className="block text-[11px] line-through text-slate-400">
                                ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="font-bold text-slate-900">Payment:</span>
                    <span className="capitalize">{token.paymentPreference.replace(/_/g, ' ').toLowerCase()}</span>
                    {token.estimatedMonthlyEmi && (
                      <span className="text-indigo-600 font-bold">
                        (EMI ~₹{token.estimatedMonthlyEmi.toLocaleString('en-IN')}/mo)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* WhatsApp Customer */}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold transition-all shadow-xs"
                      title="Send WhatsApp confirmation to customer"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp Customer</span>
                    </a>

                    {/* View VIP Slip Modal */}
                    <button
                      onClick={() => setPreviewToken(token)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xs"
                    >
                      <Printer size={13} />
                      <span>View VIP Pass</span>
                    </button>

                    {/* Toggle Status (Mark as Redeemed / Collected) */}
                    {token.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleStatusChange(token.id, 'REDEEMED')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs"
                      >
                        <Check size={14} />
                        <span>Mark as Collected / Sold</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(token.id, 'ACTIVE')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold transition-colors"
                      >
                        Re-activate Token
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Customer VIP Voucher Modal Preview */}
      <PurchaseTokenModal
        token={previewToken}
        isOpen={!!previewToken}
        onClose={() => setPreviewToken(null)}
      />

    </div>
  );
}
