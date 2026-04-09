import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useAppStore, useSuppliers } from '../store/useAppStore';
import { 
  ArrowLeft, 
  Save, 
  Package, 
  ImageIcon, 
  Plus, 
  Trash2, 
  Clock, 
  Users, 
  Star,
  Zap,
  Tag,
  Calendar,
  DollarSign,
  Search,
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { PRODUCT_CATEGORY_META, PRODUCT_DYNAMIC_FIELDS } from '../config/categoryFields';

type PriceTier = {
  name: string;
  min_pax: number;
  price: number;
};

type ItineraryStep = {
  time: string;
  activity: string;
};

type ProductFormValues = {
  name: string;
  category: string;
  status: 'activo' | 'inactivo' | 'ausente';
  supplier_id: string;
  description: string;
  short_description: string;
  base_price: number;
  currency: string;
  duration_minutes: number;
  rating: number;
  sku: string;
  images: string[];
  availability: {
    min_pax: number;
    max_capacity: number;
    seasonal: boolean;
    instant_booking: boolean;
  };
  price_tiers: PriceTier[];
  activity_itinerary: ItineraryStep[];
  extended_data: Record<string, any>;
};

export default function ProductFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useAppStore();
  const suppliers = useSuppliers();
  
  const isEditing = !!id;
  const initialCategory = searchParams.get('cat') || 'excursion';
  const initialSupplier = searchParams.get('supplier_id') || '';

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ProductFormValues>({
    defaultValues: {
      category: initialCategory,
      supplier_id: initialSupplier,
      status: 'activo',
      currency: 'USD',
      base_price: 0,
      duration_minutes: 60,
      rating: 4.5,
      images: [''],
      availability: {
        min_pax: 1,
        max_capacity: 0,
        seasonal: false,
        instant_booking: true
      },
      price_tiers: [],
      activity_itinerary: [],
      extended_data: {}
    }
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images" as any
  });

  const { fields: tierFields, append: appendTier, remove: removeTier } = useFieldArray({
    control,
    name: "price_tiers"
  });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
    control,
    name: "activity_itinerary"
  });

  const selectedCategory = watch('category');

  useEffect(() => {
    if (isEditing) {
      const existing = products.find(p => p.id === id);
      if (existing) {
        Object.entries(existing).forEach(([key, val]) => {
          setValue(key as any, val);
        });
      }
    }
  }, [id, products, setValue, isEditing]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (isEditing) {
        await updateProduct(id!, data);
      } else {
        await addProduct(data);
      }
      navigate('/productos');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-page-enter pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"><ArrowLeft size={18}/></button>
           <div>
              <h1 className="text-3xl font-black text-white tracking-tight">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h1>
              <p className="text-slate-500 text-sm font-bold flex items-center gap-2">
                <Tag size={14} /> Gestión de inventario Sol y Vida
              </p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button type="button" onClick={() => navigate('/productos')} className="text-slate-500 font-black hover:text-white transition-all text-xs uppercase tracking-widest px-4">Descartar</button>
           <button type="submit" className="btn-primary shadow-lg shadow-sky-500/20 bg-gradient-to-r from-sky-500 to-indigo-600 flex items-center gap-2 px-10">
              <Save size={18} /> {isEditing ? 'Publicar Cambios' : 'Registrar Producto'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
           {/* Section 1: Identity */}
           <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center"><Package size={18} /></div>
                 <h2 className="text-xl font-black text-white">Información Primaria</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Producto / Servicio</label>
                    <input {...register('name', { required: true })} className="form-input w-full" placeholder="Ej: Machu Picchu Premium Day" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría</label>
                    <select {...register('category')} className="form-input w-full">
                       {Object.entries(PRODUCT_CATEGORY_META).map(([key, meta]) => (
                         <option key={key} value={key}>{meta.emoji} {meta.label}</option>
                       ))}
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción de Experiencia (Marketplace)</label>
                 <textarea {...register('description')} rows={5} className="form-input w-full resize-none" placeholder="Escribe una descripción vendedora..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Resumen Corto (Voucher)</label>
                    <input {...register('short_description')} className="form-input w-full" placeholder="Máximo 100 caracteres..." />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Proveedor Operativo</label>
                    <select {...register('supplier_id')} className="form-input w-full">
                       <option value="">-- Sin proveedor asociado (Interno) --</option>
                       {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                 </div>
              </div>
           </div>

           {/* Dynamic Category Fields */}
           <div className="glass-card p-8 border-l-4 border-sky-500/50 bg-sky-500/5 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center"><Zap size={18} /></div>
                 <div>
                    <h2 className="text-xl font-black text-white">Especificaciones Técnicas</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Categoría: {selectedCategory}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                 {PRODUCT_DYNAMIC_FIELDS[selectedCategory]?.map((field: any) => (
                   <div key={field.name} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{field.label}</label>
                      {field.type === 'select' ? (
                        <select {...register(`extended_data.${field.name}`)} className="form-input w-full text-sm">
                           {field.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                           <input type="checkbox" {...register(`extended_data.${field.name}`)} className="w-5 h-5 accent-sky-500" />
                           <span className="text-slate-300 text-sm font-bold">{field.label}</span>
                        </div>
                      ) : (
                        <input 
                           type={field.type === 'number' ? 'number' : 'text'} 
                           {...register(`extended_data.${field.name}`, field.type === 'number' ? { valueAsNumber: true } : {})}
                           placeholder={field.placeholder}
                           className="form-input w-full text-sm"
                        />
                      )}
                   </div>
                 ))}
              </div>
           </div>

           {/* Itinerary Steps */}
           <div className="glass-card p-8 space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><Clock size={18} /></div>
                    <h2 className="text-xl font-black text-white">Planificación de Actividades (Paso a Paso)</h2>
                 </div>
                 <button 
                  type="button" 
                  onClick={() => appendItinerary({ time: '09:00', activity: '' })}
                  className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all"
                 >
                    + Agregar Paso
                 </button>
              </div>

              <div className="space-y-3">
                 {itineraryFields.map((item, index) => (
                   <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group relative animate-in fade-in slide-in-from-left-2 transition-all">
                      <div className="w-24 shrink-0">
                         <input {...register(`activity_itinerary.${index}.time`)} placeholder="Hora" className="form-input w-full text-center font-bold" />
                      </div>
                      <div className="flex-1">
                         <input {...register(`activity_itinerary.${index}.activity`)} placeholder="Describe la actividad..." className="form-input w-full" />
                      </div>
                      <button type="button" onClick={() => removeItinerary(index)} className="p-3 text-slate-600 hover:text-rose-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                   </div>
                 ))}
                 {itineraryFields.length === 0 && (
                   <p className="text-center py-6 text-slate-500 text-xs font-bold uppercase italic border-2 border-dashed border-white/5 rounded-3xl">Sin itinerario detallado.</p>
                 )}
              </div>
           </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
           {/* Section 1: Pricing */}
           <div className="glass-card p-6 space-y-6 bg-gradient-to-br from-indigo-500/10 to-transparent">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                 <DollarSign size={20} className="text-sky-400" /> Tarifas y Comercial
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Precio Base</label>
                    <input type="number" step="0.01" {...register('base_price')} className="form-input w-full font-black text-sky-400" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Moneda</label>
                    <select {...register('currency')} className="form-input w-full font-bold">
                       <option value="USD">USD</option>
                       <option value="PEN">PEN</option>
                    </select>
                 </div>
              </div>

              {/* Price Tiers */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Niveles de Precio (Tiers)</p>
                    <button type="button" onClick={() => appendTier({ name: 'Bulk', min_pax: 5, price: 0 })} className="text-[10px] text-sky-400 font-bold">+ Añadir</button>
                 </div>
                 
                 <div className="space-y-2">
                    {tierFields.map((tier, i) => (
                      <div key={tier.id} className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-900 border border-white/5 relative group">
                         <input {...register(`price_tiers.${i}.name`)} placeholder="Tier" className="bg-transparent border-none text-[10px] text-white focus:ring-0 p-0 font-bold" />
                         <input type="number" {...register(`price_tiers.${i}.min_pax`)} className="bg-transparent border-none text-[10px] text-slate-400 focus:ring-0 p-0 text-center" />
                         <input type="number" step="0.01" {...register(`price_tiers.${i}.price`)} className="bg-transparent border-none text-[10px] text-emerald-400 focus:ring-0 p-0 text-right font-black" />
                         <button onClick={() => removeTier(i)} className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-rose-500 transition-all"><Plus className="rotate-45" size={14}/></button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Section 2: Operativity */}
           <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                 <Zap size={20} className="text-amber-500" /> Disponibilidad
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Min. PAX</label>
                    <input type="number" {...register('availability.min_pax')} className="form-input w-full" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Máx. Capacidad</label>
                    <input type="number" {...register('availability.max_capacity')} className="form-input w-full" />
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer group transition-all hover:bg-white/10">
                    <input type="checkbox" {...register('availability.instant_booking')} className="w-5 h-5 rounded-lg border-white/20 bg-slate-900 text-sky-500 focus:ring-sky-500/20" />
                    <div className="flex-1">
                       <p className="text-sm font-black text-white">Reserva Inmediata</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase">Confirmación sin manual check</p>
                    </div>
                 </label>
                 <label className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer group transition-all hover:bg-white/10">
                    <input type="checkbox" {...register('availability.seasonal')} className="w-5 h-5 rounded-lg border-white/20 bg-slate-900 text-amber-500 focus:ring-amber-500/20" />
                    <div className="flex-1">
                       <p className="text-sm font-black text-white">Temporada Específica</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase">Restringido por clima o fechas</p>
                    </div>
                 </label>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Duración (Minutos)</label>
                 <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input type="number" {...register('duration_minutes')} className="form-input w-full pl-10" />
                 </div>
              </div>
           </div>

           {/* Gallery Summary */}
           <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                 <ImageIcon size={20} className="text-indigo-400" /> Media & Fotos
              </h3>
              
              <div className="space-y-3">
                 {imageFields.map((field, index) => (
                   <div key={field.id} className="relative group">
                      <input 
                        {...register(`images.${index}`)}
                        placeholder="URL de imagen..."
                        className="form-input w-full text-xs pr-10"
                      />
                      <button onClick={() => removeImage(index)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={12} />
                      </button>
                   </div>
                 ))}
                 <button type="button" onClick={() => appendImage('')} className="w-full py-2 border-2 border-dashed border-white/10 rounded-2xl text-[10px] font-bold text-slate-600 uppercase hover:border-sky-500 hover:text-sky-500 transition-all">+ Añadir URL</button>
              </div>
           </div>
        </div>
      </div>
    </form>
  );
}
