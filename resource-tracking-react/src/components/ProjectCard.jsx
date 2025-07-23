import React from 'react';

const ProjectCard = ({ project, engineers, onEdit, onDelete }) => {
  const getStatusClass = (status) => {
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="project-card">
      <div className="project-name">{project.name}</div>
      <div className={`project-status ${getStatusClass(project.status)}`}>
        {project.status}
      </div>
      <p>{project.description}</p>
      <div className="project-team">
        <h4>Team ({engineers.length})</h4>
        <div className="engineer-chips">
          {engineers.map(engineer => (
            <span key={engineer.id} className="engineer-chip">
              {engineer.name}
            </span>
          ))}
        </div>
      </div>
      <div className="card-actions">
        <button 
          className="edit-btn" 
          onClick={onEdit}
          style={{ pointerEvents: 'auto' }}
        >
          Edit
        </button>
        <button 
          className="delete-btn" 
          onClick={onDelete}
          style={{ pointerEvents: 'auto' }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;