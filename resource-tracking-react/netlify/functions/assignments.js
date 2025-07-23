import { db, schema } from '../../src/db/index.js';
import { eq } from 'drizzle-orm';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
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
        // Get all project assignments
        const assignments = await db.select().from(schema.projectAssignments);
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify(assignments)
        };

      case 'POST':
        // Create new assignment
        const assignmentData = JSON.parse(body);
        const [newAssignment] = await db
          .insert(schema.projectAssignments)
          .values({
            projectId: assignmentData.projectId,
            engineerId: assignmentData.engineerId
          })
          .returning();
        
        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify(newAssignment)
        };

      case 'DELETE':
        // Delete assignment
        const assignmentId = queryStringParameters.id;
        if (!assignmentId) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Assignment ID is required' })
          };
        }

        await db
          .delete(schema.projectAssignments)
          .where(eq(schema.projectAssignments.id, assignmentId));

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Assignment deleted successfully' })
        };

      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error in assignments function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};