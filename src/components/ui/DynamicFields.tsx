import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PRODUCT_CATEGORY_META, ColorOption } from '../../config/categoryFields';

interface DynamicFieldsProps {
  category: string;
}

export const DynamicFields: React.FC<DynamicFieldsProps> = ({ category }) => {
  const { register, watch, formState: { errors } } = useFormContext();
  const meta = PRODUCT_CATEGORY_META[category] || { fields: [] };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {meta.fields.map((field) => {
        const error = errors[field.name];
        
        return (
          <div key={field.name} className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
              {field.label} {field.required && <span className="text-amber-500">*</span>}
            </label>

            {field.type === 'text' && (
              <input
                type="text"
                {...register(field.name, { required: field.required })}
                placeholder={field.placeholder}
                className={`form-input w-full ${error ? 'border-rose-500' : ''}`}
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                step="0.01"
                {...register(field.name, { required: field.required, valueAsNumber: true })}
                placeholder={field.placeholder}
                className={`form-input w-full ${error ? 'border-rose-500' : ''}`}
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                {...register(field.name, { required: field.required })}
                placeholder={field.placeholder}
                rows={4}
                className={`form-input w-full resize-none ${error ? 'border-rose-500' : ''}`}
              />
            )}

            {field.type === 'select' && (
              <select
                {...register(field.name, { required: field.required })}
                className={`form-input w-full ${error ? 'border-rose-500' : ''}`}
              >
                <option value="">Seleccionar...</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {field.type === 'color' && (
              <div className="flex gap-3 pt-1">
                {field.colorOptions?.map((opt: ColorOption) => (
                  <label key={opt.value} className="relative cursor-pointer group">
                    <input
                      type="radio"
                      value={opt.value}
                      {...register(field.name, { required: field.required })}
                      className="peer sr-only"
                    />
                    <div 
                      className="w-10 h-10 rounded-xl border-2 border-transparent peer-checked:border-white peer-checked:scale-110 transition-all shadow-lg"
                      style={{ backgroundColor: opt.value }}
                      title={opt.label}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-[8px] font-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {opt.label}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {field.type === 'multi-select' && (
               <div className="grid grid-cols-2 gap-2">
                  {field.options?.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-white/5 cursor-pointer hover:bg-slate-800 transition-colors">
                       <input 
                         type="checkbox" 
                         value={opt}
                         {...register(field.name)}
                         className="w-4 h-4 rounded border-white/10 bg-slate-800 text-amber-500 focus:ring-amber-500/50" 
                       />
                       <span className="text-xs font-bold text-slate-300">{opt}</span>
                    </label>
                  ))}
               </div>
            )}

            {error && <p className="text-[10px] font-black text-rose-500 uppercase px-1 mt-1">Este campo es requerido</p>}
          </div>
        );
      })}
    </div>
  );
};
