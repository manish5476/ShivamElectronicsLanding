import { useState, useEffect } from 'react';
import { 
  Package, Warehouse, ArrowUpDown, AlertTriangle, 
  Plus, History, RefreshCw, CheckCircle, Search, 
  ArrowDownLeft, ArrowUpRight, Filter
} from 'lucide-react';
import { inventoryApi } from '../../services/inventoryApi';
import { productsApi } from '../../services/electronicsApi';
import type { InventoryItem, InventoryLocation, StockMovement, MovementType } from '../../types/business';
import type { Product } from '../../types/electronics';

export default function InventoryManager() {
  const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustData, setAdjustData] = useState<{
    productId: string;
    productName: string;
    locationId: string;
    movementType: MovementType;
    quantity: number;
    reason: string;
  }>({
    productId: '',
    productName: '',
    locationId: 'loc-showroom-main',
    movementType: 'STOCK_IN',
    quantity: 1,
    reason: 'New showroom stock intake',
  });
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [invRes, locRes, movRes, prodRes] = await Promise.all([
      inventoryApi.getInventory(),
      inventoryApi.getLocations(),
      inventoryApi.getMovements(),
      productsApi.getAll(),
    ]);

    if (invRes.data) setItems(invRes.data);
    if (locRes.data) setLocations(locRes.data);
    if (movRes.data) setMovements(movRes.data);
    if (prodRes.data) setProducts(prodRes.data);
    setLoading(false);
  };

  const handleOpenAdjust = (item?: InventoryItem) => {
    if (item) {
      setAdjustData({
        productId: item.productId,
        productName: item.productName || '',
        locationId: item.locationId,
        movementType: 'STOCK_IN',
        quantity: 1,
        reason: 'Restocking',
      });
    } else if (products.length > 0) {
      setAdjustData({
        productId: products[0].id,
        productName: products[0].name,
        locationId: locations[0]?.id || 'loc-showroom-main',
        movementType: 'STOCK_IN',
        quantity: 1,
        reason: 'Stock intake',
      });
    }
    setIsAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdjusting(true);

    const selectedProd = products.find(p => p.id === adjustData.productId);
    const res = await inventoryApi.adjustStock({
      productId: adjustData.productId,
      productName: selectedProd?.name || adjustData.productName,
      locationId: adjustData.locationId,
      movementType: adjustData.movementType,
      quantity: Number(adjustData.quantity),
      reason: adjustData.reason,
    });

    setAdjusting(false);
    if (res.success) {
      setIsAdjustModalOpen(false);
      await loadData();
    }
  };

  const filteredItems = items.filter(i =>
    (i.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.productSku || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = items.filter(i => i.quantityOnHand <= i.lowStockThreshold).length;

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[var(--color-brand)] mb-3" />
        <p className="text-sm font-medium text-[var(--color-text-muted)]">Loading Inventory & Ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-brand)] block mb-1">
            Warehouse & Showroom Operations
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Inventory Management & Stock Ledger
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Track multi-location inventory balances, record in/out adjustments, and review stock audit history.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdjust()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--color-brand)] text-white hover:opacity-90 transition-all shadow-sm"
        >
          <Plus size={14} /> Record Stock Adjustment
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">Total Products</span>
            <Package size={18} className="text-[var(--color-brand)]" />
          </div>
          <p className="text-2xl font-extrabold text-[var(--color-text)]">{products.length}</p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Across showroom & warehouse</p>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">Low Stock Alerts</span>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600">{lowStockCount}</p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Items at or below threshold</p>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">Active Locations</span>
            <Warehouse size={18} className="text-[var(--color-brand)]" />
          </div>
          <p className="text-2xl font-extrabold text-[var(--color-text)]">{locations.length}</p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">{locations.map(l => l.name).join(', ')}</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-px">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'stock'
                ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Package size={15} /> Stock Balance ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('movements')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'movements'
                ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <History size={15} /> Stock Ledger & Audit ({movements.length})
          </button>
        </div>

        {activeTab === 'stock' && (
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search by product..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-brand)]"
            />
          </div>
        )}
      </div>

      {/* TAB 1: Stock Balances Table */}
      {activeTab === 'stock' && (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
          {items.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={36} className="mx-auto text-[var(--color-text-muted)] mb-3 opacity-40" />
              <h3 className="text-base font-bold text-[var(--color-text)]">No stock balances initialized</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 mb-4">
                Record your first stock adjustment to initialize quantity tracking.
              </p>
              <button
                onClick={() => handleOpenAdjust()}
                className="btn btn-primary py-2 px-4 text-xs"
              >
                Record Initial Stock
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--color-surface-soft)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] uppercase tracking-wider font-extrabold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4 text-center">On Hand</th>
                    <th className="py-3 px-4 text-center">Reserved</th>
                    <th className="py-3 px-4 text-center">Available</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] font-medium">
                  {filteredItems.map(item => {
                    const isLow = item.quantityOnHand <= item.lowStockThreshold;
                    const isZero = item.quantityOnHand === 0;

                    return (
                      <tr key={item.id} className="hover:bg-[var(--color-surface-soft)]/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[var(--color-text)]">
                          {item.productName || item.productId}
                          {item.productSku && (
                            <span className="block text-[10px] text-[var(--color-text-muted)] font-normal">
                              SKU: {item.productSku}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[var(--color-text-muted)]">
                          {locations.find(l => l.id === item.locationId)?.name || item.locationId}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-[var(--color-text)]">
                          {item.quantityOnHand}
                        </td>
                        <td className="py-3.5 px-4 text-center text-[var(--color-text-muted)]">
                          {item.quantityReserved}
                        </td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-[var(--color-brand)]">
                          {item.quantityAvailable}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isZero ? (
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                              Low Stock ({item.quantityOnHand})
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              Healthy
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenAdjust(item)}
                            className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[11px] font-bold hover:bg-[var(--color-surface-soft)] transition-colors"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Movements History Ledger */}
      {activeTab === 'movements' && (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
          {movements.length === 0 ? (
            <div className="p-12 text-center text-[var(--color-text-muted)] text-xs">
              No stock movements recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--color-surface-soft)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] uppercase tracking-wider font-extrabold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] font-medium">
                  {movements.map(m => {
                    const isPositive = ['STOCK_IN', 'RETURN', 'RELEASE'].includes(m.movementType);
                    return (
                      <tr key={m.id} className="hover:bg-[var(--color-surface-soft)]/50">
                        <td className="py-3.5 px-4 text-[var(--color-text-muted)]">
                          {new Date(m.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[var(--color-text)]">
                          {m.productName || m.productId}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {isPositive ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                            {m.movementType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-[var(--color-text)]">
                          {isPositive ? `+${m.quantity}` : `-${m.quantity}`}
                        </td>
                        <td className="py-3.5 px-4 text-[var(--color-text-muted)]">
                          {m.reason || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Record Stock Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] w-full max-w-lg rounded-2xl border border-[var(--color-border)] shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-base font-bold text-[var(--color-text)]">Record Stock Movement</h3>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider mb-1.5 text-[var(--color-text-muted)]">
                  Select Product *
                </label>
                <select
                  required
                  value={adjustData.productId}
                  onChange={e => {
                    const prod = products.find(p => p.id === e.target.value);
                    setAdjustData({
                      ...adjustData,
                      productId: e.target.value,
                      productName: prod?.name || '',
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.sku ? `(${p.sku})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1.5 text-[var(--color-text-muted)]">
                    Target Location *
                  </label>
                  <select
                    value={adjustData.locationId}
                    onChange={e => setAdjustData({ ...adjustData, locationId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1.5 text-[var(--color-text-muted)]">
                    Movement Type *
                  </label>
                  <select
                    value={adjustData.movementType}
                    onChange={e => setAdjustData({ ...adjustData, movementType: e.target.value as MovementType })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-bold"
                  >
                    <option value="STOCK_IN">Stock In (Intake)</option>
                    <option value="STOCK_OUT">Stock Out (Transfer)</option>
                    <option value="SALE">Sale (Dispatched)</option>
                    <option value="RETURN">Customer Return</option>
                    <option value="DAMAGE">Damaged Unit</option>
                    <option value="ADJUSTMENT">Audit Correction</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-1.5 text-[var(--color-text-muted)]">
                  Quantity Units *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustData.quantity}
                  onChange={e => setAdjustData({ ...adjustData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-1.5 text-[var(--color-text-muted)]">
                  Reason / Audit Memo
                </label>
                <input
                  type="text"
                  value={adjustData.reason}
                  onChange={e => setAdjustData({ ...adjustData, reason: e.target.value })}
                  placeholder="e.g. Received new shipment from Sony distributor"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold hover:bg-[var(--color-surface-soft)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-5 py-2 rounded-xl bg-[var(--color-brand)] text-white text-xs font-bold hover:opacity-90 disabled:opacity-50"
                >
                  {adjusting ? 'Updating...' : 'Confirm Movement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
