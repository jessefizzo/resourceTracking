import React from 'react';
import PropTypes from 'prop-types';
import { getStatusClass, getPriorityClass } from '../utils/dataHelpers.js';

/**
 * ProjectCard Component
 * 
 * Displays a project card with project information, team members, and action buttons.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.project - Project object containing id, name, status, priority, description
 * @param {Array} props.engineers - Array of engineer objects assigned to this project
 * @param {Function} props.onEdit - Callback function called when edit button is clicked
 * @param {Function} props.onDelete - Callback function called when delete button is clicked
 */
const ProjectCard = ({ project, engineers, onEdit, onDelete }) => {
  // Ensure we have valid data to prevent runtime errors
  if (!project) {
    return null;
  }

  const engineerList = engineers || [];

  /**
   * Renders the project metadata section (status and priority)
   */
  const renderProjectMeta = () => (
    <div className="project-meta">
      <div className={`project-status ${getStatusClass(project.status)}`}>
        {project.status}
      </div>
      <div className={`project-priority ${getPriorityClass(project.priority)}`}>
        {project.priority}
      </div>
    </div>
  );

  /**
   * Renders the team section showing assigned engineers
   */
  const renderTeamSection = () => (
    <div className="project-team">
      <h4>Team ({engineerList.length})</h4>
      <div className="engineer-chips">
        {engineerList.length > 0 ? (
          engineerList.map(engineer => (
            <span key={engineer.id} className="engineer-chip">
              {engineer.name}
            </span>
          ))
        ) : (
          <span className="no-engineers">No engineers assigned</span>
        )}
      </div>
    </div>
  );

  /**
   * Renders the action buttons section
   */
  const renderActionButtons = () => (
    <div className="card-actions">
      <button 
        className="edit-btn" 
        onClick={onEdit}
        style={{ pointerEvents: 'auto' }}
        aria-label={`Edit project ${project.name}`}
      >
        Edit
      </button>
      <button 
        className="delete-btn" 
        onClick={onDelete}
        style={{ pointerEvents: 'auto' }}
        aria-label={`Delete project ${project.name}`}
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="project-card" data-testid={`project-card-${project.id}`}>
      {/* Project title */}
      <div className="project-name">{project.name}</div>
      
      {/* Project status and priority */}
      {renderProjectMeta()}
      
      {/* Project description */}
      {project.description && (
        <p className="project-description">{project.description}</p>
      )}
      
      {/* Team members */}
      {renderTeamSection()}
      
      {/* Action buttons */}
      {renderActionButtons()}
    </div>
  );
};

// PropTypes for type checking and documentation
ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  engineers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

// Default props
ProjectCard.defaultProps = {
  engineers: []
};

export default ProjectCard;