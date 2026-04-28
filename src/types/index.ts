// ============================================================
// TIPOS BASE - Sol y Vida Turismo
// ============================================================

// ---- Enumeraciones / Literals ----

export type SupplierCategory =
  | 'hotel'
  | 'hostal'
  | 'lodge'
  | 'gastronomia'
  | 'comida_rapida'
  | 'finca_turistica'
  | 'agencia_transporte'
  | 'guia_turismo'
  | 'operadora'
  | 'otro';

export type ProductCategory =
  | 'alojamiento'
  | 'excursion'
  | 'transfer'
  | 'gastronomia'
  | 'comida_rapida'
  | 'actividad_aventura'
  | 'tour_cultural'
  | 'finca_turistica'
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

// ---- Modelo: Tag (etiqueta de perfil/audiencia — tabla tags) ----

export interface Tag {
  id: string;              // ej: 'parejas', 'aventura'
  label: string;
  emoji: string;
  group_id: string;        // ej: 'tipo_grupo', 'interes'
  group_label: string;
  group_color: string;     // ej: 'sky', 'violet'
  created_at?: string;
}

// ---- Modelo: RouteItem (item de itinerario — tabla route_items) ----

export interface RouteItem {
  id: string;
  route_id: string;
  product_id: string | null;
  day: number;
  item_order: number;
  time_start?: string;
  time_end?: string;
  notes?: string;
  is_optional: boolean;
  included_in_price: boolean;
  created_at?: string;
}

// ---- Modelo: ItineraryItem (legacy — para compatibilidad) ----

export interface ItineraryItem {
  id: string;
  ref_id: string;
  ref_type: 'supplier' | 'product';
  day: number;
  order: number;
  time_start?: string;
  time_end?: string;
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
  tags: Tag[];
  routeItems: RouteItem[];
  productTags: { product_id: string; tag_id: string }[];
}

// ---- Metadata de Categorías (para badges, colores, etc) ----

export interface CategoryMeta {
  label: string;
  color: 'sun' | 'sky' | 'emerald' | 'violet' | 'rose' | 'gray';
  icon: string;
}
