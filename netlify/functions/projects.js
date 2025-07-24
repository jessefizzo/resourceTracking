/**
 * Projects API Function
 * 
 * Serverless function for handling project CRUD operations.
 * Provides endpoints for creating, reading, updating, and deleting projects.
 * 
 * Supported HTTP methods:
 * - GET: Retrieve all projects
 * - POST: Create a new project
 * - PUT: Update an existing project
 * - DELETE: Delete a project
 * - OPTIONS: CORS preflight handling
 */

import { db, schema } from '../../src/db/index.js';
import { eq } from 'drizzle-orm';
import { 
  HTTP_STATUS, 
  HTTP_METHODS, 
  CORS_HEADERS,
  PROJECT_PRIORITY 
} from '../../src/constants/index.js';

/**
 * Validates project data for creation/update operations
 * @param {Object} projectData - The project data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
function validateProjectData(projectData) {
  const errors = [];
  
  if (!projectData) {
    errors.push('Project data is required');
    return { isValid: false, errors };
  }
  
  if (!projectData.name || typeof projectData.name !== 'string' || projectData.name.trim() === '') {
    errors.push('Project name is required and must be a non-empty string');
  }
  
  if (!projectData.status || typeof projectData.status !== 'string') {
    errors.push('Project status is required and must be a string');
  }
  
  if (projectData.priority && typeof projectData.priority !== 'string') {
    errors.push('Project priority must be a string');
  }
  
  if (projectData.description && typeof projectData.description !== 'string') {
    errors.push('Project description must be a string');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Creates a standardized API response
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 * @param {string} message - Optional message
 * @returns {Object} Formatted response object
 */
function createResponse(statusCode, data = null, message = null) {
  const body = message ? { message, data } : data;
  
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body)
  };
}

/**
 * Handles GET requests - retrieve all projects
 * @returns {Object} API response with projects array
 */
async function handleGetProjects() {
  try {
    const projects = await db.select().from(schema.projects);
    return createResponse(HTTP_STATUS.OK, projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

/**
 * Handles POST requests - create a new project
 * @param {string} body - Request body containing project data
 * @returns {Object} API response with created project
 */
async function handleCreateProject(body) {
  try {
    const projectData = JSON.parse(body);
    
    // Validate project data
    const validation = validateProjectData(projectData);
    if (!validation.isValid) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, { 
        errors: validation.errors 
      }, 'Validation failed');
    }
    
    // Create project with defaults
    const [newProject] = await db
      .insert(schema.projects)
      .values({
        name: projectData.name.trim(),
        status: projectData.status,
        priority: projectData.priority || PROJECT_PRIORITY.UNPRIORITIZED,
        description: projectData.description ? projectData.description.trim() : null
      })
      .returning();
    
    return createResponse(HTTP_STATUS.CREATED, newProject, 'Project created successfully');
  } catch (error) {
    console.error('Error creating project:', error);
    
    if (error instanceof SyntaxError) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, null, 'Invalid JSON in request body');
    }
    
    throw error;
  }
}

/**
 * Handles PUT requests - update an existing project
 * @param {string} body - Request body containing project data with ID
 * @returns {Object} API response with updated project
 */
async function handleUpdateProject(body) {
  try {
    const updateData = JSON.parse(body);
    
    // Validate required ID
    if (!updateData.id) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, null, 'Project ID is required for update');
    }
    
    // Validate project data
    const validation = validateProjectData(updateData);
    if (!validation.isValid) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, { 
        errors: validation.errors 
      }, 'Validation failed');
    }
    
    // Update project
    const [updatedProject] = await db
      .update(schema.projects)
      .set({
        name: updateData.name.trim(),
        status: updateData.status,
        priority: updateData.priority || PROJECT_PRIORITY.UNPRIORITIZED,
        description: updateData.description ? updateData.description.trim() : null,
        updatedAt: new Date()
      })
      .where(eq(schema.projects.id, updateData.id))
      .returning();

    if (!updatedProject) {
      return createResponse(HTTP_STATUS.NOT_FOUND, null, 'Project not found');
    }

    return createResponse(HTTP_STATUS.OK, updatedProject, 'Project updated successfully');
  } catch (error) {
    console.error('Error updating project:', error);
    
    if (error instanceof SyntaxError) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, null, 'Invalid JSON in request body');
    }
    
    throw error;
  }
}

/**
 * Handles DELETE requests - delete a project
 * @param {Object} queryStringParameters - Query parameters containing project ID
 * @returns {Object} API response confirming deletion
 */
async function handleDeleteProject(queryStringParameters) {
  try {
    const projectId = queryStringParameters?.id;
    
    if (!projectId) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, null, 'Project ID is required');
    }
    
    // Check if project exists before deletion
    const existingProject = await db
      .select({ id: schema.projects.id })
      .from(schema.projects)
      .where(eq(schema.projects.id, projectId))
      .limit(1);
    
    if (existingProject.length === 0) {
      return createResponse(HTTP_STATUS.NOT_FOUND, null, 'Project not found');
    }
    
    // Delete project (cascading delete will handle assignments)
    await db
      .delete(schema.projects)
      .where(eq(schema.projects.id, projectId));

    return createResponse(HTTP_STATUS.OK, { id: projectId }, 'Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

/**
 * Main handler function for the projects API
 * @param {Object} event - Netlify function event object
 * @param {Object} context - Netlify function context object
 * @returns {Object} API response
 */
export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === HTTP_METHODS.OPTIONS) {
    return createResponse(HTTP_STATUS.OK, null);
  }

  try {
    const { httpMethod, queryStringParameters, body } = event;

    // Route to appropriate handler based on HTTP method
    switch (httpMethod) {
      case HTTP_METHODS.GET:
        return await handleGetProjects();

      case HTTP_METHODS.POST:
        return await handleCreateProject(body);

      case HTTP_METHODS.PUT:
        return await handleUpdateProject(body);

      case HTTP_METHODS.DELETE:
        return await handleDeleteProject(queryStringParameters);

      default:
        return createResponse(
          HTTP_STATUS.METHOD_NOT_ALLOWED, 
          null, 
          `Method ${httpMethod} not allowed`
        );
    }
  } catch (error) {
    console.error('Unhandled error in projects function:', error);
    
    // Return generic error to avoid exposing internal details
    return createResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR, 
      null, 
      'An internal server error occurred'
    );
  }
};