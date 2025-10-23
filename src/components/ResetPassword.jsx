import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Check, X, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

/**
 * ResetPassword Component
 * Three states:
 * 1. Verifying - Checking if token is valid
 * 2. Invalid - Token is invalid or expired
 * 3. Valid - Show reset password form
 */
const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Component states
  const [pageState, setPageState] = useState('verifying'); // 'verifying', 'invalid', 'valid', 'success'
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    passwordsMatch: false
  });

  /**
   * Verify token on component mount
   */
  useEffect(() => {
    if (!token) {
      setPageState('invalid');
      return;
    }

    // For now, just mark as valid
    // In production, you might want to verify the token upfront
    setPageState('valid');
  }, [token]);

  /**
   * Validate password requirements
   */
  const validatePassword = (password, confirmPassword) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      passwordsMatch: password.length > 0 && password === confirmPassword
    });
  };

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Validate password
    validatePassword(
      name === 'password' ? value : newFormData.password,
      name === 'confirmPassword' ? value : newFormData.confirmPassword
    );

    // Clear errors when user starts typing
    if (error) setError(null);
  };

  /**
   * Check if form is valid
   */
  const isFormValid = () => {
    return (
      passwordValidation.minLength &&
      passwordValidation.hasUppercase &&
      passwordValidation.hasLowercase &&
      passwordValidation.hasNumber &&
      passwordValidation.passwordsMatch
    );
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid()) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        password: formData.password
      });

      setPageState('success');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);

      if (err.response?.status === 400) {
        // Token invalid or expired
        setPageState('invalid');
      } else {
        setError(
          err.response?.data?.message ||
          'Failed to reset password. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Password requirement indicator
   */
  const RequirementIndicator = ({ met, text }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-gray-300" />
      )}
      <span className={met ? 'text-green-700' : 'text-gray-500'}>
        {text}
      </span>
    </div>
  );

  /**
   * Render content based on page state
   */
  const renderContent = () => {
    switch (pageState) {
      case 'verifying':
        return (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Verifying reset link...</h2>
            <p className="text-sm text-gray-600 mt-2">Please wait while we verify your reset token</p>
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Invalid or Expired Link</h2>
            <p className="mt-2 text-sm text-gray-600">
              This password reset link is invalid or has expired. Password reset links are only valid for 1 hour.
            </p>
            <div className="mt-6 space-y-2">
              <Link
                to="/forgot-password"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Request a new reset link
              </Link>
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to login
              </Link>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Password Reset Successful!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <p className="mt-4 text-sm text-indigo-600 font-medium">
              Redirecting to login...
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to login now
              </Link>
            </div>
          </div>
        );

      case 'valid':
      default:
        return (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
                <Lock className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Reset Your Password
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please enter your new password below
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <X className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="bg-gray-50 rounded-md p-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">Password must contain:</p>
                  <RequirementIndicator met={passwordValidation.minLength} text="At least 8 characters" />
                  <RequirementIndicator met={passwordValidation.hasUppercase} text="One uppercase letter" />
                  <RequirementIndicator met={passwordValidation.hasLowercase} text="One lowercase letter" />
                  <RequirementIndicator met={passwordValidation.hasNumber} text="One number" />
                  {formData.confirmPassword && (
                    <RequirementIndicator met={passwordValidation.passwordsMatch} text="Passwords match" />
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to login
              </Link>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
