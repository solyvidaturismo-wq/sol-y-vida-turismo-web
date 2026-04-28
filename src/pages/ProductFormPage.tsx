import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAppStore, useSuppliers } from '../store/useAppStore';
import {
  ArrowLeft,
  Save,
  Package,
  ImageIcon,
  Plus,
  Trash2,
  Clock,
  Zap,
  Tag,
  DollarSign,
  MapPin,
  Calendar,
  Sun,
  Moon,
  Sunset
} from 'lucide-react';
import { PRODUCT_CATEGORY_META, PRODUCT_CATEGORIES } from '../config/categoryFields';
import { COLOMBIA_DEPARTMENTS, getMunicipalitiesByDepartment } from '../config/colombiaLocations';
import DynamicFormSection from '../components/ui/DynamicFormSection';
import { PROFILE_TAG_GROUPS, PROFILE_COLOR_MAP, PROFILE_TAG_MAP } from '../config/profileTags';
import { toast } from '../store/useToastStore';

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
  duration_type: 'minutos' | 'horas' | 'dia_completo' | 'medio_dia' | 'varios_dias';
  duration_hours: number;
  duration_days: number;
  schedule_type: 'flexible' | 'horario_fijo' | 'manana' | 'tarde' | 'noche';
  availability: {
    min_pax: number;
    max_capacity: number;
    seasonal: boolean;
    instant_booking: boolean;
    start_time: string;
    end_time: string;
    days_of_week: boolean[];
  };
  price_tiers: PriceTier[];
  activity_itinerary: ItineraryStep[];
  profile_tags: string[];
  location: {
    department: string;
    city: string;
    country: string;
  };
  extended_data: Record<string, any>;
};

