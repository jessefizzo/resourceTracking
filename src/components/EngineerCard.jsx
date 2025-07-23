import React from 'react';

const EngineerCard = ({ engineer, projects, onEdit, onDelete }) => {
  const isAvailable = projects.length === 0;
  const cardClass = `engineer-card ${isAvailable ? 'available' : 'assigned'}`;
  
  const projectNames = projects.map(project => project.name).join(', ');
  const displayText = isAvailable 
    ? 'None - Available for assignment' 
    : projectNames;

  return (
    <div className={cardClass}>
      <div className="engineer-name">{engineer.name}</div>
      <div className="engineer-role">{engineer.role}</div>
      <div className={`availability-status status-${isAvailable ? 'available' : 'assigned'}`}>
        {isAvailable ? 'Available' : 'Assigned'}
      </div>
      <div className="current-projects">
        <h5>Current Projects:</h5>
        <div className="project-list">
          {displayText}
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

export default EngineerCard;