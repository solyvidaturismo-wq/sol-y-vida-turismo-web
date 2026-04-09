// ============================================================
// CONFIG DE CAMPOS DINÁMICOS POR CATEGORÍA
// Motor de formularios adaptables - Sol y Vida Turismo
// ============================================================

import type { CategoryFieldsMap, SupplierCategory, ProductCategory } from '../types';

// ---- Campos dinámicos para PROVEEDORES por categoría ----

export const SUPPLIER_CATEGORY_FIELDS: CategoryFieldsMap = {
  hotel: [
    {
      key: 'stars',
      label: 'Categoría de estrellas',
      type: 'select',
      options: [
        { value: '1', label: '⭐ 1 estrella' },
        { value: '2', label: '⭐⭐ 2 estrellas' },
        { value: '3', label: '⭐⭐⭐ 3 estrellas' },
        { value: '4', label: '⭐⭐⭐⭐ 4 estrellas' },
        { value: '5', label: '⭐⭐⭐⭐⭐ 5 estrellas' },
      ],
      required: true,
    },
    {
      key: 'total_rooms',
      label: 'Total de habitaciones',
      type: 'number',
      min: 1,
      placeholder: 'Ej: 45',
    },
    {
      key: 'has_pool',
      label: '¿Tiene piscina?',
      type: 'checkbox',
    },
    {
      key: 'has_spa',
      label: '¿Tiene spa?',
      type: 'checkbox',
    },
    {
      key: 'has_restaurant',
      label: '¿Tiene restaurante propio?',
      type: 'checkbox',
    },
    {
      key: 'checkin_time',
      label: 'Hora de Check-in',
      type: 'text',
      placeholder: 'Ej: 14:00',
    },
    {
      key: 'checkout_time',
      label: 'Hora de Check-out',
      type: 'text',
      placeholder: 'Ej: 12:00',
    },
  ],

  hostal: [
    {
      key: 'total_beds',
      label: 'Total de camas',
      type: 'number',
      min: 1,
      placeholder: 'Ej: 20',
    },
    {
      key: 'has_shared_kitchen',
      label: '¿Cocina compartida?',
      type: 'checkbox',
    },
    {
      key: 'has_lockers',
      label: '¿Lockers disponibles?',
      type: 'checkbox',
    },
    {
      key: 'vibe',
      label: 'Ambiente',
      type: 'select',
      options: [
        { value: 'mochilero', label: '🎒 Mochilero' },
        { value: 'familiar', label: '👨‍👩‍👧 Familiar' },
        { value: 'social', label: '🎉 Social' },
        { value: 'tranquilo', label: '🧘 Tranquilo' },
      ],
    },
  ],

  lodge: [
    {
      key: 'lodge_type',
      label: 'Tipo de lodge',
      type: 'select',
      options: [
        { value: 'eco', label: '🌿 Eco-lodge' },
        { value: 'amazónico', label: '🌳 Amazónico' },
        { value: 'andino', label: '🏔️ Andino' },
        { value: 'costero', label: '🌊 Costero' },
      ],
    },
    {
      key: 'total_cabins',
      label: 'Número de cabañas',
      type: 'number',
      min: 1,
    },
    {
      key: 'is_off_grid',
      label: '¿Fuera de red eléctrica?',
      type: 'checkbox',
    },
    {
      key: 'surrounding_nature',
      label: 'Entorno natural',
      type: 'textarea',
      placeholder: 'Describe el ecosistema circundante...',
    },
  ],

  gastronomia: [
    {
      key: 'establishment_type',
      label: 'Tipo de establecimiento',
      type: 'select',
      options: [
        { value: 'restaurante', label: '🍽️ Restaurante' },
        { value: 'cafeteria', label: '☕ Cafetería / Panadería' },
        { value: 'food_truck', label: '🚐 Food Truck' },
        { value: 'bar', label: '🍷 Bar / Pub' },
        { value: 'pizzeria', label: '🍕 Pizzería' },
        { value: 'comida_rapida', label: '🍔 Comida Rápida' },
      ],
      required: true,
    },
    {
      key: 'cuisine_types',
      label: 'Especialidades o Tipos de cocina',
      type: 'text',
      placeholder: 'Ej: Postres, Mariscos, Pastas, Café...',
    },
    {
      key: 'seating_capacity',
      label: 'Capacidad (comensales)',
      type: 'number',
      min: 1,
    },
    {
      key: 'has_private_events',
      label: '¿Acepta eventos / grupos grandes?',
      type: 'checkbox',
    },
    {
      key: 'avg_ticket',
      label: 'Ticket promedio',
      type: 'number',
      min: 0,
      unit: 'USD',
    },
  ],

  agencia_transporte: [
    {
      key: 'vehicle_types',
      label: 'Tipos de vehículo (separados por coma)',
      type: 'text',
      placeholder: 'Ej: Van, Bus, 4x4',
    },
    {
      key: 'fleet_size',
      label: 'Tamaño de flota',
      type: 'number',
      min: 1,
    },
    {
      key: 'has_ac',
      label: '¿Aire acondicionado?',
      type: 'checkbox',
    },
    {
      key: 'max_passengers',
      label: 'Máximo de pasajeros',
      type: 'number',
      min: 1,
    },
    {
      key: 'coverage_areas',
      label: 'Áreas de cobertura',
      type: 'textarea',
      placeholder: 'Ciudades, rutas, regiones cubiertas...',
    },
  ],

  guia_turismo: [
    {
      key: 'license_number',
      label: 'N° de licencia de guía',
      type: 'text',
      placeholder: 'GT-000000',
      required: true,
    },
    {
      key: 'languages',
      label: 'Idiomas (separados por coma)',
      type: 'text',
      placeholder: 'Español, English, Français...',
    },
    {
      key: 'specializations',
      label: 'Especializaciones',
      type: 'textarea',
      placeholder: 'Avistamiento de aves, trekking, historia...',
    },
    {
      key: 'years_experience',
      label: 'Años de experiencia',
      type: 'number',
      min: 0,
      unit: 'años',
    },
    {
      key: 'is_certified_naturalist',
      label: '¿Naturalista certificado?',
      type: 'checkbox',
    },
  ],

  operadora: [
    {
      key: 'registration_number',
      label: 'N° de registro oficial',
      type: 'text',
      placeholder: 'OPER-000',
    },
    {
      key: 'operates_in',
      label: 'Destinos de operación',
      type: 'textarea',
      placeholder: 'Lista de destinos donde opera...',
    },
    {
      key: 'has_iata',
      label: '¿Tiene acreditación IATA?',
      type: 'checkbox',
    },
    {
      key: 'years_in_market',
      label: 'Años en el mercado',
      type: 'number',
      min: 0,
    },
  ],

  otro: [
    {
      key: 'service_description',
      label: 'Descripción del servicio',
      type: 'textarea',
      placeholder: 'Describe el tipo de servicio que ofrece...',
    },
  ],
};

