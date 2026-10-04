import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, CreditCard, Wrench, Award, CheckCircle2 } from 'lucide-react';
import { contentApi } from '../services/contentApi';
import { companyApi, DEFAULT_COMPANY_PROFILE } from '../services/companyApi';
import type { AboutSection, CompanyProfile } from '../types/business';
import ScrollReveal from '../components/ScrollReveal';

export default function About() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_COMPANY_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      contentApi.getAboutSections(),
      companyApi.getProfile(),
    ]).then(([aboutRes, compRes]) => {
      if (aboutRes.data) setSections(aboutRes.data);
      if (compRes.data) setProfile(compRes.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen py-10 md:py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--color-border)] bg-[var(--color-surface)]" style={{ color: 'var(--color-primary)' }}>
            ✦ Est. {profile.foundedYear || 2010} · {profile.city}
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
            Technology & Comfort for Every Home
          </h1>
          <p className="text-base sm:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            {profile.tagline || 'Connecting households to verified high-performance electronics and artisanal furniture with honest advice and enduring quality.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 lg:mb-24">
          {[
            { value: '15+ Years', label: 'Of Local Trust & Integrity' },
            { value: '15,000+', label: 'Delighted Households Served' },
            { value: '100%', label: 'Authentic Brand Warranty' },
            { value: '24–48 Hrs', label: 'Express Delivery & Setup' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-[2rem] border text-center transition-all shadow-soft"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <p className="text-2xl sm:text-4xl font-extrabold mb-1" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Dynamic Story & Showroom Narrative Sections */}
        <div className="space-y-16 lg:space-y-24 mb-20 lg:mb-28">
          {sections.map((section, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={section.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Text Content */}
                <div className={`lg:col-span-6 ${isReversed ? 'lg:order-2' : ''}`}>
                  {section.subtitle && (
                    <span className="text-[11px] font-extrabold uppercase tracking-widest block mb-2" style={{ color: 'var(--color-accent)' }}>
                      {section.subtitle}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-4xl font-extrabold mb-5 leading-tight" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                    {section.title}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line" style={{ color: 'var(--color-text-muted)' }}>
                    {section.content}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/contact?tab=booking"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white transition-all shadow-sm hover:opacity-90"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Visit the Showroom <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Imagery */}
                <div className={`lg:col-span-6 ${isReversed ? 'lg:order-1' : ''}`}>
                  <div className="relative rounded-[2.5rem] overflow-hidden border shadow-soft aspect-[4/3] group" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-soft)' }}>
                    {section.imageUrl ? (
                      <img
                        src={section.imageUrl}
                        alt={section.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🏛️
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Factors Showcase */}
        <div
          className="p-8 sm:p-14 rounded-[3rem] border mb-16 shadow-soft"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
              The Shivam Electronics Standard
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Why thousands of discerning homeowners across the region choose us for their technology and living spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Authorized Dealer',
                desc: 'Official direct retail partner for Sony, LG, Samsung, Haier, Godrej and leading manufacturers.',
              },
              {
                icon: CreditCard,
                title: 'Easy Zero-Cost EMI',
                desc: 'Paperless, instant spot financing with Bajaj Finserv, HDB, and all major bank cards.',
              },
              {
                icon: Truck,
                title: 'Free Prompt Delivery',
                desc: 'Careful transit and professional doorstep assembly by trained logistics specialists.',
              },
              {
                icon: Wrench,
                title: 'Showroom After-Sales Care',
                desc: 'We assist with brand warranty bookings and technician dispatch throughout your product lifecycle.',
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[2rem] border transition-transform hover:-translate-y-1"
                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)' }}>
                  <pillar.icon size={22} />
                </div>
                <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                  {pillar.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div
          className="p-10 sm:p-16 rounded-[3rem] text-center relative overflow-hidden"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)' }}
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Step Into Our Showroom Today
            </h2>
            <p className="text-sm sm:text-base opacity-85 mb-8 leading-relaxed">
              Experience the latest 4K screens, home theater sound, smart cooling, and durable handcrafted wooden furniture in person.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/gallery"
                className="px-8 py-3.5 rounded-full text-xs font-bold transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)' }}
              >
                View Showroom Gallery
              </Link>
              <Link
                to="/contact?tab=booking"
                className="px-8 py-3.5 rounded-full text-xs font-bold border text-white transition-all hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.4)' }}
              >
                Schedule Showroom Demo
              </Link>
              <a
                href="https://maps.app.goo.gl/yaPUQR26M6jbg49F9"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full text-xs font-bold border text-white transition-all hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.4)' }}
              >
                Open Google Maps ↗
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
