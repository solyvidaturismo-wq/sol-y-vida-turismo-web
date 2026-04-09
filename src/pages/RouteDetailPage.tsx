import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Route as PathIcon,
  Tag,
  Star,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const getRouteById = useAppStore((s) => s.getRouteById);
  const suppliers = useAppStore((s) => s.suppliers);
  const products = useAppStore((s) => s.products);
  
  const route = getRouteById(id || '');

  if (!route) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-300">Ruta no encontrada</h2>
        <Link to="/routes" className="mt-4 text-sky-500 hover:underline">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Main Info */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img 
            src={route.images[0] || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"} 
            className="w-full h-full object-cover blur-sm brightness-50"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-end justify-between">
          <div className="space-y-4">
            <Link 
              to="/routes" 
              className="inline-flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-widest hover:text-sky-300 transition-colors"
            >
              <ArrowLeft size={14} /> Volver a Rutas
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              {route.name}
            </h1>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-slate-300">
                <MapPin size={16} className="text-sky-400" /> {route.destination}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-slate-300">
                <Clock size={16} className="text-amber-400" /> {route.duration_days} Días
              </span>
              <span className={`px-4 py-2 rounded-2xl border backdrop-blur-md font-bold uppercase text-[10px] tracking-widest ${
                route.status === 'activo' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
              }`}>
                {route.status}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-white/20 shadow-xl min-w-[280px]">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Precio desde</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">${route.pricing.base_price_per_pax}</span>
              <span className="text-lg font-bold text-slate-500">{route.pricing.currency} / pax</span>
            </div>
            <button className="w-full mt-6 py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-lg hover:shadow-sky-500/25 active:scale-95">
              Solicitar Cotización
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Dificultad</p>
                <div className="flex items-center gap-2">
                  <PathIcon size={16} className="text-sky-400" />
                  <span className="font-bold text-white capitalize">{route.difficulty || 'Moderada'}</span>
                </div>
             </div>
             <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Vistas</p>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-rose-400" />
                  <span className="font-bold text-white tracking-widest">{route.view_count}</span>
                </div>
             </div>
             <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Reservas</p>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-400" />
                  <span className="font-bold text-white tracking-widest">{route.booking_count}</span>
                </div>
             </div>
             <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Aprobado</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="font-bold text-white">100%</span>
                </div>
             </div>
          </div>

          {/* Detailed Description */}
          <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md font-medium text-slate-300 leading-relaxed shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Sobre esta aventura</h3>
            <p className="whitespace-pre-line">{route.description}</p>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <h4 className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-4">
                  <CheckCircle2 size={16} /> Lo que incluye
                </h4>
                <ul className="space-y-2">
                  {route.included.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-4">
                  <Tag size={16} /> No incluye
                </h4>
                <ul className="space-y-2">
                  {route.not_included.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Itinerary Timeline */}
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white tracking-tight">Plan de Viaje</h3>
                <span className="px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold text-xs">
                  {route.duration_days} Días / {route.duration_days - 1} Noches
                </span>
             </div>

             <div className="relative space-y-12 before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-gradient-to-b before:from-sky-500/50 before:via-sky-500/10 before:to-transparent">
                {Array.from({ length: route.duration_days }).map((_, d) => {
                  const dayNum = d + 1;
                  const dayItems = route.itinerary.filter(i => i.day === dayNum);
                  
                  return (
                    <div key={d} className="relative pl-20 transition-all group">
                       <div className="absolute left-0 top-0 w-16 h-16 rounded-3xl bg-slate-900 border-2 border-sky-500/40 flex items-center justify-center font-black text-2xl text-white shadow-xl group-hover:bg-sky-500 group-hover:border-sky-400 transition-all group-hover:scale-110 z-10">
                         {dayNum}
                       </div>
                       
                       <div className="space-y-6">
                         <h4 className="text-xl font-bold text-white pt-4">Día {dayNum}: Exploración</h4>
                         
                         <div className="grid gap-4">
                           {dayItems.length > 0 ? (
                             dayItems.map((item, idx) => {
                               const supplier = item.ref_type === 'supplier' ? suppliers.find(s => s.id === item.ref_id) : null;
                               const product = item.ref_type === 'product' ? products.find(p => p.id === item.ref_id) : null;
                               const title = supplier?.name || product?.name || 'Recurso no asignado';
                               const catLabel = supplier?.category || product?.category;
                               
                               return (
                                 <div 
                                   key={idx} 
                                   className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:translate-x-2"
                                 >
                                    <div className="flex items-start justify-between mb-4">
                                       <h4 className="font-bold text-white group-hover:text-sky-400 transition-colors">
                                         {title}
                                       </h4>
                                       {(item.time_start || item.time_end) && (
                                         <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0" style={{ background: 'rgba(14,165,233,0.1)', color: '#38bdf8' }}>
                                           <Clock size={10}/> {item.time_start || '?'} - {item.time_end || '?'}
                                         </span>
                                       )}
                                    </div>
                                    {catLabel && (
                                      <p className="text-xs font-bold capitalize mb-2" style={{ color: 'var(--color-brand-sun)' }}>
                                        {catLabel.replace('_', ' ')}
                                      </p>
                                    )}
                                    
                                    {/* Content details */}
                                    {product && (
                                      <div className="mb-3 space-y-1">
                                        <p className="text-xs line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                                          {product.short_description || product.description || 'Sin descripción detallada.'}
                                        </p>
                                        <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                                          {(product.duration_minutes ?? 0) > 0 && <span>⏱️ Duración: {product.duration_minutes} min</span>}
                                          {product.base_price > 0 && <span className="text-emerald-400 font-semibold">💰 Precio Ref: ${product.base_price} {product.currency}</span>}
                                        </div>
                                        {product.activity_itinerary && product.activity_itinerary.length > 0 && (
                                           <div className="mt-3 pt-2 pl-3 border-l-2 border-sky-500/30 space-y-2">
                                             <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-2">Sub-Itinerario</p>
                                             {product.activity_itinerary.map((excItem, i) => (
                                               <div key={i} className="flex flex-col mb-1.5">
                                                 <div className="flex items-center gap-2">
                                                   <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded">{excItem.time}</span>
                                                   <span className="text-xs text-slate-200 font-medium">{excItem.activity}</span>
                                                 </div>
                                                 {excItem.description && (
                                                   <span className="text-[10px] text-slate-400 pl-10 leading-tight">{excItem.description}</span>
                                                 )}
                                               </div>
                                             ))}
                                           </div>
                                        )}
                                      </div>
                                    )}
                                    
                                    {item.notes && (
                                      <div className="flex gap-2 p-3 mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10.5px] italic text-amber-200 font-medium leading-normal">
                                         <Star size={12} className="shrink-0 text-amber-400" />
                                         {item.notes}
                                      </div>
                                    )}
                                 </div>
                               );
                             })
                           ) : (
                             <p className="text-sm italic text-slate-500 pl-4 border-l border-white/10">Este día aún no tiene actividades programadas.</p>
                           )}
                         </div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Right Column: Sidebar info */}
        <div className="space-y-8">
           <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
              <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-widest text-[10px] opacity-60">Puntos Destacados</h4>
              <div className="space-y-4">
                 {route.highlights.map((h, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-xs ring-4 ring-sky-500/5">
                        {i + 1}
                      </div>
                      <span className="text-sm text-slate-200 font-semibold">{h}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
              <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-widest text-[10px] opacity-60">Galería de Fotos</h4>
              <div className="grid grid-cols-2 gap-3">
                 {route.images.map((img, i) => (
                   <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
                      <img 
                        src={img} 
                        className="w-full h-full object-cover transition-all group-hover:scale-110 duration-500"
                        alt={`Route view ${i}`}
                      />
                   </div>
                 ))}
                 <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-white/20 hover:text-slate-400 transition-all cursor-pointer">
                    <ImageIcon size={20} />
                    <span className="text-[10px] font-bold">Ver más</span>
                 </div>
              </div>
           </div>

           <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md">
              <div className="flex items-center gap-4 mb-4">
                <Calendar className="text-sky-400" />
                <h4 className="text-lg font-bold text-white">Próximas Salidas</h4>
              </div>
              <p className="text-xs text-slate-400 mb-6">Contamos con disponibilidad garantizada durante todo el año. Consulta por grupos privados.</p>
              <div className="space-y-3">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Mayo 15 - Jun 10</span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase">Disponible</span>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between opacity-50">
                    <span className="text-xs font-bold text-white">Julio 20 - Ago 05</span>
                    <span className="text-[10px] font-black text-rose-400 uppercase">Agotado</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
