import { useState } from 'react';
import {
  X, Trash2, Plus, Minus, ShoppingBag, ArrowRight,
  ShieldCheck, Sparkles, MapPin, Truck, CheckCircle2, Lock
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { purchaseTokenService, type PurchaseToken } from '../services/purchaseTokenService';
import CustomerAuthModal from './CustomerAuthModal';
import PurchaseTokenModal from './PurchaseTokenModal';

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    totalMrp,
    totalSavings,
    estimatedMonthlyEmi,
  } = useCart();

  const { customer, isCustomerLoggedIn } = useAuth();

  const [fulfillmentType, setFulfillmentType] = useState<'SHOWROOM_PICKUP' | 'DOORSTEP_DELIVERY'>('SHOWROOM_PICKUP');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [issuedToken, setIssuedToken] = useState<PurchaseToken | null>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isCartDrawerOpen && !isTokenModalOpen && !isAuthModalOpen) return null;

  const handleGenerateToken = async () => {
    setErrorMsg(null);

    // If user is not logged in, prompt them to login/create account first
    if (!isCustomerLoggedIn || !customer) {
      setIsAuthModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await purchaseTokenService.createToken({
        customer,
        items,
        totalAmount: totalPrice,
        totalMrp,
        totalSavings,
        estimatedMonthlyEmi,
        fulfillmentType,
        paymentPreference: 'PAY_AT_SHOWROOM',
        deliveryAddress: fulfillmentType === 'DOORSTEP_DELIVERY' ? deliveryAddress : undefined,
      });

      if (res.success && res.token) {
        setIssuedToken(res.token);
        clearCart();
        closeCart();
        setIsTokenModalOpen(true);
      } else {
        setErrorMsg(res.error || 'Failed to generate purchase token');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error creating purchase token');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isCartDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={closeCart}
          />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Showroom Cart</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Items Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4">
                <ShoppingBag size={28} />
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-1">Your Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Explore our authentic 4K televisions, inverter refrigeration, and handcrafted teakwood furniture.
              </p>
              <button
                onClick={closeCart}
                className="btn btn-primary py-2.5 px-6 text-xs font-bold"
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.productId} className="pt-3.5 first:pt-0 flex items-center gap-3.5">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                      {item.name}
                    </h5>

                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-black text-sm text-slate-900">
                        ₹{item.sellingPrice.toLocaleString('en-IN')}
                      </span>
                      {item.mrp && item.mrp > item.sellingPrice && (
                        <span className="text-[10px] line-through text-slate-400">
                          ₹{item.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 text-slate-600"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-2 font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 text-slate-600"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Fulfillment Option */}
              <div className="pt-4 space-y-3">
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Select Showroom Fulfillment
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('SHOWROOM_PICKUP')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      fulfillmentType === 'SHOWROOM_PICKUP'
                        ? 'border-indigo-600 bg-indigo-50/60 font-bold text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin size={14} className="mb-1 text-indigo-600" />
                    <p className="leading-tight">Pickup in Jolva</p>
                    <span className="text-[10px] font-normal text-slate-500">Free Showroom Demo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType('DOORSTEP_DELIVERY')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      fulfillmentType === 'DOORSTEP_DELIVERY'
                        ? 'border-indigo-600 bg-indigo-50/60 font-bold text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Truck size={14} className="mb-1 text-emerald-600" />
                    <p className="leading-tight">Home Delivery</p>
                    <span className="text-[10px] font-normal text-slate-500">Free in Jolva &amp; Surat</span>
                  </button>
                </div>

                {fulfillmentType === 'DOORSTEP_DELIVERY' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Delivery Address / Village (Surat District)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Jolva Bridge, Kadodara Road"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Strip */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-slate-200 bg-slate-50/90 space-y-3.5">
            {/* Price Breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Showroom Savings</span>
                  <span>- ₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm text-slate-900">
                <span>Total Amount:</span>
                <span className="text-xl font-black text-slate-900">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              {estimatedMonthlyEmi && (
                <p className="text-[11px] font-semibold text-indigo-700 pt-0.5">
                  ✦ 0% No-Cost EMI: ~₹{estimatedMonthlyEmi.toLocaleString('en-IN')}/month
                </p>
              )}
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            {/* Authenticated Customer Status Badge */}
            {isCustomerLoggedIn && customer ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>Logged in as <b>{customer.name}</b></span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold uppercase">Ready</span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <Lock size={13} className="text-amber-600 shrink-0" />
                <span>Login or create an account to issue your purchase token.</span>
              </div>
            )}

            {/* Main Action Button */}
            <button
              onClick={handleGenerateToken}
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isCustomerLoggedIn ? (
                <>
                  <Sparkles size={14} className="text-amber-300" />
                  <span>Generate Purchase Token</span>
                  <ArrowRight size={14} />
                </>
              ) : (
                <>
                  <span>Sign In &amp; Generate Token</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        )}

      </div>
        </>
      )}

      {/* Nested Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          // User is now logged in, can generate token immediately
        }}
      />

      {/* Nested Purchase Token Modal */}
      <PurchaseTokenModal
        isOpen={isTokenModalOpen}
        token={issuedToken}
        onClose={() => {
          setIsTokenModalOpen(false);
          setIssuedToken(null);
        }}
      />
    </>
  );
}
