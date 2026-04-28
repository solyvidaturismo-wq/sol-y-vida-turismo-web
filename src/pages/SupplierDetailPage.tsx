import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSuppliers, useProducts, useAppStore } from '../store/useAppStore';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  User,
  Star,
  Package,
  Edit2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Trash2,
  AlertCircle,
  Calendar,
  Percent,
  Clock,
  Tag,
  FileText,
  Hash,
  MessageSquare,
  CheckCircle,
  Globe
} from 'lucide-react';
import { SUPPLIER_CATEGORY_META, SUPPLIER_CATEGORIES } from '../config/categoryFields';
import type { DynamicField } from '../config/categoryFields';
import { toast } from '../store/useToastStore';

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
    if (confirm(`¿Eliminar permanentemente a ${supplier.name}?`)) {
      try {
        await deleteSupplier(supplier.id);
        toast.success(`Proveedor "${supplier.name}" eliminado`);
        navigate('/proveedores');
      } catch (err: any) {
        toast.error('Error al eliminar: ' + err.message);
      }
    }
  };

  const meta = SUPPLIER_CATEGORY_META[supplier.category];
  const activeProducts = supplierProducts.filter(p => p.status === 'activo').length;
  const totalRevenue = supplierProducts.reduce((acc, p) => acc + p.base_price, 0);
  const avgProductPrice = supplierProducts.length > 0 ? totalRevenue / supplierProducts.length : 0;
  const contractExpired = supplier.contract_expiry ? new Date(supplier.contract_expiry) < new Date() : false;

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
                     <span className={`badge ${supplier.status === 'activo' ? 'badge-emerald' : supplier.status === 'pendiente' ? 'badge-violet' : 'badge-rose'} text-[10px]`}>
                       {supplier.status}
                     </span>
                  </div>
                  <h1 className="hero-title text-3xl md:text-5xl font-black tracking-tighter flex items-center gap-3">
                    {supplier.name}
                    {supplier.rating >= 4.5 && <ShieldCheck className="text-sky-400" size={28} />}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-amber-500"/> {supplier.location?.city || 'Sin ciudad'}, {supplier.location?.country || 'Sin país'}</span>
                    <span className="flex items-center gap-1.5"><Star size={16} className="text-amber-500 fill-amber-500"/> {supplier.rating}/5</span>
                    <span className="flex items-center gap-1.5"><Package size={16} className="text-sky-400"/> {supplierProducts.length} productos</span>
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
            {/* KPIs rápidos */}
            <div className="grid grid-cols-2 gap-4">
               <div className="glass-card p-4 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comisión</p>
                  <p className="text-2xl font-black text-sky-400">{supplier.commission_pct}%</p>
               </div>
               <div className="glass-card p-4 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rating</p>
                  <div className="flex items-center justify-center gap-1">
                     <Star size={16} className="text-amber-500 fill-amber-500" />
                     <p className="text-2xl font-black text-amber-500">{supplier.rating}</p>
                  </div>
               </div>
               <div className="glass-card p-4 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prod. Activos</p>
                  <p className="text-2xl font-black text-emerald-400">{activeProducts}</p>
               </div>
               <div className="glass-card p-4 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Precio Prom.</p>
                  <p className="text-2xl font-black text-white">${avgProductPrice.toFixed(0)}</p>
               </div>
            </div>

            {/* Contacto */}
            <div className="glass-card p-6 space-y-5">
               <h3 className="text-lg font-black text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Phone size={18} className="text-amber-500" /> Contacto Principal
               </h3>
               <div className="space-y-4">
                  {supplier.contact?.name && (
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                          <User size={16} className="text-amber-500" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Nombre</p>
                          <p className="text-sm font-bold text-white">{supplier.contact.name}</p>
                       </div>
                    </div>
                  )}
                  {supplier.contact?.email && (
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
                          <Mail size={16} className="text-sky-400" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Email</p>
                          <a href={`mailto:${supplier.contact.email}`} className="text-sm font-bold text-sky-400 hover:underline">{supplier.contact.email}</a>
                       </div>
                    </div>
                  )}
                  {supplier.contact?.phone && (
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <Phone size={16} className="text-emerald-400" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Teléfono</p>
                          <a href={`tel:${supplier.contact.phone}`} className="text-sm font-bold text-white hover:text-emerald-400">{supplier.contact.phone}</a>
                       </div>
                    </div>
                  )}
                  {supplier.contact?.whatsapp && (
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <MessageSquare size={16} className="text-emerald-400" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">WhatsApp</p>
                          <p className="text-sm font-bold text-white">{supplier.contact.whatsapp}</p>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            {/* Ubicación */}
            <div className="glass-card p-6 space-y-4">
               <h3 className="text-lg font-black text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-amber-500" /> Ubicación
               </h3>
               <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500 font-bold">País</span>
                     <span className="text-white font-bold">{supplier.location?.country || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500 font-bold">Región</span>
                     <span className="text-white font-bold">{supplier.location?.region || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500 font-bold">Ciudad</span>
                     <span className="text-white font-bold">{supplier.location?.city || '—'}</span>
                  </div>
                  {supplier.location?.address && (
                    <div className="pt-3 border-t border-white/5">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Dirección</p>
                       <p className="text-sm text-white font-medium">{supplier.location.address}</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Info Fiscal y contractual */}
            <div className="glass-card p-6 space-y-4">
               <h3 className="text-lg font-black text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <FileText size={18} className="text-amber-500" /> Datos Comerciales
               </h3>
               <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500 font-bold flex items-center gap-1.5"><Hash size={12} /> RUC/NIT</span>
                     <span className="text-white font-bold font-mono">{supplier.ruc || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500 font-bold flex items-center gap-1.5"><Percent size={12} /> Comisión</span>
                     <span className="text-sky-400 font-black">{supplier.commission_pct}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500 font-bold flex items-center gap-1.5"><Calendar size={12} /> Contrato Expira</span>
                     {supplier.contract_expiry ? (
                       <span className={`font-bold ${contractExpired ? 'text-rose-400' : 'text-white'}`}>
                         {new Date(supplier.contract_expiry).toLocaleDateString()}
                         {contractExpired && <span className="text-[10px] ml-1">(VENCIDO)</span>}
                       </span>
                     ) : (
                       <span className="text-slate-500">—</span>
                     )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500 font-bold flex items-center gap-1.5"><Clock size={12} /> Registrado</span>
                     <span className="text-white font-bold">{new Date(supplier.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500 font-bold flex items-center gap-1.5"><Clock size={12} /> Actualizado</span>
                     <span className="text-white font-bold">{new Date(supplier.updated_at).toLocaleDateString()}</span>
                  </div>
               </div>
            </div>

            {/* Tags */}
            {supplier.tags && supplier.tags.length > 0 && (
              <div className="glass-card p-6">
                 <h3 className="text-lg font-black text-white border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
                    <Tag size={18} className="text-amber-500" /> Etiquetas
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {supplier.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                 </div>
              </div>
            )}
         </div>

         {/* Main Content */}
         <div className="lg:col-span-2 space-y-8">
            {/* Notas / Descripción */}
            <div className="glass-card p-8">
               <h3 className="text-2xl font-black text-white mb-4">Notas del Proveedor</h3>
               <p className="text-slate-400 font-medium leading-relaxed whitespace-pre-line">
                  {supplier.notes || 'No hay notas o descripción detallada cargada aún para este proveedor.'}
               </p>

               {/* Category-Specific Details */}
               {supplier.custom_fields && Object.keys(supplier.custom_fields).length > 0 && (() => {
                 const categoryConfig = SUPPLIER_CATEGORIES[supplier.category];
                 const cf = supplier.custom_fields;

                 // Collect all field names from config to detect orphans
                 const knownKeys = new Set<string>();

                 if (!categoryConfig) {
                   // Fallback: no config for this category — flat render
                   return (
                     <div className="mt-8 space-y-4">
                       <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">Detalles Adicionales</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {Object.entries(cf).map(([key, val]) => (
                           val != null && val !== '' && (
                             <div key={key} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{key.replace(/_/g, ' ')}</p>
                               <p className="text-white font-bold text-sm">{typeof val === 'boolean' ? (val ? 'Sí' : 'No') : String(val)}</p>
                             </div>
                           )
                         ))}
                       </div>
                     </div>
                   );
                 }

                 // Helper: render a single non-checkbox field value
                 const renderFieldValue = (field: DynamicField, value: any) => {
                   if (field.type === 'url') {
                     return (
                       <a href={String(value)} target="_blank" rel="noopener noreferrer"
                         className="text-sky-400 font-bold text-sm hover:underline truncate flex items-center gap-1.5">
                         <Globe size={14} /> {String(value)}
                       </a>
                     );
                   }
                   if (field.type === 'multi-select' && Array.isArray(value)) {
                     return (
                       <div className="flex flex-wrap gap-1.5">
                         {value.map((item: string) => (
                           <span key={item} className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-bold">
                             {item}
                           </span>
                         ))}
                       </div>
                     );
                   }
                   if (field.type === 'textarea') {
                     return <p className="text-white font-medium text-sm whitespace-pre-line leading-relaxed">{String(value)}</p>;
                   }
                   if (field.type === 'number') {
                     return <p className="text-white font-bold text-sm">{value}{(field as any).unit ? ` ${(field as any).unit}` : ''}</p>;
                   }
                   return <p className="text-white font-bold text-sm">{String(value)}</p>;
                 };

                 // Render sections
                 const sections = categoryConfig.sections.map(section => {
                   const checkboxFields = section.fields.filter(f => {
                     knownKeys.add(f.name);
                     return f.type === 'checkbox' && cf[f.name] === true;
                   });
                   const otherFields = section.fields.filter(f => {
                     knownKeys.add(f.name);
                     return f.type !== 'checkbox' && cf[f.name] != null && cf[f.name] !== '';
                   });

                   if (checkboxFields.length === 0 && otherFields.length === 0) return null;

                   return (
                     <div key={section.title} className="glass-card p-6 space-y-4">
                       <h5 className="text-base font-black text-white flex items-center gap-2 border-b border-white/5 pb-3">
                         <span className="text-lg">{section.icon}</span> {section.title}
                       </h5>

                       {otherFields.length > 0 && (
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {otherFields.map(field => (
                             <div key={field.name} className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{field.label}</p>
                               {renderFieldValue(field, cf[field.name])}
                             </div>
                           ))}
                         </div>
                       )}

                       {checkboxFields.length > 0 && (
                         <div className="flex flex-wrap gap-2">
                           {checkboxFields.map(field => (
                             <span key={field.name}
                               className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                               <CheckCircle size={14} />
                               {field.label}
                             </span>
                           ))}
                         </div>
                       )}
                     </div>
                   );
                 }).filter(Boolean);

                 // Orphan fields (in custom_fields but not in any section)
                 const orphanEntries = Object.entries(cf).filter(
                   ([key, val]) => !knownKeys.has(key) && val != null && val !== '' && val !== false
                 );

                 if (sections.length === 0 && orphanEntries.length === 0) return null;

                 return (
                   <div className="mt-8 space-y-6">
                     <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <span>{categoryConfig.emoji}</span> Detalles de {categoryConfig.label}
                     </h4>
                     {sections}

                     {orphanEntries.length > 0 && (
                       <div className="glass-card p-6 space-y-4">
                         <h5 className="text-base font-black text-white flex items-center gap-2 border-b border-white/5 pb-3">
                           <span className="text-lg">📋</span> Otros
                         </h5>
                         {/* Truthy booleans as badges */}
                         {(() => {
                           const boolEntries = orphanEntries.filter(([, val]) => val === true);
                           if (boolEntries.length === 0) return null;
                           return (
                             <div className="flex flex-wrap gap-2">
                               {boolEntries.map(([key]) => (
                                 <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                                   <CheckCircle size={12} />
                                   {key.replace(/^has_/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                 </span>
                               ))}
                             </div>
                           );
                         })()}
                         {/* Non-boolean values as cards */}
                         {(() => {
                           const nonBoolEntries = orphanEntries.filter(([, val]) => typeof val !== 'boolean');
                           if (nonBoolEntries.length === 0) return null;
                           return (
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               {nonBoolEntries.map(([key, val]) => (
                                 <div key={key} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                                     {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                   </p>
                                   <p className="text-white font-bold text-sm">{String(val)}</p>
                                 </div>
                               ))}
                             </div>
                           );
                         })()}
                       </div>
                     )}
                   </div>
                 );
               })()}
            </div>

            {/* Products List */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                     <Package size={20} className="text-sky-400" />
                     Productos Asociados
                     <span className="text-sm font-black bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-lg ml-1">{supplierProducts.length}</span>
                  </h3>
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
                            <p className="text-white font-bold truncate group-hover:text-amber-500 transition-colors text-sm">{p.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[10px] font-black text-slate-500 uppercase">{p.category}</span>
                               <span className={`text-[10px] font-black uppercase ${p.status === 'activo' ? 'text-emerald-400' : 'text-rose-400'}`}>{p.status}</span>
                            </div>
                            <p className="text-xs font-black text-sky-400 mt-0.5">{p.currency} {p.base_price.toLocaleString()}</p>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all shrink-0">
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
