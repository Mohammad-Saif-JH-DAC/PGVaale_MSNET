// src/components/OwnerDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import './OwnerDashboard.css';
import { Link } from 'react-router-dom';
// Import Leaflet CSS and components
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Toast from '../utils/Toast'; 



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
  const token = sessionStorage.getItem('token');
  let username = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Extract username from the correct claim types based on the actual JWT structure
      username = payload.unique_name || 
                 payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
                 payload.name || 
                 payload.sub || 
                 payload.username || 
                 payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
                 payload.email || 
                 '';
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
    region: '',
    availability: 'Available', // Default to available
  });
  const [editingId, setEditingId] = useState(null);
  const preferenceOptions = ['Male', 'Female', 'Any'];
  const regionOptions = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad'];
  const [activeTab, setActiveTab] = useState('list');
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    currentIndex: 0,
    images: [],
  });

  const [ownerDetails, setOwnerDetails] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);


// Initialize profile form when ownerDetails is available
useEffect(() => {
  if (ownerDetails) {
    setProfileForm({
      name: ownerDetails.name || '',
      email: ownerDetails.email || '',
      mobileNumber: ownerDetails.mobileNumber || '',
      region: ownerDetails.region || '',
      age: ownerDetails.age || '',
      aadhaar: ownerDetails.aadhaar || '',
    });
  }
}, [ownerDetails]);

// Handle profile input change
const handleProfileChange = (e) => {
  const { name, value } = e.target;
  setProfileForm((prev) => ({ ...prev, [name]: value }));
};

