import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../api';
import MapComponent from '../pages/MapComponent';
import 'leaflet/dist/leaflet.css';

function RoomDetailsModal({ show, onClose, room }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [interestMsg, setInterestMsg] = useState('');
  const [interestSuccess, setInterestSuccess] = useState('');

  // Check if user is authenticated for interest functionality
  const token = sessionStorage.getItem('token');
  const isAuthenticated = !!token;

  // Reset image index when room changes
  useEffect(() => {
    if (show && room) {
      setCurrentImageIndex(0);
    }
  }, [show, room]);

  // Handle booking PG
  const handleInterest = async (e) => {
    e.preventDefault();
    setInterestSuccess('');
    try {
      await api.post(`/api/pg/${room.id}/book`);
      setInterestSuccess('PG booked successfully! This room is now reserved for you.');
      setInterestMsg('');
      
      // Close modal after successful booking
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error booking PG:', error);
      const errorMessage = error.response?.data || 'Failed to book PG. Please try again.';
      setInterestSuccess(errorMessage);
    }
  };

  // Handle image navigation
  const nextImage = () => {
    if (room?.imagePaths?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % room.imagePaths.length);
    }
  };

  const prevImage = () => {
    if (room?.imagePaths?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + room.imagePaths.length) % room.imagePaths.length);
    }
  };

  // Close modal and reset state
  const handleClose = () => {
    setInterestMsg('');
    setInterestSuccess('');
    setCurrentImageIndex(0);
    onClose();
  };

  if (!show || !room) return null;

  // Normalize image URLs
  const normalizedImages = (room.imagePaths || []).map((img) => {
    if (!img || typeof img !== 'string') return '/placeholder.png';
    const trimmed = img.trim();
    if (trimmed === '') return '/placeholder.png';

    // If already absolute URL
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    // If relative path (starts with /)
    if (trimmed.startsWith('/')) {
      return `${window.location.origin.replace(':3000', ':8080')}${trimmed}`;
    }

    // Fallback
    return `https://${trimmed}`;
  });

  return (
    <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content border-0 rounded-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', boxShadow: '0 8px 32px rgba(44,62,80,0.12)' }}>
          <div className="modal-header border-0" style={{ borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
            <h5 className="modal-title fw-bold" style={{ color: '#2C3E50' }}>
              <i className="fas fa-bed text-primary me-2"></i>PG Room #{room.id}
            </h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {/* Images Section */}
              <div className="col-md-6 mb-4">
                <h6 className="mb-3 fw-bold" style={{ color: '#4F46E5' }}><i className="fas fa-images me-2"></i>Images</h6>
                {normalizedImages.length > 0 ? (
                  <div className="position-relative">
                    <div className="card border-0 shadow rounded-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.85)' }}>
                      <img
                        src={normalizedImages[currentImageIndex]}
                        alt={`Room ${currentImageIndex + 1}`}
                        className="card-img-top"
                        style={{ height: '300px', objectFit: 'cover', borderRadius: '1rem 1rem 0 0' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.png';
                        }}
                      />
                      {normalizedImages.length > 1 && (
                        <>
                          <button
                            className="btn btn-primary btn-sm position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle shadow"
                            onClick={prevImage}
                            style={{ opacity: 0.85 }}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                          <button
                            className="btn btn-primary btn-sm position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle shadow"
                            onClick={nextImage}
                            style={{ opacity: 0.85 }}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                            <span className="badge bg-primary rounded-pill px-3 py-2">
                              {currentImageIndex + 1} / {normalizedImages.length}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    {/* Thumbnails */}
                    {normalizedImages.length > 1 && (
                      <div className="d-flex gap-2 mt-2 overflow-auto" style={{ maxHeight: '80px' }}>
                        {normalizedImages.map((src, index) => (
                          <img
                            key={index}
                            src={src}
                            alt={`Thumb ${index + 1}`}
                            className={`img-thumbnail ${index === currentImageIndex ? 'border-primary' : ''}`}
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              cursor: 'pointer',
                              border: index === currentImageIndex ? '2px solid #6366F1' : '1px solid #dee2e6',
                              borderRadius: '0.75rem',
                            }}
                            onClick={() => setCurrentImageIndex(index)}
                            onError={(e) => {
                              e.target.src = '/placeholder.png';
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="alert alert-info rounded-4 shadow-sm">
                    <i className="fas fa-image me-2"></i> No images available for this room.
                  </div>
                )}
              </div>

              {/* Room Information */}
              <div className="col-md-6 mb-4">
                <h6 className="mb-3 fw-bold" style={{ color: '#4F46E5' }}><i className="fas fa-info-circle me-2"></i>Room Information</h6>
                <div className="card border-0 shadow rounded-4" style={{ background: 'rgba(255,255,255,0.85)' }}>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <strong><i className="fas fa-map-marker-alt text-primary me-2"></i>Region:</strong>
                        <p className="mb-2">{room.region || 'N/A'}</p>
                      </div>
                      <div className="col-sm-6">
                        <strong><i className="fas fa-rupee-sign text-success me-2"></i>Rent:</strong>
                        <p className="mb-2 text-success fw-bold">₹{room.rent}/month</p>
                      </div>
                      <div className="col-sm-6">
                        <strong><i className="fas fa-users text-info me-2"></i>Preference:</strong>
                        <p className="mb-2">{room.generalPreference || 'Any'}</p>
                      </div>
                      <div className="col-sm-6">
                        <strong><i className="fas fa-check-circle text-warning me-2"></i>Availability:</strong>
                        <p className="mb-2">
                          <span
                            className={`badge px-3 py-2 rounded-pill ${
                              room.availability === 'Available' || room.availability === true
                                ? 'bg-success'
                                : 'bg-danger'
                            }`}
                          >
                            {room.availability === 'Available' || room.availability === true
                              ? 'Available'
                              : 'Not Available'}
                          </span>
                        </p>
                      </div>
                      <div className="col-12">
                        <strong><i className="fas fa-star text-warning me-2"></i>Amenities:</strong>
                        <p className="mb-2">{room.amenities || 'N/A'}</p>
                      </div>
                      <div className="col-12">
                        <strong><i className="fas fa-location-arrow text-info me-2"></i>Nearby:</strong>
                        <p className="mb-2">{room.nearbyResources || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="col-12 mb-4">
                <h6 className="mb-3 fw-bold" style={{ color: '#4F46E5' }}><i className="fas fa-map-marked-alt me-2"></i>Location</h6>
                <div className="rounded-4 shadow-sm overflow-hidden" style={{ height: '300px', background: '#e0e7ff' }}>
                  <MapComponent
                    lat={room.latitude}
                    lng={room.longitude}
                    region={room.region}
                  />
                </div>
              </div>

              {/* Interest Form */}
              {token ? (
                <div className="col-12">
                  <h6 className="mb-3 fw-bold" style={{ color: '#4F46E5' }}><i className="fas fa-envelope me-2"></i>Send Interest</h6>
                  <div className="card border-0 shadow rounded-4" style={{ background: 'rgba(255,255,255,0.85)' }}>
                    <div className="card-body">
                      {interestSuccess && (
                        <div
                          className={`alert rounded-4 shadow-sm ${
                            interestSuccess.includes('successfully') ? 'alert-success' : 'alert-danger'
                          }`}
                        >
                          {interestSuccess}
                        </div>
                      )}
                      <form onSubmit={handleInterest}>
                        <div className="mb-3">
                          <label htmlFor="interestMessage" className="form-label fw-semibold" style={{ color: '#374151' }}>
                            Message to Owner:
                          </label>
                          <textarea
                            id="interestMessage"
                            className="form-control rounded-3 shadow-sm"
                            rows="3"
                            value={interestMsg}
                            onChange={(e) => setInterestMsg(e.target.value)}
                            placeholder="Write a message to express your interest in this room..."
                            required
                          ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary rounded-3 px-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', border: 'none' }}>
                          <i className="fas fa-paper-plane me-2"></i>Send Interest
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-12">
                  <div className="alert alert-info rounded-4 shadow-sm">
                    <strong>💡 Tip:</strong> Please{' '}
                    <a href="/login" className="alert-link text-primary fw-bold">
                      log in
                    </a>{' '}
                    to send interest to the owner.
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer border-0" style={{ borderBottomLeftRadius: '1.5rem', borderBottomRightRadius: '1.5rem', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
            <button type="button" className="btn btn-outline-primary rounded-3 px-4" onClick={handleClose}>
              <i className="fas fa-times me-2"></i>Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

RoomDetailsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  room: PropTypes.object,
};

export default RoomDetailsModal;