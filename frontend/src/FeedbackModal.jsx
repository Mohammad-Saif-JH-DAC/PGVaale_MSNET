import React, { useState } from 'react';
import PropTypes from 'prop-types';

function FeedbackModal({ show, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  // Check if user is authenticated
  const token = sessionStorage.getItem('token');
  const isAuthenticated = !!token;

  const emojiMap = {
    1: { icon: '😠', label: 'Very Bad' },
    2: { icon: '😞', label: 'Bad' },
    3: { icon: '😐', label: 'Okay' },
    4: { icon: '🙂', label: 'Good' },
    5: { icon: '😄', label: 'Excellent' },
  };

  const handleClick = (value) => setRating(value);
  const handleHover = (value) => setHover(value);
  const handleLeave = () => setHover(0);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isAuthenticated) {
    alert('Please log in to submit feedback.');
    onClose();
    return;
  }

  try {
    const response = await fetch('http://localhost:8081/api/feedback-web', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, feedback }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Success:', result);
      onSubmit({ rating, feedback });
      setRating(0);
      setFeedback('');
      onClose();
    } else {
      const error = await response.json();
      console.error('Submission failed:', error);
      alert('Failed to submit feedback.');
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Could not connect to server. Is it running?');
  }
};

  if (!show) return null;

  return (
    <div
      className="modal show"
      style={{ display: 'block', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
      tabIndex="-1"
      onClick={(e) => {
        if (e.target.className.includes('modal')) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', boxShadow: '0 8px 32px rgba(44,62,80,0.12)' }}>
          <div className="modal-header border-0" style={{ borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
            <span className="fs-5 fw-bold" style={{ color: '#2C3E50' }}>
              <i className="fas fa-comment-dots me-2 text-primary"></i>Welcome to PGVaale!
            </span>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          {!isAuthenticated ? (
            <div className="modal-body text-center">
              <div className="mb-3">
                <i className="fas fa-lock text-warning" style={{fontSize: '3rem'}}></i>
              </div>
              <h5>Login Required</h5>
              <p>Please log in to submit feedback and help us improve our services.</p>
              <div className="d-grid gap-2">
                <button 
                  type="button" 
                  className="btn btn-primary rounded-3"
                  style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', border: 'none' }}
                  onClick={() => {
                    onClose();
                    window.location.href = '/login';
                  }}
                >
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Go to Login
                </button>
                <button type="button" className="btn btn-outline-secondary rounded-3" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body text-center">
                <p className="mb-3">We'd love to hear about your experience! Please take a moment to share your feedback.</p>
                <div className="mb-2 fw-semibold" style={{ color: '#4F46E5' }}>How did we make you feel?</div>
                <div className="mb-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      type="button"
                      key={value}
                      className="btn btn-link p-0 mx-2"
                      style={{
                        fontSize: '2.2rem',
                        opacity: (hover || rating) === value ? 1 : 0.5,
                        transform: (hover || rating) === value ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.2s',
                        textShadow: (hover || rating) === value ? '0 2px 8px #6366F1' : 'none',
                      }}
                      onClick={() => handleClick(value)}
                      onMouseEnter={() => handleHover(value)}
                      onMouseLeave={handleLeave}
                      title={emojiMap[value].label}
                      tabIndex={-1}
                    >
                      {emojiMap[value].icon}
                    </button>
                  ))}
                </div>
                {hover !== 0 || rating !== 0 ? (
                  <div className="mb-3 fw-semibold" style={{ fontSize: '0.95em', color: '#6366F1' }}>
                    {(hover ? emojiMap[hover] : emojiMap[rating]).label}
                  </div>
                ) : (
                  <div className="mb-3" style={{ fontSize: '0.9em', color: '#888' }}>Click an emoji to rate</div>
                )}
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold" style={{ color: '#374151' }}>Tell us more about your experience:</label>
                  <textarea
                    className="form-control rounded-3 shadow-sm"
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or any issues you've encountered..."
                    required
                    style={{ background: '#f8fafc', border: 'none' }}
                  />
                </div>
              </div>
              <div className="modal-footer border-0" style={{ borderBottomLeftRadius: '1.5rem', borderBottomRightRadius: '1.5rem', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
                <button type="button" className="btn btn-outline-primary rounded-3 px-4" onClick={onClose}>
                  Skip for now
                </button>
                <button type="submit" className="btn btn-primary rounded-3 px-4" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', border: 'none' }}>
                  <i className="fas fa-paper-plane me-2"></i>Submit Feedback
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

FeedbackModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FeedbackModal;
