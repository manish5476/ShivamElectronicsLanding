import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, FolderOpen, Layers, MessageCircle, 
  ArrowUpRight, AlertCircle, TrendingUp, Clock, 
  ShoppingBag, Plus, Tag, CheckCircle, Ticket
} from 'lucide-react';
import { dashboardApi, enquiriesApi, productsApi } from '../../services/electronicsApi';
import { purchaseTokenService } from '../../services/purchaseTokenService';
import { isSupabaseConfigured } from '../../lib/supabase';
import type { DashboardStats, Enquiry, Product } from '../../types/electronics';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
    totalBrands: 0,
    activeOffers: 0,
    activeBanners: 0,
    newEnquiries: 0,
    pendingEnquiries: 0,
    todayEnquiries: 0,
    featuredProducts: 0,
  });
  const [orderTokensCount, setOrderTokensCount] = useState(0);
  const [orderTokensGmv, setOrderTokensGmv] = useState(0);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      // Load local and persisted purchase tokens stats
      const tokens = purchaseTokenService.getAllTokens();
      setOrderTokensCount(tokens.length);
      const activeGmv = tokens
        .filter(t => t.status === 'ACTIVE')
        .reduce((sum, t) => sum + t.totalAmount, 0);
      setOrderTokensGmv(activeGmv);

      const statsRes = await dashboardApi.getStats();
      if (statsRes.success && statsRes.data) setStats(statsRes.data);

      const enqRes = await enquiriesApi.getAll();
      if (enqRes.success && enqRes.data) {
        setRecentEnquiries(enqRes.data.slice(0, 5));
      }

      const prodRes = await productsApi.getAll({ limit: 4 });
      if (prodRes.success && prodRes.data) {
        setRecentProducts(prodRes.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const enquiryStatusColor: Record<string, string> = {
    NEW: 'text-blue-600 bg-blue-50',
    CONTACTED: 'text-amber-600 bg-amber-50',
    FOLLOW_UP: 'text-purple-600 bg-purple-50',
    CONVERTED: 'text-emerald-600 bg-emerald-50',
    CLOSED: 'text-slate-500 bg-slate-100'
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 text-center rounded-lg shadow-sm">
          <AlertCircle size={40} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Supabase Connection Required</h2>
          <p className="text-[var(--color-text-muted)] mb-6">Please connect your Supabase project using the "Connect to Supabase" button in the top right to enable the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-12">
      
      {/* 1. WELCOME / OVERVIEW */}
      <section className="border-b border-[var(--color-border)] pb-8 pt-2">
        <h1 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Overview</h1>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight mb-2">Good morning, Admin.</h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">Monitor your catalogue performance, review recent customer enquiries, and manage your storefront.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/admin/orders" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm">
              <ShoppingBag size={15} /> Orders &amp; Tokens
            </Link>
            <Link to="/admin/products" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-sm">
              <Plus size={15} /> Add Product
            </Link>
            <Link to="/admin/inventory" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs font-bold rounded-xl hover:bg-[var(--color-surface-soft)] transition-colors">
              <Package size={15} /> Stock Ledger
            </Link>
            <Link to="/admin/bookings" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs font-bold rounded-xl hover:bg-[var(--color-surface-soft)] transition-colors">
              <Clock size={15} /> Showroom Bookings
            </Link>
            <Link to="/admin/enquiries" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs font-bold rounded-xl hover:bg-[var(--color-surface-soft)] transition-colors">
              <MessageCircle size={15} /> Enquiries
            </Link>
          </div>
        </div>
      </section>

      {/* 2. BUSINESS SNAPSHOT - Glassmorphic Metric Panels */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Link to="/admin/orders" className="glass-card p-5 rounded-2xl border border-[var(--color-border)] hover:border-indigo-400 transition-colors group block">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 mb-1 flex items-center justify-between">
              <span>Orders &amp; Tokens</span>
              <Ticket size={12} className="text-indigo-500" />
            </div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-extrabold text-[var(--color-text)] leading-none">{orderTokensCount}</div>
              <div className="text-xs font-bold text-indigo-600 mb-0.5">₹{orderTokensGmv.toLocaleString('en-IN')}</div>
            </div>
          </Link>
          <div className="glass-card p-5 rounded-2xl border border-[var(--color-border)]">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Products</div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-extrabold text-[var(--color-text)] leading-none">{stats.totalProducts}</div>
              <div className="text-xs font-bold text-[var(--color-success)] flex items-center mb-0.5"><TrendingUp size={12} className="mr-0.5" /> Active</div>
            </div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-[var(--color-border)]">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Pending CRM</div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-extrabold text-[var(--color-text)] leading-none">{stats.pendingEnquiries}</div>
              <div className="text-xs font-bold text-amber-600 mb-0.5">Enquiries</div>
            </div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-[var(--color-border)]">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Categories</div>
            <div className="text-3xl font-extrabold text-[var(--color-text)] leading-none">{stats.totalCategories}</div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-[var(--color-border)]">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Brands</div>
            <div className="text-3xl font-extrabold text-[var(--color-text)] leading-none">{stats.totalBrands}</div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-[var(--color-border)]">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Active Offers</div>
            <div className="text-3xl font-extrabold text-[var(--color-text)] leading-none">{stats.activeOffers}</div>
          </div>
        </div>
      </section>

      {/* 3. MAIN BUSINESS AREA (Two-column layout, asymmetric) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Catalogue Overview (7 columns) */}
        <section className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--color-text)]">Recent Catalogue Additions</h3>
            <Link to="/admin/products" className="text-sm font-semibold text-[var(--color-accent)] hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentProducts.length > 0 ? recentProducts.map(product => (
              <div key={product.id} className="group flex items-start gap-4 p-4 rounded hover:bg-[var(--color-surface)] transition-colors border border-transparent hover:border-[var(--color-border)]">
                <div className="w-16 h-16 bg-white border border-[var(--color-border)] p-1 rounded shrink-0 flex items-center justify-center overflow-hidden">
                  {product.images?.[0]?.imageUrl ? (
                    <img src={product.images[0].imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Package size={20} className="text-[var(--color-text-muted)] opacity-50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold tracking-wider text-[var(--color-text-muted)] uppercase truncate">
                      {(product as any).brand?.name || 'Brand'} • {(product as any).category?.name || 'Category'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[var(--color-text)] truncate">{product.name}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-sm">
                    {product.sellingPrice ? (
                      <span className="font-semibold">₹{product.sellingPrice.toLocaleString()}</span>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">Price unset</span>
                    )}
                    {product.status === 'ACTIVE' ? (
                      <span className="flex items-center gap-1 text-[var(--color-success)] text-xs font-bold uppercase"><CheckCircle size={12} /> Active</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[var(--color-text-muted)] text-xs font-bold uppercase"><Clock size={12} /> Draft</span>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-12 px-6 border-2 border-dashed border-[var(--color-border)] rounded text-center">
                <h4 className="font-bold text-[var(--color-text)] mb-2">Your catalogue is empty</h4>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">Start building your retail inventory.</p>
                <Link to="/admin/products" className="inline-flex px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded hover:opacity-90 transition-opacity">Add First Product</Link>
              </div>
            )}
          </div>
        </section>

        {/* Right: Recent Enquiries (5 columns) */}
        <section className="lg:col-span-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--color-text)]">Recent Enquiries</h3>
            <Link to="/admin/enquiries" className="text-sm font-semibold text-[var(--color-accent)] hover:underline inline-flex items-center gap-1">
              Manage CRM <ArrowUpRight size={14} />
            </Link>
          </div>
          
          <div className="border-l-2 border-[var(--color-border)] ml-3 space-y-6">
            {recentEnquiries.length > 0 ? recentEnquiries.map(enquiry => (
              <div key={enquiry.id} className="relative pl-6">
                <div className="absolute w-3 h-3 bg-white border-2 border-[var(--color-primary)] rounded-full -left-[7px] top-1.5"></div>
                
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-[var(--color-text)]">{enquiry.customerName}</h4>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${enquiryStatusColor[enquiry.status]}`}>
                    {enquiry.status}
                  </span>
                </div>
                
                <p className="text-sm text-[var(--color-text-muted)] mb-2 line-clamp-2 leading-relaxed">
                  {enquiry.message || 'No message provided.'}
                </p>
                
                {enquiry.product ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                    <ShoppingBag size={12} />
                    <span>{enquiry.product.name}</span>
                  </div>
                ) : enquiry.message && enquiry.message.includes('[PURCHASE TOKEN:') ? (() => {
                  const tokenMatch = enquiry.message.match(/\[PURCHASE TOKEN:\s*([^\]]+)\]/);
                  const tokenCode = tokenMatch ? tokenMatch[1].trim() : '';
                  const itemsMatch = enquiry.message.match(/Items:\s*\n([^\n]+)/);
                  const firstItem = itemsMatch ? itemsMatch[1].trim() : 'Cart Reservation';
                  return (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-1 rounded-lg">
                      <Ticket size={12} className="text-indigo-600 shrink-0" />
                      <span className="font-mono font-bold">{tokenCode}</span>
                      <span className="text-slate-600 truncate">· {firstItem}</span>
                    </div>
                  );
                })() : null}
                
                <div className="text-xs text-[var(--color-text-muted)] mt-2 font-medium">
                  {new Date(enquiry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )) : (
              <div className="pl-6 text-sm text-[var(--color-text-muted)]">
                <p>No customer enquiries yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>

    </div>
  );
}
