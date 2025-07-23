import { db, schema } from '../../src/db/index.js';
import { eq } from 'drizzle-orm';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const { httpMethod, queryStringParameters, body } = event;

    switch (httpMethod) {
      case 'GET':
        // Get all engineers
        const engineers = await db.select().from(schema.engineers);
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify(engineers)
        };

      case 'POST':
        // Create new engineer
        const newEngineerData = JSON.parse(body);
        const [newEngineer] = await db
          .insert(schema.engineers)
          .values({
            name: newEngineerData.name,
            role: newEngineerData.role
          })
          .returning();
        
        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify(newEngineer)
        };

      case 'PUT':
        // Update existing engineer
        const updateData = JSON.parse(body);
        const [updatedEngineer] = await db
          .update(schema.engineers)
          .set({
            name: updateData.name,
            role: updateData.role,
            updatedAt: new Date()
          })
          .where(eq(schema.engineers.id, updateData.id))
          .returning();

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify(updatedEngineer)
        };

      case 'DELETE':
        // Delete engineer
        const engineerId = queryStringParameters.id;
        if (!engineerId) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Engineer ID is required' })
          };
        }

        // Delete engineer (cascading delete will handle assignments)
        await db
          .delete(schema.engineers)
          .where(eq(schema.engineers.id, engineerId));

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Engineer deleted successfully' })
        };

      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error in engineers function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};