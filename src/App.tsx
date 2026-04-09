import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { useAppStore } from './store/useAppStore';

// Pages
import DashboardPage from './pages/DashboardPage';
import SuppliersPage from './pages/SuppliersPage';
import ProductsPage from './pages/ProductsPage';
import RoutesPage from './pages/RoutesPage';
import ReportesPage from './pages/ReportesPage';
import CategoriasPage from './pages/CategoriasPage';
import ExplorarPage from './pages/ExplorarPage';
import ConfiguracionPage from './pages/ConfiguracionPage';
import NotFoundPage from './pages/NotFoundPage';

// Phase 3 — CRUD forms
import SupplierFormPage from './pages/SupplierFormPage';
import ProductFormPage from './pages/ProductFormPage';

// Phase 4 — Route builder
import RouteFormPage from './pages/RouteFormPage';
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SupplierDetailPage from './pages/SupplierDetailPage';
import RouteDetailPage from './pages/RouteDetailPage';

export default function App() {
  const theme = useAppStore((s) => s.theme);
  const fetchData = useAppStore((s) => s.fetchData);

  // Initial data fetch from Supabase
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply theme to <html> so CSS vars kick in globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<DashboardPage />} />          {/* Proveedores (Fase 3) */}
          <Route path="/proveedores" element={<SuppliersPage />} />
          <Route path="/proveedores/nuevo" element={<SupplierFormPage />} />
          <Route path="/proveedores/:id/editar" element={<SupplierFormPage />} />
          <Route path="/proveedores/:id/detalle" element={<SupplierDetailPage />} />

          {/* Productos (Fase 3) */}
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/productos/nuevo" element={<ProductFormPage />} />
          <Route path="/productos/:id/editar" element={<ProductFormPage />} />
          <Route path="/productos/:id/detalle" element={<ProductDetailPage />} />

          {/* Rutas (Fase 4) */}
          <Route path="/rutas" element={<RoutesPage />} />
          <Route path="/rutas/nuevo" element={<RouteFormPage />} />
          <Route path="/rutas/:id/editar" element={<RouteFormPage />} />
          <Route path="/rutas/:id/itinerario" element={<ItineraryBuilderPage />} />
          <Route path="/rutas/:id/detalle" element={<RouteDetailPage />} />

          {/* Otros módulos */}
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/explorar" element={<ExplorarPage />} />
          <Route path="/configuracion" element={<ConfiguracionPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
