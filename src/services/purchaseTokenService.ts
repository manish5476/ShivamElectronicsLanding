import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CartItem } from '../contexts/CartContext';
import type { CustomerUser } from '../contexts/AuthContext';

export interface PurchaseToken {
  id: string;
  tokenCode: string;
  createdAt: string;
  expiresAt: string;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED';
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  items: CartItem[];
  totalAmount: number;
  totalMrp: number;
  totalSavings: number;
  estimatedMonthlyEmi: number | null;
  fulfillmentType: 'SHOWROOM_PICKUP' | 'DOORSTEP_DELIVERY';
  paymentPreference: 'PAY_AT_SHOWROOM' | 'ZERO_COST_EMI' | 'UPI_ONLINE';
  notes?: string;
}

export interface CreateTokenPayload {
  customer: CustomerUser;
  items: CartItem[];
  totalAmount: number;
  totalMrp: number;
  totalSavings: number;
  estimatedMonthlyEmi: number | null;
  fulfillmentType: 'SHOWROOM_PICKUP' | 'DOORSTEP_DELIVERY';
  paymentPreference: 'PAY_AT_SHOWROOM' | 'ZERO_COST_EMI' | 'UPI_ONLINE';
  deliveryAddress?: string;
  notes?: string;
}

const STORAGE_KEY = 'shivam_purchase_tokens_v1';

