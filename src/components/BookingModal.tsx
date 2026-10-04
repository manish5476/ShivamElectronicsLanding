import { useState } from 'react';
import { X, Check, Calendar, Clock, User, Phone, Mail, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingsApi } from '../services/bookingsApi';
import type { BookingType } from '../types/business';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillProduct?: {
    id: string;
    name: string;
  };
}

export default function BookingModal({ isOpen, onClose, prefillProduct }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    bookingType: 'SHOWROOM_VISIT' as BookingType,
    requestedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    requestedTime: '11:00 AM',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone) {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    const res = await bookingsApi.createBooking({
      customerName: formData.customerName,
      customerEmail: formData.email || undefined,
      customerPhone: formData.phone,
      productId: prefillProduct?.id,
      productName: prefillProduct?.name,
      bookingType: formData.bookingType,
      requestedDate: formData.requestedDate,
      requestedTime: formData.requestedTime,
      message: formData.notes,
    });
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 3500);
    } else {
      setError('Could not submit booking request. Please call our showroom directly.');
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Soft Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[100] w-full md:max-w-xl bg-[var(--color-surface)]/95 backdrop-blur-xl shadow-strong rounded-t-[2.5rem] md:rounded-[2.5rem] max-h-[90vh] overflow-y-auto border border-white/60 p-7 sm:p-10"
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Showroom Visit Booked!
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto leading-relaxed mb-6">
                  Thank you, {formData.customerName}. Our showroom manager will confirm your appointment slot and prepare the demonstration booth.
                </p>
                <button
                  onClick={handleClose}
                  className="btn btn-primary py-2.5 px-6 text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--color-border)]">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-accent)] block mb-1">
                      Showroom Concierge
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                      Schedule Visit or Live Demo
                    </h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {prefillProduct && (
                  <div className="glass-pill p-3 rounded-2xl mb-5 flex items-center gap-2.5 text-xs font-bold text-[var(--color-text)]">
                    <Sparkles size={14} className="text-[var(--color-accent)]" />
                    <span>Product for Demo: {prefillProduct.name}</span>
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
                        placeholder="e.g. Alok Verma"
                        className="w-full px-4 py-2.5 rounded-full glass-input text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 00000"
                        className="w-full px-4 py-2.5 rounded-full glass-input text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                        Appointment Type *
                      </label>
                      <select
                        name="bookingType"
                        value={formData.bookingType}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-full glass-input text-xs font-bold"
                      >
                        <option value="SHOWROOM_VISIT">General Showroom Visit</option>
                        <option value="DEMONSTRATION">Live TV / Audio Demonstration</option>
                        <option value="FURNITURE_CONSULTATION">Solid Wood Furniture Consultation</option>
                        <option value="PRODUCT_CONSULTATION">Home Appliance Package Planning</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 rounded-full glass-input text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="requestedDate"
                        required
                        value={formData.requestedDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-full glass-input text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                        Time Slot *
                      </label>
                      <select
                        name="requestedTime"
                        value={formData.requestedTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-full glass-input text-xs font-semibold"
                      >
                        <option value="11:00 AM">Morning (11:00 AM – 01:00 PM)</option>
                        <option value="03:00 PM">Afternoon (03:00 PM – 05:00 PM)</option>
                        <option value="06:00 PM">Evening (06:00 PM – 08:30 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                      Notes or Specific Models to Compare
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="e.g. Side-by-side comparison of OLED vs QLED, or dining table wood polish options..."
                      className="w-full p-4 rounded-2xl glass-input text-xs font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3.5 text-xs font-bold shadow-md hover:scale-[1.01] transition-transform disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : <><Calendar size={14} /> Confirm Appointment Request</>}
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
