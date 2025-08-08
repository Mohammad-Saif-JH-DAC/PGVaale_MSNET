import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import PGRooms from './pages/PGRooms';
import RoomDetails from './pages/RoomDetails';
import OwnerDashboard from './pages/OwnerDashboard';
import Chat from './pages/Chat';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import TiffinDashboard from './pages/TiffinDashboard';
import MaidDashboard from './pages/MaidDashboard';
import MaidHiring from './pages/MaidHiring';
import TiffinHiring from './pages/TiffinHiring';
import AboutUs from './pages/AboutUs';
import Footer from './Footer';
import PrivacyPolicy from './components/PrivacyPolicy';

// Helper to decode JWT and get user role
function getUserRole() {
  const token = sessionStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role) return payload.role.replace('ROLE_', '').toLowerCase();
    if (payload.authorities && payload.authorities.length > 0) return payload.authorities[0].authority.replace('ROLE_', '').toLowerCase();
  } catch {}
  return null;
}

// Logout function
function handleLogout(navigate) {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userRole');
  navigate('/');
}

// PrivateRoute component
function PrivateRoute({ element, allowedRoles }) {
  const role = getUserRole();
  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return element;
}

// Navigation component with logout functionality
function Navigation() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const userRole = getUserRole();

  // Custom styles for navigation items
  const navLinkStyle = {
    color: '#4B5563',
    fontWeight: '500',
    padding: '0.4rem 0.8rem',
    borderRadius: '0.5rem',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    margin: '0 0.25rem',
    backgroundColor: 'transparent',
    transform: 'translateY(0)',
    boxShadow: 'none',
    fontSize: '0.875rem'
  };

  const navLinkHoverStyle = {
    backgroundColor: '#E0E7FF',
    color: '#4F46E5',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
  };

  const logoutButtonStyle = {
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    padding: '0.4rem 1.2rem',
    borderRadius: '0.5rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    margin: '0 0.25rem',
    transform: 'translateY(0)',
    boxShadow: 'none',
    fontSize: '0.875rem'
  };

  const logoutButtonHoverStyle = {
    backgroundColor: '#DC2626',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
  };

  // Helper functions for hover effects
  const handleMouseEnter = (e, hoverStyle) => {
    Object.assign(e.target.style, hoverStyle);
  };

  const handleMouseLeave = (e, defaultStyle) => {
    Object.assign(e.target.style, defaultStyle);
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ background: 'linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%)', boxShadow: '0 2px 12px rgba(44,62,80,0.07)', borderRadius: '0 0 1.5rem 1.5rem', marginBottom: 12 }}>
      <div className="container-fluid" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        <Link className="navbar-brand fw-bold" to="/" style={{ color: '#4F46E5', fontSize: '2rem', letterSpacing: '1px' }}>
          <i className="fas fa-home me-2" style={{ color: '#6366F1' }}></i>PGVaale
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                         {/* Home - Accessible to all */}
             <li className="nav-item">
               <Link 
                 to="/" 
                 style={navLinkStyle}
                 onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                 onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
               >
                 Home
               </Link>
             </li>

                         {/* PG Rooms - Accessible to users and visitors */}
                         {(userRole === 'user' || !token) && (
               <li className="nav-item">
                 <Link 
                   to="/pgrooms" 
                   style={navLinkStyle}
                   onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                   onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                 >
                   PG Rooms
                 </Link>
               </li>
             )}
             
             {/* Contact Us - Accessible to all */}
             <li className="nav-item">
               <Link 
                 to="/contact" 
                 style={navLinkStyle}
                 onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                 onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
               >
                 Contact Us
               </Link>
             </li>
             
             {/* About Us - Accessible to all */}
             <li className="nav-item">
               <Link 
                 to="/about" 
                 style={navLinkStyle}
                 onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                 onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
               >
                 About Us
               </Link>
             </li>
            
             
             
                           {/* Hire Maid - Only for users */}
              {userRole === 'user' && (
                <li className="nav-item">
                  <Link 
                    to="/maid-hiring" 
                    style={navLinkStyle}
                    onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                    onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                  >
                    Hire Maid
                  </Link>
                </li>
              )}
              
              {/* Hire Tiffin - Only for users */}
              {userRole === 'user' && (
                <li className="nav-item">
                  <Link 
                    to="/tiffin-hiring" 
                    style={navLinkStyle}
                    onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                    onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                  >
                    Hire Tiffin
                  </Link>
                </li>
              )}
             
             {/* Register - Only for non-logged in users */}
             {!token && (
               <li className="nav-item">
                 <Link 
                   to="/register" 
                   style={navLinkStyle}
                   onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                   onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                 >
                   Register
                 </Link>
               </li>
             )}
             
             {/* Admin Dashboard - Only for admin */}
             {token && userRole === 'admin' && (
               <li className="nav-item">
                 <Link 
                   to="/admin" 
                   style={navLinkStyle}
                   onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                   onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                 >
                   Admin Dashboard
                 </Link>
               </li>
             )}
             
             {/* Owner Dashboard - Only for owners */}
             {token && userRole === 'owner' && (
               <li className="nav-item">
                 <Link 
                   to="/owner-dashboard" 
                   style={navLinkStyle}
                   onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                   onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                 >
                   Owner Dashboard
                 </Link>
               </li>
             )}
             
             {/* User Dashboard and PG Booking - Only for users */}
             {token && userRole === 'user' && (
               <>
                 <li className="nav-item">
                   <Link 
                     to="/user-dashboard" 
                     style={navLinkStyle}
                     onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                     onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                   >
                     Dashboard
                   </Link>
                 </li>
                 <li className="nav-item">
                   <Link 
                     to="/user-dashboard/pgs" 
                     style={navLinkStyle}
                     onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                     onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                   >
                     PG Booking
                   </Link>
                 </li>
               </>
             )}
             
             {/* Tiffin Dashboard - Only for tiffin providers */}
             {token && userRole === 'tiffin' && (
               <li className="nav-item">
                 <Link 
                   to="/tiffin-dashboard" 
                   style={navLinkStyle}
                   onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                   onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                 >
                   Tiffin Dashboard
                 </Link>
               </li>
             )}
             
             {/* Maid Dashboard - Only for maids */}
             {token && userRole === 'maid' && (
               <>
                 <li className="nav-item">
                   <Link 
                     to="/maid-dashboard" 
                     style={navLinkStyle}
                     onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                     onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                   >
                     Dashboard
                   </Link>
                 </li>
                 <li className="nav-item">
                   <Link 
                     to="/maid-dashboard/profile" 
                     style={navLinkStyle}
                     onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                     onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                   >
                     Profile
                   </Link>
                 </li>
                 <li className="nav-item">
                   <Link 
                     to="/maid-dashboard/requests" 
                     style={navLinkStyle}
                     onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                     onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                   >
                     Service Requests
                   </Link>
                 </li>
               </>
             )}
             
             {/* Group Chat - Only for users and admins */}
             {token && (userRole === 'user' || userRole === 'admin') && (
               <li className="nav-item">
                 <Link 
                   to="/chat" 
                   style={navLinkStyle}
                   onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                   onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                 >
                   Group Chat
                 </Link>
               </li>
             )}
             
             {/* Login/Logout buttons */}
             {token ? (
               <li className="nav-item">
                 <button 
                   onClick={() => handleLogout(navigate)}
                   style={logoutButtonStyle}
                   onMouseEnter={(e) => handleMouseEnter(e, logoutButtonHoverStyle)}
                   onMouseLeave={(e) => handleMouseLeave(e, logoutButtonStyle)}
                 >
                   Logout
                 </button>
               </li>
             ) : (
               <li className="nav-item">
                 <Link 
                   to="/login" 
                   style={navLinkStyle}
                   onMouseEnter={(e) => handleMouseEnter(e, navLinkHoverStyle)}
                   onMouseLeave={(e) => handleMouseLeave(e, navLinkStyle)}
                 >
                   Login
                 </Link>
               </li>
             )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navigation />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/register/*" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/pgrooms" element={<PGRooms />} />
            <Route path="/pgrooms/:id" element={<RoomDetails />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user-dashboard/*" element={<UserDashboard />} />
            <Route path="/tiffin-dashboard/*" element={<TiffinDashboard />} />
            <Route path="/maid-dashboard/*" element={<MaidDashboard />} />
                         <Route path="/maid-hiring" element={<MaidHiring />} />
             <Route path="/tiffin-hiring" element={<TiffinHiring />} />
             <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