// Save updated profile
const handleSaveProfile = async () => {
  try {
    await api.put(`/api/owners/${ownerId}`, profileForm);
    setOwnerDetails(profileForm); // Update displayed data
    setIsEditingProfile(false);
    Toast.success('Profile updated successfully.');
    setTimeout(() => setError(''), 3000);
  } catch (err) {
    console.error('Error updating profile:', err);
    Toast.error('Failed to update profile: ' + (err.response?.data || err.message));
  }
};

  // Optimized useEffect: avoids infinite loop
  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount

    const fetchData = async () => {
      if (!isMounted) return;

      if (!username) {
        Toast.error('User not authenticated. Please log in as an owner.');
        setLoading(false);
        return;
      }

      // Extract role from token
      let hasOwnerRole = false;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = payload.role || '';
          hasOwnerRole = role === 'OWNER' || role === 'ROLE_OWNER';
        } catch (e) {
          console.error('Error decoding token:', e);
        }
      }

      if (!hasOwnerRole) {
        Toast.error('You need to be logged in as an owner.');
        setLoading(false);
        return;
      }

      try {
        const ownerRes = await api.get('/api/owners/me');

        const id = Number(ownerRes.data.id);
        if (Number.isNaN(id)) throw new Error('Invalid owner ID');
        if (isMounted) setOwnerId(id);
        setOwnerDetails(ownerRes.data); 

        const pgRes = await api.get(`/api/pg/owner/${id}`);
        if (isMounted) setRooms(pgRes.data);
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        const message = err.response?.data?.message || err.response?.data || err.message;
        if (isMounted) Toast.error(message);
        if (isMounted) setRooms([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup
    };
  }, [username, token]); // ✅ Only stable values

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('imagePath')) {
      const index = Number(name.replace('imagePath', '')) - 1;
      setForm((prev) => {
        const updated = [...prev.imagePaths];
        updated[index] = value;
        return { ...prev, imagePaths: updated };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ownerId) {
      Toast.error('Owner ID missing.');
      return;
    }

    const validImages = form.imagePaths.filter((url) => url.trim() !== '');
    if (validImages.length === 0) {
      Toast.warn('At least one image URL is required.');
      return;
    }
    if (validImages.length > 5) {
      Toast.info('Maximum of 5 image URLs allowed.');
      return;
    }
    if (!form.region) {
      Toast.warn('Please select a region.');
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
      region: form.region,
      availability: form.availability || 'Available',
    };

    try {
      if (editingId) {
        await api.put(`/api/pg/${editingId}`, dataToSend);
        Toast.success('PG updated successfully.');
      } else {
        await api.post('/api/pg/register', dataToSend);
        Toast.success('PG registered successfully.');
      }

      // Refetch updated list
      const pgRes = await api.get(`/api/pg/owner/${ownerId}`);
      setRooms(pgRes.data);

      // Reset form
      setForm({
        imagePaths: ['', '', '', '', ''],
        latitude: '',
        longitude: '',
        amenities: '',
        nearbyResources: '',
        rent: '',
        generalPreference: '',
        region: '',
        availability: 'Available',
      });
      setEditingId(null);
      setActiveTab('list');

      setTimeout(() => setError(''), 3000);
    } catch (err) {
      Toast.error('Error saving PG:', err);
      Toast.error(err.response?.data || err.message);
    }
  };

  const handleEditRoom = (pg) => {
    const images = pg.imagePaths || [];
    setForm({
      imagePaths: [0, 1, 2, 3, 4].map((i) => images[i] || ''),
      latitude: pg.latitude?.toString() || '',
      longitude: pg.longitude?.toString() || '',
      amenities: pg.amenities || '',
      nearbyResources: pg.nearbyResources || '',
      rent: pg.rent?.toString() || '',
      generalPreference: pg.generalPreference || '',
      region: pg.region || '',
      availability: pg.availability || 'Available',
    });
    setEditingId(pg.id);
    setError('');
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete PG #${id}?`)) return;
    try {
      await api.delete(`/api/pg/${id}`);
      setRooms(rooms.filter((r) => r.id !== id));
      Toast.success('PG deleted successfully.');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
     Toast.error('Delete PG:', err);
      Toast.error(err.response?.data || err.message);
    }
  };

const handleDeleteAccount = async () => {
  try {
    // Step 1: Delete all PGs first
    if (rooms.length > 0) {
      const deletePgPromises = rooms.map(async (pg) => {
        try {
          await api.delete(`/api/pg/${pg.id}`);
        } catch (err) {
          Toast.warn(`Failed to delete PG ${pg.id}`, err);
        }
      });
      await Promise.all(deletePgPromises);
    }

    // Step 2: Delete owner account
    await api.delete(`/api/owners/${ownerId}`);

    // Step 3: Clear session
    sessionStorage.removeItem('token');
    // If you're using localStorage too:
    localStorage.removeItem('token');

    // Step 4: Show success and redirect
    Toast.success('Your account has been deleted successfully.');
    setTimeout(() => {
      window.location.href = '/'; // Redirect to home
    }, 2000);
  } catch (err) {
    console.error('Error deleting account:', err);
    Toast.error('Failed to delete account. Please try again.');
    setShowDeleteModal(false);
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
          <Popup>PG Location</Popup>
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
            onClick={() =>
              setLightbox({
                isOpen: true,
                currentIndex,
                images,
              })
            }
            onError={(e) => {
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

  if (loading)
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}>
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#2C3E50' }}>
            <i className="fas fa-building text-primary me-3"></i>PGVaale Owner Dashboard
          </h1>
          <p className="lead text-muted mb-4">
            Manage your PG listings efficiently and connect with potential tenants
          </p>
      </div>

{/* Owner Profile Card */}
{ownerDetails && (
          <div className="card border-0 shadow-lg rounded-4 mb-5" style={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)' 
          }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: '#2C3E50' }}>
                  <i className="fas fa-user-circle text-primary me-2"></i>Owner Profile
        </h5>
        {!isEditingProfile ? (
          <button
                    className="btn btn-outline-primary rounded-3 shadow-sm"
            onClick={() => setIsEditingProfile(true)}
          >
                    <i className="fas fa-edit me-2"></i>Edit
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button
                      className="btn btn-outline-secondary rounded-3 shadow-sm"
              onClick={() => {
                setIsEditingProfile(false);
                // Reset form to original data
                setProfileForm({
                  name: ownerDetails.name || '',
                  email: ownerDetails.email || '',
                  mobileNumber: ownerDetails.mobileNumber || '',
                  region: ownerDetails.region || '',
                  age: ownerDetails.age || '',
                  aadhaar: ownerDetails.aadhaar || '',
                });
              }}
            >
              Cancel
            </button>
            <button
                      className="btn btn-success rounded-3 shadow-sm"
              onClick={handleSaveProfile}
            >
                      <i className="fas fa-save me-2"></i>Save
            </button>
          </div>
        )}
      </div>

      {/* Delete Account Button */}
              <div className="mb-4">
  <button
                  className="btn btn-outline-danger rounded-3 shadow-sm"
    onClick={() => setShowDeleteModal(true)}
    title="Delete your account permanently"
  >
                  <i className="fas fa-trash me-2"></i>Delete Account
  </button>
</div>

      {isEditingProfile ? (
        <div className="row g-3">
          <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Name *</label>
            <input
              type="text"
                      className="form-control border-0 shadow-sm rounded-3"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              required
                      style={{ background: '#f8fafc' }}
            />
          </div>
          <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Email *</label>
            <input
              type="email"
                      className="form-control border-0 shadow-sm rounded-3"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              required
                      style={{ background: '#f8fafc' }}
            />
          </div>
          <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Mobile Number *</label>
            <input
              type="text"
                      className="form-control border-0 shadow-sm rounded-3"
              name="mobileNumber"
              value={profileForm.mobileNumber}
              onChange={handleProfileChange}
              pattern="[0-9]{10}"
              title="10-digit mobile number"
              required
                      style={{ background: '#f8fafc' }}
            />
          </div>
          <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Region *</label>
            <select
                      className="form-select border-0 shadow-sm rounded-3"
              name="region"
              value={profileForm.region}
              onChange={handleProfileChange}
              required
                      style={{ background: '#f8fafc' }}
            >
              <option value="">Select Region</option>
              {regionOptions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Age</label>
            <input
              type="number"
                      className="form-control border-0 shadow-sm rounded-3"
              name="age"
              value={profileForm.age}
              onChange={handleProfileChange}
              min="18"
              max="120"
                      style={{ background: '#f8fafc' }}
            />
          </div>
          <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Aadhaar Number</label>
            <input
              type="text"
                      className="form-control border-0 shadow-sm rounded-3"
              name="aadhaar"
              value={profileForm.aadhaar}
              onChange={handleProfileChange}
              pattern="[0-9]{12}"
              title="12-digit Aadhaar number"
              placeholder="123412341234"
                      style={{ background: '#f8fafc' }}
            />
          </div>
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-md-6">
                    <strong style={{ color: '#374151' }}>Name:</strong> {ownerDetails.name || 'Not provided'}
          </div>
          <div className="col-md-6">
                    <strong style={{ color: '#374151' }}>Email:</strong> {ownerDetails.email || 'Not provided'}
          </div>
          <div className="col-md-6">
                    <strong style={{ color: '#374151' }}>Mobile:</strong> {ownerDetails.mobileNumber || 'Not provided'}
          </div>
          <div className="col-md-6">
                    <strong style={{ color: '#374151' }}>Region:</strong> {ownerDetails.region || 'Not provided'}
          </div>
          <div className="col-md-6">
                    <strong style={{ color: '#374151' }}>Age:</strong> {ownerDetails.age || 'Not provided'}
          </div>
          <div className="col-md-6">
                    <strong style={{ color: '#374151' }}>Aadhaar:</strong>{' '}
            {ownerDetails.aadhaar ? 'XXXX-XXXX-' + ownerDetails.aadhaar.slice(-4) : 'Not provided'}
          </div>
        </div>
      )}
    </div>
  </div>
)}

        {/* Error Message */}
      {error && (
        <div
            className={`alert border-0 rounded-4 shadow-sm mb-4 ${
              error.includes('successfully') ? 'alert-success' : 'alert-danger'
            }`}
            style={{ 
              background: error.includes('successfully') 
                ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: error.includes('successfully') ? '1px solid #10B981' : '1px solid #EF4444'
            }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {error}
              {(error.includes('log in') ||
                error.includes('Authentication') ||
                error.includes('Access denied')) && (
                <div className="mt-2">
                    <Link to="/login" className="btn btn-primary btn-sm rounded-3">
                    Login as Owner
                  </Link>
                </div>
              )}
            </div>
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        </div>
      )}

        {/* Navigation Tabs */}
        <div className="card border-0 shadow-lg rounded-4 mb-4" style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(10px)' 
        }}>
          <div className="card-body p-0">
            <ul className="nav nav-tabs border-0" style={{ background: 'transparent' }}>
        <li className="nav-item">
          <button
                  className={`nav-link border-0 rounded-0 ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
                  style={{ 
                    color: activeTab === 'list' ? '#6366F1' : '#6B7280',
                    background: activeTab === 'list' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    borderBottom: activeTab === 'list' ? '3px solid #6366F1' : 'none'
                  }}
          >
                  <i className="fas fa-list me-2"></i>My PGs
          </button>
        </li>
        <li className="nav-item">
          <button
                  className={`nav-link border-0 rounded-0 ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
                  style={{ 
                    color: activeTab === 'form' ? '#6366F1' : '#6B7280',
                    background: activeTab === 'form' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    borderBottom: activeTab === 'form' ? '3px solid #6366F1' : 'none'
                  }}
          >
                  <i className="fas fa-plus me-2"></i>{editingId ? 'Edit PG' : 'Add New PG'}
          </button>
        </li>
      </ul>
          </div>
        </div>

        {/* Form Tab */}
      {activeTab === 'form' && (
          <div className="card border-0 shadow-lg rounded-4 mb-5" style={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)' 
          }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4" style={{ color: '#2C3E50' }}>
                <i className="fas fa-edit text-primary me-2"></i>
                {editingId ? 'Edit PG Details' : 'Register New PG'}
              </h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div className="col-md-6" key={n}>
                      <label htmlFor={`imagePath${n}`} className="form-label fw-semibold" style={{ color: '#374151' }}>
                      Image URL {n}
                      {n === 1 && ' *'}
                    </label>
                    <input
                      type="text"
                        className="form-control border-0 shadow-sm rounded-3"
                      id={`imagePath${n}`}
                      name={`imagePath${n}`}
                      placeholder="https://..."
                      value={form.imagePaths[n - 1]}
                      onChange={handleChange}
                      required={n === 1}
                        style={{ background: '#f8fafc' }}
                    />
                  </div>
                ))}

                <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Latitude *</label>
                  <input
                    type="number"
                    step="any"
                      className="form-control border-0 shadow-sm rounded-3"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    required
                      style={{ background: '#f8fafc' }}
                  />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Longitude *</label>
                  <input
                    type="number"
                    step="any"
                      className="form-control border-0 shadow-sm rounded-3"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    required
                      style={{ background: '#f8fafc' }}
                  />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Region *</label>
                  <select
                      className="form-select border-0 shadow-sm rounded-3"
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    required
                      style={{ background: '#f8fafc' }}
                  >
                    <option value="">Select Region</option>
                    {regionOptions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                {form.latitude && form.longitude && (
                  <div className="col-12">
                    <div
                      className="map-container mb-3"
                        style={{ height: '200px', borderRadius: '1rem', overflow: 'hidden' }}
                    >
                      <MapComponent lat={form.latitude} lng={form.longitude} />
                    </div>
                  </div>
                )}

                <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Amenities</label>
                  <textarea
                      className="form-control border-0 shadow-sm rounded-3"
                    name="amenities"
                    value={form.amenities}
                    onChange={handleChange}
                    rows="2"
                    placeholder="WiFi, AC, Food, etc."
                      style={{ background: '#f8fafc' }}
                  />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Nearby Resources</label>
                  <textarea
                      className="form-control border-0 shadow-sm rounded-3"
                    name="nearbyResources"
                    value={form.nearbyResources}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Metro, Market, College, etc."
                      style={{ background: '#f8fafc' }}
                  />
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Monthly Rent (₹) *</label>
                  <div className="input-group">
                      <span className="input-group-text border-0" style={{ background: '#f8fafc' }}>₹</span>
                    <input
                      type="number"
                        className="form-control border-0 shadow-sm rounded-3"
                      name="rent"
                      value={form.rent}
                      onChange={handleChange}
                      required
                        style={{ background: '#f8fafc' }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>General Preference *</label>
                  <select
                      className="form-select border-0 shadow-sm rounded-3"
                    name="generalPreference"
                    value={form.generalPreference}
                    onChange={handleChange}
                    required
                      style={{ background: '#f8fafc' }}
                  >
                    <option value="">Select Preference</option>
                    {preferenceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>Availability *</label>
                  <select
                      className="form-select border-0 shadow-sm rounded-3"
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    required
                      style={{ background: '#f8fafc' }}
                  >
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>

                  <div className="col-12 mt-4">
                    <div className="d-flex justify-content-end gap-3">
                    <button
                      type="button"
                        className="btn btn-outline-secondary rounded-3 shadow-sm"
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
                          region: '',
                          availability: 'Available',
                        });
                      }}
                    >
                        <i className="fas fa-times me-2"></i>Cancel
                    </button>
                      <button className="btn btn-primary rounded-3 shadow-sm" type="submit" style={{ 
                        background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', 
                        border: 'none' 
                      }}>
                        <i className="fas fa-save me-2"></i>
                      {editingId ? 'Update PG' : 'Register PG'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* List Tab */}
      {activeTab === 'list' && (
          <div className="card border-0 shadow-lg rounded-4" style={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)' 
          }}>
            <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: '#2C3E50' }}>
                  <i className="fas fa-list text-primary me-2"></i>Your Registered PGs
                </h5>
              <button
                  className="btn btn-primary rounded-3 shadow-sm"
                onClick={() => {
                  setEditingId(null);
                  setActiveTab('form');
                }}
                  style={{ 
                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', 
                    border: 'none' 
                  }}
              >
                  <i className="fas fa-plus me-2"></i>Add New
              </button>
            </div>

            {rooms.length ? (
              <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead style={{ background: 'linear-gradient(135deg, #2C3E50 0%, #1ABC9C 100%)' }}>
                    <tr>
                        <th scope="col" style={{ width: '5%', color: 'white' }}>ID</th>
                      <th scope="col" style={{ width: '15%', color: 'white' }}>Images</th>
                      <th scope="col" style={{ width: '10%', color: 'white' }}>Region</th>
                      <th scope="col" style={{ width: '20%', color: 'white' }}>Location</th>
                      <th scope="col" style={{ width: '10%', color: 'white' }}>Rent</th>
                      <th scope="col" style={{ width: '10%', color: 'white' }}>Preference</th>
                      <th scope="col" style={{ width: '10%', color: 'white' }}>Availability</th>
                      <th scope="col" style={{ width: '10%', color: 'white' }}>Actions</th>
                      <th scope="col" style={{ width: '20%', color: 'white' }}>Current User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((pg) => (
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
                          <span
                              className={`badge rounded-pill ${
                              pg.generalPreference === 'Male'
                                ? 'bg-primary'
                                : pg.generalPreference === 'Female'
                                ? 'bg-pink'
                                : 'bg-secondary'
                            }`}
                          >
                            {pg.generalPreference}
                          </span>
                        </td>
                        <td>
                          <span
                              className={`badge rounded-pill ${
                              pg.availability == 'Available' ? 'bg-success' : 'bg-danger'
                            }`}
                          >
                            {pg.availability == 'Available' ? 'Available' : 'Not Available'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-primary btn-sm rounded-3"
                              onClick={() => handleEditRoom(pg)}
                              title="Edit"
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                            <button
                                className="btn btn-outline-danger btn-sm rounded-3"
                              onClick={() => handleDelete(pg.id)}
                              title="Delete"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                        <td>
                          <span
                              className={`badge rounded-pill ${
                              pg.registeredUser?.name == null ? 'bg-danger' : 'bg-success'
                            }`}
                          >
                            {pg.registeredUser?.name == null ? 'Vacant' : pg.registeredUser.name}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="mb-3">
                    <i className="fas fa-house text-muted" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="text-muted">No PGs registered yet</h5>
                <p className="text-muted">Start by adding your first PG property</p>
                  <button className="btn btn-primary rounded-3 shadow-sm mt-2" onClick={() => setActiveTab('form')} style={{ 
                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', 
                    border: 'none' 
                  }}>
                    <i className="fas fa-plus me-2"></i>Add Your First PG
                </button>
              </div>
            )}
          </div>
        </div>
      )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow-lg" style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' 
              }}>
                <div className="modal-header border-0" style={{ 
                  background: 'rgba(255,255,255,0.7)', 
                  backdropFilter: 'blur(8px)',
                  borderTopLeftRadius: '1.5rem',
                  borderTopRightRadius: '1.5rem'
                }}>
                  <h5 className="modal-title text-danger fw-bold">
                    <i className="fas fa-exclamation-triangle me-2"></i>Confirm Account Deletion
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <p>Are you sure you want to delete your account?</p>
                  <p className="text-danger">
                    <strong>This will permanently delete:</strong>
                  </p>
                  <ul>
                    <li>Your owner profile</li>
                    <li>All your PG listings</li>
                    <li>Your contact information</li>
                  </ul>
                  <p>This action cannot be undone.</p>
                </div>
                <div className="modal-footer border-0" style={{ 
                  background: 'rgba(255,255,255,0.7)', 
                  backdropFilter: 'blur(8px)',
                  borderBottomLeftRadius: '1.5rem',
                  borderBottomRightRadius: '1.5rem'
                }}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-3"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger rounded-3"
                    onClick={handleDeleteAccount}
                  >
                    <i className="fas fa-trash me-2"></i>Yes, Delete My Account
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

        {/* Lightbox */}
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
                  onClick={() =>
                    setLightbox({
                      ...lightbox,
                      currentIndex:
                        (lightbox.currentIndex - 1 + lightbox.images.length) % lightbox.images.length,
                    })
                  }
                >
                  
                </button>
                <button
                  className="lightbox-nav next"
                  onClick={() =>
                    setLightbox({
                      ...lightbox,
                      currentIndex: (lightbox.currentIndex + 1) % lightbox.images.length,
                    })
                  }
                >
                  
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
  
}

export default OwnerDashboard;