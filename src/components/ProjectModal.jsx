import React, { useState, useEffect } from 'react';

const ProjectModal = ({ show, project, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'Active',
    priority: 'Unprioritized',
    description: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        status: project.status || 'Active',
        priority: project.priority || 'Unprioritized',
        description: project.description || ''
      });
    } else {
      setFormData({
        name: '',
        status: 'Active',
        priority: 'Unprioritized',
        description: ''
      });
    }
  }, [project, show]);

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
          <h3>{project ? 'Edit Project' : 'Add New Project'}</h3>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="project-name">Project Name *</label>
            <input
              type="text"
              id="project-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="project-status">Status *</label>
            <select
              id="project-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="project-priority">Priority *</label>
            <select
              id="project-priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="Unprioritized">Unprioritized</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;