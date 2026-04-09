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
  ExternalLink,
  Info,
  DollarSign,
  Calendar,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Zap,
  Tag
} from 'lucide-react';
import { PRODUCT_CATEGORY_META } from '../config/categoryFields';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useProducts();
  const suppliers = useSuppliers();
  const routes = useRoutes();
  const deleteProduct = useAppStore(s => s.deleteProduct);

  const product = products.find(p => p.id === id);
  const supplier = suppliers.find(s => s.id === product?.supplier_id);
  
  // Find routes including this product
  const associatedRoutes = routes.filter(r => 
    r.itinerary.some(item => item.product_id === id)
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
      await deleteProduct(product.id);
      navigate('/productos');
    }
  };

  const meta = PRODUCT_CATEGORY_META[product.category as keyof typeof PRODUCT_CATEGORY_META];

  return (
    <div className="space-y-8 animate-page-enter">
      {/* Product Hero Banner */}
      <div className="relative h-80 md:h-[450px] -mt-6 -mx-4 md:-mx-8 overflow-hidden rounded-b-[50px] shadow-2xl group">
         {product.images?.[0] ? (
           <img src={product.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
         ) : (
           <div className="w-full h-full bg-slate-900 flex items-center justify-center">
              <Package size={120} className="text-slate-800" />
           </div>
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
         
         {/* Top Controls */}
         <div className="absolute top-8 left-8 flex items-center gap-4">
            <Link to="/productos" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest">
               <ArrowLeft size={16} /> Catálogo
            </Link>
         </div>

         <div className="absolute top-8 right-8 flex items-center gap-2">
            <button 
              onClick={() => navigate(`/productos/${product.id}/editar`)}
              className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-sky-500 hover:border-sky-500 transition-all"
            >
               <Edit2 size={20} />
            </button>
            <button 
              onClick={handleDelete}
              className="p-3 rounded-2xl bg-rose-500/10 backdrop-blur-md border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
            >
               <Trash2 size={20} />
            </button>
         </div>

         {/* Bottom Info */}
         <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 flex-1">
               <div className="flex flex-wrap items-center gap-3">
                  <span className="badge badge-sky text-[10px] font-black uppercase tracking-widest px-3 py-1">
                    {meta?.emoji} {meta?.label || product.category}
                  </span>
                  <span className="badge badge-emerald text-[10px] font-black uppercase flex items-center gap-1">
                    <Zap size={10} /> {product.status}
                  </span>
                  {product.rating >= 4.0 && (
                    <span className="flex items-center gap-1.5 text-amber-500 font-black text-sm drop-shadow-lg">
                       <Star size={16} fill="currentColor" /> {product.rating} (RECOMENDADO)
                    </span>
                  )}
               </div>
               <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">{product.name}</h1>
               <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-bold">
                  <span className="flex items-center gap-1.5"><Clock size={16} className="text-sky-500" /> {product.duration_minutes} min</span>
                  <span className="flex items-center gap-1.5"><Users size={16} className="text-sky-500" /> {product.availability.min_pax}-{product.availability.max_capacity || '∞'} Pax</span>
                  <span className="flex items-center gap-1.5"><Tag size={16} className="text-sky-500" /> SKU: {product.sku || product.id.slice(0, 8)}</span>
               </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] text-right min-w-[200px]">
               <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Precio Base DESDE</p>
               <div className="text-4xl font-black text-white">
                 <span className="text-lg mr-1">{product.currency}</span>
                 {product.base_price.toLocaleString()}
               </div>
               <p className="text-[10px] text-slate-400 mt-2 italic font-medium">* No incluye impuestos locales.</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Column 1: Core Details */}
         <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <Info size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-white">Descripción del Servicio</h3>
               </div>
               <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed font-medium">
                  {product.description || 'Sin descripción detallada disponible.'}
               </div>

               {/* Extended Attributes Grid */}
               <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {Object.entries(product.extended_data || {}).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{key.replace(/_/g, ' ')}</p>
                       <p className="text-white font-bold text-sm tracking-tight">{String(val)}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Price Tiers */}
            <div className="glass-card p-8 bg-sky-500/5 border-sky-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <DollarSign size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-white">Tabla de Tarifas (Tiers)</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {product.price_tiers && product.price_tiers.length > 0 ? (
                    product.price_tiers.map((tier, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 text-center">
                         <p className="text-[10px] font-black text-slate-500 uppercase mb-2">{tier.name}</p>
                         <p className="text-2xl font-black text-white"><span className="text-xs mr-0.5">$</span>{tier.price}</p>
                         <p className="text-[10px] font-bold text-sky-400 mt-1 uppercase">Mín. {tier.min_pax} PAX</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 py-8 text-center bg-slate-900/40 rounded-3xl border border-dashed border-white/10">
                       <p className="text-slate-500 font-bold uppercase text-[10px]">No se han configurado niveles de precio específicos.</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Photo Gallery */}
            <div className="space-y-4">
               <h3 className="text-xl font-black text-white px-2">Galería de Imágenes</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.images?.map((img, i) => (
                    <div key={i} className="aspect-square rounded-[32px] overflow-hidden bg-slate-800 border-2 border-transparent hover:border-sky-500 transition-all cursor-pointer">
                       <img src={img} className="w-full h-full object-cover transition-transform hover:scale-110" />
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Column 2: Provider & Context */}
         <div className="space-y-8">
            {/* Supplier Profile Card */}
            <div className="glass-card p-0 overflow-hidden group">
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
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">PROVEEDOR RESPONSABLE</p>
                  <h4 className="text-white font-black text-lg mb-4">{supplier?.name || 'Prov. Desconocido'}</h4>
                  
                  {supplier ? (
                    <div className="space-y-3 mb-6">
                       <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                          <MapPin size={14} className="text-slate-600" /> {supplier.address.city}, {supplier.address.country}
                       </div>
                       <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                          <Zap size={14} className="text-slate-600" /> {supplier.category}
                       </div>
                    </div>
                  ) : (
                    <p className="text-rose-400 text-xs font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 mb-6">
                       Advertencia: Este producto está huérfano (sin proveedor).
                    </p>
                  )}

                  <Link 
                    to={supplier ? `/proveedores/${supplier.id}/detalle` : '#'} 
                    className="w-full py-3 rounded-2xl bg-white/5 text-[10px] font-black text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    Ver Perfil Partner <ChevronRight size={14} />
                  </Link>
               </div>
            </div>

            {/* In-Use In Routes */}
            <div className="glass-card p-6">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-black text-white">Presente en Rutas</h4>
                  <span className="text-[10px] font-black bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-lg">{associatedRoutes.length}</span>
               </div>
               <div className="space-y-3">
                  {associatedRoutes.length > 0 ? (
                    associatedRoutes.map(route => (
                      <Link 
                        key={route.id} 
                        to={`/rutas/${route.id}/detalle`}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/30 group transition-all"
                      >
                         <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-sky-500 transition-colors">
                            <Zap size={18} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white truncate">{route.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{route.duration_days} DIAS</p>
                         </div>
                         <ChevronRight size={14} className="text-slate-700" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-slate-600 italic py-4 text-center">Este producto no se usa actualmente en ninguna ruta activa de Sol y Vida.</p>
                  )}
               </div>
            </div>

            {/* Availability Summary */}
            <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/20 overflow-hidden relative">
               <Zap size={80} className="absolute -right-6 -bottom-6 text-emerald-500/5" />
               <h4 className="text-lg font-black text-white mb-4">Operatividad</h4>
               <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3">
                     <Calendar size={16} className="text-emerald-500" />
                     <p className="text-xs text-slate-300 font-medium">Temporada: <span className="text-white font-bold">{product.availability.seasonal ? 'Estacional' : 'Todo el año'}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                     <Users size={16} className="text-emerald-500" />
                     <p className="text-xs text-slate-300 font-medium">Instan-Booking: <span className="text-white font-bold">{product.availability.instant_booking ? 'Activado' : 'Bajo consulta'}</span></p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
