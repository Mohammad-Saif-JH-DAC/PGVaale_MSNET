// src/components/OwnerDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import './OwnerDashboard.css';

function OwnerDashboard() {
  const token = localStorage.getItem('token');
  let username = '';
  let userRoles = [];

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload.sub || payload.username || payload.email || '';
      userRoles = payload.role ? [payload.role] : [];
    } catch (e) {
      console.error('Error decoding token:', e);
    }
  }

  const [rooms, setRooms] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    imagePaths: ['', '', '', '', ''],
    latitude: '',
    longitude: '',
    amenities: '',
    nearbyResources: '',
    rent: '',
    generalPreference: ''
  });
  const [editingId, setEditingId] = useState(null);
  const preferenceOptions = ['Male', 'Female', 'Any'];
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    const fetchData = async () => {
      if (!username) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }
      try {
        const ownerRes = await api.get('/owners/me');
        const id = Number(ownerRes.data.id);
        if (Number.isNaN(id)) throw new Error('Invalid owner ID');
        setOwnerId(id);

        const pgRes = await api.get(`/pg/owner/${id}`);
        setRooms(pgRes.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('imagePath')) {
      const index = Number(name.replace('imagePath', '')) - 1;
      setForm(prev => {
        const updated = [...prev.imagePaths];
        updated[index] = value;
        return { ...prev, imagePaths: updated };
      });
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!ownerId) {
      setError('Owner ID missing.');
      return;
    }

    const validImages = form.imagePaths.filter(url => url.trim() !== '');

    if (validImages.length === 0) {
      setError('At least Image URL #1 is required.');
      return;
    }

    if (validImages.length > 5) {
      setError('Maximum of 5 image URLs allowed.');
      return;
    }

    const dataToSend = {
      ownerId,
      imagePaths: validImages,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      amenities: form.amenities,
      nearbyResources: form.nearbyResources,
      rent: parseFloat(form.rent),
      generalPreference: form.generalPreference
    };

    try {
      if (editingId) {
        await api.put(`/pg/${editingId}`, dataToSend);
        setError('PG updated successfully.');
        setEditingId(null);
      } else {
        await api.post('/pg/register', dataToSend);
        setError('PG registered successfully.');
      }

      const pgRes = await api.get(`/pg/owner/${ownerId}`);
      setRooms(pgRes.data);

      setForm({
        imagePaths: ['', '', '', '', ''],
        latitude: '',
        longitude: '',
        amenities: '',
        nearbyResources: '',
        rent: '',
        generalPreference: ''
      });

      setActiveTab('list');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      console.error('Error saving PG:', err);
      setError(err.response?.data || err.message);
    }
  };

  const handleEditRoom = pg => {
    const images = pg.imagePaths || [];
    setForm({
      imagePaths: [0, 1, 2, 3, 4].map(i => images[i] || ''),
      latitude: pg.latitude?.toString() || '',
      longitude: pg.longitude?.toString() || '',
      amenities: pg.amenities || '',
      nearbyResources: pg.nearbyResources || '',
      rent: pg.rent?.toString() || '',
      generalPreference: pg.generalPreference || ''
    });
    setEditingId(pg.id);
    setError('');
    setActiveTab('form');
  };

  const handleDelete = async id => {
    if (!window.confirm(`Delete PG #${id}?`)) return;
    try {
      await api.delete(`/pg/${id}`);
      setRooms(rooms.filter(r => r.id !== id));
      setError('PG deleted successfully.');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      console.error('Delete PG:', err);
      setError(err.response?.data || err.message);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="dashboard-header mb-4">
        <h2 className="text-primary">PGVaale Owner Dashboard</h2>
        <p className="text-muted">Manage your PG listings efficiently</p>
      </div>

      {error && (
        <div className={`alert alert-${error.includes('successfully') ? 'success' : 'danger'} alert-dismissible fade show`}>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            My PGs
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            {editingId ? 'Edit PG' : 'Add New PG'}
          </button>
        </li>
      </ul>

      {activeTab === 'form' && (
        <div className="card shadow-sm mb-5">
          <div className="card-body">
            <h5 className="card-title mb-4">{editingId ? 'Edit PG Details' : 'Register New PG'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {[1, 2, 3, 4, 5].map(n => (
                  <div className="col-md-6" key={n}>
                    <label htmlFor={`imagePath${n}`} className="form-label">
                      Image URL {n}{n === 1 && ' *'}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`imagePath${n}`}
                      name={`imagePath${n}`}
                      placeholder="https://..."
                      value={form.imagePaths[n - 1]}
                      onChange={handleChange}
                      required={n === 1}
                    />
                  </div>
                ))}

                <div className="col-md-3">
                  <label className="form-label">Latitude *</label>
                  <input type="number" step="any" className="form-control" name="latitude" value={form.latitude} onChange={handleChange} required />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Longitude *</label>
                  <input type="number" step="any" className="form-control" name="longitude" value={form.longitude} onChange={handleChange} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Amenities</label>
                  <textarea className="form-control" name="amenities" value={form.amenities} onChange={handleChange} rows="2" placeholder="WiFi, AC, Food, etc." />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Nearby Resources</label>
                  <textarea className="form-control" name="nearbyResources" value={form.nearbyResources} onChange={handleChange} rows="2" placeholder="Metro, Market, College, etc." />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Monthly Rent (₹) *</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input type="number" className="form-control" name="rent" value={form.rent} onChange={handleChange} required />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">General Preference *</label>
                  <select className="form-select" name="generalPreference" value={form.generalPreference} onChange={handleChange} required>
                    <option value="">Select Preference</option>
                    {preferenceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="col-12 mt-3">
                  <div className="d-flex justify-content-end gap-2">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setEditingId(null);
                        setActiveTab('list');
                        setForm({
                          imagePaths: ['', '', '', '', ''],
                          latitude: '',
                          longitude: '',
                          amenities: '',
                          nearbyResources: '',
                          rent: '',
                          generalPreference: ''
                        });
                      }}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-primary" type="submit">
                      {editingId ? 'Update PG' : 'Register PG'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="card-title mb-0">Your Registered PGs</h5>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => {
                  setEditingId(null);
                  setActiveTab('form');
                }}
              >
                <i className="bi bi-plus-lg me-1"></i> Add New
              </button>
            </div>

            {rooms.length ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Images</th>
                      <th>Rent</th>
                      <th>Preference</th>
                      <th>Amenities</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map(pg => (
                      <tr key={pg.id}>
                        <td className="fw-bold">#{pg.id}</td>
                        <td>
                          <div className="d-flex">
                            {pg.imagePaths?.length > 0
                              ? pg.imagePaths.slice(0, 3).map((u, idx) => (
                                  <div key={idx} className="me-2" style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden' }}>
                                    <img
                                      src={u}
                                      alt={`PG-${pg.id}-${idx}`}
                                      className="img-fluid h-100 w-100"
                                      style={{ objectFit: 'cover' }}
                                      onError={e => { e.target.onerror = null; e.target.src = '/fallback.png'; }}
                                    />
                                  </div>
                                ))
                              : <span className="text-muted">No Image</span>}
                            {pg.imagePaths?.length > 3 && (
                              <div className="d-flex align-items-center justify-content-center bg-light" style={{ width: '60px', height: '60px', borderRadius: '4px' }}>
                                +{pg.imagePaths.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="fw-bold text-success">₹{pg.rent}</td>
                        <td>
                          <span className={`badge ${
                            pg.generalPreference === 'Male' ? 'bg-primary' : 
                            pg.generalPreference === 'Female' ? 'bg-pink' : 'bg-secondary'
                          }`}>
                            {pg.generalPreference}
                          </span>
                        </td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: '200px' }} title={pg.amenities}>
                            {pg.amenities || '-'}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditRoom(pg)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(pg.id)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-house-door text-muted" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="text-muted">No PGs registered yet</h5>
                <p className="text-muted">Start by adding your first PG property</p>
                <button 
                  className="btn btn-primary mt-2"
                  onClick={() => setActiveTab('form')}
                >
                  Add Your First PG
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;