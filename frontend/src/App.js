import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
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

// PrivateRoute component
function PrivateRoute({ element, allowedRoles }) {
  const role = getUserRole();
  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return element;
}

function App() {
  const token = localStorage.getItem('token');
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">PGVaale</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/pgrooms">PG Rooms</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">ContactUs</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/owner-dashboard">Owner Dashboard</Link>
              </li>
              {token && (
                <li className="nav-item">
                  <Link className="nav-link" to="/chat">Group Chat</Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </ul>
          </div>
    </div>
      </nav>
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
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/tiffin-dashboard" element={<TiffinDashboard />} />
        <Route path="/maid-dashboard" element={<MaidDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
