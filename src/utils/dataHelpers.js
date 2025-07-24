/**
 * Data Helper Functions
 * 
 * This module contains utility functions for data manipulation and filtering
 * used throughout the application.
 */

import { ENGINEER_FILTER } from '../constants/index.js';

/**
 * Gets engineers assigned to a specific project
 * @param {string} projectId - The project ID
 * @param {Array} assignments - Array of assignment objects
 * @param {Array} engineers - Array of engineer objects
 * @returns {Array} Array of engineers assigned to the project
 */
export function getProjectEngineers(projectId, assignments, engineers) {
  if (!projectId || !assignments || !engineers) {
    return [];
  }

  const projectAssignments = assignments.filter(
    assignment => assignment.projectId === projectId
  );
  
  return engineers.filter(engineer =>
    projectAssignments.some(assignment => assignment.engineerId === engineer.id)
  );
}

/**
 * Gets projects assigned to a specific engineer
 * @param {string} engineerId - The engineer ID
 * @param {Array} assignments - Array of assignment objects
 * @param {Array} projects - Array of project objects
 * @returns {Array} Array of projects assigned to the engineer
 */
export function getEngineerProjects(engineerId, assignments, projects) {
  if (!engineerId || !assignments || !projects) {
    return [];
  }

  const engineerAssignments = assignments.filter(
    assignment => assignment.engineerId === engineerId
  );
  
  return projects.filter(project =>
    engineerAssignments.some(assignment => assignment.projectId === project.id)
  );
}

/**
 * Filters engineers based on availability status
 * @param {Array} engineers - Array of engineer objects
 * @param {Array} assignments - Array of assignment objects
 * @param {string} filter - Filter type ('all', 'available', 'assigned')
 * @returns {Array} Filtered array of engineers
 */
export function getFilteredEngineers(engineers, assignments, filter) {
  if (!engineers || !assignments) {
    return [];
  }

  switch (filter) {
    case ENGINEER_FILTER.AVAILABLE:
      return engineers.filter(engineer =>
        !assignments.some(assignment => assignment.engineerId === engineer.id)
      );
    
    case ENGINEER_FILTER.ASSIGNED:
      return engineers.filter(engineer =>
        assignments.some(assignment => assignment.engineerId === engineer.id)
      );
    
    case ENGINEER_FILTER.ALL:
    default:
      return engineers;
  }
}

/**
 * Calculates statistics about engineers
 * @param {Array} engineers - Array of engineer objects
 * @param {Array} assignments - Array of assignment objects
 * @returns {object} Statistics object with total, assigned, and available counts
 */
export function calculateEngineerStats(engineers, assignments) {
  if (!engineers || !assignments) {
    return { total: 0, assigned: 0, available: 0 };
  }

  const total = engineers.length;
  const assignedEngineers = new Set(
    assignments.map(assignment => assignment.engineerId)
  );
  const assigned = assignedEngineers.size;
  const available = total - assigned;

  return { total, assigned, available };
}

/**
 * Generates CSS class name for project status
 * @param {string} status - The project status
 * @returns {string} CSS class name
 */
export function getStatusClass(status) {
  if (!status) return '';
  return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * Generates CSS class name for project priority
 * @param {string} priority - The project priority
 * @returns {string} CSS class name
 */
export function getPriorityClass(priority) {
  if (!priority) return '';
  return `priority-${priority.toLowerCase()}`;
}

/**
 * Checks if an engineer is available (not assigned to any projects)
 * @param {string} engineerId - The engineer ID
 * @param {Array} assignments - Array of assignment objects
 * @returns {boolean} True if engineer is available, false otherwise
 */
export function isEngineerAvailable(engineerId, assignments) {
  if (!engineerId || !assignments) {
    return false;
  }
  
  return !assignments.some(assignment => assignment.engineerId === engineerId);
}

/**
 * Formats a list of project names for display
 * @param {Array} projects - Array of project objects
 * @param {string} emptyText - Text to display when no projects
 * @returns {string} Formatted string of project names
 */
export function formatProjectList(projects, emptyText = 'No projects assigned') {
  if (!projects || projects.length === 0) {
    return emptyText;
  }
  
  return projects.map(project => project.name).join(', ');
}

/**
 * Validates project data
 * @param {object} projectData - The project data to validate
 * @returns {object} Validation result with isValid boolean and errors array
 */
export function validateProjectData(projectData) {
  const errors = [];
  
  if (!projectData.name || projectData.name.trim() === '') {
    errors.push('Project name is required');
  }
  
  if (!projectData.status) {
    errors.push('Project status is required');
  }
  
  if (!projectData.priority) {
    errors.push('Project priority is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates engineer data
 * @param {object} engineerData - The engineer data to validate
 * @returns {object} Validation result with isValid boolean and errors array
 */
export function validateEngineerData(engineerData) {
  const errors = [];
  
  if (!engineerData.name || engineerData.name.trim() === '') {
    errors.push('Engineer name is required');
  }
  
  if (!engineerData.role || engineerData.role.trim() === '') {
    errors.push('Engineer role is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}