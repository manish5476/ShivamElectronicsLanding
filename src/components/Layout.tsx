import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

interface LayoutProps {
  children: React.ReactNode;
  onBookClick?: () => void;
}

export default function Layout({ children, onBookClick }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/collections', label: 'Collections' },
    { to: '/navratri', label: 'Navratri' },
    { to: '/embroidery', label: 'Embroidery' },
    { to: '/custom-design', label: 'Custom Designs' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Announcement Bar */}
      <div className="bg-espresso text-ivory/90 text-center py-2.5 px-4 text-[10px] tracking-[0.2em] uppercase font-sans font-medium">
        <span className="inline-flex items-center gap-3">
          <span className="w-1 h-1 bg-light-gold rounded-full"></span>
          Handcrafted with love
          <span className="w-1 h-1 bg-light-gold rounded-full"></span>
          Free consultation for custom designs
          <span className="w-1 h-1 bg-light-gold rounded-full"></span>
        </span>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'glass shadow-sm border-b border-champagne/20'
            : 'bg-ivory border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="h-12 lg:h-16 object-contain" />
              ) : (
                <div className="flex flex-col">
                  <span className="heading-serif text-2xl lg:text-[1.75rem] font-semibold text-espresso tracking-wide leading-none">
                    MIMIKO
                  </span>
                  <span className="text-[9px] tracking-[0.3em] text-muted-gold font-sans font-medium mt-0.5">
                    ATELIER
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="gold-underline text-[13px] font-sans font-medium text-espresso/70 hover:text-espresso transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA + Mobile Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBookClick}
                className="hidden lg:inline-flex items-center gap-2 btn-primary"
              >
                <ShoppingBag size={13} />
                Book Consultation
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-espresso"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-ivory border-t border-champagne/30"
            >
              <nav className="px-6 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block text-base font-sans text-espresso/80 hover:text-espresso py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={onBookClick}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-espresso text-ivory px-5 py-3 text-sm font-sans font-medium rounded-sm"
                >
                  <ShoppingBag size={14} />
                  Book a Design
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-espresso text-ivory/80 relative overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-light-gold/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                {(settings.logoDarkUrl || settings.logoUrl) ? (
                  <img 
                    src={settings.logoDarkUrl || settings.logoUrl} 
                    alt={settings.siteName} 
                    className="h-16 object-contain" 
                  />
                ) : (
                  <>
                    <h3 className="heading-serif text-3xl font-semibold text-ivory leading-none">
                      MIMIKO
                    </h3>
                    <p className="text-[10px] tracking-[0.3em] text-light-gold font-sans font-medium mt-1">
                      ATELIER
                    </p>
                  </>
                )}
              </div>
              <p className="text-sm leading-relaxed text-ivory/60 mb-4">
                Jewellery • Ornaments • Embroidery • Custom Designs
              </p>
              <div className="ornament-divider justify-start my-6">
                <div className="w-12 h-px bg-gradient-to-r from-light-gold/50 to-transparent"></div>
              </div>
              <p className="text-sm italic text-ivory/50 heading-serif">
                "{settings.siteTagline}"
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.2em] text-light-gold mb-6 font-sans font-medium">
                Explore
              </h4>
              <ul className="space-y-4">
                {[
                  { to: '/collections', label: 'Collections' },
                  { to: '/navratri', label: 'Navratri' },
                  { to: '/embroidery', label: 'Embroidery' },
                  { to: '/custom-design', label: 'Custom Designs' },
                  { to: '/gallery', label: 'Gallery' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-ivory/60 hover:text-light-gold transition-colors gold-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-light-gold mb-4 font-sans font-medium">
                Information
              </h4>
              <ul className="space-y-3">
                {[
                  { to: '/about', label: 'About' },
                  { to: '/contact', label: 'Contact' },
                  { to: '/faq', label: 'FAQ' },
                  { to: '/privacy', label: 'Privacy Policy' },
                  { to: '/terms', label: 'Terms & Booking Policy' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-ivory/60 hover:text-light-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.2em] text-light-gold mb-6 font-sans font-medium">
                Get in Touch
              </h4>
              <ul className="space-y-4 text-sm text-ivory/60">
                <li>
                  <a href="mailto:hello@mimikostudio.com" className="hover:text-light-gold transition-colors gold-underline">
                    hello@mimikostudio.com
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/mimikostudio" target="_blank" rel="noopener noreferrer" className="hover:text-light-gold transition-colors gold-underline">
                    @mimikostudio
                  </a>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  to="/booking"
                  className="inline-block border border-light-gold/50 text-light-gold px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase font-sans font-medium hover:bg-light-gold hover:text-espresso transition-all duration-300"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-20 pt-8 border-t border-ivory/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-ivory/40 tracking-wide">
                © {new Date().getFullYear()} Mimiko Studio. All rights reserved.
              </p>
              <div className="flex items-center gap-8">
                <Link to="/privacy" className="text-[11px] text-ivory/40 hover:text-light-gold transition-colors tracking-wide">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-[11px] text-ivory/40 hover:text-light-gold transition-colors tracking-wide">
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
