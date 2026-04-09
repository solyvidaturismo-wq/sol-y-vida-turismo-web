// ============================================================
// ZUSTAND STORE – Sol y Vida Turismo
// Estado global conectado con Supabase
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Supplier, Product, Route, ItineraryItem } from '../types';
import { supabase } from '../lib/supabase';

// ---- Tipos del Store ----

interface SupplierActions {
  addSupplier: (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => Promise<Supplier>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<Supplier>;
  deleteSupplier: (id: string) => Promise<void>;
  getSupplierById: (id: string) => Supplier | undefined;
}

interface ProductActions {
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsBySupplier: (supplierId: string) => Product[];
  getOrphanProducts: () => Product[];
}

interface RouteActions {
  addRoute: (route: Omit<Route, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'booking_count'>) => Promise<Route>;
  updateRoute: (id: string, updates: Partial<Route>) => Promise<Route>;
  deleteRoute: (id: string) => Promise<void>;
  getRouteById: (id: string) => Route | undefined;
  // Itinerary management
  addItineraryItem: (routeId: string, item: Omit<ItineraryItem, 'id'>) => Promise<void>;
  removeItineraryItem: (routeId: string, itemId: string) => Promise<void>;
  updateItineraryItem: (routeId: string, itemId: string, updates: Partial<ItineraryItem>) => Promise<void>;
  reorderItinerary: (routeId: string, newItinerary: ItineraryItem[]) => Promise<void>;
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

interface AppStore extends SupplierActions, ProductActions, RouteActions, UiState, StatsState {
  suppliers: Supplier[];
  products: Product[];
  routes: Route[];
  loading: boolean;
  error: string | null;

  // Sync
  fetchData: () => Promise<void>;
}

// ---- Store ----

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // -------- State --------
      suppliers: [],
      products: [],
      routes: [],
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

      // -------- FETCH DATA --------
      fetchData: async () => {
        set({ loading: true, error: null });
        try {
          const [supRes, prodRes, routeRes] = await Promise.all([
            supabase.from('suppliers').select('*').order('created_at', { ascending: false }),
            supabase.from('products').select('*').order('created_at', { ascending: false }),
            supabase.from('routes').select('*').order('created_at', { ascending: false }),
          ]);

          if (supRes.error) throw supRes.error;
          if (prodRes.error) throw prodRes.error;
          if (routeRes.error) throw routeRes.error;

          set({
            suppliers: supRes.data as Supplier[],
            products: prodRes.data as Product[],
            routes: routeRes.data as Route[],
            loading: false,
          });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

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

      // -------- PRODUCTS --------
      addProduct: async (product) => {
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
        set((state) => ({
          products: [newProduct, ...state.products],
          loading: false,
        }));
        return newProduct;
      },

      updateProduct: async (id, updates) => {
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
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
          loading: false,
        }));
        return updatedProduct;
      },

      deleteProduct: async (id) => {
        set({ loading: true });
        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
          set({ error: error.message, loading: false });
          throw error;
        }

        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          routes: state.routes.map((r) => ({
            ...r,
            itinerary: r.itinerary.filter(
              (item) => !(item.ref_type === 'product' && item.ref_id === id)
            ),
          })),
          loading: false,
        }));
      },

      getProductById: (id) => get().products.find((p) => p.id === id),

      getProductsBySupplier: (supplierId) =>
        get().products.filter((p) => p.supplier_id === supplierId),

      getOrphanProducts: () => get().products.filter((p) => p.supplier_id === null),

      // -------- ROUTES --------
      addRoute: async (route) => {
        set({ loading: true });
        const { data, error } = await supabase
          .from('routes')
          .insert([{ ...route, view_count: 0, booking_count: 0 }])
          .select()
          .single();

        if (error) {
          set({ error: error.message, loading: false });
          throw error;
        }

        const newRoute = data as Route;
        set((state) => ({
          routes: [newRoute, ...state.routes],
          loading: false,
        }));
        return newRoute;
      },

      updateRoute: async (id, updates) => {
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
        set((state) => ({
          routes: state.routes.map((r) => (r.id === id ? updatedRoute : r)),
          loading: false,
        }));
        return updatedRoute;
      },

      deleteRoute: async (id) => {
        set({ loading: true });
        const { error } = await supabase.from('routes').delete().eq('id', id);

        if (error) {
          set({ error: error.message, loading: false });
          throw error;
        }

        set((state) => ({
          routes: state.routes.filter((r) => r.id !== id),
          loading: false,
        }));
      },

      getRouteById: (id) => get().routes.find((r) => r.id === id),

      // -------- ITINERARY (Sub-records processed locally then synced) --------
      addItineraryItem: async (routeId, item) => {
        const route = get().routes.find((r) => r.id === routeId);
        if (!route) return;

        const newItem: ItineraryItem = {
          ...item,
          id: `it-${Date.now()}`, // Temporary local ID
        };

        const updatedItinerary = [...route.itinerary, newItem];
        await get().updateRoute(routeId, { itinerary: updatedItinerary });
      },

      removeItineraryItem: async (routeId, itemId) => {
        const route = get().routes.find((r) => r.id === routeId);
        if (!route) return;

        const updatedItinerary = route.itinerary.filter((i) => i.id !== itemId);
        await get().updateRoute(routeId, { itinerary: updatedItinerary });
      },

      updateItineraryItem: async (routeId, itemId, updates) => {
        const route = get().routes.find((r) => r.id === routeId);
        if (!route) return;

        const updatedItinerary = route.itinerary.map((i) =>
          i.id === itemId ? { ...i, ...updates } : i
        );
        await get().updateRoute(routeId, { itinerary: updatedItinerary });
      },

      reorderItinerary: async (routeId, newItinerary) => {
        await get().updateRoute(routeId, { itinerary: newItinerary });
      },

      // -------- STATS (Client-side aggregation) --------
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
    }),
    {
      name: 'sol-y-vida-ui-state',
      storage: createJSONStorage(() => localStorage),
      // Only persist UI things, data comes from Supabase
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
export const useSidebarOpen = () => useAppStore((s) => s.sidebarOpen);
export const useStoreLoading = () => useAppStore((s) => s.loading);
export const useStoreError = () => useAppStore((s) => s.error);
