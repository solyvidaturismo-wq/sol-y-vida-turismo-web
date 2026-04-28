import {
  LayoutDashboard,
  Users,
  Package,
  Map,
  ChevronLeft,
  ChevronRight,
  Settings,
  PieChart,
  Layers,
  Search,
  LogOut
} from 'lucide-react';
import { useAppStore, useSidebarOpen, useSuppliers, useProducts, useRoutes } from '../../store/useAppStore';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NAV_GROUPS = [
  {
    title: 'Principal',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { id: 'explorar', label: 'Explorar', icon: Search, path: '/explorar' },
    ]
  },
  {
    title: 'Gestión',
    items: [
      { id: 'proveedores', label: 'Proveedores', icon: Users, path: '/proveedores', badgeField: 'suppliers' },
      { id: 'productos', label: 'Productos', icon: Package, path: '/productos', badgeField: 'products' },
      { id: 'rutas', label: 'Rutas / Paquetes', icon: Map, path: '/rutas', badgeField: 'routes' },
    ]
  },
  {
    title: 'Análisis y Config',
    items: [
      { id: 'reportes', label: 'Reportes', icon: PieChart, path: '/reportes' },
      { id: 'categorias', label: 'Categorías', icon: Layers, path: '/categorias' },
      { id: 'configuracion', label: 'Configuración', icon: Settings, path: '/configuracion' },
    ]
  }
];

export function Sidebar() {
  const isOpen = useSidebarOpen();
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  // Badge counts
  const suppliers = useSuppliers();
  const products = useProducts();
  const routes = useRoutes();

  const getBadgeCount = (field?: string) => {
    if (field === 'suppliers') return suppliers.length;
    if (field === 'products') return products.length;
    if (field === 'routes') return routes.length;
    return null;
  };

  return (
    <aside 
      className={`relative h-screen flex flex-col transition-all duration-300 z-50 border-r border-white/5 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
      style={{ background: 'var(--color-sidebar-bg)' }}
    >
      {/* Brand Logo */}
      <div className={`flex items-center justify-center overflow-hidden ${isOpen ? 'p-5' : 'p-3'}`}>
        <div className={`rounded-2xl bg-white/95 flex items-center justify-center shadow-lg shadow-[#7E2A21]/25 overflow-hidden transition-all ${
          isOpen ? 'w-full p-3' : 'w-12 h-12 p-1.5'
        }`}>
          <img
            src="/logo.png"
            alt="Inventario Turístico de Vélez"
            className={`w-full object-contain ${isOpen ? 'h-20' : 'h-full'}`}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-8 scrollbar-hide">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {isOpen && (
              <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                {group.title}
              </h3>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => 
                  `nav-item group relative ${isActive ? 'active' : ''}`
                }
              >
                <item.icon className={`nav-icon w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${!isOpen ? 'mx-auto' : ''}`} />
                {isOpen && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {getBadgeCount(item.badgeField) !== null && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/5 text-gray-400 group-hover:text-amber-400 transition-colors">
                        {getBadgeCount(item.badgeField)}
                      </span>
                    )}
                  </>
                )}
                
                {/* Tooltip for collapsed mode */}
                {!isOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-xl">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button
          onClick={async () => { await signOut(); navigate('/login'); }}
          className="nav-item w-full group"
          aria-label="Cerrar sesión"
        >
          <LogOut className={`w-5 h-5 ${!isOpen ? 'mx-auto' : ''}`} />
          {isOpen && <span>Cerrar Sesión</span>}
        </button>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!isOpen)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center hover:scale-110 transition-transform shadow-lg border-2 border-slate-900"
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Decorative Blur */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-orange-500/5 to-transparent pointer-events-none" />
    </aside>
  );
}
