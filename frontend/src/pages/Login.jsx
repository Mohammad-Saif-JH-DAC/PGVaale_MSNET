import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Clear any existing token before login
      localStorage.removeItem('token');

      // Log the request payload
      console.log('Sending login request:', form);

      // Determine the correct endpoint based on role
      const endpoint = `http://localhost:8081/api/${form.role}/login`;

      // Send the login request to the role-specific endpoint
      const res = await axios.post(endpoint, {
        username: form.username,
        password: form.password
      });

      console.log('Login response:', res.data);

      const token = res.data.token;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', form.role); // Store role for future use
        setTimeout(() => {
          // Clear token after 1 hour
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          console.log('Token cleared after 1 hour');
        }, 60*60*1000);

        // Decode JWT to get role
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT Payload:', payload);

        // Get role from token
        let userRole = '';
        if (payload.role) {
          userRole = payload.role.replace('ROLE_', '').toLowerCase();
        } else if (payload.authorities && payload.authorities.length > 0) {
          userRole = payload.authorities[0].authority.replace('ROLE_', '').toLowerCase();
        }

        console.log('User role:', userRole);

        // Redirect based on role
        if (userRole === 'admin') navigate('/admin');
        else if (userRole === 'owner') navigate('/owner-dashboard');
        else if (userRole === 'user') navigate('/user-dashboard');
        else if (userRole === 'tiffin') navigate('/tiffin-dashboard');
        else if (userRole === 'maid') navigate('/maid-dashboard');
        else navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);

      let errorMessage = 'Login failed. Please try again.';

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (err.response.status === 403) {
          errorMessage = 'Access denied. Please try again.';
        } else if (err.response.status >= 500) {
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
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input 
            type="text" 
            className="form-control" 
            name="username" 
            value={form.username} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            name="password" 
            value={form.password} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select 
            className="form-select" 
            name="role" 
            value={form.role} 
            onChange={handleChange} 
            required
            disabled={loading}
          >
            {roles.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button 
          type="submit" 
          className="btn btn-primary w-100" 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;