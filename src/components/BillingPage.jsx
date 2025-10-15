import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CreditCard,
  Package,
  Calendar,
  Check,
  AlertCircle,
  ExternalLink,
  Loader,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import PricingPlans from './PricingPlans';

const BillingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, organization } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    // Check for success/canceled params
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      setShowSuccess(true);
      // Clean URL
      window.history.replaceState({}, '', '/billing');
    }

    const canceled = searchParams.get('canceled');
    if (canceled) {
      setShowCanceled(true);
      setTimeout(() => setShowCanceled(false), 5000);
      window.history.replaceState({}, '', '/billing');
    }

    fetchSubscription();
  }, [searchParams]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/stripe/subscription`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSubscription(response.data.subscription);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const openBillingPortal = async () => {
    setPortalLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stripe/create-portal`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      window.location.href = response.data.url;
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      alert('Failed to open billing portal. Please try again.');
      setPortalLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view billing</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Activated!</h2>
          <p className="text-gray-600 mb-6">
            Your subscription has been successfully activated. You now have access to all premium features.
          </p>
          <button
            onClick={() => {
              setShowSuccess(false);
              fetchSubscription();
            }}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            View Subscription Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
                <p className="text-gray-600">Manage your subscription and billing information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCanceled && (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800">Checkout was canceled. You can try again anytime.</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Current Subscription Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Current Subscription
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Plan</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {organization?.subscription?.plan || 'Free'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      subscription?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <p className="text-lg font-semibold capitalize">
                      {subscription?.status || 'Free'}
                    </p>
                  </div>
                </div>

                {subscription && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {subscription && (
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={openBillingPortal}
                    disabled={portalLoading}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    {portalLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Opening...
                      </>
                    ) : (
                      <>
                        <Settings className="w-5 h-5" />
                        Manage Subscription
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Update payment method, view invoices, or cancel subscription
                  </p>
                </div>
              )}
            </div>

            {/* Usage Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Usage & Limits</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Users</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">0</span>
                    <span className="text-gray-500">/ {organization?.subscription?.limits?.maxUsers || 3}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Assessments</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">0</span>
                    <span className="text-gray-500">/ {organization?.subscription?.limits?.maxAssessments || 5}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Participants</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">0</span>
                    <span className="text-gray-500">/ {organization?.subscription?.limits?.maxParticipants || 10}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Plans */}
            <PricingPlans />
          </>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
