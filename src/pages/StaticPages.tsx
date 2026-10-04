import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { contentApi } from '../services/contentApi';
import { companyApi, DEFAULT_COMPANY_PROFILE } from '../services/companyApi';
import type { CompanyPolicy, CompanyProfile } from '../types/business';
import ScrollReveal from '../components/ScrollReveal';

export function Privacy() {
  const [policy, setPolicy] = useState<CompanyPolicy | null>(null);
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_COMPANY_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      contentApi.getPolicyBySlug('privacy'),
      companyApi.getProfile(),
    ]).then(([polRes, compRes]) => {
      if (polRes.data) setPolicy(polRes.data);
      if (compRes.data) setProfile(compRes.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen py-12 md:py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold mb-8 hover:opacity-75 transition-opacity"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft size={14} /> Back to Showroom
        </Link>

        {/* Header Container */}
        <div
          className="p-8 sm:p-12 rounded-[2.5rem] border mb-10 shadow-soft"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-primary)' }}>
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: 'var(--color-accent)' }}>
              Legal & Trust
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
            {policy?.title || 'Privacy Policy'}
          </h1>
          <p className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            Last revised: {policy?.updatedAt ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Current Version'} · Version {policy?.version || '1.0'}
          </p>
        </div>

        {/* Content Box */}
        <div
          className="p-8 sm:p-12 rounded-[2.5rem] border mb-10 shadow-soft prose prose-stone max-w-none"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          {policy?.content ? (
            <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text)' }}>
              {policy.content}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading policy details...</p>
          )}

          {/* Contact Verification */}
          <div className="mt-12 pt-8 border-t not-prose space-y-3" style={{ borderColor: 'var(--color-border)' }}>
            <h4 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
              Privacy & Data Inquiries
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              If you have any questions regarding your data privacy, invoice records, or warranty data, please contact our showroom office directly:
            </p>
            <div className="flex flex-wrap gap-6 pt-2 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
              <span className="flex items-center gap-1.5"><Mail size={13} /> {profile.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={13} /> {profile.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} /> {profile.city}, {profile.state}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function Terms() {
  const [policy, setPolicy] = useState<CompanyPolicy | null>(null);
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_COMPANY_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      contentApi.getPolicyBySlug('terms'),
      companyApi.getProfile(),
    ]).then(([polRes, compRes]) => {
      if (polRes.data) setPolicy(polRes.data);
      if (compRes.data) setProfile(compRes.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen py-12 md:py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold mb-8 hover:opacity-75 transition-opacity"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft size={14} /> Back to Showroom
        </Link>

        {/* Header Container */}
        <div
          className="p-8 sm:p-12 rounded-[2.5rem] border mb-10 shadow-soft"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-primary)' }}>
              <FileText size={20} />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: 'var(--color-accent)' }}>
              Retail Policy
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
            {policy?.title || 'Terms & Showroom Policy'}
          </h1>
          <p className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            Last revised: {policy?.updatedAt ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Current Version'} · Version {policy?.version || '1.0'}
          </p>
        </div>

        {/* Content Box */}
        <div
          className="p-8 sm:p-12 rounded-[2.5rem] border mb-10 shadow-soft prose prose-stone max-w-none"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          {policy?.content ? (
            <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text)' }}>
              {policy.content}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading terms & conditions...</p>
          )}

          {/* Showroom Registration Details */}
          <div className="mt-12 pt-8 border-t not-prose space-y-3" style={{ borderColor: 'var(--color-border)' }}>
            <h4 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
              Business Registration Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <div>
                <span className="font-bold text-[var(--color-primary)]">Legal Entity:</span> {profile.legalName}
              </div>
              <div>
                <span className="font-bold text-[var(--color-primary)]">GST Identification Number:</span> {profile.gstNumber || 'Available on invoice'}
              </div>
              <div>
                <span className="font-bold text-[var(--color-primary)]">Registered Address:</span> {profile.addressLine1}, {profile.city}, {profile.state}
              </div>
              <div>
                <span className="font-bold text-[var(--color-primary)]">Support Desk:</span> {profile.phone}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
