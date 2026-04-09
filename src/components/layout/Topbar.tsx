import React from 'react';
import { 
  Bell, 
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

export function Topbar() {
  const { theme, toggleTheme, products, suppliers, fetchData } = useAppStore();
  const location = useLocation();

  // Generate breadcrumbs from path
  const pathnames = location.pathname.split('/').filter((x) => x);

  const handleResetData = async () => {
    if (confirm('¿Estás seguro de que quieres sincronizar datos con Supabase? Se perderán los cambios locales no guardados.')) {
      await fetchData();
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
        <div className="hidden md:flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 gap-3 mr-4 focus-within:border-amber-500/50 transition-all cursor-pointer">
          <Search size={16} />
          <span className="text-xs font-medium">Buscar en el inventario...</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase">Cmd K</span>
        </div>

        {/* Sync Status / Reset */}
        <button
          onClick={handleResetData}
          className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-amber-500 transition-all group"
          title="Sincronizar con Supabase"
        >
          <RefreshCcw size={20} className="group-active:rotate-180 transition-transform duration-500" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-amber-500 transition-all"
          title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-amber-500 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-slate-900" />
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-6 bg-white/10 mx-2" />

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors">Admin Sol y Vida</span>
            <span className="text-[10px] font-bold text-gray-500 tracking-tighter">Super Usuario</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-amber-500 shadow-inner group-hover:border-amber-500/50 transition-all overflow-hidden relative">
            <User size={20} />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}
