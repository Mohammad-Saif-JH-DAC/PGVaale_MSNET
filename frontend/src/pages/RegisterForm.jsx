import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// Import the authApi instance that never sends auth tokens
import { authApi as api } from '../api';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaPhone, FaCalendarAlt, FaVenusMars, FaMapMarkerAlt, FaHome, FaMoneyBillWave, FaConciergeBell, FaClock, FaUtensils, FaBuilding, FaBed } from 'react-icons/fa';

const allowedRoles = ['user', 'owner', 'tiffin', 'maid'];
// Define the specific regions allowed
const allowedRegions = [
  'Mumbai',
  'Delhi',
  'Pune',
  'Bangalore',
  'Hyderabad'
];

function RegisterForm() {
  const { role } = useParams();
  const navigate = useNavigate();

  // --- Updated useState initialization for form ---
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    aadhaar: '',
    mobileNumber: '', // Only one mobile number field for all roles
    age: '',
    gender: '',
    address: '',
    // contactNumber: '',
    serviceArea: '',
    experience: '',
    availability: '',
    roomDetails: '',
    region: '', // Will be a dropdown
    // phoneNumber: '', // REMOVE this line
    services: '',
    monthlySalary: '',
    // --- Modified for timing ---
    startTime: '',
    endTime: '',
    // --- End modification ---
    price: '',
    foodCategory: '',
    maidAddress: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!allowedRoles.includes(role)) {
      navigate('/register/user'); // Redirect to default role if invalid
      return;
    }
    // --- Updated useEffect reset object ---
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
      region: '', // Reset region
      
      services: '',
      monthlySalary: '',
      // --- Modified for timing reset ---
      startTime: '',
      endTime: '',
      // --- End modification ---
      price: '',
      foodCategory: '',
      maidAddress: '',
    });
    // --- End update ---
    setFieldErrors({}); // Clear field errors on role change
    setError('');
    setSuccess('');
  }, [role, navigate]);

  // --- Updated regexValidators ---
  const regexValidators = {
    // Name: Only letters and spaces, minimum 6 characters
    name: /^[a-zA-Z ]{6,}$/,
    // Username: 1st char uppercase, 1 special char, 1 number, min 6 chars
    username: /^(?=.*[!@#$%^&*?_\-])[A-Z](?=.*\d)[A-Za-z\d!@#$%^&*?_\-]{5,}$/,
    // Email: Must end with @gmail.com and have at least 3 letters before @
    email: /^(?=(?:.*[a-zA-Z]){3})[a-zA-Z0-9._%+-]+@gmail\.com$/,
    password: /^.{6,}$/,
    aadhaar: /^[0-9]{12}$/,
    // Mobile number: 10 digits, starting with 6, 7, 8, or 9
    mobileNumber: /^[6-9][0-9]{9}$/,
    age: /^(1[89]|[2-9][0-9]|100)$/,
    gender: /^(Male|Female|Other)$/,
    address: /^.{2,}$/,
    // contactNumber: /^[6-9][0-9]{9}$/, // Also updated contactNumber
    serviceArea: /^.{2,}$/,
    experience: /^\d+$/,
    availability: /^.{2,}$/,
    roomDetails: /^.{2,}$/,
    // region: No regex needed as it's a dropdown, validation will be different
    
    services: /^.{2,}$/,
    monthlySalary: /^\d+$/,
    // --- New/Updated validators for timing ---
    time: /^([01]\d|2[0-3]):([0-5]\d)$/, // Validates HH:MM format (24-hour)
    // --- End modification ---
    price: /^\d+$/,
    foodCategory: /^(Veg|Non-Veg)$/,
    maidAddress: /^.*$/,
  };

  // --- Updated errorMessages ---
  const errorMessages = {
    // Updated error message for name
    name: 'Name must contain only letters and spaces (a-z, A-Z) and be at least 6 characters long.',
    // Updated error message for username
    username: 'Username must start with an uppercase letter, contain at least one special character (!@#$%^&*?_-), one number, and be at least 6 characters long.',
    // Updated error message for email
    email: 'Email must be a valid Gmail address (ending with @gmail.com) and contain at least 3 letters before @.',
    password: 'Password must be at least 6 characters.',
    aadhaar: 'Aadhaar must be 12 digits.',
    // Updated error messages for mobile numbers
    mobileNumber: 'Mobile number must be 10 digits and start with 6, 7, 8, or 9.',
    contactNumber: 'Contact number must be 10 digits and start with 6, 7, 8, or 9.',
   
    age: 'Age must be between 18 and 100.',
    gender: 'Please select a gender.',
    address: 'Address must be at least 2 characters.',
    serviceArea: 'Service area must be at least 2 characters.',
    experience: 'Experience must be a number.',
    availability: 'Availability must be at least 2 characters.',
    roomDetails: 'Room details must be at least 2 characters.',
    // Specific validation for region dropdown
    region: 'Please select a region from the list.',
    services: 'Services must be at least 2 characters.',
    monthlySalary: 'Monthly salary must be a number.',
    // --- Updated/Added error messages for timing ---
    time: 'Please select a valid time (HH:MM).',
    // --- End modification ---
    price: 'Price must be a number.',
    foodCategory: 'Please select a food category.',
    maidAddress: '',
  };

  // --- Updated validateField to handle new time fields and region dropdown ---
  const validateField = (name, value) => {
    // Handle the new time fields
    if (name === 'startTime' || name === 'endTime') {
      if (value === '') return 'Please select a time.';
      if (!regexValidators.time.test(value)) return errorMessages.time;
      // Optional: Add logic to check if start is before end
      // This would require access to the other time value, so it's better handled on submit or via useEffect
      return '';
    }
    // Handle region dropdown validation
    if (name === 'region') {
        // Check if the selected value is one of the allowed regions
        if (!allowedRegions.includes(value)) {
            return errorMessages.region;
        }
        return ''; // Valid if it's in the allowed list
    }
    // Existing validation logic for other fields
    if (!regexValidators[name]) return '';
    if (value === '' && name !== 'maidAddress') return errorMessages[name];
    if (!regexValidators[name].test(value)) return errorMessages[name];
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [name]: validateField(name, value)
    }));
  };

  // --- Updated handleSubmit to handle time combination and validation ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // --- Add Timing Validation Logic ---
    let timingError = '';
    if (role === 'maid') { // Only validate timing for maids
        if (!form.startTime || !form.endTime) {
            timingError = 'Please select both start and end times.';
        } else if (form.startTime >= form.endTime) { // Simple string comparison works for HH:MM
            timingError = 'End time must be after start time.';
        }
        if (timingError) {
            setFieldErrors(prev => ({ ...prev, startTime: timingError, endTime: timingError })); // Set error on both for display
            setLoading(false);
            return; // Stop submission if timing is invalid
        }
    }
    // --- End Timing Validation Logic ---

    // Clear any existing token before registration
    localStorage.removeItem('token');

    // Prepare data for submission, including combined timing for maid
    let dataToSubmit;
    if (role === 'maid' || role === 'tiffin') {
        dataToSubmit = {
            ...form,
            phoneNumber: form.mobileNumber, // Map mobileNumber to phoneNumber for backend
        };
        if (role === 'maid') {
            dataToSubmit.timing = `${form.startTime} - ${form.endTime}`;
        }
        // Optionally remove mobileNumber if backend does not expect it
        // delete dataToSubmit.mobileNumber;
    } else {
        dataToSubmit = form;
    }

    try {
      console.log('Submitting registration for role:', role);
      console.log('Form data being sent:', dataToSubmit);
      // Use the correct endpoint for tiffin, others remain as before
      let endpoint;
      if (role === 'tiffin') {
        endpoint = '/api/tiffin/register';
      } else {
        endpoint = `/api/${role}/register`;
      }
      const response = await api.post(endpoint, dataToSubmit); // Send potentially modified data
      console.log('Registration response:', response.data);
      setSuccess('Registration successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response); // Log the full response for debugging
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data || 'Invalid input data';
        } else if (err.response.status === 403) {
          errorMessage = 'Access denied. Please try again.'; // Could be auth issue
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = err.response.data || errorMessage; // Use backend message if available
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  // Helper functions for UI
  const getRoleIcon = (roleType) => {
    switch (roleType) {
      case 'user': return <FaUser className="me-2" />;
      case 'owner': return <FaBuilding className="me-2" />;
      case 'tiffin': return <FaUtensils className="me-2" />;
      case 'maid': return <FaConciergeBell className="me-2" />;
      default: return <FaUser className="me-2" />;
    }
  };

  const getRoleTitle = (roleType) => {
    switch (roleType) {
      case 'user': return 'Tenant';
      case 'owner': return 'PG Owner';
      case 'tiffin': return 'Tiffin Service';
      case 'maid': return 'Maid Service';
      default: return 'User';
    }
  };

  const getBackgroundImage = () => {
    switch (role) {
      case 'user': return 'url("/image/tenent1.png")';
      case 'owner': return 'url("/image/owner.jpg")';
      case 'tiffin': return 'url("/image/tiffin1.jpg")';
      case 'maid': return 'url("/image/maid.jpg")';
      default: return 'url("/images/default-bg.jpg")';
    }
  };

  return (
    // Apply background to the entire page container
    <div
      className="min-vh-100 w-100"
      style={{
        backgroundImage: getBackgroundImage(),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      <div className="container">
        {/* Section Tabs Above the Form */}
        <div className="row justify-content-center mb-4">
          <div className="col-12">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {allowedRoles.map((roleType) => (
                <Link
                  key={roleType}
                  to={`/register/${roleType}`}
                  className={`btn px-4 py-3 rounded-pill fw-bold text-decoration-none ${
                    role === roleType
                      ? 'text-white'
                      : 'text-dark bg-light bg-opacity-75'
                  }`}
                  style={{
                    backgroundColor: role === roleType ? '#2C3E50' : 'rgba(255, 255, 255, 0.7)',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    minWidth: '150px' // Ensures consistent button width
                  }}
                >
                  <div className="d-flex flex-column align-items-center">
                    <div className="fs-4 mb-1">
                      {getRoleIcon(roleType)}
                    </div>
                    <span>{getRoleTitle(roleType)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-transparent text-white py-4">
                {/* Gradient Header with Icon */}
                <div className="text-center" style={{ background: 'linear-gradient(135deg, #2C3E50 0%, #1ABC9C 100%)' }}>
                  <div className="icon-circle bg-white text-primary mx-auto mb-3" style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getRoleIcon(role)}
                  </div>
                  <h3 className="mb-0 fw-bold">Register as {getRoleTitle(role)}</h3>
                  <p className="mb-0 opacity-75">Create your account to get started</p>
                </div>
              </div>
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  {/* Common fields */}
                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center">
                      <FaUser className="me-2 text-primary" /> Full Name *
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm rounded-3 ${fieldErrors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Enter your full name"
                    />
                    {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center">
                      <FaUser className="me-2 text-primary" /> Username *
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm rounded-3 ${fieldErrors.username ? 'is-invalid' : ''}`}
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Choose a username"
                    />
                    {fieldErrors.username && <div className="invalid-feedback">{fieldErrors.username}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center">
                      <FaEnvelope className="me-2 text-primary" /> Email Address *
                    </label>
                    <input
                      type="email"
                      className={`form-control form-control-sm rounded-3 ${fieldErrors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Enter your Gmail address"
                    />
                    {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center">
                      <FaLock className="me-2 text-primary" /> Password *
                    </label>
                    <input
                      type="password"
                      className={`form-control form-control-sm rounded-3 ${fieldErrors.password ? 'is-invalid' : ''}`}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Create a password"
                      minLength="6"
                    />
                    {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
                  </div>

                  {/* Combined Aadhaar and Mobile Number Row */}
                  <div className="row g-2">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label d-flex align-items-center">
                          <FaIdCard className="me-2 text-primary" /> Aadhaar Number *
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-sm rounded-3 ${fieldErrors.aadhaar ? 'is-invalid' : ''}`}
                          name="aadhaar"
                          value={form.aadhaar}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Enter 12-digit Aadhaar number"
                          pattern="[0-9]{12}"
                          maxLength="12"
                        />
                        {fieldErrors.aadhaar && <div className="invalid-feedback">{fieldErrors.aadhaar}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label d-flex align-items-center">
                          <FaPhone className="me-2 text-primary" /> Mobile Number *
                        </label>
                        <input
                          type="tel"
                          className={`form-control form-control-sm rounded-3 ${fieldErrors.mobileNumber ? 'is-invalid' : ''}`}
                          name="mobileNumber"
                          value={form.mobileNumber}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Enter 10-digit mobile number"
                          pattern="[6-9][0-9]{9}"
                          maxLength="10"
                        />
                        {fieldErrors.mobileNumber && <div className="invalid-feedback">{fieldErrors.mobileNumber}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Role-specific fields */}
                  {(role === 'user' || role === 'owner') && (
                    <>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label d-flex align-items-center">
                              <FaCalendarAlt className="me-2 text-primary" /> Age *
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-sm rounded-3 ${fieldErrors.age ? 'is-invalid' : ''}`}
                              name="age"
                              value={form.age}
                              onChange={handleChange}
                              disabled={loading}
                              placeholder="Enter your age"
                            />
                            {fieldErrors.age && <div className="invalid-feedback">{fieldErrors.age}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label d-flex align-items-center">
                              <FaVenusMars className="me-2 text-primary" /> Gender *
                            </label>
                            <select
                              className={`form-select form-select-sm rounded-3 ${fieldErrors.gender ? 'is-invalid' : ''}`}
                              name="gender"
                              value={form.gender}
                              onChange={handleChange}
                              disabled={loading}
                            >
                              <option value="">Select gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                            {fieldErrors.gender && <div className="invalid-feedback">{fieldErrors.gender}</div>}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {role === 'owner' && (
                    <>
                      {/* --- Updated Region Dropdown for Owner --- */}
                      <div className="mb-3">
                        <label className="form-label d-flex align-items-center">
                          <FaMapMarkerAlt className="me-2 text-primary" /> Region *
                        </label>
                        <select
                          className={`form-select form-select-sm rounded-3 ${fieldErrors.region ? 'is-invalid' : ''}`}
                          name="region"
                          value={form.region}
                          onChange={handleChange}
                          disabled={loading}
                        >
                          <option value="">Select Region</option>
                          {allowedRegions.map(regionOption => (
                            <option key={regionOption} value={regionOption}>
                              {regionOption}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.region && <div className="invalid-feedback">{fieldErrors.region}</div>}
                      </div>
                      {/* --- End Region Dropdown --- */}
                    </>
                  )}

                  {/* --- Updated maid section with time pickers --- */}
                  {role === 'maid' && (
                    <>
                     

                      <div className="mb-3">
                        <label className="form-label d-flex align-items-center">
                          <FaConciergeBell className="me-2 text-primary" /> Services *
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-sm rounded-3 ${fieldErrors.services ? 'is-invalid' : ''}`}
                          name="services"
                          value={form.services}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="E.g., Mopping, Cooking, Cleaning"
                        />
                        {fieldErrors.services && <div className="invalid-feedback">{fieldErrors.services}</div>}
                      </div>

                      <div className="row g-2">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label d-flex align-items-center">
                              <FaMoneyBillWave className="me-2 text-primary" /> Monthly Salary *
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-sm rounded-3 ${fieldErrors.monthlySalary ? 'is-invalid' : ''}`}
                              name="monthlySalary"
                              value={form.monthlySalary}
                              onChange={handleChange}
                              disabled={loading}
                              placeholder="Enter monthly salary"
                            />
                            {fieldErrors.monthlySalary && <div className="invalid-feedback">{fieldErrors.monthlySalary}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label d-flex align-items-center">
                              <FaVenusMars className="me-2 text-primary" /> Gender *
                            </label>
                            <select
                              className={`form-select form-select-sm rounded-3 ${fieldErrors.gender ? 'is-invalid' : ''}`}
                              name="gender"
                              value={form.gender}
                              onChange={handleChange}
                              disabled={loading}
                            >
                              <option value="">Select gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                            {fieldErrors.gender && <div className="invalid-feedback">{fieldErrors.gender}</div>}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        {/* --- Modified Timing Section --- */}
                        <label className="form-label d-flex align-items-center">
                          <FaClock className="me-2 text-primary" /> Working Timing *
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="time"
                            className={`form-control form-control-sm me-2 ${fieldErrors.startTime ? 'is-invalid' : ''}`}
                            name="startTime"
                            value={form.startTime}
                            onChange={handleChange}
                            disabled={loading}
                          />
                          <span className="mx-2">to</span>
                          <input
                            type="time"
                            className={`form-control form-control-sm ms-2 ${fieldErrors.endTime ? 'is-invalid' : ''}`}
                            name="endTime"
                            value={form.endTime}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </div>
                        {/* Display errors for startTime or endTime if needed */}
                        {(fieldErrors.startTime || fieldErrors.endTime) && (
                          <div className="invalid-feedback d-block">
                            {fieldErrors.startTime || fieldErrors.endTime}
                          </div>
                        )}
                        {/* --- End modification --- */}
                      </div>

                      {/* --- Updated Region Dropdown for Maid --- */}
                      <div className="mb-3">
                        <label className="form-label d-flex align-items-center">
                          <FaMapMarkerAlt className="me-2 text-primary" /> Region *
                        </label>
                        <select
                          className={`form-select form-select-sm rounded-3 ${fieldErrors.region ? 'is-invalid' : ''}`}
                          name="region"
                          value={form.region}
                          onChange={handleChange}
                          disabled={loading}
                        >
                          <option value="">Select Region</option>
                          {allowedRegions.map(regionOption => (
                            <option key={regionOption} value={regionOption}>
                              {regionOption}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.region && <div className="invalid-feedback">{fieldErrors.region}</div>}
                      </div>
                      {/* --- End Region Dropdown --- */}
                    </>
                  )}
                  {/* --- End update --- */}

                  {role === 'tiffin' && (
                    <>
                      

                      <div className="row g-2">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label d-flex align-items-center">
                              <FaMoneyBillWave className="me-2 text-primary" /> Price per Meal *
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-sm rounded-3 ${fieldErrors.price ? 'is-invalid' : ''}`}
                              name="price"
                              value={form.price}
                              onChange={handleChange}
                              disabled={loading}
                              placeholder="Enter price"
                            />
                            {fieldErrors.price && <div className="invalid-feedback">{fieldErrors.price}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label d-flex align-items-center">
                              <FaUtensils className="me-2 text-primary" /> Food Category *
                            </label>
                            <select
                              className={`form-select form-control-sm rounded-3 ${fieldErrors.foodCategory ? 'is-invalid' : ''}`}
                              name="foodCategory"
                              value={form.foodCategory}
                              onChange={handleChange}
                              disabled={loading}
                            >
                              <option value="">Select category</option>
                              <option value="Veg">Vegetarian</option>
                              <option value="Non-Veg">Non-Vegetarian</option>
                            </select>
                            {fieldErrors.foodCategory && <div className="invalid-feedback">{fieldErrors.foodCategory}</div>}
                          </div>
                        </div>
                      </div>

                      {/* --- Updated Region Dropdown for Tiffin --- */}
                      <div className="mb-3">
                        <label className="form-label d-flex align-items-center">
                          <FaMapMarkerAlt className="me-2 text-primary" /> Region *
                        </label>
                        <select
                          className={`form-select form-control-sm rounded-3 ${fieldErrors.region ? 'is-invalid' : ''}`}
                          name="region"
                          value={form.region}
                          onChange={handleChange}
                          disabled={loading}
                        >
                          <option value="">Select Region</option>
                          {allowedRegions.map(regionOption => (
                            <option key={regionOption} value={regionOption}>
                              {regionOption}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.region && <div className="invalid-feedback">{fieldErrors.region}</div>}
                      </div>
                      {/* --- End Region Dropdown --- */}

                      <div className="mb-3">
                        <label className="form-label d-flex align-items-center">
                          <FaHome className="me-2 text-primary" /> Maid's Address
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-sm rounded-3 ${fieldErrors.maidAddress ? 'is-invalid' : ''}`}
                          name="maidAddress"
                          value={form.maidAddress}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Enter maid's address (optional)"
                        />
                        {fieldErrors.maidAddress && <div className="invalid-feedback">{fieldErrors.maidAddress}</div>}
                      </div>
                    </>
                  )}

                  {/* Error and Success Messages */}
                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show rounded-3" role="alert">
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                  )}
                  {success && (
                    <div className="alert alert-success alert-dismissible fade show rounded-3" role="alert">
                      {success}
                      <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                    </div>
                  )}

                  {/* Submit Button and Sign In Link */}
                  <div className="d-grid gap-3 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm rounded-3 py-2"
                      disabled={loading}
                      style={{ background: 'linear-gradient(135deg, #2C3E50 0%, #1ABC9C 100%)', border: 'none' }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Registering...
                        </>
                      ) : (
                        `Register as ${getRoleTitle(role)}`
                      )}
                    </button>

                    <div className="text-center mt-3">
                      <p className="mb-0 text-muted">
                        Already have an account?{' '}
                        <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#F1C40F' }}>
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Styles for Focus and Active States */}
      <style jsx>{`
        .bg-gradient {
          background: linear-gradient(135deg, #2C3E50 0%, #1ABC9C 100%);
        }
        .form-control:focus, .form-select:focus {
          border-color: #F1C40F; /* Warm Gold focus border */
          box-shadow: 0 0 0 0.25rem rgba(241, 196, 15, 0.25); /* Warm Gold glow */
        }
        .btn-check:checked + .btn, .btn.active, .btn.show, .btn:first-child:active, :not(.btn-check) + .btn:active {
          background-color: #2C3E50; /* Navy Blue active state */
          border-color: #2C3E50; /* Navy Blue active border */
        }
      `}</style>
    </div>
  );
}

export default RegisterForm;