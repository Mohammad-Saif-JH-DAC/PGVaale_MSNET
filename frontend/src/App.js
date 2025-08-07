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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">PGVaale</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {userRole !== 'owner' && (
  <li className="nav-item">
    <Link className="nav-link" to="/pgrooms">PG Rooms</Link>
  </li>
)}
            {userRole === 'user' && (
  <li className="nav-item">
    <Link className="nav-link" to="/maid-hiring">Hire Maid</Link>
  </li>
)}
            {!token && (
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/contact">ContactUs</Link>
            </li>
            {token && userRole === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Dashboard</Link>
              </li>
            )}
            {token && userRole === 'owner' && (
              <li className="nav-item">
                <Link className="nav-link" to="/owner-dashboard">Owner Dashboard</Link>
              </li>
            )}
            {token && userRole === 'user' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/user-dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user-dashboard/pgs">PG Interests</Link>
                </li>
               
               
              </>
            )}
            {token && userRole === 'tiffin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/tiffin-dashboard">Tiffin Dashboard</Link>
              </li>
            )}
            {token && userRole === 'maid' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/maid-dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/maid-dashboard/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/maid-dashboard/requests">Service Requests</Link>
                </li>
              </>
            )}
            {token && userRole !== 'owner' && (
              <li className="nav-item">
                <Link className="nav-link" to="/chat">Group Chat</Link>
              </li>
            )}
            {token ? (
              <li className="nav-item">
                <button 
                  className="btn btn-outline-danger" 
                  onClick={() => handleLogout(navigate)}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
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
