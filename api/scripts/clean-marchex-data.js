import { initializeDatabase, queryItems, deleteItem } from '../src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function cleanMarchexData() {
  console.log('🧹 Cleaning Marchex data from database...\n');

  try {
    await initializeDatabase();

    // Find and delete all Marchex organizations
    const orgs = await queryItems('organizations', `SELECT * FROM c WHERE c.name = 'Marchex, Inc.'`);
    for (const org of orgs) {
      console.log(`Deleting organization: ${org.name} (${org.id})`);
      await deleteItem('organizations', org.id, org.id);
    }

    // Find and delete all users with marchex.com email
    const users = await queryItems('users', `SELECT * FROM c WHERE CONTAINS(c.email, 'marchex.com')`);
    for (const user of users) {
      console.log(`Deleting user: ${user.email} (${user.id})`);
      await deleteItem('users', user.id, user.organizationId);
    }

    // Find and delete all Marchex assessments
    const assessments = await queryItems('assessments', `SELECT * FROM c WHERE CONTAINS(c.name, 'Marchex')`);
    for (const assessment of assessments) {
      console.log(`Deleting assessment: ${assessment.name} (${assessment.id})`);
      await deleteItem('assessments', assessment.id, assessment.organizationId);
    }

    console.log('\n✅ Marchex data cleaned successfully');
  } catch (error) {
    console.error('❌ Error cleaning Marchex data:', error);
    process.exit(1);
  }
}

cleanMarchexData();
