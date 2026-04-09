import { useAppStore, useSuppliers, useProducts, useRoutes } from '../store/useAppStore';
import { 
  Users, 
  Package, 
  Map, 
  TrendingUp, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  Plus,
  CalendarDays,
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

  if (loading && products.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin" />
        <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">Sincronizando Sistema...</p>
      </div>
    );
  }

  // Derived stats
  const activeProducts = products.filter(p => p.status === 'activo').length;
  const activeSuppliers = suppliers.filter(s => s.status === 'activo').length;
  const popularRoutes = [...routes].sort((a, b) => b.booking_count - a.booking_count).slice(0, 4);

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
          trend="+2 este mes" 
          color="#f59e0b"
          to="/proveedores"
        />
        <StatCard 
          title="Productos" 
          value={products.length} 
          icon={Package} 
          trend="+15%" 
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
          trend="82%" 
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
             <Link to="/reportes" className="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors">
               Ver Analíticas
             </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {popularRoutes.map((route) => (
              <div key={route.id} className="glass-card group overflow-hidden border border-white/5 transition-all hover:border-amber-500/30">
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
                       <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{route.destination}</p>
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
                    <Link to={`/rutas/${route.id}/detalle`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-amber-500 hover:text-slate-900 transition-all">
                       <ArrowUpRight size={20} />
                    </Link>
                 </div>
              </div>
            ))}
          </div>

          {/* Quick Shortcuts */}
          <div className="glass-card p-6 bg-amber-500/5 border border-amber-500/20">
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
                    className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 text-center flex flex-col items-center gap-2 hover:bg-amber-500 transition-all group"
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
                 <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <AlertCircle size={20} />
                 </div>
                 <div>
                    <p className="text-white font-bold text-sm">Alertas Críticas</p>
                    <p className="text-xs text-slate-500">{activeSuppliers < suppliers.length ? `Hay ${suppliers.length - activeSuppliers} proveedores inactivos` : 'Todo normal'}</p>
                 </div>
              </div>

              <div className="p-5 space-y-4">
                 <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Actividad Reciente</h4>
                 
                 <div className="space-y-4">
                    {[
                      { icon: Plus, text: 'Ruta "Cuzco Imperial" creada', time: 'Hace 2h', color: 'emerald' },
                      { icon: Package, text: 'Producto "Transfer Aeropuerto" actualizado', time: 'Hace 5h', color: 'sky' },
                      { icon: Users, text: 'Nuevo Proveedor: Hotel Monasterio', time: 'Ayer', color: 'orange' },
                      { icon: Clock, text: 'Sincronización Supabase completa', time: 'Hace 1 día', color: 'slate' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                         <div className={`mt-0.5 w-6 h-6 rounded-lg bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400 shrink-0`}>
                            <item.icon size={12} />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-300">{item.text}</p>
                            <p className="text-[10px] text-slate-600">{item.time}</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 <button className="w-full py-2.5 rounded-xl bg-white/5 text-[10px] font-bold text-slate-400 uppercase hover:text-white transition-colors">
                    Ver Registro de Auditoría
                 </button>
              </div>

              <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-transparent">
                 <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-indigo-400 uppercase">Uso de Almacenamiento</p>
                    <p className="text-[10px] font-black text-indigo-400">42%</p>
                 </div>
                 <div className="w-full h-1.5 bg-indigo-500/10 rounded-full overflow-hidden">
                    <div className="h-full w-[42%] bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                 </div>
                 <p className="text-[9px] text-slate-500 mt-2 italic">Basado en tu plan de Supabase gratuito.</p>
              </div>
           </div>

           {/* Quick Stats Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 border-l-4 border-amber-500">
                 <p className="text-[10px] font-bold text-slate-500 uppercase">Cat. Más Usada</p>
                 <p className="text-sm font-black text-white">Hotel (12)</p>
              </div>
              <div className="glass-card p-4 border-l-4 border-sky-500">
                 <p className="text-[10px] font-bold text-slate-500 uppercase">Tickets Abiertos</p>
                 <p className="text-sm font-black text-white">0</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
