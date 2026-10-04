import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Booking, BookingStatus, BookingType } from '../types/business';
import type { ApiResponse } from '../types/electronics';

const STORAGE_KEY = 'shivam_bookings_v1';

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    customerName: 'Vivek Upadhyay',
    customerPhone: '+91 99360 11223',
    customerEmail: 'vivek.u@example.com',
    productName: 'Sony Bravia 55" XR OLED 4K TV',
    bookingType: 'DEMONSTRATION',
    requestedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    requestedTime: '04:00 PM',
    message: 'Want side-by-side sound and picture comparison with Samsung QLED.',
    status: 'CONFIRMED',
    assignedTo: 'Vikram (Lead Sales)',
    internalNotes: 'Client visiting with family. Keep demo booth 2 ready.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'book-2',
    customerName: 'Sunita Mishra',
    customerPhone: '+91 94500 88990',
    customerEmail: 'sunita.m@example.com',
    productName: 'Solid Teak Wood 6-Seater Dining Table',
    bookingType: 'FURNITURE_CONSULTATION',
    requestedDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    requestedTime: '12:30 PM',
    message: 'Need advice on custom wood polish matching existing interior decor.',
    status: 'REQUESTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'book-3',
    customerName: 'Rahul Seth',
    customerPhone: '+91 98380 44556',
    bookingType: 'SHOWROOM_VISIT',
    requestedDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    requestedTime: '06:00 PM',
    message: 'Looking for full package home appliances for new residence.',
    status: 'REQUESTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const bookingsApi = {
  async getBookings(filter?: { status?: BookingStatus; bookingType?: BookingType }): Promise<ApiResponse<Booking[]>> {
    let list: Booking[] = [...DEFAULT_BOOKINGS];
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        list = JSON.parse(cached);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
    } catch (e) {
      // ignore
    }

    if (!isSupabaseConfigured()) {
      let filtered = [...list];
      if (filter?.status) filtered = filtered.filter(b => b.status === filter.status);
      if (filter?.bookingType) filtered = filtered.filter(b => b.bookingType === filter.bookingType);
      return { success: true, data: filtered };
    }

    try {
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (filter?.status) query = query.eq('status', filter.status);
      if (filter?.bookingType) query = query.eq('booking_type', filter.bookingType);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const mapped: Booking[] = data.map((d: any) => ({
          id: d.id,
          customerId: d.customer_id,
          customerName: d.customer_name,
          customerPhone: d.customer_phone,
          customerEmail: d.customer_email,
          productId: d.product_id,
          productName: d.product_name,
          categoryId: d.category_id,
          bookingType: d.booking_type || 'SHOWROOM_VISIT',
          requestedDate: d.requested_date,
          requestedTime: d.requested_time,
          alternateDate: d.alternate_date,
          alternateTime: d.alternate_time,
          message: d.message,
          status: d.status || 'REQUESTED',
          assignedTo: d.assigned_to,
          internalNotes: d.internal_notes,
          createdAt: d.created_at || new Date().toISOString(),
          updatedAt: d.updated_at || new Date().toISOString(),
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        return { success: true, data: mapped };
      }
    } catch (e) {
      // fallback
    }

    let filtered = [...list];
    if (filter?.status) filtered = filtered.filter(b => b.status === filter.status);
    if (filter?.bookingType) filtered = filtered.filter(b => b.bookingType === filter.bookingType);
    return { success: true, data: filtered };
  },

  async createBooking(booking: Partial<Booking>): Promise<ApiResponse<Booking>> {
    const newBooking: Booking = {
      id: booking.id || `book-${Date.now()}`,
      customerId: booking.customerId,
      customerName: booking.customerName || 'Valued Customer',
      customerPhone: booking.customerPhone || '',
      customerEmail: booking.customerEmail,
      productId: booking.productId,
      productName: booking.productName,
      categoryId: booking.categoryId,
      bookingType: booking.bookingType || 'SHOWROOM_VISIT',
      requestedDate: booking.requestedDate || new Date().toISOString().split('T')[0],
      requestedTime: booking.requestedTime || '11:00 AM',
      alternateDate: booking.alternateDate,
      alternateTime: booking.alternateTime,
      message: booking.message,
      status: 'REQUESTED',
      assignedTo: booking.assignedTo,
      internalNotes: booking.internalNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update local storage
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      const list: Booking[] = cached ? JSON.parse(cached) : DEFAULT_BOOKINGS;
      list.unshift(newBooking);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .insert({
            customer_id: newBooking.customerId,
            customer_name: newBooking.customerName,
            customer_phone: newBooking.customerPhone,
            customer_email: newBooking.customerEmail,
            product_id: newBooking.productId,
            product_name: newBooking.productName,
            category_id: newBooking.categoryId,
            booking_type: newBooking.bookingType,
            requested_date: newBooking.requestedDate,
            requested_time: newBooking.requestedTime,
            alternate_date: newBooking.alternateDate,
            alternate_time: newBooking.alternateTime,
            message: newBooking.message,
            status: newBooking.status,
          })
          .select()
          .maybeSingle();

        if (!error && data) {
          newBooking.id = data.id;
        }
      } catch (e) {
        // ignore
      }
    }

    return { success: true, data: newBooking };
  },

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
    notes?: string,
    assignedTo?: string
  ): Promise<ApiResponse<Booking>> {
    let updatedBooking: Booking | null = null;
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      let list: Booking[] = cached ? JSON.parse(cached) : DEFAULT_BOOKINGS;
      list = list.map(b => {
        if (b.id === id) {
          updatedBooking = {
            ...b,
            status,
            internalNotes: notes !== undefined ? notes : b.internalNotes,
            assignedTo: assignedTo !== undefined ? assignedTo : b.assignedTo,
            updatedAt: new Date().toISOString(),
          };
          return updatedBooking;
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    if (isSupabaseConfigured()) {
      try {
        const payload: Record<string, any> = {
          status,
          updated_at: new Date().toISOString(),
        };
        if (notes !== undefined) payload.internal_notes = notes;
        if (assignedTo !== undefined) payload.assigned_to = assignedTo;

        await supabase.from('bookings').update(payload).eq('id', id);
      } catch (e) {
        // ignore
      }
    }

    if (updatedBooking) {
      return { success: true, data: updatedBooking };
    }
    return { success: false, error: 'Booking not found' };
  },
};
