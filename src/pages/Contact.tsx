import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Check, Send, Calendar, Compass, ArrowRight, ShieldCheck, ExternalLink, Star, Navigation, Camera } from 'lucide-react';
import { enquiriesApi } from '../services/electronicsApi';
import { bookingsApi } from '../services/bookingsApi';
import { companyApi, DEFAULT_COMPANY_PROFILE } from '../services/companyApi';
import type { CompanyProfile, BookingType } from '../types/business';
import ScrollReveal from '../components/ScrollReveal';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'booking' ? 'booking' : 'enquiry';
  const [activeTab, setActiveTab] = useState<'enquiry' | 'booking'>(initialTab);

  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_COMPANY_PROFILE);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Enquiry Form State
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    bookingType: 'SHOWROOM_VISIT' as BookingType,
    preferredDate: '',
    preferredTime: '11:00 AM',
    productInterest: '',
    notes: '',
  });

  useEffect(() => {
    companyApi.getProfile().then(res => {
      if (res.data) setProfile(res.data);
    });
  }, []);

  useEffect(() => {
    if (searchParams.get('tab') === 'booking') {
      setActiveTab('booking');
    }
  }, [searchParams]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await enquiriesApi.create({
      customerName: enquiryForm.name,
      customerEmail: enquiryForm.email,
      customerPhone: enquiryForm.phone,
      enquiryType: 'GENERAL',
      message: `${enquiryForm.subject ? `Subject: ${enquiryForm.subject}\n\n` : ''}${enquiryForm.message}`,
    });
    setLoading(false);
    setSubmitted(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await bookingsApi.createBooking({
      customerName: bookingForm.name,
      customerPhone: bookingForm.phone,
      customerEmail: bookingForm.email,
      productName: bookingForm.productInterest || undefined,
      bookingType: bookingForm.bookingType,
      requestedDate: bookingForm.preferredDate || new Date().toISOString().split('T')[0],
      requestedTime: bookingForm.preferredTime,
      message: bookingForm.notes,
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-10 md:py-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--color-border)] bg-[var(--color-surface)]" style={{ color: 'var(--color-primary)' }}>
            <Compass size={13} /> {profile.city} Showroom & Consultations
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
            Visit the Showroom or Reach Out
          </h1>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Experience OLED displays, inverter cooling systems, and handcrafted solid teakwood furniture in person. Our product specialists are ready to assist you.
          </p>
        </div>

        {/* ─── SHOWROOM SPOTLIGHT: GOOGLE MAPS EMBED & REAL PHOTOS ─── */}
        <div className="mb-14 sm:mb-20">
          <div
            className="rounded-[2.5rem] md:rounded-[3.5rem] p-6 sm:p-10 md:p-12 border shadow-soft overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            {/* Top Bar: Google Maps Business Header & Action CTAs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-200/80 mb-8">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="glass-pill text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 inline-flex items-center gap-1.5">
                    <Star size={13} className="fill-amber-400 text-amber-400" /> 4.9 ★ Google Maps Verified
                  </span>
                  <span className="glass-pill text-[11px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200">
                    Jolva, Surat District, Gujarat
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  {profile.displayName || 'Shivam Electronics Jolva'}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Panchratna Complex, Kadodara - Bardoli Road, Jolva, Gujarat 394305 · Open Monday – Sunday (09:30 AM – 09:30 PM)
                </p>
              </div>

              {/* Exact Requested Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href="https://www.google.com/maps/place/SHIVAM+ELECTRONICS+JOLVA/@21.1587231,72.9990783,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDtp_msbw!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FANWiy9RMh-IsqZ2nDU6W94_-_QES_yEIZJEsJzRga6Tr2wYM8Z1UfRJJfj0HSYdWp9OQvLlm3iVVJzJ2bQprW4_7wIYt1gX8_fF-p0v0Z0RW_4KUbKVFrlWvCmAAYs8j0tmrlmfP0vaZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary py-3 px-6 text-xs sm:text-sm font-bold gap-2 shadow-md hover:scale-[1.02] transition-transform"
                >
                  <Camera size={15} /> See all photos on Google Maps
                </a>

                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=21.1587948,72.9991155"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline py-3 px-6 text-xs sm:text-sm font-bold gap-2 hover:bg-[var(--color-surface-soft)] transition-colors"
                >
                  <Navigation size={15} /> Get directions
                </a>
              </div>
            </div>

            {/* Split View: Live Google Maps Embed + Real Store Photographs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left (7 Cols): Google Maps Live Interactive Embed */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div className="rounded-[2rem] overflow-hidden border border-slate-200 h-[380px] sm:h-[440px] shadow-sm relative bg-slate-100 w-full">
                  <iframe
                    title="Shivam Electronics Jolva Google Maps Embed"
                    src="https://maps.google.com/maps?q=21.1587948,72.9991155&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                  <div className="absolute bottom-4 left-4 glass-panel px-4 py-2 rounded-full text-xs font-bold text-slate-900 flex items-center gap-2 shadow-md">
                    <MapPin size={13} className="text-indigo-600" />
                    <span>Panchratna Complex, Kadodara-Bardoli Rd, Jolva</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 px-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock size={13} className="text-slate-500" /> Open 7 days a week: 09:30 AM – 09:30 PM
                  </span>
                  <a
                    href="https://maps.app.goo.gl/yaPUQR26M6jbg49F9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    Open in Google Maps App <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Right (5 Cols): Real Showroom Photographs from Google Maps & Store */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Camera size={16} className="text-indigo-600" /> Real Showroom Photos
                  </h3>
                  <Link
                    to="/gallery"
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    Full Gallery (12+ photos) →
                  </Link>
                </div>

                {/* Featured Big Google Maps Photo */}
                <a
                  href="https://www.google.com/maps/place/SHIVAM+ELECTRONICS+JOLVA/@21.1587231,72.9990783,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDtp_msbw!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FANWiy9RMh-IsqZ2nDU6W94_-_QES_yEIZJEsJzRga6Tr2wYM8Z1UfRJJfj0HSYdWp9OQvLlm3iVVJzJ2bQprW4_7wIYt1gX8_fF-p0v0Z0RW_4KUbKVFrlWvCmAAYs8j0tmrlmfP0vaZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-[2rem] overflow-hidden aspect-[16/10] shadow-soft border border-slate-200 block bg-slate-100"
                >
                  <img
                    src="https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RMh-IsqZ2nDU6W94_-_QES_yEIZJEsJzRga6Tr2wYM8Z1UfRJJfj0HSYdWp9OQvLlm3iVVJzJ2bQprW4_7wIYt1gX8_fF-p0v0Z0RW_4KUbKVFrlWvCmAAYs8j0tmrlmfP0vaZ=w1200"
                    alt="Shivam Electronics Jolva Storefront from Google Maps"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&q=85';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-4 text-white">
                    <div>
                      <span className="glass-pill text-[10px] font-extrabold uppercase tracking-wider text-slate-900 bg-white/95 block mb-1">
                        ✦ Direct Google Maps Photo
                      </span>
                      <p className="text-xs font-bold">Main Entrance &amp; Appliance Aisles</p>
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Star size={12} className="fill-amber-400" /> 4.9 ★
                    </span>
                  </div>
                </a>

                {/* 3-Thumbnail Row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      name: '4K TV Wall',
                      img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80',
                    },
                    {
                      name: 'Refrigerators',
                      img: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&q=80',
                    },
                    {
                      name: 'Teak Beds',
                      img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=80',
                    },
                  ].map((thumb, idx) => (
                    <Link
                      key={idx}
                      to="/gallery"
                      className="group relative rounded-2xl overflow-hidden aspect-square border border-slate-200 shadow-xs block bg-slate-100"
                    >
                      <img
                        src={thumb.img}
                        alt={thumb.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-2 text-white">
                        <span className="text-[10px] font-bold leading-tight line-clamp-1">{thumb.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="pt-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>✦ 100% Genuine Brands</span>
                  <span>✦ Zero-Cost EMI Desk</span>
                  <span>✦ Free Parking</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Main Architectural Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Showroom Contact Hub (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className="p-8 rounded-[2rem] border relative overflow-hidden transition-all shadow-soft"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="relative z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest block mb-2" style={{ color: 'var(--color-accent)' }}>
                  Flagship Store
                </span>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                  {profile.displayName}
                </h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-primary)' }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-extrabold tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Showroom Address</p>
                      <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--color-primary)' }}>
                        {profile.addressLine1}
                        {profile.addressLine2 ? `, ${profile.addressLine2}` : ''}
                        <br />
                        {profile.area ? `${profile.area}, ` : ''}{profile.city}, {profile.state} - {profile.postalCode}
                      </p>
                      {profile.googleMapsUrl && (
                        <a
                          href={profile.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold mt-2 hover:underline"
                          style={{ color: 'var(--color-accent)' }}
                        >
                          Open in Google Maps <ArrowRight size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Phone & WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-primary)' }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-extrabold tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Direct Telephone</p>
                      <a href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} className="text-sm font-bold block hover:underline" style={{ color: 'var(--color-primary)' }}>
                        {profile.phone}
                      </a>
                      {profile.alternatePhone && (
                        <a href={`tel:${profile.alternatePhone.replace(/[^0-9+]/g, '')}`} className="text-xs block mt-1 hover:underline" style={{ color: 'var(--color-text-muted)' }}>
                          Alt: {profile.alternatePhone}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-primary)' }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-extrabold tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Email Correspondence</p>
                      <a href={`mailto:${profile.email}`} className="text-sm font-semibold hover:underline block" style={{ color: 'var(--color-primary)' }}>
                        {profile.email}
                      </a>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-primary)' }}>
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-extrabold tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Store Timings</p>
                      <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--color-primary)' }}>
                        {profile.openingHours}
                      </p>
                      {profile.holidayInfo && (
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                          {profile.holidayInfo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Showroom Perks */}
                <div className="mt-8 pt-6 border-t flex flex-wrap gap-4 text-xs font-medium" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600" /> Free Parking</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600" /> Live Demo Booths</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600" /> Instant EMI Desk</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div
              className="p-6 rounded-[2rem] border flex items-center justify-between gap-4"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#25D366]">Instant WhatsApp</p>
                <p className="text-sm font-bold text-[var(--color-primary)]">Chat with a Showroom Advisor</p>
              </div>
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(profile.displayName)}%2C%20I%20have%20an%20enquiry`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full text-xs font-extrabold text-white bg-[#25D366] hover:opacity-90 transition-opacity"
              >
                Chat Now
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Tabbed Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div
              className="p-8 sm:p-10 rounded-[2.5rem] border shadow-soft"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              {/* Tab Selector */}
              <div className="flex items-center gap-2 p-1.5 rounded-full mb-8 border max-w-md" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-soft)' }}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('enquiry'); setSubmitted(false); }}
                  className={`flex-1 py-2.5 text-xs font-extrabold rounded-full transition-all ${
                    activeTab === 'enquiry'
                      ? 'bg-[var(--color-primary)] text-[var(--color-surface)] shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  Send Enquiry
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('booking'); setSubmitted(false); }}
                  className={`flex-1 py-2.5 text-xs font-extrabold rounded-full transition-all ${
                    activeTab === 'booking'
                      ? 'bg-[var(--color-primary)] text-[var(--color-surface)] shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  Book Showroom Visit
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-12 px-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check size={32} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                    {activeTab === 'booking' ? 'Visit Request Received!' : 'Thank You for Reaching Out!'}
                  </h3>
                  <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    {activeTab === 'booking'
                      ? 'Our showroom manager will call to confirm your appointment time and have the demo displays prepped for you.'
                      : 'Your message has been assigned to our showroom sales team. We will respond promptly within store hours.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn btn-primary mt-4 py-2.5 px-6 text-xs"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : activeTab === 'enquiry' ? (
                /* Enquiry Form */
                <form onSubmit={handleEnquirySubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={enquiryForm.name}
                        onChange={e => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                        placeholder="e.g. Ramesh Patel"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={enquiryForm.phone}
                        onChange={e => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="+91 98765 00000"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={enquiryForm.email}
                        onChange={e => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="name@example.com"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Product of Interest
                      </label>
                      <input
                        type="text"
                        value={enquiryForm.subject}
                        onChange={e => setEnquiryForm({ ...enquiryForm, subject: e.target.value })}
                        placeholder="e.g. Sony 55 OLED TV, Teakwood Double Bed"
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      How can we assist you? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={enquiryForm.message}
                      onChange={e => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      placeholder="Ask about current showroom offers, festive discounts, technical specifications, or delivery timeline..."
                      className="input py-3"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3.5 text-sm font-bold gap-2"
                  >
                    {loading ? 'Submitting...' : <><Send size={15} /> Submit Showroom Enquiry</>}
                  </button>
                </form>
              ) : (
                /* Showroom Visit / Booking Form */
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingForm.name}
                        onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                        placeholder="e.g. Anita Sharma"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={bookingForm.phone}
                        onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        placeholder="+91 98765 00000"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Consultation Type *
                      </label>
                      <select
                        value={bookingForm.bookingType}
                        onChange={e => setBookingForm({ ...bookingForm, bookingType: e.target.value as BookingType })}
                        className="input text-xs"
                      >
                        <option value="SHOWROOM_VISIT">General Showroom Visit</option>
                        <option value="DEMONSTRATION">Live Product Demonstration (TV/Audio)</option>
                        <option value="FURNITURE_CONSULTATION">Furniture & Wood Polish Consultation</option>
                        <option value="PRODUCT_CONSULTATION">Home Appliance Package Planning</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Product / Department Interest
                      </label>
                      <input
                        type="text"
                        value={bookingForm.productInterest}
                        onChange={e => setBookingForm({ ...bookingForm, productInterest: e.target.value })}
                        placeholder="e.g. 65-inch QLED or Wardrobe Unit"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.preferredDate}
                        onChange={e => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Preferred Time Slot *
                      </label>
                      <select
                        value={bookingForm.preferredTime}
                        onChange={e => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                        className="input text-xs"
                      >
                        <option value="11:00 AM">Morning: 11:00 AM - 01:00 PM</option>
                        <option value="03:00 PM">Afternoon: 03:00 PM - 05:00 PM</option>
                        <option value="06:00 PM">Evening: 06:00 PM - 08:30 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      Special Requirements or Specific Models
                    </label>
                    <textarea
                      rows={3}
                      value={bookingForm.notes}
                      onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      placeholder="Let us know if you'd like a side-by-side display comparison or specific dimensions for furniture..."
                      className="input py-3"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3.5 text-sm font-bold gap-2"
                  >
                    {loading ? 'Submitting...' : <><Calendar size={15} /> Confirm Showroom Appointment</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
