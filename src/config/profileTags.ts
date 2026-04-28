// ============================================================
// ETIQUETAS DE PERFIL / AUDIENCIA — Sol y Vida Turismo
// Define "para quién" es un producto o ruta.
// Se asignan en productos y se usan como filtros en el
// constructor de rutas para armar paquetes por perfil.
// ============================================================

export interface ProfileTag {
  id: string;
  label: string;
  emoji: string;
}

export interface ProfileTagGroup {
  id: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
  tags: ProfileTag[];
}

// ── Grupos con sus tags ──────────────────────────────────

export const PROFILE_TAG_GROUPS: ProfileTagGroup[] = [
  {
    id: 'tipo_grupo',
    label: 'Tipo de Grupo',
    emoji: '👥',
    color: 'sky',
    description: 'Para qué tipo de grupo es ideal este producto',
    tags: [
      { id: 'parejas',      label: 'Parejas',           emoji: '💑' },
      { id: 'familiar',     label: 'Familiar',          emoji: '👨‍👩‍👧‍👦' },
      { id: 'amigos',       label: 'Amigos',            emoji: '🤝' },
      { id: 'corporativo',  label: 'Corporativo',       emoji: '💼' },
      { id: 'solo',         label: 'Solo / Mochilero',  emoji: '🎒' },
      { id: 'luna_de_miel', label: 'Luna de Miel',      emoji: '💍' },
      { id: 'escolar',      label: 'Escolar / Colegios',emoji: '🎓' },
    ],
  },
  {
    id: 'rango_edad',
    label: 'Rango de Edad',
    emoji: '🎂',
    color: 'violet',
    description: 'Edades recomendadas para esta actividad',
    tags: [
      { id: 'ninos',           label: 'Niños (6-12)',        emoji: '👦' },
      { id: 'adolescentes',    label: 'Adolescentes (13-17)', emoji: '🧑' },
      { id: 'jovenes',         label: 'Jóvenes (18-30)',     emoji: '🧑‍🦱' },
      { id: 'adultos',         label: 'Adultos (30-60)',     emoji: '🧔' },
      { id: 'adultos_mayores', label: 'Adultos Mayores (60+)', emoji: '👴' },
      { id: 'todas_edades',    label: 'Todas las Edades',    emoji: '🌈' },
    ],
  },
  {
    id: 'interes',
    label: 'Interés Principal',
    emoji: '🎯',
    color: 'amber',
    description: 'Qué tipo de experiencia busca el viajero',
    tags: [
      { id: 'aventura',       label: 'Aventura',         emoji: '⚡' },
      { id: 'relax',          label: 'Relax / Descanso', emoji: '🧘' },
      { id: 'cultural',       label: 'Cultural',         emoji: '🏛️' },
      { id: 'gastronomico',   label: 'Gastronómico',     emoji: '🍽️' },
      { id: 'fotografico',    label: 'Fotográfico',      emoji: '📸' },
      { id: 'religioso',      label: 'Religioso',        emoji: '⛪' },
      { id: 'naturaleza',     label: 'Naturaleza',       emoji: '🌿' },
      { id: 'deportivo',      label: 'Deportivo',        emoji: '🏃' },
    ],
  },
  {
    id: 'nivel_fisico',
    label: 'Nivel Físico',
    emoji: '💪',
    color: 'emerald',
    description: 'Condición física requerida',
    tags: [
      { id: 'nivel_bajo',     label: 'Bajo',     emoji: '🟢' },
      { id: 'nivel_moderado', label: 'Moderado', emoji: '🟡' },
      { id: 'nivel_alto',     label: 'Alto',     emoji: '🟠' },
      { id: 'nivel_extremo',  label: 'Extremo',  emoji: '🔴' },
    ],
  },
  {
    id: 'presupuesto',
    label: 'Presupuesto',
    emoji: '💰',
    color: 'rose',
    description: 'Nivel de inversión del viajero',
    tags: [
      { id: 'economico', label: 'Económico',  emoji: '💲' },
      { id: 'medio',     label: 'Medio',      emoji: '💵' },
      { id: 'premium',   label: 'Premium',    emoji: '💎' },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────

/** Todas las tags planas */
export const ALL_PROFILE_TAGS: ProfileTag[] = PROFILE_TAG_GROUPS.flatMap(g => g.tags);

/** Mapa rápido por ID */
export const PROFILE_TAG_MAP: Record<string, ProfileTag & { groupId: string; groupLabel: string; groupColor: string }> =
  Object.fromEntries(
    PROFILE_TAG_GROUPS.flatMap(g =>
      g.tags.map(t => [t.id, { ...t, groupId: g.id, groupLabel: g.label, groupColor: g.color }])
    )
  );

/** Obtener tags de un grupo */
export function getProfileTagsByGroup(groupId: string): ProfileTag[] {
  return PROFILE_TAG_GROUPS.find(g => g.id === groupId)?.tags || [];
}

/** Colores seguros para Tailwind */
export const PROFILE_COLOR_MAP: Record<string, { bg: string; text: string; bgSoft: string; border: string }> = {
  sky:     { bg: 'bg-[#D6A55C]',     text: 'text-[#D6A55C]',     bgSoft: 'bg-[#D6A55C]/10',     border: 'border-[#D6A55C]/30' },
  violet:  { bg: 'bg-violet-500',  text: 'text-violet-400',  bgSoft: 'bg-violet-500/10',  border: 'border-violet-500/30' },
  amber:   { bg: 'bg-[#A8442A]',   text: 'text-[#C84B2C]',   bgSoft: 'bg-[#A8442A]/10',   border: 'border-[#A8442A]/30' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', bgSoft: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  rose:    { bg: 'bg-rose-500',    text: 'text-rose-400',    bgSoft: 'bg-rose-500/10',    border: 'border-rose-500/30' },
};
