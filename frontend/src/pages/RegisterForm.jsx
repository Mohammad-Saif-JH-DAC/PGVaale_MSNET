import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function RegisterForm() {
  const { role } = useParams();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post(`/auth/register/${role}`, form);
      setSuccess('Registration successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="card p-4 mt-3" style={{maxWidth: 400, margin: '0 auto'}}>
      <h4>Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm; 