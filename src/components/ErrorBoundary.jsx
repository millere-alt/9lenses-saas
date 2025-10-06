import React from 'react';
import ErrorPage from './ErrorPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          code="500"
          title="Something Went Wrong"
          message="We're working on fixing this issue. Please try refreshing the page."
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
