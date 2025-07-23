import React, { useState, useEffect } from 'react';

const EngineerModal = ({ show, engineer, projects, currentAssignments, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    projectIds: []
  });

  useEffect(() => {
    if (engineer) {
      setFormData({
        name: engineer.name || '',
        role: engineer.role || '',
        projectIds: currentAssignments.map(project => project.id) || []
      });
    } else {
      setFormData({
        name: '',
        role: '',
        projectIds: []
      });
    }
  }, [engineer, currentAssignments, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProjectChange = (projectId, checked) => {
    setFormData(prev => ({
      ...prev,
      projectIds: checked
        ? [...prev.projectIds, projectId]
        : prev.projectIds.filter(id => id !== projectId)
    }));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="modal show" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{engineer ? 'Edit Engineer' : 'Add New Engineer'}</h3>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="engineer-name">Name *</label>
            <input
              type="text"
              id="engineer-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="engineer-role">Role *</label>
            <input
              type="text"
              id="engineer-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Current Projects</label>
            <div className="project-checkboxes">
              {projects.map(project => (
                <div key={project.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`project-${project.id}`}
                    checked={formData.projectIds.includes(project.id)}
                    onChange={(e) => handleProjectChange(project.id, e.target.checked)}
                  />
                  <label htmlFor={`project-${project.id}`}>
                    {project.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Engineer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EngineerModal;