import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Customer } from '../types/business';
import type { ApiResponse } from '../types/electronics';

const STORAGE_KEY = 'shivam_customers_crm_v1';

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rajesh Kumar Patel',
    phone: '+91 98251 23456',
    email: 'rajesh.patel@example.com',
    city: 'Jolva, Surat',
    state: 'Gujarat',
    address: 'Near Panchratna Residency, Kadodara Road, Jolva',
    notes: 'Interested in 55-inch Sony Bravia OLED and Haier side-by-side refrigerator.',
    source: 'SHOWROOM_VISIT',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'cust-2',
    name: 'Pooja Tiwari',
    phone: '+91 94262 78901',
    email: 'pooja.tiwari@example.com',
    city: 'Kadodara',
    state: 'Gujarat',
    address: 'Shreeji Residency, Kadodara-Bardoli Highway',
    notes: 'Enquired about solid teakwood double bed and wardrobe set with festival discount.',
    source: 'WEBSITE_ENQUIRY',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'cust-3',
    name: 'Amitabh Sharma',
    phone: '+91 98790 45678',
    email: 'amitabh.sharma@example.com',
    city: 'Jolva, Surat',
    state: 'Gujarat',
    address: 'Jolva GIDC Colony, Near Primary School',
    notes: 'Purchased LG 8kg Front Load Washing Machine. Due for water purifier consultation.',
    source: 'REFERRAL',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const customersApi = {
  async getCustomers(search?: string): Promise<ApiResponse<Customer[]>> {
    let list: Customer[] = [...DEFAULT_CUSTOMERS];
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
      const filtered = search
        ? list.filter(
            c =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.phone.includes(search) ||
              (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
          )
        : list;
      return { success: true, data: filtered };
    }

    try {
      let query = supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const mapped: Customer[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          phone: d.phone,
          email: d.email,
          alternatePhone: d.alternate_phone,
          address: d.address,
          city: d.city,
          state: d.state,
          postalCode: d.postal_code,
          notes: d.notes,
          source: d.source || 'DIRECT_VISIT',
          status: d.status || 'ACTIVE',
          createdAt: d.created_at || new Date().toISOString(),
          updatedAt: d.updated_at || new Date().toISOString(),
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        return { success: true, data: mapped };
      }
    } catch (e) {
      // fallback
    }

    const filtered = search
      ? list.filter(
          c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search) ||
            (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
        )
      : list;
    return { success: true, data: filtered };
  },

  async getCustomerByPhone(phone: string): Promise<ApiResponse<Customer | null>> {
    const cleanPhone = phone.trim();
    if (!isSupabaseConfigured()) {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        const list: Customer[] = cached ? JSON.parse(cached) : DEFAULT_CUSTOMERS;
        const found = list.find(c => c.phone.includes(cleanPhone)) || null;
        return { success: true, data: found };
      } catch (e) {
        return { success: true, data: null };
      }
    }

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (!error && data) {
        const customer: Customer = {
          id: data.id,
          name: data.name,
          phone: data.phone,
          email: data.email,
          alternatePhone: data.alternate_phone,
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postal_code,
          notes: data.notes,
          source: data.source,
          status: data.status,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        return { success: true, data: customer };
      }
    } catch (e) {
      // ignore
    }

    return { success: true, data: null };
  },

  async createCustomer(customer: Partial<Customer>): Promise<ApiResponse<Customer>> {
    const newCustomer: Customer = {
      id: customer.id || `cust-${Date.now()}`,
      name: customer.name || 'New Customer',
      phone: customer.phone || '',
      email: customer.email,
      alternatePhone: customer.alternatePhone,
      address: customer.address,
      city: customer.city || 'Shahganj',
      state: customer.state || 'Uttar Pradesh',
      postalCode: customer.postalCode,
      notes: customer.notes,
      source: customer.source || 'SHOWROOM_VISIT',
      status: customer.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update local cache
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      const list: Customer[] = cached ? JSON.parse(cached) : DEFAULT_CUSTOMERS;
      list.unshift(newCustomer);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .insert({
            name: newCustomer.name,
            phone: newCustomer.phone,
            email: newCustomer.email,
            alternate_phone: newCustomer.alternatePhone,
            address: newCustomer.address,
            city: newCustomer.city,
            state: newCustomer.state,
            postal_code: newCustomer.postalCode,
            notes: newCustomer.notes,
            source: newCustomer.source,
            status: newCustomer.status,
          })
          .select()
          .maybeSingle();

        if (!error && data) {
          newCustomer.id = data.id;
        }
      } catch (e) {
        // ignore
      }
    }

    return { success: true, data: newCustomer };
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<ApiResponse<Customer>> {
    let updatedCustomer: Customer | null = null;
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      let list: Customer[] = cached ? JSON.parse(cached) : DEFAULT_CUSTOMERS;
      list = list.map(c => {
        if (c.id === id) {
          updatedCustomer = { ...c, ...updates, updatedAt: new Date().toISOString() };
          return updatedCustomer;
        }
        return c;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    if (isSupabaseConfigured()) {
      try {
        const payload: Record<string, any> = { updated_at: new Date().toISOString() };
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.phone !== undefined) payload.phone = updates.phone;
        if (updates.email !== undefined) payload.email = updates.email;
        if (updates.address !== undefined) payload.address = updates.address;
        if (updates.city !== undefined) payload.city = updates.city;
        if (updates.notes !== undefined) payload.notes = updates.notes;
        if (updates.status !== undefined) payload.status = updates.status;

        await supabase.from('customers').update(payload).eq('id', id);
      } catch (e) {
        // ignore
      }
    }

    if (updatedCustomer) {
      return { success: true, data: updatedCustomer };
    }
    return { success: false, error: 'Customer not found' };
  },
};