export const PRODUCT_CATEGORY_FIELDS: CategoryFieldsMap = {
  alojamiento: [
    {
      key: 'room_type',
      label: 'Tipo de habitación',
      type: 'select',
      options: [
        { value: 'simple', label: 'Individual' },
        { value: 'doble', label: 'Doble' },
        { value: 'triple', label: 'Triple' },
        { value: 'suite', label: 'Suite' },
        { value: 'cabaña', label: 'Cabaña' },
        { value: 'dormitorio', label: 'Dormitorio compartido' },
      ],
      required: true,
    },
    {
      key: 'meal_plan',
      label: 'Plan de comidas',
      type: 'select',
      options: [
        { value: 'sin_comidas', label: 'Sin comidas' },
        { value: 'desayuno', label: 'Solo desayuno' },
        { value: 'media_pension', label: 'Media pensión' },
        { value: 'pension_completa', label: 'Pensión completa' },
        { value: 'todo_incluido', label: 'Todo incluido' },
      ],
    },
    {
      key: 'max_occupancy',
      label: 'Ocupación máxima',
      type: 'number',
      min: 1,
      unit: 'personas',
    },
    {
      key: 'has_private_bathroom',
      label: '¿Baño privado?',
      type: 'checkbox',
    },
    {
      key: 'has_ac',
      label: '¿Aire acondicionado?',
      type: 'checkbox',
    },
    {
      key: 'has_wifi',
      label: '¿WiFi incluido?',
      type: 'checkbox',
    },
  ],

  excursion: [
    {
      key: 'difficulty',
      label: 'Nivel de dificultad',
      type: 'select',
      options: [
        { value: 'facil', label: '🟢 Fácil' },
        { value: 'moderado', label: '🟡 Moderado' },
        { value: 'dificil', label: '🟠 Difícil' },
        { value: 'extremo', label: '🔴 Extremo' },
      ],
      required: true,
    },
    {
      key: 'meeting_point',
      label: 'Punto de encuentro',
      type: 'text',
      placeholder: 'Ej: Plaza Central, Hotel XYZ',
    },
    {
      key: 'what_to_bring',
      label: 'Qué llevar',
      type: 'textarea',
      placeholder: 'Ropa cómoda, agua, bloqueador...',
    },
    {
      key: 'min_age',
      label: 'Edad mínima',
      type: 'number',
      min: 0,
      unit: 'años',
    },
    {
      key: 'requires_fitness',
      label: '¿Requiere condición física?',
      type: 'checkbox',
    },
    {
      key: 'is_guided',
      label: '¿Cuenta con guía?',
      type: 'checkbox',
    },
  ],

  transfer: [
    {
      key: 'origin',
      label: 'Origen',
      type: 'text',
      placeholder: 'Ej: Aeropuerto Internacional',
      required: true,
    },
    {
      key: 'destination',
      label: 'Destino',
      type: 'text',
      placeholder: 'Ej: Hotel Centro',
      required: true,
    },
    {
      key: 'vehicle_type',
      label: 'Tipo de vehículo',
      type: 'select',
      options: [
        { value: 'sedán', label: '🚗 Sedán (1-3 pax)' },
        { value: 'van', label: '🚐 Van (4-8 pax)' },
        { value: 'bus', label: '🚌 Bus (9+ pax)' },
        { value: '4x4', label: '🚙 4x4' },
      ],
    },
    {
      key: 'is_shared',
      label: '¿Transfer compartido?',
      type: 'checkbox',
    },
    {
      key: 'distance_km',
      label: 'Distancia aproximada',
      type: 'number',
      min: 0,
      unit: 'km',
    },
  ],

  gastronomia: [
    {
      key: 'dish_category',
      label: 'Categoría del plato/snack',
      type: 'select',
      options: [
        { value: 'entrada', label: 'Entrada / Aperitivo' },
        { value: 'plato_fuerte', label: 'Plato Fuerte / Principal' },
        { value: 'postre', label: 'Postre' },
        { value: 'bebida', label: 'Bebida / Cóctel' },
        { value: 'snack', label: 'Snack / Bocadillo' },
        { value: 'combo', label: 'Combo / Menú completo' },
      ],
      required: true,
    },
    {
      key: 'portion_size',
      label: 'Tamaño de porción',
      type: 'text',
      placeholder: 'Ej: Individual, Para compartir (2 pax), Familiar...',
    },
    {
      key: main_ingredients,
      label: 'Ingredientes principales (separados por comas)',
      type: 'textarea',
      placeholder: 'Ej: Pollo, arroz, especias, salsa agridulce...',
    },
    {
      key: allergens,
      label: 'Alérgenos e ingredientes de riesgo',
      type: 'textarea',
      placeholder: 'Ej: Contiene maní, gluten, lactosa, mariscos...',
    },
    {
      key: 'dietary_options',
      label: 'Opciones alimentarias',
      type: 'select',
      options: [
        { value: 'none', label: 'Sin opciones específicas' },
        { value: 'vegetariano', label: 'Vegetariano' },
        { value: 'vegano', label: 'Vegano' },
        { value: 'sin_gluten', label: 'Sin Gluten (Celiacos)' },
        { value: 'sin_lactosa', label: 'Sin Lactosa' },
      ],
    },
    {
      key: 'includes_drinks',
      label: '¿Incluye bebidas?',
      type: 'checkbox',
    },
  ],

  actividad_aventura: [
    {
      key: 'activity_type',
      label: 'Tipo de actividad',
      type: 'select',
      options: [
        { value: 'rafting', label: '🛶 Rafting' },
        { value: 'escalada', label: '🧗 Escalada' },
        { value: 'parapente', label: '🪂 Parapente' },
        { value: 'kayak', label: '🚣 Kayak' },
        { value: 'zipline', label: '🤸 Zipline / Canopy' },
        { value: 'buceo', label: '🤿 Buceo / Snorkel' },
        { value: 'ciclismo', label: '🚵 Ciclismo de montaña' },
        { value: 'otro', label: 'Otro' },
      ],
      required: true,
    },
    {
      key: 'risk_level',
      label: 'Nivel de riesgo',
      type: 'select',
      options: [
        { value: 'bajo', label: '🟢 Bajo' },
        { value: 'medio', label: '🟡 Medio' },
        { value: 'alto', label: '🟠 Alto' },
        { value: 'extremo', label: '🔴 Extremo' },
      ],
    },
    {
      key: 'equipment_provided',
      label: '¿Equipo incluido?',
      type: 'checkbox',
    },
    {
      key: 'insurance_required',
      label: '¿Seguro requerido?',
      type: 'checkbox',
    },
    {
      key: 'weight_limit_kg',
      label: 'Límite de peso',
      type: 'number',
      min: 0,
      unit: 'kg',
    },
  ],

  tour_cultural: [
    {
      key: 'site_type',
      label: 'Tipo de sitio',
      type: 'select',
      options: [
        { value: 'arqueologico', label: '🏛️ Arqueológico' },
        { value: 'museo', label: '🖼️ Museo' },
        { value: 'comunidad', label: '👥 Comunidad indígena' },
        { value: 'religioso', label: '⛪ Religioso' },
        { value: 'patrimonio', label: '📜 Patrimonio histórico' },
      ],
    },
    {
      key: 'guide_language',
      label: 'Idioma del guía',
      type: 'text',
      placeholder: 'Español, English...',
    },
    {
      key: 'unesco_heritage',
      label: '¿Sitio Patrimonio UNESCO?',
      type: 'checkbox',
    },
    {
      key: 'photography_allowed',
      label: '¿Fotografía permitida?',
      type: 'checkbox',
    },
  ],

  paquete_combo: [
    {
      key: 'included_services',
      label: 'Servicios incluidos',
      type: 'textarea',
      placeholder: 'Lista detallada de servicios del paquete...',
      required: true,
    },
    {
      key: 'nights_count',
      label: 'Número de noches',
      type: 'number',
      min: 1,
    },
    {
      key: 'is_customizable',
      label: '¿Paquete personalizable?',
      type: 'checkbox',
    },
    {
      key: 'group_discount_pct',
      label: 'Descuento grupal (%)',
      type: 'number',
      min: 0,
      max: 100,
      unit: '%',
    },
  ],

  libre: [
    {
      key: 'activity_description',
      label: 'Descripción de la actividad libre',
      type: 'textarea',
      placeholder: 'Caminata libre, exploración, tiempo de descanso...',
    },
    {
      key: 'recommended_duration_h',
      label: 'Duración recomendada',
      type: 'number',
      min: 0,
      unit: 'horas',
    },
    {
      key: 'cost_reference',
      label: 'Costo de referencia (si aplica)',
      type: 'number',
      min: 0,
      unit: 'USD',
      helpText: 'Dejar en 0 si es totalmente gratuito',
    },
  ],
};

