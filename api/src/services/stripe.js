import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Organization } from '../models/Organization.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Subscription price mapping
 */
export const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER,
  professional: process.env.STRIPE_PRICE_PROFESSIONAL,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE
};

/**
 * Plan details
 */
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Up to 3 users',
      'Up to 5 assessments',
      'Up to 10 participants per assessment',
      'Basic reports',
      'Email support'
    ]
  },
  starter: {
    name: 'Starter',
    price: 49,
    interval: 'month',
    priceId: PRICE_IDS.starter,
    features: [
      'Up to 10 users',
      'Up to 50 assessments',
      'Up to 100 participants per assessment',
      'AI insights',
      'Advanced reports',
      'PDF/CSV export',
      'Priority email support'
    ]
  },
  professional: {
    name: 'Professional',
    price: 149,
    interval: 'month',
    priceId: PRICE_IDS.professional,
    features: [
      'Up to 50 users',
      'Up to 500 assessments',
      'Up to 1000 participants per assessment',
      'AI insights & predictions',
      'Custom branding',
      'Advanced analytics',
      'PDF/CSV export',
      'Dedicated support',
      'API access'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 499,
    interval: 'month',
    priceId: PRICE_IDS.enterprise,
    features: [
      'Unlimited users',
      'Unlimited assessments',
      'Unlimited participants',
      'Full AI suite',
      'White-label solution',
      'Custom integrations',
      'SSO & advanced security',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom contracts'
    ]
  }
};

/**
 * Create Stripe customer
 */
export async function createCustomer(email, name, organizationId) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      organizationId
    }
  });
  return customer;
}

/**
 * Create checkout session for subscription
 */
export async function createCheckoutSession(organizationId, plan, userId, email) {
  const priceId = PRICE_IDS[plan];

  if (!priceId) {
    throw new Error(`Invalid plan: ${plan}`);
  }

  // Get or create customer
  let customerId;
  const organization = await Organization.findById(organizationId);

  if (organization.billing?.customerId) {
    customerId = organization.billing.customerId;
  } else {
    const customer = await createCustomer(email, organization.name, organizationId);
    customerId = customer.id;

    // Update organization with customer ID
    await Organization.update(organizationId, {
      'billing.customerId': customerId
    });
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: `${process.env.FRONTEND_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/billing/canceled`,
    metadata: {
      organizationId,
      userId,
      plan
    }
  });

  return session;
}

/**
 * Create billing portal session
 */
export async function createBillingPortalSession(customerId) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.FRONTEND_URL}/billing`
  });

  return session;
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

/**
 * Update subscription
 */
export async function updateSubscription(subscriptionId, newPriceId) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId
      }
    ],
    proration_behavior: 'always_invoice'
  });

  return updatedSubscription;
}

/**
 * Handle webhook events
 */
export async function handleWebhookEvent(event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await handleCheckoutComplete(session);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      await handleSubscriptionUpdated(subscription);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await handleSubscriptionDeleted(subscription);
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      await handlePaymentSucceeded(invoice);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      await handlePaymentFailed(invoice);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Handle completed checkout
 */
async function handleCheckoutComplete(session) {
  const { organizationId, plan } = session.metadata;
  const subscriptionId = session.subscription;

  await Organization.updateSubscription(organizationId, plan, {
    'billing.subscriptionId': subscriptionId,
    'subscription.status': 'active',
    'subscription.currentPeriodStart': new Date().toISOString()
  });

  console.log(`Subscription activated for organization ${organizationId}: ${plan}`);
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription) {
  const organizationId = subscription.metadata?.organizationId;
  if (!organizationId) return;

  const status = subscription.status;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

  await Organization.update(organizationId, {
    'subscription.status': status,
    'subscription.currentPeriodEnd': currentPeriodEnd
  });

  console.log(`Subscription updated for organization ${organizationId}: ${status}`);
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription) {
  const organizationId = subscription.metadata?.organizationId;
  if (!organizationId) return;

  await Organization.updateSubscription(organizationId, 'free', {
    'subscription.status': 'canceled',
    'billing.subscriptionId': null
  });

  console.log(`Subscription canceled for organization ${organizationId}`);
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice) {
  console.log(`Payment succeeded for customer ${invoice.customer}`);
  // You can add logic here to send receipt emails, update payment history, etc.
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice) {
  console.log(`Payment failed for customer ${invoice.customer}`);
  // You can add logic here to notify the customer, update subscription status, etc.
}

export default stripe;
