import React from 'react';
import { X, LogIn, UserPlus, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Auth0Modal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, signup, isAuthenticated } = useAuth();

  if (!isOpen || isAuthenticated) return null;

  const handleLogin = () => {
    login();
  };

  const handleSignup = () => {
    signup();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6 rounded-t-2xl">
          <button
            onClick={() => onClose(false)}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome to 9Vectors</h2>
              <p className="text-blue-100 text-sm">
                {initialMode === 'login' ? 'Sign in to continue' : 'Create your account'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Auth0 Login Button */}
            {initialMode === 'login' ? (
              <>
                <button
                  onClick={handleLogin}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In with Auth0
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Secure authentication</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Secure Sign In
                  </p>
                  <p className="text-xs text-blue-700">
                    We use Auth0 for secure authentication. Your credentials are never stored on our servers.
                  </p>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={handleSignup}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Create Account with Auth0
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Free to start</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium mb-2">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Start Free
                  </p>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• No credit card required</li>
                    <li>• 5 free assessments</li>
                    <li>• Up to 10 participants</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center text-sm text-gray-600">
          {initialMode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth0Modal;
