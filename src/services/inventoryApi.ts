import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { InventoryLocation, InventoryItem, StockMovement, MovementType } from '../types/business';
import type { ApiResponse } from '../types/electronics';

const DEFAULT_LOCATIONS: InventoryLocation[] = [
  { id: 'loc-showroom-main', name: 'Main Showroom', code: 'SHW-01', address: 'Station Road, Main Market', locationType: 'SHOWROOM', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { id: 'loc-warehouse-central', name: 'Central Warehouse', code: 'WH-01', address: 'Plot 4, Industrial Area', locationType: 'WAREHOUSE', status: 'ACTIVE', createdAt: new Date().toISOString() },
];

const STORAGE_KEY_LOCATIONS = 'shivam_inventory_locations_v1';
const STORAGE_KEY_ITEMS = 'shivam_inventory_items_v1';
const STORAGE_KEY_MOVEMENTS = 'shivam_inventory_movements_v1';

export const inventoryApi = {
  // ─── Locations ─────────────────────────────────────────────────────────────
  async getLocations(): Promise<ApiResponse<InventoryLocation[]>> {
    let list = [...DEFAULT_LOCATIONS];
    try {
      const cached = localStorage.getItem(STORAGE_KEY_LOCATIONS);
      if (cached) list = JSON.parse(cached);
    } catch (e) {
      // ignore
    }

    if (!isSupabaseConfigured()) return { success: true, data: list };

    try {
      const { data, error } = await supabase.from('inventory_locations').select('*').eq('status', 'ACTIVE');
      if (!error && data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          code: d.code,
          address: d.address,
          locationType: d.location_type || 'SHOWROOM',
          status: d.status || 'ACTIVE',
          createdAt: d.created_at || new Date().toISOString(),
        }));
        localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(mapped));
        return { success: true, data: mapped };
      }
    } catch (e) {
      // ignore
    }

    return { success: true, data: list };
  },

  // ─── Stock Inventory Levels ────────────────────────────────────────────────
  async getInventory(productId?: string): Promise<ApiResponse<InventoryItem[]>> {
    let items: InventoryItem[] = [];
    try {
      const cached = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (cached) items = JSON.parse(cached);
    } catch (e) {
      // ignore
    }

    if (!isSupabaseConfigured()) {
      const filtered = productId ? items.filter(i => i.productId === productId) : items;
      return { success: true, data: filtered };
    }

    try {
      let query = supabase.from('inventory_items').select('*, products(name, sku), inventory_locations(name)');
      if (productId) query = query.eq('product_id', productId);

      const { data, error } = await query;
      if (!error && data) {
        const mapped: InventoryItem[] = data.map((d: any) => ({
          id: d.id,
          productId: d.product_id,
          locationId: d.location_id,
          productName: d.products?.name,
          productSku: d.products?.sku,
          locationName: d.inventory_locations?.name,
          quantityOnHand: d.quantity_on_hand || 0,
          quantityReserved: d.quantity_reserved || 0,
          quantityAvailable: Math.max(0, (d.quantity_on_hand || 0) - (d.quantity_reserved || 0)),
          lowStockThreshold: d.low_stock_threshold || 3,
          reorderLevel: d.reorder_level || 5,
          updatedAt: d.updated_at || new Date().toISOString(),
        }));
        if (!productId) localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(mapped));
        return { success: true, data: mapped };
      }
    } catch (e) {
      // fallback
    }

    const filtered = productId ? items.filter(i => i.productId === productId) : items;
    return { success: true, data: filtered };
  },

  // ─── Record Stock Movement & Adjust Balance ────────────────────────────────
  async adjustStock(params: {
    productId: string;
    productName?: string;
    locationId: string;
    movementType: MovementType;
    quantity: number;
    reason?: string;
    performedBy?: string;
  }): Promise<ApiResponse<{ movement: StockMovement; newQuantity: number }>> {
    const { productId, productName, locationId, movementType, quantity, reason, performedBy } = params;
    
    // Calculate quantity delta
    let delta = quantity;
    if (['STOCK_OUT', 'SALE', 'DAMAGE', 'RESERVATION'].includes(movementType)) {
      delta = -Math.abs(quantity);
    } else {
      delta = Math.abs(quantity);
    }

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      productId,
      productName,
      locationId,
      movementType,
      quantity,
      reason: reason || `Manual adjustment (${movementType})`,
      performedBy: performedBy || 'Admin Staff',
      createdAt: new Date().toISOString(),
    };

    // Update local cache
    let currentItems: InventoryItem[] = [];
    try {
      const cached = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (cached) currentItems = JSON.parse(cached);
    } catch (e) {}

    let item = currentItems.find(i => i.productId === productId && i.locationId === locationId);
    let newQty = 0;
    if (item) {
      item.quantityOnHand = Math.max(0, item.quantityOnHand + delta);
      item.quantityAvailable = Math.max(0, item.quantityOnHand - item.quantityReserved);
      item.updatedAt = new Date().toISOString();
      newQty = item.quantityOnHand;
    } else {
      newQty = Math.max(0, delta);
      item = {
        id: `inv-${Date.now()}`,
        productId,
        productName,
        locationId,
        quantityOnHand: newQty,
        quantityReserved: 0,
        quantityAvailable: newQty,
        lowStockThreshold: 3,
        reorderLevel: 5,
        updatedAt: new Date().toISOString(),
      };
      currentItems.push(item);
    }
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(currentItems));

    // Save movement to history
    let movements: StockMovement[] = [];
    try {
      const cachedMov = localStorage.getItem(STORAGE_KEY_MOVEMENTS);
      if (cachedMov) movements = JSON.parse(cachedMov);
    } catch (e) {}
    movements.unshift(movement);
    localStorage.setItem(STORAGE_KEY_MOVEMENTS, JSON.stringify(movements.slice(0, 100)));

    // Sync to Supabase if available
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('stock_movements').insert({
          product_id: productId,
          location_id: locationId,
          movement_type: movementType,
          quantity,
          reason,
          performed_by: performedBy,
        });

        // Also update products.stock_quantity for compatibility
        await supabase
          .from('products')
          .update({ stock_quantity: newQty, updated_at: new Date().toISOString() })
          .eq('id', productId);
      } catch (e) {
        // ignore
      }
    }

    return { success: true, data: { movement, newQuantity: newQty } };
  },

  // ─── Stock Movement History ────────────────────────────────────────────────
  async getMovements(productId?: string): Promise<ApiResponse<StockMovement[]>> {
    let list: StockMovement[] = [];
    try {
      const cached = localStorage.getItem(STORAGE_KEY_MOVEMENTS);
      if (cached) list = JSON.parse(cached);
    } catch (e) {}

    if (!isSupabaseConfigured()) {
      const filtered = productId ? list.filter(m => m.productId === productId) : list;
      return { success: true, data: filtered };
    }

    try {
      let query = supabase.from('stock_movements').select('*, products(name)').order('created_at', { ascending: false }).limit(50);
      if (productId) query = query.eq('product_id', productId);

      const { data, error } = await query;
      if (!error && data) {
        const mapped: StockMovement[] = data.map((d: any) => ({
          id: d.id,
          productId: d.product_id,
          productName: d.products?.name,
          locationId: d.location_id,
          movementType: d.movement_type,
          quantity: d.quantity,
          referenceType: d.reference_type,
          referenceId: d.reference_id,
          reason: d.reason,
          performedBy: d.performed_by,
          createdAt: d.created_at,
        }));
        return { success: true, data: mapped };
      }
    } catch (e) {}

    const filtered = productId ? list.filter(m => m.productId === productId) : list;
    return { success: true, data: filtered };
  },
};
