/**
 * API Utility Functions
 * 
 * This module contains reusable functions for making API calls
 * with proper error handling and consistent patterns.
 */

import { API_ENDPOINTS, HTTP_METHODS } from '../constants/index.js';

/**
 * Makes a fetch request with error handling
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @returns {Promise<object>} The response data
 * @throws {Error} If the request fails
 */
async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Fetches all projects from the API
 * @returns {Promise<Array>} Array of project objects
 */
export async function fetchProjects() {
  return fetchWithErrorHandling(API_ENDPOINTS.PROJECTS);
}

/**
 * Creates a new project
 * @param {object} projectData - The project data to create
 * @returns {Promise<object>} The created project
 */
export async function createProject(projectData) {
  return fetchWithErrorHandling(API_ENDPOINTS.PROJECTS, {
    method: HTTP_METHODS.POST,
    body: JSON.stringify(projectData)
  });
}

/**
 * Updates an existing project
 * @param {object} projectData - The project data to update (must include id)
 * @returns {Promise<object>} The updated project
 */
export async function updateProject(projectData) {
  return fetchWithErrorHandling(API_ENDPOINTS.PROJECTS, {
    method: HTTP_METHODS.PUT,
    body: JSON.stringify(projectData)
  });
}

/**
 * Deletes a project
 * @param {string} projectId - The ID of the project to delete
 * @returns {Promise<object>} Success message
 */
export async function deleteProject(projectId) {
  return fetchWithErrorHandling(`${API_ENDPOINTS.PROJECTS}?id=${projectId}`, {
    method: HTTP_METHODS.DELETE
  });
}

/**
 * Fetches all engineers from the API
 * @returns {Promise<Array>} Array of engineer objects
 */
export async function fetchEngineers() {
  return fetchWithErrorHandling(API_ENDPOINTS.ENGINEERS);
}

/**
 * Creates a new engineer
 * @param {object} engineerData - The engineer data to create
 * @returns {Promise<object>} The created engineer
 */
export async function createEngineer(engineerData) {
  return fetchWithErrorHandling(API_ENDPOINTS.ENGINEERS, {
    method: HTTP_METHODS.POST,
    body: JSON.stringify(engineerData)
  });
}

/**
 * Updates an existing engineer
 * @param {object} engineerData - The engineer data to update (must include id)
 * @returns {Promise<object>} The updated engineer
 */
export async function updateEngineer(engineerData) {
  return fetchWithErrorHandling(API_ENDPOINTS.ENGINEERS, {
    method: HTTP_METHODS.PUT,
    body: JSON.stringify(engineerData)
  });
}

/**
 * Deletes an engineer
 * @param {string} engineerId - The ID of the engineer to delete
 * @returns {Promise<object>} Success message
 */
export async function deleteEngineer(engineerId) {
  return fetchWithErrorHandling(`${API_ENDPOINTS.ENGINEERS}?id=${engineerId}`, {
    method: HTTP_METHODS.DELETE
  });
}

/**
 * Fetches all assignments from the API
 * @returns {Promise<Array>} Array of assignment objects
 */
export async function fetchAssignments() {
  return fetchWithErrorHandling(API_ENDPOINTS.ASSIGNMENTS);
}

/**
 * Creates a new assignment
 * @param {object} assignmentData - The assignment data to create
 * @returns {Promise<object>} The created assignment
 */
export async function createAssignment(assignmentData) {
  return fetchWithErrorHandling(API_ENDPOINTS.ASSIGNMENTS, {
    method: HTTP_METHODS.POST,
    body: JSON.stringify(assignmentData)
  });
}

/**
 * Deletes an assignment
 * @param {string} assignmentId - The ID of the assignment to delete
 * @returns {Promise<object>} Success message
 */
export async function deleteAssignment(assignmentId) {
  return fetchWithErrorHandling(`${API_ENDPOINTS.ASSIGNMENTS}?id=${assignmentId}`, {
    method: HTTP_METHODS.DELETE
  });
}

/**
 * Loads all application data in parallel
 * @returns {Promise<object>} Object containing projects, engineers, and assignments
 */
export async function loadAllData() {
  try {
    const [projects, engineers, assignments] = await Promise.all([
      fetchProjects(),
      fetchEngineers(),
      fetchAssignments()
    ]);

    return { projects, engineers, assignments };
  } catch (error) {
    console.error('Failed to load application data:', error);
    throw new Error('Failed to load data. Please refresh the page or try again later.');
  }
}