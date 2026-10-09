import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Search, Phone, ArrowRight, MapPin, Clock, Mail,
  ShieldCheck, Truck, Sparkles, ChevronUp, ExternalLink,
  ShoppingBag, User, Ticket, LogOut, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CustomerAuthModal from './CustomerAuthModal';
import { companyApi, DEFAULT_COMPANY_PROFILE } from '../services/companyApi';
import type { CompanyProfile } from '../types/business';

interface LayoutProps {
  children: React.ReactNode;
}

// ─── Crisp Vector Brand Icons for Social Channels ───────────────────────────
const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.301-.15-1.776-.877-2.052-.977-.275-.1-.476-.15-.676.15-.2.3-.777.977-.952 1.177-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.675-2.085-.175-.3-.019-.462.131-.611.136-.134.301-.35.452-.525.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.927-2.233-.244-.588-.492-.508-.676-.517-.175-.009-.376-.011-.577-.011-.201 0-.527.075-.802.375-.276.3-1.053 1.03-1.053 2.511 0 1.482 1.078 2.914 1.229 3.115.15.2 2.122 3.24 5.14 4.544.718.31 1.279.496 1.716.634.721.229 1.377.196 1.895.119.577-.086 1.776-.726 2.027-1.428.251-.702.251-1.303.175-1.428-.075-.125-.276-.2-.577-.35zM12.04 21.785c-1.764 0-3.493-.474-5.007-1.371l-.359-.213-3.725.977.994-3.633-.233-.371c-.985-1.568-1.505-3.376-1.505-5.234 0-5.368 4.368-9.736 9.735-9.736 2.6 0 5.045 1.013 6.883 2.851 1.838 1.838 2.85 4.283 2.85 6.883 0 5.369-4.367 9.737-9.734 9.737zm7.592-17.327C17.604 2.43 14.931 1.333 12.04 1.333 6.136 1.333 1.333 6.136 1.333 12.04c0 1.886.492 3.727 1.427 5.347L1 23l5.807-1.523c1.558.85 3.313 1.3 5.113 1.3 5.904 0 10.707-4.803 10.707-10.707 0-2.861-1.113-5.551-3.135-7.573z"/>
  </svg>
);

