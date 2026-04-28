// ============================================================
// ZUSTAND STORE – Sol y Vida Turismo
// Estado global conectado con Supabase (esquema normalizado)
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Supplier, Product, Route, Tag, RouteItem, ItineraryItem } from '../types';
import { supabase } from '../lib/supabase';

// ---- Tipos del Store ----

interface ProductTagEntry {
  product_id: string;
  tag_id: string;
}

interface SupplierActions {
  addSupplier: (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => Promise<Supplier>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<Supplier>;
  deleteSupplier: (id: string) => Promise<void>;
  getSupplierById: (id: string) => Supplier | undefined;
}

interface ProductActions {
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>, tagIds?: string[]) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>, tagIds?: string[]) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsBySupplier: (supplierId: string) => Product[];
  getOrphanProducts: () => Product[];
  getProductTags: (productId: string) => string[];
}

interface RouteActions {
  addRoute: (route: Omit<Route, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'booking_count'>, items?: Omit<RouteItem, 'id' | 'route_id' | 'created_at'>[]) => Promise<Route>;
  updateRoute: (id: string, updates: Partial<Route>, items?: Omit<RouteItem, 'id' | 'route_id' | 'created_at'>[]) => Promise<Route>;
  deleteRoute: (id: string) => Promise<void>;
  getRouteById: (id: string) => Route | undefined;
  getRouteItems: (routeId: string) => RouteItem[];
  // Itinerary item operations (works with routes.itinerary JSONB)
  addItineraryItem: (routeId: string, item: Omit<ItineraryItem, 'id'>) => Promise<void>;
  removeItineraryItem: (routeId: string, itemId: string) => Promise<void>;
  updateItineraryItem: (routeId: string, itemId: string, updates: Partial<ItineraryItem>) => Promise<void>;
  reorderItinerary: (routeId: string, newItems: ItineraryItem[]) => Promise<void>;
}

interface TagActions {
  fetchTags: () => Promise<void>;
  getTagsByGroup: (groupId: string) => Tag[];
  getTagById: (id: string) => Tag | undefined;
}

interface UiState {
  sidebarOpen: boolean;
  activeView: string;
  theme: 'dark' | 'light';
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: string) => void;
  toggleTheme: () => void;
}

interface StatsState {
  getTotalRevenue: () => number;
  getTopRoutes: () => Route[];
  getActiveProducts: () => number;
  getActiveSuppliers: () => number;
}

interface AppStore extends SupplierActions, ProductActions, RouteActions, TagActions, UiState, StatsState {
  suppliers: Supplier[];
  products: Product[];
  routes: Route[];
  tags: Tag[];
  routeItems: RouteItem[];
  productTags: ProductTagEntry[];
  loading: boolean;
  error: string | null;

  fetchData: () => Promise<void>;
  resetToMockData: () => void;
}

