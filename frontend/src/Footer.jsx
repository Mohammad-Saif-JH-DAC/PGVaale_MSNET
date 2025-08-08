import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';
import '@fortawesome/fontawesome-free/css/all.min.css';


const socialLinks = [
  { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter', href: 'https://x.com/MeanderingNinja' },
  { href: 'https://instagram.com', icon: 'fab fa-instagram', label: 'Instagram', href: 'https://www.instagram.com/precocious_warrior' },
  { href: 'https://linkedin.com', icon: 'fab fa-linkedin-in', label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohammadsaif25' },
];

// Helper to decode JWT and get user role
function getUserRole() {
  const token = sessionStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role) return payload.role.replace('ROLE_', '').toLowerCase();
    if (payload.authorities && payload.authorities.length > 0)
      return payload.authorities[0].authority.replace('ROLE_', '').toLowerCase();
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
    <footer
      className="text-dark py-2 mt-auto"
      style={{ background: 'linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%)', borderTop: '4px solid #6366F1', borderRadius: '1.5rem 1.5rem 0 0', boxShadow: '0 -2px 12px rgba(44,62,80,0.07)', position: 'relative', bottom: 0, width: '100%', fontSize: '0.95rem' }}
    >
      <FeedbackModal show={showFeedback} onClose={() => setShowFeedback(false)} onSubmit={handleFeedbackSubmit} />
      <div className="container">
        <div className="row align-items-center text-center text-md-start">
          {/* PGVaale Column */}
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <h6 className="fw-bold mb-1" style={{ fontSize: '1.1rem', color: '#4F46E5' }}>
              <i className="fas fa-home me-2" style={{ color: '#6366F1' }}></i>PGVaale
            </h6>
            <div style={{ fontSize: '0.95em', color: '#6366F1' }}>
              <i className="fas fa-envelope me-2"></i>
              <a href="mailto:support@pgvaale.com" className="text-decoration-none" style={{ color: '#4F46E5' }}>support@pgvaale.com</a>
            </div>
          </div>
          {/* Quick Links Column */}
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <h6 className="fw-bold mb-1" style={{ fontSize: '1.1rem', color: '#4F46E5' }}>Quick Links</h6>
            <ul className="list-unstyled mb-0" style={{ fontSize: '0.95em' }}>
              <li><a href="/" className="text-decoration-none" style={{ color: '#6366F1' }}>Home</a></li>
              <li><a href="/about" className="text-decoration-none" style={{ color: '#6366F1' }}>About Us</a></li>
              <li><a href="/contact" className="text-decoration-none" style={{ color: '#6366F1' }}>Contact</a></li>
              <li><a href="/privacy-policy" className="text-decoration-none" style={{ color: '#6366F1' }}>Privacy Policy</a></li>
            </ul>
          </div>
          {/* Services Column */}
          <div className="col-12 col-md-2 mb-2 mb-md-0">
            <h6 className="fw-bold mb-1" style={{ fontSize: '1.1rem', color: '#4F46E5' }}>Services</h6>
            <ul className="list-unstyled mb-0" style={{ fontSize: '0.95em' }}>
              <li><a href="/" className="text-decoration-none" style={{ color: '#6366F1' }}>PG Rooms</a></li>
              <li><a href="/" className="text-decoration-none" style={{ color: '#6366F1' }}>Tiffin Service</a></li>
              <li><a href="/" className="text-decoration-none" style={{ color: '#6366F1' }}>Maid Service</a></li>
              {userRole === 'owner' && (
                <li><a href="/owner-dashboard" className="text-decoration-none" style={{ color: '#6366F1' }}>Owner Dashboard</a></li>
              )}
              {userRole === 'maid' && (
                <li><a href="/maid-dashboard" className="text-decoration-none" style={{ color: '#6366F1' }}>Maid Dashboard</a></li>
              )}
              {userRole === 'tiffin' && (
                <li><a href="/tiffin-dashboard" className="text-decoration-none" style={{ color: '#6366F1' }}>Tiffin Dashboard</a></li>
              )}
            </ul>
          </div>
          {/* Social Media Column */}
          <div className="col-6 col-md-2 mb-2 mb-md-0">
            <h6 className="fw-bold mb-1" style={{ fontSize: '1.1rem', color: '#4F46E5' }}>Connect</h6>
            <div className="mb-1" style={{ fontSize: '0.95em', color: '#6366F1' }}>Follow us:</div>
            <div>
              {socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fs-5 me-3"
                  aria-label={link.label}
                  style={{ color: '#6366F1', verticalAlign: 'middle' }}
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </div>
          {/* Feedback Button Column */}
          <div className="col-6 col-md-2 text-md-end text-center">
            <button
              className="btn btn-outline-primary btn-sm"
              style={{ fontSize: '0.95em', borderColor: '#6366F1', color: '#6366F1' }}
              onClick={() => setShowFeedback(true)}
            >
              Feedback
            </button>
          </div>
        </div>
        <hr className="border-secondary my-2" />
        <div className="text-center" style={{ fontSize: '0.85rem', color: '#6366F1' }}>
          &copy; {new Date().getFullYear()} PGVaale. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
