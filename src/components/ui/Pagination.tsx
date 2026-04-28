import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalItems, pageSize, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        Mostrando {from}-{to} de {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => {
            if (totalPages <= 7) return true;
            if (page === 1 || page === totalPages) return true;
            if (Math.abs(page - currentPage) <= 1) return true;
            return false;
          })
          .reduce<(number | 'dots')[]>((acc, page, i, arr) => {
            if (i > 0 && page - (arr[i - 1] as number) > 1) acc.push('dots');
            acc.push(page);
            return acc;
          }, [])
          .map((item, i) =>
            item === 'dots' ? (
              <span key={`dots-${i}`} className="text-slate-600 text-xs px-1">...</span>
            ) : (
              <button
                key={item}
                onClick={() => onPageChange(item as number)}
                className={`w-8 h-8 rounded-xl text-[10px] font-black uppercase transition-all ${
                  currentPage === item
                    ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {item}
              </button>
            )
          )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
