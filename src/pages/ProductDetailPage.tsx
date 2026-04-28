import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts, useSuppliers, useAppStore, useRoutes } from '../store/useAppStore';
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  Users,
  Star,
  Edit2,
  Trash2,
  Info,
  DollarSign,
  Calendar,
  AlertCircle,
  ChevronRight,
  Zap,
  Tag,
  CreditCard,
  Shield,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Phone
} from 'lucide-react';
import { PRODUCT_CATEGORY_META, PRODUCT_CATEGORIES } from '../config/categoryFields';
import type { CategoryConfig, FieldSection, DynamicField } from '../config/categoryFields';
import { toast } from '../store/useToastStore';

// Render a single custom field value nicely
function FieldValue({ field, value }: { field: DynamicField; value: any }) {
  if (value === undefined || value === null || value === '') return <span className="text-slate-600 italic text-xs">—</span>;

  if (field.type === 'checkbox') {
    return value ? (
      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold"><CheckCircle2 size={14} /> Sí</span>
    ) : (
      <span className="flex items-center gap-1.5 text-slate-600 text-xs"><XCircle size={14} /> No</span>
    );
  }
  if (field.type === 'multi-select' && Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((v: string) => (
          <span key={v} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">{v}</span>
        ))}
      </div>
    );
  }
  if (field.type === 'textarea') {
    return <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{String(value)}</p>;
  }
  if (field.type === 'url') {
    return <a href={String(value)} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-400 hover:underline break-all">{String(value)}</a>;
  }
  if (field.type === 'color') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: String(value) }} />
        <span className="text-sm text-white font-medium">{String(value)}</span>
      </div>
    );
  }
  const suffix = field.unit ? ` ${field.unit}` : '';
  return <span className="text-sm text-white font-bold">{String(value)}{suffix}</span>;
}

