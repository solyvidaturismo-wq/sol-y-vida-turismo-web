import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Outlet } from 'react-router-dom';

export function AppLayout() {

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ background: 'var(--color-bg-primary)' }}
        >
          {/* Ambient gradient */}
          <div
            className="pointer-events-none fixed top-0 right-0 w-96 h-96 opacity-5"
            style={{
              background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)',
              zIndex: 0,
            }}
          />

          {/* Route outlet */}
          <div className="relative z-10 p-5 max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
