import React, { useState } from 'react';
import Modal from 'react-modal';
import { manageProcessCompletion } from '@/api/admin'; // Adjust the import to your API function
import { InputField } from '@/components/custom/FormUtils'; // Import your InputField component

Modal.setAppElement('#root'); // Ensure proper root element for modal

const ProcessCompletionModal = ({
  isOpen,
  onClose,
  jobCardNo,
  department,
  handleFinishToggle,
  workorderId,
}) => {
  const [completedBy, setCompletedBy] = useState('');
  const [handoverTo, setHandoverTo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!department || !completedBy || !handoverTo) {
      setError('All fields are required!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🚀 ~ handleSubmit ~ workorderId:', workorderId);
      const response = await manageProcessCompletion(
        workorderId,
        department,
        jobCardNo,
        completedBy,
        handoverTo,
        remarks,
      );
      if (response) {
        handleFinishToggle();
        onClose(); // Close the modal after successful update
      } else {
        setError('Failed to update process completion details');
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || 'An unknown error occurred';
      setError(errorMessage);
      console.error('Process Completion Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Process Completion Form"
      className="process-completion-modal"
      overlayClassName="overlay"
      closeTimeoutMS={200} // Ensures smooth transition for closing modal
    >
      <div className="modal-header">
        <h3>Process Completion</h3>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3 d-flex align-items-center">
            <h2 style={{ color: 'Blue' }}>Department: {department}</h2>
          </div>

          <div className="form-group mb-3">
            <InputField
              label="Completed By"
              value={completedBy}
              onChange={(e) => setCompletedBy(e.target.value)}
              name="completedBy"
              className="form-control"
              error={error && !completedBy ? 'Completed By is required' : ''}
            />
          </div>

          <div className="form-group mb-3">
            <InputField
              label="Handover To"
              value={handoverTo}
              onChange={(e) => setHandoverTo(e.target.value)}
              name="handoverTo"
              className="form-control"
              error={error && !handoverTo ? 'Handover To is required' : ''}
            />
          </div>

          <div className="form-group mb-3">
            <InputField
              label="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              name="remarks"
              className="form-control"
              error=""
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="modal-footer">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
      <style>
        {`
            /* Style for the parent modal */
.overlay {
  background-color: rgba(0, 0, 0, 0.3); /* Dimmed background */
  z-index: 1300 !important; /* MUI modal z-index is 1300+ */
  position: fixed !important;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex; justify-content: center; align-items: center;
}

.process-completion-modal {
  min-width: 30%;
  margin: 0 auto; /* Centering the modal */
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Soft shadow */
  z-index: 1400 !important;
  position: relative;
}

.modal-header h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.modal-body {
  padding: 0;
}

.form-group {
  margin-bottom: 15px;
}

input.form-control {
  border-radius: 4px;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
}

button[type="submit"] {
  width: auto;
}

button[type="button"] {
  width: auto;
}

.alert {
  margin-top: 10px;
  padding: 10px;
}

            `}
      </style>
    </Modal>
  );
};

export default ProcessCompletionModal;
