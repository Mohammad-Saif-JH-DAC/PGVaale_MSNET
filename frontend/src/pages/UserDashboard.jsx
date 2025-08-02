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
      const response = await api.get('/api/user/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="card-icon">🏠</div>
              <h5 className="card-title">PG Interests</h5>
              <h3 className="card-text text-primary">{dashboardData?.pgInterests || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="card-icon">🧹</div>
              <h5 className="card-title">Maid Requests</h5>
              <h3 className="card-text text-success">{dashboardData?.maidRequests || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="card-icon">⭐</div>
              <h5 className="card-title">Feedback Given</h5>
              <h3 className="card-text text-warning">{dashboardData?.feedbackCount || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="card-icon">💬</div>
              <h5 className="card-title">Messages</h5>
              <h3 className="card-text text-info">0</h3>
            </div>
          </div>
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
                  <a href="/user-dashboard/maids" className="btn btn-outline-success w-100">
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
                <div className="col-md-6 mb-3">
                  <a href="/user-dashboard/feedback" className="btn btn-outline-warning w-100">
                    ⭐ Give Feedback
                  </a>
                </div>
                <div className="col-md-6 mb-3">
                  <a href="/user-dashboard/messages" className="btn btn-outline-secondary w-100">
                    💬 Messages
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
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedTiffin, setSelectedTiffin] = useState(null);
  const [orderForm, setOrderForm] = useState({
    mealType: '',
    deliveryDate: '',
    quantity: 1
  });
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

  const handleOrderClick = (tiffin) => {
    setSelectedTiffin(tiffin);
    setShowOrderModal(true);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      // For now, just show success message
      // In future, you can add tiffin booking functionality
      setMessage(`Order placed with ${selectedTiffin.name}!`);
      setShowOrderModal(false);
      setOrderForm({ mealType: '', deliveryDate: '', quantity: 1 });
      setSelectedTiffin(null);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error placing order: ' + error.response?.data);
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
                  <strong>Services:</strong> {tiffin.services || 'N/A'}<br/>
                  <strong>Region:</strong> {tiffin.region || 'N/A'}<br/>
                  <strong>Timing:</strong> {tiffin.timing || 'N/A'}<br/>
                  <strong>Price:</strong> ₹{tiffin.monthlyPrice || 'N/A'}
                </p>
                <button 
                  className="btn btn-warning w-100"
                  onClick={() => handleOrderClick(tiffin)}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedTiffin && (
        <div className="modal fade show" style={{display: 'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order from {selectedTiffin.name}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowOrderModal(false)}
                ></button>
              </div>
              <form onSubmit={handleOrderSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Meal Type</label>
                    <select
                      className="form-control"
                      value={orderForm.mealType}
                      onChange={(e) => setOrderForm({...orderForm, mealType: e.target.value})}
                      required
                    >
                      <option value="">Select Meal Type</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Full Day">Full Day (Breakfast + Lunch + Dinner)</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Delivery Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={orderForm.deliveryDate}
                      onChange={(e) => setOrderForm({...orderForm, deliveryDate: e.target.value})}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={orderForm.quantity}
                      onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value)})}
                      required
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowOrderModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showOrderModal && (
        <div className="modal-backdrop fade show"></div>
      )}
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
    serviceDate: '',
    timeSlot: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMaids();
  }, []);

  const fetchMaids = async () => {
    try {
              const response = await api.get('/api/user/maids');
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
              const response = await api.post('/api/user/maids/hire', {
        maidId: selectedMaid.id,
        serviceDate: hireForm.serviceDate,
        timeSlot: hireForm.timeSlot
      });
      
      setMessage(response.data.message);
      setShowHireModal(false);
      setHireForm({ serviceDate: '', timeSlot: '' });
      setSelectedMaid(null);
      
      // Show success message
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error hiring maid: ' + error.response?.data);
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
                <h5 className="card-title">{maid.name}</h5>
                <p className="card-text">
                  <strong>Services:</strong> {maid.services || 'N/A'}<br/>
                  <strong>Region:</strong> {maid.region || 'N/A'}<br/>
                  <strong>Timing:</strong> {maid.timing || 'N/A'}<br/>
                  <strong>Salary:</strong> ₹{maid.monthlySalary || 'N/A'}
                </p>
                <button 
                  className="btn btn-success w-100"
                  onClick={() => handleHireClick(maid)}
                >
                  Hire Now
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
                    <label className="form-label">Service Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={hireForm.serviceDate}
                      onChange={(e) => setHireForm({...hireForm, serviceDate: e.target.value})}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time Slot</label>
                    <select
                      className="form-control"
                      value={hireForm.timeSlot}
                      onChange={(e) => setHireForm({...hireForm, timeSlot: e.target.value})}
                      required
                    >
                      <option value="">Select Time Slot</option>
                      <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                      <option value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</option>
                      <option value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</option>
                      <option value="6:00 PM - 9:00 PM">6:00 PM - 9:00 PM</option>
                    </select>
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
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <span style={{fontSize: '3rem'}}>🍱</span>
                  </div>
                  <h5 className="text-muted">No Tiffin Bookings Yet</h5>
                  <p className="text-muted">Order tiffin services to see your bookings here.</p>
                  <a href="/user-dashboard/tiffins" className="btn btn-warning">
                    Order Tiffin
                  </a>
                </div>
              </div>
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
                            <th>Service Date</th>
                            <th>Time Slot</th>
                            <th>Request Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.maidRequests.map((request) => (
                            <tr key={request.id}>
                              <td>{request.maid?.name || 'Unknown Maid'}</td>
                              <td>{new Date(request.serviceDate).toLocaleDateString()}</td>
                              <td>{request.timeSlot}</td>
                              <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge bg-${
                                  request.status === 'REQUESTED' ? 'warning' :
                                  request.status === 'ACCEPTED' ? 'success' :
                                  request.status === 'COMPLETED' ? 'primary' : 'secondary'
                                }`}>
                                  {request.status}
                                </span>
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
        api.get('/api/user/maids')
      ]);
      setFeedback(feedbackResponse.data);
      setMaids(maidsResponse.data);
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
                      {maid.name} - {maid.services}
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

// Messages Component
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
              const response = await api.get('/api/user/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
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
          <h2 className="mb-4">💬 Messages</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {messages.length > 0 ? (
            <div className="card">
              <div className="card-body">
                {messages.map((message) => (
                  <div key={message.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6>{message.senderName || 'Unknown Sender'}</h6>
                        <p className="mt-2">{message.message}</p>
                      </div>
                      <small className="text-muted">
                        {new Date(message.timestamp).toLocaleString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center">
                <div className="mb-3">
                  <span style={{fontSize: '3rem'}}>💬</span>
                </div>
                <h5 className="text-muted">No Messages Yet</h5>
                <p className="text-muted">You'll see messages here when someone contacts you.</p>
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
        <Route path="/maids" element={<MaidServices />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/" element={<DashboardHome />} />
      </Routes>
    </div>
  );
}

export default UserDashboard; 