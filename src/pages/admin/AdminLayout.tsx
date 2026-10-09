import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Package, FolderOpen, Layers, 
  MessageCircle, LayoutGrid, Palette, FileImage, 
  Users, Activity, Globe, Settings, Menu, X, 
  ExternalLink, LogOut, Bell, Search, ChevronDown, User,
  Building2, Warehouse, Calendar, FileText, ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PERMISSIONS } from '../../lib/permissions';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut, loading, isConfigured, hasPermission, profile } = useAuth();
  
  // Profile dropdown state
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && isConfigured) {
      navigate('/admin/login');
    }
  }, [navigate, user, loading, isConfigured]);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', permission: PERMISSIONS.DASHBOARD_VIEW },
      ]
    },
    {
      title: 'Business & Inventory',
      items: [
        { to: '/admin/products', icon: Package, label: 'Products', permission: PERMISSIONS.DESIGNS_VIEW },
        { to: '/admin/inventory', icon: Warehouse, label: 'Inventory & Stock', permission: PERMISSIONS.DESIGNS_VIEW },
        { to: '/admin/categories', icon: FolderOpen, label: 'Categories', permission: PERMISSIONS.COLLECTIONS_VIEW },
        { to: '/admin/brands', icon: Layers, label: 'Brands', permission: PERMISSIONS.DASHBOARD_VIEW },
      ]
    },
    {
      title: 'Customer & Sales',
      items: [
        { to: '/admin/orders', icon: ShoppingBag, label: 'Orders & Tokens', permission: PERMISSIONS.BOOKINGS_VIEW },
        { to: '/admin/enquiries', icon: MessageCircle, label: 'Enquiries', permission: PERMISSIONS.BOOKINGS_VIEW },
        { to: '/admin/bookings', icon: Calendar, label: 'Showroom Bookings', permission: PERMISSIONS.BOOKINGS_VIEW },
      ]
    },
    {
      title: 'Content & Media',
      items: [
        { to: '/admin/appearance', icon: Palette, label: 'Appearance Studio', permission: PERMISSIONS.APPEARANCE_VIEW },
        { to: '/admin/media', icon: FileImage, label: 'Media Library', permission: PERMISSIONS.MEDIA_VIEW },
        { to: '/admin/documents', icon: FileText, label: 'Documents & Catalogues', permission: PERMISSIONS.DASHBOARD_VIEW },
      ]
    },
    {
      title: 'Company & System',
      items: [
        { to: '/admin/company', icon: Building2, label: 'Company Profile', permission: PERMISSIONS.DASHBOARD_VIEW },
        { to: '/admin/users', icon: Users, label: 'Users', permission: PERMISSIONS.USERS_VIEW },
        { to: '/admin/activity', icon: Activity, label: 'Activity Log', permission: PERMISSIONS.AUDIT_VIEW },
        { to: '/admin/settings', icon: Globe, label: 'Site Settings', permission: PERMISSIONS.DASHBOARD_VIEW },
        { to: '/admin/setup', icon: Settings, label: 'Setup Guide', permission: PERMISSIONS.DASHBOARD_VIEW },
      ]
    }
  ];

  interface AdminNavItem {
    to: string;
    icon: any;
    label: string;
    permission: any;
  }

  // For header context
  const allNavItems: AdminNavItem[] = navGroups.flatMap(g => g.items as AdminNavItem[]);
  const currentItem = allNavItems.find(i => i.to === location.pathname);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex font-sans text-[var(--color-text)]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-[260px] bg-[var(--color-surface)] border-r border-[var(--color-border)] fixed h-full z-30">
        <div className="h-16 flex items-center px-6 border-b border-[var(--color-border-soft)]">
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-[var(--color-brand)]">
            <span className="font-display font-bold text-lg tracking-tight">SHIVAM ELECTRONICS</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4 hide-scrollbar">
          {navGroups.map((group, idx) => {
            // Filter items based on permissions
            const items = profile?.permissions?.length 
              ? group.items.filter(item => hasPermission(item.permission))
              : group.items;

            if (items.length === 0) return null;

            return (
              <div key={idx} className="mb-6 px-4">
                <h3 className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 px-3">
                  {group.title}
                </h3>
                <nav className="space-y-0.5">
                  {items.map((item) => {
                    const isActive = location.pathname.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          isActive
                            ? 'bg-[var(--color-brand)] text-white font-medium shadow-sm'
                            : 'text-[var(--color-text-soft)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-text)]'
                        }`}
                      >
                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-[var(--color-text-muted)]'} />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-[260px] h-full bg-[var(--color-surface)] shadow-2xl flex flex-col animate-slide-right">
            <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border-soft)]">
              <span className="font-display font-bold text-lg text-[var(--color-brand)] tracking-tight">SHIVAM</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-[var(--color-text-soft)] hover:text-[var(--color-text)]">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              {navGroups.map((group, idx) => {
                const items = profile?.permissions?.length 
                  ? group.items.filter(item => hasPermission(item.permission))
                  : group.items;

                if (items.length === 0) return null;

                return (
                  <div key={idx} className="mb-6 px-4">
                    <h3 className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 px-3">
                      {group.title}
                    </h3>
                    <nav className="space-y-0.5">
                      {items.map((item) => {
                        const isActive = location.pathname.startsWith(item.to);
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                              isActive
                                ? 'bg-[var(--color-brand)] text-white font-medium'
                                : 'text-[var(--color-text-soft)] hover:bg-[var(--color-bg-soft)]'
                            }`}
                          >
                            <item.icon size={18} />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-[260px] min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 -ml-2 text-[var(--color-text-soft)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-soft)] rounded-md"
            >
              <Menu size={20} />
            </button>
            
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-[var(--color-text)]">
                {currentItem ? currentItem.label : 'Admin Workspace'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden md:flex relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 text-sm bg-[var(--color-bg-soft)] border border-transparent rounded-full focus:bg-white focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 outline-none transition-all w-[200px] lg:w-[260px]"
              />
            </div>

            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[var(--color-text-soft)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-soft)] rounded-full transition-colors"
            >
              <ExternalLink size={14} />
              View Store
            </Link>

            <button className="p-2 text-[var(--color-text-soft)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-soft)] rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-danger)] rounded-full border-2 border-white"></span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full border border-[var(--color-border)] hover:border-[var(--color-border-soft)] hover:bg-[var(--color-bg-soft)] transition-colors focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand)] flex items-center justify-center font-semibold text-xs">
                  {profile?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-sm font-medium text-[var(--color-text)] max-w-[100px] truncate">
                    {profile?.name || 'Admin'}
                  </span>
                  <ChevronDown size={14} className="text-[var(--color-text-muted)]" />
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-strong border border-[var(--color-border-soft)] py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-[var(--color-border-soft)] mb-1">
                      <p className="text-sm font-semibold text-[var(--color-text)] truncate">{profile?.name || 'Admin User'}</p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">{profile?.email || 'admin@shivamelectronics.com'}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand)] bg-[var(--color-brand)]/10 rounded-full">
                        {profile?.role?.replace('_', ' ') || 'ADMINISTRATOR'}
                      </span>
                    </div>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-soft)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-soft)] transition-colors">
                      <User size={16} />
                      My Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-soft)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-soft)] transition-colors">
                      <Settings size={16} />
                      Preferences
                    </button>
                    
                    <div className="h-px bg-[var(--color-border-soft)] my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger)]/5 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 bg-[var(--color-bg)] w-full max-w-[1600px] mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
