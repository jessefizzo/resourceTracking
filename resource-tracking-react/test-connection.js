import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load environment variables
config();

const sql = neon(process.env.DATABASE_URL);

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await sql`SELECT version()`;
    console.log('✅ Database connection successful!');
    console.log('Database version:', result[0].version);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();