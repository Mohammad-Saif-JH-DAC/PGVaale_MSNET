import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import './TiffinDashboard.css';
import TiffinNavigationModal from './TiffinNavigationModal'; // import the new component


// Dashboard Home Component
const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchProfile();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/tiffin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/tiffin/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">
            👋 Welcome, {dashboardData?.tiffinName || 'Tiffin Provider'}!
          </h2>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="card-icon">📬</div>
              <h5 className="card-title">Pending Requests</h5>
              <h3 className="card-text text-primary">{dashboardData?.pendingRequests || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="card-icon">✅</div>
              <h5 className="card-title">Accepted Orders</h5>
              <h3 className="card-text text-success">{dashboardData?.acceptedRequests || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="card-icon">❌</div>
              <h5 className="card-title">Rejected Orders</h5>
              <h3 className="card-text text-danger">{dashboardData?.rejectedRequests || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="card-icon">⭐</div>
              <h5 className="card-title">Average Rating</h5>
              <h3 className="card-text text-warning">
                {dashboardData?.averageRating && dashboardData.averageRating > 0 
                  ? dashboardData.averageRating.toFixed(1) 
                  : 'N/A'}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>📢 Recent Activity</h5>
            </div>
            <div className="card-body">
              {dashboardData?.recentRequests && dashboardData.recentRequests.length > 0 ? (
                <div className="activity-list">
                  {dashboardData.recentRequests.slice(0, 5).map((request, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">🍽️</div>
                      <div className="activity-content">
                        <strong>New request from {request.userName || 'User'}</strong>
                        <small className="text-muted d-block">
                          {request.assignedDateTime ? new Date(request.assignedDateTime).toLocaleDateString() : 'Date not specified'}
                        </small>
                      </div>
                      <div className="activity-status">
                        <span className={`badge bg-${request.status === 'PENDING' ? 'warning' : 
                                         request.status === 'ACCEPTED' ? 'success' : 
                                         request.status === 'REJECTED' ? 'danger' : 'secondary'}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="mb-3">
                    <span style={{fontSize: '2rem'}}>🍽️</span>
                  </div>
                  <p className="text-muted">No recent activity</p>
                  <small className="text-muted">New tiffin requests and updates will appear here</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Component
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/tiffin/profile');
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Error loading profile: ' + error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/tiffin/profile', formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      setMessage('Error updating profile: ' + error.response?.data);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setMessage('Please type DELETE to confirm account deletion.');
      return;
    }

    try {
      // Delete tiffin account
      await api.delete('/api/tiffin/profile');
      
      // Clear session
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      
      // Show success and redirect
      setMessage('Your account has been deleted successfully.');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage('Failed to delete account. Please try again.');
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          {message && (
            <div className={`alert alert-${message.includes('Error') ? 'danger' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Personal Information</h5>
              <button
                className={`btn btn-${isEditing ? 'secondary' : 'primary'}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phoneNumber"
                      value={formData.phoneNumber || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Region</label>
                    <input
                      type="text"
                      className="form-control"
                      name="region"
                      value={formData.region || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Food Category</label>
                    <input
                      type="text"
                      className="form-control"
                      name="foodCategory"
                      value={formData.foodCategory || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., Veg, Non-Veg"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price per Meal</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      name="maidAddress"
                      value={formData.maidAddress || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      placeholder="Your tiffin service address"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="text-end">
                    <button type="submit" className="btn btn-success">
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Account Status</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <span className="badge bg-success me-2">✓</span>
                <span>Account Active</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <span className={`badge bg-${'success'} me-2`}>
                  {profile?.approved ? '✓' : '✓'}
                </span>
                <span>{profile?.approved ? 'Approved' : 'Approved'}</span>
              </div>
              <hr />
              <div className="d-grid">
                <button
                  className="btn btn-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  🗑️ Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{display: 'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">⚠️ Delete Account</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-danger">
                  <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
                </div>
                <p>To confirm deletion, please type <strong>DELETE</strong> in the box below:</p>
                <input
                  type="text"
                  className="form-control"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showDeleteModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

// Menu Management Component
const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    dayOfWeek: '',
    breakfast: '',
    lunch: '',
    dinner: '',
    menuDate: '',
    foodCategory: 'Veg',
    price: 0
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await api.get('/api/tiffin/menu');
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
      alert('Error fetching menus: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMenu) {
        await api.put(`/api/tiffin/menu/${editingMenu.id}`, formData);
      } else {
        await api.post('/api/tiffin/menu', formData);
      }
      setShowMenuForm(false);
      setEditingMenu(null);
      setFormData({
        dayOfWeek: '',
        breakfast: '',
        lunch: '',
        dinner: '',
        menuDate: '',
        foodCategory: 'Veg',
        price: 0
      });
      fetchMenus();
    } catch (error) {
      console.error('Error saving menu:', error);
      alert('Error saving menu: ' + (error.response?.data || error.message));
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setFormData({
      dayOfWeek: menu.dayOfWeek,
      breakfast: menu.breakfast,
      lunch: menu.lunch,
      dinner: menu.dinner,
      menuDate: menu.menuDate || '',
      foodCategory: menu.foodCategory || 'Veg',
      price: menu.price || 0
    });
    setShowMenuForm(true);
  };

  const handleDelete = async (menuId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await api.delete(`/api/tiffin/menu/${menuId}`);
        fetchMenus();
      } catch (error) {
        console.error('Error deleting menu:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-end mb-4">
            <button
              className="btn btn-primary"
              onClick={() => setShowMenuForm(true)}
            >
              + Add Menu Item
            </button>
          </div>
        </div>
      </div>

      {showMenuForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5>{editingMenu ? 'Edit Menu Item' : 'Add New Menu Item'}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Day of Week</label>
                      <select
                        className="form-select"
                        name="dayOfWeek"
                        value={formData.dayOfWeek}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Day</option>
                        {daysOfWeek.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Menu Date (Optional)</label>
                      <input
                        type="date"
                        className="form-control"
                        name="menuDate"
                        value={formData.menuDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Breakfast</label>
                      <textarea
                        className="form-control"
                        name="breakfast"
                        value={formData.breakfast}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        placeholder="Breakfast menu items"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Lunch</label>
                      <textarea
                        className="form-control"
                        name="lunch"
                        value={formData.lunch}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        placeholder="Lunch menu items"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Dinner</label>
                      <textarea
                        className="form-control"
                        name="dinner"
                        value={formData.dinner}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        placeholder="Dinner menu items"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Food Category</label>
                      <select
                        className="form-select"
                        name="foodCategory"
                        value={formData.foodCategory}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Price per Meal</label>
                                             <input
                         type="number"
                         className="form-control"
                         name="price"
                         value={formData.price || ''}
                         onChange={handleInputChange}
                         required
                         min="0"
                         step="0.01"
                       />
                    </div>
                  </div>

                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => {
                        setShowMenuForm(false);
                        setEditingMenu(null);
                        setFormData({
                          dayOfWeek: '',
                          breakfast: '',
                          lunch: '',
                          dinner: '',
                          menuDate: '',
                          foodCategory: 'Veg',
                          price: 0
                        });
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      {editingMenu ? 'Update' : 'Save'} Menu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          {menus.length > 0 ? (
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Category</th>
                        <th>Breakfast</th>
                        <th>Lunch</th>
                        <th>Dinner</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menus.map((menu) => (
                        <tr key={menu.id}>
                          <td><strong>{menu.dayOfWeek}</strong></td>
                          <td>
                            <span className={`badge bg-${menu.foodCategory === 'Veg' ? 'success' : menu.foodCategory === 'Non-Veg' ? 'danger' : 'warning'}`}>
                              {menu.foodCategory}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {menu.breakfast}
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">
                              {menu.lunch}
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">
                              {menu.dinner}
                            </small>
                          </td>
                          <td>
                            ₹{menu.price || 'N/A'}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleEdit(menu)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(menu.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center">
                <div className="mb-3">
                  <span style={{fontSize: '3rem'}}>🍽️</span>
                </div>
                <h5 className="text-muted">No Menu Items Yet</h5>
                <p className="text-muted">Add your weekly menu to attract more customers.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowMenuForm(true)}
                >
                  Add Your First Menu Item
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Service Requests Component
const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    try {
      let response;
      if (filterStatus === 'all') {
        response = await api.get('/api/tiffin/requests');
      } else {
        response = await api.get(`/api/tiffin/requests?status=${filterStatus}`);
      }
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      await api.post(`/api/tiffin/requests/${requestId}/status`, { status: newStatus });
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-warning';
      case 'ACCEPTED': return 'bg-success';
      case 'REJECTED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="mb-3">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-outline-primary ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`btn btn-outline-warning ${filterStatus === 'PENDING' ? 'active' : ''}`}
                onClick={() => setFilterStatus('PENDING')}
              >
                Pending
              </button>
              <button
                type="button"
                className={`btn btn-outline-success ${filterStatus === 'ACCEPTED' ? 'active' : ''}`}
                onClick={() => setFilterStatus('ACCEPTED')}
              >
                Accepted
              </button>
              <button
                type="button"
                className={`btn btn-outline-danger ${filterStatus === 'REJECTED' ? 'active' : ''}`}
                onClick={() => setFilterStatus('REJECTED')}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {requests.length > 0 ? (
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Request Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr key={request.id}>
                          <td>{request.userName || 'Unknown User'}</td>
                          <td>{new Date(request.assignedDateTime).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td>
                            {request.status === 'PENDING' && (
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => updateRequestStatus(request.id, 'ACCEPTED')}
                                >
                                  Accept
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => updateRequestStatus(request.id, 'REJECTED')}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center">
                <div className="mb-3">
                  <span style={{fontSize: '3rem'}}>📋</span>
                </div>
                <h5 className="text-muted">No Service Requests Yet</h5>
                <p className="text-muted">When users request your tiffin service, you'll see their requests here.</p>
                <div className="mt-3">
                  <small className="text-muted">
                    <strong>Tip:</strong> Make sure your menu is complete and profile is updated to attract more customers.
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Navigation Component
const TiffinNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the page title based on the current route
  let pageTitle = '🍽️ Tiffin Dashboard';
  if (location.pathname.includes('/menu')) pageTitle = '🍽️ Menu Management';
  else if (location.pathname.includes('/requests')) pageTitle = '📋 Service Requests';
  else if (location.pathname.includes('/profile')) pageTitle = '👤 Profile';

  const navItems = [
    { path: '/tiffin-dashboard/menu', label: 'Menu Management', icon: '🍽️' },
    { path: '/tiffin-dashboard/requests', label: 'Service Requests', icon: '📋' },
    { path: '/tiffin-dashboard/profile', label: 'Profile', icon: '👤' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <div className="navbar-brand">
          <h4 className="mb-0">{pageTitle}</h4>
        </div>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#tiffinNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="tiffinNavbar">
          <ul className="navbar-nav me-auto">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <a 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  href={item.path}
                >
                  {item.icon} {item.label}
                </a>
              </li>
            ))}
          </ul>
          
          {/* <ul className="navbar-nav">
            <li className="nav-item">
              <button 
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </li>
          </ul> */}
        </div>
      </div>
    </nav>
  );
};

// Main TiffinDashboard Component
function TiffinDashboard() {
  return (
    <div className="tiffin-dashboard">
      <TiffinNavigation />
      <Routes>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/requests" element={<ServiceRequests />} />
        <Route path="/" element={<DashboardHome />} />
      </Routes>
    </div>
  );
}

export default TiffinDashboard; 