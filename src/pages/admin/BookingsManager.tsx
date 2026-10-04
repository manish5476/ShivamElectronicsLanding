import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Check, X, Phone, Mail, 
  User, Eye, Search, Filter, RefreshCw, MessageSquare
} from 'lucide-react';
import { bookingsApi } from '../../services/bookingsApi';
import type { Booking, BookingStatus, BookingType } from '../../types/business';

const STATUS_TABS: { label: string; value: BookingStatus | 'ALL' }[] = [
  { label: 'All Requests', value: 'ALL' },
  { label: 'Requested', value: 'REQUESTED' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const res = await bookingsApi.getBookings();
    if (res.data) setBookings(res.data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    await bookingsApi.updateBookingStatus(id, newStatus, internalNote || undefined, assignedStaff || undefined);
    await loadBookings();
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleOpenDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setInternalNote(booking.internalNotes || '');
    setAssignedStaff(booking.assignedTo || '');
  };

  const filteredBookings = bookings.filter(b => {
    const matchStatus = selectedStatus === 'ALL' || b.status === selectedStatus;
    const matchSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.includes(searchTerm) ||
      (b.productName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'REQUESTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">Pending Review</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">Confirmed Appointment</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">Visit Completed</span>;
      case 'CANCELLED':
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gray-50 text-gray-700">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[var(--color-brand)] mb-3" />
        <p className="text-sm font-medium text-[var(--color-text-muted)]">Loading Showroom Bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-brand)] block mb-1">
            Showroom CRM & Appointments
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Showroom Visits & Demos
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Manage customer appointment requests for live product demonstrations, TV side-by-side tests, and furniture consultations.
          </p>
        </div>

        <button
          onClick={() => loadBookings()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-[var(--color-border)] hover:bg-[var(--color-surface-soft)] transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Status Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-px">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                selectedStatus === tab.value
                  ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab.label}
              {tab.value !== 'ALL' && (
                <span className="ml-1.5 opacity-70">
                  ({bookings.filter(b => b.status === tab.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search customer, phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-brand)]"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-text-muted)] text-xs">
            No bookings found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-surface-soft)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Requested Schedule</th>
                  <th className="py-3 px-4">Interest / Product</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] font-medium">
                {filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-[var(--color-surface-soft)]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[var(--color-text)]">
                      {b.customerName}
                      <span className="block text-[10px] text-[var(--color-text-muted)] font-normal">
                        {b.customerPhone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text)] font-semibold">
                      {b.bookingType.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-muted)]">
                      <div className="flex items-center gap-1 text-[var(--color-text)] font-bold">
                        <Calendar size={12} /> {b.requestedDate}
                      </div>
                      <div className="flex items-center gap-1 text-[10px]">
                        <Clock size={11} /> {b.requestedTime}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-muted)] max-w-xs truncate">
                      {b.productName || 'General Consultation'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(b)}
                        className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[11px] font-bold hover:bg-[var(--color-surface-soft)] transition-colors"
                      >
                        View & Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Action Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] w-full max-w-lg rounded-2xl border border-[var(--color-border)] shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-brand)]">
                  Appointment Details
                </span>
                <h3 className="text-base font-bold text-[var(--color-text)]">
                  {selectedBooking.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                <div>
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase block">Phone</span>
                  <a href={`tel:${selectedBooking.customerPhone}`} className="font-bold text-[var(--color-brand)] hover:underline">
                    {selectedBooking.customerPhone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase block">Email</span>
                  <span>{selectedBooking.customerEmail || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase block">Date & Time</span>
                  <span className="font-bold">{selectedBooking.requestedDate} @ {selectedBooking.requestedTime}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase block">Booking Type</span>
                  <span className="font-semibold">{selectedBooking.bookingType}</span>
                </div>
              </div>

              {selectedBooking.message && (
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[var(--color-text-muted)] block mb-1">
                    Customer Message / Requirements:
                  </span>
                  <p className="p-3 rounded-xl bg-[var(--color-surface-soft)] text-xs leading-relaxed text-[var(--color-text)]">
                    {selectedBooking.message}
                  </p>
                </div>
              )}

              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] text-[var(--color-text-muted)] mb-1">
                  Assigned Showroom Executive
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikram (Showroom Floor Lead)"
                  value={assignedStaff}
                  onChange={e => setAssignedStaff(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] text-[var(--color-text-muted)] mb-1">
                  Internal Staff Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Add notes about booth preparation, TV comparison, or quote offered..."
                  value={internalNote}
                  onChange={e => setInternalNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                />
              </div>

              <div className="pt-3 border-t border-[var(--color-border)]">
                <span className="font-bold uppercase tracking-wider text-[10px] text-[var(--color-text-muted)] block mb-2">
                  Update Booking Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'CONFIRMED')}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
                  >
                    Confirm Visit
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'COMPLETED')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'CANCELLED')}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
