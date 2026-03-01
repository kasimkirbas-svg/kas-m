import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  // @ts-ignore
  constructor(props: Props) {
    super(props);
    // @ts-ignore
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // @ts-ignore
      if (this.props.fallback) {
        // @ts-ignore
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
          <div className="max-w-xl w-full bg-white shadow-xl rounded-xl p-8 border border-red-200">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Bir şeyler ters gitti</h2>
            <p className="text-slate-600 mb-4">Uygulama beklenmeyen bir hata ile karşılaştı.</p>
            
            <div className="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-auto mb-6 max-h-60 text-sm font-mono">
              {/* @ts-ignore */}
              {this.state.error?.toString()}
            </div>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Uygulamayı Sıfırla (Önbelleği Temizle)
            </button>
          </div>
        </div>
      );
    }
    // @ts-ignore
    return this.props.children;
  }
}
