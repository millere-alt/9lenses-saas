import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { api } from '../services/api';

/**
 * ChangePassword Component
 * Allows authenticated users to change their password
 * Requires current password verification
 */
const ChangePassword = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    passwordsMatch: false
  });

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

    // Validate password when new password or confirm password changes
    if (name === 'newPassword' || name === 'confirmPassword') {
      validatePassword(
        name === 'newPassword' ? value : newFormData.newPassword,
        name === 'confirmPassword' ? value : newFormData.confirmPassword
      );
    }

    // Clear errors when user starts typing
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  /**
   * Check if form is valid
   */
  const isFormValid = () => {
    return (
      formData.currentPassword.length > 0 &&
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
    setSuccess(false);

    // Validation
    if (!isFormValid()) {
      setError('Please meet all password requirements');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordValidation({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        passwordsMatch: false
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      console.error('Change password error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to change password. Please check your current password and try again.'
      );
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-green-800">
                Password changed successfully
              </h3>
              <p className="text-sm text-green-700 mt-1">
                You have been logged out of all other devices for security.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <X className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
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
        {formData.newPassword && (
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
        <div className="flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
