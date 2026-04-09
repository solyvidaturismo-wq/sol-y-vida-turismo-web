import { Link } from 'react-router-dom';
import { 
  Compass, 
  Map, 
  ArrowLeft, 
  Search, 
  AlertCircle,
  Home,
  MessageSquare,
  Globe
} from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center animate-page-enter">
      {/* Visual Glitch Element */}
      <div className="relative mb-12">
        <div className="absolute inset-0 blur-3xl bg-amber-500/10 rounded-full animate-pulse" />
        <div className="relative text-[180px] font-black text-white/5 leading-none select-none tracking-tighter">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-[40px] bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500 group">
             <Compass size={64} className="text-amber-500 animate-spin-slow" />
          </div>
        </div>
      </div>

      <div className="text-center space-y-4 max-w-lg px-6">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
          Ruta Perdida
        </h1>
        <p className="text-slate-400 font-medium text-lg leading-relaxed">
          Incluso en los mejores viajes hay desvíos inesperados. La página que buscas no existe o ha sido movida.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
           <Link 
             to="/" 
             className="flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-amber-500 text-slate-900 font-black uppercase text-xs tracking-widest shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
           >
             <Home size={18} /> Panel Principal
           </Link>
           <Link 
             to="/explorar" 
             className="flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-white/5 text-white font-black uppercase text-xs tracking-widest border border-white/10 hover:bg-white/10 transition-all"
           >
             <Search size={18} /> Explorar Catálogo
           </Link>
        </div>

        <div className="pt-12 flex items-center justify-center gap-8 border-t border-white/5 mt-12">
           <div className="text-center group cursor-pointer">
              <Globe size={20} className="mx-auto text-slate-600 group-hover:text-amber-500 mb-2 transition-colors" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">Volver al Sitio</p>
           </div>
           <div className="text-center group cursor-pointer">
              <MessageSquare size={20} className="mx-auto text-slate-600 group-hover:text-amber-500 mb-2 transition-colors" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">Soporte TI</p>
           </div>
           <div className="text-center group cursor-pointer" onClick={() => window.history.back()}>
              <ArrowLeft size={20} className="mx-auto text-slate-600 group-hover:text-amber-500 mb-2 transition-colors" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">Página Anterior</p>
           </div>
        </div>
      </div>

      {/* Background Micro Details */}
      <div className="fixed bottom-10 left-10 flex gap-4 pointer-events-none opacity-20">
         <div className="w-1 h-12 bg-amber-500 rounded-full" />
         <div className="w-1 h-32 bg-slate-800 rounded-full mt-4" />
         <div className="w-1 h-16 bg-white rounded-full mt-8" />
      </div>
    </div>
  );
}
