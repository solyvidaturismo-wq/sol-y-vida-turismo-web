import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import type { ToastType } from '../../store/useToastStore';

const TOAST_STYLES: Record<ToastType, { icon: typeof CheckCircle2; bg: string; border: string; text: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  error: { icon: XCircle, bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
  info: { icon: Info, bg: 'bg-sky-500/10', border: 'border-sky-500/20', text: 'text-sky-400' },
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((t) => {
        const style = TOAST_STYLES[t.type];
        const Icon = style.icon;

        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm shadow-xl animate-fade-in-up ${style.bg} ${style.border}`}
          >
            <Icon size={18} className={`${style.text} shrink-0 mt-0.5`} />
            <p className={`text-sm font-semibold flex-1 ${style.text}`}>{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-500 hover:text-white transition-colors shrink-0"
              aria-label="Cerrar notificación"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
