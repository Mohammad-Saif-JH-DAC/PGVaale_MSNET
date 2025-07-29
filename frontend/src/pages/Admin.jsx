import React, { useEffect, useState } from 'react';
import DashboardStats from '../components/DashboardStats';
import api from '../api';



function Admin() {
  const [pendingMaid, setPendingMaid] = useState([]);
  const [pendingTiffin, setPendingTiffin] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load pending maids and tiffin providers
    Promise.all([
      api.get('/admin/maids/pending'),
      api.get('/admin/tiffins/pending')
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
      await api.post(`/admin/maids/${id}/approve`);
      // Refresh the list
      const response = await api.get('/admin/maids/pending');
      setPendingMaid(response.data || []);
    } catch (error) {
      setError('Failed to approve maid');
    }
  };

  const handleRejectMaid = async (id) => {
    try {
      await api.post(`/admin/maids/${id}/reject`);
      // Refresh the list
      const response = await api.get('/admin/maids/pending');
      setPendingMaid(response.data || []);
    } catch (error) {
      setError('Failed to reject maid');
    }
  };

  const handleApproveTiffin = async (id) => {
    try {
      await api.post(`/admin/tiffins/${id}/approve`);
      // Refresh the list
      const response = await api.get('/admin/tiffins/pending');
      setPendingTiffin(response.data || []);
    } catch (error) {
      setError('Failed to approve tiffin');
    }
  };

  const handleRejectTiffin = async (id) => {
    try {
      await api.post(`/admin/tiffins/${id}/reject`);
      // Refresh the list
      const response = await api.get('/admin/tiffins/pending');
      setPendingTiffin(response.data || []);
    } catch (error) {
      setError('Failed to reject tiffin');
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
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Dashboard Statistics */}
      <DashboardStats />
      
      <hr className="my-5" />
      
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>Pending Maid Service Providers</h4>
            </div>
            <div className="card-body">
              {pendingMaid.length === 0 ? (
                <p className="text-muted">No pending maid service providers found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
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
                            <button 
                              className="btn btn-success btn-sm me-1" 
                              onClick={() => handleApproveMaid(maid.id)}
                            >
                              Approve
                            </button>
                            <button 
                              className="btn btn-danger btn-sm" 
                              onClick={() => handleRejectMaid(maid.id)}
                            >
                              Reject
                            </button>
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
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>Pending Tiffin Service Providers</h4>
            </div>
            <div className="card-body">
              {pendingTiffin.length === 0 ? (
                <p className="text-muted">No pending tiffin service providers found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
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
                            <button 
                              className="btn btn-success btn-sm me-1" 
                              onClick={() => handleApproveTiffin(tiffin.id)}
                            >
                              Approve
                            </button>
                            <button 
                              className="btn btn-danger btn-sm" 
                              onClick={() => handleRejectTiffin(tiffin.id)}
                            >
                              Reject
                            </button>
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
      
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4>System Status</h4>
            </div>
            <div className="card-body">
              <div className="text-center">
                <span className="badge bg-success fs-6">System Online</span>
                <p className="text-muted mt-2">All services are running normally</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin; 