export default function ElectronicsLayout({ children }: LayoutProps) {
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_COMPANY_PROFILE);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const { totalItems, openCart } = useCart();
  const { customer, isCustomerLoggedIn, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    companyApi.getProfile().then(res => {
      if (res.data) setProfile(res.data);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/categories', label: 'Collections' },
    { to: '/products', label: 'Shop All' },
    { to: '/brands', label: 'Brands' },
    { to: '/gallery', label: 'Showroom Gallery' },
    { to: '/offers', label: 'Festive Offers' },
    { to: '/contact', label: 'Showroom & Map' },
  ];

  const rawPhone = profile.phone || '9574219663';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.length === 10
    ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`
    : `+91 ${cleanPhone}`;

  const waRaw = profile.whatsapp || '9510082747';
  const cleanWa = waRaw.replace(/[^0-9]/g, '');
  const waNumber = cleanWa.length === 10 ? `91${cleanWa}` : cleanWa;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900 font-sans">
      
      {/* ── Top Announcement Strip ───────────────────────────── */}
      <div className="hidden md:flex items-center justify-between text-[11px] font-semibold py-2 px-6 md:px-10 bg-slate-950 text-slate-200 border-b border-white/10 tracking-wide">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SHIVAM ELECTRONICS FLAGSHIP SHOWROOM · JOLVA, GUJARAT</span>
          <span className="text-white/30">|</span>
          <span className="text-amber-300">✦ Authorized Brand Partner (Sony, Samsung, LG, Voltas, Bosch)</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Clock size={12} className="text-indigo-400" /> Open Today: 10:00 AM – 9:00 PM
          </span>
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
          >
            <Phone size={12} /> {formattedPhone}
          </a>
        </div>
      </div>

      {/* ── Modern Architectural Header ───────────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/92 backdrop-blur-xl border-slate-200/80 shadow-soft py-2'
            : 'bg-white/95 backdrop-blur-md border-slate-200/60 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex items-center justify-between h-14">

            {/* Brand Logo with Monogram Badge */}
            <Link to="/" className="flex items-center gap-3.5 flex-shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-center font-extrabold text-lg shadow-sm border border-white/20 group-hover:scale-105 transition-transform duration-300">
                <span className="bg-gradient-to-b from-white to-amber-200 bg-clip-text text-transparent">
                  S
                </span>
              </div>
              <div className="flex flex-col">
                <span
                  className="font-extrabold text-base tracking-tight leading-none text-slate-900 group-hover:text-indigo-600 transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  SHIVAM ELECTRONICS
                </span>
                <span className="text-[9px] font-extrabold tracking-[0.24em] uppercase text-indigo-600 mt-1">
                  Jolva Flagship Showroom
                </span>
              </div>
            </Link>

            {/* Streamlined Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive =
                  link.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.to);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Tools */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                onClick={() => setIsSearchOpen(p => !p)}
                aria-label="Search Catalog"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
                title="Search collection"
              >
                <Search size={18} />
              </button>

              {/* Shopping Cart Button with Count Badge */}
              <button
                onClick={openCart}
                aria-label="View Shopping Cart"
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
                title="Shopping Cart & Showroom Tokens"
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Customer Account / Sign In Dropdown */}
              <div className="relative">
                {isCustomerLoggedIn && customer ? (
                  <div>
                    <button
                      onClick={() => setIsUserMenuOpen(p => !p)}
                      className="flex items-center gap-2 py-1 px-2 sm:px-2.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
                      title="Customer Profile & Tokens"
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[80px] truncate">
                        {customer.name.split(' ')[0]}
                      </span>
                      <ChevronDown size={12} className="text-slate-400 hidden sm:inline" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900 truncate">{customer.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{customer.email}</p>
                        </div>
                        <Link
                          to="/my-tokens"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Ticket size={15} className="text-indigo-600" />
                          <span>My Showroom Tokens</span>
                        </Link>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut size={15} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-bold rounded-full hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
                    title="Customer Sign In"
                  >
                    <User size={15} />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}
              </div>

              <Link
                to="/contact?tab=booking"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-full bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md transition-all active:scale-95 shadow-sm"
              >
                <span>Book Visit</span>
                <ArrowRight size={13} />
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(p => !p)}
                aria-label="Toggle menu"
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-900 transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Drawer */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-slate-200 bg-white/98 backdrop-blur-xl overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 md:px-10 py-4">
                <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search 4K OLED TVs, Inverter Refrigerators, Teakwood Beds, ACs..."
                    className="w-full pl-12 pr-24 py-3 text-sm focus:outline-none border border-slate-200 rounded-full bg-slate-50 text-slate-900 focus:border-indigo-500 focus:bg-white shadow-xs transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-xs font-bold rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    Search
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-slate-200 bg-white overflow-hidden shadow-medium"
            >
              <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-1.5">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-bold rounded-xl text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Showroom Tokens Link */}
                <Link
                  to="/my-tokens"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl text-indigo-700 bg-indigo-50/70 hover:bg-indigo-50 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Ticket size={16} className="text-indigo-600" />
                    My Showroom Tokens
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-600 text-white">Vouchers</span>
                </Link>

                {/* Customer Account / Sign In State */}
                <div className="pt-2">
                  {isCustomerLoggedIn && customer ? (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{customer.name}</p>
                        <p className="text-[11px] text-slate-500">{customer.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          signOut();
                        }}
                        className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3 text-xs font-bold rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <User size={15} />
                      <span>Sign In / Create Account</span>
                    </button>
                  )}
                </div>

                <div className="mt-2 pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <Link
                    to="/contact?tab=booking"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 text-sm font-bold rounded-full bg-indigo-600 text-white shadow-sm"
                  >
                    Book Showroom Visit <ArrowRight size={14} />
                  </Link>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold border border-slate-300 rounded-full text-slate-800 text-center hover:bg-slate-50 transition-colors"
                  >
                    <Phone size={13} /> Call {formattedPhone}
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Page Content ─────────────────────────────────────── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── Prestigious Obsidian Showroom Footer ────────────────── */}
      <footer className="bg-[#0B0F19] text-slate-300 border-t border-slate-800 pt-16 sm:pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          
          {/* Main 4-Column Editorial Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">

            {/* Col 1 (4 cols): Brand Identity & Showroom Coordinates */}
            <div className="lg:col-span-4 space-y-5">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-900 text-white flex items-center justify-center font-extrabold text-lg shadow-sm border border-white/20">
                  <span className="text-amber-300">S</span>
                </div>
                <div>
                  <span className="font-extrabold text-lg tracking-tight text-white block" style={{ fontFamily: 'var(--font-heading)' }}>
                    SHIVAM ELECTRONICS
                  </span>
                  <span className="block text-[9px] font-extrabold tracking-[0.24em] uppercase text-indigo-400">
                    Electronics &amp; Furniture · Jolva
                  </span>
                </div>
              </Link>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
                Jolva's premier destination for 4K OLED televisions, inverter refrigeration, AI smart laundry appliances, and handcrafted solid teakwood furniture.
              </p>

              {/* Verified Contact Points */}
              <div className="space-y-2.5 text-xs text-slate-300 pt-1">
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 text-indigo-400 shrink-0" />
                  <span>
                    Shop F-8, JB Shopping Center, Jolva Patiya, Near Bagumra, Kadodara-Bardoli Road, Gujarat 394327
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={15} className="text-emerald-400 shrink-0" />
                  <a href={`tel:${cleanPhone}`} className="hover:text-white transition-colors font-semibold">
                    {formattedPhone}
                  </a>
                  <span className="text-slate-600">·</span>
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">
                    WhatsApp Chat
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-indigo-400 shrink-0" />
                  <a href="mailto:info@shivamelectronics.com" className="hover:text-white transition-colors">
                    info@shivamelectronics.com
                  </a>
                </div>
              </div>

              {/* Crisp Branded SVG Social Icons */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={profile.socialLinks?.facebook || 'https://facebook.com/shivamelectronics'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Shivam Electronics Facebook"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all"
                >
                  <FacebookIcon />
                </a>
                <a
                  href={profile.socialLinks?.instagram || 'https://instagram.com/shivamelectronics'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Shivam Electronics Instagram"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all"
                >
                  <InstagramIcon />
                </a>
                <a
                  href={profile.socialLinks?.youtube || 'https://youtube.com/@shivamelectronics'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Shivam Electronics YouTube"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all"
                >
                  <YouTubeIcon />
                </a>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Shivam Electronics WhatsApp"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all"
                >
                  <WhatsAppIcon />
                </a>
              </div>
            </div>

            {/* Col 2 (3 cols): Curated Showroom Departments */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-white mb-5">
                Showroom Departments
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/categories/televisions" className="hover:text-white transition-colors">4K OLED TVs &amp; Home Cinema</Link></li>
                <li><Link to="/categories/refrigerators" className="hover:text-white transition-colors">Frost-Free Refrigerators</Link></li>
                <li><Link to="/categories/washing-machines" className="hover:text-white transition-colors">Front &amp; Top Load Washers</Link></li>
                <li><Link to="/categories/air-conditioners" className="hover:text-white transition-colors">Inverter Air Conditioners</Link></li>
                <li><Link to="/categories/beds" className="hover:text-white transition-colors">Solid Teakwood Storage Beds</Link></li>
                <li><Link to="/categories/almirahs" className="hover:text-white transition-colors">Heavy Steel Wardrobes</Link></li>
                <li><Link to="/categories/home-mandir" className="hover:text-white transition-colors">Carved Puja Mandirs</Link></li>
                <li><Link to="/categories/furniture" className="hover:text-white transition-colors">Living &amp; Dining Furniture</Link></li>
              </ul>
            </div>

            {/* Col 3 (2 cols): Showroom & Experience */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-white mb-5">
                Experience
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/gallery" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Showroom Gallery</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Our Store</Link></li>
                <li><Link to="/brands" className="hover:text-white transition-colors">Authorized Brands</Link></li>
                <li><Link to="/offers" className="hover:text-white transition-colors">Festive Savings</Link></li>
                <li><Link to="/contact?tab=booking" className="hover:text-white transition-colors">Book a Live Demo</Link></li>
                <li>
                  <a
                    href="https://maps.app.goo.gl/yaPUQR26M6jbg49F9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Google Maps Listing <ExternalLink size={11} />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4 (3 cols): Showroom Visiting Hours Card */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-white mb-5">
                Visiting Hours
              </h4>
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-soft">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Open All 7 Days
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-300">
                  <p className="flex justify-between font-medium">
                    <span>Monday – Saturday:</span>
                    <span className="text-white font-bold">10 AM – 9 PM</span>
                  </p>
                  <p className="flex justify-between font-medium">
                    <span>Sunday:</span>
                    <span className="text-white font-bold">11 AM – 7 PM</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <p className="text-[11px] text-slate-400 mb-1.5 font-medium">Showroom Direct Line:</p>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Phone size={13} /> {formattedPhone}
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Trust Guarantees Bar */}
          <div className="pt-8 pb-10 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-400 shrink-0" /> 100% Genuine Brand Warranty
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400 shrink-0" /> Zero-Cost EMI Available
            </span>
            <span className="flex items-center gap-2">
              <Truck size={16} className="text-emerald-400 shrink-0" /> Free Jolva &amp; Surat Delivery
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-rose-400 shrink-0" /> Live In-Store Demo
            </span>
          </div>

          {/* Bottom Copyright & Policy Strip */}
          <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} Shivam Electronics &amp; Home Furnishings Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-slate-300 transition-colors">Showroom Pin</Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white transition-colors flex items-center gap-1 font-semibold ml-2"
              >
                Top <ChevronUp size={14} />
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Action: WhatsApp Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-5 z-40 flex flex-col gap-2.5">
        <a
          href={`https://wa.me/${waNumber}?text=Hello%20Shivam%20Electronics%2C%20I%20have%20an%20enquiry%20regarding%20showroom%20products`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-13 h-13 rounded-full flex items-center justify-center bg-[#25D366] text-white shadow-strong hover:scale-110 active:scale-95 transition-transform"
          title="Chat with Showroom on WhatsApp"
        >
          <WhatsAppIcon />
        </a>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-white/95 backdrop-blur-md flex items-center justify-around h-14 px-1 shadow-strong"
        style={{ borderColor: 'var(--color-border)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 ${
            location.pathname === '/' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <span>Home</span>
        </Link>

        <Link
          to="/products"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 ${
            location.pathname.startsWith('/products') ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <span>Shop</span>
        </Link>

        {/* Mobile Cart Button */}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 text-slate-700"
          aria-label="Open Cart"
        >
          <div className="relative">
            <ShoppingBag size={17} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        {/* Mobile Showroom Tokens Link */}
        <Link
          to="/my-tokens"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 ${
            location.pathname === '/my-tokens' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Ticket size={17} />
          <span>Tokens</span>
        </Link>

        <Link
          to="/contact"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 ${
            location.pathname === '/contact' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <span>Showroom</span>
        </Link>
      </nav>

      {/* Customer Authentication Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}
