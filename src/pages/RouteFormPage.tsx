import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useAppStore, useProducts, useSuppliers } from '../store/useAppStore';
import { 
  ArrowLeft, 
  Save, 
  Map, 
  Calendar, 
  MapPin, 
  Plus, 
  Package, 
  Trash2, 
  GripVertical,
  Clock,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Zap,
  Tag,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type ItineraryItemForm = {
  day: number;
  start_time: string;
  end_time: string;
  product_id: string;
  notes: string;
};

type RouteFormValues = {
  name: string;
  destination: string;
  description: string;
  duration_days: number;
  status: 'activo' | 'pausado' | 'archivo';
  tags: string[];
  images: string[];
  pricing: {
    currency: string;
    base_price_per_pax: number;
  };
  itinerary: ItineraryItemForm[];
};

// --- Sortable Item Wrapper ---
function SortableItineraryItem({ 
  index, 
  item, 
  register, 
  remove, 
  products, 
  suppliers 
}: { 
  index: number; 
  item: any; 
  register: any; 
  remove: any; 
  products: any[]; 
  suppliers: any[];
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.6 : 1
  };

  const currentProductId = item.product_id;
  const product = products.find(p => p.id === currentProductId);
  const supplier = suppliers.find(s => s.id === product?.supplier_id);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`glass-card p-4 flex gap-4 transition-all duration-300 ${isDragging ? 'ring-2 ring-emerald-500 shadow-2xl' : 'hover:border-emerald-500/20'}`}
    >
      <div 
        {...attributes} {...listeners}
        className="cursor-grab active:cursor-grabbing w-8 flex items-center justify-center text-slate-700 hover:text-emerald-500 transition-colors"
      >
        <GripVertical size={20} />
      </div>

      <div className="w-24 space-y-2 shrink-0">
          <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Día</label>
          <input type="number" {...register(`itinerary.${index}.day`)} className="form-input w-full text-center font-black" />
      </div>

      <div className="flex-1 space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Producto / Servicio</label>
               <select {...register(`itinerary.${index}.product_id`)} className="form-input w-full text-xs font-bold">
                  <option value="">Selecciona un producto...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
               </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
               <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Inicio</label>
                  <input {...register(`itinerary.${index}.start_time`)} placeholder="09:00" className="form-input w-full text-center text-xs" />
               </div>
               <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Fin</label>
                  <input {...register(`itinerary.${index}.end_time`)} placeholder="10:30" className="form-input w-full text-center text-xs" />
               </div>
            </div>
         </div>
         <input {...register(`itinerary.${index}.notes`)} placeholder="Añadir notas operativas o de logística..." className="form-input w-full text-xs italic" />
      </div>

      <div className="flex flex-col justify-between">
         <button onClick={() => remove(index)} type="button" className="p-2 text-slate-700 hover:text-rose-500 transition-all"><Trash2 size={16}/></button>
         {product && (
            <div className="text-right">
              <p className="text-[8px] font-black text-emerald-400">$ {product.base_price}</p>
            </div>
         )}
      </div>
    </div>
  );
}

