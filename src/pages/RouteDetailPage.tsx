import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRoutes, useProducts, useSuppliers, useAppStore } from '../store/useAppStore';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Map, 
  Edit2, 
  Trash2, 
  DollarSign, 
  Clock, 
  Package, 
  ChevronRight,
  Info,
  TrendingUp,
  Tag,
  Star,
  Zap,
  Layout,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

export default function RouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const routes = useRoutes();
  const products = useProducts();
  const suppliers = useSuppliers();
  const deleteRoute = useAppStore(s => s.deleteRoute);

  const route = routes.find(r => r.id === id);

  if (!route) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
        <Map size={48} className="text-slate-800" />
        <h2 className="text-xl font-black text-white">Ruta no encontrada</h2>
        <Link to="/rutas" className="btn-secondary">Volver al panel</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm(`¿Eliminar permanently "${route.name}"?`)) {
      await deleteRoute(route.id);
      navigate('/rutas');
    }
  };

  // Group itinerary by day
  const daysMap: Record<number, typeof route.itinerary> = {};
  route.itinerary.forEach(item => {
    if (!daysMap[item.day]) daysMap[item.day] = [];
    daysMap[item.day].push(item);
  });
  const sortedDays = Object.keys(daysMap).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-8 animate-page-enter">
      {/* Route Hero Banner */}
      <div className="relative h-80 md:h-[450px] -mt-6 -mx-4 md:-mx-8 overflow-hidden rounded-b-[50px] shadow-2xl group">
         {route.images?.[0] ? (
           <img src={route.images[0]} className="w-full h-full object-cover" />
         ) : (
           <div className="w-full h-full bg-slate-900 flex items-center justify-center">
              <Map size={120} className="text-slate-800" />
           </div>
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
         
         {/* Controls */}
         <div className="absolute top-8 left-8 flex items-center gap-4">
            <Link to="/rutas" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest">
               <ArrowLeft size={16} /> Mis Rutas
            </Link>
         </div>

         <div className="absolute top-8 right-8 flex items-center gap-3">
            <button onClick={() => navigate(`/rutas/${route.id}/editar`)} className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all">
               <Edit2 size={20} />
            </button>
            <button onClick={handleDelete} className="p-3 rounded-2xl bg-rose-500/10 backdrop-blur-md border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
               <Trash2 size={20} />
            </button>
         </div>

         {/* Title area */}
         <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 flex-1">
               <div className="flex flex-wrap items-center gap-3">
                  <span className="badge badge-emerald text-[10px] font-black uppercase tracking-widest px-3 py-1">
                    <MapPin size={10} className="mr-1" /> {route.destination}
                  </span>
                  <span className={`badge ${route.status === 'activo' ? 'badge-emerald' : 'badge-amber'} text-[10px] font-black uppercase`}>
                    {route.status}
                  </span>
               </div>
               <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">{route.name}</h1>
               <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-black">
                  <span className="flex items-center gap-1.5"><Calendar size={18} className="text-emerald-500" /> {route.duration_days} DIAS / {route.duration_days - 1} NOCHES</span>
                  <span className="flex items-center gap-1.5"><TrendingUp size={18} className="text-emerald-500" /> {route.booking_count} RESERVAS</span>
               </div>
            </div>

            <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 p-8 rounded-[40px] text-right min-w-[240px]">
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Costo Estimado p/pax</p>
               <div className="text-4xl font-black text-white">
                 <span className="text-lg mr-1">{route.pricing.currency}</span>
                 {route.pricing.base_price_per_pax.toLocaleString()}
               </div>
               <div className="mt-2 flex gap-1 justify-end">
                  {route.tags.slice(0, 3).map(t => (
                    <span key={t} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 uppercase border border-white/10">{t}</span>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Column: Core Details */}
         <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Info size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-white">Visión General</h2>
               </div>
               <p className="text-slate-400 font-medium leading-relaxed text-lg">
                 {route.description || 'Proporciona una descripción cautivadora para esta ruta en el editor.'}
               </p>
               
               <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-white/5 pt-8">
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Inclusiones Técnicas</h4>
                     <ul className="space-y-3">
                        {['Vuelos seleccionables', 'Alojamiento 4 estrellas', 'Guías certificados', 'Traslados privados'].map((inc, i) => (
                          <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-bold">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                             {inc}
                          </li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Exclusiones</h4>
                     <ul className="space-y-3">
                        {['Propinas', 'Gastos personales', 'Seguro internacional'].map((exc, i) => (
                          <li key={i} className="flex items-center gap-3 text-slate-500 text-sm font-bold">
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                             {exc}
                          </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>

            {/* Itinerary Timeline */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                     <Layout className="text-emerald-500" />
                     Cronograma de Ruta
                  </h2>
               </div>

               <div className="space-y-12">
                  {sortedDays.map((dayNum) => (
                    <div key={dayNum} className="relative pl-12">
                       {/* Timeline vertical bar */}
                       <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/40 via-emerald-500/10 to-transparent" />
                       
                       {/* Day marker */}
                       <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-slate-900 border-2 border-emerald-500 flex items-center justify-center z-10 shadow-lg shadow-emerald-500/10">
                          <span className="text-white font-black text-lg">{dayNum}</span>
                       </div>

                       <div className="space-y-6">
                          <h3 className="text-xl font-black text-white px-2">Día {dayNum}: Exploración Intensa</h3>
                          
                          <div className="space-y-4">
                             {daysMap[dayNum].map((item, idx) => {
                               const product = products.find(p => p.id === item.product_id);
                               const supplier = suppliers.find(s => s.id === product?.supplier_id);
                               
                               return (
                                 <div 
                                   key={idx} 
                                   className="glass-card p-6 flex flex-col md:flex-row gap-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                                 >
                                    <div className="w-full md:w-32 h-24 rounded-2xl bg-slate-800 overflow-hidden shrink-0 border border-white/5">
                                      {product?.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-cover" /> : <Package size={24} className="m-auto mt-8 text-slate-700" />}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                       <div className="flex items-center gap-3">
                                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">{item.start_time} - {item.end_time}</span>
                                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{product?.category}</span>
                                       </div>
                                       <div>
                                          <h4 className="text-lg font-black text-white mb-1 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{product?.name || 'Servicio Personalizado'}</h4>
                                          <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                                            <Package size={12} className="text-emerald-500" /> Operado por {supplier?.name || 'Sol y Vida'}
                                          </p>
                                       </div>
                                       <div className="flex flex-wrap gap-2">
                                          {item.notes && <p className="text-xs text-slate-400 italic bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 w-full">"{item.notes}"</p>}
                                       </div>
                                    </div>
                                    
                                    <div className="flex md:flex-col justify-between items-center md:items-end">
                                       <div className="text-right">
                                          <p className="text-[10px] font-black text-slate-600 uppercase">Costo</p>
                                          <p className="text-sm font-black text-white">$ {product?.base_price || 0}</p>
                                       </div>
                                       <Link to={`/productos/${product?.id}/detalle`} className="p-2 rounded-xl bg-white/5 text-slate-500 hover:bg-emerald-500 hover:text-slate-900 transition-all">
                                          <ExternalLink size={16} />
                                       </Link>
                                    </div>
                                    
                                    {/* Small design element */}
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
                                 </div>
                               );
                             })}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Column: Sidebar Data */}
         <div className="space-y-8">
            {/* Booking Stats */}
            <div className="glass-card p-6 bg-amber-500/5 border-amber-500/20">
               <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-amber-500" /> Rendimiento
               </h4>
               <div className="space-y-6">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Total Reservas</p>
                        <p className="text-3xl font-black text-white">{route.booking_count}</p>
                     </div>
                     <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">+12% vs last month</span>
                  </div>
                  
                  <div className="pt-6 border-t border-white/10">
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Revenue Generado</p>
                     <p className="text-4xl font-black text-amber-500">
                        <span className="text-base mr-1">$</span>
                        {(route.booking_count * route.pricing.base_price_per_pax).toLocaleString()}
                     </p>
                  </div>
               </div>
            </div>

            {/* Quick Pricing Breakdown */}
            <div className="glass-card p-6 space-y-6">
               <h4 className="text-lg font-black text-white flex items-center gap-2">
                  <DollarSign size={20} className="text-sky-500" /> Desglose Comercial
               </h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-slate-500 text-xs font-bold font-mono">NETO ESTIMADO</span>
                     <span className="text-white font-black text-sm">$ {(route.pricing.base_price_per_pax * 0.85).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-slate-500 text-xs font-bold font-mono">MARKUP (15%)</span>
                     <span className="text-sky-400 font-black text-sm">$ {(route.pricing.base_price_per_pax * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                     <span className="text-white font-black text-sm font-mono">VENTA TOTAL</span>
                     <span className="text-emerald-400 font-black text-lg">$ {route.pricing.base_price_per_pax.toLocaleString()}</span>
                  </div>
               </div>
            </div>

            {/* Tags Cloud */}
            <div className="glass-card p-6">
               <h4 className="text-lg font-black text-white mb-4">Etiquetas y SEO</h4>
               <div className="flex flex-wrap gap-2">
                  {route.tags.map(tag => (
                    <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/5 text-[10px] font-black text-slate-400 uppercase hover:border-emerald-500/40 hover:text-white transition-all">
                       <Tag size={10} /> {tag}
                    </div>
                  ))}
               </div>
            </div>

            {/* Operational Notes */}
            <div className="p-6 rounded-[32px] bg-slate-900 border border-white/5">
                <div className="flex items-center gap-2 text-white font-black text-sm mb-3">
                   <Zap size={16} className="text-amber-500" /> NOTAS DE OPERACIÓN
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                  Esta ruta requiere confirmación de disponibilidad con 72h de antelación para hoteles de categoría Premium.
                </p>
            </div>
         </div>
      </div>
    </div>
  );
}
