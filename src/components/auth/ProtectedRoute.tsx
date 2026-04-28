import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-sun flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse">
            <span className="text-white text-xl">☀️</span>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