// Render a section of dynamic fields
function CategorySection({ section, customFields }: { section: FieldSection; customFields: Record<string, any> }) {
  // Check if section has any filled fields
  const filledFields = section.fields.filter(f => {
    const val = customFields[f.name];
    if (val === undefined || val === null || val === '') return false;
    if (f.type === 'checkbox' && !val) return false;
    return true;
  });

  if (filledFields.length === 0) return null;

  // For checkbox sections, group active ones nicely
  const allCheckboxes = section.fields.every(f => f.type === 'checkbox');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">{section.icon}</span>
        <h4 className="text-sm font-black text-white uppercase tracking-widest">{section.title}</h4>
        {section.description && <span className="text-[10px] text-slate-500 font-medium">— {section.description}</span>}
      </div>

      {allCheckboxes ? (
        <div className="flex flex-wrap gap-2">
          {filledFields.map(f => (
            <span key={f.name} className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 size={10} /> {f.label}
            </span>
          ))}
        </div>
      ) : (
        <div className={`grid gap-4 ${section.columns === 3 ? 'grid-cols-1 sm:grid-cols-3' : section.columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {filledFields.map(f => (
            <div key={f.name} className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${f.fullWidth ? 'sm:col-span-full' : ''}`}>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{f.label}</p>
              <FieldValue field={f} value={customFields[f.name]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useProducts();
  const suppliers = useSuppliers();
  const routes = useRoutes();
  const deleteProduct = useAppStore(s => s.deleteProduct);

  const product = products.find(p => p.id === id);
  const supplier = suppliers.find(s => s.id === product?.supplier_id);

  const associatedRoutes = routes.filter(r =>
    r.itinerary.some(item => item.ref_id === id)
  );

  if (!product) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle size={48} className="text-slate-800" />
        <h2 className="text-xl font-black text-white">Producto no encontrado</h2>
        <Link to="/productos" className="btn-secondary">Volver al catálogo</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      try {
        await deleteProduct(product.id);
        toast.success(`Producto "${product.name}" eliminado`);
        navigate('/productos');
      } catch (err: any) {
        toast.error('Error al eliminar: ' + err.message);
      }
    }
  };

  const meta = PRODUCT_CATEGORY_META[product.category as keyof typeof PRODUCT_CATEGORY_META];
  const categoryConfig: CategoryConfig | undefined = PRODUCT_CATEGORIES[product.category];
  const customFields = product.custom_fields || {};
  const daysOfWeekLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="space-y-8 animate-page-enter">
      {/* Hero Banner */}
      <div className="relative h-80 md:h-[450px] -mt-6 -mx-4 md:-mx-8 overflow-hidden rounded-b-[50px] shadow-2xl group">
         {product.images?.[0] ? (
           <img src={product.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
         ) : (
           <div className="w-full h-full bg-slate-900 flex items-center justify-center">
              <Package size={120} className="text-slate-800" />
           </div>
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

         <div className="absolute top-8 left-8">
            <Link to="/productos" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest">
               <ArrowLeft size={16} /> Catálogo
            </Link>
         </div>

         <div className="absolute top-8 right-8 flex items-center gap-2">
            <button onClick={() => navigate(`/productos/${product.id}/editar`)} className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-sky-500 hover:border-sky-500 transition-all" aria-label="Editar"><Edit2 size={20} /></button>
            <button onClick={handleDelete} className="p-3 rounded-2xl bg-rose-500/10 backdrop-blur-md border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all" aria-label="Eliminar"><Trash2 size={20} /></button>
         </div>

         <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 flex-1">
               <div className="flex flex-wrap items-center gap-3">
                  <span className="badge badge-sky text-[10px] font-black uppercase tracking-widest px-3 py-1">
                    {meta?.emoji} {meta?.label || product.category}
                  </span>
                  <span className={`badge ${product.status === 'activo' ? 'badge-emerald' : product.status === 'inactivo' ? 'badge-rose' : 'badge-gray'} text-[10px] font-black uppercase flex items-center gap-1`}>
                    <Zap size={10} /> {product.status}
                  </span>
                  {product.is_featured && (
                    <span className="badge badge-amber text-[10px] font-black uppercase flex items-center gap-1">
                       <Star size={10} fill="currentColor" /> Destacado
                    </span>
                  )}
               </div>
               <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">{product.name}</h1>
               {product.short_description && (
                 <p className="text-slate-300 text-sm font-medium max-w-xl">{product.short_description}</p>
               )}
               <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-bold">
                  {product.duration_minutes && (
                    <span className="flex items-center gap-1.5"><Clock size={16} className="text-sky-500" /> {product.duration_minutes} min</span>
                  )}
                  <span className="flex items-center gap-1.5"><Users size={16} className="text-sky-500" /> {product.availability?.min_pax || 1}–{product.availability?.max_capacity || '∞'} Pax</span>
                  {supplier && (
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-sky-500" /> {supplier.location?.city || supplier.name}</span>
                  )}
               </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] text-right min-w-[200px]">
               <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Precio Base</p>
               <div className="text-4xl font-black text-white">
                 <span className="text-lg mr-1">{product.currency}</span>
                 {product.base_price.toLocaleString()}
               </div>
               {categoryConfig && (
                 <p className="text-[10px] text-slate-400 mt-2 font-medium">{categoryConfig.description}</p>
               )}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content */}
         <div className="lg:col-span-2 space-y-8">
            {/* Descripción */}
            <div className="glass-card p-8">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center"><Info size={20} /></div>
                  <h3 className="text-2xl font-black text-white">Descripción del Servicio</h3>
               </div>
               <p className="text-slate-400 leading-relaxed font-medium whitespace-pre-line">
                  {product.description || 'Sin descripción detallada disponible.'}
               </p>
            </div>

            {/* === DYNAMIC CATEGORY SECTIONS === */}
            {categoryConfig && categoryConfig.sections.length > 0 && (
              <div className="glass-card p-8 space-y-8 border-l-4 border-sky-500/40">
                 <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryConfig.emoji}</span>
                    <div>
                       <h3 className="text-xl font-black text-white">{categoryConfig.label} — Ficha Técnica</h3>
                       <p className="text-xs text-slate-500 font-medium">{categoryConfig.description}</p>
                    </div>
                 </div>

                 {categoryConfig.sections.map((section, i) => (
                   <CategorySection key={i} section={section} customFields={customFields} />
                 ))}

                 {/* If no custom fields filled at all */}
                 {categoryConfig.sections.every(section =>
                   section.fields.every(f => {
                     const val = customFields[f.name];
                     return val === undefined || val === null || val === '' || (f.type === 'checkbox' && !val);
                   })
                 ) && (
                   <div className="py-8 text-center bg-slate-900/40 rounded-3xl border border-dashed border-white/10">
                      <p className="text-slate-500 font-bold text-xs uppercase">No se han completado los campos específicos de {categoryConfig.label}.</p>
                      <button onClick={() => navigate(`/productos/${product.id}/editar`)} className="text-sky-400 font-bold text-xs mt-2 hover:underline">
                        Completar ficha técnica →
                      </button>
                   </div>
                 )}
              </div>
            )}

            {/* Price Tiers */}
            <div className="glass-card p-8 bg-sky-500/5 border-sky-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center"><DollarSign size={20} /></div>
                  <h3 className="text-2xl font-black text-white">Tabla de Tarifas</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {product.price_tiers && product.price_tiers.length > 0 ? (
                    product.price_tiers.map((tier, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 text-center">
                         <p className="text-[10px] font-black text-slate-500 uppercase mb-2">{tier.label}</p>
                         <p className="text-3xl font-black text-white"><span className="text-sm mr-0.5">{tier.currency || product.currency}</span>{tier.price.toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 py-8 text-center bg-slate-900/40 rounded-3xl border border-dashed border-white/10">
                       <p className="text-slate-500 font-bold uppercase text-[10px]">Sin niveles de precio configurados</p>
                       <p className="text-slate-600 text-xs mt-1">Precio base: {product.currency} {product.base_price.toLocaleString()}</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Activity Itinerary */}
            {product.activity_itinerary && product.activity_itinerary.length > 0 && (
              <div className="glass-card p-8">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><Calendar size={20} /></div>
                    <h3 className="text-2xl font-black text-white">Itinerario de Actividad</h3>
                 </div>
                 <div className="relative pl-6 border-l-2 border-emerald-500/30 space-y-5">
                    {product.activity_itinerary.map((step, i) => (
                      <div key={i} className="relative">
                         <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                         <div className="flex items-start gap-3">
                            <span className="text-xs font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-lg shrink-0">{step.time}</span>
                            <div>
                               <p className="text-sm font-bold text-white">{step.activity}</p>
                               {step.description && <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* Recommendations & Safety */}
            {(product.recommendations || product.safety_protocols) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {product.recommendations && (
                   <div className="glass-card p-6 bg-amber-500/5 border-amber-500/20">
                      <div className="flex items-center gap-2 mb-3"><Lightbulb size={18} className="text-amber-500" /><h4 className="text-sm font-black text-white uppercase">Recomendaciones</h4></div>
                      <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">{product.recommendations}</p>
                   </div>
                 )}
                 {product.safety_protocols && (
                   <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/20">
                      <div className="flex items-center gap-2 mb-3"><Shield size={18} className="text-emerald-400" /><h4 className="text-sm font-black text-white uppercase">Protocolos de Seguridad</h4></div>
                      <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">{product.safety_protocols}</p>
                   </div>
                 )}
              </div>
            )}

            {/* Payment Methods */}
            {product.payment_methods && product.payment_methods.length > 0 && (
              <div className="glass-card p-6">
                 <div className="flex items-center gap-2 mb-4"><CreditCard size={18} className="text-sky-400" /><h4 className="text-sm font-black text-white uppercase">Métodos de Pago</h4></div>
                 <div className="flex flex-wrap gap-2">
                    {product.payment_methods.map(m => (
                      <span key={m} className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-widest">{m}</span>
                    ))}
                 </div>
              </div>
            )}

            {/* Photo Gallery */}
            {product.images && product.images.filter(img => img).length > 0 && (
              <div className="space-y-4">
                 <h3 className="text-xl font-black text-white px-2 flex items-center gap-2">
                    <ImageIcon size={20} className="text-sky-400" /> Galería ({product.images.filter(img => img).length})
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {product.images.filter(img => img).map((img, i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-800 border-2 border-transparent hover:border-sky-500 transition-all cursor-pointer">
                         <img src={img} className="w-full h-full object-cover transition-transform hover:scale-110" />
                      </div>
                    ))}
                 </div>
              </div>
            )}
         </div>

         {/* Sidebar */}
         <div className="space-y-6">
            {/* Availability */}
            <div className="glass-card p-6">
               <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-emerald-400" /> Disponibilidad
               </h4>
               <div className="space-y-4">
                  {product.availability?.days_of_week && product.availability.days_of_week.length > 0 && (
                    <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Días de operación</p>
                       <div className="flex gap-1.5">
                          {daysOfWeekLabels.map((label, idx) => {
                            const active = product.availability.days_of_week.includes(idx);
                            return (
                              <div key={idx} className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black ${active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-600 border border-white/5'}`}>
                                {label}
                              </div>
                            );
                          })}
                       </div>
                    </div>
                  )}
                  {(product.availability?.start_time || product.availability?.end_time) && (
                    <div className="flex items-center gap-3">
                       <Clock size={16} className="text-emerald-400" />
                       <p className="text-sm text-white font-medium">{product.availability.start_time || '—'} → {product.availability.end_time || '—'}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                     <Users size={16} className="text-emerald-400" />
                     <p className="text-sm text-white font-medium">Min: {product.availability?.min_pax || 1} — Max: {product.availability?.max_capacity || '∞'} pax</p>
                  </div>
               </div>
            </div>

            {/* Supplier Card */}
            <div className="glass-card p-0 overflow-hidden">
               <div className="h-24 bg-slate-800 relative">
                  {supplier?.banner_image && <img src={supplier.banner_image} className="w-full h-full object-cover opacity-40" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  <div className="absolute -bottom-6 left-6">
                     <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-slate-900 flex items-center justify-center overflow-hidden">
                        {supplier?.logo ? <img src={supplier.logo} className="w-full h-full object-cover" /> : <Package size={24} className="text-slate-700" />}
                     </div>
                  </div>
               </div>
               <div className="p-6 pt-10">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Proveedor</p>
                  <h4 className="text-white font-black text-lg mb-3">{supplier?.name || 'Desconocido'}</h4>
                  {supplier ? (
                    <div className="space-y-2 mb-4">
                       <div className="flex items-center gap-2 text-xs text-slate-400"><MapPin size={12} className="text-slate-600" /> {supplier.location?.city || '—'}, {supplier.location?.country || '—'}</div>
                       <div className="flex items-center gap-2 text-xs text-slate-400"><Star size={12} className="text-amber-500 fill-amber-500" /> {supplier.rating}/5 — {supplier.commission_pct}% comisión</div>
                       {supplier.contact?.phone && <div className="flex items-center gap-2 text-xs text-slate-400"><Phone size={12} className="text-slate-600" /> {supplier.contact.phone}</div>}
                    </div>
                  ) : (
                    <p className="text-rose-400 text-xs font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 mb-4">Producto sin proveedor asignado.</p>
                  )}
                  <Link to={supplier ? `/proveedores/${supplier.id}/detalle` : '#'} className="w-full py-3 rounded-2xl bg-white/5 text-[10px] font-black text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                    Ver Perfil <ChevronRight size={14} />
                  </Link>
               </div>
            </div>

            {/* Routes */}
            <div className="glass-card p-6">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-black text-white">Presente en Rutas</h4>
                  <span className="text-[10px] font-black bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-lg">{associatedRoutes.length}</span>
               </div>
               <div className="space-y-3">
                  {associatedRoutes.length > 0 ? associatedRoutes.map(route => (
                    <Link key={route.id} to={`/rutas/${route.id}/detalle`} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/30 group transition-all">
                       <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-sky-500 transition-colors shrink-0"><Zap size={18} /></div>
                       <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-white truncate">{route.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{route.duration_days} días — {route.destination}</p>
                       </div>
                       <ChevronRight size={14} className="text-slate-700 shrink-0" />
                    </Link>
                  )) : (
                    <p className="text-xs text-slate-600 italic py-4 text-center">No se usa en ninguna ruta.</p>
                  )}
               </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="glass-card p-6">
                 <h4 className="text-sm font-black text-white uppercase mb-3 flex items-center gap-2"><Tag size={14} className="text-sky-400" /> Etiquetas</h4>
                 <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-widest">{tag}</span>
                    ))}
                 </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="glass-card p-6 space-y-3">
               <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">Registro</h4>
               <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Creado</span>
                  <span className="text-white font-bold">{new Date(product.created_at).toLocaleDateString()}</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Actualizado</span>
                  <span className="text-white font-bold">{new Date(product.updated_at).toLocaleDateString()}</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
