import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import type { FieldSection, DynamicField } from '../../config/categoryFields';

interface DynamicFormSectionProps {
  sections: FieldSection[];
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  prefix?: string; // e.g. "extended_data"
}

function RenderField({ field, register, prefix }: {
  field: DynamicField;
  register: UseFormRegister<any>;
  watch?: UseFormWatch<any>;
  prefix: string;
}) {
  const fieldPath = `${prefix}.${field.name}`;
  const isFullWidth = field.fullWidth || field.type === 'textarea' || field.type === 'multi-select';

  return (
    <div className={`space-y-2 ${isFullWidth ? 'md:col-span-2 lg:col-span-3' : ''}`}>
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
        {field.label}
        {field.required && <span className="text-[#A8442A]">*</span>}
        {field.unit && <span className="text-slate-700 normal-case font-bold">({field.unit})</span>}
      </label>

      {field.type === 'text' && (
        <input
          type="text"
          {...register(fieldPath)}
          placeholder={field.placeholder}
          className="form-input w-full text-sm"
        />
      )}

      {field.type === 'url' && (
        <input
          type="url"
          {...register(fieldPath)}
          placeholder={field.placeholder || 'https://...'}
          className="form-input w-full text-sm font-mono"
        />
      )}

      {field.type === 'number' && (
        <input
          type="number"
          {...register(fieldPath, { valueAsNumber: true })}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          className="form-input w-full text-sm"
        />
      )}

      {field.type === 'time' && (
        <input
          type="time"
          {...register(fieldPath)}
          className="form-input w-full text-sm"
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          {...register(fieldPath)}
          placeholder={field.placeholder}
          rows={3}
          className="form-input w-full resize-none text-sm"
        />
      )}

      {field.type === 'select' && (
        <select {...register(fieldPath)} className="form-input w-full text-sm">
          <option value="">Seleccionar...</option>
          {field.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {field.type === 'checkbox' && (
        <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
          <input
            type="checkbox"
            {...register(fieldPath)}
            className="w-5 h-5 rounded border-white/10 bg-slate-800 text-[#A8442A] focus:ring-[#A8442A]/50 accent-[#A8442A]"
          />
          <span className="text-slate-300 text-sm font-bold">{field.label}</span>
        </label>
      )}

      {field.type === 'multi-select' && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {field.options?.map(opt => (
            <label key={opt} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/50 border border-white/5 cursor-pointer hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                value={opt}
                {...register(fieldPath)}
                className="w-4 h-4 rounded border-white/10 bg-slate-800 text-[#D6A55C] focus:ring-[#D6A55C]/50"
              />
              <span className="text-[11px] font-bold text-slate-300">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {field.type === 'color' && (
        <div className="flex gap-3 pt-1">
          {field.colorOptions?.map(opt => (
            <label key={opt.value} className="relative cursor-pointer group">
              <input
                type="radio"
                value={opt.value}
                {...register(fieldPath)}
                className="peer sr-only"
              />
              <div
                className="w-9 h-9 rounded-xl border-2 border-transparent peer-checked:border-white peer-checked:scale-110 transition-all shadow-lg"
                style={{ backgroundColor: opt.value }}
                title={opt.label}
              />
            </label>
          ))}
        </div>
      )}

      {field.helpText && (
        <p className="text-[10px] text-slate-600 font-medium italic ml-1">{field.helpText}</p>
      )}
    </div>
  );
}

export default function DynamicFormSection({ sections, register, watch, prefix = 'extended_data' }: DynamicFormSectionProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="space-y-8">
      {sections.map((section, idx) => (
        <div key={idx} className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <span className="text-base">{section.icon}</span>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">{section.title}</h3>
              {section.description && (
                <p className="text-[10px] text-slate-500 font-medium">{section.description}</p>
              )}
            </div>
          </div>

          <div className={`grid gap-5 ${
            section.columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            section.columns === 1 ? 'grid-cols-1' :
            'grid-cols-1 md:grid-cols-2'
          }`}>
            {section.fields.map(field => (
              <RenderField
                key={field.name}
                field={field}
                register={register}
                watch={watch}
                prefix={prefix}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
