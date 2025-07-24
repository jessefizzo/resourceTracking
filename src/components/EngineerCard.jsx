import React from 'react';
import PropTypes from 'prop-types';

/**
 * EngineerCard Component
 * 
 * Displays an engineer card with basic information and current project assignments.
 * Project assignments are read-only here - they must be managed through individual
 * project editing.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.engineer - Engineer object containing id, name, role
 * @param {Array} props.projects - Array of projects the engineer is assigned to
 * @param {Function} props.onEdit - Callback function called when edit button is clicked
 * @param {Function} props.onDelete - Callback function called when delete button is clicked
 */
const EngineerCard = ({ engineer, projects, onEdit, onDelete }) => {
  // Ensure we have valid data to prevent runtime errors
  if (!engineer) {
    return null;
  }

  const projectList = projects || [];
  const isAvailable = projectList.length === 0;
  const cardClass = `engineer-card ${isAvailable ? 'available' : 'assigned'}`;

  /**
   * Renders the current projects section
   */
  const renderCurrentProjects = () => {
    if (isAvailable) {
      return (
        <div className="current-projects">
          <h5>Current Projects:</h5>
          <div className="project-list empty">
            <span className="no-projects">Available for assignment</span>
            <small className="assignment-hint">
              Assign this engineer to projects by editing individual projects
            </small>
          </div>
        </div>
      );
    }

    return (
      <div className="current-projects">
        <h5>Current Projects ({projectList.length}):</h5>
        <div className="project-list">
          {projectList.map((project, index) => (
            <span key={project.id} className="project-item">
              {project.name}
              {index < projectList.length - 1 && <span className="separator">, </span>}
            </span>
          ))}
          <small className="assignment-hint">
            To modify assignments, edit the individual projects
          </small>
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
        aria-label={`Edit engineer ${engineer.name}`}
        title="Edit engineer information (name, role)"
      >
        Edit Info
      </button>
      <button 
        className="delete-btn" 
        onClick={onDelete}
        style={{ pointerEvents: 'auto' }}
        aria-label={`Delete engineer ${engineer.name}`}
        title="Delete this engineer"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className={cardClass} data-testid={`engineer-card-${engineer.id}`}>
      {/* Engineer basic information */}
      <div className="engineer-name">{engineer.name}</div>
      <div className="engineer-role">{engineer.role}</div>
      
      {/* Availability status */}
      <div className={`availability-status status-${isAvailable ? 'available' : 'assigned'}`}>
        {isAvailable ? 'Available' : `Assigned to ${projectList.length} project${projectList.length === 1 ? '' : 's'}`}
      </div>
      
      {/* Current projects (read-only) */}
      {renderCurrentProjects()}
      
      {/* Action buttons */}
      {renderActionButtons()}
    </div>
  );
};

// PropTypes for type checking and documentation
EngineerCard.propTypes = {
  engineer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  }).isRequired,
  projects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

// Default props
EngineerCard.defaultProps = {
  projects: []
};

export default EngineerCard;