import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
  { label: 'Owner', value: 'owner' },
  { label: 'Tiffin', value: 'tiffin' },
  { label: 'Maid', value: 'maid' },
];

function Login() {
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = e => {
    setForm({ ...form, role: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('http://localhost:8081/api/auth/login', {
        username: form.username,
        password: form.password,
      });
      const token = res.data.token;
      localStorage.setItem('token', token);
      // Decode JWT to get role
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = (payload.role || payload.authorities?.[0]?.authority || '').replace('ROLE_', '').toLowerCase();
      // Redirect based on role
      if (role === 'admin') navigate('/admin');
      else if (role === 'owner') navigate('/owner-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials or not authorized');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select className="form-select" name="role" value={form.role} onChange={handleRoleChange} required>
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default Login; 