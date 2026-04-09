import { createClient } from '@supabase/supabase-js';

// Usamos valores de marcador de posición si no hay variables de entorno.
// Esto evita que 'createClient' lance un error fatal durante el proceso de build de Vercel.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (supabaseUrl.includes('placeholder')) {
    console.warn('⚠️ Supabase: Usando valores de marcador de posición. Asegúrate de configurar las variables de entorno en Vercel.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