export const purchaseTokenService = {
  // Generate random unique token code (e.g., SE-9842-710)
  generateTokenCode(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const num = Math.floor(1000 + Math.random() * 9000);
    return `SE-${rand}-${num}`;
  },

  // Create and persist purchase token
  async createToken(payload: CreateTokenPayload): Promise<{ success: boolean; token?: PurchaseToken; error?: string }> {
    if (!payload.items || payload.items.length === 0) {
      return { success: false, error: 'Cannot create token for an empty cart' };
    }

    const tokenCode = this.generateTokenCode();
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 Days price lock

    const token: PurchaseToken = {
      id: 'tok_' + Math.random().toString(36).substring(2, 9),
      tokenCode,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      status: 'ACTIVE',
      customer: {
        id: payload.customer.id,
        name: payload.customer.name,
        email: payload.customer.email,
        phone: payload.customer.phone || '',
        address: payload.deliveryAddress || payload.customer.address,
      },
      items: payload.items,
      totalAmount: payload.totalAmount,
      totalMrp: payload.totalMrp,
      totalSavings: payload.totalSavings,
      estimatedMonthlyEmi: payload.estimatedMonthlyEmi,
      fulfillmentType: payload.fulfillmentType,
      paymentPreference: payload.paymentPreference,
      notes: payload.notes,
    };

    // 1. Save locally in customer's device
    try {
      const existing = this.getAllTokens();
      const updated = [token, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // 2. Submit to Supabase as an Enquiry/Reservation record so Showroom Staff sees it
    if (isSupabaseConfigured()) {
      try {
        const itemsSummary = payload.items.map(i => `${i.name} (x${i.quantity}) - ₹${(i.sellingPrice * i.quantity).toLocaleString('en-IN')}`).join('\n');
        
        await supabase.from('enquiries').insert({
          customer_name: payload.customer.name,
          customer_email: payload.customer.email,
          customer_phone: payload.customer.phone || '9574219663',
          enquiry_type: 'PRODUCT',
          quantity: payload.items.reduce((acc, i) => acc + i.quantity, 0),
          status: 'NEW',
          message: `[PURCHASE TOKEN: ${tokenCode}]\n` +
                   `Total: ₹${payload.totalAmount.toLocaleString('en-IN')} (Saved ₹${payload.totalSavings.toLocaleString('en-IN')})\n` +
                   `Fulfillment: ${payload.fulfillmentType === 'SHOWROOM_PICKUP' ? 'Showroom Pickup (Jolva)' : 'Doorstep Delivery'}\n` +
                   `Payment Mode: ${payload.paymentPreference}\n` +
                   (payload.deliveryAddress ? `Delivery Address: ${payload.deliveryAddress}\n` : '') +
                   `Items:\n${itemsSummary}`,
          notes: `Token: ${tokenCode} | Valid until: ${expires.toLocaleDateString('en-IN')}`,
        });
      } catch {
        // Safe fallback - token still valid locally
      }
    }

    return { success: true, token };
  },

  // Default sample tokens for initial inspection
  getSeedTokens(): PurchaseToken[] {
    const now = new Date();
    const expiry = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
    return [
      {
        id: 'tok-seed-3670',
        tokenCode: 'SE-ZXYR-3670',
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: expiry.toISOString(),
        status: 'ACTIVE',
        customer: {
          id: 'cust-dummy-1',
          name: 'Prakash Patel',
          email: 'dummy.mail.me',
          phone: '+91 98251 44102',
          address: 'A-204, Riverview Residency, Jolva, Surat',
        },
        items: [
          {
            productId: 'prod-sheesham-dining-6',
            name: 'Solid Sheesham Wood 6-Seater Dining Table Set with Cushioned Chairs',
            slug: 'sheesham-wood-6-seater-dining-table-set',
            sellingPrice: 32990,
            mrp: 48000,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80',
          },
        ],
        totalAmount: 32990,
        totalMrp: 48000,
        totalSavings: 15010,
        estimatedMonthlyEmi: 2749,
        fulfillmentType: 'SHOWROOM_PICKUP',
        paymentPreference: 'PAY_AT_SHOWROOM',
        notes: 'Customer requested inspection of dark walnut wood polish before delivery.',
      },
      {
        id: 'tok-seed-8910',
        tokenCode: 'SE-OLED-8910',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        customer: {
          id: 'cust-dummy-2',
          name: 'Mehul B. Shah',
          email: 'mehul.shah@example.com',
          phone: '+91 94280 51920',
          address: 'Plot 18, Shree Ram Nagar, Kadodara Road, Jolva',
        },
        items: [
          {
            productId: 'prod-sony-bravia-65',
            name: 'Sony Bravia 65-inch XR 4K OLED Google TV (Cognitive Processor XR)',
            slug: 'sony-bravia-65-xr-oled-4k',
            sellingPrice: 169990,
            mrp: 249990,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80',
          },
          {
            productId: 'prod-sony-soundbar-51',
            name: 'Sony HT-S40R 600W 5.1ch Real Surround Soundbar with Wireless Subwoofer',
            slug: 'sony-ht-s40r-5-1-soundbar',
            sellingPrice: 24990,
            mrp: 34990,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
          },
        ],
        totalAmount: 194980,
        totalMrp: 284980,
        totalSavings: 90000,
        estimatedMonthlyEmi: 16248,
        fulfillmentType: 'DOORSTEP_DELIVERY',
        paymentPreference: 'ZERO_COST_EMI',
        notes: '0% EMI pre-approved with Aadhaar. Needs free wall mounting installation.',
      },
    ];
  },

  // Retrieve all tokens saved on device
  getAllTokens(): PurchaseToken[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    const seed = this.getSeedTokens();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    } catch {}
    return seed;
  },

  // Update token status
  updateTokenStatus(idOrCode: string, status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED', notes?: string): PurchaseToken | null {
    const list = this.getAllTokens();
    const idx = list.findIndex(t => t.id === idOrCode || t.tokenCode.toUpperCase() === idOrCode.toUpperCase());
    if (idx === -1) return null;

    list[idx] = {
      ...list[idx],
      status,
      notes: notes !== undefined ? notes : list[idx].notes,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}

    return list[idx];
  },

  // Delete token
  deleteToken(idOrCode: string): boolean {
    const list = this.getAllTokens();
    const filtered = list.filter(t => t.id !== idOrCode && t.tokenCode.toUpperCase() !== idOrCode.toUpperCase());
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  },

  // Retrieve tokens for specific user
  getUserTokens(userEmail?: string): PurchaseToken[] {
    const all = this.getAllTokens();
    if (!userEmail) return all;
    const clean = userEmail.trim().toLowerCase();
    return all.filter(t => t.customer.email.toLowerCase() === clean);
  },

  // Retrieve single token by tokenCode
  getTokenByCode(tokenCode: string): PurchaseToken | null {
    const all = this.getAllTokens();
    return all.find(t => t.tokenCode.toUpperCase() === tokenCode.trim().toUpperCase()) || null;
  },

  // Build pre-formatted WhatsApp share link to Showroom Manager
  getWhatsAppShareUrl(token: PurchaseToken, managerPhone: string = '9510082747'): string {
    const cleanPhone = managerPhone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const itemsList = token.items
      .map((item, idx) => `${idx + 1}. ${item.name} (Qty: ${item.quantity}) - ₹${(item.sellingPrice * item.quantity).toLocaleString('en-IN')}`)
      .join('\n');

    const message =
      `Namaste Shivam Electronics Jolva,\n\n` +
      `Here is my Official Purchase Reservation Token:\n` +
      `🎟️ *Token Code:* ${token.tokenCode}\n` +
      `👤 *Customer:* ${token.customer.name}\n` +
      `📞 *Phone:* ${token.customer.phone || 'Available on request'}\n\n` +
      `🛍️ *Reserved Items:*\n${itemsList}\n\n` +
      `💰 *Total Price:* ₹${token.totalAmount.toLocaleString('en-IN')} (Saved ₹${token.totalSavings.toLocaleString('en-IN')})\n` +
      `📦 *Fulfillment:* ${token.fulfillmentType === 'SHOWROOM_PICKUP' ? 'Showroom Pickup (Jolva)' : 'Doorstep Delivery'}\n` +
      `💳 *Payment Preference:* ${token.paymentPreference}\n\n` +
      `Please confirm stock availability and demo at the Jolva showroom. Thank you!`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  },
};
