import React from 'react';
import { Compass, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description = 'Esta funcionalidad está actualmente bajo desarrollo como parte de la fase 2 del ecosistema Sol y Vida.' 
}) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-page-enter">
       <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 blur-[80px] rounded-full" />
          <div className="relative w-32 h-32 rounded-[40px] bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl">
             <Construction className="text-amber-500 animate-bounce" size={48} />
          </div>
       </div>
       <div className="space-y-4 max-w-md">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{title}</h1>
          <p className="text-slate-400 font-medium leading-relaxed">{description}</p>
       </div>
       <Link 
         to="/" 
         className="px-8 py-4 rounded-2xl bg-white/5 text-white font-black uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3"
       >
          <Compass size={16} /> Volver al Tablero
       </Link>
    </div>
  );
};
