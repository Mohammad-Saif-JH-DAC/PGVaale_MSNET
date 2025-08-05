import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

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

  // Handle booking room
  const handleBookRoom = async (roomId) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert('Please log in to send interest.');
      return;
    }

    setBookingStatus((prev) => ({ ...prev, [roomId]: 'booking' }));

    try {
      await api.post('/api/room-interests', { roomId, message: 'Interested in this PG room' });
      setBookingStatus((prev) => ({ ...prev, [roomId]: 'booked' }));
    } catch (error) {
      console.error('Booking failed:', error);
      setBookingStatus((prev) => ({ ...prev, [roomId]: 'error' }));
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setBookingStatus((prev) => ({ ...prev, [roomId]: null }));
    }, 3000);
  };

  // Image Gallery with Auto-Slideshow
  const ImageGallery = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (!images || images.length <= 1) return;
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [images]);

    if (!images || images.length === 0) {
      return (
        <div className="no-images-placeholder text-center text-muted p-3 border rounded bg-light">
          <i className="bi bi-image" style={{ fontSize: '2rem' }}></i>
          <p className="mb-0 mt-2">No images available</p>
        </div>
      );
    }

    const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
      <div className="position-relative">
        <img
  src={images[currentIndex]}
  alt="PG Room"
  className="w-100 shadow-sm"
  style={{ height: '200px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', transition: 'transform 0.3s ease-in-out' }}
  onClick={() => window.open(images[currentIndex], '_blank')}
/>

        {images.length > 1 && (
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
              {images.map((_, idx) => (
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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Available PG Rooms</h2>
        <button className="btn btn-outline-primary" onClick={() => fetchRooms()}>
          🔄 Refresh
        </button>
      </div>

      {/* Info Alert for Guests */}
      {!localStorage.getItem('token') && !sessionStorage.getItem('token') && (
        <div className="alert alert-info mb-4">
          <strong>💡 Tip:</strong> <Link to="/login">Log in</Link> to send interest and chat with owners!
        </div>
      )}

      {/* Filters */}
      <form className="row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label">Region</label>
          <select
            className="form-select"
            name="region"
            value={filters.region}
            onChange={handleChange}
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
          <label className="form-label">Preference</label>
          <select
            className="form-select"
            name="generalPreference"
            value={filters.generalPreference}
            onChange={handleChange}
          >
            <option value="">Default</option>
            {preferenceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Availability</label>
          <select
            className="form-select"
            name="availability"
            value={filters.availability}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="available">Available Only</option>
          </select>
        </div>
      </form>

      {/* Room List */}
      {rooms.length > 0 ? (
        <div className="row g-4">
          {rooms.map((room) => (
            <div key={room.id} className="col-md-6 col-lg-4">
              <div className="card shadow h-100 border-0">
                <ImageGallery images={room.imagePaths || []} />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">PG #{room.id}</h5>
                  <p className="card-text flex-grow-1">
                    <strong>Region:</strong> {room.region || 'N/A'}<br />
                    <strong>Rent:</strong> ₹{room.rent}/month<br />
                    <strong>Preference:</strong> {room.generalPreference || 'Any'}<br />
                    <strong>Amenities:</strong> {room.amenities || 'N/A'}<br />
                    <strong>Nearby:</strong> {room.nearbyResources || 'N/A'}
                  </p>

                  <MapComponent
                    lat={room.latitude}
                    lng={room.longitude}
                    region={room.region}
                  />

                  <div className="mt-3 d-flex justify-content-between">
                    <Link to={`/pgrooms/${room.id}`} className="btn btn-sm btn-primary">
                      View Details
                    </Link>
                    {localStorage.getItem('token') || sessionStorage.getItem('token') ? (
                      <button
                        className={`btn btn-sm ${
                          bookingStatus[room.id] === 'booking'
                            ? 'btn-warning'
                            : bookingStatus[room.id] === 'booked'
                            ? 'btn-success'
                            : bookingStatus[room.id] === 'error'
                            ? 'btn-danger'
                            : 'btn-outline-success'
                        }`}
                        onClick={() => handleBookRoom(room.id)}
                        disabled={bookingStatus[room.id] === 'booking'}
                      >
                        {bookingStatus[room.id] === 'booking'
                          ? 'Sending...'
                          : bookingStatus[room.id] === 'booked'
                          ? 'Sent!'
                          : bookingStatus[room.id] === 'error'
                          ? 'Failed'
                          : 'Send Interest'}
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => alert('Please log in to send interest.')}
                      >
                        Send Interest
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center">
          <div className="card-body">
            <h5>No PG rooms found</h5>
            <p className="text-muted">Try adjusting your filters or check back later.</p>
            <button className="btn btn-primary" onClick={() => setFilters({ region: '', generalPreference: '', availability: '' })}>
              Clear Filters
            </button>
          </div>
        </div>
      )}
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