// ---- Store ----

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // -------- State --------
      suppliers: [],
      products: [],
      routes: [],
      tags: [],
      routeItems: [],
      productTags: [],
      loading: false,
      error: null,

      // -------- UI --------
      sidebarOpen: true,
      activeView: 'dashboard',
      theme: 'light' as 'dark' | 'light',

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveView: (view) => set({ activeView: view }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      // -------- FETCH DATA (todas las tablas) --------
      fetchData: async () => {
        set({ loading: true, error: null });
        try {
          const [supRes, prodRes, routeRes, tagRes, routeItemRes, prodTagRes] = await Promise.all([
            supabase.from('suppliers').select('*').order('created_at', { ascending: false }),
            supabase.from('products').select('*').order('created_at', { ascending: false }),
            supabase.from('routes').select('*').order('created_at', { ascending: false }),
            supabase.from('tags').select('*').order('group_id'),
            supabase.from('route_items').select('*').order('day').order('item_order'),
            supabase.from('product_tags').select('*'),
          ]);

          if (supRes.error) throw supRes.error;
          if (prodRes.error) throw prodRes.error;
          if (routeRes.error) throw routeRes.error;
          if (tagRes.error) throw tagRes.error;
          if (routeItemRes.error) throw routeItemRes.error;
          if (prodTagRes.error) throw prodTagRes.error;

          set({
            suppliers: supRes.data as Supplier[],
            products: prodRes.data as Product[],
            routes: routeRes.data as Route[],
            tags: tagRes.data as Tag[],
            routeItems: routeItemRes.data as RouteItem[],
            productTags: prodTagRes.data as ProductTagEntry[],
            loading: false,
          });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      // -------- TAGS --------
      fetchTags: async () => {
        const { data, error } = await supabase.from('tags').select('*').order('group_id');
        if (error) throw error;
        set({ tags: data as Tag[] });
      },

      getTagsByGroup: (groupId) => get().tags.filter(t => t.group_id === groupId),

      getTagById: (id) => get().tags.find(t => t.id === id),

      // -------- SUPPLIERS --------
      addSupplier: async (supplier) => {
        set({ loading: true });
        const { data, error } = await supabase
          .from('suppliers')
          .insert([supplier])
          .select()
          .single();

        if (error) {
          set({ error: error.message, loading: false });
          throw error;
        }

        const newSupplier = data as Supplier;
        set((state) => ({
          suppliers: [newSupplier, ...state.suppliers],
          loading: false,
        }));
        return newSupplier;
      },

      updateSupplier: async (id, updates) => {
        set({ loading: true });
        const { data, error } = await supabase
          .from('suppliers')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          set({ error: error.message, loading: false });
          throw error;
        }

        const updatedSupplier = data as Supplier;
        set((state) => ({
          suppliers: state.suppliers.map((s) => (s.id === id ? updatedSupplier : s)),
          loading: false,
        }));
        return updatedSupplier;
      },

      deleteSupplier: async (id) => {
        set({ loading: true });
        const { error } = await supabase.from('suppliers').delete().eq('id', id);

        if (error) {
          set({ error: error.message, loading: false });
          throw error;
        }

        set((state) => ({
          suppliers: state.suppliers.filter((s) => s.id !== id),
          products: state.products.map((p) =>
            p.supplier_id === id ? { ...p, supplier_id: null } : p
          ),
          loading: false,
        }));
      },

      getSupplierById: (id) => get().suppliers.find((s) => s.id === id),

      // -------- PRODUCTS (con product_tags) --------
      addProduct: async (product, tagIds) => {
        set({ loading: true });
        const { data, error } = await supabase
          .from('products')
          .insert([product])
          .select()
          .single();

        if (error) {
          set({ error: error.message, loading: false });
          throw error;
        }

        const newProduct = data as Product;

        // Insertar tags en la tabla pivote
        if (tagIds && tagIds.length > 0) {
          const tagRows = tagIds.map(tag_id => ({ product_id: newProduct.id, tag_id }));
          const { error: tagError } = await supabase.from('product_tags').insert(tagRows);
          if (tagError) console.error('Error inserting product tags:', tagError);

          set((state) => ({
            products: [newProduct, ...state.products],
            productTags: [...state.productTags, ...tagRows],
            loading: false,
          }));
        } else {
          set((state) => ({
            products: [newProduct, ...state.products],
            loading: false,
          }));
        }

        return newProduct;
      },

      updateProduct: async (id, updates, tagIds) => {
        set({ loading: true });
        const { data, error } = await supabase
          .from('products')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          set({ error: error.message, loading: false });
          throw error;
        }

        const updatedProduct = data as Product;

        // Reemplazar tags: borrar existentes, insertar nuevos
        if (tagIds !== undefined) {
          await supabase.from('product_tags').delete().eq('product_id', id);

          let newTagRows: ProductTagEntry[] = [];
          if (tagIds.length > 0) {
            newTagRows = tagIds.map(tag_id => ({ product_id: id, tag_id }));
            const { error: tagError } = await supabase.from('product_tags').insert(newTagRows);
            if (tagError) console.error('Error updating product tags:', tagError);
          }

          set((state) => ({
            products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
            productTags: [
              ...state.productTags.filter(pt => pt.product_id !== id),
              ...newTagRows,
            ],
            loading: false,
          }));
        } else {
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
            loading: false,
          }));
        }

        return updatedProduct;
      },

      deleteProduct: async (id) => {
        set({ loading: true });
        // CASCADE borra product_tags y pone NULL en route_items.product_id
        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
          set({ error: error.message, loading: false });
          throw error;
        }

        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          productTags: state.productTags.filter(pt => pt.product_id !== id),
          routeItems: state.routeItems.map(ri =>
            ri.product_id === id ? { ...ri, product_id: null } : ri
          ),
          loading: false,
        }));
      },

      getProductById: (id) => get().products.find((p) => p.id === id),

      getProductsBySupplier: (supplierId) =>
        get().products.filter((p) => p.supplier_id === supplierId),

      getOrphanProducts: () => get().products.filter((p) => p.supplier_id === null),

      getProductTags: (productId) =>
        get().productTags.filter(pt => pt.product_id === productId).map(pt => pt.tag_id),

      // -------- ROUTES (con route_items) --------
      addRoute: async (route, items) => {
        set({ loading: true });
        const payload = {
          name: route.name,
          slug: route.slug || route.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          status: route.status || 'activo',
          description: route.description || '',
          short_description: route.short_description || '',
          duration_days: Number(route.duration_days) || 1,
          itinerary: route.itinerary || [],
          pricing: route.pricing || {},
          difficulty: route.difficulty || '',
          destination: route.destination || '',
          highlights: route.highlights || [],
          included: route.included || [],
          not_included: route.not_included || [],
          images: (route.images || []).filter((img: string) => img && img.trim() !== ''),
          tags: route.tags || [],
          is_featured: route.is_featured || false,
          view_count: 0,
          booking_count: 0,
        };
        console.log('[addRoute] payload:', JSON.stringify(payload, null, 2));
        const { data, error } = await supabase
          .from('routes')
          .insert([payload])
          .select()
          .single();

        if (error) {
          console.error('[addRoute] Supabase error:', error);
          set({ error: error.message, loading: false });
          throw error;
        }

        const newRoute = data as Route;

        // Insertar route_items
        let newItems: RouteItem[] = [];
        if (items && items.length > 0) {
          const rows = items.map((item, i) => ({
            route_id: newRoute.id,
            product_id: item.product_id || null,
            day: item.day,
            item_order: item.item_order ?? i,
            time_start: item.time_start || null,
            time_end: item.time_end || null,
            notes: item.notes || '',
            is_optional: item.is_optional ?? false,
            included_in_price: item.included_in_price ?? true,
          }));

          const { data: itemData, error: itemError } = await supabase
            .from('route_items')
            .insert(rows)
            .select();

          if (itemError) console.error('Error inserting route items:', itemError);
          else newItems = itemData as RouteItem[];
        }

        set((state) => ({
          routes: [newRoute, ...state.routes],
          routeItems: [...state.routeItems, ...newItems],
          loading: false,
        }));
        return newRoute;
      },

      updateRoute: async (id, updates, items) => {
        set({ loading: true });
        const { data, error } = await supabase
          .from('routes')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          set({ error: error.message, loading: false });
          throw error;
        }

        const updatedRoute = data as Route;

        // Si se pasan items, reemplazar todos los route_items de esta ruta
        if (items !== undefined) {
          await supabase.from('route_items').delete().eq('route_id', id);

          let newItems: RouteItem[] = [];
          if (items.length > 0) {
            const rows = items.map((item, i) => ({
              route_id: id,
              product_id: item.product_id || null,
              day: item.day,
              item_order: item.item_order ?? i,
              time_start: item.time_start || null,
              time_end: item.time_end || null,
              notes: item.notes || '',
              is_optional: item.is_optional ?? false,
              included_in_price: item.included_in_price ?? true,
            }));

            const { data: itemData, error: itemError } = await supabase
              .from('route_items')
              .insert(rows)
              .select();

            if (itemError) console.error('Error updating route items:', itemError);
            else newItems = itemData as RouteItem[];
          }

          set((state) => ({
            routes: state.routes.map((r) => (r.id === id ? updatedRoute : r)),
            routeItems: [
              ...state.routeItems.filter(ri => ri.route_id !== id),
              ...newItems,
            ],
            loading: false,
          }));
        } else {
          set((state) => ({
            routes: state.routes.map((r) => (r.id === id ? updatedRoute : r)),
            loading: false,
          }));
        }

        return updatedRoute;
      },

      deleteRoute: async (id) => {
        set({ loading: true });
        // CASCADE borra route_items
        const { error } = await supabase.from('routes').delete().eq('id', id);

        if (error) {
          set({ error: error.message, loading: false });
          throw error;
        }

        set((state) => ({
          routes: state.routes.filter((r) => r.id !== id),
          routeItems: state.routeItems.filter(ri => ri.route_id !== id),
          loading: false,
        }));
      },

      getRouteById: (id) => get().routes.find((r) => r.id === id),

      getRouteItems: (routeId) =>
        get().routeItems
          .filter(ri => ri.route_id === routeId)
          .sort((a, b) => a.day !== b.day ? a.day - b.day : a.item_order - b.item_order),

      // -------- ITINERARY ITEMS (JSONB on routes.itinerary) --------
      addItineraryItem: async (routeId: string, item: Omit<ItineraryItem, 'id'>) => {
        const route = get().routes.find(r => r.id === routeId);
        if (!route) throw new Error('Route not found');

        const newItem: ItineraryItem = {
          ...item,
          id: crypto.randomUUID(),
        };
        const newItinerary = [...route.itinerary, newItem];

        const { error } = await supabase
          .from('routes')
          .update({ itinerary: newItinerary })
          .eq('id', routeId);

        if (error) throw error;
        set((state) => ({
          routes: state.routes.map(r =>
            r.id === routeId ? { ...r, itinerary: newItinerary } : r
          ),
        }));
      },

      removeItineraryItem: async (routeId: string, itemId: string) => {
        const route = get().routes.find(r => r.id === routeId);
        if (!route) throw new Error('Route not found');

        const newItinerary = route.itinerary.filter(i => i.id !== itemId);

        const { error } = await supabase
          .from('routes')
          .update({ itinerary: newItinerary })
          .eq('id', routeId);

        if (error) throw error;
        set((state) => ({
          routes: state.routes.map(r =>
            r.id === routeId ? { ...r, itinerary: newItinerary } : r
          ),
        }));
      },

      updateItineraryItem: async (routeId: string, itemId: string, updates: Partial<ItineraryItem>) => {
        const route = get().routes.find(r => r.id === routeId);
        if (!route) throw new Error('Route not found');

        const newItinerary = route.itinerary.map(i =>
          i.id === itemId ? { ...i, ...updates } : i
        );

        const { error } = await supabase
          .from('routes')
          .update({ itinerary: newItinerary })
          .eq('id', routeId);

        if (error) throw error;
        set((state) => ({
          routes: state.routes.map(r =>
            r.id === routeId ? { ...r, itinerary: newItinerary } : r
          ),
        }));
      },

      reorderItinerary: async (routeId: string, newItems: ItineraryItem[]) => {
        const { error } = await supabase
          .from('routes')
          .update({ itinerary: newItems })
          .eq('id', routeId);

        if (error) throw error;
        set((state) => ({
          routes: state.routes.map(r =>
            r.id === routeId ? { ...r, itinerary: newItems } : r
          ),
        }));
      },

      // -------- STATS --------
      getTotalRevenue: () => {
        const { routes } = get();
        return routes.reduce(
          (total, route) => total + route.pricing.base_price_per_pax * route.booking_count,
          0
        );
      },

      getTopRoutes: () => {
        const { routes } = get();
        return [...routes].sort((a, b) => b.booking_count - a.booking_count).slice(0, 5);
      },

      getActiveProducts: () => get().products.filter((p) => p.status === 'activo').length,

      getActiveSuppliers: () => get().suppliers.filter((s) => s.status === 'activo').length,

      resetToMockData: () => {
        get().fetchData();
      },
    }),
    {
      name: 'sol-y-vida-ui-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
        activeView: state.activeView,
      }),
    }
  )
);

export const useSuppliers = () => useAppStore((s) => s.suppliers);
export const useProducts = () => useAppStore((s) => s.products);
export const useRoutes = () => useAppStore((s) => s.routes);
export const useTags = () => useAppStore((s) => s.tags);
export const useRouteItems = () => useAppStore((s) => s.routeItems);
export const useProductTags = () => useAppStore((s) => s.productTags);
export const useSidebarOpen = () => useAppStore((s) => s.sidebarOpen);
export const useStoreLoading = () => useAppStore((s) => s.loading);
export const useStoreError = () => useAppStore((s) => s.error);
