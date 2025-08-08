import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaEdit, FaTrash, FaSave, FaTimes, FaPhone, FaEnvelope, FaIdCard, FaVenusMars, FaBirthdayCake } from 'react-icons/fa';
import api from '../api';
import './UserProfile.css';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/user/profile');
      setUserProfile(response.data);
      setEditForm(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.put('/api/user/profile', editForm);
      setUserProfile(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setError('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setError('Please type "DELETE" to confirm account deletion.');
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete('/api/user/profile');
      
      // Clear local storage and redirect to login
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userRole');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const cancelEdit = () => {
    setEditForm(userProfile);
    setIsEditing(false);
    setError('');
  };

  if (loading && !userProfile) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <FaUser className="me-2" />
                User Profile
              </h4>
              {!isEditing && (
                <div>
                  <Button
                    variant="light"
                    size="sm"
                    className="me-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit className="me-1" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <FaTrash className="me-1" />
                    Delete Account
                  </Button>
                </div>
              )}
            </div>

            <div className="card-body">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}

              {userProfile && (
                <>
                  {!isEditing ? (
                    // Display Mode
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="profile-field">
                          <label className="form-label fw-bold">
                            <FaUser className="me-2 text-primary" />
                            Full Name
                          </label>
                          <div className="profile-value">{userProfile.name}</div>
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="profile-field">
                          <label className="form-label fw-bold">
                            <FaEnvelope className="me-2 text-primary" />
                            Email
                          </label>
                          <div className="profile-value">{userProfile.email}</div>
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="profile-field">
                          <label className="form-label fw-bold">
                            <FaUser className="me-2 text-primary" />
                            Username
                          </label>
                          <div className="profile-value">{userProfile.username}</div>
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="profile-field">
                          <label className="form-label fw-bold">
                            <FaPhone className="me-2 text-primary" />
                            Mobile Number
                          </label>
                          <div className="profile-value">{userProfile.mobileNumber}</div>
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="profile-field">
                          <label className="form-label fw-bold">
                            <FaBirthdayCake className="me-2 text-primary" />
                            Age
                          </label>
                          <div className="profile-value">{userProfile.age} years</div>
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="profile-field">
                          <label className="form-label fw-bold">
                            <FaVenusMars className="me-2 text-primary" />
                            Gender
                          </label>
                          <div className="profile-value">{userProfile.gender}</div>
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="profile-field">
                          <label className="form-label fw-bold">
                            <FaIdCard className="me-2 text-primary" />
                            Aadhaar Number
                          </label>
                          <div className="profile-value">
                            {userProfile.aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="profile-field">
                          <label className="form-label fw-bold">
                            <FaIdCard className="me-2 text-primary" />
                            Unique ID
                          </label>
                          <div className="profile-value">{userProfile.uniqueId}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Edit Mode
                    <Form onSubmit={handleEditSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <FaUser className="me-2 text-primary" />
                              Full Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={editForm.name || ''}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              required
                            />
                          </Form.Group>
                        </div>

                        <div className="col-md-6 mb-3">
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <FaEnvelope className="me-2 text-primary" />
                              Email
                            </Form.Label>
                            <Form.Control
                              type="email"
                              value={editForm.email || ''}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              required
                            />
                          </Form.Group>
                        </div>

                        <div className="col-md-6 mb-3">
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <FaPhone className="me-2 text-primary" />
                              Mobile Number
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              value={editForm.mobileNumber || ''}
                              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                              pattern="[0-9]{10}"
                              maxLength="10"
                              required
                            />
                          </Form.Group>
                        </div>

                        <div className="col-md-6 mb-3">
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <FaBirthdayCake className="me-2 text-primary" />
                              Age
                            </Form.Label>
                            <Form.Control
                              type="number"
                              value={editForm.age || ''}
                              onChange={(e) => handleInputChange('age', e.target.value)}
                              min="18"
                              max="100"
                              required
                            />
                          </Form.Group>
                        </div>

                        <div className="col-md-6 mb-3">
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              <FaVenusMars className="me-2 text-primary" />
                              Gender
                            </Form.Label>
                            <Form.Select
                              value={editForm.gender || ''}
                              onChange={(e) => handleInputChange('gender', e.target.value)}
                              required
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                          </Form.Group>
                        </div>

                        <div className="col-12 mb-3">
                          <small className="text-muted">
                            Note: Username, Aadhaar Number, and Unique ID cannot be changed for security reasons.
                          </small>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <Button
                          type="submit"
                          variant="success"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <FaSave className="me-1" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={cancelEdit}
                          disabled={loading}
                        >
                          <FaTimes className="me-1" />
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <FaTrash className="me-2" />
            Delete Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>Warning!</strong> This action cannot be undone. Deleting your account will permanently remove:
            <ul className="mt-2 mb-0">
              <li>Your profile information</li>
              <li>All your PG interests and bookings</li>
              <li>Your tiffin and maid service requests</li>
              <li>All associated data</li>
            </ul>
          </Alert>
          
          <Form.Group className="mt-3">
            <Form.Label>
              Type <strong>DELETE</strong> to confirm account deletion:
            </Form.Label>
            <Form.Control
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE here"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirmText('');
              setError('');
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            disabled={deleteConfirmText !== 'DELETE' || isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="me-1" />
                Delete Account
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserProfile;
