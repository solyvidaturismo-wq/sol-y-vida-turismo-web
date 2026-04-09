import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value = [], onChange, max = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Simulated cloud upload - in reality this would go to Supabase Storage
    const newUrls = Array.from(files).map((_, i) => `https://images.unsplash.com/photo-${1600000000000 + Date.now() + i}?auto=format&fit=crop&q=80&w=800`);
    onChange([...value, ...newUrls].slice(0, max));
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-2xl bg-slate-800 overflow-hidden border border-white/10 group">
             <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt={`Upload ${index}`} />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 rounded-full bg-rose-500 text-white hover:scale-110 transition-transform shadow-xl"
                >
                   <X size={16} />
                </button>
             </div>
          </div>
        ))}

        {value.length < max && (
          <label className={`
            aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all gap-2
            ${isDragging ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-900 border-white/5 hover:border-white/20 hover:bg-white/5'}
          `}>
             <input 
               type="file" 
               multiple 
               accept="image/*" 
               onChange={handleSimulatedUpload}
               className="sr-only"
               onDragOver={() => setIsDragging(true)}
               onDragLeave={() => setIsDragging(false)}
             />
             <div className="p-3 rounded-full bg-slate-800 text-slate-500">
                <Plus size={20} />
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subir Imagen</p>
                <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">MAX {max}</p>
             </div>
          </label>
        )}
      </div>

      {value.length === 0 && (
         <div className="p-12 rounded-[40px] bg-slate-900 border border-white/5 border-dashed flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-[28px] bg-slate-800 flex items-center justify-center text-slate-600 mb-4">
               <ImageIcon size={32} />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">Galería de Imágenes</h4>
            <p className="text-xs text-slate-500 font-medium max-w-[200px]">Sube fotos de alta resolución para mejorar el impacto visual del producto.</p>
         </div>
      )}
    </div>
  );
};
