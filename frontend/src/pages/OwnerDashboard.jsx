// src/components/OwnerDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import './OwnerDashboard.css';

// --- Leaflet Imports ---
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// --- Import Marker Images Directly ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// -------------------------

// --- Fix Leaflet Default Icon Issue ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  // Use the imported image paths
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
    generalPreference: ''
  });
  const [editingId, setEditingId] = useState(null);
  const preferenceOptions = ['Male', 'Female', 'Any'];
  const [activeTab, setActiveTab] = useState('list');
  // Removed locationName state as geocoding is removed
  // const [locationName, setLocationName] = useState('');
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    currentIndex: 0,
    images: []
  });

  // Removed Google Maps loading effect
  // useEffect(() => {
  //   loadGoogleMaps(() => {
  //     setMapsLoaded(true);
  //   });
  // }, []);

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

  // Removed useEffect for fetching location name based on lat/lng
  // useEffect(() => {
  //   if (form.latitude && form.longitude) {
  //     fetchLocationName(form.latitude, form.longitude);
  //   }
  // }, [form.latitude, form.longitude]);

  // Removed Google Geocoding function
  // const fetchLocationName = async (lat, lng) => { ... }

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
    // Removed locationName from dataToSend
    const dataToSend = {
      ownerId,
      imagePaths: validImages,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      amenities: form.amenities,
      nearbyResources: form.nearbyResources,
      rent: parseFloat(form.rent),
      generalPreference: form.generalPreference
      // locationName - removed
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
    // setLocationName(pg.locationName || ''); // Removed
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

  // Leaflet Map Component
  const MapComponent = ({ lat, lng }) => {
    // Check if lat/lng are valid numbers
    const isValidCoordinates = lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));

    if (!isValidCoordinates) {
        return <div className="alert alert-warning">Invalid map coordinates.</div>;
    }

    const position = [parseFloat(lat), parseFloat(lng)];

    return (
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '150px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}
        dragging={false} // Optional: disable dragging
        zoomControl={false} // Optional: disable zoom control
        doubleClickZoom={false} // Optional: disable double click zoom
        scrollWheelZoom={false} // Optional: disable scroll wheel zoom
        touchZoom={false} // Optional: disable touch zoom
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


  // Image Gallery Component (Unchanged)
  const ImageGallery = ({ images }) => {
    if (!images || images.length === 0) {
      return (
        <div className="no-images-placeholder">
          <i className="bi bi-image text-muted"></i>
          <span>No images available</span>
        </div>
      );
    }
    return (
      <div className="image-gallery">
        {images.slice(0, 4).map((img, idx) => (
          <div
            key={idx}
            className="gallery-item"
            onClick={() => setLightbox({
              isOpen: true,
              currentIndex: idx,
              images: images
            })}
          >
            <img
              src={img}
              alt={`PG Image ${idx + 1}`}
              onError={e => {
                e.target.onerror = null;
                e.target.src = '/fallback.png'; // Ensure you have a fallback image
              }}
            />
            {idx === 3 && images.length > 4 && (
              <div className="more-images-overlay">
                +{images.length - 4}
              </div>
            )}
          </div>
        ))}
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
                {/* Removed locationName display */}
                {/* {locationName && (
                  <div className="col-12">
                    <div className="alert alert-info py-2 mb-0">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      {locationName}
                    </div>
                  </div>
                )} */}
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
                          generalPreference: ''
                        });
                        // setLocationName(''); // Removed
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
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {rooms.map(pg => (
                  <div className="col" key={pg.id}>
                    <div className="card h-100 shadow-sm border-0">
                      <div className="position-relative">
                        <ImageGallery images={pg.imagePaths} />
                        <div className="position-absolute top-0 end-0 m-2">
                          <span className={`badge ${
                            pg.generalPreference === 'Male' ? 'bg-primary' :
                              pg.generalPreference === 'Female' ? 'bg-pink' : 'bg-secondary'
                          }`}>
                            {pg.generalPreference}
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title mb-0">PG #{pg.id}</h5>
                          <span className="fw-bold text-success">₹{pg.rent}/month</span>
                        </div>
                        {/* Removed locationName display */}
                        {/* {pg.locationName && (
                          <p className="text-muted small mb-2">
                            <i className="bi bi-geo-alt-fill me-1"></i>
                            {pg.locationName}
                          </p>
                        )} */}
                        {pg.latitude && pg.longitude && (
                          <div className="mb-3">
                            <MapComponent lat={pg.latitude} lng={pg.longitude} />
                          </div>
                        )}
                        {pg.amenities && (
                          <div className="mb-2">
                            <h6 className="small fw-bold mb-1">Amenities:</h6>
                            <p className="small text-muted mb-0">
                              {pg.amenities.length > 60
                                ? `${pg.amenities.substring(0, 60)}...`
                                : pg.amenities}
                            </p>
                          </div>
                        )}
                        {pg.nearbyResources && (
                          <div className="mb-3">
                            <h6 className="small fw-bold mb-1">Nearby:</h6>
                            <p className="small text-muted mb-0">
                              {pg.nearbyResources.length > 60
                                ? `${pg.nearbyResources.substring(0, 60)}...`
                                : pg.nearbyResources}
                            </p>
                          </div>
                        )}
                        <div className="d-flex justify-content-between align-items-center">
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
      {/* Custom Lightbox */}
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
                  {/* Corrected: Use < for < in JSX */}
                  
                </button>
                <button
                  className="lightbox-nav next"
                  onClick={() => setLightbox({
                    ...lightbox,
                    currentIndex: (lightbox.currentIndex + 1) % lightbox.images.length
                  })}
                >
                  {/* Corrected: Use > for > in JSX */}
                  
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
