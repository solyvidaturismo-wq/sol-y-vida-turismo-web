// ============================================================
// TIPOS BASE - Sol y Vida Turismo
// ============================================================

// ---- Enumeraciones / Literals ----

export type SupplierCategory =
  | 'hotel'
  | 'hostal'
  | 'lodge'
  | 'gastronomia'
  | 'agencia_transporte'
  | 'guia_turismo'
  | 'operadora'
  | 'otro';

export type ProductCategory =
  | 'alojamiento'
  | 'excursion'
  | 'transfer'
  | 'gastronomia'
  | 'actividad_aventura'
  | 'tour_cultural'
  | 'paquete_combo'
  | 'libre';

export type RouteStatus = 'borrador' | 'activo' | 'pausado' | 'archivado';

export type ProductStatus = 'activo' | 'inactivo' | 'agotado';

export type SupplierStatus = 'activo' | 'inactivo' | 'pendiente';

export type DifficultyLevel = 'facil' | 'moderado' | 'dificil' | 'extremo';

export type MealPlan = 'sin_comidas' | 'desayuno' | 'media_pension' | 'pension_completa' | 'todo_incluido';

// ---- Modelo: Supplier (Proveedor) ----

export interface SupplierContact {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
}

export interface SupplierLocation {
  country: string;
  region: string;
  city: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface Supplier {
  id: string;
  name: string;
  category: SupplierCategory;
  status: SupplierStatus;
  contact: SupplierContact;
  location: SupplierLocation;
  logo?: string;
  banner_image?: string;
  ruc?: string;            // RUC / NIT fiscal
  rating: number;          // 1-5
  contract_expiry?: string; // ISO date
  commission_pct: number;   // 0-100
  notes?: string;
  tags: string[];
  custom_fields: Record<string, any>; // Campos dinámicos según categoría
  created_at: string;
  updated_at: string;
}

// ---- Modelo: Product (Producto) ----

export interface PriceTier {
  label: string;           // ej. "Adulto", "Niño", "Senior"
  price: number;
  currency: string;
}

export interface ProductAvailability {
  days_of_week: number[];  // 0=Dom ... 6=Sab
  start_time?: string;     // "09:00"
  end_time?: string;       // "18:00"
  max_capacity?: number;
  min_pax?: number;
}

export interface ProductActivityItinerary {
  time: string;     // e.g. "08:00"
  activity: string; // e.g. "Salida del hotel"
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  status: ProductStatus;
  supplier_id: string | null; // null = producto huérfano (ej. caminata libre)
  description: string;
  short_description?: string;
  price_tiers: PriceTier[];
  base_price: number;          // precio de referencia
  currency: string;
  duration_minutes?: number;   // duración en minutos
  availability: ProductAvailability;
  images: string[];            // URLs
  banner_image?: string;
  tags: string[];
  is_featured: boolean;
  payment_methods?: string[];
  recommendations?: string;
  safety_protocols?: string;
  activity_itinerary?: ProductActivityItinerary[]; // Opcional para cualquier categoría que lo requiera
  custom_fields: Record<string, any>; // Campos dinámicos según categoría
  created_at: string;
  updated_at: string;
}

// ---- Modelo: ItineraryItem (elemento de ruta) ----

export interface ItineraryItem {
  id: string;              // UUID único dentro de la ruta
  ref_id: string;          // ID del Supplier o Product referenciado
  ref_type: 'supplier' | 'product';
  day: number;             // Día del itinerario (1, 2, 3...)
  order: number;           // Orden dentro del día
  time_start?: string;     // "09:00"
  time_end?: string;       // "12:00"
  notes?: string;
  is_optional: boolean;
  included_in_price: boolean;
}

// ---- Modelo: Route (Ruta Turística) ----

export interface RoutePricing {
  base_price_per_pax: number;
  currency: string;
  min_pax: number;
  max_pax?: number;
  includes_guide: boolean;
  includes_transport: boolean;
  includes_meals: boolean;
  meal_plan?: MealPlan;
}

export interface Route {
  id: string;
  name: string;
  slug: string;
  status: RouteStatus;
  description: string;
  short_description?: string;
  duration_days: number;
  itinerary: ItineraryItem[];
  pricing: RoutePricing;
  difficulty?: DifficultyLevel;
  destination: string;
  highlights: string[];
  included: string[];
  not_included: string[];
  images: string[];
  tags: string[];
  is_featured: boolean;
  view_count: number;
  booking_count: number;
  created_at: string;
  updated_at: string;
}

// ---- Tipos de UI ----

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'range';
  placeholder?: string;
  options?: SelectOption[];
  min?: number;
  max?: number;
  required?: boolean;
  unit?: string;
  helpText?: string;
}

// Mapeo de categoría → campos dinámicos del formulario
export type CategoryFieldsMap = Record<string, FieldConfig[]>;

// ---- Tipos del Store ----

export interface AppState {
  suppliers: Supplier[];
  products: Product[];
  routes: Route[];
}

// ---- Metadata de Categorías (para badges, colores, etc) ----

export interface CategoryMeta {
  label: string;
  color: 'sun' | 'sky' | 'emerald' | 'violet' | 'rose' | 'gray';
  icon: string;
}
