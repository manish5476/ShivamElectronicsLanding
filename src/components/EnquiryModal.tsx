import { useState, useEffect } from 'react';
import { X, Send, CheckCircle, Package, Phone, Mail, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { enquiriesApi } from '../services/electronicsApi';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillProduct?: {
    id: string;
    name: string;
    sku?: string;
  };
}

export default function EnquiryModal({ isOpen, onClose, prefillProduct }: EnquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    message: '',
    quantity: '1',
  });

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setError('');
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone) {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    const res = await enquiriesApi.create({
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      productId: prefillProduct?.id,
      enquiryType: prefillProduct ? 'PRODUCT' : 'GENERAL',
      message: formData.message,
      quantity: parseInt(formData.quantity) || 1,
    });
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setFormData({ customerName: '', customerEmail: '', customerPhone: '', message: '', quantity: '1' });
      }, 3000);
    } else {
      setError('Failed to submit enquiry. Please try again or call us directly.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Soft Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
            onClick={onClose}
          />
          {/* Curved Glass Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: '100%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '100%', scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:max-w-xl md:w-full bg-[var(--color-surface)]/95 backdrop-blur-xl shadow-strong rounded-t-[2.5rem] md:rounded-[2.5rem] max-h-[90vh] overflow-y-auto border border-white/60"
          >
            {submitted ? (
              <div className="p-10 sm:p-14 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-5 border border-emerald-200">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] tracking-tight mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Enquiry Received
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mb-6 max-w-sm mx-auto leading-relaxed">
                  Thank you, {formData.customerName}. Our showroom sales specialists will call or WhatsApp you shortly.
                </p>
                <button
                  onClick={onClose}
                  className="btn btn-primary py-2.5 px-6 text-xs font-bold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="p-7 sm:p-10">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--color-border)]">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-accent)] block mb-1">
                      Direct Showroom Desk
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {prefillProduct ? 'Product Price Enquiry' : 'General Showroom Enquiry'}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Prefill Product Glass Pill */}
                {prefillProduct && (
                  <div className="glass-pill p-3.5 rounded-2xl mb-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                      <Package size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[var(--color-text)] truncate">{prefillProduct.name}</p>
                      {prefillProduct.sku && (
                        <p className="text-[10px] text-[var(--color-text-muted)] font-mono">Model: {prefillProduct.sku}</p>
                      )}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-5">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        required
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Ramesh Patel"
                        className="w-full px-4 py-2.5 rounded-full glass-input text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        required
                        value={formData.customerPhone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-full glass-input text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-full glass-input text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                      Enquiry Details / Requirements
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Ask about current festive cashbacks, brand warranty, delivery timeline, or payment options..."
                      className="w-full p-4 rounded-2xl glass-input text-xs font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3.5 text-xs font-bold shadow-md hover:scale-[1.01] transition-transform disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : <><Send size={13} /> Send Showroom Enquiry</>}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
