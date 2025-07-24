/**
 * Application Constants
 * 
 * This file contains all the constants used throughout the application
 * to ensure consistency and make maintenance easier.
 */

// Project status options
export const PROJECT_STATUS = {
  ACTIVE: 'Active',
  PLANNING: 'Planning',
  ON_HOLD: 'On Hold'
};

// Project status options as array for dropdowns
export const PROJECT_STATUS_OPTIONS = [
  PROJECT_STATUS.ACTIVE,
  PROJECT_STATUS.PLANNING,
  PROJECT_STATUS.ON_HOLD
];

// Project priority options
export const PROJECT_PRIORITY = {
  UNPRIORITIZED: 'Unprioritized',
  P1: 'P1',
  P2: 'P2',
  P3: 'P3'
};

// Project priority options as array for dropdowns
export const PROJECT_PRIORITY_OPTIONS = [
  PROJECT_PRIORITY.UNPRIORITIZED,
  PROJECT_PRIORITY.P1,
  PROJECT_PRIORITY.P2,
  PROJECT_PRIORITY.P3
];

// Engineer filter options
export const ENGINEER_FILTER = {
  ALL: 'all',
  AVAILABLE: 'available',
  ASSIGNED: 'assigned'
};

// Engineer filter options as array
export const ENGINEER_FILTER_OPTIONS = [
  ENGINEER_FILTER.ALL,
  ENGINEER_FILTER.AVAILABLE,
  ENGINEER_FILTER.ASSIGNED
];

// API endpoints
export const API_ENDPOINTS = {
  PROJECTS: '/.netlify/functions/projects',
  ENGINEERS: '/.netlify/functions/engineers',
  ASSIGNMENTS: '/.netlify/functions/assignments'
};

// HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS'
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500
};

// CORS headers
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

// Default form values
export const DEFAULT_PROJECT_FORM = {
  name: '',
  status: PROJECT_STATUS.ACTIVE,
  priority: PROJECT_PRIORITY.UNPRIORITIZED,
  description: '',
  engineerIds: []
};

export const DEFAULT_ENGINEER_FORM = {
  name: '',
  role: ''
};