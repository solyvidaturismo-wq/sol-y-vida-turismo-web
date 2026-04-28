import { useState, useMemo } from 'react';
import { useRoutes, useRouteItems, useAppStore } from '../store/useAppStore';
import {
  Map,
  Search,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  MapPin,
  Calendar,
  Compass,
  ArrowUpRight,
  LayoutGrid,
  List as ListIcon,
  Archive
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '../store/useToastStore';
import Pagination from '../components/ui/Pagination';

const PAGE_SIZE = 20;

export default function RoutesPage() {
  const routes = useRoutes();
  const allRouteItems = useRouteItems();
  const deleteRoute = useAppStore(s => s.deleteRoute);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  // Filtering
  const filteredRoutes = useMemo(() => {
    setPage(1);
    return routes.filter(r => {
      const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase()) ||
                          r.destination.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = activeStatus === 'all' || r.status === activeStatus;
      return matchesQuery && matchesStatus;
    });
  }, [routes, query, activeStatus]);

  const paginatedRoutes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRoutes.slice(start, start + PAGE_SIZE);
  }, [filteredRoutes, page]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Eliminar la ruta "${name}"? Todas las planeaciones asociadas se verán afectadas.`)) {
      try {
        await deleteRoute(id);
        toast.success(`Ruta "${name}" eliminada`);
      } catch (err: any) {
        toast.error('Error al eliminar: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Map className="text-emerald-500" />
            Rutas y Paquetes
          </h1>
          <p className="text-slate-400 text-sm font-medium">Planifica y estructura la oferta de Sol y Vida.</p>
        </div>
        <Link to="/rutas/nuevo" className="btn-primary flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500">
          <Plus size={18} />
          Nueva Ruta
        </Link>
      </div>

      {/* Toolbar */}
      <div className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por destino o nombre..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-900/50 border border-white/10 rounded-xl p-1">
             <button 
               onClick={() => setActiveStatus('all')}
               className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeStatus === 'all' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Todos
             </button>
             <button 
               onClick={() => setActiveStatus('activo')}
               className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeStatus === 'activo' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Activos
             </button>
             <button 
               onClick={() => setActiveStatus('pausado')}
               className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeStatus === 'pausado' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Pausados
             </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button
             onClick={() => setViewMode('grid')}
             className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-400 hover:text-white'}`}
             aria-label="Vista cuadrícula"
           >
             <LayoutGrid size={20} />
           </button>
           <button
             onClick={() => setViewMode('list')}
             className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-400 hover:text-white'}`}
             aria-label="Vista lista"
           >
             <ListIcon size={20} />
           </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedRoutes.map((route) => (
            <div key={route.id} className="glass-card group overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-300 transform-gpu hover:-translate-y-1 flex flex-col">
              <Link to={`/rutas/${route.id}/detalle`} className="flex-1 flex flex-col cursor-pointer">
              {/* Image Banner */}
              <div className="h-44 bg-slate-800 relative overflow-hidden">
                {route.images?.[0] ? (
                  <img src={route.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                     <Compass size={48} className="text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900 to-transparent" />
                
                {/* Stats overlays */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                   <div className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white font-black text-[10px] text-right">
                     {route.pricing.currency} {route.pricing.base_price_per_pax.toFixed(2)}
                   </div>
                   <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-right border ${
                    route.status === 'activo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                   }`}>
                     {route.status}
                   </div>
                </div>

                <div className="absolute bottom-4 left-5">
                   <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">
                      <MapPin size={12} /> {route.destination}
                   </div>
                   <h3 className="text-white font-black text-xl leading-tight group-hover:text-emerald-400 transition-colors">{route.name}</h3>
                </div>
              </div>

              {/* Content body */}
              <div className="p-5 flex-1 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Duración</p>
                       <div className="flex items-center gap-2 text-white font-bold text-sm">
                          <Calendar size={14} className="text-emerald-500" />
                          {route.duration_days} Días
                       </div>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Servicios</p>
                       <div className="flex items-center gap-2 text-white font-bold text-sm">
                          <Plus size={14} className="text-emerald-500" />
                          {allRouteItems.filter(ri => ri.route_id === route.id).length} Items
                       </div>
                    </div>
                 </div>

                 <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">
                   {route.description || 'Sin descripción para esta ruta.'}
                 </p>

                 {/* Tags */}
                 <div className="flex flex-wrap gap-1.5">
                    {route.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5 uppercase">
                        {tag}
                      </span>
                    ))}
                 </div>
              </div>
              </Link>

              {/* Action area */}
              <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                   REVISAR RUTA <ArrowUpRight size={14} />
                 </span>
                 <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/rutas/${route.id}/editar`)} className="p-2 text-slate-600 hover:text-sky-400 transition-colors" aria-label="Editar"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(route.id, route.name)} className="p-2 text-slate-600 hover:text-rose-400 transition-colors" aria-label="Eliminar"><Trash2 size={16}/></button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="glass-card overflow-hidden">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] text-slate-500 font-black">
                   <th className="px-6 py-4">Ruta / Paquete</th>
                   <th className="px-6 py-4">Destino Principal</th>
                   <th className="px-6 py-4">Duración</th>
                   <th className="px-6 py-4">Precio Sugerido</th>
                   <th className="px-6 py-4">Estado</th>
                   <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedRoutes.map(r => (
                  <tr key={r.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-white/5">
                             <Compass size={18} className="text-emerald-500" />
                          </div>
                          <span className="text-sm font-bold text-white">{r.name}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin size={12} className="text-emerald-500" /> {r.destination}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs font-black text-slate-300">{r.duration_days} DIAS</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm font-black text-white">{r.pricing.currency} {r.pricing.base_price_per_pax.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                         r.status === 'activo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                       }`}>
                         {r.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right pr-6">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <Link to={`/rutas/${r.id}/detalle`} className="p-2 text-slate-400 hover:text-white"><ExternalLink size={14}/></Link>
                          <button onClick={() => navigate(`/rutas/${r.id}/editar`)} className="p-2 text-slate-400 hover:text-sky-400" aria-label="Editar"><Edit2 size={14}/></button>
                          <button onClick={() => handleDelete(r.id, r.name)} className="p-2 text-slate-400 hover:text-rose-400" aria-label="Eliminar"><Trash2 size={14}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={page} totalItems={filteredRoutes.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      {/* Empty View */}
      {filteredRoutes.length === 0 && (
        <div className="glass-card p-24 text-center">
           <Archive size={64} className="mx-auto text-slate-800 mb-6" />
           <h3 className="text-xl font-black text-white mb-2">Sin rutas en el registro</h3>
           <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">Empieza a agrupar tus productos y servicios en rutas lógicas para facilitar la venta y operación.</p>
           <Link to="/rutas/nuevo" className="btn-primary">Crear mi primera ruta</Link>
        </div>
      )}
    </div>
  );
}
