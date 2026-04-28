import React from 'react';
import {
  Moon,
  Sun,
  Search,
  User,
  RefreshCcw,
  ChevronRight,
  Home
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../store/useToastStore';
import SearchModal from '../ui/SearchModal';

export function Topbar() {
  const { theme, toggleTheme, fetchData } = useAppStore();
  const { user } = useAuth();
  const location = useLocation();

  // Generate breadcrumbs from path
  const pathnames = location.pathname.split('/').filter((x) => x);

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);

  // Cmd+K / Ctrl+K shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSyncData = async () => {
    setSyncing(true);
    try {
      await fetchData();
      toast.success('Datos sincronizados correctamente');
    } catch {
      toast.error('Error al sincronizar datos');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <header 
      className="h-16 flex items-center justify-between px-6 border-b border-white/5 shadow-sm sticky top-0 z-40"
      style={{ background: 'var(--color-topbar-bg)', backdropFilter: 'blur(10px)' }}
    >
      {/* Left: Breadcrumbs or Search */}
      <div className="flex items-center gap-4">
        <nav className="flex items-center text-xs font-semibold uppercase tracking-wider text-gray-500">
          <Link to="/" className="hover:text-amber-500 transition-colors flex items-center gap-1">
            <Home size={14} />
          </Link>
          
          {pathnames.length > 0 && <ChevronRight size={12} className="mx-2 opacity-30" />}
          
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const label = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');

            return (
              <React.Fragment key={name}>
                {isLast ? (
                  <span className="text-amber-500/90">{label}</span>
                ) : (
                  <>
                    <Link 
                      to={routeTo} 
                      className="hover:text-amber-500 transition-colors"
                    >
                      {label}
                    </Link>
                    <ChevronRight size={12} className="mx-2 opacity-30" />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Global Search Trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 gap-3 mr-4 hover:border-amber-500/50 transition-all cursor-pointer"
        >
          <Search size={16} />
          <span className="text-xs font-medium">Buscar en el inventario...</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase">Ctrl K</span>
        </button>

        {/* Sync Status */}
        <button
          onClick={handleSyncData}
          disabled={syncing}
          className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-amber-500 transition-all group disabled:opacity-50"
          title="Sincronizar con Supabase"
          aria-label="Sincronizar datos"
        >
          <RefreshCcw size={20} className={`transition-transform duration-500 ${syncing ? 'animate-spin' : 'group-active:rotate-180'}`} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-amber-500 transition-all"
          title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-6 bg-white/10 mx-2" />

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
          <div className="flex-col items-end hidden sm:flex">
            <span className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors truncate max-w-[160px]">
              {user?.email?.split('@')[0] || 'Usuario'}
            </span>
            <span className="text-[10px] font-bold text-gray-500 tracking-tighter">Administrador</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-amber-500 shadow-inner group-hover:border-amber-500/50 transition-all overflow-hidden relative">
            <User size={20} />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
        </div>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
