// ============================================================
// CONFIG DE CAMPOS DINÁMICOS POR CATEGORÍA
// Motor de formularios adaptables - Sol y Vida Turismo
// ============================================================

import type { CategoryFieldsMap } from '../types';

// ---- Tipos del sistema dinámico ----

export interface ColorOption {
  value: string;
  label: string;
}

export interface DynamicField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'multi-select' | 'color' | 'time' | 'url';
  options?: string[];
  colorOptions?: ColorOption[];
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  min?: number;
  max?: number;
  unit?: string;
  fullWidth?: boolean;
}

export interface FieldSection {
  title: string;
  icon: string;
  description?: string;
  columns?: 1 | 2 | 3;
  fields: DynamicField[];
}

export interface CategoryConfig {
  emoji: string;
  label: string;
  color: string;
  description: string;
  sections: FieldSection[];
}

// ============================================================
// PROVEEDORES - META + CAMPOS DINÁMICOS POR SECCIÓN
// ============================================================

export const SUPPLIER_CATEGORY_META: Record<string, { emoji: string; label: string }> = {
  hotel: { emoji: '🏨', label: 'Hotel' },
  hostal: { emoji: '🛏️', label: 'Hostal' },
  lodge: { emoji: '🏡', label: 'Lodge / Eco-Lodge' },
  gastronomia: { emoji: '🍽️', label: 'Gastronomía' },
  comida_rapida: { emoji: '🍔', label: 'Restaurante Comida Rápida' },
  agencia_transporte: { emoji: '🚐', label: 'Agencia de Transporte' },
  guia_turismo: { emoji: '🧭', label: 'Guía de Turismo' },
  finca_turistica: { emoji: '🌾', label: 'Finca Turística' },
  operadora: { emoji: '🏢', label: 'Operadora Turística' },
  otro: { emoji: '📦', label: 'Otro' },
};

