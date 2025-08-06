import React, { useState, useEffect } from 'react';
import api from '../api';

const HireMaidModal = ({ show, onClose, maid, userId }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    userAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (show) {
      setFormData({
        startDate: '',
        endDate: '',
        userAddress: ''
      });
      setError('');
      setSuccess('');
    }
  }, [show]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form data
      if (!formData.startDate || !formData.endDate || !formData.userAddress) {
        setError('Please fill in all required fields');
        return;
      }

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        setError('End date must be after start date');
        return;
      }

      const requestData = {
        userId: userId,
        maidId: maid.id,
        userAddress: formData.userAddress,
        startDate: formData.startDate,
        endDate: formData.endDate,
        timeSlot: maid.timing || 'Not specified' // Use maid's actual timing
      };

      const response = await api.post('/api/user-maid/request', requestData);
      
      setSuccess('Maid hiring request sent successfully!');
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      setError(error.response?.data || 'Error sending request');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div 
        className="modal-backdrop fade show" 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1040
        }}
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div 
        className="modal fade show" 
        style={{ 
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1050,
          overflow: 'auto'
        }} 
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Hire a Maid</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>
            
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <small className="text-muted">
                    The maid can only be hired once within this period.
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Address *</label>
                  <textarea
                    className="form-control"
                    name="userAddress"
                    value={formData.userAddress}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter the complete address where the maid should come"
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending Request...
                      </>
                    ) : (
                      'Send Request'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HireMaidModal; 