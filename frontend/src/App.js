import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import PGRooms from './pages/PGRooms';
import RoomDetails from './pages/RoomDetails';
import OwnerDashboard from './pages/OwnerDashboard';
import Chat from './pages/Chat';

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
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/owner-dashboard">Owner Dashboard</Link>
              </li>
              {token && (
                <li className="nav-item">
                  <Link className="nav-link" to="/chat">Group Chat</Link>
                </li>
              )}
            </ul>
          </div>
    </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/*" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/pgrooms" element={<PGRooms />} />
        <Route path="/pgrooms/:id" element={<RoomDetails />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
