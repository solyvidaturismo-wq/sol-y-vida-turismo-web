import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, signIn, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in
  if (authLoading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos'
        : error
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-sun shadow-lg shadow-orange-500/20 mb-4">
            <Sun className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">SOL Y VIDA</h1>
          <p className="text-xs font-bold text-orange-400/80 tracking-widest uppercase mt-1">Sistema de Gestión Turística</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 space-y-6">
          <div>
            <h2 className="text-xl font-black text-white">Iniciar Sesión</h2>
            <p className="text-sm text-slate-400 mt-1">Ingresa tus credenciales para acceder al panel</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <AlertCircle size={18} className="text-rose-400 shrink-0" />
              <p className="text-sm font-medium text-rose-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input w-full pl-10"
                  placeholder="admin@solyvidaturismo.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input w-full pl-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Sol y Vida Turismo &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
