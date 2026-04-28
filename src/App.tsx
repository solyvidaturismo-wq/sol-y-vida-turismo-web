import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { useAppStore } from './store/useAppStore';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ui/Toast';

// Login se carga directo (primera pantalla)
import LoginPage from './pages/LoginPage';

// Lazy-loaded pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SuppliersPage = lazy(() => import('./pages/SuppliersPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const RoutesPage = lazy(() => import('./pages/RoutesPage'));
const ReportesPage = lazy(() => import('./pages/ReportesPage'));
const CategoriasPage = lazy(() => import('./pages/CategoriasPage'));
const ExplorarPage = lazy(() => import('./pages/ExplorarPage'));
const ConfiguracionPage = lazy(() => import('./pages/ConfiguracionPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const SupplierFormPage = lazy(() => import('./pages/SupplierFormPage'));
const ProductFormPage = lazy(() => import('./pages/ProductFormPage'));
const RouteFormPage = lazy(() => import('./pages/RouteFormPage'));
const ItineraryBuilderPage = lazy(() => import('./pages/ItineraryBuilderPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const SupplierDetailPage = lazy(() => import('./pages/SupplierDetailPage'));
const RouteDetailPage = lazy(() => import('./pages/RouteDetailPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

function PageLoader() {
  return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-[#A8442A]/30 border-t-[#A8442A] animate-spin" />
      <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">Cargando módulo...</p>
    </div>
  );
}

function AppContent() {
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
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/velez" element={<LandingPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Dashboard */}
            <Route path="/" element={<DashboardPage />} />

            {/* Proveedores */}
            <Route path="/proveedores" element={<SuppliersPage />} />
            <Route path="/proveedores/nuevo" element={<SupplierFormPage />} />
            <Route path="/proveedores/:id/editar" element={<SupplierFormPage />} />
            <Route path="/proveedores/:id/detalle" element={<SupplierDetailPage />} />

            {/* Productos */}
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/productos/nuevo" element={<ProductFormPage />} />
            <Route path="/productos/:id/editar" element={<ProductFormPage />} />
            <Route path="/productos/:id/detalle" element={<ProductDetailPage />} />

            {/* Rutas */}
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
        </Route>
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
          <ToastContainer />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
