import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAppStore } from '../store/useAppStore';
import { 
  ArrowLeft, 
  Save, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  ShieldCheck,
  Star,
  Info,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SUPPLIER_CATEGORY_META, SUPPLIER_DYNAMIC_FIELDS } from '../config/categoryFields';

type SupplierFormValues = {
  name: string;
  category: string;
  status: 'activo' | 'inactivo';
  description: string;
  commission_pct: number;
  rating: number;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    country: string;
  };
  logo: string;
  banner_image: string;
  extended_data: Record<string, any>;
};

export default function SupplierFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { suppliers, addSupplier, updateSupplier } = useAppStore();
  
  const isEditing = !!id;
  const initialCategory = searchParams.get('cat') || 'hotel';

  const defaultValues: SupplierFormValues = {
    name: '',
    category: initialCategory,
    status: 'activo',
    description: '',
    commission_pct: 10,
    rating: 4.5,
    contact: { name: '', email: '', phone: '' },
    address: { street: '', city: 'Cuzco', country: 'Perú' },
    logo: '',
    banner_image: '',
    extended_data: {}
  };

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isDirty } } = useForm<SupplierFormValues>({
    defaultValues
  });

  const selectedCategory = watch('category');

  useEffect(() => {
    if (isEditing) {
      const existing = suppliers.find(s => s.id === id);
      if (existing) {
        Object.entries(existing).forEach(([key, val]) => {
          setValue(key as any, val);
        });
      }
    }
  }, [id, suppliers, setValue, isEditing]);

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      if (isEditing) {
        await updateSupplier(id, data);
      } else {
        await addSupplier(data);
      }
      navigate('/proveedores');
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-page-enter pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {isEditing ? 'Editar Proveedor' : 'Nuevo Partner'}
            </h1>
            <p className="text-slate-500 text-sm font-medium">Define los términos comerciales y de contacto.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => navigate('/proveedores')}
            className="text-slate-500 font-bold hover:text-white transition-colors px-4"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary flex items-center gap-2 px-8"
            disabled={!isDirty && isEditing}
          >
            <Save size={18} />
            {isEditing ? 'Actualizar' : 'Guardar Partner'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Building2 size={18} />
                 </div>
                 <h2 className="text-xl font-black text-white">Identidad del Proveedor</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Comercial</label>
                    <input 
                      {...register('name', { required: true })}
                      placeholder="Ej: Hotel Monasterio Cusco"
                      className={`form-input w-full ${errors.name ? 'border-rose-500' : ''}`}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría</label>
                    <select 
                      {...register('category')}
                      className="form-input w-full"
                    >
                      {Object.entries(SUPPLIER_CATEGORY_META).map(([key, meta]) => (
                        <option key={key} value={key}>{meta.emoji} {meta.label}</option>
                      ))}
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción Corporativa</label>
                 <textarea 
                   {...register('description')}
                   rows={4}
                   placeholder="Describe las fortalezas y el enfoque de este partner..."
                   className="form-input w-full resize-none"
                 />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estado</label>
                    <select {...register('status')} className="form-input w-full">
                       <option value="activo">Activo</option>
                       <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Comisión %</label>
                    <input type="number" {...register('commission_pct', { valueAsNumber: true })} className="form-input w-full" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rating</label>
                    <input type="number" step="0.1" {...register('rating', { valueAsNumber: true })} className="form-input w-full" />
                  </div>
              </div>
           </div>

           {/* Location & Contact */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-6 space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                    <MapPin size={18} className="text-amber-500" />
                    <h3 className="text-lg font-black text-white">Ubicación</h3>
                 </div>
                 <div className="space-y-4">
                    <input {...register('address.street')} placeholder="Dirección" className="form-input w-full text-sm" />
                    <div className="grid grid-cols-2 gap-4">
                      <input {...register('address.city')} placeholder="Ciudad" className="form-input w-full text-sm" />
                      <input {...register('address.country')} placeholder="País" className="form-input w-full text-sm" />
                    </div>
                 </div>
              </div>

              <div className="glass-card p-6 space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={18} className="text-amber-500" />
                    <h3 className="text-lg font-black text-white">Contacto Principal</h3>
                 </div>
                 <div className="space-y-4">
                    <input {...register('contact.name')} placeholder="Nombre Completo" className="form-input w-full text-sm" />
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                         <input {...register('contact.email')} placeholder="Email Corporativo" className="form-input w-full pl-10 text-sm" />
                      </div>
                      <div className="relative">
                         <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                         <input {...register('contact.phone')} placeholder="Teléfono" className="form-input w-full pl-10 text-sm" />
                      </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Dynamic Fields Section */}
           <div className="glass-card p-8 space-y-6 border-l-4 border-amber-500/50">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                    <Zap size={18} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-white text-gradient">Detalles Específicos</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Atributos personalizados para la categoría {selectedCategory}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                 {SUPPLIER_DYNAMIC_FIELDS[selectedCategory]?.map((field: any) => (
                   <div key={field.name} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{field.label}</label>
                      {field.type === 'select' ? (
                        <select 
                          {...register(`extended_data.${field.name}`)}
                          className="form-input w-full text-sm"
                        >
                          {field.options.map((opt: any) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                           <input type="checkbox" {...register(`extended_data.${field.name}`)} className="w-5 h-5 accent-amber-500" />
                           <span className="text-slate-300 text-sm font-bold">{field.label}</span>
                        </div>
                      ) : field.type === 'number' ? (
                        <input 
                           type="number"
                           {...register(`extended_data.${field.name}`, { valueAsNumber: true })}
                           className="form-input w-full text-sm"
                        />
                      ) : (
                        <input 
                           type="text"
                           {...register(`extended_data.${field.name}`)}
                           placeholder={field.placeholder}
                           className="form-input w-full text-sm"
                        />
                      )}
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar: Assets */}
        <div className="space-y-8">
           <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                 <ImageIcon size={20} className="text-amber-500" /> Branding
              </h3>
              
              <div className="space-y-6">
                 {/* Logo Upload Simulation */}
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Logo Corporativo</p>
                    <div className="flex items-center gap-4">
                       <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden shrink-0 group hover:border-amber-500/50 transition-all">
                          {watch('logo') ? (
                            <img src={watch('logo')} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="text-slate-700 group-hover:text-amber-500/50" />
                          )}
                       </div>
                       <input 
                         {...register('logo')}
                         placeholder="URL de imagen..."
                         className="form-input flex-1 text-xs"
                       />
                    </div>
                 </div>

                 {/* Banner Upload Simulation */}
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Imagen de Portada</p>
                    <div className="aspect-video w-full rounded-2xl bg-slate-900 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group hover:border-amber-500/50 transition-all mb-2">
                        {watch('banner_image') ? (
                            <img src={watch('banner_image')} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center">
                               <ImageIcon className="mx-auto text-slate-700 group-hover:text-amber-500/50 mb-2" />
                               <span className="text-[10px] text-slate-700 uppercase font-black">Banner Preview</span>
                            </div>
                        )}
                    </div>
                    <input 
                        {...register('banner_image')}
                        placeholder="URL de portada..."
                        className="form-input w-full text-xs"
                    />
                 </div>
              </div>
           </div>

           {/* Tip Card */}
           <div className="p-6 rounded-[32px] bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest">
                 <CheckCircle2 size={16} /> Tip de Operación
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                Asegúrate de configurar correctamente la comisión. Este porcentaje se verá reflejado automáticamente en el cálculo de margen de tus rutas.
              </p>
           </div>
        </div>
      </div>
    </form>
  );
}
