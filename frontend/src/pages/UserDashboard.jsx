import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import api from '../api';
import './UserDashboard.css';

// Dashboard Home Component
const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Debug: Check if token exists
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      // Try to get user-specific data, fallback to general data if 403
      let response;
      try {
        response = await api.get('/api/user/pgs');
      } catch (userError) {
        if (userError.response?.status === 403) {
          console.warn('User-specific endpoint not accessible, using general endpoint');
          // Fallback to general PG data that works
          response = await api.get('/api/pg/all');
        } else {
          throw userError;
        }
      }
      
      setDashboardData({
        userName: token ? 'User' : 'Guest',
        data: response.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Handle 403 specifically
      if (error.response?.status === 403) {
        console.error('403 Forbidden - User not authorized or token invalid');
        // Set fallback data for logged-in users
        setDashboardData({
          userName: 'User',
          data: []
        });
      }
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
            👋 Welcome, {dashboardData?.userName || 'User'}!
          </h2>
        </div>
      </div>


      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>🚀 Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <a href="/user-dashboard/pgs" className="btn btn-outline-primary w-100">
                    🏠 Browse PG Rooms
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/user-dashboard/tiffins" className="btn btn-outline-warning w-100">
                    🍱 Order Tiffin
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/maid-hiring" className="btn btn-outline-success w-100">
                    🧹 Hire Maid Service
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/user-dashboard/bookings" className="btn btn-outline-info w-100">
                    📋 My Bookings
                  </a>
                </div>
              </div>
              
              <div className="row mt-3">
                <div className="col-md-12 mb-3">
                  <a href="/user-dashboard/feedback" className="btn btn-outline-info w-100">
                    ⭐ Give Feedback
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PG Interests Component
const PGInterests = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const response = await api.get('/api/user/pgs');
      setInterests(response.data);
    } catch (error) {
      console.error('Error fetching PG interests:', error);
      if (error.response?.status === 401) {
        // Authentication failed - redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        // Other errors - show empty state
        setInterests([]);
      }
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
          <h2 className="mb-4">🏠 My PG Interests</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {interests.length > 0 ? (
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>PG Name</th>
                        <th>Room Type</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interests.map((interest) => (
                        <tr key={interest.id}>
                          <td>{interest.room?.pg?.name || 'Unknown PG'}</td>
                          <td>{interest.room?.roomType || 'N/A'}</td>
                          <td>{interest.room?.pg?.location || 'N/A'}</td>
                          <td>₹{interest.room?.price || 'N/A'}</td>
                          <td>
                            <span className="badge bg-info">Interested</span>
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
                  <span style={{fontSize: '3rem'}}>🏠</span>
                </div>
                <h5 className="text-muted">No PG Interests Yet</h5>
                <p className="text-muted">Start browsing PG rooms to express your interest!</p>
                <a href="/pgrooms" className="btn btn-primary">
                  Browse PG Rooms
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Tiffin Services Component
const TiffinServices = () => {
  const [tiffins, setTiffins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTiffin, setSelectedTiffin] = useState(null);
  const [showTiffinModal, setShowTiffinModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTiffins();
  }, []);

  const fetchTiffins = async () => {
    try {
      const response = await api.get('/api/user/tiffins');
      setTiffins(response.data);
    } catch (error) {
      console.error('Error fetching tiffin services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = (tiffin) => {
    setSelectedTiffin(tiffin);
    setShowTiffinModal(true);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/user/tiffins/${selectedTiffin.id}/request`);
      setMessage(`Request sent to ${selectedTiffin.name}!`);
      setShowTiffinModal(false);
      setSelectedTiffin(null);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error sending request: ' + error.response?.data);
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
          <h2 className="mb-4">🍱 Tiffin Services</h2>
          {message && (
            <div className={`alert alert-${message.includes('Error') ? 'danger' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="row">
        {tiffins.map((tiffin) => (
          <div key={tiffin.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{tiffin.name}</h5>
                <p className="card-text">
                  <strong>Food Category:</strong> {tiffin.foodCategory || 'N/A'}<br/>
                  <strong>Region:</strong> {tiffin.region || 'N/A'}<br/>
                  <strong>Price per Meal:</strong> ₹{tiffin.price || 'N/A'}<br/>
                  <strong>Address:</strong> {tiffin.maidAddress || 'N/A'}
                </p>
                <button 
                  className="btn btn-warning w-100"
                  onClick={() => handleRequestClick(tiffin)}
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tiffin Request Modal */}
      {showTiffinModal && selectedTiffin && (
        <div className="modal fade show" style={{display: 'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Tiffin Service from {selectedTiffin.name}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowTiffinModal(false)}
                ></button>
              </div>
              <form onSubmit={handleRequestSubmit}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <strong>Provider Details:</strong><br/>
                    <strong>Name:</strong> {selectedTiffin.name}<br/>
                    <strong>Food Category:</strong> {selectedTiffin.foodCategory}<br/>
                    <strong>Price per Meal:</strong> ₹{selectedTiffin.price}<br/>
                    <strong>Region:</strong> {selectedTiffin.region}
                  </div>
                  <p className="text-muted">
                    By sending this request, you're asking the tiffin provider to accept you as a customer. 
                    They will review your request and either accept or reject it.
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowTiffinModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showTiffinModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

// Tiffin Requests Component
const TiffinRequests = () => {
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
        response = await api.get('/api/user/requests');
      } else {
        response = await api.get(`/api/user/requests?status=${filterStatus}`);
      }
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        await api.delete(`/api/user/requests/${requestId}`);
        fetchRequests(); // Refresh the list
        alert('Request cancelled successfully');
      } catch (error) {
        alert('Error cancelling request: ' + error.response?.data);
      }
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
          <h2 className="mb-4">📋 My Tiffin Requests</h2>
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
                        <th>Tiffin Provider</th>
                        <th>Request Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr key={request.id}>
                          <td>{request.tiffinName || 'Unknown Provider'}</td>
                          <td>{new Date(request.assignedDateTime).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td>
                            {request.status === 'PENDING' && (
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleCancelRequest(request.id)}
                              >
                                Cancel
                              </button>
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
                  <span style={{fontSize: '3rem'}}>🍱</span>
                </div>
                <h5 className="text-muted">No Tiffin Requests Yet</h5>
                <p className="text-muted">Send requests to tiffin providers to see them here.</p>
                <a href="/user-dashboard/tiffins" className="btn btn-warning">
                  Browse Tiffin Services
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



// Maid Services Component
const MaidServices = () => {
  const [maids, setMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHireModal, setShowHireModal] = useState(false);
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [hireForm, setHireForm] = useState({
    startDate: '',
    endDate: '',
    userAddress: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMaids();
  }, []);

  const fetchMaids = async () => {
    try {
      const response = await api.get('/api/maid/available');
      setMaids(response.data);
    } catch (error) {
      console.error('Error fetching maids:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHireClick = (maid) => {
    setSelectedMaid(maid);
    setShowHireModal(true);
  };

  const handleHireSubmit = async (e) => {
    e.preventDefault();
    try {
             // Get user ID from token
       const token = localStorage.getItem('token');
       if (!token) {
         setMessage('Please log in to hire a maid');
         return;
       }

       const payload = JSON.parse(atob(token.split('.')[1]));
       const userId = payload.userId;

       if (!userId) {
         setMessage('Unable to get user information. Please try logging in again.');
         return;
       }

      const response = await api.post('/api/user-maid/request', {
        userId: userId,
        maidId: selectedMaid.id,
        startDate: hireForm.startDate,
        endDate: hireForm.endDate,
        userAddress: hireForm.userAddress,
        timeSlot: selectedMaid.timing || 'Not specified' // Use maid's actual timing
      });
      
      setMessage('Maid hiring request sent successfully!');
      setShowHireModal(false);
      setHireForm({ startDate: '', endDate: '', userAddress: '' });
      setSelectedMaid(null);
      
      // Show success message
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error hiring maid: ' + (error.response?.data || error.message));
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
          <h2 className="mb-4">🧹 Maid Services</h2>
          {message && (
            <div className={`alert alert-${message.includes('Error') ? 'danger' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="row">
        {maids.map((maid) => (
          <div key={maid.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title mb-0">{maid.name}</h5>
                  <span className="badge bg-success">Available</span>
                </div>
                
                <div className="mb-3">
                  <p className="card-text">
                    <strong>Services:</strong>
                  </p>
                  <div className="mb-2">
                    {maid.services?.split(',').map((service, index) => (
                      <span key={index} className="badge bg-light text-dark me-1 mb-1">
                        {service.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <small className="text-muted">Region</small>
                    <p className="mb-0"><strong>{maid.region}</strong></p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Salary</small>
                    <p className="mb-0"><strong>₹{maid.monthlySalary}/month</strong></p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <small className="text-muted">Timing</small>
                    <p className="mb-0"><strong>{maid.timing}</strong></p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Gender</small>
                    <p className="mb-0"><strong>{maid.gender}</strong></p>
                  </div>
                </div>

                <button 
                  className="btn btn-success w-100"
                  onClick={() => handleHireClick(maid)}
                >
                  🧹 Hire Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hire Modal */}
      {showHireModal && selectedMaid && (
        <div className="modal fade show" style={{display: 'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hire {selectedMaid.name}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowHireModal(false)}
                ></button>
              </div>
              <form onSubmit={handleHireSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={hireForm.startDate}
                      onChange={(e) => setHireForm({...hireForm, startDate: e.target.value})}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={hireForm.endDate}
                      onChange={(e) => setHireForm({...hireForm, endDate: e.target.value})}
                      required
                      min={hireForm.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Maid's Available Timing</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedMaid.timing || 'Not specified'}
                      disabled
                    />
                    <small className="text-muted">The maid will work according to their available timing</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Your Address</label>
                    <textarea
                      className="form-control"
                      value={hireForm.userAddress}
                      onChange={(e) => setHireForm({...hireForm, userAddress: e.target.value})}
                      placeholder="Enter your complete address where the maid should come"
                      rows="3"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowHireModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showHireModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

// My Bookings Component
const MyBookings = () => {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pg');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
              const response = await api.get('/api/user/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId, requestType) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        if (requestType === 'maid') {
          await api.delete(`/api/user/maid-requests/${requestId}`);
        } else if (requestType === 'tiffin') {
          await api.delete(`/api/user/requests/${requestId}`);
        }
        fetchBookings(); // Refresh the list
        alert('Request cancelled successfully');
      } catch (error) {
        alert('Error cancelling request: ' + error.response?.data);
      }
    }
  };

  const handleChangeMaid = async (request) => {
    if (window.confirm('Are you sure you want to change the maid for this booking?')) {
      try {
        await api.post(`/api/user/maid-requests/${request.id}/change`);
        alert('Maid changed successfully!');
        fetchBookings(); // Refresh the list
      } catch (error) {
        alert('Error changing maid: ' + error.response?.data);
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
          <h2 className="mb-4">📋 My Bookings</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs" id="bookingsTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'pg' ? 'active' : ''}`}
                onClick={() => setActiveTab('pg')}
              >
                🏠 PG Interests
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'tiffin' ? 'active' : ''}`}
                onClick={() => setActiveTab('tiffin')}
              >
                🍱 Tiffin Bookings
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'maid' ? 'active' : ''}`}
                onClick={() => setActiveTab('maid')}
              >
                🧹 Maid Requests
              </button>
            </li>
          </ul>

          <div className="tab-content mt-3" id="bookingsTabContent">
            {/* PG Interests Tab */}
            <div className={`tab-pane fade ${activeTab === 'pg' ? 'show active' : ''}`}>
              {bookings?.pgInterests && bookings.pgInterests.length > 0 ? (
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>PG Name</th>
                            <th>Room Type</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.pgInterests.map((interest) => (
                            <tr key={interest.id}>
                              <td>{interest.room?.pg?.name || 'Unknown PG'}</td>
                              <td>{interest.room?.roomType || 'N/A'}</td>
                              <td>{interest.room?.pg?.location || 'N/A'}</td>
                              <td>₹{interest.room?.price || 'N/A'}</td>
                              <td>
                                <span className="badge bg-info">Interested</span>
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
                    <h5 className="text-muted">No PG Interests</h5>
                    <p className="text-muted">You haven't expressed interest in any PG rooms yet.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tiffin Bookings Tab */}
            <div className={`tab-pane fade ${activeTab === 'tiffin' ? 'show active' : ''}`}>
              {bookings?.tiffinRequests && bookings.tiffinRequests.length > 0 ? (
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Tiffin Provider</th>
                            <th>Request Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.tiffinRequests.map((request) => (
                            <tr key={request.id}>
                              <td>{request.tiffinName || 'Unknown Provider'}</td>
                              <td>{new Date(request.assignedDateTime).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge bg-${
                                  request.status === 'PENDING' ? 'warning' :
                                  request.status === 'ACCEPTED' ? 'success' :
                                  request.status === 'REJECTED' ? 'danger' : 'secondary'
                                }`}>
                                  {request.status}
                                </span>
                              </td>
                              <td>
                                {request.status === 'PENDING' && (
                                  <button 
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleCancelRequest(request.id, 'tiffin')}
                                  >
                                    Cancel
                                  </button>
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
                      <span style={{fontSize: '3rem'}}>🍱</span>
                    </div>
                    <h5 className="text-muted">No Tiffin Requests Yet</h5>
                    <p className="text-muted">Send requests to tiffin providers to see them here.</p>
                    <a href="/user-dashboard/tiffins" className="btn btn-warning">
                      Browse Tiffin Services
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Maid Requests Tab */}
            <div className={`tab-pane fade ${activeTab === 'maid' ? 'show active' : ''}`}>
              {bookings?.maidRequests && bookings.maidRequests.length > 0 ? (
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Maid Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Request Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.maidRequests.map((request) => (
                            <tr key={request.id}>
                              <td>{request.maid?.name || 'Unknown Maid'}</td>
                              <td>{request.startDate ? new Date(request.startDate).toLocaleDateString() : 'N/A'}</td>
                              <td>{request.endDate ? new Date(request.endDate).toLocaleDateString() : 'N/A'}</td>
                              <td>{new Date(request.assignedDateTime).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge bg-${
                                  request.status === 'PENDING' ? 'warning' :
                                  request.status === 'ACCEPTED' ? 'success' :
                                  request.status === 'REJECTED' ? 'danger' : 'secondary'
                                }`}>
                                  {request.status}
                                </span>
                              </td>
                              <td>
                                {request.status === 'PENDING' && (
                                  <button 
                                    className="btn btn-outline-danger btn-sm me-1"
                                    onClick={() => handleCancelRequest(request.id, 'maid')}
                                  >
                                    Cancel
                                  </button>
                                )}
                                {request.status === 'ACCEPTED' && (
                                  <button 
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => handleChangeMaid(request)}
                                  >
                                    Change Maid
                                  </button>
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
                    <h5 className="text-muted">No Maid Requests</h5>
                    <p className="text-muted">You haven't hired any maid services yet.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

// Active Maid Services Component
const ActiveMaidServices = () => {
  const [activeServices, setActiveServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveServices();
  }, []);

  const fetchActiveServices = async () => {
    try {
      const response = await api.get('/api/user/maids/active');
      setActiveServices(response.data);
    } catch (error) {
      console.error('Error fetching active services:', error);
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
          <h2 className="mb-4">👥 Active Maid Services</h2>
        </div>
      </div>

      <div className="row">
        {activeServices.length > 0 ? (
          activeServices.map((service) => (
            <div key={service.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{service.maid?.name}</h5>
                  <p className="card-text">
                    <strong>Contact:</strong> {service.maid?.phoneNumber || 'N/A'}<br/>
                    <strong>Email:</strong> {service.maid?.email || 'N/A'}<br/>
                    <strong>Region:</strong> {service.maid?.region || 'N/A'}<br/>
                    <strong>Services:</strong> {service.maid?.services || 'N/A'}<br/>
                    <strong>Service Date:</strong> {new Date(service.serviceDate).toLocaleDateString()}<br/>
                    <strong>Time Slot:</strong> {service.timeSlot || 'N/A'}
                  </p>
                  <div className="mt-3">
                    <span className="badge bg-success">Active Service</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="text-muted">No Active Services</h5>
                <p className="text-muted">You don't have any active maid services at the moment.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Feedback Component
const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [maids, setMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    maidId: '',
    rating: 5,
    feedback: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feedbackResponse, maidsResponse] = await Promise.all([
        api.get('/api/user/feedback'),
        api.get('/api/maid/available') // Use the available maids endpoint instead
      ]);
      setFeedback(feedbackResponse.data);
      setMaids(maidsResponse.data);
      console.log('Fetched maids for feedback:', maidsResponse.data); // Debug log
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
              await api.post('/api/user/feedback', formData);
      setMessage('Feedback submitted successfully!');
      setShowForm(false);
      setFormData({ maidId: '', rating: 5, feedback: '' });
      fetchData(); // Refresh the list
    } catch (error) {
      setMessage('Error submitting feedback: ' + error.response?.data);
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
          <h2 className="mb-4">⭐ Feedback & Ratings</h2>
          {message && (
            <div className={`alert alert-${message.includes('Error') ? 'danger' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Give New Feedback
          </button>
        </div>
      </div>

      {/* Feedback Form Modal */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Submit Feedback</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Select Maid</label>
                <select
                  className="form-control"
                  value={formData.maidId}
                  onChange={(e) => setFormData({...formData, maidId: e.target.value})}
                  required
                >
                  <option value="">Choose a maid...</option>
                  {maids.map((maid) => (
                    <option key={maid.id} value={maid.id}>
                      {maid.name || `Maid ${maid.id}`} - {maid.services || 'Services not specified'} ({maid.region || 'Region not specified'})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <select
                  className="form-control"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  required
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                  <option value={3}>⭐⭐⭐ (3 stars)</option>
                  <option value={2}>⭐⭐ (2 stars)</option>
                  <option value={1}>⭐ (1 star)</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.feedback}
                  onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                  required
                ></textarea>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  Submit Feedback
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="row">
        <div className="col-12">
          <h4>My Feedback History</h4>
          {feedback.length > 0 ? (
            <div className="card">
              <div className="card-body">
                {feedback.map((item) => (
                  <div key={item.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6>{item.maid?.name || 'Unknown Maid'}</h6>
                        <div className="text-warning">
                          {'⭐'.repeat(item.rating)}
                        </div>
                        <p className="mt-2">{item.feedback}</p>
                      </div>
                      <small className="text-muted">
                        {new Date(item.id).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center">
                <h5 className="text-muted">No Feedback Yet</h5>
                <p className="text-muted">Submit your first feedback to help others!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



// Main UserDashboard Component
function UserDashboard() {
  return (
    <div className="user-dashboard">
      <Routes>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/pgs" element={<PGInterests />} />
        <Route path="/tiffins" element={<TiffinServices />} />
        <Route path="/tiffins/requests" element={<TiffinRequests />} />

        <Route path="/maids" element={<MaidServices />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/active-services" element={<ActiveMaidServices />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/" element={<DashboardHome />} />
      </Routes>
    </div>
  );
}

export default UserDashboard; 