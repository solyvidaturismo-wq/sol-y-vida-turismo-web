import { useState, useMemo } from 'react';
import { useSuppliers, useAppStore } from '../store/useAppStore';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  LayoutGrid,
  List as ListIcon,
  Building2,
  Trash2,
  Edit2,
  ExternalLink,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SUPPLIER_CATEGORY_META } from '../config/categoryFields';
import { toast } from '../store/useToastStore';
import Pagination from '../components/ui/Pagination';

const PAGE_SIZE = 20;

export default function SuppliersPage() {
  const suppliers = useSuppliers();
  const deleteSupplier = useAppStore(s => s.deleteSupplier);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  // Filtering logic
  const filteredSuppliers = useMemo(() => {
    setPage(1);
    return suppliers.filter(s => {
      const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase()) ||
                          s.contact.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [suppliers, query, activeCategory]);

  const paginatedSuppliers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSuppliers.slice(start, start + PAGE_SIZE);
  }, [filteredSuppliers, page]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Eliminar a "${name}"? Los productos asociados quedarán huérfanos.`)) {
      try {
        await deleteSupplier(id);
        toast.success(`Proveedor "${name}" eliminado`);
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
            <Users className="text-[#A8442A]" />
            Directorio de Proveedores
          </h1>
          <p className="text-slate-400 text-sm font-medium">Gestiona tus partners, hoteles y operadores turísticos.</p>
        </div>
        <Link to="/proveedores/nuevo" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={18} />
          Nuevo Proveedor
        </Link>
      </div>

      {/* Toolbar */}
      <div className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o contacto..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A8442A]/40 transition-all font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select 
            className="bg-slate-900/50 border border-white/10 rounded-xl py-2 px-4 text-white text-sm focus:outline-none transition-all font-medium min-w-[150px]"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {Object.entries(SUPPLIER_CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.emoji} {meta.label}</option>
            ) )}
          </select>
        </div>

        <div className="flex items-center gap-2">
           <button
             onClick={() => setViewMode('grid')}
             className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#A8442A] text-slate-900 shadow-lg shadow-[#A8442A]/20' : 'bg-white/5 text-slate-400 hover:text-white'}`}
             aria-label="Vista cuadrícula"
           >
             <LayoutGrid size={20} />
           </button>
           <button
             onClick={() => setViewMode('list')}
             className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#A8442A] text-slate-900 shadow-lg shadow-[#A8442A]/20' : 'bg-white/5 text-slate-400 hover:text-white'}`}
             aria-label="Vista lista"
           >
             <ListIcon size={20} />
           </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedSuppliers.map((supplier) => {
            const meta = SUPPLIER_CATEGORY_META[supplier.category];
            return (
              <div
                key={supplier.id}
                className="glass-card group overflow-hidden border border-white/5 flex flex-col hover:border-[#A8442A]/30 transition-all duration-300 transform-gpu hover:-translate-y-1"
              >
                <Link to={`/proveedores/${supplier.id}/detalle`} className="flex-1 flex flex-col cursor-pointer">
                {/* Visual Header */}
                <div className="h-24 bg-slate-800 relative">
                  {supplier.banner_image ? (
                    <img src={supplier.banner_image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                       <Building2 size={32} className="text-slate-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="absolute -bottom-6 left-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-slate-900 shadow-xl flex items-center justify-center overflow-hidden">
                       {supplier.logo ? (
                         <img src={supplier.logo} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-white font-black text-xl">{supplier.name.charAt(0)}</span>
                       )}
                    </div>
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      supplier.status === 'activo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {supplier.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pt-8 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold text-[#A8442A]/80 uppercase tracking-widest leading-none">
                      {meta?.emoji} {meta?.label}
                    </span>
                    {supplier.rating >= 4.5 && <ShieldCheck size={12} className="text-emerald-400" />}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4 line-clamp-1">{supplier.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                         <Mail size={14} />
                      </div>
                      <span className="text-xs font-semibold truncate">{supplier.contact.email || 'Sin correo'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                         <Phone size={14} />
                      </div>
                      <span className="text-xs font-semibold">{supplier.contact.phone || 'Sin teléfono'}</span>
                    </div>
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-6 p-2 rounded-xl bg-white/5 border border-white/5">
                     <div className="text-center">
                       <p className="text-[9px] font-bold text-slate-500 uppercase">Rating</p>
                       <div className="flex items-center justify-center gap-1 text-xs font-black text-[#A8442A]">
                         <Star size={10} fill="currentColor" /> {supplier.rating}
                       </div>
                     </div>
                     <div className="text-center border-l border-white/5">
                       <p className="text-[9px] font-bold text-slate-500 uppercase">Comisión</p>
                       <p className="text-xs font-black text-[#D6A55C]">{supplier.commission_pct}%</p>
                     </div>
                  </div>
                </div>
                </Link>

                {/* Actions Footer */}
                <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
                   <span className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                     VER PERFIL <ExternalLink size={12} />
                   </span>
                   <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/proveedores/${supplier.id}/editar`)}
                        className="p-2 text-slate-500 hover:text-[#D6A55C] transition-colors"
                        aria-label="Editar proveedor"
                      >
                         <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id, supplier.name)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                        aria-label="Eliminar proveedor"
                      >
                         <Trash2 size={16} />
                      </button>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] text-slate-500 font-black">
                  <th className="px-6 py-4">Proveedor</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Comisión</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                          {supplier.logo ? <img src={supplier.logo} className="w-full h-full object-cover" /> : <Building2 size={18} className="text-slate-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{supplier.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">ID: {supplier.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs font-bold text-slate-400">
                        {SUPPLIER_CATEGORY_META[supplier.category]?.emoji} {SUPPLIER_CATEGORY_META[supplier.category]?.label}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-300">{supplier.contact.name}</span>
                          <span className="text-[10px] text-slate-500">{supplier.contact.email}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm font-black text-[#D6A55C]">{supplier.commission_pct}%</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                         supplier.status === 'activo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                       }`}>
                         {supplier.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => navigate(`/proveedores/${supplier.id}/editar`)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-[#D6A55C]/20" aria-label="Editar"><Edit2 size={14}/></button>
                          <button onClick={() => handleDelete(supplier.id, supplier.name)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-rose-500/20" aria-label="Eliminar"><Trash2 size={14}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={page} totalItems={filteredSuppliers.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      {/* Empty State */}
      {filteredSuppliers.length === 0 && (
        <div className="glass-card p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 mb-6">
             <Users size={40} />
          </div>
          <h3 className="text-xl font-black text-white mb-2">No se encontraron proveedores</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Ajusta los filtros de búsqueda o registra un nuevo partner para empezar a construir tu inventario.
          </p>
          <Link to="/proveedores/nuevo" className="mt-8 btn-primary">Crear nuevo registro</Link>
        </div>
      )}
    </div>
  );
}
