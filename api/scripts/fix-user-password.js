/**
 * Script to add/update password for a user who doesn't have one
 * Usage: node scripts/fix-user-password.js <email> <new-password>
 */

import 'dotenv/config';
import { User } from '../src/models/User.js';
import { initializeDatabase } from '../src/config/database.js';

async function fixUserPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error('Usage: node scripts/fix-user-password.js <email> <new-password>');
    process.exit(1);
  }

  try {
    // Initialize database
    console.log('Connecting to database...');
    await initializeDatabase();

    // Find user
    console.log(`Looking for user: ${email}`);
    const user = await User.findByEmail(email);

    if (!user) {
      console.error(`User not found: ${email}`);
      process.exit(1);
    }

    console.log(`Found user:`, {
      id: user.id,
      email: user.email,
      organizationId: user.organizationId,
      hasPasswordHash: !!user.passwordHash
    });

    if (user.passwordHash) {
      console.log('⚠️  User already has a password. This will overwrite it.');
    }

    // Hash new password
    console.log('Hashing new password...');
    const passwordHash = await User.hashPassword(newPassword);

    // Update user
    console.log('Updating user in database...');
    const updated = await User.update(user.id, user.organizationId, {
      passwordHash,
      updatedAt: new Date().toISOString()
    });

    console.log('✅ Password updated successfully!');
    console.log('User can now login with:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${newPassword}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

fixUserPassword();