export default function ProductFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, getProductTags } = useAppStore();
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
      duration_type: 'horas',
      duration_minutes: 60,
      duration_hours: 1,
      duration_days: 1,
      schedule_type: 'flexible',
      rating: 4.5,
      images: [''],
      availability: {
        min_pax: 1,
        max_capacity: 0,
        seasonal: false,
        instant_booking: true,
        start_time: '',
        end_time: '',
        days_of_week: [false, true, true, true, true, true, true] // Dom off, Lun-Sab on
      },
      price_tiers: [],
      activity_itinerary: [],
      profile_tags: [],
      location: { department: '', city: '', country: 'Colombia' },
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

  const [saving, setSaving] = useState(false);
  const selectedCategory = watch('category');
  const selectedDepartment = watch('location.department');
  const durationType = watch('duration_type');
  const scheduleType = watch('schedule_type');
  const profileTags = watch('profile_tags') || [];

  const toggleProfileTag = (tagId: string) => {
    const current = profileTags;
    if (current.includes(tagId)) {
      setValue('profile_tags', current.filter((t: string) => t !== tagId), { shouldDirty: true });
    } else {
      setValue('profile_tags', [...current, tagId], { shouldDirty: true });
    }
  };

  useEffect(() => {
    if (!isEditing) {
      setValue('location.city', '');
    }
  }, [selectedDepartment, setValue, isEditing]);

  useEffect(() => {
    if (isEditing) {
      const existing = products.find(p => p.id === id);
      if (existing) {
        setValue('name', existing.name || '');
        setValue('category', existing.category || 'excursion');
        setValue('status', (existing.status as any) || 'activo');
        setValue('supplier_id', existing.supplier_id || '');
        setValue('description', existing.description || '');
        setValue('short_description', existing.short_description || '');
        setValue('base_price', existing.base_price ?? 0);
        setValue('currency', existing.currency || 'USD');
        setValue('images', existing.images?.length ? existing.images : ['']);
        setValue('price_tiers', (existing.price_tiers as any) || []);
        setValue('activity_itinerary', (existing.activity_itinerary as any) || []);

        // days_of_week se guarda como number[] (índices activos) — reconstruir boolean[7]
        const daysBool = [false, false, false, false, false, false, false];
        (existing.availability?.days_of_week || []).forEach((d: number) => {
          if (d >= 0 && d <= 6) daysBool[d] = true;
        });
        setValue('availability', {
          min_pax: existing.availability?.min_pax ?? 1,
          max_capacity: existing.availability?.max_capacity ?? 0,
          seasonal: (existing.availability as any)?.seasonal ?? false,
          instant_booking: (existing.availability as any)?.instant_booking ?? true,
          start_time: existing.availability?.start_time || '',
          end_time: existing.availability?.end_time || '',
          days_of_week: daysBool as any,
        });

        // Inferir duration_type a partir de duration_minutes guardado
        const mins = existing.duration_minutes ?? 60;
        if (mins === 240) {
          setValue('duration_type', 'medio_dia');
        } else if (mins === 480) {
          setValue('duration_type', 'dia_completo');
        } else if (mins > 480 && mins % 480 === 0) {
          setValue('duration_type', 'varios_dias');
          setValue('duration_days', mins / 480);
        } else if (mins >= 60 && mins % 60 === 0) {
          setValue('duration_type', 'horas');
          setValue('duration_hours', mins / 60);
        } else {
          setValue('duration_type', 'minutos');
          setValue('duration_minutes', mins);
        }

        // Separar schedule_type y location del resto de custom_fields
        const cf: Record<string, any> = existing.custom_fields || {};
        const {
          schedule_type,
          location_department,
          location_city,
          location_country,
          ...rest
        } = cf;
        setValue('schedule_type', schedule_type || 'flexible');
        setValue('location', {
          department: location_department || '',
          city: location_city || '',
          country: location_country || 'Colombia',
        });
        setValue('extended_data', rest);

        // Restaurar profile_tags desde la tabla pivote
        const savedTags = getProductTags(existing.id);
        setValue('profile_tags', savedTags || []);
      }
    }
  }, [id, products, setValue, isEditing, getProductTags]);

  const onSubmit = async (data: ProductFormValues) => {
    if (data.base_price < 0) {
      toast.error('El precio base no puede ser negativo');
      return;
    }
    if (data.duration_minutes < 1) {
      toast.error('La duración debe ser al menos 1 minuto');
      return;
    }
    if (data.availability.max_capacity > 0 && data.availability.min_pax > data.availability.max_capacity) {
      toast.error('El mínimo de pasajeros no puede superar la capacidad máxima');
      return;
    }

    setSaving(true);
    try {
      const { extended_data, rating, sku, location, duration_type, duration_hours, duration_days, schedule_type, profile_tags: formProfileTags, ...rest } = data;

      // Compute duration_minutes from the duration type
      let computedDuration = rest.duration_minutes;
      if (duration_type === 'horas') computedDuration = duration_hours * 60;
      else if (duration_type === 'dia_completo') computedDuration = 480; // 8h
      else if (duration_type === 'medio_dia') computedDuration = 240; // 4h
      else if (duration_type === 'varios_dias') computedDuration = duration_days * 480;

      // Map days_of_week booleans to number array
      const daysArray = (rest.availability.days_of_week as unknown as boolean[])
        .map((checked, i) => checked ? i : -1)
        .filter(i => i >= 0);

      const payload = {
        ...rest,
        tags: (rest as any).tags || [],
        is_featured: (rest as any).is_featured ?? false,
        duration_minutes: computedDuration,
        availability: {
          ...rest.availability,
          days_of_week: daysArray,
        },
        custom_fields: {
          ...extended_data,
          schedule_type,
          location_department: location.department,
          location_city: location.city,
          location_country: location.country,
        },
      };
      if (isEditing) {
        await updateProduct(id!, payload as any, formProfileTags);
      } else {
        await addProduct(payload as any, formProfileTags);
      }
      toast.success(isEditing ? 'Producto actualizado' : 'Producto creado exitosamente');
      navigate('/productos');
    } catch (err: any) {
      toast.error('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
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
           <button type="submit" disabled={saving} className="btn-primary shadow-lg shadow-sky-500/20 bg-gradient-to-r from-sky-500 to-indigo-600 flex items-center gap-2 px-10 disabled:opacity-50">
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? 'Guardando...' : isEditing ? 'Publicar Cambios' : 'Registrar Producto'}
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
                    <input {...register('name', { required: 'El nombre es obligatorio', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })} className={`form-input w-full ${errors.name ? 'border-rose-500' : ''}`} placeholder="Ej: Machu Picchu Premium Day" />
                    {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.name.message}</p>}
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

           {/* Profile Tags */}
           <div className="glass-card p-8 space-y-6 border-l-4 border-violet-500/30">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
                    <Tag size={18} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-white">Perfil de Audiencia</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Define para quién es este producto — se usa como filtro en el constructor de rutas</p>
                 </div>
              </div>

              <div className="space-y-5">
                 {PROFILE_TAG_GROUPS.map(group => {
                   const colors = PROFILE_COLOR_MAP[group.color];
                   return (
                     <div key={group.id} className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <span>{group.emoji}</span> {group.label}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {group.tags.map(tag => {
                            const isActive = profileTags.includes(tag.id);
                            return (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() => toggleProfileTag(tag.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                  isActive
                                    ? `${colors.bgSoft} ${colors.text} ${colors.border} ring-1 ring-current`
                                    : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-slate-300'
                                }`}
                              >
                                {tag.emoji} {tag.label}
                              </button>
                            );
                          })}
                        </div>
                     </div>
                   );
                 })}
              </div>

              {profileTags.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] font-black text-slate-600 uppercase mb-2">Seleccionados ({profileTags.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profileTags.map((tagId: string) => {
                      const info = PROFILE_TAG_MAP[tagId];
                      if (!info) return null;
                      const colors = PROFILE_COLOR_MAP[info.groupColor];
                      return (
                        <span key={tagId} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${colors.bgSoft} ${colors.text}`}>
                          {info.emoji} {info.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
           </div>

           {/* Dynamic Category Fields */}
           {PRODUCT_CATEGORIES[selectedCategory] && (
             <div className="glass-card p-8 border-l-4 border-sky-500/50 bg-sky-500/5 space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center"><Zap size={18} /></div>
                   <div>
                      <h2 className="text-xl font-black text-white">Especificaciones Técnicas</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">
                        {PRODUCT_CATEGORIES[selectedCategory].emoji} {PRODUCT_CATEGORIES[selectedCategory].label} &mdash; {PRODUCT_CATEGORIES[selectedCategory].description}
                      </p>
                   </div>
                </div>

                <DynamicFormSection
                  sections={PRODUCT_CATEGORIES[selectedCategory].sections}
                  register={register}
                  watch={watch}
                  prefix="extended_data"
                />
             </div>
           )}

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
                       <option value="USD">USD — Dólar</option>
                       <option value="PEN">PEN — Sol Peruano</option>
                       <option value="COP">COP — Peso Colombiano</option>
                       <option value="EUR">EUR — Euro</option>
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

           {/* Section 2: Duration & Schedule */}
           <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                 <Clock size={20} className="text-amber-500" /> Duración y Horario
              </h3>

              {/* Duration Type */}
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo de Duración</label>
                 <div className="grid grid-cols-2 gap-2">
                    {([
                      { value: 'minutos', label: 'Minutos', icon: '⏱' },
                      { value: 'horas', label: 'Horas', icon: '🕐' },
                      { value: 'medio_dia', label: 'Medio Día', icon: '🌅' },
                      { value: 'dia_completo', label: 'Día Completo', icon: '☀️' },
                      { value: 'varios_dias', label: 'Varios Días', icon: '📅' },
                    ] as const).map(opt => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-xs font-bold ${
                          durationType === opt.value
                            ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                            : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('duration_type')}
                          value={opt.value}
                          className="sr-only"
                        />
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </label>
                    ))}
                 </div>
              </div>

              {/* Conditional duration input */}
              {durationType === 'minutos' && (
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duración en Minutos</label>
                   <div className="relative">
                      <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input type="number" {...register('duration_minutes', { valueAsNumber: true })} className="form-input w-full pl-10" placeholder="60" />
                   </div>
                </div>
              )}
              {durationType === 'horas' && (
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duración en Horas</label>
                   <div className="relative">
                      <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input type="number" step="0.5" {...register('duration_hours', { valueAsNumber: true })} className="form-input w-full pl-10" placeholder="3" />
                   </div>
                </div>
              )}
              {durationType === 'varios_dias' && (
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cantidad de Días</label>
                   <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input type="number" {...register('duration_days', { valueAsNumber: true })} className="form-input w-full pl-10" placeholder="3" min={1} />
                   </div>
                </div>
              )}
              {(durationType === 'medio_dia' || durationType === 'dia_completo') && (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                   <p className="text-[10px] text-amber-400/80 font-bold">
                     {durationType === 'medio_dia' ? '~4 horas de actividad' : '~8 horas de actividad (jornada completa)'}
                   </p>
                </div>
              )}

              {/* Schedule Type */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Horario de Operación</label>
                 <div className="grid grid-cols-1 gap-2">
                    {([
                      { value: 'flexible', label: 'Horario Flexible', desc: 'Se coordina con el cliente', Icon: Clock },
                      { value: 'manana', label: 'Solo Mañana', desc: '6:00 AM — 12:00 PM', Icon: Sun },
                      { value: 'tarde', label: 'Solo Tarde', desc: '12:00 PM — 6:00 PM', Icon: Sunset },
                      { value: 'noche', label: 'Nocturno', desc: '6:00 PM — 12:00 AM', Icon: Moon },
                      { value: 'horario_fijo', label: 'Horario Específico', desc: 'Definir hora inicio y fin', Icon: Calendar },
                    ] as const).map(opt => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          scheduleType === opt.value
                            ? 'border-sky-500/50 bg-sky-500/10'
                            : 'border-white/5 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('schedule_type')}
                          value={opt.value}
                          className="sr-only"
                        />
                        <opt.Icon size={16} className={scheduleType === opt.value ? 'text-sky-400' : 'text-slate-600'} />
                        <div className="flex-1">
                           <p className={`text-xs font-bold ${scheduleType === opt.value ? 'text-white' : 'text-slate-400'}`}>{opt.label}</p>
                           <p className="text-[10px] text-slate-600">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                 </div>
              </div>

              {/* Fixed time inputs */}
              {scheduleType === 'horario_fijo' && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hora Inicio</label>
                      <input type="time" {...register('availability.start_time')} className="form-input w-full text-sm" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hora Fin</label>
                      <input type="time" {...register('availability.end_time')} className="form-input w-full text-sm" />
                   </div>
                </div>
              )}

              {/* Days of Week */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Días Disponibles</label>
                 <div className="flex gap-1">
                    {['D', 'L', 'M', 'Mi', 'J', 'V', 'S'].map((day, i) => (
                      <label key={i} className="flex-1">
                        <input
                          type="checkbox"
                          {...register(`availability.days_of_week.${i}`)}
                          className="sr-only peer"
                        />
                        <div className="text-center py-2 rounded-lg text-[10px] font-black cursor-pointer transition-all border
                          peer-checked:bg-sky-500/20 peer-checked:border-sky-500/50 peer-checked:text-sky-400
                          bg-white/5 border-white/5 text-slate-600 hover:bg-white/10"
                        >
                          {day}
                        </div>
                      </label>
                    ))}
                 </div>
              </div>
           </div>

           {/* Section 3: Capacity & Options */}
           <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                 <Zap size={20} className="text-sky-400" /> Capacidad y Opciones
              </h3>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Min. PAX</label>
                    <input type="number" {...register('availability.min_pax', { valueAsNumber: true })} className="form-input w-full" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Máx. Capacidad</label>
                    <input type="number" {...register('availability.max_capacity', { valueAsNumber: true })} className="form-input w-full" />
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
           </div>

           {/* Location */}
           <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                 <MapPin size={20} className="text-emerald-400" /> Ubicación
              </h3>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Departamento</label>
                    <select {...register('location.department')} className="form-input w-full text-sm">
                       <option value="">Seleccionar Departamento...</option>
                       {COLOMBIA_DEPARTMENTS.map(dep => (
                         <option key={dep.name} value={dep.name}>{dep.name}</option>
                       ))}
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Municipio</label>
                    <select
                      {...register('location.city')}
                      className="form-input w-full text-sm"
                      disabled={!selectedDepartment}
                    >
                       <option value="">Seleccionar Municipio...</option>
                       {getMunicipalitiesByDepartment(selectedDepartment).map(mun => (
                         <option key={mun} value={mun}>{mun}</option>
                       ))}
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">País</label>
                    <input {...register('location.country')} className="form-input w-full text-sm" readOnly />
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
