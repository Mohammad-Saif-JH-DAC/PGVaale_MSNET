import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import RoomDetailsModal from '../components/RoomDetailsModal';

// Fix for Leaflet default icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function PGRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: '',
    generalPreference: '',
    availability: '',
  });
  const [bookingStatus, setBookingStatus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch rooms (with or without filters)
  const fetchRooms = async (filterParams = filters) => {
    try {
      let url = '/api/pg/all';
      const queryParams = [];

      if (filterParams.region) queryParams.push(`region=${encodeURIComponent(filterParams.region)}`);
      if (filterParams.generalPreference)
        queryParams.push(`generalPreference=${encodeURIComponent(filterParams.generalPreference)}`);
      if (filterParams.availability === 'available') queryParams.push('availability=true');

      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
      }

      const res = await api.get(url);
      setRooms(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching or searching rooms:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Load all rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle filter input change and auto-search
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    setLoading(true);
    fetchRooms(updatedFilters);
  };

  // Handle opening room details modal
  const handleViewDetails = (room) => {
    console.log('Selected Room:', room);
    setSelectedRoom(room);
    setShowModal(true);
  };

  // Handle closing room details modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  // Handle booking room
  const handleBookRoom = async (roomId) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Please log in to book PG.');
      return;
    }

    setBookingStatus((prev) => ({ ...prev, [roomId]: 'booking' }));

    try {
      // Call the new PG booking endpoint that updates user_id and availability
      await api.post(`/api/pg/${roomId}/book`);
      setBookingStatus((prev) => ({ ...prev, [roomId]: 'booked' }));
      
      // Refresh the rooms list to show updated availability
      fetchRooms();
    } catch (error) {
      console.error('Booking failed:', error);
      const errorMessage = error.response?.data || 'Booking failed';
      alert(errorMessage);
      setBookingStatus((prev) => ({ ...prev, [roomId]: 'failed' }));
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setBookingStatus((prev) => ({ ...prev, [roomId]: null }));
    }, 5000);
  };

  // Image Gallery with Auto-Slideshow
  const ImageGallery = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    // Normalize image URLs
    const normalizedImages = (images || []).map((img) => {
      if (!img || typeof img !== 'string') return '/placeholder.png'; // Fallback to placeholder
      const trimmed = img.trim();
  
      // If it's already a full URL (http/https)
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
      }
  
      // If it's a relative path (starts with /)
      if (trimmed.startsWith('/')) {
        return `${window.location.origin}${trimmed}`; // Convert to absolute URL
      }
  
      // If it's a partial path without protocol
      if (!trimmed.startsWith('http')) {
        return `http://${trimmed}`; // Only use if you're sure about domain
      }
  
      return trimmed;
    });
  
    useEffect(() => {
      if (!normalizedImages || normalizedImages.length <= 1) return;
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [normalizedImages]);
  
    if (!normalizedImages || normalizedImages.length === 0) {
      return (
        <div className="no-images-placeholder text-center text-muted p-3 border rounded bg-light">
          <i className="bi bi-image" style={{ fontSize: '2rem' }}></i>
          <p className="mb-0 mt-2">No images available</p>
        </div>
      );
    }
  
    const next = () => setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  
    return (
      <div className="position-relative">
        <img
          src={normalizedImages[currentIndex]}
          alt="PG Room"
          className="w-100 shadow-sm"
          style={{
            height: '200px',
            objectFit: 'cover',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out',
          }}
          onClick={() => window.open(normalizedImages[currentIndex], '_blank')}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.png'; // Fallback to placeholder on error
          }}
        />
        {normalizedImages.length > 1 && (
          <>
            <button
              className="carousel-control prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              style={controlStyle}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="carousel-control next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              style={controlStyle}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
            <div className="carousel-indicators d-flex justify-content-center mt-2">
              {normalizedImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`indicator mx-1 ${idx === currentIndex ? 'active' : ''}`}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: idx === currentIndex ? '#0d6efd' : '#ddd',
                    cursor: 'pointer',
                    display: 'inline-block',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Map Component
  const MapComponent = ({ lat, lng, region }) => {
    const isValid = lat && lng && !isNaN(lat) && !isNaN(lng);
    if (!isValid) return <div className="alert alert-warning">Location not available</div>;

    const position = [parseFloat(lat), parseFloat(lng)];

    return (
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '180px', borderRadius: '8px', border: '1px solid #ddd' }}
        dragging={false}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>{region}</Popup>
        </Marker>
      </MapContainer>
    );
  };

  const regionOptions = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad'];
  const preferenceOptions = ['Male', 'Female', 'Any'];

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading PG rooms...</p>
      </div>
    );
  }

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
            Find Your Perfect <span className="text-primary">PG Room</span>
          </h1>
          <p className="lead text-muted mb-4">
            Discover comfortable accommodations with modern amenities and great locations
          </p>
      </div>

      {/* Info Alert for Guests */}
      {!sessionStorage.getItem('token') && (
          <div className="alert alert-info border-0 rounded-4 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '1px solid #93c5fd' }}>
            <div className="d-flex align-items-center">
              <i className="fas fa-lightbulb text-primary me-3" style={{ fontSize: '1.5rem' }}></i>
              <div>
                <strong>💡 Pro Tip:</strong> <Link to="/login" className="text-decoration-none fw-bold" style={{ color: '#4F46E5' }}>Log in</Link> to book PG and chat with owners!
              </div>
            </div>
        </div>
      )}

        {/* Enhanced Filters */}
        <div className="card border-0 shadow-lg rounded-4 mb-5" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>
              <i className="fas fa-filter text-primary me-2"></i>Filter Options
            </h5>
            <form className="row g-3">
        <div className="col-md-3">
                <label className="form-label fw-semibold" style={{ color: '#374151' }}>Region</label>
          <select
                  className="form-select border-0 shadow-sm rounded-3"
            name="region"
            value={filters.region}
            onChange={handleChange}
                  style={{ background: '#f8fafc' }}
          >
            <option value="">All Regions</option>
            {regionOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
                <label className="form-label fw-semibold" style={{ color: '#374151' }}>Preference</label>
          <select
                  className="form-select border-0 shadow-sm rounded-3"
            name="generalPreference"
            value={filters.generalPreference}
            onChange={handleChange}
                  style={{ background: '#f8fafc' }}
          >
                  <option value="">Any Preference</option>
            {preferenceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
                <label className="form-label fw-semibold" style={{ color: '#374151' }}>Availability</label>
          <select
                  className="form-select border-0 shadow-sm rounded-3"
            name="availability"
            value={filters.availability}
            onChange={handleChange}
                  style={{ background: '#f8fafc' }}
          >
                  <option value="">All Rooms</option>
            <option value="available">Available Only</option>
          </select>
        </div>

              <div className="col-md-3 d-flex align-items-end">
                <button 
                  className="btn btn-primary w-100 rounded-3 shadow-sm" 
                  onClick={() => fetchRooms()}
                  style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', border: 'none' }}
                >
                  <i className="fas fa-sync-alt me-2"></i>Refresh
                </button>
              </div>
      </form>
          </div>
        </div>

      {/* Room List */}
      {rooms.length > 0 ? (
        <div className="row g-4">
          {rooms.map((room) => (
            <div key={room.id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-lg h-100 rounded-4 overflow-hidden" style={{ 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}>
                <ImageGallery images={room.imagePaths || []} />

                  <div className="card-body d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title fw-bold mb-0" style={{ color: '#2C3E50' }}>
                        PG #{room.id}
                      </h5>
                      <span className="badge bg-primary rounded-pill px-3 py-2" style={{ 
                        background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' 
                      }}>
                        ₹{room.rent}/month
                      </span>
                    </div>
                    
                    <div className="flex-grow-1">
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-map-marker-alt text-primary me-2"></i>
                            <span className="text-muted small">{room.region || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-users text-primary me-2"></i>
                            <span className="text-muted small">{room.generalPreference || 'Any'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h6 className="fw-semibold mb-2" style={{ color: '#374151' }}>
                          <i className="fas fa-star text-warning me-2"></i>Amenities
                        </h6>
                        <p className="text-muted small mb-0">{room.amenities || 'N/A'}</p>
                      </div>
                      
                      <div className="mb-3">
                        <h6 className="fw-semibold mb-2" style={{ color: '#374151' }}>
                          <i className="fas fa-location-arrow text-info me-2"></i>Nearby
                        </h6>
                        <p className="text-muted small mb-0">{room.nearbyResources || 'N/A'}</p>
                      </div>
                    </div>

                  <MapComponent
                    lat={room.latitude}
                    lng={room.longitude}
                    region={room.region}
                  />

                    <div className="mt-4 d-flex gap-2">
                    <button 
                        className="btn btn-outline-primary flex-grow-1 rounded-3"
                      onClick={() => handleViewDetails(room)}
                        style={{ borderColor: '#6366F1', color: '#6366F1' }}
                    >
                        <i className="fas fa-eye me-2"></i>View Details
                    </button>
                    {sessionStorage.getItem('token') ? (
                      <button
                          className={`btn flex-grow-1 rounded-3 ${
                          bookingStatus[room.id] === 'booking'
                            ? 'btn-warning'
                            : bookingStatus[room.id] === 'booked'
                            ? 'btn-success'
                            : bookingStatus[room.id] === 'error'
                            ? 'btn-danger'
                              : 'btn-primary'
                        }`}
                        onClick={() => handleBookRoom(room.id)}
                        disabled={bookingStatus[room.id] === 'booking'}
                          style={bookingStatus[room.id] === 'booked' ? {} : {
                            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                            border: 'none'
                          }}
                        >
                          {bookingStatus[room.id] === 'booking' ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2"></i>Sending...
                            </>
                          ) : bookingStatus[room.id] === 'booked' ? (
                            <>
                              <i className="fas fa-check me-2"></i>Sent!
                            </>
                          ) : bookingStatus[room.id] === 'error' ? (
                            <>
                              <i className="fas fa-times me-2"></i>Failed
                            </>
                          ) : (
                            <>
                              <i className="fas fa-heart me-2"></i>Book PG
                            </>
                          )}
                      </button>
                    ) : (
                      <button
                          className="btn btn-outline-secondary flex-grow-1 rounded-3"
                        onClick={() => alert('Please log in to book PG.')}
                      >
                          <i className="fas fa-heart me-2"></i>book PG
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
          <div className="card border-0 shadow-lg rounded-4 text-center" style={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)' 
          }}>
            <div className="card-body p-5">
              <i className="fas fa-search text-muted mb-3" style={{ fontSize: '3rem' }}></i>
              <h5 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>No PG rooms found</h5>
              <p className="text-muted mb-4">Try adjusting your filters or check back later for new listings.</p>
              <button 
                className="btn btn-primary rounded-3 px-4"
                onClick={() => setFilters({ region: '', generalPreference: '', availability: '' })}
                style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', border: 'none' }}
              >
                <i className="fas fa-times me-2"></i>Clear Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Room Details Modal */}
      <RoomDetailsModal
        show={showModal}
        onClose={handleCloseModal}
        room={selectedRoom}
      />
      </div>
    </div>
  );
}

// Inline styles
const controlStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.5)',
  border: 'none',
  color: 'white',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 10,
};

export default PGRooms;