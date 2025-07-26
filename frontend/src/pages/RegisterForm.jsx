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
    name: '',
    aadhaar: '',
    mobileNumber: '',
    age: '',
    gender: '',
    address: '',
    contactNumber: '',
    serviceArea: '',
    experience: '',
    availability: '',
    roomDetails: '',
    // Role-specific fields
    region: '',
    phoneNumber: '',
    services: '',
    monthlySalary: '',
    timing: '',
    price: '',
    foodCategory: '',
    maidAddress: '',
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
      name: '',
      aadhaar: '',
      mobileNumber: '',
      age: '',
      gender: '',
      address: '',
      contactNumber: '',
      serviceArea: '',
      experience: '',
      availability: '',
      roomDetails: '',
      region: '',
      phoneNumber: '',
      services: '',
      monthlySalary: '',
      timing: '',
      price: '',
      foodCategory: '',
      maidAddress: '',
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
      
      // Use role-specific endpoint
      const response = await api.post(`/${role}/register`, form);
      console.log('Registration response:', response.data);
      
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
                  <label className="form-label">Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                    disabled={loading}
                    placeholder="Enter full name"
                  />
                </div>

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
                  <label className="form-label">Aadhaar Number *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="aadhaar" 
                    value={form.aadhaar} 
                    onChange={handleChange} 
                    required 
                    disabled={loading}
                    placeholder="Enter 12-digit Aadhaar number"
                    pattern="[0-9]{12}"
                    maxLength="12"
                  />
                </div>

                {/* Role-specific fields */}
                {role === 'user' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Mobile Number *</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        name="mobileNumber" 
                        value={form.mobileNumber} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        placeholder="Enter 10-digit mobile number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Age *</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="age" 
                        value={form.age} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        min="18"
                        max="100"
                        placeholder="Enter age"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Gender *</label>
                      <select 
                        className="form-select" 
                        name="gender" 
                        value={form.gender} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </>
                )}

                {role === 'owner' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Mobile Number *</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        name="mobileNumber" 
                        value={form.mobileNumber} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        placeholder="Enter 10-digit mobile number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Age *</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="age" 
                        value={form.age} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        min="18"
                        max="100"
                        placeholder="Enter age"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Region *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="region" 
                        value={form.region} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        placeholder="Enter region/city"
                      />
                    </div>
                  </>
                )}

                {role === 'maid' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Phone Number *</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        name="phoneNumber" 
                        value={form.phoneNumber} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        placeholder="Enter 10-digit phone number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Services *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="services" 
                        value={form.services} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        placeholder="E.g., Mopping, Cooking, Cleaning"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Monthly Salary *</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="monthlySalary" 
                        value={form.monthlySalary} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        min="0"
                        placeholder="Enter monthly salary"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Gender *</label>
                      <select 
                        className="form-select" 
                        name="gender" 
                        value={form.gender} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Working Timing *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="timing" 
                        value={form.timing} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        placeholder="E.g., 9 AM - 6 PM"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Region *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="region" 
                        value={form.region} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        placeholder="Enter region/city"
                      />
                    </div>
                  </>
                )}

                {role === 'tiffin' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Phone Number *</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        name="phoneNumber" 
                        value={form.phoneNumber} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        placeholder="Enter 10-digit phone number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Price *</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="price" 
                        value={form.price} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        min="0"
                        placeholder="Enter price per meal"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Food Category *</label>
                      <select 
                        className="form-select" 
                        name="foodCategory" 
                        value={form.foodCategory} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                      >
                        <option value="">Select food category</option>
                        <option value="Veg">Vegetarian</option>
                        <option value="Non-Veg">Non-Vegetarian</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Region *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="region" 
                        value={form.region} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                        placeholder="Enter region/city"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Maid's Address</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="maidAddress" 
                        value={form.maidAddress} 
                        onChange={handleChange} 
                        disabled={loading}
                        placeholder="Enter maid's address (optional)"
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