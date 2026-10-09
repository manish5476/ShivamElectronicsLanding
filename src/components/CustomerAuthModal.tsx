import { useState } from 'react';
import { X, User, Lock, Mail, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialTab?: 'signin' | 'signup';
}

export default function CustomerAuthModal({ isOpen, onClose, onSuccess, initialTab = 'signin' }: Props) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        const res = await signIn(email, password);
        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }
        setSuccessMsg('Signed in successfully!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 600);
      } else {
        if (!fullName.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const res = await signUp(email, password, fullName, phone);
        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }
        setSuccessMsg('Account created successfully! Session is now active.');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 700);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-[2rem] sm:rounded-[2.4rem] p-6 sm:p-8 shadow-2xl border border-slate-200/80 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2.5">
            <ShieldCheck size={12} className="text-indigo-600" />
            Shivam Electronics Account
          </div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {tab === 'signin' ? 'Sign In to Your Account' : 'Create Showroom Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {tab === 'signin'
              ? 'Access your purchase tokens, locked prices, and showroom reservations.'
              : 'Register once to generate instant purchase tokens and track orders.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setTab('signin'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'signin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 leading-relaxed font-medium">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-xs transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-xs transition-colors"
              />
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp Phone Number
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="e.g. 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-xs transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-xs transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{tab === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            {tab === 'signin' ? (
              <>
                New customer?{' '}
                <button
                  onClick={() => { setTab('signup'); setError(null); }}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setTab('signin'); setError(null); }}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </div>

      </div>
    </div>
  );
}
