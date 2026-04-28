// ============================================================
// ETIQUETAS DE ACTIVIDAD — Sol y Vida Turismo
// Sistema centralizado de etiquetas con tiempos fijos.
// Se usan en productos, rutas e itinerarios para estandarizar
// duraciones y tipos de actividad.
// ============================================================

export interface ActivityTag {
  id: string;
  label: string;
  emoji: string;
  /** Grupo visual para agrupar en el selector */
  group: 'alimentacion' | 'aventura' | 'cultural' | 'naturaleza' | 'transporte' | 'descanso' | 'nocturno';
  /** Color del grupo (Tailwind safe) */
  color: string;
  /** Duración fija en minutos */
  duration_minutes: number;
  /** Franja horaria sugerida: rango de horas en que típicamente se realiza */
  suggested_start: string;  // "HH:mm"
  suggested_end: string;    // "HH:mm"
  /** Descripción corta para tooltips */
  description: string;
}

export interface ActivityTagGroup {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

// ── Grupos ────────────────────────────────────────────────

export const TAG_GROUPS: ActivityTagGroup[] = [
  { id: 'alimentacion', label: 'Alimentación',  emoji: '🍽️', color: 'rose' },
  { id: 'aventura',     label: 'Aventura',      emoji: '🧗', color: 'emerald' },
  { id: 'cultural',     label: 'Cultural',       emoji: '🏛️', color: 'violet' },
  { id: 'naturaleza',   label: 'Naturaleza',     emoji: '🌿', color: 'teal' },
  { id: 'transporte',   label: 'Transporte',     emoji: '🚐', color: 'sky' },
  { id: 'descanso',     label: 'Descanso',       emoji: '😴', color: 'slate' },
  { id: 'nocturno',     label: 'Nocturno',       emoji: '🌙', color: 'indigo' },
];

// ── Etiquetas ─────────────────────────────────────────────

export const ACTIVITY_TAGS: ActivityTag[] = [
  // ── Alimentación ──
  { id: 'desayuno',          label: 'Desayuno',                emoji: '☕',  group: 'alimentacion', color: 'rose',    duration_minutes: 60,  suggested_start: '06:30', suggested_end: '07:30', description: 'Desayuno en hotel o restaurante local' },
  { id: 'almuerzo',          label: 'Almuerzo',                emoji: '🍛',  group: 'alimentacion', color: 'rose',    duration_minutes: 90,  suggested_start: '12:00', suggested_end: '13:30', description: 'Almuerzo completo con plato principal' },
  { id: 'cena',              label: 'Cena',                    emoji: '🍷',  group: 'alimentacion', color: 'rose',    duration_minutes: 90,  suggested_start: '19:00', suggested_end: '20:30', description: 'Cena formal o típica regional' },
  { id: 'merienda',          label: 'Merienda / Snack',        emoji: '🧁',  group: 'alimentacion', color: 'rose',    duration_minutes: 30,  suggested_start: '15:30', suggested_end: '16:00', description: 'Pausa para refrigerio o snack' },
  { id: 'degustacion',       label: 'Degustación',             emoji: '🍫',  group: 'alimentacion', color: 'rose',    duration_minutes: 60,  suggested_start: '10:00', suggested_end: '11:00', description: 'Degustación de productos locales (bocadillo, guarapo, etc.)' },
  { id: 'comida_rapida',     label: 'Comida Rápida',           emoji: '🍔',  group: 'alimentacion', color: 'rose',    duration_minutes: 45,  suggested_start: '12:00', suggested_end: '12:45', description: 'Parada rápida para comer' },
  { id: 'picnic',            label: 'Picnic',                  emoji: '🧺',  group: 'alimentacion', color: 'rose',    duration_minutes: 60,  suggested_start: '12:00', suggested_end: '13:00', description: 'Almuerzo al aire libre tipo picnic' },

  // ── Aventura ──
  { id: 'caminata_corta',    label: 'Caminata Corta',          emoji: '🥾',  group: 'aventura',    color: 'emerald', duration_minutes: 120, suggested_start: '08:00', suggested_end: '10:00', description: 'Caminata ecológica de 1-2 horas' },
  { id: 'caminata_larga',    label: 'Caminata Larga',          emoji: '🏔️',  group: 'aventura',    color: 'emerald', duration_minutes: 300, suggested_start: '06:00', suggested_end: '11:00', description: 'Caminata de medio día o más (5+ horas)' },
  { id: 'senderismo',        label: 'Senderismo',              emoji: '🌲',  group: 'aventura',    color: 'emerald', duration_minutes: 240, suggested_start: '07:00', suggested_end: '11:00', description: 'Recorrido por senderos naturales (4 horas)' },
  { id: 'rappel',            label: 'Rappel',                  emoji: '🧗',  group: 'aventura',    color: 'emerald', duration_minutes: 180, suggested_start: '08:00', suggested_end: '11:00', description: 'Descenso por cuerdas en cascadas o cañones' },
  { id: 'torrentismo',       label: 'Torrentismo',             emoji: '💦',  group: 'aventura',    color: 'emerald', duration_minutes: 240, suggested_start: '07:00', suggested_end: '11:00', description: 'Descenso acuático por ríos y cascadas' },
  { id: 'escalada',          label: 'Escalada',                emoji: '🪨',  group: 'aventura',    color: 'emerald', duration_minutes: 180, suggested_start: '08:00', suggested_end: '11:00', description: 'Escalada en roca natural' },
  { id: 'cabalgata',         label: 'Cabalgata',               emoji: '🐴',  group: 'aventura',    color: 'emerald', duration_minutes: 150, suggested_start: '08:00', suggested_end: '10:30', description: 'Paseo a caballo por la región' },
  { id: 'ciclismo',          label: 'Ciclismo / MTB',          emoji: '🚴',  group: 'aventura',    color: 'emerald', duration_minutes: 180, suggested_start: '07:00', suggested_end: '10:00', description: 'Recorrido en bicicleta de montaña' },
  { id: 'canopy',            label: 'Canopy / Zip-line',       emoji: '🛤️',  group: 'aventura',    color: 'emerald', duration_minutes: 90,  suggested_start: '09:00', suggested_end: '10:30', description: 'Vuelo en cable por el dosel del bosque' },
  { id: 'espeleologia',      label: 'Espeleología',            emoji: '🕳️',  group: 'aventura',    color: 'emerald', duration_minutes: 180, suggested_start: '08:00', suggested_end: '11:00', description: 'Exploración de cuevas y cavernas' },

  // ── Cultural ──
  { id: 'recorrido_historico', label: 'Recorrido Histórico',   emoji: '🏛️',  group: 'cultural',    color: 'violet',  duration_minutes: 120, suggested_start: '09:00', suggested_end: '11:00', description: 'Tour guiado por sitios patrimoniales' },
  { id: 'visita_museo',      label: 'Visita a Museo',          emoji: '🖼️',  group: 'cultural',    color: 'violet',  duration_minutes: 90,  suggested_start: '10:00', suggested_end: '11:30', description: 'Recorrido por museo o galería' },
  { id: 'taller_artesanal',  label: 'Taller Artesanal',        emoji: '🎨',  group: 'cultural',    color: 'violet',  duration_minutes: 120, suggested_start: '14:00', suggested_end: '16:00', description: 'Taller práctico de artesanías locales' },
  { id: 'ruta_bocadillo',    label: 'Ruta del Bocadillo',      emoji: '🍬',  group: 'cultural',    color: 'violet',  duration_minutes: 150, suggested_start: '09:00', suggested_end: '11:30', description: 'Visita a fábricas artesanales de bocadillo veleño' },
  { id: 'visita_religiosa',  label: 'Visita Religiosa',        emoji: '⛪',  group: 'cultural',    color: 'violet',  duration_minutes: 60,  suggested_start: '08:00', suggested_end: '09:00', description: 'Visita a iglesias y templos coloniales' },
  { id: 'charla_historica',  label: 'Charla / Relato',         emoji: '📖',  group: 'cultural',    color: 'violet',  duration_minutes: 45,  suggested_start: '16:00', suggested_end: '16:45', description: 'Charla sobre historia comunera y tradición local' },

  // ── Naturaleza ──
  { id: 'avistamiento_aves', label: 'Avistamiento de Aves',    emoji: '🦜',  group: 'naturaleza',  color: 'teal',    duration_minutes: 180, suggested_start: '05:30', suggested_end: '08:30', description: 'Observación de aves en hábitat natural' },
  { id: 'cascada',           label: 'Visita a Cascada',        emoji: '🌊',  group: 'naturaleza',  color: 'teal',    duration_minutes: 150, suggested_start: '08:00', suggested_end: '10:30', description: 'Caminata hasta cascada con tiempo para disfrutar' },
  { id: 'mirador',           label: 'Mirador / Panorámica',    emoji: '🏞️',  group: 'naturaleza',  color: 'teal',    duration_minutes: 45,  suggested_start: '07:00', suggested_end: '07:45', description: 'Parada en mirador con vista panorámica' },
  { id: 'finca_agro',        label: 'Visita Finca / Agro',     emoji: '🌾',  group: 'naturaleza',  color: 'teal',    duration_minutes: 120, suggested_start: '09:00', suggested_end: '11:00', description: 'Recorrido por finca agrícola o ganadera' },
  { id: 'rio_piscina',       label: 'Río / Piscina Natural',   emoji: '🏊',  group: 'naturaleza',  color: 'teal',    duration_minutes: 120, suggested_start: '11:00', suggested_end: '13:00', description: 'Tiempo libre en río o charco natural' },
  { id: 'jardin_botanico',   label: 'Jardín Botánico',         emoji: '🌺',  group: 'naturaleza',  color: 'teal',    duration_minutes: 90,  suggested_start: '09:00', suggested_end: '10:30', description: 'Recorrido por jardín o reserva botánica' },

  // ── Transporte ──
  { id: 'traslado_corto',    label: 'Traslado Corto',          emoji: '🚗',  group: 'transporte',  color: 'sky',     duration_minutes: 30,  suggested_start: '07:00', suggested_end: '07:30', description: 'Desplazamiento local (< 30 min)' },
  { id: 'traslado_largo',    label: 'Traslado Largo',          emoji: '🚐',  group: 'transporte',  color: 'sky',     duration_minutes: 120, suggested_start: '06:00', suggested_end: '08:00', description: 'Desplazamiento entre municipios (1-2 horas)' },
  { id: 'traslado_intermunicipal', label: 'Traslado Intermunicipal', emoji: '🛣️', group: 'transporte', color: 'sky', duration_minutes: 180, suggested_start: '05:00', suggested_end: '08:00', description: 'Viaje largo entre ciudades (3+ horas)' },

  // ── Descanso ──
  { id: 'check_in',          label: 'Check-in Hotel',          emoji: '🏨',  group: 'descanso',    color: 'slate',   duration_minutes: 30,  suggested_start: '14:00', suggested_end: '14:30', description: 'Registro y acomodación en hotel' },
  { id: 'check_out',         label: 'Check-out Hotel',         emoji: '🧳',  group: 'descanso',    color: 'slate',   duration_minutes: 30,  suggested_start: '07:00', suggested_end: '07:30', description: 'Salida del hotel, recogida de equipaje' },
  { id: 'tiempo_libre',      label: 'Tiempo Libre',            emoji: '🕐',  group: 'descanso',    color: 'slate',   duration_minutes: 60,  suggested_start: '16:00', suggested_end: '17:00', description: 'Tiempo libre para descanso o exploración personal' },
  { id: 'descanso_hotel',    label: 'Descanso en Hotel',       emoji: '😴',  group: 'descanso',    color: 'slate',   duration_minutes: 90,  suggested_start: '13:00', suggested_end: '14:30', description: 'Pausa para descanso en alojamiento' },
  { id: 'compras',           label: 'Compras / Souvenirs',     emoji: '🛍️',  group: 'descanso',    color: 'slate',   duration_minutes: 60,  suggested_start: '17:00', suggested_end: '18:00', description: 'Tiempo para compras y recuerdos' },

  // ── Nocturno ──
  { id: 'fogata',            label: 'Fogata / Noche Cultural', emoji: '🔥',  group: 'nocturno',    color: 'indigo',  duration_minutes: 120, suggested_start: '19:30', suggested_end: '21:30', description: 'Fogata con música, historias o actividad nocturna' },
  { id: 'caminata_nocturna', label: 'Caminata Nocturna',       emoji: '🌙',  group: 'nocturno',    color: 'indigo',  duration_minutes: 90,  suggested_start: '19:00', suggested_end: '20:30', description: 'Recorrido nocturno con guía' },
  { id: 'observacion_estrellas', label: 'Observación de Estrellas', emoji: '⭐', group: 'nocturno', color: 'indigo',  duration_minutes: 60,  suggested_start: '20:00', suggested_end: '21:00', description: 'Observación astronómica en cielo limpio' },
];

// ── Helpers ───────────────────────────────────────────────

/** Mapa rápido por ID */
export const ACTIVITY_TAG_MAP: Record<string, ActivityTag> = Object.fromEntries(
  ACTIVITY_TAGS.map(tag => [tag.id, tag])
);

/** Obtener tags por grupo */
export function getTagsByGroup(group: ActivityTag['group']): ActivityTag[] {
  return ACTIVITY_TAGS.filter(t => t.group === group);
}

/** Dado un tag ID, devuelve la duración formateada */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

/** Devuelve la hora fin sugerida dado un start_time y un tag */
export function getSuggestedEndTime(startTime: string, tagId: string): string {
  const tag = ACTIVITY_TAG_MAP[tagId];
  if (!tag || !startTime) return '';
  const [h, m] = startTime.split(':').map(Number);
  const totalMin = h * 60 + m + tag.duration_minutes;
  const endH = Math.floor(totalMin / 60) % 24;
  const endM = totalMin % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

/** Colores seguros para Tailwind */
export const TAG_COLOR_MAP: Record<string, { bg: string; text: string; bgSoft: string; border: string }> = {
  rose:    { bg: 'bg-rose-500',    text: 'text-rose-400',    bgSoft: 'bg-rose-500/10',    border: 'border-rose-500/30' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', bgSoft: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  violet:  { bg: 'bg-violet-500',  text: 'text-violet-400',  bgSoft: 'bg-violet-500/10',  border: 'border-violet-500/30' },
  teal:    { bg: 'bg-teal-500',    text: 'text-teal-400',    bgSoft: 'bg-teal-500/10',    border: 'border-teal-500/30' },
  sky:     { bg: 'bg-sky-500',     text: 'text-sky-400',     bgSoft: 'bg-sky-500/10',     border: 'border-sky-500/30' },
  slate:   { bg: 'bg-slate-500',   text: 'text-slate-400',   bgSoft: 'bg-slate-500/10',   border: 'border-slate-500/30' },
  indigo:  { bg: 'bg-indigo-500',  text: 'text-indigo-400',  bgSoft: 'bg-indigo-500/10',  border: 'border-indigo-500/30' },
  amber:   { bg: 'bg-amber-500',   text: 'text-amber-400',   bgSoft: 'bg-amber-500/10',   border: 'border-amber-500/30' },
};
