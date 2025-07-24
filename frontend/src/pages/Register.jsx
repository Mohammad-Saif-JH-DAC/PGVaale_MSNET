import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import RegisterForm from './RegisterForm';

function Register() {
  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <div className="mb-3">
        <Link className="btn btn-outline-primary m-1" to="user">User</Link>
        <Link className="btn btn-outline-success m-1" to="owner">Room Owner</Link>
        <Link className="btn btn-outline-warning m-1" to="tiffin">Tiffin Service</Link>
        <Link className="btn btn-outline-info m-1" to="maid">Maid Service</Link>
      </div>
      <Routes>
        <Route path=":role" element={<RegisterForm />} />
      </Routes>
    </div>
  );
}

export default Register; 