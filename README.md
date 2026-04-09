# Sol y Vida Turismo - Digital Inventory & Itinerary Management

Este es el repositorio oficial de la plataforma Sol y Vida Turismo.

## 🚀 Despliegue en Vercel

Este proyecto está optimizado para desplegarse en Vercel con las siguientes consideraciones:

### 1. Variables de Entorno
Debes configurar las siguientes variables en el panel de Vercel (Settings > Environment Variables):
- `VITE_SUPABASE_URL`: La URL de tu proyecto Supabase.
- `VITE_SUPABASE_ANON_KEY`: La clave anónima (anon key) de tu proyecto Supabase.

### 2. Configuración de TypeScript
El proyecto utiliza un `tsconfig.json` raíz que orquesta las configuraciones de la aplicación y de Node. Esto es crítico para que el compilador de Vercel (TSC) funcione correctamente.

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

---
Mantener este README actualizado con cualquier cambio significativo en la infraestructura.
