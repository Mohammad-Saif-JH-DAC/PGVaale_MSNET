import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { toast } from 'react-toastify'; // ✅ Added

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
  { label: 'Owner', value: 'owner' },
  { label: 'Tiffin', value: 'tiffin' },
  { label: 'Maid', value: 'maid' },
];

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Redirect to appropriate dashboard if already logged in
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('Invalid JWT token format');
          throw new Error('Invalid token format');
        }
        
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('JWT Payload:', payload);
        
        let userRole = '';
        if (payload.role) {
          userRole = payload.role.replace('ROLE_', '').toLowerCase();
        } else if (payload.authorities && payload.authorities.length > 0) {
          userRole = payload.authorities[0].authority.replace('ROLE_', '').toLowerCase();
        } else {
          // Fallback to stored userRole
          userRole = sessionStorage.getItem('userRole') || 'user';
        }

        // Redirect to role-specific dashboard
        if (userRole === 'admin') navigate('/admin');
        else if (userRole === 'owner') navigate('/owner-dashboard');
        else if (userRole === 'user') navigate('/user-dashboard');
        else if (userRole === 'tiffin') navigate('/tiffin-dashboard');
        else if (userRole === 'maid') navigate('/maid-dashboard');
        else navigate('/');
      } catch (e) {
        console.error('Invalid token:', e);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userRole');
      }
    }
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      sessionStorage.removeItem('token');

      const res = await authApi.post(`/api/${form.role}/login`, {
        username: form.username,
        password: form.password
      });

      console.log('Login response:', res.data);
      const token = res.data.token;
      if (token) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userRole', form.role);

        // ✅ Toast on success
        toast.success('Login successful!');

        setTimeout(() => {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('userRole');
          console.log('Token cleared after 1 hour');
        }, 60 * 60 * 1000);

        // Parse JWT token payload with error handling
        let userRole = '';
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) {
            console.error('Invalid JWT token format');
            throw new Error('Invalid token format');
          }
          
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('JWT Payload:', payload);
          
          if (payload.role) {
            userRole = payload.role.replace('ROLE_', '').toLowerCase();
          } else if (payload.authorities && payload.authorities.length > 0) {
            userRole = payload.authorities[0].authority.replace('ROLE_', '').toLowerCase();
          } else {
            // Fallback to the role from the form
            userRole = form.role;
          }
        } catch (parseError) {
          console.error('Error parsing JWT token:', parseError);
          // Fallback to the role from the form
          userRole = form.role;
        }

        if (userRole === 'admin') navigate('/admin');
        else if (userRole === 'owner') navigate('/owner-dashboard');
        else if (userRole === 'user') navigate('/user-dashboard');
        else if (userRole === 'tiffin') navigate('/tiffin-dashboard');
        else if (userRole === 'maid') navigate('/maid-dashboard');
        else navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);

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

      // ✅ Toast on error
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            {/* Header Section */}
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold mb-3" style={{ color: '#2C3E50' }}>
                Welcome Back to <span className="text-primary">PGVaale</span>
              </h1>
              <p className="text-muted mb-0">
                Sign in to access your account and continue your journey
              </p>
            </div>

            {/* Login Form Card */}
            <div className="card border-0 shadow-lg rounded-4" style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)' 
            }}>
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="icon-circle bg-primary text-white mx-auto mb-3" style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <i className="fas fa-sign-in-alt fs-4"></i>
                  </div>
                  <h3 className="fw-bold mb-2" style={{ color: '#2C3E50' }}>Sign In</h3>
                  <p className="text-muted mb-0">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold d-flex align-items-center" style={{ color: '#374151' }}>
                      <i className="fas fa-user text-primary me-2"></i>Username
                    </label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg border-0 shadow-sm rounded-3" 
                      name="username" 
                      value={form.username} 
                      onChange={handleChange} 
                      required 
                      disabled={loading}
                      placeholder="Enter your username"
                      style={{ background: '#f8fafc' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold d-flex align-items-center" style={{ color: '#374151' }}>
                      <i className="fas fa-lock text-primary me-2"></i>Password
                    </label>
                    <input 
                      type="password" 
                      className="form-control form-control-lg border-0 shadow-sm rounded-3" 
                      name="password" 
                      value={form.password} 
                      onChange={handleChange} 
                      required 
                      disabled={loading}
                      placeholder="Enter your password"
                      style={{ background: '#f8fafc' }}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold d-flex align-items-center" style={{ color: '#374151' }}>
                      <i className="fas fa-users text-primary me-2"></i>Role
                    </label>
                    <select 
                      className="form-select form-select-lg border-0 shadow-sm rounded-3" 
                      name="role" 
                      value={form.role} 
                      onChange={handleChange} 
                      required
                      disabled={loading}
                      style={{ background: '#f8fafc' }}
                    >
                      {roles.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="alert alert-danger border-0 rounded-3 shadow-sm mb-4" style={{ 
                      background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                      border: '1px solid #f87171'
                    }}>
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="d-grid mb-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg rounded-3 shadow-sm" 
                      disabled={loading}
                      style={{ 
                        background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', 
                        border: 'none',
                        padding: '0.75rem 1.5rem'
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      Don't have an account?{' '}
                      <a href="/register" className="text-decoration-none fw-semibold" style={{ color: '#4F46E5' }}>
                        Sign Up
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                <i className="fas fa-shield-alt me-1"></i>
                Your data is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .form-control:focus, .form-select:focus {
          border-color: #6366F1;
          box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.25);
          background: #ffffff !important;
        }
        
        .form-control::placeholder {
          color: #9ca3af;
        }
        
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4) !important;
        }
        
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default Login;

