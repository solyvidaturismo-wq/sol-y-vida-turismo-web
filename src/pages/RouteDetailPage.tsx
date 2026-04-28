import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  ArrowLeft, MapPin, Clock, Users, CalendarDays, CheckCircle2,
  Navigation, DollarSign, Star, Tag, ChevronRight, Package,
  XCircle, Edit2, Building2
} from 'lucide-react';
import { PRODUCT_CATEGORY_META, SUPPLIER_CATEGORY_META } from '../config/categoryFields';
import NotFoundPage from './NotFoundPage';

export default function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getRouteById = useAppStore(s => s.getRouteById);
  const products = useAppStore(s => s.products);
  const suppliers = useAppStore(s => s.suppliers);

  if (!id) return <NotFoundPage />;
  const route = getRouteById(id);
  if (!route) return <NotFoundPage />;

  // Group itinerary by day (from JSONB)
  const daysMap = new Map<number, typeof route.itinerary>();
  (route.itinerary || []).forEach(item => {
    if (!daysMap.has(item.day)) daysMap.set(item.day, []);
    daysMap.get(item.day)!.push(item);
  });
  // Sort items within each day by order
  daysMap.forEach((items, day) => {
    daysMap.set(day, items.sort((a, b) => a.order - b.order));
  });
  const sortedDays = Array.from(daysMap.keys()).sort((a, b) => a - b);

  // If no days from itinerary, show empty days based on duration
  const displayDays = sortedDays.length > 0 ? sortedDays : [];

  // Calculate total cost from itinerary products
  const totalItineraryCost = (route.itinerary || []).reduce((sum, item) => {
    if (item.ref_type === 'product') {
      const p = products.find(pr => pr.id === item.ref_id);
      return sum + (p?.base_price || 0);
    }
    return sum;
  }, 0);

  const estimatedRevenue = route.pricing.base_price_per_pax * route.booking_count;
  const margin = route.pricing.base_price_per_pax > 0
    ? ((route.pricing.base_price_per_pax - totalItineraryCost) / route.pricing.base_price_per_pax * 100)
    : 0;

  const difficultyLabels: Record<string, { label: string; color: string }> = {
    facil: { label: 'Fácil', color: 'text-emerald-400' },
    moderado: { label: 'Moderado', color: 'text-amber-400' },
    dificil: { label: 'Difícil', color: 'text-orange-400' },
    extremo: { label: 'Extremo', color: 'text-rose-400' },
  };

  const mealLabels: Record<string, string> = {
    sin_comidas: 'Sin comidas',
    desayuno: 'Solo desayuno',
    media_pension: 'Media pensión',
    pension_completa: 'Pensión completa',
    todo_incluido: 'Todo incluido',
  };

  // Resolve an itinerary item to its display data
  const resolveItem = (item: typeof route.itinerary[0]) => {
    if (item.ref_type === 'product') {
      const p = products.find(pr => pr.id === item.ref_id);
      const s = p?.supplier_id ? suppliers.find(su => su.id === p.supplier_id) : undefined;
      return {
        name: p?.name || 'Producto eliminado',
        emoji: p ? (PRODUCT_CATEGORY_META[p.category]?.emoji || '📦') : '❓',
        category: p?.category?.replace(/_/g, ' ') || '',
        description: p?.short_description || p?.description || '',
        image: p?.images?.[0] || null,
        price: p?.base_price || 0,
        currency: p?.currency || '',
        duration: p?.duration_minutes || 0,
        minPax: p?.availability?.min_pax || 1,
        maxPax: p?.availability?.max_capacity || null,
        activityItinerary: p?.activity_itinerary || [],
        supplier: s,
        product: p,
        linkTo: p ? `/productos/${p.id}/detalle` : null,
      };
    } else {
      const s = suppliers.find(su => su.id === item.ref_id);
      return {
        name: s?.name || 'Proveedor eliminado',
        emoji: s ? (SUPPLIER_CATEGORY_META[s.category]?.emoji || '🏢') : '❓',
        category: s?.category?.replace(/_/g, ' ') || '',
        description: s ? `📍 ${s.location.city}${s.location.address ? ` · ${s.location.address}` : ''}` : '',
        image: s?.logo || s?.banner_image || null,
        price: 0,
        currency: '',
        duration: 0,
        minPax: 0,
        maxPax: null,
        activityItinerary: [],
        supplier: s,
        product: null,
        linkTo: s ? `/proveedores/${s.id}/detalle` : null,
      };
    }
  };

  return (
    <div className="space-y-8 animate-page-enter pb-20">
      {/* Hero Banner */}
      <div className="relative h-80 md:h-[420px] -mt-6 -mx-4 md:-mx-8 overflow-hidden rounded-b-[50px] shadow-2xl group">
         {route.images?.[0] ? (
           <img src={route.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={route.name} />
         ) : (
           <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <Navigation size={120} className="text-slate-800" />
           </div>
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

         <div className="absolute top-8 left-8">
            <Link to="/rutas" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest">
               <ArrowLeft size={16} /> Rutas
            </Link>
         </div>

         <div className="absolute top-8 right-8 flex items-center gap-2">
            <button
              onClick={() => navigate(`/rutas/${route.id}/editar`)}
              className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all"
              aria-label="Editar ruta"
            >
               <Edit2 size={20} />
            </button>
            <Link
              to={`/rutas/${route.id}/itinerario`}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-sky-500 hover:border-sky-500 transition-all px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest"
            >
               <Navigation size={16} /> Editar Itinerario
            </Link>
         </div>

         <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 flex-1">
               <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md flex items-center gap-1.5 ${
                    route.status === 'activo' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    route.status === 'pausado' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    route.status === 'borrador' ? 'bg-slate-500/20 text-slate-300 border-slate-500/30' :
                    'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {route.status === 'activo' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {route.status.toUpperCase()}
                  </span>
                  {route.is_featured && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                       <Star size={12} fill="currentColor" /> Destacada
                    </span>
                  )}
                  {route.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/10 ${difficultyLabels[route.difficulty]?.color || 'text-white'}`}>
                       {difficultyLabels[route.difficulty]?.label || route.difficulty}
                    </span>
                  )}
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">{route.name}</h1>
               <p className="text-slate-300 font-medium flex items-center gap-2 text-lg">
                  <MapPin size={18} className="text-emerald-400" /> {route.destination}
               </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-xl flex items-center gap-8 min-w-fit">
               <div className="text-center">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Duración</p>
                  <p className="text-3xl font-black text-white">{route.duration_days}<span className="text-sm text-slate-400 font-medium ml-1">días</span></p>
               </div>
               <div className="w-px h-12 bg-white/10" />
               <div className="text-center">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Precio/pax</p>
                  <p className="text-3xl font-black text-white"><span className="text-sm mr-0.5">{route.pricing.currency}</span>{route.pricing.base_price_per_pax.toLocaleString()}</p>
               </div>
               <div className="w-px h-12 bg-white/10" />
               <div className="text-center">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Actividades</p>
                  <p className="text-3xl font-black text-white">{route.itinerary?.length || 0}</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Sidebar */}
         <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4">
               <div className="glass-card p-4 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Bookings</p>
                  <p className="text-2xl font-black text-emerald-400">{route.booking_count}</p>
               </div>
               <div className="glass-card p-4 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Vistas</p>
                  <p className="text-2xl font-black text-sky-400">{route.view_count}</p>
               </div>
               <div className="glass-card p-4 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Revenue Est.</p>
                  <p className="text-xl font-black text-white">${estimatedRevenue.toLocaleString()}</p>
               </div>
               <div className="glass-card p-4 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Margen</p>
                  <p className={`text-xl font-black ${margin >= 30 ? 'text-emerald-400' : margin >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>{margin.toFixed(0)}%</p>
               </div>
            </div>

            {/* Pricing Details */}
            <div className="glass-card p-6 space-y-4">
               <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <DollarSign size={18} className="text-emerald-400" /> Detalles de Precio
               </h3>
               <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500 font-bold">Precio Base/Pax</span>
                     <span className="text-white font-black">{route.pricing.currency} {route.pricing.base_price_per_pax.toLocaleString()}</span>
                  </div>
                  {route.pricing.min_pax > 0 && (
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-slate-500 font-bold">Mín. Pasajeros</span>
                       <span className="text-white font-bold">{route.pricing.min_pax}</span>
                    </div>
                  )}
                  {route.pricing.max_pax && (
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-slate-500 font-bold">Máx. Pasajeros</span>
                       <span className="text-white font-bold">{route.pricing.max_pax}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500 font-bold">Costo Itinerario</span>
                     <span className="text-slate-300 font-bold">${totalItineraryCost.toLocaleString()}</span>
                  </div>
                  {route.pricing.includes_guide !== undefined && (
                    <div className="pt-3 border-t border-white/5 space-y-2">
                       <div className="flex items-center gap-2 text-xs">
                          {route.pricing.includes_guide ? <CheckCircle2 size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-slate-600" />}
                          <span className={route.pricing.includes_guide ? 'text-white font-bold' : 'text-slate-500'}>Guía incluido</span>
                       </div>
                       <div className="flex items-center gap-2 text-xs">
                          {route.pricing.includes_transport ? <CheckCircle2 size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-slate-600" />}
                          <span className={route.pricing.includes_transport ? 'text-white font-bold' : 'text-slate-500'}>Transporte incluido</span>
                       </div>
                       <div className="flex items-center gap-2 text-xs">
                          {route.pricing.includes_meals ? <CheckCircle2 size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-slate-600" />}
                          <span className={route.pricing.includes_meals ? 'text-white font-bold' : 'text-slate-500'}>
                            Comidas {route.pricing.includes_meals && route.pricing.meal_plan ? `(${mealLabels[route.pricing.meal_plan] || route.pricing.meal_plan})` : ''}
                          </span>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            {/* Description */}
            <div className="glass-card p-6">
               <h3 className="text-lg font-black text-white border-b border-white/5 pb-3 mb-4">Descripción</h3>
               <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                  {route.description || 'Sin descripción disponible para esta ruta.'}
               </p>
            </div>

            {/* Highlights */}
            {route.highlights && route.highlights.length > 0 && (
              <div className="glass-card p-6">
                 <h3 className="text-lg font-black text-white border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
                    <Star size={16} className="text-amber-500" /> Highlights
                 </h3>
                 <div className="space-y-2">
                    {route.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2">
                         <CheckCircle2 size={14} className="text-amber-500 mt-0.5 shrink-0" />
                         <p className="text-sm text-white font-medium">{h}</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* Included / Not Included */}
            {((route.included?.length || 0) > 0 || (route.not_included?.length || 0) > 0) && (
              <div className="glass-card p-6 space-y-5">
                 {route.included && route.included.length > 0 && (
                   <div>
                      <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                         <CheckCircle2 size={14} /> Incluye
                      </h4>
                      <div className="space-y-1.5">
                         {route.included.map((item, i) => (
                           <p key={i} className="text-xs text-white font-medium flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> {item}
                           </p>
                         ))}
                      </div>
                   </div>
                 )}
                 {route.not_included && route.not_included.length > 0 && (
                   <div>
                      <h4 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                         <XCircle size={14} /> No Incluye
                      </h4>
                      <div className="space-y-1.5">
                         {route.not_included.map((item, i) => (
                           <p key={i} className="text-xs text-slate-400 font-medium flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" /> {item}
                           </p>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
            )}

            {/* Tags */}
            {route.tags && route.tags.length > 0 && (
              <div className="glass-card p-6">
                 <h4 className="text-sm font-black text-white uppercase mb-3 flex items-center gap-2">
                    <Tag size={14} className="text-emerald-400" /> Etiquetas
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {route.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                 </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="glass-card p-6 space-y-3">
               <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">Registro</h4>
               <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Creado</span>
                  <span className="text-white font-bold">{new Date(route.created_at).toLocaleDateString()}</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Actualizado</span>
                  <span className="text-white font-bold">{new Date(route.updated_at).toLocaleDateString()}</span>
               </div>
            </div>
         </div>

         {/* Main: Itinerary */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-xl font-black text-white flex items-center gap-2 mx-2">
                  <Navigation size={20} className="text-emerald-400" /> Plan de Viaje — {route.itinerary?.length || 0} actividades
               </h2>
               <Link
                 to={`/rutas/${route.id}/itinerario`}
                 className="text-sm font-bold text-emerald-400 hover:text-emerald-300 px-4 py-2"
               >
                 Editar Itinerario →
               </Link>
            </div>

            {displayDays.length === 0 ? (
              <div className="glass-card p-12 rounded-3xl flex flex-col items-center text-center">
                 <CalendarDays size={48} className="text-slate-700 mb-4" />
                 <h3 className="text-lg font-bold text-white mb-2">Itinerario Vacío</h3>
                 <p className="text-sm text-slate-500 max-w-sm mb-6">
                   Esta ruta aún no tiene actividades asignadas. Usa el constructor para arrastrar productos y proveedores.
                 </p>
                 <Link to={`/rutas/${route.id}/itinerario`} className="btn-primary">
                   Abrir Constructor
                 </Link>
              </div>
            ) : (
              <div className="space-y-8">
                 {displayDays.map(dayNum => {
                   const items = daysMap.get(dayNum)!;
                   return (
                     <div key={dayNum} className="relative pl-10 border-l-2 border-emerald-500/30 ml-4">
                        <div className="absolute top-0 -left-5 w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center font-black text-emerald-400 text-sm shadow-lg shadow-emerald-500/10">
                          D{dayNum}
                        </div>
                        <h3 className="text-lg font-black text-white mb-5 mt-1 ml-2">Día {dayNum}</h3>

                        <div className="space-y-4">
                           {items.map((item) => {
                             const resolved = resolveItem(item);
                             const isProduct = item.ref_type === 'product';

                             return (
                               <div key={item.id} className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start group transition-all hover:border-emerald-500/30">
                                  {/* Image */}
                                  <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                                     {resolved.image ? (
                                       <img src={resolved.image} className="w-full h-full object-cover" alt={resolved.name} />
                                     ) : (
                                       <div className="w-full h-full flex items-center justify-center text-3xl bg-slate-800/50">
                                          {resolved.emoji}
                                       </div>
                                     )}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0 space-y-2">
                                     <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg">{resolved.emoji}</span>
                                          <h4 className="text-base font-black text-white truncate">{resolved.name}</h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                           <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 flex items-center gap-1">
                                             {isProduct ? <Package size={10} /> : <Building2 size={10} />}
                                             {isProduct ? 'Producto' : 'Proveedor'}
                                           </span>
                                           {(item.time_start || item.time_end) && (
                                             <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-400 flex items-center gap-1 shrink-0">
                                               <Clock size={10} /> {item.time_start || '?'} — {item.time_end || '?'}
                                             </span>
                                           )}
                                           {item.is_optional && (
                                             <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400">Opcional</span>
                                           )}
                                           {item.included_in_price ? (
                                             <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400">Incluido</span>
                                           ) : (
                                             <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-400">Extra</span>
                                           )}
                                        </div>
                                     </div>

                                     {resolved.category && (
                                       <p className="text-xs font-bold text-amber-500 capitalize">{resolved.category}</p>
                                     )}

                                     {resolved.description && (
                                       <p className="text-xs text-slate-400 line-clamp-2">{resolved.description}</p>
                                     )}

                                     <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                                        {resolved.duration > 0 && (
                                          <span className="flex items-center gap-1"><Clock size={10} /> {resolved.duration} min</span>
                                        )}
                                        {resolved.price > 0 && (
                                          <span className="text-emerald-400 font-bold">{resolved.currency} {resolved.price.toLocaleString()}</span>
                                        )}
                                        {resolved.minPax > 0 && (
                                          <span className="flex items-center gap-1"><Users size={10} /> {resolved.minPax}-{resolved.maxPax || '∞'} pax</span>
                                        )}
                                     </div>

                                     {/* Product activity sub-itinerary */}
                                     {resolved.activityItinerary.length > 0 && (
                                       <div className="mt-2 pt-2 pl-3 border-l-2 border-sky-500/30 space-y-1.5">
                                          <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Sub-Itinerario</p>
                                          {resolved.activityItinerary.map((step: any, i: number) => (
                                            <div key={i} className="flex items-center gap-2">
                                               <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded">{step.time}</span>
                                               <span className="text-xs text-slate-300 font-medium">{step.activity}</span>
                                            </div>
                                          ))}
                                       </div>
                                     )}

                                     {/* Supplier info for products */}
                                     {resolved.supplier && isProduct && (
                                       <p className="text-[10px] text-slate-500">
                                         Proveedor: <Link to={`/proveedores/${resolved.supplier.id}/detalle`} className="text-sky-400 hover:text-sky-300">{resolved.supplier.name}</Link>
                                       </p>
                                     )}

                                     {item.notes && (
                                       <p className="text-xs italic p-2.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 mt-1">
                                         "{item.notes}"
                                       </p>
                                     )}

                                     {resolved.linkTo && (
                                       <Link
                                         to={resolved.linkTo}
                                         className="inline-flex items-center gap-1 text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest mt-1 transition-colors"
                                       >
                                         Ver detalle <ChevronRight size={12} />
                                       </Link>
                                     )}
                                  </div>
                               </div>
                             );
                           })}
                        </div>
                     </div>
                   );
                 })}
              </div>
            )}

            {/* Gallery */}
            {route.images && route.images.filter(img => img).length > 0 && (
              <div className="space-y-4 mt-8">
                 <h3 className="text-xl font-black text-white mx-2">Galería ({route.images.filter(img => img).length})</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {route.images.filter(img => img).map((img, i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-800 border-2 border-transparent hover:border-emerald-500 transition-all cursor-pointer">
                         <img src={img} className="w-full h-full object-cover transition-transform hover:scale-110" alt="" />
                      </div>
                    ))}
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