// --- Main Form Page ---
export default function RouteFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { routes, addRoute, updateRoute } = useAppStore();
  const products = useProducts();
  const suppliers = useSuppliers();

  const isEditing = !!id;

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<RouteFormValues>({
    defaultValues: {
      status: 'activo',
      duration_days: 1,
      pricing: { currency: 'USD', base_price_per_pax: 0 },
      tags: [],
      images: [''],
      itinerary: []
    }
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "itinerary" as any
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: "tags" as any
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (isEditing) {
      const existing = routes.find(r => r.id === id);
      if (existing) {
        Object.entries(existing).forEach(([key, val]) => {
          setValue(key as any, val);
        });
      }
    }
  }, [id, routes, setValue, isEditing]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const onSubmit = async (data: RouteFormValues) => {
    try {
      if (isEditing) {
        await updateRoute(id!, data);
      } else {
        await addRoute({ ...data, booking_count: 0 });
      }
      navigate('/rutas');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // Auto-calculation of price
  const watchItinerary = watch('itinerary');
  const totalPrice = watchItinerary?.reduce((acc, item) => {
    const prod = products.find(p => p.id === item.product_id);
    return acc + (prod?.base_price || 0);
  }, 0) || 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-page-enter pb-24">
      {/* Navbar Floating */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"><ArrowLeft size={20}/></button>
            <div>
               <h1 className="text-3xl font-black text-white tracking-tighter">{isEditing ? 'Editar Plan Maestro' : 'Construir Nueva Ruta'}</h1>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                 <MapPin size={12} className="text-emerald-500" /> Ingeniería de Producto Sol y Vida
               </p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate('/rutas')} className="text-slate-500 font-black hover:text-white transition-all text-[10px] uppercase tracking-widest px-4">Descartar</button>
            <button type="submit" className="btn-primary shadow-xl shadow-emerald-500/10 bg-gradient-to-r from-emerald-500 to-teal-600 px-10">
               <Save size={18} className="mr-2 inline" /> {isEditing ? 'Guardar Cambios' : 'Lanzar Ruta'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Builder (3 cols) */}
        <div className="lg:col-span-3 space-y-8">
           {/* Info Section */}
           <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><Map size={18}/></div>
                 <h2 className="text-xl font-black text-white uppercase tracking-tight">Atributos del Paquete</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Comercial de la Ruta</label>
                       <input {...register('name', { required: true })} className="form-input w-full text-lg font-black" placeholder="Ej: Esencia de los Andes" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Destino Principal</label>
                          <input {...register('destination')} className="form-input w-full font-bold" placeholder="Ej: Cuzco" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Duración (Días)</label>
                          <input type="number" {...register('duration_days')} className="form-input w-full text-center font-black" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción de Experiencia</label>
                    <textarea {...register('description')} rows={5} className="form-input w-full resize-none leading-relaxed" placeholder="Qué hace única a esta ruta..." />
                 </div>
              </div>
           </div>

           {/* Itinerary Builder */}
           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center"><Calendar size={18}/></div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Cronograma Operativo</h2>
                 </div>
                 <button 
                   type="button" 
                   onClick={() => append({ day: 1, start_time: '08:00', end_time: '12:00', product_id: '', notes: '' })}
                   className="btn-secondary text-[10px] font-black bg-white/5 border-white/10 hover:bg-emerald-500 hover:text-slate-950 px-6"
                 >
                   + Insertar Servicio
                 </button>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                 <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                       {fields.map((field, index) => (
                         <SortableItineraryItem 
                           key={field.id} 
                           index={index} 
                           item={field} 
                           register={register} 
                           remove={remove}
                           products={products}
                           suppliers={suppliers}
                         />
                       ))}
                       {fields.length === 0 && (
                          <div className="p-20 border-2 border-dashed border-white/5 rounded-[40px] text-center">
                             <TrendingUp size={48} className="mx-auto text-slate-800 mb-4" />
                             <p className="text-slate-600 font-bold uppercase text-[10px]">Arrastra productos aquí para empezar el armado.</p>
                          </div>
                       )}
                    </div>
                 </SortableContext>
              </DndContext>
           </div>
        </div>

        {/* Sidebar Data (1 col) */}
        <div className="space-y-8">
           {/* Section 1: Pricing */}
           <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/5 to-transparent space-y-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                 <CreditCard size={20} className="text-sky-500" /> Finanzas del Paquete
              </h3>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Precio de Venta Sugerido</label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-black">$</span>
                       <input type="number" step="0.01" {...register('pricing.base_price_per_pax')} className="form-input w-full pl-8 text-2xl font-black text-white" />
                    </div>
                 </div>

                 <div className="p-4 rounded-2xl bg-white/5 space-y-2 border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Costo de Inventario (Suma)</p>
                    <p className="text-xl font-black text-sky-400">$ {totalPrice.toLocaleString()}</p>
                    {watch('pricing.base_price_per_pax') > 0 && (
                       <p className="text-[9px] font-bold text-emerald-400 uppercase">
                          Margen Bruto: {Math.round(((watch('pricing.base_price_per_pax') - totalPrice) / watch('pricing.base_price_per_pax')) * 100)}%
                       </p>
                    )}
                 </div>
              </div>
           </div>

           {/* Section 2: Management */}
           <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                 <Zap size={20} className="text-amber-500" /> Configuración
              </h3>
              <div className="space-y-4">
                 <div className="space-y-2 text-sm">
                    <label className="text-[10px] font-black text-slate-600 uppercase">Visibilidad</label>
                    <select {...register('status')} className="form-input w-full font-bold">
                       <option value="activo">Activo / Publicado</option>
                       <option value="pausado">Pausado / Draft</option>
                       <option value="archivo"> Archivado</option>
                    </select>
                 </div>

                 {/* Tags */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-600 uppercase">Etiquetas y Categorías</label>
                    <div className="flex flex-wrap gap-2">
                       {tagFields.map((field, i) => (
                         <div key={field.id} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 group">
                            <input {...register(`tags.${i}`)} className="bg-transparent border-none text-[10px] font-bold text-slate-300 w-16 focus:ring-0 p-0" />
                            <button onClick={() => removeTag(i)} className="text-rose-500/50 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Plus size={10} className="rotate-45" /></button>
                         </div>
                       ))}
                       <button type="button" onClick={() => appendTag('NUEVO')} className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black border border-emerald-500/20">+</button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Visual Assets */}
           <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                 <Package size={20} className="text-indigo-400" /> Assets Visuales
              </h3>
              <div className="space-y-4">
                 <Controller 
                   control={control}
                   name="images.0"
                   render={({ field }) => (
                     <div className="space-y-4">
                        <div className="aspect-video w-full rounded-2xl bg-slate-900 border border-white/10 overflow-hidden relative group">
                           {field.value ? (
                             <img src={field.value} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-700"><Map size={24}/></div>
                           )}
                        </div>
                        <input {...field} placeholder="URL de imagen principal" className="form-input w-full text-[10px]" />
                     </div>
                   )}
                 />
              </div>
           </div>
        </div>
      </div>
    </form>
  );
}
