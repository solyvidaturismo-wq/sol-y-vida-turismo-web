// ============================================================
// CONFIG DEL LANDING PÚBLICO — Sol y Vida Turismo (/velez)
// ============================================================

// Número de WhatsApp del negocio (formato internacional sin +, sin espacios).
// Cambia este valor para redirigir todos los CTA del landing al número correcto.
export const LANDING_WHATSAPP_NUMBER = '573001234567';

export const LANDING_BUSINESS_NAME = 'Sol y Vida Turismo';

export function buildWhatsappUrl(productName?: string): string {
  const base = `https://wa.me/${LANDING_WHATSAPP_NUMBER}`;
  const text = productName
    ? `Hola ${LANDING_BUSINESS_NAME}, me interesa la experiencia "${productName}". ¿Podrían darme más información y disponibilidad?`
    : `Hola ${LANDING_BUSINESS_NAME}, me interesa reservar una experiencia. ¿Podrían ayudarme?`;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function formatDurationHuman(minutes?: number): string {
  if (!minutes || minutes <= 0) return 'A consultar';
  if (minutes >= 1440) {
    const days = Math.round(minutes / 1440);
    return `${days} ${days === 1 ? 'día' : 'días'}`;
  }
  if (minutes === 480) return 'Día completo';
  if (minutes === 240) return 'Medio día';
  if (minutes >= 60) {
    const hrs = minutes / 60;
    return `${hrs % 1 === 0 ? hrs : hrs.toFixed(1)} h`;
  }
  return `${minutes} min`;
}