export const SUPPLIER_CATEGORY_META: Record<SupplierCategory, { label: string; emoji: string; color: string }> = {
  hotel: { label: 'Hotel', emoji: '🏨', color: 'sun' },
  hostal: { label: 'Hostal', emoji: '🛏️', color: 'sky' },
  lodge: { label: 'Lodge / Eco', emoji: '🌿', color: 'emerald' },
  gastronomia: { label: 'Gastronomía', emoji: '🍽️', color: 'violet' },
  agencia_transporte: { label: 'Transporte', emoji: '🚐', color: 'sky' },
  guia_turismo: { label: 'Guía', emoji: '🧭', color: 'sun' },
  operadora: { label: 'Operadora', emoji: '✈️', color: 'violet' },
  otro: { label: 'Otro', emoji: '📦', color: 'gray' },
};

export const PRODUCT_CATEGORY_META: Record<ProductCategory, { label: string; emoji: string; color: string }> = {
  alojamiento: { label: 'Alojamiento', emoji: '🏨', color: 'sun' },
  excursion: { label: 'Excursión', emoji: '🥾', color: 'emerald' },
  transfer: { label: 'Transfer', emoji: '🚌', color: 'sky' },
  gastronomia: { label: 'Gastronomía', emoji: '🍽️', color: 'violet' },
  actividad_aventura: { label: 'Aventura', emoji: '⚡', color: 'rose' },
  tour_cultural: { label: 'Tour Cultural', emoji: '🏛️', color: 'sun' },
  paquete_combo: { label: 'Paquete Combo', emoji: '📦', color: 'violet' },
  libre: { label: 'Actividad Libre', emoji: '🗺️', color: 'gray' },
};

