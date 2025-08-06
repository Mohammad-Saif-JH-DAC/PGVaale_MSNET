import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './MaidDashboard.css';

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
      const response = await api.get('/api/maid/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/maid/profile');
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
            👋 Welcome, {dashboardData?.maidName || 'Maid'}!
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
              <h5 className="card-title">Accepted Jobs</h5>
              <h3 className="card-text text-success">{dashboardData?.acceptedJobs || 0}</h3>
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

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="card-icon">💰</div>
              <h5 className="card-title">Monthly Salary</h5>
              <h3 className="card-text text-info">
                ₹{profile?.monthlySalary ? profile.monthlySalary.toLocaleString() : '0'}
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
                      <div className="activity-icon">📋</div>
                      <div className="activity-content">
                        <strong>New request from {request.user?.name || 'User'}</strong>
                        <small className="text-muted d-block">
                          {request.status === 'PENDING' ? 'Service not accepted yet' : 
                           request.startDate ? new Date(request.startDate).toLocaleDateString() : 
                           request.assignedDateTime ? new Date(request.assignedDateTime).toLocaleDateString() : 
                           'Date not specified'} - {profile?.timing || 'My timing not set'}
                        </small>
                      </div>
                      <div className="activity-status">
                        <span className={`badge bg-${request.status === 'REQUESTED' ? 'warning' : 
                                         request.status === 'ACCEPTED' ? 'success' : 
                                         request.status === 'COMPLETED' ? 'primary' : 'secondary'}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="mb-3">
                    <span style={{fontSize: '2rem'}}>📢</span>
                  </div>
                  <p className="text-muted">No recent activity</p>
                  <small className="text-muted">New service requests and updates will appear here</small>
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/maid/profile');
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
      await api.post('/api/maid/profile', formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {

      setMessage('Error updating profile: ' + error.response?.data);
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
          <h2 className="mb-4">👤 Profile</h2>
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
                    <label className="form-label">Services</label>
                    <input
                      type="text"
                      className="form-control"
                      name="services"
                      value={formData.services || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., Cleaning, Cooking"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Timing</label>
                    <input
                      type="text"
                      className="form-control"
                      name="timing"
                      value={formData.timing || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., 9AM–6PM"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Monthly Salary</label>
                    <input
                      type="number"
                      className="form-control"
                      name="monthlySalary"
                      value={formData.monthlySalary || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Gender</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.gender || ''}
                      disabled
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
                <span className={`badge bg-${profile?.approved ? 'success' : 'warning'} me-2`}>
                  {profile?.approved ? '✓' : '⏳'}
                </span>
                <span>{profile?.approved ? 'Approved' : 'Pending Approval'}</span>
              </div>
            </div>
          </div>
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
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchRequests();
    fetchProfile();
  }, [filterStatus]);

    const fetchRequests = async () => {
    try {
      let response;
      if (filterStatus === 'all') {
        response = await api.get('/api/maid/requests');
      } else {
        response = await api.get(`/api/maid/requests/status/${filterStatus}`);
      }
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/maid/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      await api.post(`/api/maid/requests/${requestId}/status`, { status: newStatus });
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'REQUESTED': return 'bg-warning';
      case 'ACCEPTED': return 'bg-success';
      case 'REJECTED': return 'bg-danger';
      case 'COMPLETED': return 'bg-primary';
      case 'CANCELLED': return 'bg-secondary';
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
          <h2 className="mb-4">📋 Service Requests</h2>
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
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>My Timing</th>
                        <th>Address</th>
                        <th>Request Date</th>
                        <th>Accept Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr key={request.id}>
                          <td>{request.user?.name || 'Unknown User'}</td>
                          <td>{request.startDate ? new Date(request.startDate).toLocaleDateString() : 'N/A'}</td>
                          <td>{request.endDate ? new Date(request.endDate).toLocaleDateString() : 'N/A'}</td>
                          <td>{profile?.timing || 'My timing not set'}</td>
                          <td>
                            <span className="text-muted small">
                              {request.userAddress || 'No address provided'}
                            </span>
                          </td>
                          <td>{new Date(request.assignedDateTime).toLocaleDateString()}</td>
                          <td>{request.acceptedDateTime ? new Date(request.acceptedDateTime).toLocaleDateString() : '-'}</td>
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
                <p className="text-muted">When users book your services, you'll see their requests here.</p>
                <div className="mt-3">
                  <small className="text-muted">
                    <strong>Tip:</strong> Make sure your profile is complete and services are listed to attract more bookings.
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



// Main MaidDashboard Component
function MaidDashboard() {
  return (
    <div className="maid-dashboard">
      <Routes>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/requests" element={<ServiceRequests />} />
        <Route path="/" element={<DashboardHome />} />
      </Routes>
    </div>
  );
}

export default MaidDashboard; 