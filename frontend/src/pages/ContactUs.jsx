import React, { useState } from 'react';

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
      const response = await fetch('http://localhost:8081/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setSuccess('✅ Thank you! Your message has been submitted.');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setSuccess('❌ Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSuccess('❌ Server error occurred. Try again later.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2>Contact Us</h2>
      <p className="text-muted">
        Got a question, complaint, or suggestion? Let us know below.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Mobile Number *</label>
          <input
            type="tel"
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Your Message *</label>
          <textarea
            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
            name="message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message here..."
          ></textarea>
          {errors.message && <div className="invalid-feedback">{errors.message}</div>}
        </div>

        {success && (
          <div className={`alert mt-2 ${success.startsWith('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
            {success}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

export default ContactUs;

