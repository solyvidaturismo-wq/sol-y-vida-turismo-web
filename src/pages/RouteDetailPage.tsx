import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, MapPin, Clock, Users, CalendarDays, Zap, CheckCircle2, Navigation } from 'lucide-react';
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

  // Group itinerary by day
  const daysMap = new Map<number, typeof route.itinerary[0][]>();
  route.itinerary.forEach(item => {
    if (!daysMap.has(item.day)) {
      daysMap.set(item.day, []);
    }
    daysMap.get(item.day)!.push(item);
  });
  const sortedDays = Array.from(daysMap.keys()).sort((a, b) => a - b);

  return (
    <div className="pb-20">
      {/* Dynamic Hero Banner */}
      <div
        className="w-full h-[35vh] sm:h-[45vh] relative flex items-end justify-start p-6 sm:p-12 mb-8 pt-20"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottomLeftRadius: '2rem',
          borderBottomRightRadius: '2rem',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/70 to-transparent rounded-b-[2rem]"></div>

        <button
          onClick={() => navigate('/rutas')}
          className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all shadow-lg"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md flex items-center gap-1.5
                ${route.status === 'activo' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                  route.status === 'pausado' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-slate-500/20 text-slate-300 border-slate-500/30'}`}
              >
                {route.status === 'activo' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                ESTADO: {route.status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight mb-2">
              {route.name}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl text-shadow-sm flex items-center gap-2">
              <MapPin size={18} className="text-sky-400" /> {route.destination}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-xl flex items-center gap-6 min-w-fit">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Duración</p>
              <p className="text-3xl font-black text-white">
                {route.duration_days} <span className="text-lg text-slate-400 font-medium">días</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Brief & Highlights */}
        <div className="lg:col-span-1 space-y-6">

          <div className="glass-card p-6 rounded-3xl">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-4">Métricas de la Ruta</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold mb-0.5">Operación</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">
                    Todo el año
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold mb-0.5">Tipo de Viajero</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">
                    {route.tags.length > 0 ? route.tags.join(', ') : 'Todos'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <Zap size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold mb-0.5">Actividades Itineradas</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {route.itinerary.length} items confirmados
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-2">Descripción General</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {route.description || <span className="italic">Detalles adicionales no proporcionados para esta ruta.</span>}
            </p>
          </div>
        </div>

        {/* Right Column: Itinerary Builder View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black mx-2 text-slate-800 dark:text-white flex items-center gap-2">
              <Navigation size={20} className="text-sky-500" /> Plan de Viaje Detallado
            </h2>
            <Link
              to={`/rutas/${route.id}/itinerario`}
              className="text-sm font-bold text-sky-500 hover:text-sky-600 px-4 py-2"
            >
              Editar Itinerario
            </Link>
          </div>

          {sortedDays.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                <CalendarDays size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Itinerario Vacío</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-6">
                Esta ruta aún no tiene actividades asignadas. Utiliza el constructor visual para arrastrar productos.
              </p>
              <Link
                to={`/rutas/${route.id}/itinerario`}
                className="btn-primary"
              >
                Abrir Constructor
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDays.map(dayNum => {
                const items = daysMap.get(dayNum)!;
                return (
                  <div key={dayNum} className="relative pl-8 border-l border-slate-200 dark:border-slate-800 ml-4 pb-4">
                    <div className="absolute top-0 -left-4 w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-500/20 border-2 border-sky-500 flex items-center justify-center font-black text-sky-600 dark:text-sky-400 font-mono text-sm shadow-md">
                      D{dayNum}
                    </div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 mt-1">Día {dayNum}</h3>

                    <div className="space-y-3">
                      {items.map((item) => {
                        const product = item.ref_type === 'product' ? products.find(p => p.id === item.ref_id) : undefined;
                        const supplier = item.ref_type === 'supplier' ? suppliers.find(s => s.id === item.ref_id) : undefined;
                        const name = product ? product.name : (supplier ? supplier.name : 'Elemento eliminado');
                        const catLabel = product ? product.category : (supplier ? supplier.category : '');
                        const images = product?.images || (supplier?.logo ? [supplier.logo] : []);

                        return (
                          <div key={item.id} className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-start group transition-colors" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="w-full sm:w-28 sm:h-28 h-40 rounded-xl overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.02)' }}>
                              {images[0] ? (
                                <img src={images[0]} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl" style={{ color: 'var(--color-text-muted)' }}>
                                  {product ? '📦' : '🏢'}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col h-full">
                              <div className="flex flex-wrap items-center justify-between mb-1 gap-2">
                                <h4 className="text-base font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
                                  {name}
                                </h4>
                                {(item.time_start || item.time_end) && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0" style={{ background: 'rgba(14,165,233,0.1)', color: '#38bdf8' }}>
                                    <Clock size={10} /> {item.time_start || '?'} - {item.time_end || '?'}
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

                              {supplier && (
                                <div className="mb-3 space-y-1">
                                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                    📍 {supplier.location.city} - {supplier.location.address}
                                  </p>
                                  <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                                    <span>📞 {supplier.contact.name} ({supplier.contact.phone})</span>
                                  </div>
                                </div>
                              )}

                              {item.notes && (
                                <p className="text-xs italic p-2.5 rounded-lg mt-auto" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--color-text-secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                  "{item.notes}"
                                </p>
                              )}

                              {/* Administración: pagos, alertas de seguridad */}
                              {(product?.payment_methods?.length || product?.safety_protocols || product?.recommendations) ? (
                                <div className="mt-3 flex flex-wrap gap-1.5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                  {product?.payment_methods && product.payment_methods.length > 0 && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.2)' }} title="Medio de pago disponible">💳 Pagos</span>
                                  )}
                                  {product?.safety_protocols && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }} title="Tiene protocolos de seguridad">🛡️ Seguridad</span>
                                  )}
                                  {product?.recommendations && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }} title="Contiene recomendaciones específicas">⚠️ Recomendaciones</span>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
