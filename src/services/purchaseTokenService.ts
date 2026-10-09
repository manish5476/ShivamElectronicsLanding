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

  // Retrieve all tokens saved on device
  getAllTokens(): PurchaseToken[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
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
