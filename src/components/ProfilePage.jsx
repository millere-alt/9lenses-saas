import React, { useState, useEffect } from 'react';
import { User, Mail, Building2, Calendar, Shield } from 'lucide-react';
import { useAuth0Extended } from '../contexts/Auth0Context';
import ChangePassword from './ChangePassword';

/**
 * ProfilePage Component
 * Displays user profile information and allows password changes
 */
const ProfilePage = () => {
  const { user, organization } = useAuth0Extended();
  const [activeTab, setActiveTab] = useState('profile');

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format role for display
  const formatRole = (role) => {
    if (!role) return 'Member';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.profile?.firstName && user?.profile?.lastName) {
      return `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account information and security settings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Security
            </button>
          </nav>
        </div>

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* User Avatar and Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user?.profile?.avatar ? (
                    <img
                      src={user.profile.avatar}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-4 border-indigo-100"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-indigo-100">
                      <span className="text-3xl font-bold text-white">
                        {getUserInitials()}
                      </span>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.profile?.firstName && user?.profile?.lastName
                      ? `${user.profile.firstName} ${user.profile.lastName}`
                      : user?.email || 'User'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      <Shield className="h-3 w-3 mr-1" />
                      {formatRole(user?.profile?.role)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Member since {formatDate(user?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                Contact Information
              </h3>
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">First Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.profile?.firstName || 'Not provided'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.profile?.lastName || 'Not provided'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user?.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user?.status || 'active'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Organization Information */}
            {organization && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  Organization
                </h3>
                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Organization Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{organization.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Plan</dt>
                    <dd className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {organization.plan || 'Free'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Account Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Account Activity
              </h3>
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.metadata?.lastLogin
                      ? new Date(user.metadata.lastLogin).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Never'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Logins</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.metadata?.loginCount || 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Timezone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.metadata?.timezone || 'UTC'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Locale</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.metadata?.locale || 'en-US'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Permissions */}
            {user?.permissions && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  Permissions
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-700">Create Assessments</span>
                    <span className={`text-sm font-medium ${
                      user.permissions.canCreateAssessments ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {user.permissions.canCreateAssessments ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-700">View Reports</span>
                    <span className={`text-sm font-medium ${
                      user.permissions.canViewReports ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {user.permissions.canViewReports ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-700">Manage Team</span>
                    <span className={`text-sm font-medium ${
                      user.permissions.canManageTeam ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {user.permissions.canManageTeam ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-700">Manage Billing</span>
                    <span className={`text-sm font-medium ${
                      user.permissions.canManageBilling ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {user.permissions.canManageBilling ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Change Password Section */}
            <ChangePassword
              onSuccess={() => {
                // Optional: Handle success (e.g., show notification)
                console.log('Password changed successfully');
              }}
            />

            {/* Security Information */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Security Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Use a strong, unique password that you don't use on other sites</li>
                <li>Change your password regularly to maintain account security</li>
                <li>Never share your password with anyone</li>
                <li>If you suspect unauthorized access, change your password immediately</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
