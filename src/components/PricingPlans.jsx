import React, { useState, useEffect } from 'react';
import { Check, Loader, CreditCard, Crown, Rocket, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const PricingPlans = ({ onClose }) => {
  const { user, organization } = useAuth();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');

  useEffect(() => {
    fetchPlans();
    if (organization) {
      setCurrentPlan(organization.subscription?.plan || 'free');
    }
  }, [organization]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/stripe/plans`);
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleSelectPlan = async (planId) => {
    if (!user) {
      alert('Please log in to subscribe');
      return;
    }

    if (planId === 'free') {
      return; // Already on free plan
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stripe/create-checkout`,
        { plan: planId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'starter':
        return <Zap className="w-8 h-8" />;
      case 'professional':
        return <Rocket className="w-8 h-8" />;
      case 'enterprise':
        return <Crown className="w-8 h-8" />;
      default:
        return <CreditCard className="w-8 h-8" />;
    }
  };

  const getPlanColor = (planId) => {
    switch (planId) {
      case 'starter':
        return 'from-blue-500 to-cyan-500';
      case 'professional':
        return 'from-purple-500 to-pink-500';
      case 'enterprise':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (!plans) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-xl text-gray-600">
          Scale your organization with powerful assessment tools
        </p>
        {currentPlan !== 'free' && (
          <p className="text-sm text-gray-500 mt-2">
            Current Plan: <span className="font-semibold capitalize">{currentPlan}</span>
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Object.entries(plans).map(([planId, plan]) => {
          const isCurrentPlan = currentPlan === planId;
          const isPopular = planId === 'professional';

          return (
            <div
              key={planId}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all ${
                isPopular ? 'ring-2 ring-purple-500 transform scale-105' : ''
              }`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getPlanColor(planId)} flex items-center justify-center text-white mb-4`}>
                  {getPlanIcon(planId)}
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(planId)}
                  disabled={loading || isCurrentPlan || planId === 'free'}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    isCurrentPlan
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : planId === 'free'
                      ? 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
                      : `bg-gradient-to-r ${getPlanColor(planId)} text-white hover:opacity-90 shadow-lg`
                  } disabled:opacity-50`}
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin mx-auto" />
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : planId === 'free' ? (
                    'Free Forever'
                  ) : (
                    'Upgrade Now'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center text-gray-600">
        <p className="mb-2">All plans include 14-day money-back guarantee</p>
        <p className="text-sm">
          Need a custom plan?{' '}
          <a href="mailto:sales@9vectors.com" className="text-blue-600 hover:underline">
            Contact sales
          </a>
        </p>
      </div>
    </div>
  );
};

export default PricingPlans;
