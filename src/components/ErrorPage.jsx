import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

const ErrorPage = ({ code = '404', title, message }) => {
  const navigate = useNavigate();

  const errorConfig = {
    '404': {
      title: 'Page Not Found',
      message: 'Sorry, we couldn\'t find the page you\'re looking for.',
      icon: AlertTriangle
    },
    '500': {
      title: 'Server Error',
      message: 'Oops! Something went wrong on our end. Please try again later.',
      icon: AlertTriangle
    }
  };

  const config = errorConfig[code] || errorConfig['404'];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="flex justify-center">
            <div className="bg-blue-100 rounded-full p-6">
              <Icon className="w-16 h-16 text-blue-600" />
            </div>
          </div>

          <div>
            <h1 className="text-6xl font-bold text-blue-900 mb-2">{code}</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {title || config.title}
            </h2>
            <p className="text-gray-600">
              {message || config.message}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help?{' '}
              <a href="mailto:support@9Vectors.com" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
