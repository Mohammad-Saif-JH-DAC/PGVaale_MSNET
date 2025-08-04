// src/components/OwnerDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import './OwnerDashboard.css';
import { Link } from 'react-router-dom';

// Import Leaflet CSS and components
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
    generalPreference: '',
    region: ''
  });
  const [editingId, setEditingId] = useState(null);
  const preferenceOptions = ['Male', 'Female', 'Any'];
  const regionOptions = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad'];
  const [activeTab, setActiveTab] = useState('list');
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    currentIndex: 0,
    images: []
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log('Current username:', username);
      console.log('Current userRoles:', userRoles);
      console.log('Current token:', token ? 'Present' : 'Missing');
      
      if (!username) {
        setError('User not authenticated. Please log in as an owner.');
        setLoading(false);
        return;
      }
      
      // Check if user has OWNER role
      if (!userRoles.includes('OWNER') && !userRoles.includes('ROLE_OWNER')) {
        setError('You need to be logged in as an owner. Current role: ' + userRoles.join(', '));
        setLoading(false);
        return;
      }
      
      try {
        console.log('Fetching owner details...');
        // Try to get owner details
        const ownerRes = await api.get('/api/owners/me');
        console.log('Owner response:', ownerRes.data);
        const id = Number(ownerRes.data.id);
        if (Number.isNaN(id)) throw new Error('Invalid owner ID');
        setOwnerId(id);
        console.log('Owner ID:', id);
        
        // Get PGs for this owner
        console.log('Fetching PGs for owner ID:', id);
        const pgRes = await api.get(`/api/pg/owner/${id}`);
        console.log('PGs response:', pgRes.data);
        setRooms(pgRes.data);
        setError('');
      } catch (err) {
        console.error('Error fetching owner data:', err);
        console.error('Error response:', err.response);
        if (err.response?.status === 403) {
          setError('Access denied. Please log in as an owner to view your PGs.');
        } else if (err.response?.status === 401) {
          setError('Authentication required. Please log in as an owner.');
        } else {
          setError(err.response?.data || err.message || 'Error loading data');
        }
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username, token]);

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
    if (!form.region) {
        setError('Please select a region.');
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
      generalPreference: form.generalPreference,
      region: form.region
    };

    try {
      if (editingId) {
        await api.put(`/api/pg/${editingId}`, dataToSend);
        setError('PG updated successfully.');
        setEditingId(null);
      } else {
        await api.post('/api/pg/register', dataToSend);
        setError('PG registered successfully.');
      }
      const pgRes = await api.get(`/api/pg/owner/${ownerId}`);
      setRooms(pgRes.data);
      setForm({
        imagePaths: ['', '', '', '', ''],
        latitude: '',
        longitude: '',
        amenities: '',
        nearbyResources: '',
        rent: '',
        generalPreference: '',
        region: ''
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
      generalPreference: pg.generalPreference || '',
      region: pg.region || ''
    });
    setEditingId(pg.id);
    setError('');
    setActiveTab('form');
  };

  const handleDelete = async id => {
    if (!window.confirm(`Delete PG #${id}?`)) return;
    try {
      await api.delete(`/api/pg/${id}`);
      setRooms(rooms.filter(r => r.id !== id));
      setError('PG deleted successfully.');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      console.error('Delete PG:', err);
      setError(err.response?.data || err.message);
    }
  };

  const MapComponent = ({ lat, lng }) => {
    const isValidCoordinates = lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));

    if (!isValidCoordinates) {
        return <div className="alert alert-warning">Invalid map coordinates.</div>;
    }

    const position = [parseFloat(lat), parseFloat(lng)];

    return (
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '100%', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        touchZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            PG Location
          </Popup>
        </Marker>
      </MapContainer>
    );
  };

  const ImageGallery = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
      return (
        <div className="no-images-placeholder">
          <i className="bi bi-image text-muted"></i>
          <span>No images available</span>
        </div>
      );
    }

    const nextImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
      <div className="image-carousel">
        <div className="carousel-image-container">
          <img
            src={images[currentIndex]}
            alt={`PG Image ${currentIndex + 1}`}
            className="carousel-image"
            onClick={() => setLightbox({
              isOpen: true,
              currentIndex: currentIndex,
              images: images
            })}
            onError={e => {
              e.target.onerror = null;
              e.target.src = '/fallback.png';
            }}
          />
          {images.length > 1 && (
            <>
              <button 
                className="carousel-control prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button 
                className="carousel-control next"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
              <div className="carousel-indicators">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`indicator ${index === currentIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                  ></span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
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
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {error}
              {(error.includes('log in') || error.includes('Authentication') || error.includes('Access denied')) && (
                <div className="mt-2">
                  <Link to="/login" className="btn btn-primary btn-sm">
                    Login as Owner
                  </Link>
                </div>
              )}
            </div>
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
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
                  <input
                    type="number"
                    step="any"
                    className="form-control"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    className="form-control"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Region *</label>
                  <select
                    className="form-select"
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Region</option>
                    {regionOptions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                {form.latitude && form.longitude && (
                  <div className="col-12">
                    <div className="map-container mb-3" style={{ height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                      <MapComponent lat={form.latitude} lng={form.longitude} />
                    </div>
                  </div>
                )}
                <div className="col-md-6">
                  <label className="form-label">Amenities</label>
                  <textarea
                    className="form-control"
                    name="amenities"
                    value={form.amenities}
                    onChange={handleChange}
                    rows="2"
                    placeholder="WiFi, AC, Food, etc."
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Nearby Resources</label>
                  <textarea
                    className="form-control"
                    name="nearbyResources"
                    value={form.nearbyResources}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Metro, Market, College, etc."
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Monthly Rent (₹) *</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      name="rent"
                      value={form.rent}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">General Preference *</label>
                  <select
                    className="form-select"
                    name="generalPreference"
                    value={form.generalPreference}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Preference</option>
                    {preferenceOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
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
                          generalPreference: '',
                          region: ''
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
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col" style={{ width: '5%' }}>ID</th>
                      <th scope="col" style={{ width: '15%' }}>Images</th>
                      <th scope="col" style={{ width: '10%' }}>Region</th>
                      <th scope="col" style={{ width: '20%' }}>Location</th>
                      <th scope="col" style={{ width: '10%' }}>Rent</th>
                      <th scope="col" style={{ width: '10%' }}>Preference</th>
                      <th scope="col" style={{ width: '10%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map(pg => (
                      <tr key={pg.id}>
                        <td>#{pg.id}</td>
                        <td>
                          <div style={{ width: '120px', height: '80px' }}>
                            <ImageGallery images={pg.imagePaths || []} />
                          </div>
                        </td>
                        <td>{pg.region || 'N/A'}</td>
                        <td>
                          <div style={{ width: '200px', height: '120px' }}>
                            <MapComponent lat={pg.latitude} lng={pg.longitude} />
                          </div>
                        </td>
                        <td>₹{pg.rent}/month</td>
                        <td>
                          <span className={`badge ${
                            pg.generalPreference === 'Male' ? 'bg-primary' :
                            pg.generalPreference === 'Female' ? 'bg-pink' : 'bg-secondary'
                          }`}>
                            {pg.generalPreference}
                          </span>
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

      {lightbox.isOpen && (
        <div className="custom-lightbox">
          <div className="lightbox-content">
            <button
              className="lightbox-close"
              onClick={() => setLightbox({ ...lightbox, isOpen: false })}
            >
              &times;
            </button>
            <img
              src={lightbox.images[lightbox.currentIndex]}
              alt={`PG Image ${lightbox.currentIndex + 1}`}
            />
            {lightbox.images.length > 1 && (
              <>
                <button
                  className="lightbox-nav prev"
                  onClick={() => setLightbox({
                    ...lightbox,
                    currentIndex: (lightbox.currentIndex - 1 + lightbox.images.length) % lightbox.images.length
                  })}
                >
                  &lt;
                </button>
                <button
                  className="lightbox-nav next"
                  onClick={() => setLightbox({
                    ...lightbox,
                    currentIndex: (lightbox.currentIndex + 1) % lightbox.images.length
                  })}
                >
                  &gt;
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;