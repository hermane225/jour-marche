import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Une erreur inattendue est survenue.',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ERROR BOUNDARY] UI crash captured:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '560px', width: '100%', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', background: '#fff' }}>
            <h2 style={{ marginTop: 0, marginBottom: '8px' }}>Erreur d'affichage</h2>
            <p style={{ marginTop: 0, color: '#4b5563' }}>
              L'interface a rencontré une erreur. Rechargez la page.
            </p>
            {this.state.errorMessage && (
              <pre style={{ whiteSpace: 'pre-wrap', background: '#f9fafb', padding: '12px', borderRadius: '8px', fontSize: '12px', overflowX: 'auto' }}>
                {this.state.errorMessage}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReload}
              style={{ marginTop: '12px', border: 'none', background: '#059669', color: '#fff', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Recharger
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
