import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import * as schema from './schema.js';

// Load environment variables from .env file
config();

// Database connection using Neon's serverless driver
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle({ client: sql, schema });

export { schema };