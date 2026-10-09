import { useState } from 'react';
import {
  X, Check, Copy, Printer, MessageSquare, ShieldCheck,
  Calendar, MapPin, Sparkles, ExternalLink, QrCode, Ticket
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      
      {/* Click outside backdrop detector */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-lg my-auto max-h-[92vh] flex flex-col rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_25px_70px_rgba(0,0,0,0.6)] border border-slate-700/60 bg-[#0B0F19] text-slate-100 overflow-hidden">
        
        {/* Floating Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all z-30 shadow-sm"
          aria-label="Close VIP reservation pass"
        >
          <X size={17} />
        </button>

        {/* ── Top Obsidian & Gold VIP Pass Header ────────────────── */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-br from-slate-950 via-[#131B2E] to-slate-900 border-b border-dashed border-slate-700/80 shrink-0">
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Authentic Perforated Ticket Notches */}
          <div className="absolute -bottom-3.5 -left-3.5 w-7 h-7 rounded-full bg-slate-950 border border-slate-700/60 z-20 pointer-events-none" />
          <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-slate-950 border border-slate-700/60 z-20 pointer-events-none" />

          {/* Badges Strip */}
          <div className="relative z-10 flex items-center gap-2 mb-2.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/15 border border-amber-400/30 flex items-center gap-1.5 shadow-xs">
              <Sparkles size={11} className="text-amber-400" />
              VIP SHOWROOM PASS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-emerald-300 bg-emerald-950/70 border border-emerald-400/30">
              7-Day Price Lock Active
            </span>
          </div>

          <h3
            className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1 pr-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Shivam Electronics Flagship Reservation
          </h3>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            Your price is locked for 7 days at our Jolva Showroom. Present this code at the billing counter or confirm via WhatsApp.
          </p>

          {/* Luxury Token Code Display Capsule */}
          <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-amber-400/30 flex items-center justify-between gap-3 shadow-inner">
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300/80 block mb-0.5">
                SHOWROOM TOKEN CODE
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wider font-mono">
                {token.tokenCode}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
              title="Copy Token Code"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-slate-950 stroke-[3]" />
                  <span>Copied!</span>
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

        {/* ── Scrollable Pass Body (Zero Viewport Cutoff) ───────── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Customer & Fulfillment Info */}
          <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer</span>
              <p className="font-extrabold text-white mt-0.5 truncate">{token.customer.name}</p>
              {token.customer.phone && <p className="text-slate-400 text-[11px] mt-0.5">{token.customer.phone}</p>}
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fulfillment</span>
              <p className="font-extrabold text-white mt-0.5">
                {token.fulfillmentType === 'SHOWROOM_PICKUP' ? 'Showroom Pickup (Jolva)' : 'Doorstep Delivery'}
              </p>
              <p className="text-amber-300/90 text-[11px] mt-0.5 flex items-center gap-1 font-semibold">
                <Calendar size={11} /> Valid till: {formattedExpiry}
              </p>
            </div>
          </div>

          {/* Reserved Items List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Reserved Showroom Items ({token.items.length})
              </h4>
              <span className="text-[10px] text-emerald-400 font-bold">Price Protected</span>
            </div>
            
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60">
              {token.items.map((item, i) => (
                <div key={i} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-11 h-11 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80';
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-white line-clamp-1">{item.name}</p>
                      <span className="text-slate-400 text-[11px]">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-white">
                      ₹{(item.sellingPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                    {item.mrp && item.mrp > item.sellingPrice && (
                      <span className="block text-[10px] line-through text-slate-500">
                        ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown Capsule */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Total MRP Value</span>
              <span className="line-through">₹{token.totalMrp.toLocaleString('en-IN')}</span>
            </div>
            {token.totalSavings > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Total Showroom Discount</span>
                <span>- ₹{token.totalSavings.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-indigo-900/60 flex justify-between items-baseline">
              <span className="font-bold text-white">Final Locked Price:</span>
              <span className="text-xl font-black text-amber-300">
                ₹{token.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            {token.estimatedMonthlyEmi && (
              <p className="text-[11px] font-semibold text-indigo-300 pt-1">
                ✦ 0% No-Cost EMI: ~₹{token.estimatedMonthlyEmi.toLocaleString('en-IN')}/month
              </p>
            )}
          </div>

          {/* Store Location Stamp */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
            <MapPin size={15} className="text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-slate-200">Shivam Electronics Showroom</p>
              <p className="text-[11px] text-slate-400">
                Shop F-8, JB Shopping Center, Kadodara-Bardoli Road, Jolva (Gujarat) · Ph: +91 95742 19663
              </p>
            </div>
          </div>

        </div>

        {/* ── Fixed Bottom Action Suite ────────────────────────── */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800/80 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <MessageSquare size={16} />
              <span>Send to WhatsApp</span>
            </a>

            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/10 active:scale-95"
            >
              <Printer size={16} />
              <span>Print / Save Pass</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
