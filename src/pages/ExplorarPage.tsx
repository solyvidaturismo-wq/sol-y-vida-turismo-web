import { useState, useMemo } from 'react';
import { useProducts, useSuppliers } from '../store/useAppStore';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  ChevronRight,
  Compass,
  Zap,
  Tag,
  Package,
  ArrowUpDown,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCT_CATEGORY_META } from '../config/categoryFields';

export default function ExplorarPage() {
  const products = useProducts();
  const suppliers = useSuppliers();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activePriceRange, setActivePriceRange] = useState<[number, number]>([0, 5000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('rating');

  // Filtering Logic
  const filtered = useMemo(() => {
    return products
      .filter(p => {
        const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || 
                            p.description?.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
        const matchesPrice = p.base_price >= activePriceRange[0] && p.base_price <= activePriceRange[1];
        return matchesQuery && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.base_price - b.base_price;
        if (sortBy === 'price_desc') return b.base_price - a.base_price;
        return (b as any).rating - (a as any).rating;
      });
  }, [products, query, activeCategory, activePriceRange, sortBy]);

  return (
    <div className="space-y-8 animate-page-enter">
      {/* Search & Hero Section */}
      <div className="relative p-12 rounded-[40px] bg-slate-900 border border-white/5 overflow-hidden group">
         <Zap className="absolute -right-20 -bottom-20 text-white/[0.02] w-96 h-96 rotate-12" />
         <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
               Explora el Universo <span className="text-amber-500">Sol y Vida</span>
            </h1>
            <p className="text-slate-400 font-medium mb-8 text-lg">
               Busca entre cientos de experiencias, hoteles y servicios curados para los viajeros más exigentes.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input 
                    type="text" 
                    placeholder="¿A dónde vamos hoy? Busca tours, hoteles..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                       <X size={16} />
                    </button>
                  )}
               </div>
               <button className="btn-primary px-10 py-4 bg-amber-500 text-slate-900 shadow-xl shadow-amber-500/20">
                  Buscar Ahora
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar Controls */}
         <div className="space-y-8">
            <div className="glass-card p-6 space-y-6">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                     <Filter size={18} className="text-amber-500" /> Filtros
                  </h3>
                  <button 
                    onClick={() => { setActiveCategory('all'); setSortBy('rating'); setActivePriceRange([0, 5000]); }}
                    className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-all"
                  >
                     Limpiar
                  </button>
               </div>

               {/* Categories */}
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Categorías</p>
                  <div className="space-y-1.5 text-sm font-bold">
                     <button 
                       onClick={() => setActiveCategory('all')}
                       className={`w-full text-left px-3 py-2 rounded-xl transition-all ${activeCategory === 'all' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-slate-400 hover:bg-white/5'}`}
                     >
                       🌎 Todas las experiencias
                     </button>
                     {Object.entries(PRODUCT_CATEGORY_META).map(([key, meta]) => (
                       <button 
                         key={key}
                         onClick={() => setActiveCategory(key)}
                         className={`w-full text-left px-3 py-2 rounded-xl transition-all ${activeCategory === key ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-slate-400 hover:bg-white/5'}`}
                       >
                         {meta.emoji} {meta.label}
                       </button>
                     ))}
                  </div>
               </div>

               {/* Price Range */}
               <div className="space-y-4 pt-4 border-t border-white/5">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Rango de Precio (USD)</p>
                  <div className="space-y-4 px-1">
                     <div className="flex justify-between text-xs font-black text-white">
                        <span>$0</span>
                        <span>$5,000+</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" 
                       max="5000" 
                       value={activePriceRange[1]}
                       onChange={(e) => setActivePriceRange([0, parseInt(e.target.value)])}
                       className="w-full accent-amber-500"
                     />
                     <div className="p-3 rounded-xl bg-slate-900 text-center font-black text-amber-500 border border-white/5">
                        HASTA $ {activePriceRange[1].toLocaleString()}
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 rounded-[32px] bg-slate-900 border border-white/5 overflow-hidden relative">
               <Compass className="absolute -right-4 -bottom-4 text-white/[0.02] w-24 h-24" />
               <h4 className="text-white font-black text-sm mb-2">Asistente Sol y Vida</h4>
               <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                 "Recuerda que puedes filtrar por la puntuación de nuestros viajeros para encontrar las experiencias Top Rated."
               </p>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="lg:col-span-3 space-y-6">
            {/* Sort & Views */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-4">
               <div className="flex items-center gap-4">
                  <p className="text-xs font-bold text-slate-500">Mostrando {filtered.length} resultados</p>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                     <ArrowUpDown size={14} className="text-slate-500" />
                     <select 
                       value={sortBy}
                       onChange={(e) => setSortBy(e.target.value as any)}
                       className="bg-transparent border-none text-xs font-black text-white focus:ring-0 uppercase tracking-widest cursor-pointer"
                     >
                        <option value="rating">Popularidad (Top)</option>
                        <option value="price_asc">Precio: Bajo a Alto</option>
                        <option value="price_desc">Precio: Alto a Bajo</option>
                     </select>
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-400'}`}>
                     <Grid size={18} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-400'}`}>
                     <List size={18} />
                  </button>
               </div>
            </div>

            {/* Catalog Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(product => {
                  const supplier = suppliers.find(s => s.id === product.supplier_id);
                  return (
                    <div key={product.id} className="glass-card group overflow-hidden border border-white/5 hover:border-amber-500/40 transition-all duration-300 transform-gpu hover:-translate-y-1">
                       <div className="h-48 bg-slate-800 relative">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-700"><Package size={48}/></div>
                          )}
                          <div className="absolute top-3 left-3 flex gap-2">
                             <span className="px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-[9px] font-black text-white uppercase border border-white/10 tracking-widest">
                                {product.category.replace('_', ' ')}
                             </span>
                          </div>
                          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-2xl bg-amber-500 text-slate-900 font-black text-xs shadow-xl">
                             {product.currency} {product.base_price.toLocaleString()}
                          </div>
                       </div>
                       
                       <div className="p-6">
                          <h3 className="text-lg font-black text-white mb-2 line-clamp-1 group-hover:text-amber-500 transition-colors uppercase tracking-tight">{product.name}</h3>
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 h-8 mb-4 leading-relaxed">
                             {product.short_description || 'Explora esta increíble experiencia diseñada por Sol y Vida.'}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4 pb-4 mb-4 border-b border-white/5">
                             <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                <Clock size={14} className="text-amber-500" />
                                {product.duration_minutes} min
                             </div>
                             <div className="flex items-center gap-2 text-slate-400 text-xs font-bold justify-end">
                                <Star size={14} className="text-amber-500 fill-amber-500" />
                                {(product as any).rating || '-'}
                             </div>
                          </div>

                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                                   {supplier?.logo && <img src={supplier.logo} className="w-full h-full object-cover opacity-80" />}
                                </div>
                                <span className="text-[10px] font-black text-slate-500 truncate max-w-[100px] uppercase">{supplier?.name || 'Interno'}</span>
                             </div>
                             <Link 
                               to={`/productos/${product.id}/detalle`}
                               className="text-amber-500 font-black text-[10px] uppercase tracking-widest hover:text-amber-400 flex items-center gap-1"
                             >
                               Detalles <ChevronRight size={14} />
                             </Link>
                          </div>
                       </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(product => {
                  const supplier = suppliers.find(s => s.id === product.supplier_id);
                  return (
                    <div key={product.id} className="glass-card p-4 flex gap-6 group hover:border-amber-500/40 transition-all">
                       <div className="w-40 h-28 rounded-2xl bg-slate-800 overflow-hidden shrink-0 border border-white/5">
                          {product.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-cover" /> : <Package size={24} className="m-auto mt-10 text-slate-700" />}
                       </div>
                       <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                             <div className="flex items-center gap-3 mb-1">
                               <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{product.category}</span>
                               <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600"><Star size={10} fill="currentColor" /> {(product as any).rating || '-'}</span>
                             </div>
                             <h3 className="text-lg font-black text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight">{product.name}</h3>
                             <p className="text-xs text-slate-500 font-medium line-clamp-1">{product.short_description || 'Sin descripción disponible.'}</p>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase">
                             <div className="flex items-center gap-1.5"><Clock size={12}/> {product.duration_minutes} MIN</div>
                             <div className="flex items-center gap-1.5"><Tag size={12}/> {supplier?.name || 'Interno'}</div>
                          </div>
                       </div>
                       <div className="w-32 flex flex-col items-end justify-between py-1 border-l border-white/5 pl-6">
                          <p className="text-2xl font-black text-white text-right leading-none">
                             <span className="text-xs block text-slate-500 font-bold mb-1">P. BASE</span>
                             {product.currency} {product.base_price.toLocaleString()}
                          </p>
                          <Link to={`/productos/${product.id}/detalle`} className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all">
                             Reservar
                          </Link>
                       </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="glass-card p-32 text-center">
                 <Search size={48} className="mx-auto text-slate-800 mb-6" />
                 <h3 className="text-xl font-black text-white mb-2">No encontramos coincidencias</h3>
                 <p className="text-slate-500 text-sm max-w-sm mx-auto">Prueba ajustando los filtros o buscando con otros términos relacionados.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
