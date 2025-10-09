import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Pricing plans
const PLANS = {
  BASIC: {
    price: 'price_basic_monthly', // Replace with actual Stripe price ID
    amount: 4900, // $49/month
    features: ['10 users', '10 assessments/month', '1000 AI requests']
  },
  PRO: {
    price: 'price_pro_monthly',
    amount: 14900, // $149/month
    features: ['50 users', 'Unlimited assessments', '10000 AI requests', 'Advanced analytics']
  },
  ENTERPRISE: {
    price: 'price_enterprise_monthly',
    amount: 49900, // $499/month
    features: ['Unlimited users', 'Unlimited everything', 'Dedicated support']
  }
};

// Create checkout session
router.post('/create-checkout-session',
  authenticate,
  async (req, res) => {
    try {
      const { tier } = req.body;

      if (!PLANS[tier]) {
        return res.status(400).json({ error: 'Invalid plan' });
      }

      // Create or get Stripe customer
      let customerId = req.user.organization.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: req.user.email,
          metadata: {
            organizationId: req.user.organizationId,
            userId: req.user.id
          }
        });
        customerId = customer.id;

        await prisma.organization.update({
          where: { id: req.user.organizationId },
          data: { stripeCustomerId: customerId }
        });
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: PLANS[tier].price,
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/dashboard?checkout=success`,
        cancel_url: `${process.env.FRONTEND_URL}/dashboard?checkout=canceled`,
        metadata: {
          organizationId: req.user.organizationId,
          tier
        }
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error('Checkout session error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  }
);

// Webhook handler
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const { organizationId, tier } = session.metadata;

          await prisma.organization.update({
            where: { id: organizationId },
            data: {
              subscriptionTier: tier,
              subscriptionStatus: 'ACTIVE',
              stripeSubscriptionId: session.subscription,
              subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
          });
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object;
          await prisma.organization.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              subscriptionStatus: subscription.status.toUpperCase()
            }
          });
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object;
          await prisma.organization.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              subscriptionTier: 'FREE',
              subscriptionStatus: 'CANCELED'
            }
          });
          break;
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

// Get current subscription
router.get('/subscription', authenticate, async (req, res) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.user.organizationId }
    });

    if (!org.stripeSubscriptionId) {
      return res.json({ tier: 'FREE', status: null });
    }

    const subscription = await stripe.subscriptions.retrieve(org.stripeSubscriptionId);

    res.json({
      tier: org.subscriptionTier,
      status: org.subscriptionStatus,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Cancel subscription
router.post('/cancel-subscription', authenticate, async (req, res) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.user.organizationId }
    });

    if (!org.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription' });
    }

    await stripe.subscriptions.update(org.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    res.json({ message: 'Subscription will cancel at period end' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

export default router;
