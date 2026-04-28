import { useMemo } from 'react';
import { useProducts } from '../store/useAppStore';
import {
  Layers,
  ChevronRight,
  Package,
  Activity,
  Zap,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCT_CATEGORY_META } from '../config/categoryFields';

export default function CategoriasPage() {
  const products = useProducts();

  // Metrics by category
  const categoriesData = useMemo(() => {
    return Object.entries(PRODUCT_CATEGORY_META).map(([key, meta]) => {
      const items = products.filter(p => p.category === key);
      const uniqueSuppliers = new Set(items.map(p => p.supplier_id)).size;
      const avgPrice = Math.round(items.reduce((acc, p) => acc + p.base_price, 0) / (items.length || 1));
      const avgRating = (items.reduce((acc, p) => acc + ((p as any).rating || 0), 0) / (items.length || 1)).toFixed(1);

      return {
        key,
        label: meta.label,
        emoji: meta.emoji,
        count: items.length,
        uniqueSuppliers,
        avgPrice,
        avgRating,
        color: key === 'hotel' ? '#fbbf24' : key === 'excursion' ? '#38bdf8' : key === 'transporte' ? '#f43f5e' : '#10b981'
      };
    }).sort((a, b) => b.count - a.count);
  }, [products]);

  return (
    <div className="space-y-10 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
         <div>
            <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
               <Layers className="text-[#A8442A]" size={36} /> Directorio de Categorías
            </h1>
            <p className="text-slate-400 font-medium max-w-xl">Análisis estructural del inventario por tipo de servicio y especialización.</p>
         </div>
         <Link to="/productos/nuevo" className="btn-primary flex items-center gap-2 px-8">
            <Package size={18} /> Nueva Categoría
         </Link>
      </div>

      {/* Categories Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {categoriesData.map(cat => (
           <div key={cat.key} className="glass-card p-8 group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
              <div 
                className="absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.05] group-hover:opacity-[0.1] transition-all"
                style={{ color: cat.color }}
              >
                <Layers size={96} />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-3xl border border-white/10 group-hover:rotate-12 transition-transform">
                       {cat.emoji}
                    </div>
                    <span className="text-[10px] font-black bg-white/5 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest border border-white/5">
                       {cat.count} Items
                    </span>
                 </div>
                 <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{cat.label}</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Partners</span>
                       <span className="text-sm font-black text-white">{cat.uniqueSuppliers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">P. Promedio</span>
                       <span className="text-sm font-black text-[#D6A55C]">$ {cat.avgPrice}</span>
                    </div>
                 </div>
                 <Link 
                   to={`/explorar?category=${cat.key}`}
                   className="mt-8 flex items-center justify-center w-full py-2.5 rounded-xl bg-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-[#A8442A] hover:text-slate-900 transition-all gap-2"
                 >
                    Ver Inventario <ChevronRight size={14} />
                 </Link>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Detailed Table of Relationships */}
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-white px-2 flex items-center gap-3">
               <Activity className="text-[#A8442A]" /> Matriz de Clasificación
            </h2>
            <div className="glass-card overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[9px] text-slate-600 font-black">
                        <th className="px-8 py-4">Descriptor</th>
                        <th className="px-8 py-4">Total Productos</th>
                        <th className="px-8 py-4">Health Score</th>
                        <th className="px-12 py-4 text-right">Rating Promedio</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {categoriesData.map(cat => (
                       <tr key={cat.key} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl border border-white/5">
                                   {cat.emoji}
                                </div>
                                <div>
                                   <p className="text-sm font-black text-white uppercase tracking-tight">{cat.label}</p>
                                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Key ID: {cat.key}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm font-black text-white">{cat.count}</span>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                   <div className="h-full bg-emerald-500" style={{ width: `${cat.count * 10}%` }} />
                                </div>
                                <span className="text-[10px] font-black text-slate-500">GOOD</span>
                             </div>
                          </td>
                          <td className="px-12 py-5 text-right">
                             <div className="flex items-center justify-end gap-1.5 text-[#A8442A] font-black text-sm">
                                <Star size={14} fill="currentColor" /> {cat.avgRating}
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Recommendation & Insights */}
         <div className="space-y-6">
            <h2 className="text-2xl font-black text-white px-2">Insights de Negocio</h2>
            
            <div className="glass-card p-8 bg-[#A8442A]/5 border-[#A8442A]/20 relative overflow-hidden group">
               <Zap size={60} className="absolute -right-4 -bottom-4 text-[#A8442A]/10 group-hover:scale-125 transition-transform" />
               <h4 className="text-lg font-black text-white mb-4">Oportunidad de Expansión</h4>
               <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                 Basado en la densidad actual de categorías, tu inventario de <span className="text-[#A8442A] font-black">Restauración</span> es el más bajo. Considera agregar 3-5 partners gastronómicos en Cuzco para equilibrar tus rutas.
               </p>
               <div className="p-4 rounded-3xl bg-slate-950/50 border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-[10px] font-black text-slate-500 uppercase">GAP ANALYTICS</span>
                     <span className="text-xs font-black text-[#A8442A]">-24%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                     <div className="h-full bg-[#A8442A]" style={{ width: '76%' }} />
                  </div>
               </div>
            </div>

            <div className="glass-card p-8">
               <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-500" /> Reglas de Categoría
               </h4>
               <ul className="space-y-4">
                  {[
                    { title: 'Hotelería', desc: 'Requiere check-in/out dinámico y tipos de habitación.' },
                    { title: 'Tours', desc: 'Requiere itinerario detallado por horas.' },
                    { title: 'Logística', desc: 'Requiere capacidad máxima de pasajeros.' },
                  ].map((rule, i) => (
                    <li key={i} className="space-y-1">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{rule.title}</p>
                       <p className="text-xs text-slate-500 font-medium">{rule.desc}</p>
                    </li>
                  ))}
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
}
