import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, isConfigured } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isConfigured) {
      setError('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      setLoading(false);
      return;
    }

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream/30 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="heading-serif text-3xl font-semibold text-espresso mb-2">
            Admin Access
          </h1>
          <p className="text-taupe text-sm">Mimiko Studio Management Panel</p>
        </div>

        <div className="bg-white p-8 shadow-sm border border-champagne/30">
          {!isConfigured && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-sm text-amber-800">
              <p className="font-medium mb-1">Setup Required</p>
              <p className="text-xs">Create a <code>.env</code> file with your Supabase credentials:</p>
              <code className="text-xs block mt-2 bg-amber-100 p-2 rounded">
                VITE_SUPABASE_URL=...<br />
                VITE_SUPABASE_ANON_KEY=...
              </code>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-champagne bg-ivory px-4 py-3 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors"
                placeholder="admin@mimikostudio.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-champagne bg-ivory px-4 py-3 pr-12 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-espresso transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-espresso text-ivory py-3 text-sm font-sans font-medium hover:bg-espresso/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock size={16} />
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-taupe mt-6">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
