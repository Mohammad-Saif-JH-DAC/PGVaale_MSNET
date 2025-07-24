import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const allowedRoles = ['user', 'owner', 'tiffin', 'maid'];

function RegisterForm() {
  const { role } = useParams();
  const navigate = useNavigate();

  // Initial state for form fields
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    address: '', // For users and owners
    contactNumber: '', // For all roles
    serviceArea: '', // For tiffin and maid services
    experience: '', // For tiffin and maid services
    availability: '', // For tiffin and maid services
    roomDetails: '', // For room owners
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!allowedRoles.includes(role)) {
      navigate('/register/user'); // redirect to default role
      return;
    }
    setForm({
      username: '',
      email: '',
      password: '',
      address: '',
      contactNumber: '',
      serviceArea: '',
      experience: '',
      availability: '',
      roomDetails: '',
    });
    setError('');
    setSuccess('');
  }, [role, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post(`/auth/register/${role}`, form);
      setSuccess('Registration successful!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="card p-4 mt-3" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h4>Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h4>
      <form onSubmit={handleSubmit}>
        {/* Common fields */}
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
        <div className="mb-3">
          <label className="form-label">Contact Number</label>
          <input type="tel" className="form-control" name="contactNumber" value={form.contactNumber} onChange={handleChange} required />
        </div>

        {/* Role-specific fields */}
        {role === 'user' && (
          <>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input type="text" className="form-control" name="address" value={form.address} onChange={handleChange} required />
            </div>
          </>
        )}

        {role === 'owner' && (
          <>
            <div className="mb-3">
              <label className="form-label">Room Details</label>
              <textarea className="form-control" name="roomDetails" value={form.roomDetails} onChange={handleChange} rows="3" required />
            </div>
          </>
        )}

        {['tiffin', 'maid'].includes(role) && (
          <>
            <div className="mb-3">
              <label className="form-label">Service Area</label>
              <input type="text" className="form-control" name="serviceArea" value={form.serviceArea} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Experience (Years)</label>
              <input type="number" className="form-control" name="experience" value={form.experience} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Availability</label>
              <input type="text" className="form-control" name="availability" placeholder="E.g., Mon-Fri, 9 AM - 6 PM" value={form.availability} onChange={handleChange} required />
            </div>
          </>
        )}

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm;