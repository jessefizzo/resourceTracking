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
        // Get all projects
        const projects = await db.select().from(schema.projects);
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify(projects)
        };

      case 'POST':
        // Create new project
        const newProjectData = JSON.parse(body);
        const [newProject] = await db
          .insert(schema.projects)
          .values({
            name: newProjectData.name,
            status: newProjectData.status,
            description: newProjectData.description
          })
          .returning();
        
        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify(newProject)
        };

      case 'PUT':
        // Update existing project
        const updateData = JSON.parse(body);
        const [updatedProject] = await db
          .update(schema.projects)
          .set({
            name: updateData.name,
            status: updateData.status,
            description: updateData.description,
            updatedAt: new Date()
          })
          .where(eq(schema.projects.id, updateData.id))
          .returning();

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify(updatedProject)
        };

      case 'DELETE':
        // Delete project
        const projectId = queryStringParameters.id;
        if (!projectId) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Project ID is required' })
          };
        }

        // Delete project (cascading delete will handle assignments)
        await db
          .delete(schema.projects)
          .where(eq(schema.projects.id, projectId));

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Project deleted successfully' })
        };

      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error in projects function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};