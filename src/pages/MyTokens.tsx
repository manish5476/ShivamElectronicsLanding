import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Clock, Copy, Check, MessageSquare, Printer,
  ShoppingBag, ArrowRight, ShieldCheck, ChevronRight, Search,
  Calendar, MapPin, User, LogIn
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { purchaseTokenService, type PurchaseToken } from '../services/purchaseTokenService';
import PurchaseTokenModal from '../components/PurchaseTokenModal';
import CustomerAuthModal from '../components/CustomerAuthModal';

export default function MyTokens() {
  const { customer, isCustomerLoggedIn } = useAuth();
  const [tokens, setTokens] = useState<PurchaseToken[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<PurchaseToken | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    loadTokens();
  }, [customer, isCustomerLoggedIn]);

  const loadTokens = () => {
    if (isCustomerLoggedIn && customer?.email) {
      const userTokens = purchaseTokenService.getUserTokens(customer.email, customer.id);
      setTokens(userTokens);
    } else {
      setTokens([]);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTokens = isCustomerLoggedIn
    ? tokens.filter(t => {
        if (!searchCode.trim()) return true;
        const q = searchCode.toLowerCase();
        return (
          t.tokenCode.toLowerCase().includes(q) ||
          t.items.some(i => i.name.toLowerCase().includes(q))
        );
      })
    : searchCode.trim().length >= 4
    ? purchaseTokenService.getAllTokens().filter(t => t.tokenCode.toLowerCase().includes(searchCode.toLowerCase().trim()))
    : [];

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 sm:py-16 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <ChevronRight size={13} />
            <span className="text-slate-800">My Showroom Tokens</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 mb-2">
                <Sparkles size={12} className="text-indigo-600" />
                Price Lock &amp; Reservation Desk
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                My Showroom Purchase Tokens
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Show these official vouchers at our Jolva flagship showroom to lock in your discounted prices and reserve stock for 7 days.
              </p>
            </div>

            {/* Auth / Profile Status */}
            <div className="flex items-center gap-3">
              {isCustomerLoggedIn && customer ? (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">{customer.name}</p>
                    <p className="text-[11px] text-slate-500">{customer.email}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <LogIn size={14} />
                  <span>Sign In to View Tokens</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search / Filter Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
              placeholder="Enter Token Code (e.g. SE-...) or search product..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-full bg-white border border-slate-200 focus:outline-none focus:border-indigo-600 shadow-xs transition-colors"
            />
          </div>
        </div>

        {/* Tokens List */}
        {filteredTokens.length === 0 ? (
          <div className="p-12 text-center rounded-[2.5rem] bg-white border border-slate-200 shadow-soft">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {!isCustomerLoggedIn && !searchCode
                ? 'Sign in to access your purchase tokens'
                : searchCode
                ? 'No matching tokens found'
                : 'No purchase tokens created yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              {!isCustomerLoggedIn && !searchCode
                ? 'Sign in with your customer account to see all your active and redeemed showroom price lock tokens, or enter your token code above.'
                : 'Browse our collections, add your preferred appliances or electronics to your cart, and click "Generate Showroom Token" to lock in festival offers.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!isCustomerLoggedIn ? (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-indigo-600 shadow-md transition-all"
                >
                  <User size={14} />
                  <span>Sign In to Account</span>
                </button>
              ) : null}
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md transition-all"
              >
                <span>Browse Products</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTokens.map(tok => {
              const waUrl = purchaseTokenService.getWhatsAppShareUrl(tok);
              const isExpired = new Date(tok.expiresAt).getTime() < Date.now();
              const createdDate = new Date(tok.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
              const expiryDate = new Date(tok.expiresAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={tok.id}
                  className="bg-white rounded-[2rem] border border-slate-200/90 shadow-soft overflow-hidden hover:shadow-medium transition-shadow"
                >
                  {/* Card Header Strip */}
                  <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base sm:text-lg font-black tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-3 py-1 rounded-xl">
                          {tok.tokenCode}
                        </span>
                        <button
                          onClick={() => handleCopyCode(tok.tokenCode, tok.id)}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 flex items-center justify-center transition-colors"
                          title="Copy Token Code"
                        >
                          {copiedId === tok.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>
                      </div>

                      {/* Status */}
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isExpired
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isExpired ? 'Expired' : 'Active 7-Day Lock'}
                      </span>

                      <span className="text-[11px] text-slate-500 font-medium">
                        Fulfillment: <strong>{tok.fulfillmentType === 'SHOWROOM_PICKUP' ? 'Showroom Pickup (Jolva)' : 'Doorstep Delivery'}</strong>
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">Created on {createdDate}</p>
                      <p className="text-[11px] font-semibold text-slate-600">Valid until {expiryDate}</p>
                    </div>
                  </div>

                  {/* Reserved Items Grid */}
                  <div className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                      {tok.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-contain bg-white p-1 border border-slate-200/60 flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              Qty: {item.quantity} × ₹{item.sellingPrice.toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs font-extrabold text-indigo-700 mt-0.5">
                              ₹{(item.sellingPrice * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary & Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-slate-500">Locked Price:</span>
                          <span className="text-xl sm:text-2xl font-black text-slate-900">
                            ₹{tok.totalAmount.toLocaleString('en-IN')}
                          </span>
                          {tok.totalSavings > 0 && (
                            <span className="text-xs font-extrabold text-emerald-600">
                              (Saved ₹{tok.totalSavings.toLocaleString('en-IN')})
                            </span>
                          )}
                        </div>
                        {tok.estimatedMonthlyEmi && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            0% EMI option available from <strong>₹{tok.estimatedMonthlyEmi.toLocaleString('en-IN')}/mo</strong>
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all shadow-xs"
                        >
                          <MessageSquare size={14} />
                          <span>WhatsApp to Showroom</span>
                        </a>

                        <button
                          onClick={() => setSelectedToken(tok)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
                        >
                          <Printer size={14} />
                          <span>View Official Slip</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Official Voucher / Print Modal */}
      <PurchaseTokenModal
        isOpen={Boolean(selectedToken)}
        token={selectedToken}
        onClose={() => setSelectedToken(null)}
      />

      {/* Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          loadTokens();
        }}
      />
    </div>
  );
}
