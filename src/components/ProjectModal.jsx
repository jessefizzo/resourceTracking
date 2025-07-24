import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  PROJECT_STATUS_OPTIONS, 
  PROJECT_PRIORITY_OPTIONS,
  DEFAULT_PROJECT_FORM 
} from '../constants/index.js';
import { validateProjectData } from '../utils/dataHelpers.js';

/**
 * ProjectModal Component
 * 
 * Modal dialog for creating and editing projects. Handles form validation,
 * data submission, and provides a clean user interface for project management.
 * Includes engineer assignment functionality.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether the modal is visible
 * @param {Object|null} props.project - Project object for editing (null for creating)
 * @param {Array} props.engineers - Array of all available engineers
 * @param {Array} props.currentAssignments - Current engineer assignments for this project
 * @param {Function} props.onSave - Callback function called when form is submitted
 * @param {Function} props.onClose - Callback function called when modal is closed
 */
const ProjectModal = ({ show, project, engineers, currentAssignments, onSave, onClose }) => {
  // Form state management
  const [formData, setFormData] = useState(DEFAULT_PROJECT_FORM);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Reset form to default values
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_PROJECT_FORM);
    setErrors([]);
    setIsSubmitting(false);
  }, []);

  /**
   * Initialize form data when modal opens or project changes
   */
  useEffect(() => {
    if (show) {
      if (project) {
        // Edit mode - populate form with existing project data
        const assignedEngineerIds = currentAssignments ? currentAssignments.map(eng => eng.id) : [];
        setFormData({
          name: project.name || '',
          status: project.status || DEFAULT_PROJECT_FORM.status,
          priority: project.priority || DEFAULT_PROJECT_FORM.priority,
          description: project.description || '',
          engineerIds: assignedEngineerIds
        });
      } else {
        // Create mode - use default values
        resetForm();
      }
    }
  }, [project, show, resetForm, currentAssignments]);

  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  }, [errors.length]);

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateProjectData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      await onSave(formData);
      // Form will be reset when modal closes
    } catch (error) {
      setErrors([error.message || 'An error occurred while saving the project']);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle backdrop click to close modal
   * @param {Event} e - Click event
   */
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  /**
   * Handle engineer assignment changes
   * @param {string} engineerId - The engineer ID to toggle
   * @param {boolean} checked - Whether the engineer should be assigned
   */
  const handleEngineerChange = useCallback((engineerId, checked) => {
    setFormData(prevData => ({
      ...prevData,
      engineerIds: checked
        ? [...prevData.engineerIds, engineerId]
        : prevData.engineerIds.filter(id => id !== engineerId)
    }));
  }, []);

  /**
   * Handle modal close
   */
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  /**
   * Renders form field with label and validation
   */
  const renderFormField = (id, label, type = 'text', required = false, options = null) => (
    <div className="form-group">
      <label htmlFor={id}>
        {label} {required && <span className="required">*</span>}
      </label>
      {type === 'select' && options ? (
        <select
          id={id}
          name={id.replace('project-', '')}
          value={formData[id.replace('project-', '')]}
          onChange={handleChange}
          required={required}
          disabled={isSubmitting}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          name={id.replace('project-', '')}
          value={formData[id.replace('project-', '')]}
          onChange={handleChange}
          rows="3"
          disabled={isSubmitting}
          placeholder="Enter project description..."
        />
      ) : (
        <input
          type={type}
          id={id}
          name={id.replace('project-', '')}
          value={formData[id.replace('project-', '')]}
          onChange={handleChange}
          required={required}
          disabled={isSubmitting}
          placeholder={`Enter project ${label.toLowerCase()}...`}
        />
      )}
    </div>
  );

  /**
   * Renders error messages
   */
  const renderErrors = () => {
    if (errors.length === 0) return null;

    return (
      <div className="form-errors" role="alert">
        {errors.map((error, index) => (
          <div key={index} className="error-message">
            {error}
          </div>
        ))}
      </div>
    );
  };

  /**
   * Renders engineer selection checkboxes
   */
  const renderEngineerSelection = () => {
    if (!engineers || engineers.length === 0) {
      return (
        <div className="form-group">
          <label>Assigned Engineers</label>
          <p className="no-engineers-message">No engineers available for assignment</p>
        </div>
      );
    }

    return (
      <div className="form-group">
        <label>Assigned Engineers</label>
        <div className="engineer-checkboxes">
          {engineers.map(engineer => (
            <div key={engineer.id} className="checkbox-item">
              <input
                type="checkbox"
                id={`engineer-${engineer.id}`}
                checked={formData.engineerIds.includes(engineer.id)}
                onChange={(e) => handleEngineerChange(engineer.id, e.target.checked)}
                disabled={isSubmitting}
              />
              <label htmlFor={`engineer-${engineer.id}`}>
                {engineer.name} - {engineer.role}
              </label>
            </div>
          ))}
        </div>
        {formData.engineerIds.length === 0 && (
          <p className="assignment-hint">No engineers assigned to this project</p>
        )}
      </div>
    );
  };

  // Don't render if modal is not shown
  if (!show) return null;

  const isEditMode = Boolean(project);
  const modalTitle = isEditMode ? 'Edit Project' : 'Add New Project';
  const submitButtonText = isEditMode ? 'Update Project' : 'Create Project';

  return (
    <div 
      className="modal show" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 id="modal-title">{modalTitle}</h3>
          <button
            type="button"
            className="close"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Error Messages */}
          {renderErrors()}

          {/* Form Fields */}
          {renderFormField('project-name', 'Project Name', 'text', true)}
          {renderFormField('project-status', 'Status', 'select', true, PROJECT_STATUS_OPTIONS)}
          {renderFormField('project-priority', 'Priority', 'select', true, PROJECT_PRIORITY_OPTIONS)}
          {renderFormField('project-description', 'Description', 'textarea')}
          
          {/* Engineer Assignment Section */}
          {renderEngineerSelection()}

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PropTypes for type checking and documentation
ProjectModal.propTypes = {
  show: PropTypes.bool.isRequired,
  project: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    description: PropTypes.string
  }),
  engineers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  })),
  currentAssignments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

// Default props
ProjectModal.defaultProps = {
  project: null,
  engineers: [],
  currentAssignments: []
};

export default ProjectModal;