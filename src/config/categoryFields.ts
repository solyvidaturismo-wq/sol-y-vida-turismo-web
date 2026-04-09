// ============================================================
// CONFIG DE CAMPOS DINÁMICOS POR CATEGORÍA
// Motor de formularios adaptables - Sol y Vida Turismo
// ============================================================

import type { CategoryFieldsMap } from '../types';

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
      key: 'vibe',
      label: 'Ambiente',
      type: 'select',
      options: [
        { value: 'mochilero', label: '🎒 Mochilero' },
        { value: 'familiar', label: '👨‍👩‍👧 Familiar' },
        { value: 'tranquilo', label: '🧘 Tranquilo' },
      ],
    },
  ],

  gastronomia: [
    {
      key: 'establishment_type',
      label: 'Tipo de establecimiento',
      type: 'select',
      options: [
        { value: 'restaurante', label: '🍽️ Restaurante' },
        { value: 'cafeteria', label: '☕ Cafetería' },
        { value: 'bar', label: '🍷 Bar / Pub' },
      ],
      required: true,
    },
    {
      key: 'seating_capacity',
      label: 'Capacidad (comensales)',
      type: 'number',
      min: 1,
    },
  ],

  agencia_transporte: [
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
  ],

  guia_turismo: [
    {
      key: 'license_number',
      label: 'N° de licencia',
      type: 'text',
      required: true,
    },
    {
      key: 'languages',
      label: 'Idiomas',
      type: 'text',
      placeholder: 'Español, English...',
    },
  ],
  
  otro: [
    {
      key: 'service_description',
      label: 'Descripción',
      type: 'textarea',
    }
  ]
};

// ... (simplified for Batch limit)
export const PRODUCT_CATEGORY_FIELDS: CategoryFieldsMap = {
  alojamiento: [
    {
      key: 'room_type',
      label: 'Tipo de habitación',
      type: 'select',
      options: [
        { value: 'simple', label: 'Individual' },
        { value: 'doble', label: 'Doble' },
      ],
      required: true,
    }
  ],
  excursion: [
    {
       key: 'difficulty',
       label: 'Dificultad',
       type: 'select',
       options: [
         { value: 'facil', label: '🟢 Fácil' },
         { value: 'moderado', label: '🟡 Moderado' },
       ]
    }
  ]
};
