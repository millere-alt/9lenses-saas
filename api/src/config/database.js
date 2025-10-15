import { CosmosClient } from '@azure/cosmos';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE || '9vectors';

// Initialize Cosmos Client
const client = new CosmosClient({ endpoint, key });

// Database and container references
let database;
let containers = {};

/**
 * Initialize database and containers
 */
export async function initializeDatabase() {
  try {
    console.log('Initializing Cosmos DB connection...');

    // Create database if it doesn't exist
    const { database: db } = await client.databases.createIfNotExists({
      id: databaseId
    });
    database = db;
    console.log(`Database "${databaseId}" initialized`);

    // Create containers with partition keys
    const containerConfigs = [
      {
        id: process.env.COSMOS_CONTAINER_USERS || 'users',
        partitionKey: '/organizationId'
      },
      {
        id: process.env.COSMOS_CONTAINER_ORGANIZATIONS || 'organizations',
        partitionKey: '/id'
      },
      {
        id: process.env.COSMOS_CONTAINER_ASSESSMENTS || 'assessments',
        partitionKey: '/organizationId'
      }
    ];

    for (const config of containerConfigs) {
      const { container } = await database.containers.createIfNotExists({
        id: config.id,
        partitionKey: { paths: [config.partitionKey] }
      });
      containers[config.id] = container;
      console.log(`Container "${config.id}" initialized`);
    }

    console.log('Cosmos DB initialized successfully');
    return { database, containers };
  } catch (error) {
    console.error('Error initializing Cosmos DB:', error);
    throw error;
  }
}

/**
 * Get container by name
 */
export function getContainer(containerName) {
  if (!containers[containerName]) {
    throw new Error(`Container "${containerName}" not initialized`);
  }
  return containers[containerName];
}

/**
 * Query items from a container
 */
export async function queryItems(containerName, query, parameters = []) {
  const container = getContainer(containerName);
  const { resources } = await container.items
    .query({
      query,
      parameters
    })
    .fetchAll();
  return resources;
}

/**
 * Create an item in a container
 */
export async function createItem(containerName, item) {
  const container = getContainer(containerName);
  const { resource } = await container.items.create(item);
  return resource;
}

/**
 * Update an item in a container
 */
export async function updateItem(containerName, itemId, partitionKey, updates) {
  const container = getContainer(containerName);
  const { resource: existingItem } = await container.item(itemId, partitionKey).read();
  const updatedItem = { ...existingItem, ...updates, updatedAt: new Date().toISOString() };
  const { resource } = await container.item(itemId, partitionKey).replace(updatedItem);
  return resource;
}

/**
 * Delete an item from a container
 */
export async function deleteItem(containerName, itemId, partitionKey) {
  const container = getContainer(containerName);
  await container.item(itemId, partitionKey).delete();
  return true;
}

/**
 * Get item by ID
 */
export async function getItemById(containerName, itemId, partitionKey) {
  const container = getContainer(containerName);
  try {
    const { resource } = await container.item(itemId, partitionKey).read();
    return resource;
  } catch (error) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

export { client, database, containers };
