import { useState, useMemo } from 'react';
import { useProducts, useAppStore, useSuppliers } from '../store/useAppStore';
import {
  Package,
  Search,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  LayoutGrid,
  List as ListIcon,
  Tag,
  Clock,
  DollarSign,
  AlertTriangle,
  Star
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PRODUCT_CATEGORY_META } from '../config/categoryFields';
import { toast } from '../store/useToastStore';
import Pagination from '../components/ui/Pagination';

const PAGE_SIZE = 20;

export default function ProductsPage() {
  const products = useProducts();
  const suppliers = useSuppliers();
  const deleteProduct = useAppStore(s => s.deleteProduct);
  const updateProduct = useAppStore(s => s.updateProduct);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get('category') || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleFeatured = async (id: string, current: boolean, name: string) => {
    setTogglingId(id);
    try {
      await updateProduct(id, { is_featured: !current });
      toast.success(!current ? `"${name}" visible en el landing` : `"${name}" oculto del landing`);
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  // Filtering
  const filteredProducts = useMemo(() => {
    setPage(1);
    return products.filter(p => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) ||
                          (p.short_description || '').toLowerCase().includes(query.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesFeatured = !onlyFeatured || p.is_featured;
      return matchesQuery && matchesCategory && matchesFeatured;
    });
  }, [products, query, activeCategory, onlyFeatured]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Eliminar "${name}"? Se quitará de todos los itinerarios.`)) {
      try {
        await deleteProduct(id);
        toast.success(`Producto "${name}" eliminado`);
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
            <Package className="text-sky-500" />
            Catálogo de Productos
          </h1>
          <p className="text-slate-400 text-sm font-medium">Atractivos, Hoteles, Transporte y Servicios del inventario.</p>
        </div>
        <Link to="/productos/nuevo" className="btn-primary flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500">
          <Plus size={18} />
          Nuevo Producto
        </Link>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'En Inventario', val: products.length, icon: Package, borderClass: 'border-sky-500', iconClass: 'text-sky-400' },
           { label: 'Promedio Precio', val: `$${Math.round(products.reduce((a, b) => a + b.base_price, 0) / (products.length || 1))}`, icon: DollarSign, borderClass: 'border-emerald-500', iconClass: 'text-emerald-400' },
           { label: 'Categorías', val: new Set(products.map(p => p.category)).size, icon: Tag, borderClass: 'border-amber-500', iconClass: 'text-amber-400' },
           { label: 'Sin Proveedor', val: products.filter(p => !p.supplier_id).length, icon: AlertTriangle, borderClass: 'border-rose-500', iconClass: 'text-rose-400' },
         ].map((stat, i) => (
           <div key={i} className={`glass-card p-4 border-l-4 ${stat.borderClass}`}>
              <div className="flex items-center gap-3 text-slate-400 mb-1">
                 <stat.icon size={14} className={stat.iconClass} />
                 <span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-xl font-black text-white">{stat.val}</p>
           </div>
         ))}
      </div>

      {/* Toolbar */}
      <div className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar productos..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="bg-slate-900/50 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none transition-all font-medium min-w-[180px]"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {Object.entries(PRODUCT_CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.emoji} {meta.label}</option>
            ))}
          </select>
          <button
            onClick={() => setOnlyFeatured(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              onlyFeatured
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
            }`}
            title="Mostrar solo productos publicados en el landing /velez"
          >
            <Star size={14} className={onlyFeatured ? 'fill-amber-400' : ''} />
            En landing
          </button>
        </div>

        <div className="flex items-center gap-2">
           <button
             onClick={() => setViewMode('grid')}
             className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-sky-500 text-slate-900 shadow-lg shadow-sky-500/20' : 'bg-white/5 text-slate-400 hover:text-white'}`}
             aria-label="Vista cuadrícula"
           >
             <LayoutGrid size={20} />
           </button>
           <button
             onClick={() => setViewMode('list')}
             className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-sky-500 text-slate-900 shadow-lg shadow-sky-500/20' : 'bg-white/5 text-slate-400 hover:text-white'}`}
             aria-label="Vista lista"
           >
             <ListIcon size={20} />
           </button>
        </div>
      </div>

      {/* Main View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => {
            const meta = PRODUCT_CATEGORY_META[product.category as keyof typeof PRODUCT_CATEGORY_META];
            const supplier = suppliers.find(s => s.id === product.supplier_id);
            
            return (
              <div key={product.id} className="glass-card group flex flex-col hover:border-sky-500/30 transition-all duration-300 transform-gpu hover:-translate-y-1 relative">
                 {/* Toggle landing (fuera del Link para no navegar) */}
                 <button
                   type="button"
                   onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     handleToggleFeatured(product.id, !!product.is_featured, product.name);
                   }}
                   disabled={togglingId === product.id}
                   title={product.is_featured ? 'Visible en landing — click para ocultar' : 'Publicar en landing /velez'}
                   className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all ${
                     product.is_featured
                       ? 'bg-amber-500 text-white border-amber-300 shadow-lg shadow-amber-500/40'
                       : 'bg-black/40 text-white/80 border-white/10 hover:bg-amber-500/30 hover:text-amber-300'
                   } disabled:opacity-50`}
                 >
                   <Star size={16} className={product.is_featured ? 'fill-white' : ''} />
                 </button>
                 <Link to={`/productos/${product.id}/detalle`} className="flex-1 flex flex-col cursor-pointer">
                 {/* Visual Area */}
                 <div className="h-44 bg-slate-800 relative overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <Package size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

                    {/* Floating price */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white font-black text-sm">
                       {product.currency} {product.base_price.toFixed(2)}
                    </div>

                    {/* Meta tag */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                       <span className="px-2 py-0.5 rounded-md bg-sky-500/80 text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-sm">
                         {meta?.label || product.category}
                       </span>
                       {product.is_featured && (
                         <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-sm flex items-center gap-1">
                           <Star size={10} className="fill-white" /> Landing
                         </span>
                       )}
                    </div>
                 </div>

                 {/* Information */}
                 <div className="p-5 flex-1">
                    <h3
                      className="text-base font-black mb-2 line-clamp-2 leading-tight min-h-[40px]"
                      style={{ color: '#ffffff', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
                    >{product.name}</h3>
                    <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-4 leading-relaxed h-[32px]">
                      {product.short_description || 'Sin descripción resumida disponible.'}
                    </p>

                    <div className="space-y-2 mb-4">
                       <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-slate-600">Duración</span>
                          <span className="text-slate-300 flex items-center gap-1">
                             <Clock size={12} className="text-sky-500" /> {product.duration_minutes} min
                          </span>
                       </div>
                       <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-slate-600">Capacidad</span>
                          <span className="text-slate-300">{product.availability.min_pax}-{product.availability.max_capacity || '∞'} pax</span>
                       </div>
                    </div>

                    {/* Provider Info */}
                    <div className="pt-4 border-t border-white/5 flex items-center gap-2.5">
                       <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 border border-white/5">
                          {supplier?.logo ? <img src={supplier.logo} className="w-full h-full rounded-full object-cover" /> : <Package size={12} />}
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 truncate flex-1">
                         {supplier?.name || 'Prov. Desconocido'}
                       </p>
                    </div>
                 </div>
                 </Link>

                 {/* Actions */}
                 <div className="px-5 py-4 flex items-center justify-between bg-white/[0.01]">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      DETALLES <ExternalLink size={12} />
                    </span>
                    <div className="flex items-center gap-2">
                       <button onClick={() => navigate(`/productos/${product.id}/editar`)} className="p-2 text-slate-600 hover:text-sky-400 transition-colors" aria-label="Editar"><Edit2 size={16}/></button>
                       <button onClick={() => handleDelete(product.id, product.name)} className="p-2 text-slate-600 hover:text-rose-400 transition-colors" aria-label="Eliminar"><Trash2 size={16}/></button>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] text-slate-500 font-black">
                   <th className="px-6 py-4">Producto</th>
                   <th className="px-6 py-4">Categoría</th>
                   <th className="px-6 py-4">Proveedor</th>
                   <th className="px-6 py-4">Precio Ref.</th>
                   <th className="px-6 py-4">Capacidad</th>
                   <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedProducts.map(p => {
                  const supplier = suppliers.find(s => s.id === p.supplier_id);
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5">
                                {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : <Package size={18} className="text-slate-700" />}
                             </div>
                             <span className="text-sm font-bold text-white line-clamp-1">{p.name}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="badge badge-sky text-[10px] font-black">{p.category.replace('_', ' ')}</span>
                       </td>
                       <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                          {supplier?.name || 'No asignado'}
                       </td>
                       <td className="px-6 py-4 text-sm font-black text-white">
                          {p.currency} {p.base_price.toFixed(2)}
                       </td>
                       <td className="px-6 py-4 text-xs font-medium text-slate-500">
                          {p.availability.min_pax}-{p.availability.max_capacity || '∞'} pax
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button
                               onClick={() => handleToggleFeatured(p.id, !!p.is_featured, p.name)}
                               disabled={togglingId === p.id}
                               title={p.is_featured ? 'Quitar del landing' : 'Publicar en landing'}
                               className={`p-2 transition-colors disabled:opacity-50 ${
                                 p.is_featured ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400'
                               }`}
                               aria-label="Toggle landing"
                             >
                               <Star size={14} className={p.is_featured ? 'fill-amber-400' : ''} />
                             </button>
                             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                               <Link to={`/productos/${p.id}/detalle`} className="p-2 text-slate-400 hover:text-white"><ExternalLink size={14}/></Link>
                               <button onClick={() => navigate(`/productos/${p.id}/editar`)} className="p-2 text-slate-400 hover:text-sky-400" aria-label="Editar"><Edit2 size={14}/></button>
                               <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-slate-400 hover:text-rose-400" aria-label="Eliminar"><Trash2 size={14}/></button>
                             </div>
                          </div>
                       </td>
                    </tr>
                  );
                })}
              </tbody>
           </table>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={page} totalItems={filteredProducts.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      {/* Empty View */}
      {filteredProducts.length === 0 && (
        <div className="glass-card p-24 text-center">
           <Package size={64} className="mx-auto text-slate-800 mb-6" />
           <h3 className="text-xl font-black text-white mb-2">No hay productos en esta selección</h3>
           <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">Comienza a registrar los atractivos turísticos, restaurantes y servicios que ofrecerás en tus rutas.</p>
           <Link to="/productos/nuevo" className="btn-primary">Añadir producto inicial</Link>
        </div>
      )}
    </div>
  );
}
