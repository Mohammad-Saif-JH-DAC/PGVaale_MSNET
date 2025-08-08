import React, { useEffect, useState } from 'react';
import DashboardStats from '../components/DashboardStats';
import api from '../api';
import Toast from '../utils/Toast';


function Admin() {
  const [pendingMaid, setPendingMaid] = useState([]);
  const [pendingTiffin, setPendingTiffin] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showContactMessages, setShowContactMessages] = useState(false);

  useEffect(() => {
    // Load pending maids and tiffin providers
    Promise.all([
      api.get('/api/admin/maids/pending'),
      api.get('/api/admin/tiffins/pending'),
      api.get('/api/contactUs/all')
    ])
    .then(([maidRes, tiffinRes]) => {
      setPendingMaid(maidRes.data || []);
      setPendingTiffin(tiffinRes.data || []);
    })
    .catch(() => setError('Failed to load service providers'))
    .finally(() => setLoading(false));
  }, []);

  const handleApproveMaid = async (id) => {
    try {
      await api.post(`/api/admin/maids/${id}/approve`);
      const res = await api.get('/api/admin/maids/pending');
      setPendingMaid(res.data || []);
      Toast.success('Maid approved successfully!');
    } catch {
      Toast.error('Failed to approve maid');
    }
  };

  const handleRejectMaid = async (id) => {
    try {
      await api.post(`/api/admin/maids/${id}/reject`);
      // Refresh the list
      const response = await api.get('/api/admin/maids/pending');
      setPendingMaid(response.data || []);
    } catch (error) {
      setError('Failed to reject maid');
    }
  };

  const handleApproveTiffin = async (id) => {
    try {
      await api.post(`/api/admin/tiffins/${id}/approve`);
      const res = await api.get('/api/admin/tiffins/pending');
      setPendingTiffin(res.data || []);
      Toast.success('Tiffin provider approved!');
    } catch {
      Toast.error('Failed to approve tiffin provider');
    }
  };

  const handleRejectTiffin = async (id) => {
    try {
      await api.post(`/api/admin/tiffins/${id}/reject`);
      const res = await api.get('/api/admin/tiffins/pending');
      setPendingTiffin(res.data || []);
      Toast.success('Tiffin provider rejected!');
    } catch {
      Toast.error('Failed to reject tiffin provider');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <DashboardStats />
      <hr className="my-5" />

      {/* Pending Maids and Tiffins */}
      <div className="row">
        {/* Maids */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Pending Maid Service Providers</h4>
            </div>
            <div className="card-body">
              {pendingMaid.length === 0 ? (
                <p className="text-muted">No pending maids.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Services</th>
                        <th>Region</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingMaid.map(maid => (
                        <tr key={maid.id}>
                          <td>{maid.id}</td>
                          <td>{maid.name}</td>
                          <td>{maid.email}</td>
                          <td>{maid.services}</td>
                          <td>{maid.region}</td>
                          <td>
                            <button className="btn btn-success btn-sm me-1" onClick={() => handleApproveMaid(maid.id)}>Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleRejectMaid(maid.id)}>Reject</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tiffins */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Pending Tiffin Service Providers</h4>
            </div>
            <div className="card-body">
              {pendingTiffin.length === 0 ? (
                <p className="text-muted">No pending tiffins.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Food Category</th>
                        <th>Region</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingTiffin.map(tiffin => (
                        <tr key={tiffin.id}>
                          <td>{tiffin.id}</td>
                          <td>{tiffin.name}</td>
                          <td>{tiffin.email}</td>
                          <td>{tiffin.foodCategory}</td>
                          <td>{tiffin.region}</td>
                          <td>
                            <button className="btn btn-success btn-sm me-1" onClick={() => handleApproveTiffin(tiffin.id)}>Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleRejectTiffin(tiffin.id)}>Reject</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Section ABOVE system status */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>📨 Contact Us Messages</h4>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setShowContactMessages(!showContactMessages)}
          >
            {showContactMessages ? 'Hide Messages' : 'Show Messages'}
          </button>
        </div>
        {showContactMessages && (
          <div className="card-body">
            {contactMessages.length === 0 ? (
              <p className="text-muted">No messages found.</p>
            ) : (
              <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table className="table table-bordered table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactMessages.map(msg => (
                      <tr key={msg.id}>
                        <td>{msg.id}</td>
                        <td>{msg.name}</td>
                        <td>{msg.email}</td>
                        <td>{msg.phone}</td>
                        <td className="text-truncate" style={{ maxWidth: '200px' }}>{msg.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="card mb-4">
        <div className="card-header">
          <h4>System Status</h4>
        </div>
        <div className="card-body text-center">
          <span className="badge bg-success fs-6">✅ System Online</span>
          <p className="text-muted mt-2">All services are running normally</p>
        </div>
      </div>
    </div>
  );
}

export default Admin;
