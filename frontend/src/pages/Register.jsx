import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Register() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <div className="container">
        {/* <div className="mb-3">
  <Link className="btn btn-outline-primary m-1" to="/register/user">User</Link>
  <Link className="btn btn-outline-success m-1" to="/register/owner">Room Owner</Link>
  <Link className="btn btn-outline-warning m-1" to="/register/tiffin">Tiffin Service</Link>
  <Link className="btn btn-outline-info m-1" to="/register/maid">Maid Service</Link>
</div> */}

        <Routes>
          <Route index element={<Navigate to="user" />} />
          <Route path=":role" element={<RegisterForm />} />
          <Route path="*" element={<div className="text-danger">Invalid route</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default Register;
