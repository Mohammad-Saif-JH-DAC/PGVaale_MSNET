import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';

const socialLinks = [
  { href: 'https://facebook.com', icon: 'fab fa-facebook-f', label: 'Facebook' },
  { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
  { href: 'https://instagram.com', icon: 'fab fa-instagram', label: 'Instagram' },
  { href: 'https://linkedin.com', icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
  { href: 'https://youtube.com', icon: 'fab fa-youtube', label: 'YouTube' },
  { href: 'https://wa.me/1234567890', icon: 'fab fa-whatsapp', label: 'WhatsApp' },
];

// Helper to decode JWT and get user role
function getUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role) return payload.role.replace('ROLE_', '').toLowerCase();
    if (payload.authorities && payload.authorities.length > 0) return payload.authorities[0].authority.replace('ROLE_', '').toLowerCase();
  } catch {}
  return null;
}

function Footer() {
  const [showFeedback, setShowFeedback] = useState(false);
  const userRole = getUserRole();

  const handleFeedbackSubmit = (data) => {
    setShowFeedback(false);
    alert('Thank you for your feedback!');
    // You can send data to backend here
  };

  return (
    <footer className="bg-dark text-light py-2 mt-auto" style={{position: 'relative', bottom: 0, width: '100%', fontSize: '0.95rem'}}>
      <FeedbackModal show={showFeedback} onClose={() => setShowFeedback(false)} onSubmit={handleFeedbackSubmit} />
      <div className="container">
        <div className="row align-items-center text-center text-md-start">
          {/* PGVaale Column */}
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <h6 className="fw-bold text-warning mb-1" style={{fontSize: '1rem'}}>PGVaale</h6>
            <div style={{fontSize: '0.95em'}}>
              <i className="fas fa-envelope me-2"></i>
              <a href="mailto:support@pgvaale.com" className="text-light text-decoration-none">support@pgvaale.com</a>
            </div>
          </div>
          {/* Quick Links Column */}
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <h6 className="fw-bold text-warning mb-1" style={{fontSize: '1rem'}}>Quick Links</h6>
            <ul className="list-unstyled mb-0" style={{fontSize: '0.95em'}}>
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/about" className="text-light text-decoration-none">About Us</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
              <li><a href="/privacy" className="text-light text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>
          {/* Services Column */}
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <h6 className="fw-bold text-warning mb-1" style={{fontSize: '1rem'}}>Services</h6>
            <ul className="list-unstyled mb-0" style={{fontSize: '0.95em'}}>
              <li><a href="/pgrooms" className="text-light text-decoration-none">PG Rooms</a></li>
              <li><a href="/tiffin-dashboard" className="text-light text-decoration-none">Tiffin Service</a></li>
              <li><a href="/maid-dashboard" className="text-light text-decoration-none">Maid Service</a></li>
              {userRole === 'owner' && (
                <li><a href="/owner-dashboard" className="text-light text-decoration-none">Owner Dashboard</a></li>
              )}
            </ul>
          </div>
          {/* Social Media Column */}
          <div className="col-6 col-md-2 mb-2 mb-md-0">
            <h6 className="fw-bold text-warning mb-1" style={{fontSize: '1rem'}}>Connect</h6>
            <div className="mb-1" style={{fontSize: '0.95em', color: '#bbb'}}>Follow us:</div>
            <div>
              {socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light fs-4 me-3"
                  aria-label={link.label}
                  style={{verticalAlign: 'middle'}}
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </div>
          {/* Feedback Button Column */}
          <div className="col-6 col-md-1 text-md-end text-center">
            <button
              className="btn btn-outline-warning btn-sm"
              style={{fontSize: '0.95em'}}
              onClick={() => setShowFeedback(true)}
            >
              Feedback
            </button>
          </div>
        </div>
        <hr className="border-secondary my-2" />
        <div className="text-center" style={{fontSize: '0.85rem'}}>
          &copy; {new Date().getFullYear()} PGVaale. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer; 