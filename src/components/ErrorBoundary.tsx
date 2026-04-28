import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--color-bg-primary, #0a0f1e)' }}>
          <div className="max-w-md text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Algo salió mal</h1>
            <p className="text-sm text-slate-400">
              Ocurrió un error inesperado en la aplicación. Puedes intentar recargar la página.
            </p>
            {this.state.error && (
              <pre className="text-xs text-rose-400/70 bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 text-left overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn-primary flex items-center gap-2"
              >
                <RefreshCcw size={16} />
                Reintentar
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-secondary flex items-center gap-2"
              >
                Ir al Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
