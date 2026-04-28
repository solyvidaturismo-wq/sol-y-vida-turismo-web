import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppStore } from '../store/useAppStore';
import {
  ArrowLeft, Save, Map, Calendar, MapPin, Image,
  CreditCard, Zap, Plus, Trash2, Star,
  CheckCircle2, XCircle, Users, Utensils,
  Bus, ShieldCheck
} from 'lucide-react';
import { toast } from '../store/useToastStore';

// ── Types ──────────────────────────────────────────────────

type RouteFormValues = {
  name: string;
  destination: string;
  description: string;
  short_description: string;
  duration_days: number;
  difficulty: string;
  status: 'activo' | 'pausado' | 'archivado';
  is_featured: boolean;
  tags: string[];
  images: string[];
  highlights: string[];
  included: string[];
  not_included: string[];
  pricing: {
    currency: string;
    base_price_per_pax: number;
    min_pax: number;
    max_pax: number;
    includes_guide: boolean;
    includes_transport: boolean;
    includes_meals: boolean;
    meal_plan: string;
  };
};

// ── Editable List Helper ──────────────────────────────────

function EditableList({
  items, setItems, placeholder, icon, color,
}: {
  items: string[];
  setItems: (items: string[]) => void;
  placeholder: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 group">
          <span className={`shrink-0 ${color}`}>{icon}</span>
          <input
            value={item}
            onChange={e => {
              const next = [...items];
              next[i] = e.target.value;
              setItems(next);
            }}
            className="form-input flex-1 text-sm font-medium"
            placeholder={placeholder}
          />
          <button type="button" onClick={() => setItems(items.filter((_, idx) => idx !== i))}
            className="opacity-0 group-hover:opacity-100 text-rose-500/60 hover:text-rose-500 transition-all p-1">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => setItems([...items, ''])}
        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-all mt-1">
        <Plus size={12} /> Agregar
      </button>
    </div>
  );
}

// ── Main Form Page ─────────────────────────────────────────

