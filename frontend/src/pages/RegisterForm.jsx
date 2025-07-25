import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import the authApi instance that never sends auth tokens
import { authApi as api } from '../api'; // Changed this line

const allowedRoles = ['user', 'owner', 'tiffin', 'maid'];

function RegisterForm() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!allowedRoles.includes(role)) {
      navigate('/register/user');
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
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Clear any existing token before registration
    localStorage.removeItem('token');
    
    try {
      console.log('Submitting registration for role:', role);
      console.log('Form data being sent:', form);
      
      // Use the authApi instance that never sends auth tokens
      const response = await api.post(`/auth/register/${role}`, form);
      console.log('Registration response:', response.data); // Now we're using the response
      
      setSuccess('Registration successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data || 'Invalid input data';
        } else if (err.response.status === 403) {
          errorMessage = 'Access denied. Please try again.';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = err.response.data || errorMessage;
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Register as {role?.charAt(0).toUpperCase() + role?.slice(1) || 'User'}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Common fields */}
                <div className="mb-3">
                  <label className="form-label">Username *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="username" 
                    value={form.username} 
                    onChange={handleChange} 
                    required 
                    disabled={loading}
                    placeholder="Enter username"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    required 
                    disabled={loading}
                    placeholder="Enter email"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Password *</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    required 
                    disabled={loading}
                    placeholder="Enter password"
                    minLength="6"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Contact Number *</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    name="contactNumber" 
                    value={form.contactNumber} 
                    onChange={handleChange} 
                    required 
                    disabled={loading}
                    placeholder="Enter contact number"
                  />
                </div>

                {/* Role-specific fields */}
                {role === 'user' && (
                  <div className="mb-3">
                    <label className="form-label">Address *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="address" 
                      value={form.address} 
                      onChange={handleChange} 
                      required 
                      disabled={loading}
                      placeholder="Enter your address"
                    />
                  </div>
                )}

                {role === 'owner' && (
                  <div className="mb-3">
                    <label className="form-label">Room Details *</label>
                    <textarea 
                      className="form-control" 
                      name="roomDetails" 
                      value={form.roomDetails} 
                      onChange={handleChange} 
                      rows="4" 
                      required 
                      disabled={loading}
                      placeholder="Describe your room facilities, location, pricing, etc."
                    />
                  </div>
                )}

                {['tiffin', 'maid'].includes(role) && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Service Area *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="serviceArea" 
                        value={form.serviceArea} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        placeholder="Enter service area (e.g., City Name, Locality)"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Experience (Years) *</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="experience" 
                        value={form.experience} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        min="0"
                        placeholder="Enter years of experience"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Availability *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="availability" 
                        value={form.availability} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        placeholder="E.g., Mon-Fri, 9 AM - 6 PM"
                      />
                    </div>
                  </>
                )}

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                  </div>
                )}
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : (
                      'Register'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;