// ============================================================
// ItineraryBuilderPage.tsx — Constructor de Itinerario Drag & Drop
// Fase 4: dnd-kit con panel catálogo + zonas por día
// ============================================================

import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeft,
  Plus,
  Search,
  GripVertical,
  X as XIcon,
  Clock,
  Package,
  Building2,
  ChevronDown,
  ChevronRight,
  Layers,
  Save,
  CheckCheck,
  Users,
  Filter,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useAppStore, useProductTags } from '../store/useAppStore';
import { PRODUCT_CATEGORY_META, SUPPLIER_CATEGORY_META } from '../config/categoryFields';
import {
  PROFILE_TAG_GROUPS, PROFILE_COLOR_MAP, PROFILE_TAG_MAP,
} from '../config/profileTags';
import type { ItineraryItem } from '../types';

// ---- Types ----
type CatalogEntry = {
  id: string;
  name: string;
  kind: 'product' | 'supplier';
  category: string;
  emoji: string;
  price?: number;
  currency?: string;
  duration?: number;
  start_time?: string;
  end_time?: string;
};

type ActiveDrag = {
  entry: CatalogEntry;
  source: 'catalog' | 'itinerary';
  itineraryItemId?: string;
};

// ---- Helpers ----
const minutesToLabel = (mins: number) => {
  if (mins < 60) return `${mins}min`;
  if (mins < 1440) return `${mins / 60}h`;
  return '1 día';
};