export const SUPPLIER_CATEGORY_OPTIONS = Object.entries(SUPPLIER_CATEGORY_META).map(
  ([value, meta]) => ({ value, label: `${meta.emoji} ${meta.label}` })
);

export const PRODUCT_CATEGORY_OPTIONS = Object.entries(PRODUCT_CATEGORY_META).map(
  ([value, meta]) => ({ value, label: `${meta.emoji} ${meta.label}` })
);

export const STATUS_OPTIONS = [
  { value: 'activo', label: '✅ Activo' },
  { value: 'inactivo', label: '⏸️ Inactivo' },
  { value: 'pendiente', label: '⏳ Pendiente' },
];

export const PRODUCT_STATUS_OPTIONS = [
  { value: 'activo', label: '✅ Activo' },
  { value: 'inactivo', label: '⏸️ Inactivo' },
  { value: 'agotado', label: '🚫 Agotado' },
];

export const ROUTE_STATUS_OPTIONS = [
  { value: 'borrador', label: '📝 Borrador' },
  { value: 'activo', label: '✅ Activo' },
  { value: 'pausado', label: '⏸️ Pausado' },
  { value: 'archivado', label: '📦 Archivado' },
];

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - Dólar' },
  { value: 'PEN', label: 'PEN - Sol peruano' },
  { value: 'COP', label: 'COP - Peso colombiano' },
  { value: 'EUR', label: 'EUR - Euro' },
];
