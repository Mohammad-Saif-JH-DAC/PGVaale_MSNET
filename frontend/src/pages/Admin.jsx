import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [pending, setPending] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/pending-service-providers')
      .then(res => setPending(res.data))
      .catch(() => setError('Failed to load pending service providers'));
  }, []);

  const handleAction = (id, action) => {
    api.post(`/admin/${action}/${id}`)
      .then(() => setPending(pending.filter(u => u.id !== id)))
      .catch(() => setError('Action failed'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <button className="btn btn-danger mb-3" onClick={handleLogout}>Logout</button>
      <h4>Pending Service Providers</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pending.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn btn-success btn-sm me-2" onClick={() => handleAction(u.id, 'approve')}>Approve</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleAction(u.id, 'reject')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin; 