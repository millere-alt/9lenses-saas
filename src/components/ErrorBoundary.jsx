import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Enhanced ErrorBoundary component with recovery and error tracking
 * Catches JavaScript errors anywhere in child component tree and displays fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by ErrorBoundary:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // Update state with error info
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Optional: Send error to logging service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.handleReset
        });
      }

      // Default error UI
      const isCritical = this.state.errorCount > 3;

      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              {isCritical ? 'Critical Error' : 'Something Went Wrong'}
            </h1>
            <p className="text-neutral-600 mb-6">
              {isCritical
                ? 'Multiple errors detected. Please refresh the page or contact support if the issue persists.'
                : 'We encountered an unexpected error. You can try again or refresh the page.'}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 text-left bg-neutral-100 p-4 rounded text-sm overflow-auto max-h-40">
                <p className="font-mono text-red-600">{this.state.error.toString()}</p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              {!isCritical && (
                <button
                  onClick={this.handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              )}
              <button
                onClick={this.handleReload}
                className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
