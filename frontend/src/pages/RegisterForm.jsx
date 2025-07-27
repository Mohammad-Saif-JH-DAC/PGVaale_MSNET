import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import the authApi instance that never sends auth tokens
import { authApi as api } from '../api'; // Changed this line

const allowedRoles = ['user', 'owner', 'tiffin', 'maid'];

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
      navigate('/register/user');
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
      region: '',
      phoneNumber: '',
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
    // Name: Only letters, minimum 10 characters
    name: /^[a-zA-Z]{6,}$/,
    // Username: 1st char uppercase, 1 special char, 1 number, min 6 chars
    username: /^(?=.*[!@#$%^&*?_\-])[A-Z](?=.*\d)[A-Za-z\d!@#$%^&*?_\-]{5,}$/,
    // Email: Must end with @gmail.com and have at least 3 letters before @
    email: /^(?=(?:.*[a-zA-Z]){3})[a-zA-Z0-9._%+-]+@gmail\.com$/,
    password: /^.{6,}$/,
    aadhaar: /^[0-9]{12}$/,
    mobileNumber: /^[0-9]{10}$/,
    age: /^(1[89]|[2-9][0-9]|100)$/,
    gender: /^(Male|Female|Other)$/,
    address: /^.{2,}$/,
    contactNumber: /^[0-9]{10}$/,
    serviceArea: /^.{2,}$/,
    experience: /^\d+$/,
    availability: /^.{2,}$/,
    roomDetails: /^.{2,}$/,
    region: /^.{2,}$/,
    phoneNumber: /^[0-9]{10}$/,
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
    name: 'Name must contain only letters (a-z, A-Z) and be at least 6 characters long.',
    // Updated error message for username
    username: 'Username must start with an uppercase letter, contain at least one special character (!@#$%^&*?_-), one number, and be at least 6 characters long.',
    // Updated error message for email
    email: 'Email must be a valid Gmail address (ending with @gmail.com) and contain at least 3 letters before @.',
    password: 'Password must be at least 6 characters.',
    aadhaar: 'Aadhaar must be 12 digits.',
    mobileNumber: 'Mobile number must be 10 digits.',
    age: 'Age must be between 18 and 100.',
    gender: 'Please select a gender.',
    address: 'Address must be at least 2 characters.',
    contactNumber: 'Contact number must be 10 digits.',
    serviceArea: 'Service area must be at least 2 characters.',
    experience: 'Experience must be a number.',
    availability: 'Availability must be at least 2 characters.',
    roomDetails: 'Room details must be at least 2 characters.',
    region: 'Region must be at least 2 characters.',
    phoneNumber: 'Phone number must be 10 digits.',
    services: 'Services must be at least 2 characters.',
    monthlySalary: 'Monthly salary must be a number.',
    // --- Updated/Added error messages for timing ---
    time: 'Please select a valid time (HH:MM).',
    // --- End modification ---
    price: 'Price must be a number.',
    foodCategory: 'Please select a food category.',
    maidAddress: '',
  };

  // --- Updated validateField to handle new time fields ---
  const validateField = (name, value) => {
    // Handle the new time fields
    if (name === 'startTime' || name === 'endTime') {
      if (value === '') return 'Please select a time.';
      if (!regexValidators.time.test(value)) return errorMessages.time;
      // Optional: Add logic to check if start is before end
      // This would require access to the other time value, so it's better handled on submit or via useEffect
      return '';
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
    if (role === 'maid') {
        dataToSubmit = {
            ...form,
            // Combine startTime and endTime into the 'timing' field
            timing: `${form.startTime} - ${form.endTime}`
        };
        // Optionally remove temporary fields if backend doesn't expect them
        // delete dataToSubmit.startTime;
        // delete dataToSubmit.endTime;
    } else {
         dataToSubmit = form;
    }


    try {
      console.log('Submitting registration for role:', role);
      console.log('Form data being sent:', dataToSubmit);
      // Use role-specific endpoint
      const response = await api.post(`/${role}/register`, dataToSubmit); // Send potentially modified data
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
                    disabled={loading}
                    placeholder="Enter full name"
                  />
                  {fieldErrors.name && <div className="text-danger small">{fieldErrors.name}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Username *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter username"
                  />
                  {fieldErrors.username && <div className="text-danger small">{fieldErrors.username}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter email"
                  />
                  {fieldErrors.email && <div className="text-danger small">{fieldErrors.email}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter password"
                    minLength="6"
                  />
                  {fieldErrors.password && <div className="text-danger small">{fieldErrors.password}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Aadhaar Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="aadhaar"
                    value={form.aadhaar}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter 12-digit Aadhaar number"
                    pattern="[0-9]{12}"
                    maxLength="12"
                  />
                  {fieldErrors.aadhaar && <div className="text-danger small">{fieldErrors.aadhaar}</div>}
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
                        disabled={loading}
                        placeholder="Enter 10-digit mobile number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                      />
                      {fieldErrors.mobileNumber && <div className="text-danger small">{fieldErrors.mobileNumber}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Age *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter age"
                      />
                      {fieldErrors.age && <div className="text-danger small">{fieldErrors.age}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Gender *</label>
                      <select
                        className="form-select"
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
                      {fieldErrors.gender && <div className="text-danger small">{fieldErrors.gender}</div>}
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
                        disabled={loading}
                        placeholder="Enter 10-digit mobile number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                      />
                      {fieldErrors.mobileNumber && <div className="text-danger small">{fieldErrors.mobileNumber}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Age *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter age"
                      />
                      {fieldErrors.age && <div className="text-danger small">{fieldErrors.age}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Region *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="region"
                        value={form.region}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter region/city"
                      />
                      {fieldErrors.region && <div className="text-danger small">{fieldErrors.region}</div>}
                    </div>
                  </>
                )}
                {/* --- Updated maid section with time pickers --- */}
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
                        disabled={loading}
                        placeholder="Enter 10-digit phone number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                      />
                      {fieldErrors.phoneNumber && <div className="text-danger small">{fieldErrors.phoneNumber}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Services *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="services"
                        value={form.services}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="E.g., Mopping, Cooking, Cleaning"
                      />
                      {fieldErrors.services && <div className="text-danger small">{fieldErrors.services}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Monthly Salary *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="monthlySalary"
                        value={form.monthlySalary}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter monthly salary"
                      />
                      {fieldErrors.monthlySalary && <div className="text-danger small">{fieldErrors.monthlySalary}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Gender *</label>
                      <select
                        className="form-select"
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
                      {fieldErrors.gender && <div className="text-danger small">{fieldErrors.gender}</div>}
                    </div>
                    <div className="mb-3">
                      {/* --- Modified Timing Section --- */}
                      <label className="form-label">Working Timing *</label>
                      <div className="d-flex align-items-center">
                        <input
                          type="time"
                          className={`form-control me-2 ${fieldErrors.startTime ? 'is-invalid' : ''}`}
                          name="startTime"
                          value={form.startTime}
                          onChange={handleChange}
                          disabled={loading}
                        />
                        <span className="mx-2">to</span>
                        <input
                          type="time"
                          className={`form-control ms-2 ${fieldErrors.endTime ? 'is-invalid' : ''}`}
                          name="endTime"
                          value={form.endTime}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                      {/* Display errors for startTime or endTime if needed */}
                      {(fieldErrors.startTime || fieldErrors.endTime) && (
                        <div className="text-danger small">
                          {fieldErrors.startTime || fieldErrors.endTime}
                        </div>
                      )}
                      {/* --- End modification --- */}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Region *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="region"
                        value={form.region}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter region/city"
                      />
                      {fieldErrors.region && <div className="text-danger small">{fieldErrors.region}</div>}
                    </div>
                  </>
                )}
                {/* --- End update --- */}
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
                        disabled={loading}
                        placeholder="Enter 10-digit phone number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                      />
                      {fieldErrors.phoneNumber && <div className="text-danger small">{fieldErrors.phoneNumber}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter price per meal"
                      />
                      {fieldErrors.price && <div className="text-danger small">{fieldErrors.price}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Food Category *</label>
                      <select
                        className="form-select"
                        name="foodCategory"
                        value={form.foodCategory}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="">Select food category</option>
                        <option value="Veg">Vegetarian</option>
                        <option value="Non-Veg">Non-Vegetarian</option>
                      </select>
                      {fieldErrors.foodCategory && <div className="text-danger small">{fieldErrors.foodCategory}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Region *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="region"
                        value={form.region}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter region/city"
                      />
                      {fieldErrors.region && <div className="text-danger small">{fieldErrors.region}</div>}
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
                      {fieldErrors.maidAddress && <div className="text-danger small">{fieldErrors.maidAddress}</div>}
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