import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import * as schema from './schema.js';

// Load environment variables from .env file
config();

// Database connection using Neon's serverless driver
// Use Netlify's provided environment variable, fallback to local .env
const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('No database connection string found. Please set NETLIFY_DATABASE_URL or DATABASE_URL environment variable.');
}

const sql = neon(databaseUrl);
export const db = drizzle({ client: sql, schema });

export { schema };