import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Users, Package, Map, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSuppliers, useProducts, useRoutes } from '../../store/useAppStore';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

type SearchResult = {
  id: string;
  type: 'supplier' | 'product' | 'route';
  name: string;
  subtitle: string;
  path: string;
};

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const suppliers = useSuppliers();
  const products = useProducts();
  const routes = useRoutes();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const supplierResults: SearchResult[] = suppliers
      .filter(s => s.name.toLowerCase().includes(q) || s.contact.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map(s => ({
        id: s.id,
        type: 'supplier',
        name: s.name,
        subtitle: `Proveedor · ${s.category}`,
        path: `/proveedores/${s.id}/detalle`
      }));

    const productResults: SearchResult[] = products
      .filter(p => p.name.toLowerCase().includes(q) || (p.short_description || '').toLowerCase().includes(q))
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        type: 'product',
        name: p.name,
        subtitle: `Producto · ${p.category} · ${p.currency} ${p.base_price}`,
        path: `/productos/${p.id}/detalle`
      }));

    const routeResults: SearchResult[] = routes
      .filter(r => r.name.toLowerCase().includes(q) || r.destination.toLowerCase().includes(q))
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        type: 'route',
        name: r.name,
        subtitle: `Ruta · ${r.destination} · ${r.duration_days} días`,
        path: `/rutas/${r.id}/detalle`
      }));

    return [...supplierResults, ...productResults, ...routeResults];
  }, [query, suppliers, products, routes]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'supplier': return <Users size={16} className="text-[#A8442A]" />;
      case 'product': return <Package size={16} className="text-[#D6A55C]" />;
      case 'route': return <Map size={16} className="text-emerald-500" />;
      default: return null;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <Search size={20} className="text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar proveedores, productos, rutas..."
            className="flex-1 bg-transparent text-white text-sm font-medium focus:outline-none placeholder:text-slate-600"
          />
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500 font-bold">Sin resultados para "{query}"</p>
            </div>
          )}

          {results.map(result => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleSelect(result)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                {getIcon(result.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-[#C84B2C] transition-colors">{result.name}</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">{result.subtitle}</p>
              </div>
              <ArrowRight size={14} className="text-slate-700 group-hover:text-[#A8442A] transition-colors shrink-0" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-600 font-bold">
          <span>ESC para cerrar</span>
          <span>{results.length} resultado{results.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}
