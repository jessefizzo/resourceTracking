import React from 'react';
import PropTypes from 'prop-types';
import { getStatusClass, getPriorityClass } from '../utils/dataHelpers.js';

/**
 * ProjectCard Component
 * 
 * Displays a project card with project information, team members, and action buttons.
 * Supports compact mode for better overview display.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.project - Project object containing id, name, status, priority, description
 * @param {Array} props.engineers - Array of engineer objects assigned to this project
 * @param {Function} props.onEdit - Callback function called when edit button is clicked
 * @param {Function} props.onDelete - Callback function called when delete button is clicked
 * @param {boolean} props.compact - Whether to display in compact mode
 */
const ProjectCard = ({ project, engineers, onEdit, onDelete, compact = false }) => {
  // Ensure we have valid data to prevent runtime errors
  if (!project) {
    return null;
  }

  const engineerList = engineers || [];

  /**
   * Gets priority color class for color coding
   * @param {string} priority - Priority level (P1, P2, P3, Unprioritized)
   * @returns {string} CSS class name for priority color
   */
  const getPriorityColorClass = (priority) => {
    switch(priority) {
      case 'P1': return 'priority-p1';
      case 'P2': return 'priority-p2';
      case 'P3': return 'priority-p3';
      case 'Unprioritized': 
      default: return 'priority-unprioritized';
    }
  };

  /**
   * Renders the project metadata section (status and priority)
   */
  const renderProjectMeta = () => (
    <div className="project-meta">
      <div className={`project-status ${getStatusClass(project.status)}`}>
        {project.status}
      </div>
      <div className={`project-priority ${getPriorityClass(project.priority)} ${getPriorityColorClass(project.priority)}`}>
        {project.priority}
      </div>
    </div>
  );

  /**
   * Renders the team section showing assigned engineers
   */
  const renderTeamSection = () => {
    if (compact) {
      return (
        <div className="project-team compact">
          <span className="team-count">
            👥 {engineerList.length} engineer{engineerList.length !== 1 ? 's' : ''}
          </span>
          {engineerList.length > 0 && (
            <span className="team-names">
              {engineerList.map(eng => eng.name).join(', ')}
            </span>
          )}
        </div>
      );
    }

    return (
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
  };

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

  const cardClasses = [
    'project-card',
    getPriorityColorClass(project.priority),
    compact ? 'compact' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} data-testid={`project-card-${project.id}`}>
      {/* Project title */}
      <div className="project-name">{project.name}</div>
      
      {/* Project status and priority */}
      {renderProjectMeta()}
      
      {/* Project description - only show in non-compact mode or if very short */}
      {!compact && project.description && (
        <p className="project-description">{project.description}</p>
      )}
      {compact && project.description && project.description.length < 60 && (
        <p className="project-description compact">{project.description}</p>
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
  onDelete: PropTypes.func.isRequired,
  compact: PropTypes.bool
};

// Default props
ProjectCard.defaultProps = {
  engineers: [],
  compact: false
};

export default ProjectCard;