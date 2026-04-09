import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value?: string | string[]; // Can be a single Base64 string or array
  onChange: (value: string | string[]) => void;
  maxFiles?: number;
  maxSizeKB?: number;
  description?: string;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  maxFiles = 1,
  maxSizeKB = 150,
  description
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Normalize to array for easier handling
  const existingImages = value
    ? (Array.isArray(value) ? value : [value])
    : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (existingImages.length + files.length > maxFiles) {
      setError(`Solo se permiten hasta ${maxFiles} imagen(es).`);
      return;
    }

    const validFiles = files.filter(f => {
      if (f.size > maxSizeKB * 1024) {
        setError(`El archivo ${f.name} excede el tamaño máximo de ${maxSizeKB}KB.`);
        return false;
      }
      return true;
    });

    Promise.all(validFiles.map(f => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(f);
      });
    })).then(base64Strings => {
      const newImages = [...existingImages, ...base64Strings];

      if (maxFiles === 1) {
        onChange(newImages[newImages.length - 1]); // keep only the last one for maxFiles=1
      } else {
        onChange(newImages);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  const removeImage = (index: number) => {
    if (maxFiles === 1) {
      onChange('');
    } else {
      const newArray = [...existingImages];
      newArray.splice(index, 1);
      onChange(newArray);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <div className="flex flex-wrap gap-4 items-start">
        {existingImages.map((imgBase64, idx) => (
          <div key={idx} className="relative group w-32 h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-sm flex items-center justify-center">
            {imgBase64 ? (
              <img src={imgBase64} alt="Preview" className="w-full h-full object-cover" />
            ) : null}
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {existingImages.length < maxFiles && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-xl border-2 border-dashed border-sky-300 dark:border-sky-700 hover:border-sky-500 bg-sky-50 dark:bg-sky-500/5 hover:bg-sky-100 dark:hover:bg-sky-500/10 transition-colors flex flex-col items-center justify-center gap-2 text-sky-600 dark:text-sky-400"
          >
            <Upload size={24} />
            <span className="text-[10px] font-bold px-2 text-center">Subir Imagen</span>
          </button>
        )}
      </div>

      {description && <p className="text-xs text-slate-500">{description}</p>}
      {error && <p className="text-xs text-red-500 animate-pulse">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        multiple={maxFiles > 1}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
