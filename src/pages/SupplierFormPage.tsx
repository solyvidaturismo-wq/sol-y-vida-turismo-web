import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppStore } from '../store/useAppStore';
import {
  ArrowLeft,
  Save,
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Image as ImageIcon,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { SUPPLIER_CATEGORY_META, SUPPLIER_CATEGORIES } from '../config/categoryFields';
import { COLOMBIA_DEPARTMENTS, getMunicipalitiesByDepartment } from '../config/colombiaLocations';
import DynamicFormSection from '../components/ui/DynamicFormSection';
import ImageUpload from '../components/ui/ImageUpload';
import { toast } from '../store/useToastStore';

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
    department: string;
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
    address: { street: '', department: '', city: '', country: 'Colombia' },
    logo: '',
    banner_image: '',
    extended_data: {}
  };

  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty } } = useForm<SupplierFormValues>({
    defaultValues
  });

  const selectedCategory = watch('category');
  const selectedDepartment = watch('address.department');

  useEffect(() => {
    if (!isEditing) {
      setValue('address.city', '');
    }
  }, [selectedDepartment, setValue, isEditing]);

  useEffect(() => {
    if (isEditing) {
      const existing = suppliers.find(s => s.id === id);
      if (existing) {
        setValue('name', existing.name || '');
        setValue('category', existing.category || 'hotel');
        setValue('status', (existing.status as any) || 'activo');
        setValue('description', existing.notes || '');
        setValue('commission_pct', existing.commission_pct ?? 10);
        setValue('rating', existing.rating ?? 4.5);
        setValue('contact', {
          name: existing.contact?.name || '',
          email: existing.contact?.email || '',
          phone: existing.contact?.phone || '',
        });
        setValue('address', {
          street: existing.location?.address || '',
          department: existing.location?.region || '',
          city: existing.location?.city || '',
          country: existing.location?.country || 'Colombia',
        });
        setValue('logo', existing.logo || '');
        setValue('banner_image', existing.banner_image || '');
        setValue('extended_data', existing.custom_fields || {});
      }
    }
  }, [id, suppliers, setValue, isEditing]);

  const onSubmit = async (data: SupplierFormValues) => {
    // Validaciones manuales
    if (!data.contact.email && !data.contact.phone) {
      toast.error('Debe ingresar al menos un email o teléfono de contacto');
      return;
    }
    if (data.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) {
      toast.error('El email de contacto no es válido');
      return;
    }
    if (data.commission_pct < 0 || data.commission_pct > 100) {
      toast.error('La comisión debe estar entre 0 y 100');
      return;
    }
    if (data.rating < 1 || data.rating > 5) {
      toast.error('El rating debe estar entre 1 y 5');
      return;
    }

    setSaving(true);
    try {
      const { extended_data, address, description, ...rest } = data;
      const payload = {
        ...rest,
        location: {
          city: address.city,
          country: address.country,
          region: address.department || address.city,
          address: address.street,
        },
        notes: description,
        tags: [],
        custom_fields: extended_data || {},
      };
      if (isEditing) {
        await updateSupplier(id, payload as any);
      } else {
        await addSupplier(payload as any);
      }
      toast.success(isEditing ? 'Proveedor actualizado' : 'Proveedor creado exitosamente');
      navigate('/proveedores');
    } catch (err: any) {
      toast.error('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
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
            disabled={saving || (!isDirty && isEditing)}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar Partner'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-[#A8442A]/10 text-[#A8442A] flex items-center justify-center">
                    <Building2 size={18} />
                 </div>
                 <h2 className="text-xl font-black text-white">Identidad del Proveedor</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Comercial</label>
                    <input
                      {...register('name', { required: 'El nombre es obligatorio', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
                      placeholder="Ej: Hotel Monasterio Cusco"
                      className={`form-input w-full ${errors.name ? 'border-rose-500' : ''}`}
                    />
                    {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.name.message}</p>}
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
                    <input type="number" {...register('commission_pct', { valueAsNumber: true, min: 0, max: 100 })} className={`form-input w-full ${errors.commission_pct ? 'border-rose-500' : ''}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rating</label>
                    <input type="number" step="0.1" {...register('rating', { valueAsNumber: true, min: 1, max: 5 })} className={`form-input w-full ${errors.rating ? 'border-rose-500' : ''}`} />
                  </div>
              </div>
           </div>

           {/* Location & Contact */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-6 space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                    <MapPin size={18} className="text-[#A8442A]" />
                    <h3 className="text-lg font-black text-white">Ubicación</h3>
                 </div>
                 <div className="space-y-4">
                    <input {...register('address.street')} placeholder="Dirección" className="form-input w-full text-sm" />
                    <div className="space-y-4">
                      <select
                        {...register('address.department')}
                        className="form-input w-full text-sm"
                      >
                        <option value="">Seleccionar Departamento...</option>
                        {COLOMBIA_DEPARTMENTS.map(dep => (
                          <option key={dep.name} value={dep.name}>{dep.name}</option>
                        ))}
                      </select>
                      <select
                        {...register('address.city')}
                        className="form-input w-full text-sm"
                        disabled={!selectedDepartment}
                      >
                        <option value="">Seleccionar Municipio...</option>
                        {getMunicipalitiesByDepartment(selectedDepartment).map(mun => (
                          <option key={mun} value={mun}>{mun}</option>
                        ))}
                      </select>
                      <input {...register('address.country')} placeholder="País" className="form-input w-full text-sm" readOnly />
                    </div>
                 </div>
              </div>

              <div className="glass-card p-6 space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={18} className="text-[#A8442A]" />
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
           {SUPPLIER_CATEGORIES[selectedCategory] && (
             <div className="glass-card p-8 space-y-6 border-l-4 border-[#A8442A]/50">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-[#A8442A]/10 text-[#C84B2C] flex items-center justify-center">
                      <Zap size={18} />
                   </div>
                   <div>
                      <h2 className="text-xl font-black text-white">Detalles Específicos</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">
                        {SUPPLIER_CATEGORIES[selectedCategory].emoji} {SUPPLIER_CATEGORIES[selectedCategory].label} &mdash; {SUPPLIER_CATEGORIES[selectedCategory].description}
                      </p>
                   </div>
                </div>

                <DynamicFormSection
                  sections={SUPPLIER_CATEGORIES[selectedCategory].sections}
                  register={register}
                  watch={watch}
                  prefix="extended_data"
                />
             </div>
           )}
        </div>

        {/* Sidebar: Assets */}
        <div className="space-y-8">
           <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                 <ImageIcon size={20} className="text-[#A8442A]" /> Branding
              </h3>

              <div className="space-y-6">
                 <ImageUpload
                   label="Logo Corporativo"
                   value={watch('logo') || ''}
                   onChange={(val) => setValue('logo', Array.isArray(val) ? val[0] || '' : val, { shouldDirty: true })}
                   maxFiles={1}
                   maxSizeKB={250}
                   description="JPG, PNG o WebP — máximo 250 KB."
                 />

                 <ImageUpload
                   label="Imagen de Portada"
                   value={watch('banner_image') || ''}
                   onChange={(val) => setValue('banner_image', Array.isArray(val) ? val[0] || '' : val, { shouldDirty: true })}
                   maxFiles={1}
                   maxSizeKB={250}
                   description="Banner del perfil — máximo 250 KB."
                 />
              </div>
           </div>

           {/* Tip Card */}
           <div className="p-6 rounded-[32px] bg-[#A8442A]/5 border border-[#A8442A]/20 space-y-3">
              <div className="flex items-center gap-2 text-[#A8442A] font-bold text-xs uppercase tracking-widest">
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
