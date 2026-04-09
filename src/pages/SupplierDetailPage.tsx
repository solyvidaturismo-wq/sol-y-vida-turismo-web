import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSuppliers, useProducts, useAppStore } from '../store/useAppStore';
import { 
  ArrowLeft, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  Star, 
  Package, 
  Edit2, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { SUPPLIER_CATEGORY_META } from '../config/categoryFields';

export default function SupplierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const suppliers = useSuppliers();
  const products = useProducts();
  const deleteSupplier = useAppStore(s => s.deleteSupplier);

  const supplier = suppliers.find(s => s.id === id);
  const supplierProducts = products.filter(p => p.supplier_id === id);

  if (!supplier) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-600">
           <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-black text-white">Proveedor no encontrado</h2>
        <Link to="/proveedores" className="text-amber-500 font-bold hover:underline">Volver al directorio</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm(`¿Eliminar permanently a ${supplier.name}?`)) {
      await deleteSupplier(supplier.id);
      navigate('/proveedores');
    }
  };

  const meta = SUPPLIER_CATEGORY_META[supplier.category];

  return (
    <div className="space-y-8 animate-page-enter">
      {/* Header / Hero */}
      <div className="relative h-64 md:h-80 -mt-6 -mx-4 md:-mx-8 overflow-hidden rounded-b-[40px] shadow-2xl">
         {supplier.banner_image ? (
           <img src={supplier.banner_image} className="w-full h-full object-cover" />
         ) : (
           <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
         
         <div className="absolute top-8 left-8">
            <Link to="/proveedores" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest">
               <ArrowLeft size={16} /> Volver
            </Link>
         </div>

         <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-slate-900 border-4 border-slate-900 shadow-2xl flex items-center justify-center overflow-hidden shrink-0">
                  {supplier.logo ? (
                    <img src={supplier.logo} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={48} className="text-slate-800" />
                  )}
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <span className="badge badge-amber text-[10px] uppercase font-black tracking-widest">
                       {meta?.emoji} {meta?.label}
                     </span>
                     <span className={`badge ${supplier.status === 'activo' ? 'badge-emerald' : 'badge-rose'} text-[10px]`}>
                       {supplier.status}
                     </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-3">
                    {supplier.name}
                    {supplier.rating >= 4.5 && <ShieldCheck className="text-sky-400" size={28} />}
                  </h1>
                  <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-amber-500"/> {supplier.address.city}, {supplier.address.country}</span>
                    <span className="flex items-center gap-1.5"><Star size={16} className="text-amber-500 fill-amber-500"/> {supplier.rating} (Verificado)</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <button onClick={() => navigate(`/proveedores/${supplier.id}/editar`)} className="btn-secondary flex items-center gap-2 bg-white/10 border-white/10 text-white">
                  <Edit2 size={18} /> Editar
               </button>
               <button onClick={handleDelete} className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                  <Trash2 size={20} />
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Sidebar Info */}
         <div className="space-y-6">
            <div className="glass-card p-6 space-y-6">
               <h3 className="text-lg font-black text-white border-b border-white/5 pb-3">Resumen Comercial</h3>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 font-bold uppercase tracking-tighter">Comisión</span>
                     <span className="text-sky-400 font-black text-lg">{supplier.commission_pct}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 font-bold uppercase tracking-tighter">Registro</span>
                     <span className="text-slate-300 font-bold">{new Date(supplier.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contacto Directo</p>
                     <p className="text-white font-bold text-sm flex items-center gap-2"><User size={14} className="text-amber-500"/> {supplier.contact.name}</p>
                     <p className="text-slate-300 text-xs flex items-center gap-2"><Mail size={14} className="text-slate-500"/> {supplier.contact.email}</p>
                     <p className="text-slate-300 text-xs flex items-center gap-2"><Phone size={14} className="text-slate-500"/> {supplier.contact.phone}</p>
                  </div>
               </div>
            </div>

            <div className="glass-card p-6">
               <h3 className="text-lg font-black text-white border-b border-white/5 pb-3 mb-4">Ubicación</h3>
               <div className="aspect-video w-full rounded-2xl bg-slate-800 flex items-center justify-center text-slate-600 border border-white/5 relative overflow-hidden group">
                  <MapPin size={48} className="group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-black/40 backdrop-blur-md">
                     <p className="text-[10px] text-white font-bold truncate">{supplier.address.street}</p>
                  </div>
               </div>
               <p className="mt-4 text-xs text-slate-400 leading-relaxed italic">
                 "Ubicación estratégica facilitando la logística de rutas en la zona de {supplier.address.city}."
               </p>
            </div>
         </div>

         {/* Main Content */}
         <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8">
               <h3 className="text-2xl font-black text-white mb-4">Información del Partner</h3>
               <p className="text-slate-400 font-medium leading-relaxed whitespace-pre-line">
                  {supplier.description || 'No hay una descripción detallada cargada aún para este proveedor.'}
               </p>
               
               {/* Extended Fields based on category */}
               <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.entries(supplier.extended_data || {}).map(([key, val]) => (
                    <div key={key} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{key.replace(/_/g, ' ')}</p>
                       <p className="text-white font-bold text-sm">{String(val)}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Products List */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-black text-white">Productos Asociados ({supplierProducts.length})</h3>
                  <Link to={`/productos/nuevo?supplier_id=${supplier.id}`} className="text-amber-500 font-bold text-sm hover:text-amber-400">
                    Añadir Producto +
                  </Link>
               </div>

               {supplierProducts.length === 0 ? (
                 <div className="glass-card p-12 text-center">
                    <Package size={40} className="mx-auto text-slate-800 mb-4" />
                    <p className="text-slate-500 font-bold">Este proveedor aún no tiene productos registrados.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {supplierProducts.map(p => (
                      <Link 
                        key={p.id} 
                        to={`/productos/${p.id}/detalle`}
                        className="glass-card p-4 flex items-center gap-4 hover:border-amber-500/30 transition-all group"
                      >
                         <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden shrink-0">
                            {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : <Package size={24} className="text-slate-700 m-auto mt-4" />}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-white font-bold truncate group-hover:text-amber-500 transition-colors uppercase text-sm tracking-tighter">{p.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[10px] font-black text-slate-500 uppercase">{p.category}</span>
                               <span className="text-xs font-black text-sky-400">{p.currency} {p.base_price}</span>
                            </div>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all">
                            <ExternalLink size={14} />
                         </div>
                      </Link>
                    ))}
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