export default function RouteFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { routes, addRoute, updateRoute } = useAppStore();

  const isEditing = !!id;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RouteFormValues>({
    defaultValues: {
      status: 'activo',
      duration_days: 1,
      difficulty: '',
      is_featured: false,
      short_description: '',
      pricing: {
        currency: 'COP',
        base_price_per_pax: 0,
        min_pax: 1,
        max_pax: 0,
        includes_guide: false,
        includes_transport: false,
        includes_meals: false,
        meal_plan: 'sin_comidas',
      },
      tags: [],
      images: [''],
      highlights: [],
      included: [],
      not_included: [],
    }
  });

  const [localTags, setLocalTags] = useState<string[]>([]);
  const [localHighlights, setLocalHighlights] = useState<string[]>([]);
  const [localIncluded, setLocalIncluded] = useState<string[]>([]);
  const [localNotIncluded, setLocalNotIncluded] = useState<string[]>([]);
  const [localImages, setLocalImages] = useState<string[]>(['']);

  useEffect(() => {
    if (isEditing) {
      const existing = routes.find(r => r.id === id);
      if (existing) {
        setValue('name', existing.name);
        setValue('destination', existing.destination);
        setValue('description', existing.description);
        setValue('short_description', existing.short_description || '');
        setValue('duration_days', existing.duration_days);
        setValue('difficulty', existing.difficulty || '');
        setValue('status', existing.status as any);
        setValue('is_featured', existing.is_featured || false);

        const existingTags = existing.tags || [];
        setValue('tags', existingTags);
        setLocalTags(existingTags);

        const existingHighlights = existing.highlights || [];
        setValue('highlights', existingHighlights);
        setLocalHighlights(existingHighlights);

        const existingIncluded = existing.included || [];
        setValue('included', existingIncluded);
        setLocalIncluded(existingIncluded);

        const existingNotIncluded = existing.not_included || [];
        setValue('not_included', existingNotIncluded);
        setLocalNotIncluded(existingNotIncluded);

        const existingImages = existing.images?.length ? existing.images : [''];
        setValue('images', existingImages);
        setLocalImages(existingImages);

        setValue('pricing', {
          currency: existing.pricing?.currency || 'COP',
          base_price_per_pax: existing.pricing?.base_price_per_pax || 0,
          min_pax: existing.pricing?.min_pax || 1,
          max_pax: existing.pricing?.max_pax || 0,
          includes_guide: existing.pricing?.includes_guide || false,
          includes_transport: existing.pricing?.includes_transport || false,
          includes_meals: existing.pricing?.includes_meals || false,
          meal_plan: existing.pricing?.meal_plan || 'sin_comidas',
        });
      }
    }
  }, [id, routes, setValue, isEditing]);

  // ── State ──
  const [saving, setSaving] = useState(false);
  const watchMeals = watch('pricing.includes_meals');

  const onSubmit = async (data: RouteFormValues) => {
    if (!data.name?.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    if (!data.destination?.trim()) {
      toast.error('El destino principal es obligatorio');
      return;
    }
    if (data.duration_days < 1) {
      toast.error('La duración debe ser al menos 1 día');
      return;
    }

    // Clean up arrays
    data.highlights = localHighlights.filter(h => h.trim());
    data.included = localIncluded.filter(i => i.trim());
    data.not_included = localNotIncluded.filter(n => n.trim());
    data.images = localImages.filter(img => img.trim());
    data.tags = localTags.filter(t => t.trim());

    setSaving(true);
    try {
      if (isEditing) {
        await updateRoute(id!, data as any);
        toast.success('Ruta actualizada exitosamente');
        navigate(`/rutas/${id}/detalle`);
      } else {
        const newRoute = await addRoute(data as any);
        toast.success('Ruta creada. Ahora puedes armar el itinerario.');
        navigate(`/rutas/${newRoute.id}/itinerario`);
      }
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
          <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"><ArrowLeft size={20}/></button>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">{isEditing ? 'Editar Ruta' : 'Nueva Ruta'}</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <MapPin size={12} className="text-emerald-500" /> {isEditing ? 'Modifica los datos de la ruta' : 'Define los datos — luego arma el itinerario'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/rutas')} className="text-slate-500 font-black hover:text-white transition-all text-[10px] uppercase tracking-widest px-4">Descartar</button>
          <button type="submit" disabled={saving} className="btn-primary shadow-xl shadow-emerald-500/10 bg-gradient-to-r from-emerald-500 to-teal-600 px-10 disabled:opacity-50">
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 inline-block" />
            ) : (
              <Save size={18} className="mr-2 inline" />
            )}
            {saving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear y Armar Itinerario'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-8">

          {/* ══════ Información Básica ══════ */}
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><Map size={18}/></div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Información de la Ruta</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Comercial *</label>
                <input {...register('name', { required: 'El nombre es obligatorio', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })} className={`form-input w-full text-lg font-black ${errors.name ? 'border-rose-500' : ''}`} placeholder="Ej: Aventura en Vélez — 3 días de naturaleza" />
                {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Destino Principal *</label>
                  <input {...register('destination')} className="form-input w-full font-bold" placeholder="Ej: Vélez, Santander" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Duración (Días)</label>
                  <input type="number" {...register('duration_days', { valueAsNumber: true })} className="form-input w-full text-center font-black text-2xl" min={1} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dificultad</label>
                  <select {...register('difficulty')} className="form-input w-full font-bold">
                    <option value="">Sin especificar</option>
                    <option value="facil">🟢 Fácil</option>
                    <option value="moderado">🟡 Moderado</option>
                    <option value="dificil">🟠 Difícil</option>
                    <option value="extremo">🔴 Extremo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción Completa</label>
                <textarea {...register('description')} rows={4} className="form-input w-full resize-none leading-relaxed" placeholder="Descripción detallada de la experiencia, qué vivirá el viajero, paisajes, cultura..." />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Resumen Corto <span className="text-slate-700 normal-case">(para tarjetas y listados)</span></label>
                <input {...register('short_description')} className="form-input w-full" placeholder="Ej: Explora cascadas, fincas cafeteras y pueblos coloniales en el corazón de Santander" maxLength={200} />
              </div>
            </div>
          </div>

          {/* ══════ Highlights ══════ */}
          <div className="glass-card p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#A8442A]/10 text-[#A8442A] flex items-center justify-center"><Star size={18}/></div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Puntos Destacados</h2>
                <p className="text-[10px] text-slate-500 font-bold">Lo que hace especial esta ruta</p>
              </div>
            </div>
            <EditableList
              items={localHighlights}
              setItems={(items) => { setLocalHighlights(items); setValue('highlights', items); }}
              placeholder="Ej: Visita a cascada de 80m de altura"
              icon={<Star size={14} />}
              color="text-[#A8442A]"
            />
          </div>

          {/* ══════ Incluye / No Incluye ══════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-6 space-y-4 border-l-4 border-emerald-500/30">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <h3 className="text-lg font-black text-white">Incluye</h3>
              </div>
              <EditableList
                items={localIncluded}
                setItems={(items) => { setLocalIncluded(items); setValue('included', items); }}
                placeholder="Ej: Transporte ida y vuelta"
                icon={<CheckCircle2 size={12} />}
                color="text-emerald-500"
              />
            </div>

            <div className="glass-card p-6 space-y-4 border-l-4 border-rose-500/30">
              <div className="flex items-center gap-2">
                <XCircle size={18} className="text-rose-500" />
                <h3 className="text-lg font-black text-white">No Incluye</h3>
              </div>
              <EditableList
                items={localNotIncluded}
                setItems={(items) => { setLocalNotIncluded(items); setValue('not_included', items); }}
                placeholder="Ej: Seguro de viaje"
                icon={<XCircle size={12} />}
                color="text-rose-500"
              />
            </div>
          </div>

          {/* ══════ Galería de Imágenes ══════ */}
          <div className="glass-card p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D6A55C]/10 text-[#D6A55C] flex items-center justify-center"><Image size={18}/></div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Galería de Imágenes</h2>
                <p className="text-[10px] text-slate-500 font-bold">La primera imagen será la portada</p>
              </div>
            </div>

            <div className="space-y-3">
              {localImages.map((img, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border border-white/10 overflow-hidden shrink-0">
                    {img ? (
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700"><Image size={16}/></div>
                    )}
                  </div>
                  <input
                    value={img}
                    onChange={e => {
                      const next = [...localImages];
                      next[i] = e.target.value;
                      setLocalImages(next);
                      setValue('images', next);
                    }}
                    className="form-input flex-1 text-xs"
                    placeholder={i === 0 ? 'URL de imagen de portada...' : 'URL de imagen adicional...'}
                  />
                  <span className="text-[9px] font-black text-slate-700 uppercase shrink-0 w-12 text-center">
                    {i === 0 ? 'Cover' : `#${i + 1}`}
                  </span>
                  {localImages.length > 1 && (
                    <button type="button" onClick={() => {
                      const next = localImages.filter((_, idx) => idx !== i);
                      setLocalImages(next);
                      setValue('images', next);
                    }} className="opacity-0 group-hover:opacity-100 text-rose-500/60 hover:text-rose-500 transition-all p-1">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => {
                const next = [...localImages, ''];
                setLocalImages(next);
                setValue('images', next);
              }} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-all">
                <Plus size={12} /> Agregar imagen
              </button>
            </div>
          </div>

          {/* Next Steps Card (only on create) */}
          {!isEditing && (
            <div className="glass-card p-8 border-l-4 border-emerald-500/40">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Calendar size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white">Siguiente paso: Constructor de Itinerario</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Al crear la ruta serás redirigido al <strong className="text-emerald-400">Constructor de Itinerario</strong>,
                    donde podrás arrastrar productos y proveedores para armar el cronograma día por día.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══════ Sidebar (1 col) ══════ */}
        <div className="space-y-8">

          {/* Pricing */}
          <div className="glass-card p-6 bg-gradient-to-br from-[#D6A55C]/5 to-transparent space-y-6">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <CreditCard size={20} className="text-[#D6A55C]" /> Precio del Paquete
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Moneda</label>
                <select {...register('pricing.currency')} className="form-input w-full font-bold">
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="USD">USD - Dólar</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Precio por Persona</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-black">$</span>
                  <input type="number" step="1000" {...register('pricing.base_price_per_pax', { valueAsNumber: true })} className="form-input w-full pl-8 text-2xl font-black text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase">Mín. Pasajeros</label>
                  <input type="number" {...register('pricing.min_pax', { valueAsNumber: true })} className="form-input w-full text-center font-bold" min={1} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase">Máx. Pasajeros</label>
                  <input type="number" {...register('pricing.max_pax', { valueAsNumber: true })} className="form-input w-full text-center font-bold" min={0} placeholder="0 = sin límite" />
                </div>
              </div>
            </div>
          </div>

          {/* Servicios incluidos */}
          <div className="glass-card p-6 space-y-5">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-400" /> Servicios del Paquete
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                <input type="checkbox" {...register('pricing.includes_guide')} className="accent-emerald-400 w-4 h-4" />
                <Users size={16} className="text-[#D6A55C] shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">Guía turístico</p>
                  <p className="text-[10px] text-slate-500">Guía local incluido en el precio</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                <input type="checkbox" {...register('pricing.includes_transport')} className="accent-emerald-400 w-4 h-4" />
                <Bus size={16} className="text-[#D6A55C] shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">Transporte</p>
                  <p className="text-[10px] text-slate-500">Traslados incluidos en el paquete</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                <input type="checkbox" {...register('pricing.includes_meals')} className="accent-emerald-400 w-4 h-4" />
                <Utensils size={16} className="text-[#D6A55C] shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">Comidas</p>
                  <p className="text-[10px] text-slate-500">Alimentación incluida</p>
                </div>
              </label>
              {watchMeals && (
                <div className="pl-11 space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase">Plan de Comidas</label>
                  <select {...register('pricing.meal_plan')} className="form-input w-full font-bold text-sm">
                    <option value="sin_comidas">Sin comidas</option>
                    <option value="desayuno">Solo desayuno</option>
                    <option value="media_pension">Media pensión</option>
                    <option value="pension_completa">Pensión completa</option>
                    <option value="todo_incluido">Todo incluido</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Configuration */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Zap size={20} className="text-[#A8442A]" /> Configuración
            </h3>
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <label className="text-[10px] font-black text-slate-600 uppercase">Estado</label>
                <select {...register('status')} className="form-input w-full font-bold">
                  <option value="activo">Activo / Publicado</option>
                  <option value="pausado">Pausado / Borrador</option>
                  <option value="archivado">Archivado</option>
                </select>
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-[#A8442A]/5 transition-all">
                <input type="checkbox" {...register('is_featured')} className="accent-[#C84B2C] w-4 h-4" />
                <Star size={16} className="text-[#C84B2C] shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">Ruta Destacada</p>
                  <p className="text-[10px] text-slate-500">Aparece en la sección principal</p>
                </div>
              </label>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase">Etiquetas</label>
                <div className="flex flex-wrap gap-2">
                  {localTags.map((tag, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 group">
                      <input
                        value={tag}
                        onChange={e => {
                          const newTags = [...localTags];
                          newTags[i] = e.target.value;
                          setLocalTags(newTags);
                          setValue('tags', newTags);
                        }}
                        className="bg-transparent border-none text-[10px] font-bold text-slate-300 w-20 focus:ring-0 p-0"
                      />
                      <button type="button" onClick={() => {
                        const newTags = localTags.filter((_, idx) => idx !== i);
                        setLocalTags(newTags);
                        setValue('tags', newTags);
                      }} className="text-rose-500/50 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Plus size={10} className="rotate-45" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => {
                    const newTags = [...localTags, ''];
                    setLocalTags(newTags);
                    setValue('tags', newTags);
                  }} className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                    <Plus size={12} className="inline" /> Tag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
