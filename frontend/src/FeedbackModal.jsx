import React, { useState } from 'react';

function FeedbackModal({ show, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleStarClick = (value) => setRating(value);
  const handleStarHover = (value) => setHover(value);
  const handleStarLeave = () => setHover(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, feedback });
    setRating(0);
    setFeedback('');
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{display: 'block', background: 'rgba(0,0,0,0.4)'}} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-warning">
            <span className="fs-5 fw-bold"><i className="fas fa-comment-dots me-2"></i>Welcome to PGVaale!</span>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body text-center">
              <p>We'd love to hear about your experience! Please take a moment to share your feedback.</p>
              <div className="mb-2">How would you rate your experience?</div>
              <div className="mb-1">
                {[1,2,3,4,5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="btn btn-link p-0 mx-1"
                    style={{fontSize: '2rem', color: (hover || rating) >= star ? '#ffc107' : '#ccc'}}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    tabIndex={-1}
                  >
                    <i className={((hover || rating) >= star) ? 'fas fa-star' : 'far fa-star'}></i>
                  </button>
                ))}
              </div>
              <div className="mb-2" style={{fontSize: '0.9em', color: '#888'}}>Click to rate</div>
              <div className="mb-3 text-start">
                <label className="form-label">Tell us more about your experience:</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Share your thoughts, suggestions, or any issues you've encountered..."
                  required
                />
              </div>
            </div>
            <div className="modal-footer justify-content-between">
              <button type="button" className="btn btn-light" onClick={onClose}>Skip for now</button>
              <button type="submit" className="btn btn-warning">Submit Feedback</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FeedbackModal; 