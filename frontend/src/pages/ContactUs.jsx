import React, { useState } from 'react';
import './ContactUs.css';
import Toast from '../utils/Toast'; 

const bannerImage = process.env.PUBLIC_URL + '/image/ContactUsBG.png';



function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z ]{2,30}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!nameRegex.test(form.name)) {
      newErrors.name = 'Name must be 2–30 characters long (letters & spaces only).';
    }
    if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!phoneRegex.test(form.phone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
    }
    if (!form.message || form.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('http://localhost:8081/api/contactUs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        Toast.success('✅ Thank you! Your message has been submitted.');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        Toast.error('❌ Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contactUs:', error);
      Toast.error('❌ Server error occurred. Try again later.');
    }
  };

  return (
  <div className="contact-page">
    <div className="banner"
    style={{
          backgroundImage: `url(${bannerImage})`,
        }}
    >
            <h1>We would love to hear from you!</h1>

    </div>
  

    <div className="form-section container">
      <div className="contact-form-box">
        <form onSubmit={handleSubmit} noValidate>
          <h2 className="mb-3">📩 Fill Your Queries</h2>

          <div className="mb-3">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Mansi Kamble"
            />
            {errors.name && <div className="invalid-contactUs">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g., mansi111@example.com"
            />
            {errors.email && <div className="invalid-contactUs">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number *</label>
            <input
              type="tel"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g., 9876543210"
            />
            {errors.phone && <div className="invalid-contactUs">{errors.phone}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Message *</label>
            <textarea
              className={`form-control ${errors.message ? 'is-invalid' : ''}`}
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us what’s on your mind..."
            ></textarea>
            {errors.message && <div className="invalid-contactUs">{errors.message}</div>}
          </div>

          {/*{success && (
            <div className={`alert mt-2 ${success.startsWith('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
              {success}
            </div>
          )}
          */}
          <button type="submit" className="btn btn-danger w-100">Submit</button>
        </form>
      </div>

      <div className="contact-side-boxes">
        <div className="side-box">
          <h5>🏠 Want to list your PG?</h5>
          <p>We help you connect with verified users.</p>
          <a href="/register/owner">List Now</a>
        </div>
       <div className="side-box p-3 rounded shadow-sm" style={{ background: '#f8fafc' }}>
  <h5 className="mb-3">📩 Contact Us</h5>
<p>Your trusted partner for finding the right connections.</p>

  {/* Phone */}
  <p className="mb-1">
    <i className="bi bi-telephone-fill me-2" style={{ color: '#2C3E50' }}></i>
    +91 98765 43210
  </p>

  {/* Email */}
  <p className="mb-3">
    <i className="bi bi-envelope-fill me-2" style={{ color: '#2C3E50' }}></i>
support@pgvaale.com  </p>
</div>


        {/* <div className="side-box">
          <h5>⚠️ Report Safety Concern</h5>
          <p>Your safety is our priority. Let us know if you faced any issue.</p>
          <a href="/report-safety">Report Here</a>
        </div> */}
      </div>
    </div>
  </div>
);

}

export default ContactUs;