export const SUPPLIER_CATEGORIES: Record<string, CategoryConfig> = {
  hotel: {
    emoji: '🏨',
    label: 'Hotel',
    color: 'amber',
    description: 'Establecimientos de hospedaje con servicios completos',
    sections: [
      {
        title: 'Clasificación',
        icon: '⭐',
        columns: 2,
        fields: [
          { name: 'stars', label: 'Categoría de estrellas', type: 'select', options: ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas'], required: true },
          { name: 'hotel_type', label: 'Tipo de hotel', type: 'select', options: ['Boutique', 'Resort', 'Business', 'Heritage / Colonial', 'Apart-Hotel', 'Cadena Internacional', 'Hotel Rural'] },
          { name: 'total_rooms', label: 'Total de habitaciones', type: 'number', min: 1, placeholder: 'Ej: 45' },
          { name: 'total_floors', label: 'Número de pisos', type: 'number', min: 1, placeholder: 'Ej: 4' },
        ]
      },
      {
        title: 'Tipos de Habitación',
        icon: '🛏️',
        description: 'Selecciona los tipos disponibles',
        columns: 3,
        fields: [
          { name: 'has_single', label: 'Individual / Single', type: 'checkbox' },
          { name: 'has_double', label: 'Doble / Matrimonial', type: 'checkbox' },
          { name: 'has_twin', label: 'Twin (2 camas)', type: 'checkbox' },
          { name: 'has_triple', label: 'Triple', type: 'checkbox' },
          { name: 'has_suite', label: 'Suite', type: 'checkbox' },
          { name: 'has_family', label: 'Familiar', type: 'checkbox' },
          { name: 'has_presidential', label: 'Presidencial', type: 'checkbox' },
          { name: 'has_accessible', label: 'Accesible (PMR)', type: 'checkbox' },
        ]
      },
      {
        title: 'Amenities del Hotel',
        icon: '✨',
        description: 'Servicios e instalaciones generales',
        columns: 3,
        fields: [
          { name: 'has_pool', label: 'Piscina', type: 'checkbox' },
          { name: 'has_spa', label: 'Spa / Jacuzzi', type: 'checkbox' },
          { name: 'has_gym', label: 'Gimnasio', type: 'checkbox' },
          { name: 'has_restaurant', label: 'Restaurante', type: 'checkbox' },
          { name: 'has_bar', label: 'Bar / Lounge', type: 'checkbox' },
          { name: 'has_room_service', label: 'Room Service', type: 'checkbox' },
          { name: 'has_parking', label: 'Estacionamiento', type: 'checkbox' },
          { name: 'has_wifi', label: 'WiFi gratuito', type: 'checkbox' },
          { name: 'has_laundry', label: 'Lavandería', type: 'checkbox' },
          { name: 'has_concierge', label: 'Concierge', type: 'checkbox' },
          { name: 'has_business_center', label: 'Centro de negocios', type: 'checkbox' },
          { name: 'has_kids_area', label: 'Área infantil', type: 'checkbox' },
          { name: 'has_garden', label: 'Jardín / Terraza', type: 'checkbox' },
          { name: 'has_fireplace', label: 'Chimenea', type: 'checkbox' },
          { name: 'has_elevator', label: 'Ascensor', type: 'checkbox' },
        ]
      },
      {
        title: 'Operación',
        icon: '⏰',
        columns: 2,
        fields: [
          { name: 'checkin_time', label: 'Hora de Check-in', type: 'time', placeholder: '14:00' },
          { name: 'checkout_time', label: 'Hora de Check-out', type: 'time', placeholder: '12:00' },
          { name: 'breakfast_included', label: '¿Desayuno incluido?', type: 'checkbox' },
          { name: 'accepts_pets', label: '¿Acepta mascotas?', type: 'checkbox' },
          { name: 'cancellation_policy', label: 'Política de cancelación', type: 'select', options: ['Flexible (24h)', 'Moderada (48h)', 'Estricta (7 días)', 'No reembolsable'] },
          { name: 'payment_methods', label: 'Métodos de pago', type: 'multi-select', options: ['Efectivo', 'Visa', 'Mastercard', 'Transferencia', 'PayPal', 'Crypto'] },
        ]
      },
    ]
  },

  hostal: {
    emoji: '🛏️',
    label: 'Hostal',
    color: 'sky',
    description: 'Alojamiento económico y social para viajeros',
    sections: [
      {
        title: 'Información General',
        icon: '📋',
        columns: 2,
        fields: [
          { name: 'hostal_type', label: 'Tipo de hostal', type: 'select', options: ['Backpacker', 'Party Hostel', 'Boutique Hostel', 'Hostal Familiar', 'Eco Hostal'], required: true },
          { name: 'total_beds', label: 'Total de camas', type: 'number', min: 1, placeholder: 'Ej: 40' },
          { name: 'total_dorms', label: 'Dormitorios compartidos', type: 'number', placeholder: 'Ej: 6' },
          { name: 'total_private', label: 'Habitaciones privadas', type: 'number', placeholder: 'Ej: 4' },
          { name: 'vibe', label: 'Ambiente / Vibe', type: 'select', options: ['Mochilero aventurero', 'Social / Fiestero', 'Tranquilo / Zen', 'Cultural / Artístico', 'Familiar'] },
        ]
      },
      {
        title: 'Servicios',
        icon: '🎒',
        columns: 3,
        fields: [
          { name: 'has_shared_kitchen', label: 'Cocina compartida', type: 'checkbox' },
          { name: 'has_lockers', label: 'Lockers seguros', type: 'checkbox' },
          { name: 'has_laundry', label: 'Lavandería', type: 'checkbox' },
          { name: 'has_wifi', label: 'WiFi gratuito', type: 'checkbox' },
          { name: 'has_common_area', label: 'Sala común / TV', type: 'checkbox' },
          { name: 'has_rooftop', label: 'Rooftop / Terraza', type: 'checkbox' },
          { name: 'has_bar', label: 'Bar interno', type: 'checkbox' },
          { name: 'has_breakfast', label: 'Desayuno incluido', type: 'checkbox' },
          { name: 'has_tour_desk', label: 'Mesa de tours', type: 'checkbox' },
          { name: 'has_bike_rental', label: 'Alquiler de bicicletas', type: 'checkbox' },
          { name: 'has_game_room', label: 'Sala de juegos', type: 'checkbox' },
          { name: 'has_coworking', label: 'Espacio coworking', type: 'checkbox' },
        ]
      },
      {
        title: 'Actividades',
        icon: '🎉',
        columns: 2,
        fields: [
          { name: 'has_pub_crawl', label: '¿Organiza pub crawls?', type: 'checkbox' },
          { name: 'has_walking_tours', label: '¿Walking tours gratuitos?', type: 'checkbox' },
          { name: 'has_cooking_class', label: '¿Clases de cocina?', type: 'checkbox' },
          { name: 'has_movie_nights', label: '¿Noches de película?', type: 'checkbox' },
          { name: 'activities_description', label: 'Descripción de actividades', type: 'textarea', placeholder: 'Describe las actividades sociales que organiza el hostal...', fullWidth: true },
        ]
      },
    ]
  },

  lodge: {
    emoji: '🏡',
    label: 'Lodge / Eco-Lodge',
    color: 'emerald',
    description: 'Alojamiento en naturaleza con enfoque ecológico',
    sections: [
      {
        title: 'Tipo y Capacidad',
        icon: '🌿',
        columns: 2,
        fields: [
          { name: 'lodge_type', label: 'Tipo de lodge', type: 'select', options: ['Eco-Lodge', 'Lodge de Montaña', 'Lodge Amazónico', 'Glamping', 'Bungalows', 'Treehouse Lodge', 'Lodge Lacustre'], required: true },
          { name: 'total_cabins', label: 'Total de cabañas / unidades', type: 'number', min: 1, placeholder: 'Ej: 12' },
          { name: 'max_guests', label: 'Capacidad máxima de huéspedes', type: 'number', placeholder: 'Ej: 30' },
          { name: 'surrounding_nature', label: 'Entorno natural', type: 'select', options: ['Selva amazónica', 'Montaña / Andes', 'Lago / Laguna', 'Bosque nublado', 'Desierto', 'Costa / Playa', 'Valle'] },
        ]
      },
      {
        title: 'Sostenibilidad',
        icon: '♻️',
        description: 'Prácticas ecológicas y certificaciones',
        columns: 3,
        fields: [
          { name: 'is_off_grid', label: 'Off-grid (sin red eléctrica)', type: 'checkbox' },
          { name: 'has_solar_energy', label: 'Energía solar', type: 'checkbox' },
          { name: 'has_water_recycling', label: 'Reciclaje de agua', type: 'checkbox' },
          { name: 'has_organic_garden', label: 'Huerto orgánico', type: 'checkbox' },
          { name: 'has_composting', label: 'Compostaje', type: 'checkbox' },
          { name: 'zero_plastic', label: 'Zero plástico', type: 'checkbox' },
          { name: 'eco_certifications', label: 'Certificaciones eco', type: 'text', placeholder: 'Ej: Rainforest Alliance, Green Globe', fullWidth: true },
        ]
      },
      {
        title: 'Experiencias',
        icon: '🦜',
        columns: 3,
        fields: [
          { name: 'has_birdwatching', label: 'Avistamiento de aves', type: 'checkbox' },
          { name: 'has_night_walks', label: 'Caminatas nocturnas', type: 'checkbox' },
          { name: 'has_canopy', label: 'Canopy / Zip-line', type: 'checkbox' },
          { name: 'has_kayak', label: 'Kayak / Canoa', type: 'checkbox' },
          { name: 'has_fishing', label: 'Pesca deportiva', type: 'checkbox' },
          { name: 'has_indigenous_visits', label: 'Visitas a comunidades', type: 'checkbox' },
          { name: 'has_hot_water', label: 'Agua caliente', type: 'checkbox' },
          { name: 'has_electricity', label: 'Electricidad 24h', type: 'checkbox' },
          { name: 'has_wifi', label: 'WiFi (limitado)', type: 'checkbox' },
        ]
      },
    ]
  },

  gastronomia: {
    emoji: '🍽️',
    label: 'Gastronomía',
    color: 'rose',
    description: 'Restaurantes, cafeterías y experiencias culinarias',
    sections: [
      {
        title: 'Tipo de Establecimiento',
        icon: '🏪',
        columns: 2,
        fields: [
          { name: 'establishment_type', label: 'Tipo', type: 'select', options: ['Restaurante', 'Cafetería', 'Bar / Pub', 'Cevichería', 'Picantería', 'Food Truck', 'Mercado gastronómico', 'Panadería / Pastelería', 'Heladería'], required: true },
          { name: 'cuisine_type', label: 'Tipo de cocina principal', type: 'select', options: ['Peruana tradicional', 'Novo-andina', 'Criolla', 'Fusión', 'Italiana', 'Japonesa / Nikkei', 'China / Chifa', 'Internacional', 'Vegetariana / Vegana', 'Parrilla'], required: true },
          { name: 'price_range', label: 'Rango de precios', type: 'select', options: ['$ Económico (< S/.30)', '$$ Medio (S/.30-70)', '$$$ Alto (S/.70-150)', '$$$$ Premium (> S/.150)'] },
          { name: 'seating_capacity', label: 'Capacidad (comensales)', type: 'number', min: 1, placeholder: 'Ej: 60' },
        ]
      },
      {
        title: 'Opciones Dietéticas',
        icon: '🥗',
        description: 'Marca las opciones que el establecimiento ofrece',
        columns: 3,
        fields: [
          { name: 'has_vegetarian', label: 'Opciones vegetarianas', type: 'checkbox' },
          { name: 'has_vegan', label: 'Opciones veganas', type: 'checkbox' },
          { name: 'has_gluten_free', label: 'Sin gluten', type: 'checkbox' },
          { name: 'has_lactose_free', label: 'Sin lactosa', type: 'checkbox' },
          { name: 'has_kosher', label: 'Kosher', type: 'checkbox' },
          { name: 'has_halal', label: 'Halal', type: 'checkbox' },
          { name: 'has_kids_menu', label: 'Menú infantil', type: 'checkbox' },
          { name: 'has_allergy_info', label: 'Info de alérgenos', type: 'checkbox' },
        ]
      },
      {
        title: 'Servicios y Ambiente',
        icon: '🍷',
        columns: 3,
        fields: [
          { name: 'has_delivery', label: 'Delivery', type: 'checkbox' },
          { name: 'has_takeaway', label: 'Para llevar', type: 'checkbox' },
          { name: 'has_reservation', label: 'Reservaciones', type: 'checkbox' },
          { name: 'has_private_room', label: 'Salón privado', type: 'checkbox' },
          { name: 'has_terrace', label: 'Terraza', type: 'checkbox' },
          { name: 'has_live_music', label: 'Música en vivo', type: 'checkbox' },
          { name: 'has_bar_area', label: 'Área de bar', type: 'checkbox' },
          { name: 'has_parking', label: 'Estacionamiento', type: 'checkbox' },
          { name: 'has_wifi', label: 'WiFi', type: 'checkbox' },
          { name: 'ambiance', label: 'Ambiente', type: 'select', options: ['Casual', 'Fine dining', 'Rústico / Campestre', 'Moderno', 'Temático', 'Familiar', 'Romántico', 'Al aire libre'], fullWidth: true },
        ]
      },
      {
        title: 'Horarios',
        icon: '⏰',
        columns: 2,
        fields: [
          { name: 'opens_breakfast', label: '¿Abre para desayuno?', type: 'checkbox' },
          { name: 'opens_lunch', label: '¿Abre para almuerzo?', type: 'checkbox' },
          { name: 'opens_dinner', label: '¿Abre para cena?', type: 'checkbox' },
          { name: 'open_time', label: 'Hora de apertura', type: 'time', placeholder: '08:00' },
          { name: 'close_time', label: 'Hora de cierre', type: 'time', placeholder: '22:00' },
          { name: 'closed_days', label: 'Días de cierre', type: 'text', placeholder: 'Ej: Lunes, Feriados' },
        ]
      },
    ]
  },

  comida_rapida: {
    emoji: '🍔',
    label: 'Restaurante Comida Rápida',
    color: 'orange',
    description: 'Establecimientos de comida rápida y casual',
    sections: [
      {
        title: 'Tipo de Establecimiento',
        icon: '🏪',
        columns: 2,
        fields: [
          { name: 'fast_food_type', label: 'Tipo', type: 'select', options: ['Hamburguesería', 'Pizzería', 'Pollo / Broaster', 'Hot dogs / Salchipapas', 'Sándwiches / Wraps', 'Empanadas / Fritanga', 'Asadero', 'Heladería', 'Jugos / Batidos', 'Comidas rápidas variadas'], required: true },
          { name: 'service_style', label: 'Estilo de servicio', type: 'select', options: ['Mostrador', 'Mesa con mesero', 'Autoservicio', 'Para llevar', 'Domicilio / Delivery'], required: true },
          { name: 'price_range', label: 'Rango de precios', type: 'select', options: ['$ Económico (< $15.000)', '$$ Medio ($15.000-30.000)', '$$$ Alto (> $30.000)'] },
          { name: 'seating_capacity', label: 'Capacidad (comensales)', type: 'number', min: 1, placeholder: 'Ej: 30' },
        ]
      },
      {
        title: 'Servicios',
        icon: '🛵',
        columns: 3,
        fields: [
          { name: 'has_delivery', label: 'Domicilio propio', type: 'checkbox' },
          { name: 'has_rappi', label: 'Rappi / Apps', type: 'checkbox' },
          { name: 'has_takeaway', label: 'Para llevar', type: 'checkbox' },
          { name: 'has_wifi', label: 'WiFi', type: 'checkbox' },
          { name: 'has_parking', label: 'Parqueadero', type: 'checkbox' },
          { name: 'has_kids_area', label: 'Zona infantil', type: 'checkbox' },
          { name: 'accepts_card', label: 'Acepta tarjeta', type: 'checkbox' },
          { name: 'accepts_nequi', label: 'Nequi / Daviplata', type: 'checkbox' },
        ]
      },
      {
        title: 'Horarios',
        icon: '⏰',
        columns: 2,
        fields: [
          { name: 'open_time', label: 'Hora de apertura', type: 'time', placeholder: '10:00' },
          { name: 'close_time', label: 'Hora de cierre', type: 'time', placeholder: '22:00' },
          { name: 'closed_days', label: 'Días de cierre', type: 'text', placeholder: 'Ej: Lunes' },
          { name: 'avg_wait_minutes', label: 'Tiempo promedio de espera (min)', type: 'number', min: 1, placeholder: 'Ej: 15' },
        ]
      },
    ]
  },

  agencia_transporte: {
    emoji: '🚐',
    label: 'Agencia de Transporte',
    color: 'sky',
    description: 'Servicios de transporte turístico terrestre y fluvial',
    sections: [
      {
        title: 'Flota de Vehículos',
        icon: '🚌',
        columns: 2,
        fields: [
          { name: 'fleet_size', label: 'Tamaño de flota', type: 'number', min: 1, placeholder: 'Ej: 10' },
          { name: 'vehicle_types', label: 'Tipos de vehículo', type: 'multi-select', options: ['Sedán', 'Minivan (7 pax)', 'Sprinter (15 pax)', 'Bus medio (25 pax)', 'Bus grande (45 pax)', 'Van 4x4', 'Bote / Lancha', 'Tren'] },
          { name: 'newest_vehicle_year', label: 'Año del vehículo más nuevo', type: 'number', placeholder: 'Ej: 2023' },
          { name: 'oldest_vehicle_year', label: 'Año del vehículo más antiguo', type: 'number', placeholder: 'Ej: 2018' },
        ]
      },
      {
        title: 'Equipamiento',
        icon: '🛡️',
        columns: 3,
        fields: [
          { name: 'has_ac', label: 'Aire acondicionado', type: 'checkbox' },
          { name: 'has_heating', label: 'Calefacción', type: 'checkbox' },
          { name: 'has_wifi', label: 'WiFi a bordo', type: 'checkbox' },
          { name: 'has_gps', label: 'GPS en vehículos', type: 'checkbox' },
          { name: 'has_first_aid', label: 'Botiquín', type: 'checkbox' },
          { name: 'has_oxygen', label: 'Balón de oxígeno', type: 'checkbox' },
          { name: 'has_usb_charging', label: 'Cargadores USB', type: 'checkbox' },
          { name: 'has_reclining_seats', label: 'Asientos reclinables', type: 'checkbox' },
          { name: 'has_luggage_space', label: 'Espacio para equipaje', type: 'checkbox' },
        ]
      },
      {
        title: 'Cobertura y Rutas',
        icon: '🗺️',
        columns: 1,
        fields: [
          { name: 'coverage_area', label: 'Área de cobertura', type: 'text', placeholder: 'Ej: Cusco, Valle Sagrado, Puno, Arequipa', fullWidth: true },
          { name: 'popular_routes', label: 'Rutas más frecuentes', type: 'textarea', placeholder: 'Ej:\n• Cusco → Ollantaytambo (1h 30min)\n• Cusco → Puno (6h)\n• Aeropuerto → Hotel', fullWidth: true },
          { name: 'has_airport_transfers', label: '¿Transfer aeropuerto?', type: 'checkbox' },
          { name: 'has_24h_service', label: '¿Servicio 24 horas?', type: 'checkbox' },
        ]
      },
    ]
  },

  guia_turismo: {
    emoji: '🧭',
    label: 'Guía de Turismo',
    color: 'violet',
    description: 'Guías turísticos certificados y especializados',
    sections: [
      {
        title: 'Credenciales',
        icon: '🎓',
        columns: 2,
        fields: [
          { name: 'license_number', label: 'N° de licencia oficial', type: 'text', required: true, placeholder: 'Ej: GT-CUSCO-2024-001' },
          { name: 'license_expiry', label: 'Vencimiento de licencia', type: 'text', placeholder: 'Ej: 2026-12-31' },
          { name: 'years_experience', label: 'Años de experiencia', type: 'number', min: 0, placeholder: 'Ej: 8' },
          { name: 'education', label: 'Formación', type: 'select', options: ['Técnico en turismo', 'Licenciatura en turismo', 'Arqueología', 'Historia', 'Biología / Ecología', 'Autodidacta certificado'] },
        ]
      },
      {
        title: 'Idiomas',
        icon: '🌐',
        description: 'Selecciona los idiomas que domina',
        columns: 3,
        fields: [
          { name: 'lang_spanish', label: 'Español (nativo)', type: 'checkbox' },
          { name: 'lang_english', label: 'Inglés', type: 'checkbox' },
          { name: 'lang_french', label: 'Francés', type: 'checkbox' },
          { name: 'lang_portuguese', label: 'Portugués', type: 'checkbox' },
          { name: 'lang_german', label: 'Alemán', type: 'checkbox' },
          { name: 'lang_italian', label: 'Italiano', type: 'checkbox' },
          { name: 'lang_japanese', label: 'Japonés', type: 'checkbox' },
          { name: 'lang_quechua', label: 'Quechua', type: 'checkbox' },
          { name: 'other_languages', label: 'Otros idiomas', type: 'text', placeholder: 'Ej: Mandarín, Coreano...', fullWidth: true },
        ]
      },
      {
        title: 'Especialidades',
        icon: '🏔️',
        columns: 3,
        fields: [
          { name: 'spec_trekking', label: 'Trekking / Senderismo', type: 'checkbox' },
          { name: 'spec_history', label: 'Historia Inca', type: 'checkbox' },
          { name: 'spec_archaeology', label: 'Arqueología', type: 'checkbox' },
          { name: 'spec_birdwatching', label: 'Avistamiento de aves', type: 'checkbox' },
          { name: 'spec_photography', label: 'Fotografía de viaje', type: 'checkbox' },
          { name: 'spec_gastronomy', label: 'Gastronomía', type: 'checkbox' },
          { name: 'spec_adventure', label: 'Deportes de aventura', type: 'checkbox' },
          { name: 'spec_spiritual', label: 'Turismo espiritual', type: 'checkbox' },
          { name: 'spec_amazon', label: 'Selva amazónica', type: 'checkbox' },
        ]
      },
      {
        title: 'Certificaciones de Seguridad',
        icon: '🏥',
        columns: 2,
        fields: [
          { name: 'has_first_aid', label: 'Primeros auxilios', type: 'checkbox' },
          { name: 'has_wilderness_cert', label: 'Rescate en montaña', type: 'checkbox' },
          { name: 'has_cpr', label: 'RCP (Reanimación)', type: 'checkbox' },
          { name: 'has_altitude_training', label: 'Manejo de mal de altura', type: 'checkbox' },
        ]
      },
    ]
  },

  operadora: {
    emoji: '🏢',
    label: 'Operadora Turística',
    color: 'sky',
    description: 'Empresas operadoras de tours y paquetes turísticos',
    sections: [
      {
        title: 'Información Legal',
        icon: '📄',
        columns: 2,
        fields: [
          { name: 'ruc', label: 'RUC / NIT', type: 'text', required: true, placeholder: 'Ej: 20512345678' },
          { name: 'license_number', label: 'N° de licencia de operación', type: 'text', placeholder: 'DIRCETUR-XXXX' },
          { name: 'years_operating', label: 'Años de operación', type: 'number', min: 0, placeholder: 'Ej: 15' },
          { name: 'company_size', label: 'Tamaño de empresa', type: 'select', options: ['Micro (1-5 empleados)', 'Pequeña (6-20)', 'Mediana (21-100)', 'Grande (100+)'] },
        ]
      },
      {
        title: 'Destinos y Especialidad',
        icon: '🌎',
        columns: 2,
        fields: [
          { name: 'destinations', label: 'Destinos principales', type: 'text', placeholder: 'Ej: Cusco, Puno, Arequipa, Madre de Dios', fullWidth: true },
          { name: 'specialties', label: 'Especialidades', type: 'multi-select', options: ['Aventura', 'Cultural', 'Gastronómico', 'Naturaleza / Eco', 'Lujo', 'Mochilero / Budget', 'Corporativo', 'Escolar', 'Religioso'] },
          { name: 'has_own_transport', label: '¿Flota propia de transporte?', type: 'checkbox' },
          { name: 'has_own_guides', label: '¿Guías en planilla?', type: 'checkbox' },
        ]
      },
      {
        title: 'Seguros y Garantías',
        icon: '🛡️',
        columns: 2,
        fields: [
          { name: 'has_insurance', label: 'Seguro de operación', type: 'checkbox' },
          { name: 'has_traveler_insurance', label: 'Seguro para viajeros', type: 'checkbox' },
          { name: 'has_complaint_book', label: 'Libro de reclamaciones', type: 'checkbox' },
          { name: 'insurance_provider', label: 'Aseguradora', type: 'text', placeholder: 'Ej: Rímac, Pacífico, Mapfre' },
        ]
      },
    ]
  },

  finca_turistica: {
    emoji: '🌾',
    label: 'Finca Turística',
    color: 'lime',
    description: 'Fincas rurales con actividades agrícolas, ganaderas y ecoturísticas',
    sections: [
      {
        title: 'Tipo y Capacidad',
        icon: '🏡',
        columns: 2,
        fields: [
          { name: 'finca_type', label: 'Tipo de finca', type: 'select', options: ['Finca Agroturística', 'Finca Ganadera', 'Finca Cafetera', 'Finca Panelera', 'Finca Frutal', 'Hacienda Colonial', 'Finca Mixta'], required: true },
          { name: 'total_area_hectares', label: 'Área total (hectáreas)', type: 'number', min: 1, placeholder: 'Ej: 15' },
          { name: 'max_guests', label: 'Capacidad máxima de visitantes', type: 'number', min: 1, placeholder: 'Ej: 50' },
          { name: 'distance_from_city_km', label: 'Distancia a ciudad más cercana (km)', type: 'number', min: 0, placeholder: 'Ej: 25' },
          { name: 'access_road', label: 'Tipo de acceso', type: 'select', options: ['Pavimentado', 'Destapado en buen estado', 'Destapado difícil', 'Solo 4x4'] },
        ]
      },
      {
        title: 'Hospedaje',
        icon: '🏠',
        columns: 3,
        fields: [
          { name: 'has_lodging', label: 'Ofrece hospedaje', type: 'checkbox' },
          { name: 'lodging_type', label: 'Tipo de alojamiento', type: 'select', options: ['Cabañas', 'Habitaciones', 'Camping', 'Glamping', 'Hamacas'] },
          { name: 'total_rooms', label: 'Número de habitaciones/cabañas', type: 'number', min: 1, placeholder: 'Ej: 8' },
          { name: 'has_hot_water', label: 'Agua caliente', type: 'checkbox' },
          { name: 'has_private_bathroom', label: 'Baño privado', type: 'checkbox' },
          { name: 'has_electricity', label: 'Electricidad 24h', type: 'checkbox' },
          { name: 'has_wifi', label: 'WiFi', type: 'checkbox' },
        ]
      },
      {
        title: 'Animales y Granja',
        icon: '🐄',
        columns: 3,
        fields: [
          { name: 'has_farm_animals', label: 'Animales de granja', type: 'checkbox' },
          { name: 'has_horseback_riding', label: 'Cabalgatas', type: 'checkbox' },
          { name: 'has_milking', label: 'Ordeño participativo', type: 'checkbox' },
          { name: 'has_animal_feeding', label: 'Alimentación de animales', type: 'checkbox' },
          { name: 'has_poultry', label: 'Aves de corral', type: 'checkbox' },
          { name: 'has_fish_pond', label: 'Estanque de peces', type: 'checkbox' },
          { name: 'has_beekeeping', label: 'Apicultura', type: 'checkbox' },
        ]
      },
      {
        title: 'Naturaleza y Caminatas',
        icon: '🌿',
        columns: 3,
        fields: [
          { name: 'has_ecological_trails', label: 'Senderos ecológicos', type: 'checkbox' },
          { name: 'has_birdwatching', label: 'Avistamiento de aves', type: 'checkbox' },
          { name: 'has_forest', label: 'Bosque nativo', type: 'checkbox' },
          { name: 'has_river_creek', label: 'Río o quebrada', type: 'checkbox' },
          { name: 'has_waterfall', label: 'Cascada / Caída de agua', type: 'checkbox' },
          { name: 'has_viewpoint', label: 'Mirador panorámico', type: 'checkbox' },
          { name: 'has_night_walks', label: 'Caminatas nocturnas', type: 'checkbox' },
          { name: 'has_butterfly_garden', label: 'Jardín de mariposas', type: 'checkbox' },
        ]
      },
      {
        title: 'Agricultura y Cosecha',
        icon: '🌱',
        columns: 3,
        fields: [
          { name: 'has_coffee_tour', label: 'Tour del café', type: 'checkbox' },
          { name: 'has_cacao_tour', label: 'Tour del cacao', type: 'checkbox' },
          { name: 'has_sugar_cane', label: 'Proceso de panela / caña', type: 'checkbox' },
          { name: 'has_fruit_harvest', label: 'Cosecha de frutas', type: 'checkbox' },
          { name: 'has_organic_garden', label: 'Huerto orgánico', type: 'checkbox' },
          { name: 'has_medicinal_plants', label: 'Plantas medicinales', type: 'checkbox' },
          { name: 'has_flower_garden', label: 'Jardín de flores', type: 'checkbox' },
          { name: 'main_crops', label: 'Cultivos principales', type: 'text', placeholder: 'Ej: Café, plátano, cacao, aguacate', fullWidth: true },
        ]
      },
      {
        title: 'Gastronomía',
        icon: '🍽️',
        columns: 3,
        fields: [
          { name: 'has_restaurant', label: 'Restaurante / Comedor', type: 'checkbox' },
          { name: 'has_typical_food', label: 'Comida típica campesina', type: 'checkbox' },
          { name: 'has_bbq_area', label: 'Zona de asados / BBQ', type: 'checkbox' },
          { name: 'has_cooking_workshop', label: 'Taller de cocina', type: 'checkbox' },
          { name: 'has_coffee_tasting', label: 'Degustación de café', type: 'checkbox' },
          { name: 'has_local_products_sale', label: 'Venta de productos locales', type: 'checkbox' },
        ]
      },
      {
        title: 'Actividades Educativas y Recreativas',
        icon: '🎓',
        columns: 3,
        fields: [
          { name: 'has_educational_talks', label: 'Charlas educativas', type: 'checkbox' },
          { name: 'has_workshops', label: 'Talleres artesanales', type: 'checkbox' },
          { name: 'has_pool', label: 'Piscina', type: 'checkbox' },
          { name: 'has_games_area', label: 'Zona de juegos', type: 'checkbox' },
          { name: 'has_bonfire', label: 'Fogata / Zona de campamento', type: 'checkbox' },
          { name: 'has_hammock_area', label: 'Zona de hamacas / descanso', type: 'checkbox' },
          { name: 'has_events_space', label: 'Espacio para eventos', type: 'checkbox' },
        ]
      },
      {
        title: 'Servicios e Infraestructura',
        icon: '🛡️',
        columns: 3,
        fields: [
          { name: 'has_parking', label: 'Parqueadero', type: 'checkbox' },
          { name: 'has_guide_service', label: 'Servicio de guía', type: 'checkbox' },
          { name: 'has_first_aid', label: 'Botiquín / Primeros auxilios', type: 'checkbox' },
          { name: 'has_accessibility', label: 'Accesibilidad reducida', type: 'checkbox' },
          { name: 'has_insect_repellent', label: 'Kit repelente de insectos', type: 'checkbox' },
          { name: 'pet_policy', label: 'Política de mascotas', type: 'select', options: ['Permite mascotas', 'No permite', 'Bajo consulta'] },
          { name: 'additional_notes', label: 'Notas adicionales', type: 'textarea', placeholder: 'Información adicional sobre la finca...', fullWidth: true },
        ]
      },
    ]
  },

  otro: {
    emoji: '📦',
    label: 'Otro',
    color: 'gray',
    description: 'Otros tipos de proveedores de servicios turísticos',
    sections: [
      {
        title: 'Descripción del Servicio',
        icon: '📝',
        columns: 1,
        fields: [
          { name: 'service_type', label: 'Tipo de servicio', type: 'select', options: ['Fotografía profesional', 'Artesanía / Souvenirs', 'Seguros de viaje', 'Lavandería', 'Alquiler de equipos', 'Telecomunicaciones', 'Salud / Farmacia', 'Cambio de moneda', 'Otro'] },
          { name: 'service_description', label: 'Descripción detallada', type: 'textarea', placeholder: 'Describe el servicio que ofrece este proveedor...', fullWidth: true },
          { name: 'availability', label: 'Disponibilidad', type: 'text', placeholder: 'Ej: Lunes a Sábado 9:00-18:00' },
        ]
      },
    ]
  },
};

// ============================================================
// PRODUCTOS - META + CAMPOS DINÁMICOS POR SECCIÓN
// ============================================================

export const PRODUCT_CATEGORY_META: Record<string, { emoji: string; label: string; fields: DynamicField[] }> = {
  alojamiento: { emoji: '🏨', label: 'Alojamiento', fields: [] },
  excursion: { emoji: '🥾', label: 'Excursión', fields: [] },
  transfer: { emoji: '🚐', label: 'Transfer / Transporte', fields: [] },
  gastronomia: { emoji: '🍽️', label: 'Gastronomía', fields: [] },
  comida_rapida: { emoji: '🍔', label: 'Comida Rápida', fields: [] },
  actividad_aventura: { emoji: '🧗', label: 'Actividad de Aventura', fields: [] },
  tour_cultural: { emoji: '🏛️', label: 'Tour Cultural', fields: [] },
  finca_turistica: { emoji: '🌾', label: 'Finca Turística', fields: [] },
  paquete_combo: { emoji: '📦', label: 'Paquete Combo', fields: [] },
  libre: { emoji: '✨', label: 'Libre / Personalizado', fields: [] },
};

export const PRODUCT_CATEGORIES: Record<string, CategoryConfig> = {
  alojamiento: {
    emoji: '🏨', label: 'Alojamiento', color: 'amber',
    description: 'Noches de hospedaje en hoteles, hostales o lodges',
    sections: [
      {
        title: 'Detalles de la Habitación', icon: '🛏️', columns: 2,
        fields: [
          { name: 'room_type', label: 'Tipo de habitación', type: 'select', options: ['Individual', 'Doble', 'Triple', 'Suite', 'Familiar', 'Dormitorio compartido'], required: true },
          { name: 'bed_type', label: 'Tipo de cama', type: 'select', options: ['Simple', 'Matrimonial', 'Twin', 'King', 'Litera'] },
          { name: 'max_occupancy', label: 'Ocupación máxima', type: 'number', min: 1, placeholder: 'Ej: 3' },
          { name: 'room_size_m2', label: 'Tamaño (m²)', type: 'number', placeholder: 'Ej: 25' },
        ]
      },
      {
        title: 'Incluido', icon: '✅', columns: 3,
        fields: [
          { name: 'includes_breakfast', label: 'Desayuno', type: 'checkbox' },
          { name: 'includes_wifi', label: 'WiFi', type: 'checkbox' },
          { name: 'has_private_bathroom', label: 'Baño privado', type: 'checkbox' },
          { name: 'has_hot_water', label: 'Agua caliente', type: 'checkbox' },
          { name: 'has_tv', label: 'TV', type: 'checkbox' },
          { name: 'has_minibar', label: 'Minibar', type: 'checkbox' },
          { name: 'has_safe', label: 'Caja fuerte', type: 'checkbox' },
          { name: 'has_balcony', label: 'Balcón', type: 'checkbox' },
          { name: 'has_ac', label: 'A/C', type: 'checkbox' },
        ]
      },
      {
        title: 'Vista y Ubicación', icon: '🏔️', columns: 2,
        fields: [
          { name: 'view_type', label: 'Tipo de vista', type: 'select', options: ['Montaña', 'Ciudad', 'Jardín', 'Piscina', 'Lago', 'Valle', 'Sin vista específica'] },
          { name: 'floor_preference', label: 'Piso', type: 'select', options: ['Planta baja', 'Pisos altos', 'Cualquiera'] },
        ]
      },
    ]
  },

  excursion: {
    emoji: '🥾', label: 'Excursión', color: 'emerald',
    description: 'Excursiones y caminatas guiadas',
    sections: [
      {
        title: 'Información Técnica', icon: '📊', columns: 2,
        fields: [
          { name: 'difficulty', label: 'Dificultad', type: 'select', options: ['Fácil', 'Moderado', 'Difícil', 'Extremo'], required: true },
          { name: 'excursion_type', label: 'Tipo', type: 'select', options: ['Caminata corta (< 3h)', 'Trekking de día', 'Trekking multi-día', 'City tour', 'Tour en vehículo', 'Mixto'] },
          { name: 'distance_km', label: 'Distancia (km)', type: 'number', placeholder: 'Ej: 12' },
          { name: 'altitude_min', label: 'Altitud mínima (msnm)', type: 'number', placeholder: 'Ej: 3400' },
          { name: 'altitude_max', label: 'Altitud máxima (msnm)', type: 'number', placeholder: 'Ej: 4200' },
          { name: 'elevation_gain', label: 'Desnivel acumulado (m)', type: 'number', placeholder: 'Ej: 800' },
        ]
      },
      {
        title: 'Incluido en el Precio', icon: '✅', columns: 3,
        fields: [
          { name: 'includes_guide', label: 'Guía', type: 'checkbox' },
          { name: 'includes_transport', label: 'Transporte', type: 'checkbox' },
          { name: 'includes_entrance', label: 'Entradas', type: 'checkbox' },
          { name: 'includes_breakfast', label: 'Desayuno', type: 'checkbox' },
          { name: 'includes_lunch', label: 'Almuerzo / Box lunch', type: 'checkbox' },
          { name: 'includes_snacks', label: 'Snacks', type: 'checkbox' },
          { name: 'includes_water', label: 'Agua / Bebidas', type: 'checkbox' },
          { name: 'includes_equipment', label: 'Equipo especializado', type: 'checkbox' },
          { name: 'includes_first_aid', label: 'Botiquín', type: 'checkbox' },
        ]
      },
      {
        title: 'Recomendaciones', icon: '💡', columns: 1,
        fields: [
          { name: 'recommended_gear', label: 'Equipo recomendado', type: 'textarea', placeholder: 'Ej: Zapatillas de trekking, protector solar SPF50, poncho de lluvia, mínimo 2L de agua, snacks energéticos...', fullWidth: true },
          { name: 'physical_requirements', label: 'Requisitos físicos', type: 'textarea', placeholder: 'Ej: Buena condición física, experiencia previa en trekking recomendada, no recomendable para personas con problemas cardíacos...', fullWidth: true },
        ]
      },
    ]
  },

  transfer: {
    emoji: '🚐', label: 'Transfer / Transporte', color: 'sky',
    description: 'Servicios de traslado punto a punto',
    sections: [
      {
        title: 'Ruta del Transfer', icon: '📍', columns: 2,
        fields: [
          { name: 'route_origin', label: 'Punto de origen', type: 'text', required: true, placeholder: 'Ej: Aeropuerto Alejandro Velasco Astete' },
          { name: 'route_destination', label: 'Punto de destino', type: 'text', required: true, placeholder: 'Ej: Centro de Cusco / Hotel' },
          { name: 'estimated_duration', label: 'Duración estimada', type: 'text', placeholder: 'Ej: 25 min' },
          { name: 'distance_km', label: 'Distancia (km)', type: 'number', placeholder: 'Ej: 8' },
        ]
      },
      {
        title: 'Vehículo', icon: '🚐', columns: 2,
        fields: [
          { name: 'vehicle_type', label: 'Tipo de vehículo', type: 'select', options: ['Sedán (3 pax)', 'Minivan (7 pax)', 'Sprinter (15 pax)', 'Bus (25-45 pax)', 'Van 4x4', 'Lancha'], required: true },
          { name: 'max_passengers', label: 'Pasajeros máximo', type: 'number', placeholder: 'Ej: 7' },
          { name: 'max_luggage', label: 'Maletas máximo', type: 'number', placeholder: 'Ej: 7' },
          { name: 'is_private', label: '¿Servicio privado?', type: 'checkbox' },
          { name: 'has_ac', label: 'Aire acondicionado', type: 'checkbox' },
          { name: 'has_wifi', label: 'WiFi a bordo', type: 'checkbox' },
          { name: 'has_oxygen', label: 'Balón de oxígeno', type: 'checkbox' },
        ]
      },
    ]
  },

  gastronomia: {
    emoji: '🍽️', label: 'Gastronomía', color: 'rose',
    description: 'Experiencias culinarias y comidas incluidas',
    sections: [
      {
        title: 'Tipo de Experiencia', icon: '🍽️', columns: 2,
        fields: [
          { name: 'meal_type', label: 'Tipo de comida', type: 'select', options: ['Desayuno', 'Almuerzo', 'Cena', 'Buffet', 'Degustación', 'Cooking class', 'Food tour', 'Picnic / Box lunch'], required: true },
          { name: 'cuisine', label: 'Tipo de cocina', type: 'text', placeholder: 'Ej: Novo-andina, Criolla, Fusión' },
          { name: 'courses', label: 'Número de tiempos', type: 'select', options: ['1 tiempo', '2 tiempos', '3 tiempos', '5 tiempos (degustación)', 'Buffet libre'] },
          { name: 'includes_drinks', label: '¿Incluye bebidas?', type: 'checkbox' },
          { name: 'includes_wine', label: '¿Incluye vino/pisco?', type: 'checkbox' },
        ]
      },
      {
        title: 'Opciones Dietéticas Disponibles', icon: '🥗', columns: 3,
        fields: [
          { name: 'has_vegetarian', label: 'Vegetariano', type: 'checkbox' },
          { name: 'has_vegan', label: 'Vegano', type: 'checkbox' },
          { name: 'has_gluten_free', label: 'Sin gluten', type: 'checkbox' },
          { name: 'has_lactose_free', label: 'Sin lactosa', type: 'checkbox' },
          { name: 'has_nut_free', label: 'Sin frutos secos', type: 'checkbox' },
          { name: 'has_kids_option', label: 'Opción infantil', type: 'checkbox' },
        ]
      },
    ]
  },

  comida_rapida: {
    emoji: '🍔', label: 'Comida Rápida', color: 'orange',
    description: 'Productos de comida rápida y comida casual',
    sections: [
      {
        title: 'Tipo de Comida', icon: '🍔', columns: 2,
        fields: [
          { name: 'food_type', label: 'Tipo de producto', type: 'select', options: ['Hamburguesa', 'Pizza', 'Pollo / Broaster', 'Hot Dog', 'Salchipapa', 'Empanada', 'Sándwich / Wrap', 'Arepa', 'Combo / Menú', 'Picada / Para compartir', 'Postre / Helado', 'Bebida / Jugo', 'Otro'], required: true },
          { name: 'food_style', label: 'Estilo', type: 'select', options: ['Individual', 'Para compartir (2-3)', 'Familiar (4-6)', 'Combo personal', 'Combo para dos', 'Porción infantil'] },
          { name: 'portion_size', label: 'Tamaño de porción', type: 'select', options: ['Pequeña', 'Mediana', 'Grande', 'Extra grande', 'Variable'] },
          { name: 'preparation_time_min', label: 'Tiempo de preparación (min)', type: 'number', min: 1, placeholder: 'Ej: 15' },
        ]
      },
      {
        title: 'Características', icon: '✅', columns: 3,
        fields: [
          { name: 'is_bestseller', label: 'Más vendido', type: 'checkbox' },
          { name: 'is_new', label: 'Nuevo en menú', type: 'checkbox' },
          { name: 'is_spicy', label: 'Picante', type: 'checkbox' },
          { name: 'has_vegetarian_option', label: 'Opción vegetariana', type: 'checkbox' },
          { name: 'has_vegan_option', label: 'Opción vegana', type: 'checkbox' },
          { name: 'has_gluten_free_option', label: 'Sin gluten disponible', type: 'checkbox' },
          { name: 'has_kids_option', label: 'Opción infantil', type: 'checkbox' },
          { name: 'available_for_delivery', label: 'Disponible para domicilio', type: 'checkbox' },
        ]
      },
      {
        title: 'Ingredientes y Alérgenos', icon: '⚠️', columns: 1,
        fields: [
          { name: 'main_ingredients', label: 'Ingredientes principales', type: 'text', placeholder: 'Ej: Carne de res 150g, pan artesanal, queso cheddar, tocineta, lechuga, tomate', fullWidth: true },
          { name: 'allergens', label: 'Alérgenos', type: 'multi-select', options: ['Gluten', 'Lácteos', 'Huevo', 'Frutos secos', 'Soya', 'Mariscos', 'Ninguno conocido'] },
        ]
      },
      {
        title: 'Complementos', icon: '🥤', columns: 3,
        fields: [
          { name: 'includes_drink', label: 'Incluye bebida', type: 'checkbox' },
          { name: 'includes_fries', label: 'Incluye papas', type: 'checkbox' },
          { name: 'includes_salad', label: 'Incluye ensalada', type: 'checkbox' },
          { name: 'includes_dessert', label: 'Incluye postre', type: 'checkbox' },
          { name: 'upgrade_options', label: 'Opciones de mejora', type: 'text', placeholder: 'Ej: Doble carne +$5.000, Extra queso +$3.000', fullWidth: true },
        ]
      },
    ]
  },

  actividad_aventura: {
    emoji: '🧗', label: 'Actividad de Aventura', color: 'emerald',
    description: 'Deportes de aventura y actividades extremas',
    sections: [
      {
        title: 'Actividad', icon: '⚡', columns: 2,
        fields: [
          { name: 'activity_type', label: 'Tipo de actividad', type: 'select', options: ['Rafting', 'Zip-line / Canopy', 'Rappel', 'Escalada en roca', 'Parapente', 'Ciclismo de montaña', 'Kayak', 'Sandboard', 'Bungee jumping', 'ATV / Cuatrimoto', 'Cabalgata', 'Surf / Stand-up paddle'], required: true },
          { name: 'difficulty', label: 'Nivel de dificultad', type: 'select', options: ['Fácil (apto para todos)', 'Moderado (algo de experiencia)', 'Difícil (experiencia requerida)', 'Extremo (expertos)'], required: true },
        ]
      },
      {
        title: 'Restricciones', icon: '⚠️', columns: 2,
        fields: [
          { name: 'min_age', label: 'Edad mínima', type: 'number', min: 0, placeholder: 'Ej: 12' },
          { name: 'max_age', label: 'Edad máxima', type: 'number', placeholder: 'Ej: 65' },
          { name: 'min_weight', label: 'Peso mínimo (kg)', type: 'number', placeholder: 'Ej: 40' },
          { name: 'max_weight', label: 'Peso máximo (kg)', type: 'number', placeholder: 'Ej: 100' },
          { name: 'health_restrictions', label: 'Restricciones de salud', type: 'textarea', placeholder: 'Ej: No apto para personas con problemas cardíacos, embarazadas, o con vértigo', fullWidth: true },
        ]
      },
      {
        title: 'Seguridad e Incluido', icon: '🛡️', columns: 3,
        fields: [
          { name: 'equipment_included', label: 'Equipo incluido', type: 'checkbox' },
          { name: 'insurance_included', label: 'Seguro incluido', type: 'checkbox' },
          { name: 'safety_briefing', label: 'Briefing de seguridad', type: 'checkbox' },
          { name: 'certified_instructors', label: 'Instructores certificados', type: 'checkbox' },
          { name: 'includes_photos', label: 'Fotos/video incluido', type: 'checkbox' },
          { name: 'includes_transport', label: 'Transporte incluido', type: 'checkbox' },
          { name: 'includes_snack', label: 'Snack incluido', type: 'checkbox' },
        ]
      },
    ]
  },

  tour_cultural: {
    emoji: '🏛️', label: 'Tour Cultural', color: 'violet',
    description: 'Tours históricos, culturales y patrimoniales',
    sections: [
      {
        title: 'Información del Tour', icon: '📚', columns: 2,
        fields: [
          { name: 'tour_type', label: 'Tipo de tour', type: 'select', options: ['Walking tour', 'Tour en bus', 'Tour privado', 'Tour grupal', 'Tour nocturno', 'Tour gastronómico', 'Tour fotográfico'], required: true },
          { name: 'tour_language', label: 'Idioma', type: 'select', options: ['Español', 'Inglés', 'Francés', 'Portugués', 'Bilingüe ES/EN', 'Multilingüe'], required: true },
          { name: 'group_size_max', label: 'Tamaño máximo de grupo', type: 'number', placeholder: 'Ej: 15' },
          { name: 'theme', label: 'Temática', type: 'select', options: ['Historia Inca', 'Colonial / Virreinal', 'Arte y artesanía', 'Gastronomía', 'Religioso', 'Arquitectura', 'Naturaleza y cosmovisión', 'Vida moderna'] },
        ]
      },
      {
        title: 'Sitios Visitados', icon: '📍', columns: 1,
        fields: [
          { name: 'sites_visited', label: 'Sitios que se visitan', type: 'textarea', placeholder: 'Ej:\n• Plaza de Armas\n• Catedral del Cusco\n• Sacsayhuamán\n• Qenqo\n• Tambomachay', fullWidth: true },
        ]
      },
      {
        title: 'Incluido', icon: '✅', columns: 3,
        fields: [
          { name: 'includes_guide', label: 'Guía profesional', type: 'checkbox' },
          { name: 'includes_entrance', label: 'Entradas a sitios', type: 'checkbox' },
          { name: 'includes_transport', label: 'Transporte', type: 'checkbox' },
          { name: 'includes_audio_guide', label: 'Audioguía', type: 'checkbox' },
          { name: 'includes_snack', label: 'Snack / Degustación', type: 'checkbox' },
          { name: 'includes_materials', label: 'Material informativo', type: 'checkbox' },
        ]
      },
    ]
  },

  finca_turistica: {
    emoji: '🌾', label: 'Finca Turística', color: 'lime',
    description: 'Experiencias agroturísticas, día de campo y estadías en finca',
    sections: [
      {
        title: 'Tipo de Experiencia', icon: '🏡', columns: 2,
        fields: [
          { name: 'experience_type', label: 'Tipo de experiencia', type: 'select', options: ['Día de campo (pasadía)', 'Estadía con hospedaje', 'Tour del café', 'Tour del cacao', 'Tour de la panela', 'Cabalgata', 'Experiencia ganadera', 'Cosecha participativa', 'Avistamiento de aves', 'Retiro / Wellness', 'Evento privado'], required: true },
          { name: 'modality', label: 'Modalidad', type: 'select', options: ['Individual', 'Grupal', 'Familiar', 'Privado exclusivo', 'Empresarial'] },
          { name: 'stay_duration', label: 'Duración del servicio', type: 'select', options: ['Media jornada (4h)', 'Jornada completa (8h)', '1 noche', '2 noches', '3+ noches'] },
          { name: 'max_group_size', label: 'Tamaño máximo del grupo', type: 'number', min: 1, placeholder: 'Ej: 20' },
        ]
      },
      {
        title: 'Actividades Incluidas', icon: '🌿', columns: 3,
        description: 'Marca las actividades que este producto incluye',
        fields: [
          { name: 'includes_horseback', label: 'Cabalgata', type: 'checkbox' },
          { name: 'includes_milking', label: 'Ordeño participativo', type: 'checkbox' },
          { name: 'includes_animal_feeding', label: 'Alimentar animales', type: 'checkbox' },
          { name: 'includes_coffee_tour', label: 'Tour del café', type: 'checkbox' },
          { name: 'includes_cacao_tour', label: 'Tour del cacao', type: 'checkbox' },
          { name: 'includes_panela_process', label: 'Proceso de panela', type: 'checkbox' },
          { name: 'includes_fruit_harvest', label: 'Cosecha de frutas', type: 'checkbox' },
          { name: 'includes_trails', label: 'Senderos ecológicos', type: 'checkbox' },
          { name: 'includes_waterfall', label: 'Visita a cascada', type: 'checkbox' },
          { name: 'includes_viewpoint', label: 'Mirador panorámico', type: 'checkbox' },
          { name: 'includes_birdwatching', label: 'Avistamiento de aves', type: 'checkbox' },
          { name: 'includes_pool', label: 'Uso de piscina', type: 'checkbox' },
          { name: 'includes_workshops', label: 'Talleres artesanales', type: 'checkbox' },
          { name: 'includes_bonfire', label: 'Fogata nocturna', type: 'checkbox' },
        ]
      },
      {
        title: 'Alimentación y Hospedaje', icon: '🍽️', columns: 3,
        fields: [
          { name: 'includes_breakfast', label: 'Desayuno', type: 'checkbox' },
          { name: 'includes_lunch', label: 'Almuerzo típico', type: 'checkbox' },
          { name: 'includes_dinner', label: 'Cena', type: 'checkbox' },
          { name: 'includes_snacks', label: 'Snacks / Refrigerio', type: 'checkbox' },
          { name: 'includes_coffee_tasting', label: 'Degustación de café', type: 'checkbox' },
          { name: 'includes_lodging', label: 'Hospedaje incluido', type: 'checkbox' },
          { name: 'lodging_type', label: 'Tipo de alojamiento', type: 'select', options: ['No aplica', 'Cabaña privada', 'Habitación privada', 'Habitación compartida', 'Glamping', 'Camping'] },
          { name: 'has_hot_water', label: 'Agua caliente', type: 'checkbox' },
          { name: 'has_private_bathroom', label: 'Baño privado', type: 'checkbox' },
        ]
      },
      {
        title: 'Servicios e Incluido en el Precio', icon: '✅', columns: 3,
        fields: [
          { name: 'includes_guide', label: 'Guía o anfitrión', type: 'checkbox' },
          { name: 'includes_transport', label: 'Transporte desde ciudad', type: 'checkbox' },
          { name: 'includes_insurance', label: 'Seguro de actividad', type: 'checkbox' },
          { name: 'includes_equipment', label: 'Equipo necesario', type: 'checkbox' },
          { name: 'includes_souvenir', label: 'Souvenir / Producto local', type: 'checkbox' },
          { name: 'pet_friendly', label: 'Pet friendly', type: 'checkbox' },
        ]
      },
      {
        title: 'Restricciones y Recomendaciones', icon: '⚠️', columns: 2,
        fields: [
          { name: 'min_age', label: 'Edad mínima', type: 'number', min: 0, placeholder: 'Ej: 6' },
          { name: 'difficulty', label: 'Nivel de exigencia física', type: 'select', options: ['Baja (apto para todos)', 'Media (caminatas cortas)', 'Alta (caminatas extensas)'] },
          { name: 'access_road', label: 'Tipo de acceso', type: 'select', options: ['Pavimentado', 'Destapado en buen estado', 'Destapado difícil', 'Solo 4x4'] },
          { name: 'distance_from_city_km', label: 'Distancia desde ciudad (km)', type: 'number', min: 0, placeholder: 'Ej: 25' },
          { name: 'recommended_gear', label: 'Qué llevar / Recomendaciones', type: 'textarea', placeholder: 'Ej: Ropa cómoda, zapatos cerrados, protector solar, repelente, traje de baño...', fullWidth: true },
          { name: 'health_restrictions', label: 'Restricciones de salud', type: 'textarea', placeholder: 'Ej: No recomendable para personas con movilidad reducida en algunos senderos...', fullWidth: true },
        ]
      },
    ]
  },

  paquete_combo: {
    emoji: '📦', label: 'Paquete Combo', color: 'sky',
    description: 'Paquetes que combinan múltiples servicios',
    sections: [
      {
        title: 'Composición del Paquete', icon: '📋', columns: 2,
        fields: [
          { name: 'num_days', label: 'Número de días', type: 'number', min: 1, required: true, placeholder: 'Ej: 3' },
          { name: 'num_nights', label: 'Número de noches', type: 'number', min: 0, placeholder: 'Ej: 2' },
          { name: 'num_activities', label: 'Actividades incluidas', type: 'number', min: 1, placeholder: 'Ej: 5' },
          { name: 'destinations', label: 'Destinos', type: 'text', placeholder: 'Ej: Cusco, Valle Sagrado, Machu Picchu' },
        ]
      },
      {
        title: 'Incluido en el Paquete', icon: '✅', columns: 3,
        fields: [
          { name: 'includes_accommodation', label: 'Alojamiento', type: 'checkbox' },
          { name: 'includes_all_meals', label: 'Todas las comidas', type: 'checkbox' },
          { name: 'includes_transport', label: 'Transporte', type: 'checkbox' },
          { name: 'includes_flights', label: 'Vuelos internos', type: 'checkbox' },
          { name: 'includes_guide', label: 'Guía permanente', type: 'checkbox' },
          { name: 'includes_entrance', label: 'Todas las entradas', type: 'checkbox' },
          { name: 'includes_insurance', label: 'Seguro de viaje', type: 'checkbox' },
          { name: 'includes_airport_transfer', label: 'Transfer aeropuerto', type: 'checkbox' },
          { name: 'includes_tips', label: 'Propinas', type: 'checkbox' },
        ]
      },
      {
        title: 'Descripción Detallada', icon: '📝', columns: 1,
        fields: [
          { name: 'combo_description', label: 'Descripción del paquete', type: 'textarea', placeholder: 'Describe el itinerario resumido, día por día...', fullWidth: true },
          { name: 'not_included', label: 'No incluido', type: 'textarea', placeholder: 'Ej: Vuelos internacionales, bebidas alcohólicas, gastos personales, propinas adicionales...', fullWidth: true },
        ]
      },
    ]
  },

  libre: {
    emoji: '✨', label: 'Libre / Personalizado', color: 'gray',
    description: 'Productos o servicios personalizados',
    sections: [
      {
        title: 'Descripción', icon: '📝', columns: 1,
        fields: [
          { name: 'custom_description', label: 'Descripción del producto/servicio', type: 'textarea', placeholder: 'Describe en detalle este producto o servicio personalizado...', fullWidth: true, required: true },
          { name: 'custom_requirements', label: 'Requisitos o condiciones', type: 'textarea', placeholder: 'Requisitos previos, restricciones, condiciones especiales...', fullWidth: true },
          { name: 'custom_includes', label: '¿Qué incluye?', type: 'textarea', placeholder: 'Lista lo que está incluido en el precio...', fullWidth: true },
        ]
      },
    ]
  },
};

// ============================================================
// ALIASES para compatibilidad con formularios existentes
// (los forms usan SUPPLIER_DYNAMIC_FIELDS / PRODUCT_DYNAMIC_FIELDS)
// ============================================================

function flattenSections(config: CategoryConfig): DynamicField[] {
  return config.sections.flatMap(s => s.fields);
}

export const SUPPLIER_DYNAMIC_FIELDS: Record<string, DynamicField[]> = Object.fromEntries(
  Object.entries(SUPPLIER_CATEGORIES).map(([key, config]) => [key, flattenSections(config)])
);

export const PRODUCT_DYNAMIC_FIELDS: Record<string, DynamicField[]> = Object.fromEntries(
  Object.entries(PRODUCT_CATEGORIES).map(([key, config]) => [key, flattenSections(config)])
);

// ============================================================
// CATEGORY_FIELDS (formato FieldConfig legacy - para compatibilidad)
// ============================================================

export const SUPPLIER_CATEGORY_FIELDS: CategoryFieldsMap = {};
export const PRODUCT_CATEGORY_FIELDS: CategoryFieldsMap = {};
