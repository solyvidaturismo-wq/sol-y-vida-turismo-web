import { useMemo } from 'react';
import { useProducts, useSuppliers, useRoutes } from '../store/useAppStore';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Users,
  MapPin,
  Layers,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Target
} from 'lucide-react';
import { PRODUCT_CATEGORY_META } from '../config/categoryFields';

function KPIBlock({ title, value, sub, color, icon: Icon, trend }: any) {
  return (
    <div className="glass-card p-8 group relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
       <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-all">
          <Icon size={128} />
       </div>
       <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
             <div className="w-12 h-12 rounded-[20px] flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={24} color={color} />
             </div>
             {trend && (
               <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full border ${trend.val > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                  {trend.val > 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                  {Math.abs(trend.val)}%
               </span>
             )}
          </div>
          <div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</p>
             <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
             <p className="text-xs text-slate-400 font-bold mt-1">{sub}</p>
          </div>
       </div>
    </div>
  );
}

export default function ReportesPage() {
  const products = useProducts();
  const suppliers = useSuppliers();
  const routes = useRoutes();

  // Metrics Logic
  const metrics = useMemo(() => {
    const totalBookings = routes.reduce((acc, r) => acc + r.booking_count, 0);
    const estimatedRevenue = routes.reduce((acc, r) => acc + (r.booking_count * r.pricing.base_price_per_pax), 0);
    const avgRoutePrice = Math.round(routes.reduce((acc, r) => acc + r.pricing.base_price_per_pax, 0) / (routes.length || 1));
    const activeSuppliers = suppliers.filter(s => s.status === 'activo').length;

    return {
      totalBookings,
      estimatedRevenue,
      avgRoutePrice,
      activeSuppliers,
      inventoryHealth: Math.round((products.length / 50) * 100) // Arbitrary goal of 50 products
    };
  }, [products, suppliers, routes]);

  return (
    <div className="space-y-10 animate-page-enter">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
             <BarChart3 className="text-indigo-400" size={36} /> Central de Analíticas
          </h1>
          <p className="text-slate-400 font-medium max-w-xl">Métricas avanzadas de rendimiento de inventario y comercialización Sol y Vida.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-slate-900 rounded-2xl p-1 border border-white/5">
              <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">Mensual</button>
              <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Trimestral</button>
           </div>
           <button className="btn-secondary flex items-center gap-2 border-white/10 text-white font-bold text-xs uppercase bg-white/5">
              <Activity size={16} /> Exportar Reporte
           </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPIBlock
            title="Valor Inventario (Ref)"
            value={`$${metrics.estimatedRevenue.toLocaleString()}`}
            sub="Revenue potencial generado"
            color="#a78bfa"
            icon={DollarSign}
         />
         <KPIBlock
            title="Reservas Totales"
            value={metrics.totalBookings}
            sub="Paquetes vendidos"
            color="#34d399"
            icon={Activity}
         />
         <KPIBlock
            title="Ticket Promedio"
            value={`$${metrics.avgRoutePrice}`}
            sub="Promedio p/pax por ruta"
            color="#fbbf24"
            icon={Target}
         />
         <KPIBlock
            title="Suministro Activo"
            value={`${metrics.activeSuppliers}/${suppliers.length}`}
            sub="Partners en operación"
            color="#60a5fa"
            icon={Users}
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Inventory Health & Distribution */}
         <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-white flex items-center gap-3">
                     <Layers className="text-indigo-400" /> Distribución de Productos
                  </h3>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Capacidad de Catálogo</span>
               </div>
               
               <div className="space-y-6">
                  {Object.entries(PRODUCT_CATEGORY_META).map(([key, meta]) => {
                    const count = products.filter(p => p.category === key).length;
                    const pct = Math.round((count / (products.length || 1)) * 100);
                    return (
                      <div key={key} className="space-y-2">
                         <div className="flex justify-between items-end">
                            <div className="flex items-center gap-2">
                               <span className="text-lg">{meta.emoji}</span>
                               <span className="text-xs font-black text-white uppercase tracking-tighter">{meta.label}</span>
                               <span className="text-[10px] text-slate-500 font-bold">({count} unid.)</span>
                            </div>
                            <span className="text-xs font-black text-indigo-400">{pct}%</span>
                         </div>
                         <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${pct}%` }} />
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* Performance Ranking Table */}
            <div className="glass-card p-0 overflow-hidden">
               <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                       <TrendingUp size={24} className="text-emerald-400" /> Top Rutas Sol y Vida
                    </h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Ranking por volumen de bookings</p>
                  </div>
                  <button className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"><ArrowUpRight size={20}/></button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[9px] text-slate-600 font-black">
                           <th className="px-8 py-4">Ruta / Destino</th>
                           <th className="px-8 py-4">Bookings</th>
                           <th className="px-8 py-4">Revenue Gen.</th>
                           <th className="px-8 py-4">Margen Est.</th>
                           <th className="px-8 py-4 text-right">Estado</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {routes.sort((a, b) => b.booking_count - a.booking_count).slice(0, 5).map((route, i) => (
                          <tr key={route.id} className="hover:bg-white/[0.02] transition-colors group">
                             <td className="px-8 py-4">
                                <div className="flex items-center gap-4">
                                   <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 font-black text-xs border border-white/5">
                                      #{i+1}
                                   </div>
                                   <div>
                                      <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{route.name}</p>
                                      <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 uppercase tracking-widest"><MapPin size={8} /> {route.destination}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-4">
                                <span className="text-sm font-black text-white">{route.booking_count}</span>
                             </td>
                             <td className="px-8 py-4 font-black text-emerald-400 text-sm">
                                $ {(route.booking_count * route.pricing.base_price_per_pax).toLocaleString()}
                             </td>
                             <td className="px-8 py-4">
                                {(() => {
                                  const cost = route.itinerary.reduce((acc: number, item: any) => {
                                    const p = products.find(pr => pr.id === item.product_id);
                                    return acc + (p?.base_price || 0);
                                  }, 0);
                                  const margin = route.pricing.base_price_per_pax > 0
                                    ? Math.round(((route.pricing.base_price_per_pax - cost) / route.pricing.base_price_per_pax) * 100)
                                    : 0;
                                  return (
                                    <div className="flex items-center gap-2">
                                       <div className="h-1 w-12 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                          <div className="h-full bg-emerald-500" style={{ width: `${Math.max(0, Math.min(100, margin))}%` }} />
                                       </div>
                                       <span className="text-[10px] font-black text-slate-400">{margin}%</span>
                                    </div>
                                  );
                                })()}
                             </td>
                             <td className="px-8 py-4 text-right">
                                <span className={`badge ${route.status === 'activo' ? 'badge-emerald' : 'badge-amber'} text-[9px]`}>{route.status}</span>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Sidebar Widgets */}
         <div className="space-y-8">
            {/* Inventory Summary */}
            <div className="glass-card p-8 bg-indigo-500/5 border-indigo-500/20 relative overflow-hidden">
               <h4 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                  <Activity size={20} className="text-indigo-400" /> Resumen Operativo
               </h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                     <span className="text-[10px] font-black text-slate-400 uppercase">Proveedores Activos</span>
                     <span className="text-xs font-black text-emerald-400">{metrics.activeSuppliers}/{suppliers.length}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                     <span className="text-[10px] font-black text-slate-400 uppercase">Productos</span>
                     <span className="text-xs font-black text-sky-400">{products.length}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                     <span className="text-[10px] font-black text-slate-400 uppercase">Rutas Activas</span>
                     <span className="text-xs font-black text-amber-400">{routes.filter(r => r.status === 'activo').length}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                     <span className="text-[10px] font-black text-slate-400 uppercase">Sin Proveedor</span>
                     <span className="text-xs font-black text-rose-400">{products.filter(p => !p.supplier_id).length}</span>
                  </div>
               </div>
            </div>

            {/* Revenue per Route */}
            <div className="glass-card p-8">
               <h4 className="text-lg font-black text-white mb-6">Revenue por Ruta</h4>
               <div className="space-y-4">
                  {routes.sort((a, b) => (b.booking_count * b.pricing.base_price_per_pax) - (a.booking_count * a.pricing.base_price_per_pax)).slice(0, 5).map(route => {
                    const rev = route.booking_count * route.pricing.base_price_per_pax;
                    const maxRev = Math.max(...routes.map(r => r.booking_count * r.pricing.base_price_per_pax), 1);
                    return (
                      <div key={route.id} className="space-y-1.5">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400 truncate max-w-[140px]">{route.name}</span>
                            <span className="text-emerald-400">${rev.toLocaleString()}</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-1000 rounded-full" style={{ width: `${(rev / maxRev) * 100}%` }} />
                         </div>
                      </div>
                    );
                  })}
                  {routes.length === 0 && (
                    <p className="text-xs text-slate-500 italic text-center py-4">Sin datos de rutas</p>
                  )}
               </div>
            </div>

            {/* Verification Badge */}
            <div className="p-6 rounded-[32px] bg-slate-900 border border-white/5 group">
                <div className="flex items-center gap-3 text-white font-black text-sm mb-3">
                   <ShieldCheck size={20} className="text-emerald-500 transition-transform group-hover:scale-110" />
                   DATOS VERIFICADOS
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
                  Todos los reportes reflejan el estado real del inventario al {new Date().toLocaleDateString()}.
                </p>
            </div>
         </div>
      </div>
    </div>
  );
}
