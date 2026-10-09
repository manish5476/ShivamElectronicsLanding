import { useState } from 'react';
import {
  X, Check, Copy, Printer, MessageSquare, ShieldCheck,
  Calendar, MapPin, Sparkles, ExternalLink, QrCode
} from 'lucide-react';
import type { PurchaseToken } from '../services/purchaseTokenService';
import { purchaseTokenService } from '../services/purchaseTokenService';

interface Props {
  token: PurchaseToken | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseTokenModal({ token, isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !token) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(token.tokenCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const waUrl = purchaseTokenService.getWhatsAppShareUrl(token);

  const formattedDate = new Date(token.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedExpiry = new Date(token.expiresAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl my-8 bg-white rounded-[2.2rem] sm:rounded-[2.6rem] shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        
        {/* Top Metallic Gold/Indigo Header Band */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close token voucher"
          >
            <X size={16} />
          </button>

          <div className="relative z-10 flex items-center gap-2 mb-3">
            <span className="glass-pill px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-white/10 border border-amber-300/30 flex items-center gap-1.5">
              <Sparkles size={11} className="text-amber-400" />
              OFFICIAL SHOWROOM PURCHASE TOKEN
            </span>
            <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-400/30">
              Active &amp; Reserved
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Shivam Electronics Flagship Reservation
          </h3>
          <p className="text-xs text-slate-300 max-w-md">
            Your price is locked for 7 days at our Jolva Showroom. Present this token at checkout or confirm via WhatsApp.
          </p>

          {/* Token Box */}
          <div className="mt-5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300 block mb-0.5">
                SHOWROOM TOKEN CODE
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wider font-mono">
                {token.tokenCode}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Voucher Body (Printable Area) */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Customer & Fulfillment Info */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer</span>
              <p className="font-bold text-slate-900 mt-0.5">{token.customer.name}</p>
              {token.customer.phone && <p className="text-slate-600 mt-0.5">{token.customer.phone}</p>}
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fulfillment</span>
              <p className="font-bold text-slate-900 mt-0.5">
                {token.fulfillmentType === 'SHOWROOM_PICKUP' ? 'Showroom Pickup (Jolva)' : 'Doorstep Delivery'}
              </p>
              <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                <Calendar size={11} /> Valid till: {formattedExpiry}
              </p>
            </div>
          </div>

          {/* Reserved Items List */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
              Reserved Showroom Items ({token.items.length})
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
              {token.items.map((item, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                      <span className="text-slate-500 text-[11px]">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-slate-900">
                      ₹{(item.sellingPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                    {item.mrp && item.mrp > item.sellingPrice && (
                      <span className="block text-[10px] line-through text-slate-400">
                        ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Totals */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Total MRP Value</span>
              <span className="line-through">₹{token.totalMrp.toLocaleString('en-IN')}</span>
            </div>
            {token.totalSavings > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Total Showroom Discount</span>
                <span>- ₹{token.totalSavings.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-indigo-200/60 flex justify-between items-baseline">
              <span className="font-bold text-slate-900">Final Locked Price:</span>
              <span className="text-xl font-black text-indigo-900">
                ₹{token.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            {token.estimatedMonthlyEmi && (
              <p className="text-[11px] font-semibold text-indigo-700 pt-1">
                ✦ 0% No-Cost EMI: ~₹{token.estimatedMonthlyEmi.toLocaleString('en-IN')}/month
              </p>
            )}
          </div>

          {/* Store Location Stamp */}
          <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <MapPin size={15} className="text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-slate-800">Shivam Electronics Jolva</p>
              <p className="text-[11px] text-slate-500">
                Shop F-8, JB Shopping Center, Kadodara-Bardoli Road, Jolva (Gujarat) · Ph: +91 95742 19663
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageSquare size={16} />
              <span>Send to WhatsApp</span>
            </a>

            <button
              onClick={handlePrint}
              className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Printer size={16} />
              <span>Print Token Slip</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
