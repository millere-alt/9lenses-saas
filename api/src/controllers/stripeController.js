import {
  createCheckoutSession,
  createBillingPortalSession,
  getSubscription,
  cancelSubscription,
  handleWebhookEvent,
  PLANS
} from '../services/stripe.js';
import { Organization } from '../models/Organization.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Get available plans
 */
export async function getPlans(req, res) {
  try {
    res.json({
      plans: PLANS
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      error: 'Failed to get plans',
      message: error.message
    });
  }
}

/**
 * Create checkout session
 */
export async function createCheckout(req, res) {
  try {
    const { plan } = req.body;
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    const email = req.user.email;

    if (!['starter', 'professional', 'enterprise'].includes(plan)) {
      return res.status(400).json({
        error: 'Invalid plan',
        message: 'Please select a valid subscription plan'
      });
    }

    const session = await createCheckoutSession(organizationId, plan, userId, email);

    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
}

/**
 * Create billing portal session
 */
export async function createPortal(req, res) {
  try {
    const organization = await Organization.findById(req.user.organizationId);

    if (!organization.billing?.customerId) {
      return res.status(400).json({
        error: 'No billing account',
        message: 'You need to subscribe first'
      });
    }

    const session = await createBillingPortalSession(organization.billing.customerId);

    res.json({
      url: session.url
    });
  } catch (error) {
    console.error('Create portal error:', error);
    res.status(500).json({
      error: 'Failed to create billing portal session',
      message: error.message
    });
  }
}

/**
 * Get current subscription
 */
export async function getCurrentSubscription(req, res) {
  try {
    const organization = await Organization.findById(req.user.organizationId);

    if (!organization.billing?.subscriptionId) {
      return res.json({
        subscription: null,
        plan: 'free'
      });
    }

    const subscription = await getSubscription(organization.billing.subscriptionId);

    res.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        plan: organization.subscription.plan
      },
      plan: organization.subscription.plan
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      error: 'Failed to get subscription',
      message: error.message
    });
  }
}

/**
 * Cancel subscription
 */
export async function cancelCurrentSubscription(req, res) {
  try {
    const organization = await Organization.findById(req.user.organizationId);

    if (!organization.billing?.subscriptionId) {
      return res.status(400).json({
        error: 'No active subscription',
        message: 'You do not have an active subscription'
      });
    }

    const subscription = await cancelSubscription(organization.billing.subscriptionId);

    res.json({
      message: 'Subscription canceled successfully',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        cancelAt: subscription.cancel_at
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      error: 'Failed to cancel subscription',
      message: error.message
    });
  }
}

/**
 * Handle Stripe webhooks
 */
export async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await handleWebhookEvent(event);
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({
      error: 'Webhook handler failed',
      message: error.message
    });
  }
}
