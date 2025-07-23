import React from 'react';

const ConfirmModal = ({ show, message, onConfirm, onClose }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="modal show" onClick={handleBackdropClick}>
      <div className="modal-content confirm-modal">
        <div className="modal-header">
          <h3>Confirm Action</h3>
        </div>
        <p>{message}</p>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;