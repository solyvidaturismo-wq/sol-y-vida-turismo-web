import { useMemo } from 'react';
import { useAppStore, useSuppliers, useProducts, useRoutes } from '../store/useAppStore';
import {
  Users,
  Package,
  Map,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Plus,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color, 
  to 
}: { 
  title: string; 
  value: number | string; 
  icon: any; 
  trend?: string; 
  color: string;
  to: string;
}) {
  return (
    <Link 
      to={to}
      className="glass-card p-6 flex flex-col group transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="p-3 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon size={24} color={color} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp size={12} />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">{title}</h3>
      <div className="text-3xl font-black text-white">{value}</div>
    </Link>
  );
}

export default function DashboardPage() {
  const suppliers = useSuppliers();
  const products = useProducts();
  const routes = useRoutes();
  const loading = useAppStore(s => s.loading);

  // Hooks must be called before any conditional return
  const topCategory = useMemo(() => {
    if (products.length === 0) return 'N/A';
    const counts: Record<string, number> = {};
    products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? `${top[0]} (${top[1]})` : 'N/A';
  }, [products]);

  if (loading && products.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-[#A8442A]/30 border-t-[#A8442A] animate-spin" />
        <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">Sincronizando Sistema...</p>
      </div>
    );
  }

  // Derived stats
  const activeProducts = products.filter(p => p.status === 'activo').length;
  const activeSuppliers = suppliers.filter(s => s.status === 'activo').length;
  const popularRoutes = [...routes].sort((a, b) => b.booking_count - a.booking_count).slice(0, 4);
  const productsWithoutSupplier = products.filter(p => !p.supplier_id).length;
  const totalRecords = suppliers.length + products.length + routes.length;

  return (
    <div className="space-y-8 animate-page-enter">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-3">
            Bienvenido, <span className="gradient-text">Sol y Vida</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-lg">
            Panel de control operativo. Aquí tienes un resumen del inventario digital y el rendimiento de tus rutas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/rutas/nuevo" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Nueva Ruta
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Proveedores"
          value={suppliers.length}
          icon={Users}
          color="#f59e0b"
          to="/proveedores"
        />
        <StatCard
          title="Productos"
          value={products.length}
          icon={Package}
          color="#38bdf8"
          to="/productos"
        />
        <StatCard
          title="Rutas Totales"
          value={routes.length}
          icon={Map}
          color="#10b981"
          to="/rutas"
        />
        <StatCard
          title="Reservas Totales"
          value={routes.reduce((acc, r) => acc + r.booking_count, 0)}
          icon={Activity}
          color="#f43f5e"
          to="/reportes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Routes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-xl font-black text-white flex items-center gap-3">
               <TrendingUp size={24} className="text-emerald-400" />
               Rutas Top en Sol y Vida
             </h2>
             <Link to="/reportes" className="text-sm font-bold text-[#A8442A] hover:text-[#C84B2C] transition-colors">
               Ver Analíticas
             </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {popularRoutes.map((route) => (
              <div key={route.id} className="glass-card group overflow-hidden border border-white/5 transition-all hover:border-[#A8442A]/30">
                 <div className="h-32 bg-slate-800 relative overflow-hidden">
                    {route.images?.[0] ? (
                      <img src={route.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <Map size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                       <p className="text-[10px] font-bold text-[#A8442A] uppercase tracking-widest">{route.destination}</p>
                       <h4 className="text-white font-black text-lg leading-tight truncate">{route.name}</h4>
                    </div>
                 </div>
                 <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="text-center">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Bookings</p>
                          <p className="text-lg font-black text-white">{route.booking_count}</p>
                       </div>
                       <div className="w-px h-8 bg-white/5" />
                       <div className="text-center">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Rev</p>
                          <p className="text-lg font-black text-emerald-400">${(route.pricing.base_price_per_pax * route.booking_count).toLocaleString()}</p>
                       </div>
                    </div>
                    <Link to={`/rutas/${route.id}/detalle`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#A8442A] hover:text-slate-900 transition-all">
                       <ArrowUpRight size={20} />
                    </Link>
                 </div>
              </div>
            ))}
          </div>

          {/* Quick Shortcuts */}
          <div className="glass-card p-6 bg-[#A8442A]/5 border border-[#A8442A]/20">
             <h3 className="text-lg font-black text-white mb-4">Accesos de Gestión Rápida</h3>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Añadir Hotel', to: '/proveedores/nuevo?cat=hotel', icon: '🏨' },
                  { label: 'Nuevo Tour', to: '/productos/nuevo?cat=excursion', icon: '⛰️' },
                  { label: 'Configurar Tarifas', to: '/configuracion', icon: '⚙️' },
                  { label: 'Ver Itinerarios', to: '/rutas', icon: '🗒️' },
                ].map((item, idx) => (
                  <Link 
                    key={idx} 
                    to={item.to}
                    className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 text-center flex flex-col items-center gap-2 hover:bg-[#A8442A] transition-all group"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform">{item.icon}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-slate-900">{item.label}</span>
                  </Link>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-6">
           <h2 className="text-xl font-black text-white px-2">Estado del Sistema</h2>

           <div className="glass-card p-0 overflow-hidden divide-y divide-white/5">
              <div className="p-5 flex items-center gap-4 bg-white/5">
                 <div className="w-10 h-10 rounded-xl bg-[#A8442A]/20 text-[#C84B2C] flex items-center justify-center">
                    <AlertCircle size={20} />
                 </div>
                 <div>
                    <p className="text-white font-bold text-sm">Alertas</p>
                    <p className="text-xs text-slate-500">{activeSuppliers < suppliers.length ? `${suppliers.length - activeSuppliers} proveedores inactivos` : 'Todo normal'}</p>
                 </div>
              </div>

              <div className="p-5 space-y-4">
                 <h4 className="text-[10px] font-bold text-[#A8442A] uppercase tracking-widest">Resumen de Inventario</h4>

                 <div className="space-y-4">
                    <div className="flex gap-3">
                       <div className="mt-0.5 w-6 h-6 rounded-lg bg-[#A8442A]/10 flex items-center justify-center text-[#C84B2C] shrink-0">
                          <Users size={12} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-300">{activeSuppliers} proveedores activos</p>
                          <p className="text-[10px] text-slate-600">de {suppliers.length} registrados</p>
                       </div>
                    </div>
                    <div className="flex gap-3">
                       <div className="mt-0.5 w-6 h-6 rounded-lg bg-[#D6A55C]/10 flex items-center justify-center text-[#D6A55C] shrink-0">
                          <Package size={12} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-300">{activeProducts} productos activos</p>
                          <p className="text-[10px] text-slate-600">de {products.length} registrados</p>
                       </div>
                    </div>
                    <div className="flex gap-3">
                       <div className="mt-0.5 w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                          <Map size={12} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-300">{routes.filter(r => r.status === 'activo').length} rutas activas</p>
                          <p className="text-[10px] text-slate-600">de {routes.length} registradas</p>
                       </div>
                    </div>
                    {productsWithoutSupplier > 0 && (
                      <div className="flex gap-3">
                         <div className="mt-0.5 w-6 h-6 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
                            <AlertCircle size={12} />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-300">{productsWithoutSupplier} sin proveedor</p>
                            <p className="text-[10px] text-slate-600">productos huérfanos</p>
                         </div>
                      </div>
                    )}
                 </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-[#D6A55C]/10 to-transparent">
                 <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-[#D6A55C] uppercase">Registros Totales</p>
                    <p className="text-[10px] font-black text-[#D6A55C]">{totalRecords}</p>
                 </div>
                 <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="text-center p-2 rounded-xl bg-white/5">
                       <p className="text-[9px] text-slate-500 font-bold uppercase">Prov.</p>
                       <p className="text-sm font-black text-white">{suppliers.length}</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-white/5">
                       <p className="text-[9px] text-slate-500 font-bold uppercase">Prod.</p>
                       <p className="text-sm font-black text-white">{products.length}</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-white/5">
                       <p className="text-[9px] text-slate-500 font-bold uppercase">Rutas</p>
                       <p className="text-sm font-black text-white">{routes.length}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Quick Stats Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 border-l-4 border-[#A8442A]">
                 <p className="text-[10px] font-bold text-slate-500 uppercase">Cat. Más Usada</p>
                 <p className="text-sm font-black text-white">{topCategory}</p>
              </div>
              <div className="glass-card p-4 border-l-4 border-[#D6A55C]">
                 <p className="text-[10px] font-bold text-slate-500 uppercase">Sin Proveedor</p>
                 <p className="text-sm font-black text-white">{productsWithoutSupplier}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
