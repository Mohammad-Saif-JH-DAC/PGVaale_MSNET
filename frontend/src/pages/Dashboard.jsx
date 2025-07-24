import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let role = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role || payload.authorities?.[0]?.authority || '';
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <h2>User Dashboard</h2>
      <p><b>Role:</b> {role}</p>
      <p><b>JWT:</b> <code style={{wordBreak:'break-all'}}>{token}</code></p>
      <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard; 