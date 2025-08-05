import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../api';
import MapComponent from '../pages/MapComponent';
import 'leaflet/dist/leaflet.css';

function RoomDetailsModal({ show, onClose, room }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [interestMsg, setInterestMsg] = useState('');
  const [interestSuccess, setInterestSuccess] = useState('');

  // Get user info for interest functionality
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  let username = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload.sub || payload.username || '';
    } catch (e) {
      console.error('Failed to decode token:', e);
    }
  }

  // Reset image index when room changes
  useEffect(() => {
    if (show && room) {
      setCurrentImageIndex(0);
    }
  }, [show, room]);

  // Handle sending interest
  const handleInterest = async (e) => {
    e.preventDefault();
    setInterestSuccess('');
    try {
      await api.post('/api/room-interests', {
        roomId: room.id,
        username,
        message: interestMsg,
      });
      setInterestSuccess('Interest/request sent successfully!');
      setInterestMsg('');
    } catch (error) {
      console.error('Error sending interest:', error);
      setInterestSuccess('Failed to send request. Please try again.');
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
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">PG Room #{room.id}</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {/* Images Section */}
              <div className="col-md-6 mb-4">
                <h6 className="mb-3">📸 Images</h6>
                {normalizedImages.length > 0 ? (
                  <div className="position-relative">
                    <div className="card">
                      <img
                        src={normalizedImages[currentImageIndex]}
                        alt={`Room ${currentImageIndex + 1}`}
                        className="card-img-top"
                        style={{ height: '300px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.png';
                        }}
                      />
                      {normalizedImages.length > 1 && (
                        <>
                          <button
                            className="btn btn-dark btn-sm position-absolute top-50 start-0 translate-middle-y ms-2"
                            onClick={prevImage}
                            style={{ opacity: 0.8 }}
                          >
                            ‹
                          </button>
                          <button
                            className="btn btn-dark btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                            onClick={nextImage}
                            style={{ opacity: 0.8 }}
                          >
                            ›
                          </button>
                          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                            <span className="badge bg-dark">
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
                              border: index === currentImageIndex ? '2px solid #0d6efd' : '1px solid #dee2e6',
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
                  <div className="alert alert-info">
                    <i className="bi bi-image"></i> No images available for this room.
                  </div>
                )}
              </div>

              {/* Room Information */}
              <div className="col-md-6 mb-4">
                <h6 className="mb-3">🏠 Room Information</h6>
                <div className="card">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <strong>Region:</strong>
                        <p className="mb-2">{room.region || 'N/A'}</p>
                      </div>
                      <div className="col-sm-6">
                        <strong>Rent:</strong>
                        <p className="mb-2 text-success fw-bold">₹{room.rent}/month</p>
                      </div>
                      <div className="col-sm-6">
                        <strong>Preference:</strong>
                        <p className="mb-2">{room.generalPreference || 'Any'}</p>
                      </div>
                      <div className="col-sm-6">
                        <strong>Availability:</strong>
                        <p className="mb-2">
                          <span
                            className={`badge ${
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
                        <strong>Amenities:</strong>
                        <p className="mb-2">{room.amenities || 'N/A'}</p>
                      </div>
                      <div className="col-12">
                        <strong>Nearby:</strong>
                        <p className="mb-2">{room.nearbyResources || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="col-12 mb-4">
                <h6 className="mb-3">📍 Location</h6>
                <div style={{ height: '300px' }}>
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
                  <h6 className="mb-3">💌 Send Interest</h6>
                  <div className="card">
                    <div className="card-body">
                      {interestSuccess && (
                        <div
                          className={`alert ${
                            interestSuccess.includes('successfully') ? 'alert-success' : 'alert-danger'
                          }`}
                        >
                          {interestSuccess}
                        </div>
                      )}
                      <form onSubmit={handleInterest}>
                        <div className="mb-3">
                          <label htmlFor="interestMessage" className="form-label">
                            Message to Owner:
                          </label>
                          <textarea
                            id="interestMessage"
                            className="form-control"
                            rows="3"
                            value={interestMsg}
                            onChange={(e) => setInterestMsg(e.target.value)}
                            placeholder="Write a message to express your interest in this room..."
                            required
                          ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">
                          Send Interest
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-12">
                  <div className="alert alert-info">
                    <strong>💡 Tip:</strong> Please{' '}
                    <a href="/login" className="alert-link">
                      log in
                    </a>{' '}
                    to send interest to the owner.
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Close
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