// ---- Catalog Item (Draggable from left panel) ----
function CatalogItem({ entry }: { entry: CatalogEntry }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `catalog::${entry.id}`,
    data: { type: 'catalog', entry },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-start gap-2 p-2.5 rounded-xl cursor-grab active:cursor-grabbing transition-all select-none"
      style={{
        background: isDragging ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isDragging ? 'rgba(14,165,233,0.3)' : 'rgba(255,255,255,0.06)'}`,
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(0.98)' : undefined,
      }}
    >
      <span className="text-base flex-shrink-0 mt-0.5">{entry.emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold leading-tight truncate" style={{ color: 'var(--color-text-primary)' }}>
          {entry.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {entry.price !== undefined && (
            <span className="text-[10px] font-bold" style={{ color: '#fbbf24' }}>
              ${entry.price} {entry.currency}
            </span>
          )}
          {entry.duration && (
            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              {minutesToLabel(entry.duration)}
            </span>
          )}
        </div>
      </div>
      <GripVertical size={13} className="flex-shrink-0 mt-1" style={{ color: 'var(--color-text-muted)' }} />
    </div>
  );
}

// ---- Sortable Itinerary Item (inside a day zone) ----
function ItineraryCard({
  item,
  resolvedName,
  resolvedEmoji,
  resolvedProduct,
  resolvedSupplier,
  onRemove,
  onUpdateNotes,
  onUpdateTime,
  onToggleOptional,
  onToggleIncluded,
}: {
  item: ItineraryItem;
  resolvedName: string;
  resolvedEmoji: string;
  resolvedProduct?: any;
  resolvedSupplier?: any;
  onRemove: () => void;
  onUpdateNotes: (notes: string) => void;
  onUpdateTime: (field: 'time_start' | 'time_end', val: string) => void;
  onToggleOptional: () => void;
  onToggleIncluded: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { type: 'itinerary', item },
  });

  const [expanded, setExpanded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl overflow-hidden"
    >
      <div
        className="flex items-center gap-2 p-2.5"
        style={{
          background: isDragging ? 'rgba(14,165,233,0.08)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isDragging ? 'rgba(14,165,233,0.25)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: expanded ? '12px 12px 0 0' : '12px',
        }}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing flex-shrink-0 p-0.5"
          style={{ color: 'var(--color-text-muted)', touchAction: 'none' }}
          tabIndex={-1}
        >
          <GripVertical size={14} />
        </button>

        <span className="text-base flex-shrink-0">{resolvedEmoji}</span>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
            {resolvedName}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {item.time_start && (
              <span className="text-[10px] flex items-center gap-0.5" style={{ color: '#38bdf8' }}>
                <Clock size={9} />
                {item.time_start}{item.time_end ? ` – ${item.time_end}` : ''}
              </span>
            )}
            {item.is_optional && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
                Opcional
              </span>
            )}
            {!item.included_in_price && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(244,63,94,0.12)', color: '#fb7185' }}>
                Extra
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className="btn-ghost p-0.5 flex-shrink-0"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="btn-ghost p-0.5 flex-shrink-0"
          style={{ color: '#f43f5e' }}
        >
          <XIcon size={13} />
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="p-3 space-y-3"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
          }}
        >
          {/* Info Componente */}
          {resolvedProduct && (
            <div className="flex gap-3 overflow-hidden items-start pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {resolvedProduct.images?.[0] ? (
                <img src={resolvedProduct.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 flex-shrink-0 rounded-lg flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>{resolvedEmoji}</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {resolvedProduct.short_description || resolvedProduct.description || 'Sin descripción detallada.'}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                  {resolvedProduct.duration_minutes > 0 && <span>⏱️ {resolvedProduct.duration_minutes} min</span>}
                  {resolvedProduct.base_price > 0 && <span className="font-bold text-[#C84B2C]">💰 ${resolvedProduct.base_price} {resolvedProduct.currency}</span>}
                </div>
              </div>
            </div>
          )}
          {resolvedSupplier && (
            <div className="flex gap-3 overflow-hidden items-start pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {resolvedSupplier.logo ? (
                <img src={resolvedSupplier.logo} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 flex-shrink-0 rounded-lg flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>{resolvedEmoji}</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                  📍 {resolvedSupplier.location.city} | {resolvedSupplier.location.address}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                  <span>📞 {resolvedSupplier.contact.name} ({resolvedSupplier.contact.phone})</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="form-label text-[10px]">Hora inicio</label>
              <input
                type="time"
                className="form-input text-xs"
                style={{ colorScheme: 'dark' }}
                value={item.time_start || ''}
                onChange={e => onUpdateTime('time_start', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label text-[10px]">Hora fin</label>
              <input
                type="time"
                className="form-input text-xs"
                style={{ colorScheme: 'dark' }}
                value={item.time_end || ''}
                onChange={e => onUpdateTime('time_end', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="form-label text-[10px]">Notas internas</label>
            <input
              type="text"
              className="form-input text-xs"
              placeholder="Instrucciones, punto de encuentro..."
              value={item.notes || ''}
              onChange={e => onUpdateNotes(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>
              <input
                type="checkbox"
                checked={item.is_optional}
                onChange={onToggleOptional}
                className="accent-[#C84B2C] w-3.5 h-3.5"
              />
              ¿Opcional?
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>
              <input
                type="checkbox"
                checked={item.included_in_price}
                onChange={onToggleIncluded}
                className="accent-emerald-400 w-3.5 h-3.5"
              />
              Incluido en precio
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Day Zone (Droppable) ----
function DayZone({
  day,
  items,
  resolveItem,
  onRemove,
  onUpdateNotes,
  onUpdateTime,
  onToggleOptional,
  onToggleIncluded,
}: {
  day: number;
  items: ItineraryItem[];
  resolveItem: (item: ItineraryItem) => { name: string; emoji: string; product?: any; supplier?: any };
  onRemove: (itemId: string) => void;
  onUpdateNotes: (itemId: string, notes: string) => void;
  onUpdateTime: (itemId: string, field: 'time_start' | 'time_end', val: string) => void;
  onToggleOptional: (itemId: string) => void;
  onToggleIncluded: (itemId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `day::${day}` });
  const itemIds = items.map(i => i.id);

  return (
    <div className="flex-1 min-w-[260px] max-w-[340px]">
      {/* Day header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 rounded-t-2xl"
        style={{
          background: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderBottom: 'none',
        }}
      >
        <h3 className="text-sm font-bold" style={{ color: '#fbbf24' }}>
          Día {day}
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
          {items.length} actividad{items.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className="rounded-b-2xl transition-all"
        style={{
          minHeight: '120px',
          background: isOver ? 'rgba(14,165,233,0.07)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${isOver ? 'rgba(14,165,233,0.3)' : 'rgba(255,255,255,0.07)'}`,
          padding: '10px',
        }}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map(item => {
              const { name, emoji, product, supplier } = resolveItem(item);
              return (
                <ItineraryCard
                  key={item.id}
                  item={item}
                  resolvedName={name}
                  resolvedEmoji={emoji}
                  resolvedProduct={product}
                  resolvedSupplier={supplier}
                  onRemove={() => onRemove(item.id)}
                  onUpdateNotes={(notes) => onUpdateNotes(item.id, notes)}
                  onUpdateTime={(field, val) => onUpdateTime(item.id, field, val)}
                  onToggleOptional={() => onToggleOptional(item.id)}
                  onToggleIncluded={() => onToggleIncluded(item.id)}
                />
              );
            })}
          </div>
        </SortableContext>

        {items.length === 0 && (
          <div
            className="flex flex-col items-center justify-center h-24 text-center rounded-xl"
            style={{
              background: isOver ? 'rgba(14,165,233,0.05)' : 'transparent',
              border: isOver ? '2px dashed rgba(14,165,233,0.4)' : '2px dashed rgba(255,255,255,0.06)',
            }}
          >
            <p className="text-xs" style={{ color: isOver ? '#38bdf8' : 'var(--color-text-muted)' }}>
              {isOver ? '🎯 Soltar aquí' : 'Arrastra actividades aquí'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Drag Overlay Ghost ----
function DragGhost({ entry }: { entry: CatalogEntry }) {
  return (
    <div
      className="flex items-center gap-2 p-3 rounded-xl shadow-2xl"
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid rgba(14,165,233,0.4)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(14,165,233,0.2)',
        minWidth: '200px',
        cursor: 'grabbing',
      }}
    >
      <span className="text-lg">{entry.emoji}</span>
      <div>
        <p className="text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>{entry.name}</p>
        {entry.price !== undefined && (
          <p className="text-[10px]" style={{ color: '#fbbf24' }}>${entry.price} {entry.currency}</p>
        )}
      </div>
    </div>
  );
}

// ---- Main Page ----
export default function ItineraryBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const updateRoute = useAppStore(s => s.updateRoute);
  const addItineraryItem = useAppStore(s => s.addItineraryItem);
  const removeItineraryItem = useAppStore(s => s.removeItineraryItem);
  const updateItineraryItem = useAppStore(s => s.updateItineraryItem);
  const reorderItinerary = useAppStore(s => s.reorderItinerary);
  const products = useAppStore(s => s.products);
  const suppliers = useAppStore(s => s.suppliers);
  const allProductTags = useProductTags();

  const route = useAppStore(s => id ? s.routes.find(r => r.id === id) : undefined);

  const [search, setSearch] = useState('');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'product' | 'supplier'>('all');
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeProfileFilters, setActiveProfileFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilter = (tagId: string) => {
    setActiveProfileFilters(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Build catalog entries
  const catalogEntries = useMemo<CatalogEntry[]>(() => {
    const prods: CatalogEntry[] = products.map(p => {
      let resolvedEndTime = p.availability?.end_time;

      // Auto-calculate end_time if start_time and duration exist but end_time is empty
      if (!resolvedEndTime && p.availability?.start_time && p.duration_minutes) {
        const [hours, mins] = p.availability.start_time.split(':').map(Number);
        if (!isNaN(hours) && !isNaN(mins)) {
          const totalMins = hours * 60 + mins + p.duration_minutes;
          const endH = Math.floor(totalMins / 60) % 24;
          const endM = totalMins % 60;
          resolvedEndTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
        }
      }

      return {
        id: p.id,
        name: p.name,
        kind: 'product',
        category: p.category,
        emoji: PRODUCT_CATEGORY_META[p.category]?.emoji || '📦',
        price: p.base_price,
        currency: p.currency,
        duration: p.duration_minutes,
        start_time: p.availability?.start_time,
        end_time: resolvedEndTime,
      };
    });
    const sups: CatalogEntry[] = suppliers.map(s => ({
      id: s.id,
      name: s.name,
      kind: 'supplier',
      category: s.category,
      emoji: SUPPLIER_CATEGORY_META[s.category]?.emoji || '🏢',
    }));
    return [...prods, ...sups];
  }, [products, suppliers]);

  const filteredCatalog = catalogEntries.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase());
    const matchKind = catalogFilter === 'all' || e.kind === catalogFilter;
    if (!matchSearch || !matchKind) return false;

    // Apply profile tag filters (only for products)
    if (activeProfileFilters.length > 0) {
      if (e.kind === 'supplier') return false; // suppliers don't have profile tags
      const pt = allProductTags.filter(pt => pt.product_id === e.id).map(pt => pt.tag_id);
      if (!activeProfileFilters.every(f => pt.includes(f))) return false;
    }

    return true;
  });

  // Resolve item display data
  const resolveItem = (item: ItineraryItem): { name: string; emoji: string; product?: any; supplier?: any } => {
    if (item.ref_type === 'product') {
      const p = products.find(p => p.id === item.ref_id);
      return {
        name: p?.name || 'Producto eliminado',
        emoji: p ? (PRODUCT_CATEGORY_META[p.category]?.emoji || '📦') : '❓',
        product: p,
      };
    } else {
      const s = suppliers.find(s => s.id === item.ref_id);
      return {
        name: s?.name || 'Proveedor eliminado',
        emoji: s ? (SUPPLIER_CATEGORY_META[s.category]?.emoji || '🏢') : '❓',
        supplier: s,
      };
    }
  };

  // Group itinerary by day
  const days = Array.from({ length: route?.duration_days || 1 }, (_, i) => i + 1);
  const itemsByDay = (day: number) =>
    (route?.itinerary || [])
      .filter(i => i.day === day)
      .sort((a, b) => a.order - b.order);

  // ---- Drag handlers ----
  const handleDragStart = (event: DragStartEvent) => {
    const { data } = event.active;
    if (data.current?.type === 'catalog') {
      setActiveDrag({ entry: data.current.entry, source: 'catalog' });
    } else if (data.current?.type === 'itinerary') {
      const item: ItineraryItem = data.current.item;
      const { name, emoji } = resolveItem(item);
      setActiveDrag({
        entry: {
          id: item.ref_id,
          name,
          emoji,
          kind: item.ref_type,
          category: '',
        },
        source: 'itinerary',
        itineraryItemId: item.id,
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDrag(null);

    if (!over || !id || !route) return;

    const activeData = active.data.current;
    const overId = String(over.id);

    // --- DROP FROM CATALOG → DAY ZONE ---
    if (activeData?.type === 'catalog' && overId.startsWith('day::')) {
      const day = parseInt(overId.split('::')[1], 10);
      const entry: CatalogEntry = activeData.entry;
      const existingDay = itemsByDay(day);
      addItineraryItem(id, {
        ref_id: entry.id,
        ref_type: entry.kind,
        day,
        order: existingDay.length + 1,
        is_optional: false,
        included_in_price: true,
        time_start: entry.start_time || undefined,
        time_end: entry.end_time || undefined,
      } as any).catch(err => console.error('Error adding itinerary item:', err));
      return;
    }

    // --- DROP CATALOG ITEM onto an EXISTING ITINERARY ITEM (target is in a day) ---
    if (activeData?.type === 'catalog') {
      // Find which day the over item belongs to
      const overItem = route.itinerary.find(i => i.id === overId);
      if (overItem) {
        const existingDay = itemsByDay(overItem.day);
        addItineraryItem(id, {
          ref_id: activeData.entry.id,
          ref_type: activeData.entry.kind,
          day: overItem.day,
          order: existingDay.length + 1,
          is_optional: false,
          included_in_price: true,
          time_start: activeData.entry.start_time || undefined,
          time_end: activeData.entry.end_time || undefined,
        } as any).catch(err => console.error('Error adding itinerary item:', err));
      }
      return;
    }

    // --- REORDER WITHIN DAY ---
    if (activeData?.type === 'itinerary' && !overId.startsWith('day::')) {
      const activeItem = route.itinerary.find(i => i.id === active.id);
      const overItem = route.itinerary.find(i => i.id === over.id);

      if (!activeItem || !overItem || activeItem.day !== overItem.day) return;

      const dayItems = itemsByDay(activeItem.day);
      const oldIndex = dayItems.findIndex(i => i.id === active.id);
      const newIndex = dayItems.findIndex(i => i.id === over.id);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      const reordered = arrayMove(dayItems, oldIndex, newIndex).map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));

      const newItinerary = [
        ...route.itinerary.filter(i => i.day !== activeItem.day),
        ...reordered,
      ];
      reorderItinerary(id, newItinerary as any).catch(err => console.error('Error reordering itinerary:', err));
      return;
    }

    // --- MOVE BETWEEN DAYS (drag itinerary item to another day zone) ---
    if (activeData?.type === 'itinerary' && overId.startsWith('day::')) {
      const targetDay = parseInt(overId.split('::')[1], 10);
      const activeItem = route.itinerary.find(i => i.id === active.id);
      if (!activeItem || activeItem.day === targetDay) return;

      const targetDayItems = itemsByDay(targetDay);
      const newItinerary = route.itinerary.map(i =>
        i.id === activeItem.id
          ? { ...i, day: targetDay, order: targetDayItems.length + 1 }
          : i
      );
      reorderItinerary(id, newItinerary as any).catch(err => console.error('Error moving item between days:', err));
    }
  };

  const handleItemRemove = async (itemId: string) => {
    if (id) {
      try {
        await removeItineraryItem(id, itemId);
      } catch (err) {
        console.error('Error removing itinerary item:', err);
      }
    }
  };

  const handleUpdateNotes = async (itemId: string, notes: string) => {
    if (id) {
      try {
        await updateItineraryItem(id, itemId, { notes });
      } catch (err) {
        console.error('Error updating itinerary notes:', err);
      }
    }
  };

  const handleUpdateTime = async (itemId: string, field: 'time_start' | 'time_end', val: string) => {
    if (id) {
      try {
        await updateItineraryItem(id, itemId, { [field]: val || undefined });
      } catch (err) {
        console.error('Error updating itinerary time:', err);
      }
    }
  };

  const handleToggleOptional = async (itemId: string) => {
    if (!route || !id) return;
    const item = route.itinerary.find(i => i.id === itemId);
    if (item) {
      try {
        await updateItineraryItem(id, itemId, { is_optional: !item.is_optional });
      } catch (err) {
        console.error('Error toggling optional:', err);
      }
    }
  };

  const handleToggleIncluded = async (itemId: string) => {
    if (!route || !id) return;
    const item = route.itinerary.find(i => i.id === itemId);
    if (item) {
      try {
        await updateItineraryItem(id, itemId, { included_in_price: !item.included_in_price });
      } catch (err) {
        console.error('Error toggling included:', err);
      }
    }
  };

  const handleSave = async () => {
    if (id && route) {
      try {
        await updateRoute(id, { updated_at: new Date().toISOString() });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (err) {
        console.error('Error saving itinerary:', err);
      }
    }
  };

  const handleAddDay = async () => {
    if (id && route) {
      try {
        await updateRoute(id, { duration_days: (route.duration_days || 1) + 1 });
      } catch (err) {
        console.error('Error adding day:', err);
      }
    }
  };

  if (!route) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Ruta no encontrada
        </p>
        <button onClick={() => navigate('/rutas')} className="btn-secondary">
          ← Volver a Rutas
        </button>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {/* Header */}
      <div className="page-header mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/rutas')} className="btn-ghost p-2">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">Constructor de Itinerario</h1>
            <p className="page-subtitle">
              {route.name} ·{' '}
              <span style={{ color: 'var(--color-brand-sun)' }}>{route.duration_days} días</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/rutas/${id}/editar`} className="btn-secondary" style={{ textDecoration: 'none' }}>
            ← Editar info
          </Link>
          <button
            onClick={handleSave}
            className="btn-primary"
            style={saved ? { background: 'linear-gradient(135deg, #10b981, #06b6d4)' } : undefined}
          >
            {saved ? <CheckCheck size={15} /> : <Save size={15} />}
            {saved ? '¡Guardado!' : 'Guardar itinerario'}
          </button>
        </div>
      </div>

      {/* Stats & Pricing bar */}
      {(() => {
        const itineraryProducts = (route.itinerary || [])
          .filter(i => i.ref_type === 'product')
          .map(i => products.find(p => p.id === i.ref_id))
          .filter(Boolean);

        const totalCost = itineraryProducts.reduce((sum, p) => sum + (p!.base_price || 0), 0);
        const currency = route.pricing?.currency || 'COP';
        const sellingPrice = route.pricing?.base_price_per_pax || 0;
        const margin = sellingPrice > 0 ? ((sellingPrice - totalCost) / sellingPrice * 100) : 0;

        return (
          <div
            className="flex items-center gap-4 px-5 py-3 rounded-2xl mb-4 text-xs flex-wrap justify-between"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                <Layers size={13} />
                <strong style={{ color: 'var(--color-text-secondary)' }}>{route.itinerary.length}</strong> items
              </div>
              <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                <Package size={13} />
                <strong style={{ color: 'var(--color-text-secondary)' }}>
                  {route.itinerary.filter(i => i.ref_type === 'product').length}
                </strong> productos
              </div>
              <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                <Building2 size={13} />
                <strong style={{ color: 'var(--color-text-secondary)' }}>
                  {route.itinerary.filter(i => i.ref_type === 'supplier').length}
                </strong> proveedores
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Costo total del itinerario */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)' }}>
                <DollarSign size={13} style={{ color: '#38bdf8' }} />
                <span style={{ color: 'var(--color-text-muted)' }}>Costo:</span>
                <strong style={{ color: '#38bdf8' }}>{currency} {totalCost.toLocaleString()}</strong>
              </div>

              {/* Precio de venta */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <DollarSign size={13} style={{ color: '#10b981' }} />
                <span style={{ color: 'var(--color-text-muted)' }}>Venta:</span>
                <strong style={{ color: '#10b981' }}>{currency} {sellingPrice.toLocaleString()}</strong>
              </div>

              {/* Margen */}
              {sellingPrice > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{
                  background: margin >= 20 ? 'rgba(16,185,129,0.08)' : margin >= 0 ? 'rgba(245,158,11,0.08)' : 'rgba(244,63,94,0.08)',
                  border: `1px solid ${margin >= 20 ? 'rgba(16,185,129,0.15)' : margin >= 0 ? 'rgba(245,158,11,0.15)' : 'rgba(244,63,94,0.15)'}`,
                }}>
                  <TrendingUp size={13} style={{ color: margin >= 20 ? '#10b981' : margin >= 0 ? '#f59e0b' : '#f43f5e' }} />
                  <strong style={{ color: margin >= 20 ? '#10b981' : margin >= 0 ? '#f59e0b' : '#f43f5e' }}>
                    {margin.toFixed(0)}%
                  </strong>
                  <span style={{ color: 'var(--color-text-muted)' }}>margen</span>
                </div>
              )}

              {/* Botón para actualizar precio de venta al costo */}
              {totalCost > 0 && totalCost !== sellingPrice && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await updateRoute(id!, {
                        pricing: { ...route.pricing, base_price_per_pax: totalCost },
                      } as any);
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    } catch (err) {
                      console.error('Error updating price:', err);
                    }
                  }}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                  style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}
                  title="Establece el precio de venta igual al costo del itinerario"
                >
                  Igualar a costo
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Main split layout */}
      <div className="flex gap-4" style={{ height: 'calc(100vh - 220px)', minHeight: '480px' }}>

        {/* ---- LEFT: CATALOG ---- */}
        <div
          className="flex-shrink-0 flex flex-col rounded-2xl overflow-hidden shadow-sm"
          style={{
            width: '260px',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Catalog header */}
          <div className="p-3 flex flex-col gap-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                📋 Catálogo
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all"
                style={{
                  background: showFilters || activeProfileFilters.length > 0 ? 'rgba(139,92,246,0.15)' : 'transparent',
                  color: showFilters || activeProfileFilters.length > 0 ? '#a78bfa' : 'var(--color-text-muted)',
                  border: `1px solid ${showFilters || activeProfileFilters.length > 0 ? 'rgba(139,92,246,0.25)' : 'transparent'}`,
                }}
              >
                <Filter size={10} />
                {activeProfileFilters.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-violet-500 text-white text-[8px] flex items-center justify-center">{activeProfileFilters.length}</span>
                )}
              </button>
            </div>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                className="form-input text-xs"
                style={{ paddingLeft: '1.75rem' }}
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-1">
              {(['all', 'product', 'supplier'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setCatalogFilter(f)}
                  className="flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                  style={{
                    background: catalogFilter === f ? 'rgba(245,158,11,0.15)' : 'transparent',
                    color: catalogFilter === f ? '#fbbf24' : 'var(--color-text-muted)',
                    border: `1px solid ${catalogFilter === f ? 'rgba(245,158,11,0.25)' : 'transparent'}`,
                  }}
                >
                  {f === 'all' ? 'Todo' : f === 'product' ? '📦 Prods' : '🏢 Provs'}
                </button>
              ))}
            </div>

            {/* Active filter pills */}
            {activeProfileFilters.length > 0 && !showFilters && (
              <div className="flex flex-wrap gap-1">
                {activeProfileFilters.map(tagId => {
                  const info = PROFILE_TAG_MAP[tagId];
                  if (!info) return null;
                  return (
                    <button key={tagId} onClick={() => toggleFilter(tagId)}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/20 hover:opacity-80 transition-all">
                      {info.emoji} {info.label} <XIcon size={8} />
                    </button>
                  );
                })}
                <button onClick={() => setActiveProfileFilters([])}
                  className="text-[8px] font-bold text-rose-400 hover:text-rose-300 px-1">✕ Limpiar</button>
              </div>
            )}
          </div>

          {/* Profile tag filters panel */}
          {showFilters && (
            <div className="p-3 space-y-3 overflow-y-auto max-h-64" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#a78bfa' }}>
                  <Users size={11} /> Filtro por Perfil
                </p>
                {activeProfileFilters.length > 0 && (
                  <button onClick={() => setActiveProfileFilters([])}
                    className="text-[9px] font-bold text-rose-400 hover:text-rose-300">
                    Limpiar
                  </button>
                )}
              </div>
              {PROFILE_TAG_GROUPS.map(group => {
                const colors = PROFILE_COLOR_MAP[group.color];
                return (
                  <div key={group.id} className="space-y-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                      {group.emoji} {group.label}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {group.tags.map(tag => {
                        const isActive = activeProfileFilters.includes(tag.id);
                        return (
                          <button key={tag.id} onClick={() => toggleFilter(tag.id)}
                            className={`px-2 py-1 rounded-full text-[9px] font-bold border transition-all ${
                              isActive ? `${colors.bgSoft} ${colors.text} ${colors.border} ring-1 ring-current`
                              : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-slate-300'
                            }`}>
                            {tag.emoji} {tag.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <p className="text-[8px] text-center" style={{ color: 'var(--color-text-muted)' }}>
                {filteredCatalog.length} resultado{filteredCatalog.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Catalog list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredCatalog.length === 0 && (
              <p className="text-xs text-center py-6" style={{ color: 'var(--color-text-muted)' }}>
                No hay resultados
              </p>
            )}
            {filteredCatalog.map(entry => (
              <CatalogItem key={entry.id} entry={entry} />
            ))}
          </div>

          {/* Tip */}
          <div className="p-3" style={{ borderTop: '1px solid var(--color-border)' }}>
            <p className="text-[10px] text-center leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Arrastra cualquier ítem al día del itinerario
            </p>
          </div>
        </div>

        {/* ---- RIGHT: ITINERARY DAYS ---- */}
        <div className="flex-1 overflow-x-auto overflow-y-auto w-full">
          <div className="flex gap-4 h-full pr-4" style={{ minWidth: `${(days.length + 1) * 290}px` }}>
            {days.map(day => (
              <div key={day} style={{ minWidth: '280px', maxWidth: '280px' }}>
                <DayZone
                  day={day}
                  items={itemsByDay(day)}
                  resolveItem={resolveItem}
                  onRemove={handleItemRemove}
                  onUpdateNotes={handleUpdateNotes}
                  onUpdateTime={handleUpdateTime}
                  onToggleOptional={handleToggleOptional}
                  onToggleIncluded={handleToggleIncluded}
                />
              </div>
            ))}

            {/* Botón Añadir Día */}
            <div className="flex-shrink-0" style={{ width: '280px' }}>
              <button
                onClick={handleAddDay}
                className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-3 rounded-2xl transition-all hover:bg-white/5 cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '2px dashed var(--color-border)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(14,165,233,0.1)', color: '#38bdf8' }}
                >
                  <Plus size={24} />
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                  Añadir Día {days.length + 1}
                </div>
                <p className="text-xs max-w-[180px] text-center" style={{ color: 'var(--color-text-muted)' }}>
                  Extiende el itinerario agregando una nueva zona de día.
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
        {activeDrag ? <DragGhost entry={activeDrag.entry} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
