import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_ENGINEER_FORM } from '../constants/index.js';
import { validateEngineerData } from '../utils/dataHelpers.js';

/**
 * EngineerModal Component
 * 
 * Modal dialog for creating and editing engineers. Simplified to handle only
 * engineer information (name and role). Project assignments are now managed
 * through the ProjectModal.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether the modal is visible
 * @param {Object|null} props.engineer - Engineer object for editing (null for creating)
 * @param {Function} props.onSave - Callback function called when form is submitted
 * @param {Function} props.onClose - Callback function called when modal is closed
 */
const EngineerModal = ({ show, engineer, onSave, onClose }) => {
  // Form state management
  const [formData, setFormData] = useState(DEFAULT_ENGINEER_FORM);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Reset form to default values
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_ENGINEER_FORM);
    setErrors([]);
    setIsSubmitting(false);
  }, []);

  /**
   * Initialize form data when modal opens or engineer changes
   */
  useEffect(() => {
    if (show) {
      if (engineer) {
        // Edit mode - populate form with existing engineer data
        setFormData({
          name: engineer.name || '',
          role: engineer.role || ''
        });
      } else {
        // Create mode - use default values
        resetForm();
      }
    }
  }, [engineer, show, resetForm]);

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
    const validation = validateEngineerData(formData);
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
      setErrors([error.message || 'An error occurred while saving the engineer']);
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
   * Handle modal close
   */
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

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

  // Don't render if modal is not shown
  if (!show) return null;

  const isEditMode = Boolean(engineer);
  const modalTitle = isEditMode ? 'Edit Engineer' : 'Add New Engineer';
  const submitButtonText = isEditMode ? 'Update Engineer' : 'Create Engineer';

  return (
    <div 
      className="modal show" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-labelledby="engineer-modal-title"
      aria-modal="true"
    >
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 id="engineer-modal-title">{modalTitle}</h3>
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

          {/* Engineer Name Field */}
          <div className="form-group">
            <label htmlFor="engineer-name">
              Engineer Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="engineer-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Enter engineer name..."
            />
          </div>

          {/* Engineer Role Field */}
          <div className="form-group">
            <label htmlFor="engineer-role">
              Role <span className="required">*</span>
            </label>
            <input
              type="text"
              id="engineer-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Enter role (e.g., Senior Developer, UI/UX Designer)..."
            />
          </div>

          {/* Project Assignment Note */}
          <div className="form-group">
            <div className="info-note">
              <strong>Note:</strong> Project assignments are managed through individual project settings. 
              Edit a project to assign or remove this engineer.
            </div>
          </div>

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
EngineerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  engineer: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

// Default props
EngineerModal.defaultProps = {
  engineer: null
};

export default EngineerModal;