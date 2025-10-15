import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createProducts() {
  console.log('Creating Stripe products for 9Vectors...\n');

  try {
    // Product 1: Starter
    console.log('Creating Starter plan...');
    const starterProduct = await stripe.products.create({
      name: '9Vectors Starter',
      description: 'Up to 10 users, 50 assessments, AI insights, Advanced reports, Priority support',
      metadata: {
        plan: 'starter',
        users: '10',
        assessments: '50'
      }
    });

    const starterPrice = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 4900, // $49.00
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'starter'
      }
    });

    console.log('✓ Starter plan created');
    console.log(`  Product ID: ${starterProduct.id}`);
    console.log(`  Price ID: ${starterPrice.id}\n`);

    // Product 2: Professional
    console.log('Creating Professional plan...');
    const professionalProduct = await stripe.products.create({
      name: '9Vectors Professional',
      description: 'Up to 50 users, 500 assessments, AI insights & predictions, Custom branding, Advanced analytics, API access',
      metadata: {
        plan: 'professional',
        users: '50',
        assessments: '500'
      }
    });

    const professionalPrice = await stripe.prices.create({
      product: professionalProduct.id,
      unit_amount: 14900, // $149.00
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'professional'
      }
    });

    console.log('✓ Professional plan created');
    console.log(`  Product ID: ${professionalProduct.id}`);
    console.log(`  Price ID: ${professionalPrice.id}\n`);

    // Product 3: Enterprise
    console.log('Creating Enterprise plan...');
    const enterpriseProduct = await stripe.products.create({
      name: '9Vectors Enterprise',
      description: 'Unlimited users and assessments, Full AI suite, White-label solution, Custom integrations, SSO, Dedicated account manager, SLA guarantee',
      metadata: {
        plan: 'enterprise',
        users: 'unlimited',
        assessments: 'unlimited'
      }
    });

    const enterprisePrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 49900, // $499.00
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'enterprise'
      }
    });

    console.log('✓ Enterprise plan created');
    console.log(`  Product ID: ${enterpriseProduct.id}`);
    console.log(`  Price ID: ${enterprisePrice.id}\n`);

    // Print summary
    console.log('='.repeat(60));
    console.log('SUCCESS! All products created.');
    console.log('='.repeat(60));
    console.log('\nAdd these Price IDs to your api/.env file:\n');
    console.log(`STRIPE_PRICE_STARTER=${starterPrice.id}`);
    console.log(`STRIPE_PRICE_PROFESSIONAL=${professionalPrice.id}`);
    console.log(`STRIPE_PRICE_ENTERPRISE=${enterprisePrice.id}`);
    console.log('\n='.repeat(60));

  } catch (error) {
    console.error('Error creating products:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('\nPlease check that STRIPE_SECRET_KEY is set correctly in your .env file');
    }
    process.exit(1);
  }
}

// Run the script
createProducts();
