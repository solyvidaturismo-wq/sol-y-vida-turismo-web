import { useState } from 'react';
import {
  Settings,
  Database,
  Shield,
  Palette,
  Cloud,
  RefreshCcw,
  Trash2,
  Key,
  Package
} from 'lucide-react';
import { useAppStore, useSuppliers, useProducts, useRoutes } from '../store/useAppStore';
import { toast } from '../store/useToastStore';

function SettingsSection({ title, subtitle, icon: Icon, children }: any) {
  return (
    <div className="glass-card p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
       <div className="flex items-start gap-4 pb-6 border-b border-white/5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
             <Icon size={24} />
          </div>
          <div>
             <h2 className="text-xl font-black text-white uppercase tracking-tight">{title}</h2>
             <p className="text-sm font-medium text-slate-500">{subtitle}</p>
          </div>
       </div>
       <div className="space-y-6">
          {children}
       </div>
    </div>
  );
}

function ToggleRow({ label, desc, enabled, onToggle }: any) {
  return (
    <div className="flex items-center justify-between group">
       <div className="space-y-1">
          <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{label}</p>
          <p className="text-[11px] font-medium text-slate-500">{desc}</p>
       </div>
       <button
         onClick={onToggle}
         className={`w-12 h-6 rounded-full relative transition-all duration-300 border ${enabled ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800 border-white/10'}`}
       >
          <div className={`absolute top-1 h-3.5 w-3.5 rounded-full bg-white transition-all duration-300 ${enabled ? 'right-1' : 'left-1'}`} />
       </button>
    </div>
  );
}

export default function ConfiguracionPage() {
  const theme = useAppStore(s => s.theme);
  const toggleTheme = useAppStore(s => s.toggleTheme);
  const fetchData = useAppStore(s => s.fetchData);

  const suppliers = useSuppliers();
  const products = useProducts();
  const routes = useRoutes();

  const [syncAuto, setSyncAuto] = useState(true);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleReset = async () => {
    if (showConfirmReset) {
      await fetchData();
      setShowConfirmReset(false);
      toast.success('Sistema reiniciado correctamente');
    } else {
      setShowConfirmReset(true);
    }
  };

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      await fetchData();
      toast.success('Sincronización completada');
    } catch {
      toast.error('Error al sincronizar');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-10 animate-page-enter">
      {/* Header */}
      <div className="flex items-end gap-6 pb-2 border-b border-white/5">
         <div className="w-16 h-16 rounded-[28px] bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl">
            <Settings className="text-indigo-400 animate-spin-slow" size={32} />
         </div>
         <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">Panel de Control General</h1>
            <p className="text-slate-500 font-medium">Configura el comportamiento global, la sincronización y la identidad de Sol y Vida.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Settings (Left 2 cols) */}
         <div className="lg:col-span-2 space-y-10">

            <SettingsSection
              title="Apariencia y UI"
              subtitle="Personaliza el entorno visual de trabajo de tu dashboard."
              icon={Palette}
            >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ToggleRow
                    label="Modo Oscuro"
                    desc="Activa el diseño oscuro con efectos glassmorphism."
                    enabled={theme === 'dark'}
                    onToggle={toggleTheme}
                  />
                  <ToggleRow
                    label="Animaciones de Interfaz"
                    desc="Transiciones suaves entre páginas y elementos."
                    enabled={true}
                    onToggle={() => toast.info('Las animaciones están siempre activas en esta versión')}
                  />
               </div>
            </SettingsSection>

            <SettingsSection
              title="Sincronización Supabase"
              subtitle="Controla la persistencia de datos y el estado de la nube."
              icon={Database}
            >
               <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                           <Cloud size={20} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-white">Cloud Status: CONECTADO</p>
                           <p className="text-xs font-bold text-slate-500">Sincronización en tiempo real activa.</p>
                        </div>
                     </div>
                     <button
                       onClick={handleForceSync}
                       disabled={syncing}
                       className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50"
                     >
                        <RefreshCcw size={12} className={syncing ? 'animate-spin' : ''} /> Forzar Re-Sync
                     </button>
                  </div>

                  <div className="space-y-6">
                    <ToggleRow
                        label="Sincronización Automática"
                        desc="Guarda cambios en la nube instantáneamente al editar cualquier campo."
                        enabled={syncAuto}
                        onToggle={() => setSyncAuto(!syncAuto)}
                    />
                    <div className="p-6 rounded-3xl bg-slate-950/50 border border-white/5 space-y-4">
                       <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest">
                          <Key size={16} className="text-indigo-400" /> API Keys de Producción
                       </div>
                       <div className="space-y-2">
                          <input type="password" value="sb_p_***********************" readOnly className="form-input w-full text-xs font-mono opacity-50 select-none bg-slate-900 border-white/5" />
                          <p className="text-[10px] text-slate-600 font-bold italic">Las credenciales se gestionan vía variables de entorno (.env)</p>
                       </div>
                    </div>
                  </div>
               </div>
            </SettingsSection>

            <SettingsSection
              title="Gestión de Datos Críticos"
              subtitle="Operaciones de mantenimiento y limpieza del sistema."
              icon={Shield}
            >
               <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 flex items-center gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                     <Trash2 size={24} />
                  </div>
                  <div className="flex-1">
                     <h4 className="text-sm font-black text-white uppercase tracking-tight">Reiniciar Sistema a Fábrica</h4>
                     <p className="text-xs font-medium text-slate-500 max-w-md">Esta acción eliminará todos los proveedores, productos y rutas cargadas localmente. <span className="text-rose-400 font-bold">No afecta a la base de datos de producción.</span></p>
                  </div>
                  <button
                    onClick={handleReset}
                    className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${showConfirmReset ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20' : 'bg-white/5 text-rose-500 hover:bg-rose-500 hover:text-white'}`}
                  >
                    {showConfirmReset ? 'CONFIRMAR BORRADO' : 'REINICIAR TODO'}
                  </button>
               </div>
            </SettingsSection>

         </div>

         {/* Sidebar Stats (Right 1 col) */}
         <div className="space-y-8">
            <div className="glass-card p-8 space-y-6">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Inventario Actual</p>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                     <span className="text-xs font-bold text-slate-400">Proveedores</span>
                     <span className="text-sm font-black text-white">{suppliers.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                     <span className="text-xs font-bold text-slate-400">Productos</span>
                     <span className="text-sm font-black text-white">{products.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                     <span className="text-xs font-bold text-slate-400">Rutas</span>
                     <span className="text-sm font-black text-white">{routes.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                     <span className="text-xs font-bold text-slate-400">Reservas Totales</span>
                     <span className="text-sm font-black text-emerald-400">{routes.reduce((a, r) => a + r.booking_count, 0)}</span>
                  </div>
               </div>
            </div>

            <div className="glass-card p-8 space-y-4">
               <div className="flex items-center gap-3">
                  <Package size={20} className="text-indigo-400" />
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Versión de la App</h4>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500 font-bold">Frontend</span>
                     <span className="text-white font-black">v1.2.0</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500 font-bold">Backend</span>
                     <span className="text-white font-black">Supabase</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500 font-bold">Tema</span>
                     <span className="text-white font-black capitalize">{theme}</span>
                  </div>
               </div>
            </div>

            <div className="text-center">
               <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Propiedad de Sol y Vida</p>
               <p className="text-[9px] text-slate-800 mt-1">SST-2024-CUS-00192</p>
            </div>
         </div>
      </div>
    </div>
  );
}
